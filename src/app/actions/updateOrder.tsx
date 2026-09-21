"use server";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { revalidatePath } from "next/cache";

export async function updateOrder(SK: string) {
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
    const docClient = DynamoDBDocumentClient.from(dynamoClient);

    const key = {
        PK: "Order|Purchased",
        SK: SK
    };

    const existing = await docClient.send(new GetCommand({
        TableName: table_name,
        Key: key
    }));

    if (!existing.Item) {
        throw new Error(`No outstanding order found for ${SK}`);
    }

    // The shipped copy is written before the purchased one is removed. Failing midway
    // leaves the order listed in both places, which the next attempt cleans up; doing
    // it the other way round loses the order entirely.
    await docClient.send(new PutCommand({
        TableName: table_name,
        Item: {
            ...existing.Item,
            PK: "Order|Shipped"
        }
    }));

    await docClient.send(new DeleteCommand({
        TableName: table_name,
        Key: key
    }));

    console.log("Shipped order", SK);
    revalidatePath('/mom');
}