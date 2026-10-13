"use server";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { asAdmin, FriendlyError } from "./adminAuth";
import type { AdminResult, Painting } from "./adminTypes";

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

export async function listPaintings(idToken: string): Promise<AdminResult<Painting[]>> {
    return asAdmin(idToken, "loading the paintings", async () => {
        const data = await getDocClient().send(new QueryCommand({
            TableName: process.env.DYNAMO_TABLE,
            KeyConditionExpression: "#pk = :pk and begins_with(#sk, :sk)",
            ExpressionAttributeNames: {
                "#pk": "PK",
                "#sk": "SK",
                "#title": "title",
                "#image": "image",
                "#size": "size",
                "#collection": "collection",
                "#createdAt": "createdAt",
                "#isPurchased": "isPurchased"
            },
            ExpressionAttributeValues: {
                ":pk": "Product|Active",
                ":sk": "Pid|"
            },
            ProjectionExpression: "#sk, #title, #image, #size, #collection, #createdAt, #isPurchased"
        }));

        const paintings: Painting[] = (data.Items ?? []).map(item => ({
            pid: item.SK,
            title: item.title,
            image: item.image,
            size: item.size,
            collection: item.collection,
            createdAt: item.createdAt,
            sold: Boolean(item.isPurchased)
        }));

        return paintings.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    });
}

// For originals sold outside the site. Online sales are marked by the payment webhook.
export async function setPaintingSold(idToken: string, pid: string, sold: boolean): Promise<AdminResult<{ sold: boolean }>> {
    return asAdmin(idToken, sold ? "marking the painting as sold" : "putting the painting back in the shop", async (adminEmail) => {
        if (typeof pid !== "string" || !pid.startsWith("Pid|")) {
            throw new FriendlyError("This painting couldn't be found. Please reload the page and try again.");
        }

        try {
            await getDocClient().send(new UpdateCommand({
                TableName: process.env.DYNAMO_TABLE,
                Key: { PK: "Product|Active", SK: pid },
                UpdateExpression: "SET #isPurchased = :sold",
                ConditionExpression: "attribute_exists(#sk)",
                ExpressionAttributeNames: {
                    "#isPurchased": "isPurchased",
                    "#sk": "SK"
                },
                ExpressionAttributeValues: {
                    ":sold": sold ? 1 : 0
                }
            }));
        } catch (err) {
            if ((err as Error).name === "ConditionalCheckFailedException") {
                throw new FriendlyError("This painting couldn't be found. Please reload the page and try again.");
            }
            throw err;
        }

        console.log(adminEmail, sold ? "marked sold" : "marked for sale", pid);
        return { sold };
    });
}
