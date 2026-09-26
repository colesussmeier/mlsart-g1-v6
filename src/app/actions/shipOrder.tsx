"use server";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { asAdmin, FriendlyError } from "./adminAuth";
import type { AdminResult } from "./adminTypes";
import { checkTrackingLink } from "./trackingLink";
import { sendConfirmationEmail } from "./sendEmails";

export async function shipOrder(
    idToken: string,
    orderId: string,
    trackingLink: string
): Promise<AdminResult<{ emailed: boolean }>> {
    return asAdmin(idToken, "shipping this order", async () => {
        const tracking = checkTrackingLink(trackingLink);
        if (!tracking.ok) {
            throw new FriendlyError(tracking.error);
        }

        const table_name = process.env.DYNAMO_TABLE;
        const dynamoClient = new DynamoDBClient({
            region: "us-east-1",
            credentials: {
                accessKeyId: process.env.PUBLIC_AWS_KEY as string,
                secretAccessKey: process.env.PRIVATE_AWS_KEY as string
            }
        });
        const docClient = DynamoDBDocumentClient.from(dynamoClient);

        const key = {
            PK: "Order|Purchased",
            SK: orderId
        };

        const existing = await docClient.send(new GetCommand({
            TableName: table_name,
            Key: key
        }));

        if (!existing.Item) {
            const shipped = await docClient.send(new GetCommand({
                TableName: table_name,
                Key: { PK: "Order|Shipped", SK: orderId }
            }));
            throw new FriendlyError(shipped.Item
                ? "This order was already marked as shipped. Click \"Check for new orders\" to see the latest list."
                : "This order couldn't be found. Click \"Check for new orders\" to see the latest list.");
        }

        // The shipped copy is written before the purchased one is removed. Failing midway
        // leaves the order listed in both places, which the next attempt cleans up; doing
        // it the other way round loses the order entirely.
        await docClient.send(new PutCommand({
            TableName: table_name,
            Item: {
                ...existing.Item,
                PK: "Order|Shipped",
                trackingLink: tracking.link,
                shippedAt: new Date().toISOString()
            }
        }));

        await docClient.send(new DeleteCommand({
            TableName: table_name,
            Key: key
        }));

        console.log("Shipped order", orderId);

        // The order is shipped either way at this point, so an email failure is reported
        // rather than thrown, and retrying cannot email the customer twice.
        const email = orderId.split("|")[0];
        try {
            const result = await sendConfirmationEmail(email, tracking.link);
            if (result instanceof Error) {
                console.error("Shipping email to", email, "was rejected", result);
                return { emailed: false };
            }
        } catch (err) {
            console.error("Shipping email to", email, "failed", err);
            return { emailed: false };
        }
        return { emailed: true };
    });
}
