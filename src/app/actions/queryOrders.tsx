"use server";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { asAdmin } from "./adminAuth";
import type { AdminResult, OrderItem, OutstandingOrder } from "./adminTypes";

function getDocClient() {
    const dynamoClient = new DynamoDBClient({
        region: "us-east-1",
        credentials: {
            accessKeyId: process.env.PUBLIC_AWS_KEY as string,
            secretAccessKey: process.env.PRIVATE_AWS_KEY as string
        }
    });
    return DynamoDBDocumentClient.from(dynamoClient);
}

export async function queryOrders(idToken: string): Promise<AdminResult<OutstandingOrder[]>> {
    return asAdmin(idToken, "loading the orders", async () => {
        const table_name = process.env.DYNAMO_TABLE;
        const docClient = getDocClient();

        const data = await docClient.send(new QueryCommand({
            TableName: table_name,
            KeyConditionExpression: "#pk = :pk",
            ExpressionAttributeNames: {
                "#pk": "PK",
                "#sk": "SK",
                "#shipTo": "shipTo",
                "#address": "address",
                "#createdAt": "createdAt",
                "#total": "total",
                "#keys": "keys"
            },
            ExpressionAttributeValues: {
                ":pk": "Order|Purchased"
            },
            ProjectionExpression: "#sk, #shipTo, #address, #createdAt, #total, #keys"
        }));
        const rows = data.Items ?? [];

        const pids = Array.from(new Set(rows.flatMap(row => Object.keys(row.keys ?? {}))));
        const products = new Map(await Promise.all(pids.map(async (pid) => {
            const product = await docClient.send(new GetCommand({
                TableName: table_name,
                Key: { PK: "Product|Active", SK: pid },
                ExpressionAttributeNames: {
                    "#image": "image",
                    "#size": "size",
                    "#title": "title"
                },
                ProjectionExpression: "#image, #size, #title"
            }));
            return [pid, product.Item] as const;
        })));

        const orders: OutstandingOrder[] = rows.map(row => ({
            id: row.SK,
            email: row.SK.split("|")[0],
            shipTo: row.shipTo,
            address: row.address,
            total: Number(row.total),
            createdAt: row.createdAt,
            items: Object.entries(row.keys ?? {}).map(([pid, prints]): OrderItem => {
                const product = products.get(pid);
                return {
                    pid,
                    title: product?.title ?? null,
                    image: product?.image ?? null,
                    size: product?.size ?? null,
                    prints: Number(prints)
                };
            })
        }));

        return orders.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    });
}
