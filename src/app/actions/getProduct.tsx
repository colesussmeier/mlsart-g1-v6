"use server";

import {  DynamoDBClient, QueryCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { revalidateTag } from 'next/cache';

export async function getProduct(pid: string) {
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
        const data = await dynamoClient.send(new GetItemCommand({
            TableName: table_name as string,
            Key: {
                "PK": { S: "Product|Active" },
                "SK": { S: pid }
            },
            ProjectionExpression: "image, size, title"
        }));
        const convertedResult = data.Item ? unmarshall(data.Item) : null;
        revalidateTag('getProducts');
        return convertedResult;
    } catch (err) {
        console.error("Unable to get. Error:", JSON.stringify(err, null, 2));
    }
}