"use server";

import {  DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { revalidateTag } from 'next/cache';

export async function getProducts() {
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
            KeyConditionExpression: "#pk = :pk and begins_with(#sk, :sk)",
            ExpressionAttributeNames: {
                "#pk": "PK",
                "#sk": "SK",
                "#image": "image",
                "#collection": "collection",
                "#price": "price",
                "#createdAt": "createdAt",
                "#size": "size",
                "#title": "title",
                "#stripeId": "stripeId",
                "#isPurchased": "isPurchased"
            },
            ExpressionAttributeValues: {
                ":pk": { S: "Product|Active" },
                ":sk": { S: "Pid|" }
            },
            ProjectionExpression: "SK, #image, #collection, #price, #createdAt, #size, #title, #stripeId, #isPurchased"
        }));
        const convertedResult = data.Items ? data.Items.map(item => unmarshall(item)) : null;
        revalidateTag('queryProducts');
        return convertedResult;
    } catch (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        revalidateTag('queryProducts');
        throw err;
    }
};