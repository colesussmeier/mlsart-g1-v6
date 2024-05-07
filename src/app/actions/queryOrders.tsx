"use server";

import {  DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export async function queryOrders() {
    const access_key = process.env.PUBLIC_AWS_KEY;
    const secret_access_key = process.env.PRIVATE_AWS_KEY;
    const table_name = process.env.DYNAMO_TABLE;

    const dynamoClient = new DynamoDBClient({
        region: "us-east-1",
        credentials:{
            accessKeyId: access_key as string,
            secretAccessKey: secret_access_key as string
        }
    });
    
    try {
        const data = await dynamoClient.send(new QueryCommand({
            TableName: table_name as string,
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
                ":pk": { S: "Order|Purchased" }
            },
            ProjectionExpression: "#sk, #shipTo, #address, #createdAt, #total, #keys"
        }));
        const convertedResult = data.Items ? data.Items.map(item => unmarshall(item)) : null;
        return convertedResult;
    } catch (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        throw err;
    }
};