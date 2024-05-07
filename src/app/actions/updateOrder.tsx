"use server";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { revalidatePath } from "next/cache";

export async function updateOrder(SK: string) {
    const access_key = process.env.PUBLIC_AWS_KEY;
    const secret_access_key = process.env.PRIVATE_AWS_KEY;
    const table_name = process.env.DYNAMO_TABLE;

    const dynamoClient = new DynamoDBClient({
        credentials:{
            accessKeyId: access_key as string,
            secretAccessKey: secret_access_key as string
        }
    });
    const docClient = DynamoDBDocumentClient.from(dynamoClient);

    // Fetch the existing item
    const getParams = {
        TableName: table_name,
        Key: {
            PK: "Order|Purchased",
            SK: SK
        }
    };

    let item;

    try {
        const data = await docClient.send(new GetCommand(getParams));
        item = data.Item;
        console.log("Fetched order", item);
    } catch (err) {
        console.log("Error", err);
    }

    // Delete the existing item
    const deleteParams = {
        TableName: table_name,
        Key: {
            PK: "Order|Purchased",
            SK: SK
        }
    };

    try {
        await docClient.send(new DeleteCommand(deleteParams));
        console.log("Deleted order");
    } catch (err) {
        console.log("Error", err);
    }

    // Insert a new item with the stored details
    const putParams = {
        TableName: table_name,
        Item: {
            ...item,
            PK: "Order|Shipped"
        }
    };

    try {
        const data = await docClient.send(new PutCommand(putParams));
        console.log("Inserted order", data);
        revalidatePath('/mom');
    } catch (err) {
        console.log("Error", err);
    }
}