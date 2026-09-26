"use server";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import { asAdmin, FriendlyError } from "./adminAuth";
import type { AdminResult } from "./adminTypes";
import { COLLECTIONS, STRIPE_PRICE_IDS } from "./productOptions";

const BUCKET = "image-bucketa5861-dev";

const CONTENT_TYPES: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
};

export async function uploadProduct(idToken: string, formData: FormData): Promise<AdminResult<{ title: string }>> {
    return asAdmin(idToken, "adding the painting", async () => {
        const imageFile = formData.get('image') as File;
        const title = (formData.get('title') as string ?? '').trim();
        const size = (formData.get('size') as string ?? '').trim();
        const collection = (formData.get('collection') as string ?? '').trim();
        const price = Number(formData.get('price'));

        const access_key = process.env.PUBLIC_AWS_KEY;
        const secret_access_key = process.env.PRIVATE_AWS_KEY;
        const table_name = process.env.DYNAMO_TABLE;

        if (!imageFile || imageFile.size === 0) {
            throw new FriendlyError('Please choose a photo of the painting.');
        }
        if (!title) {
            throw new FriendlyError('Please give the painting a title.');
        }
        if (!size) {
            throw new FriendlyError('Please enter the size of the painting.');
        }
        if (!(COLLECTIONS as readonly string[]).includes(collection)) {
            throw new FriendlyError('Please pick a collection.');
        }

        const stripeId = STRIPE_PRICE_IDS[price];
        if (!stripeId) {
            throw new FriendlyError('Please pick a price.');
        }

        const extension = imageFile.name.split('.').pop()?.toLowerCase() ?? '';
        const contentType = CONTENT_TYPES[extension];
        if (!contentType) {
            throw new FriendlyError('That photo is in a format the shop can\'t use. Please choose a JPG or PNG photo.');
        }

        const dynamoClient = new DynamoDBClient({
            region: "us-east-1",
            credentials:{
                accessKeyId: access_key as string,
                secretAccessKey: secret_access_key as string
            }
        });
        const docClient = DynamoDBDocumentClient.from(dynamoClient);

        // Product pages are looked up by title and the image is stored under it, so a
        // second painting with the same title would hide the first and overwrite its photo.
        const existing = await docClient.send(new QueryCommand({
            TableName: table_name,
            KeyConditionExpression: "#pk = :pk",
            ExpressionAttributeNames: { "#pk": "PK", "#title": "title" },
            ExpressionAttributeValues: { ":pk": "Product|Active" },
            ProjectionExpression: "#title"
        }));
        const clash = existing.Items?.find(item => String(item.title ?? '').trim().toLowerCase() === title.toLowerCase());
        if (clash) {
            throw new FriendlyError(`There's already a painting called "${clash.title}" in the shop. Please give this one a different title.`);
        }

        // Mirrors the title only to keep the bucket browsable; consumers must read the
        // persisted image URL rather than rebuilding this key.
        const key = `${title.replace(/[\\/]/g, '-')}.${extension}`;

        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const s3Client = new S3Client({
            region: "us-east-1",
            credentials: {
              accessKeyId: access_key as string,
              secretAccessKey: secret_access_key as string
            }
          });

        await s3Client.send(new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: buffer,
            ContentType: contentType,
        }));

        const product = {
            PK: "Product|Active",
            SK: "Pid|" + uuidv4(),
            title: title,
            price: price,
            image: `https://${BUCKET}.s3.us-east-1.amazonaws.com/${encodeURIComponent(key)}`,
            size: size,
            collection: collection,
            stripeId: stripeId,
            createdAt: new Date().toISOString()
        };

        await docClient.send(new PutCommand({
            TableName: table_name,
            Item: product
        }));

        return { title };
    });
};
