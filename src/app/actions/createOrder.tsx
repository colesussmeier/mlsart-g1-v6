"use server";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

export async function createOrder(chargeDetails: any) {
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

    const parsedPids = typeof chargeDetails.pids === 'string' 
        ? JSON.parse(chargeDetails.pids) 
        : chargeDetails.pids;

    const order = {
        PK: "Order|Purchased",
        SK: chargeDetails.email + "|" + uuidv4(),
        shipTo: chargeDetails.shipTo,
        address: chargeDetails.address,
        total: chargeDetails.total,
        createdAt: new Date().toISOString(),
        keys: parsedPids
    };
    
    const params = {
        TableName: table_name,
        Item: order
    };
    
    try {
        const data = await docClient.send(new PutCommand(params));
        console.log("Success", data);
    } catch (err) {
        console.log("Error", err);
    }

    async function updateProducts(pid: string) {
        const updateParams = {
            TableName: table_name,
            Key: {
                PK: "Product|Active",
                SK: pid
            },
            UpdateExpression: "SET #isPurchased = :bool",
            ExpressionAttributeNames: {
                "#isPurchased": "isPurchased"
            },
            ExpressionAttributeValues: {
                ":bool": 1
            }
        };

        try {
            const data = await docClient.send(new UpdateCommand(updateParams));
            console.log("Updated product", data);
        } catch (err) {
            console.log("Error", err);
        }
    }

    // only update product if it is not a print
    Object.entries(parsedPids).forEach(([pid, value]) => {
        if (value === 0) {
            updateProducts(pid);
        }
    });
}