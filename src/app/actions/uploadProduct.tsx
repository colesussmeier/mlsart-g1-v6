"use server";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';

const BUCKET = "image-bucketa5861-dev";

const CONTENT_TYPES: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
};

const STRIPE_IDS: Record<number, string> = {
    185: 'price_1PEHdpJyYHbUmOahmDlbyBBC',
    165: 'price_1PEHeHJyYHbUmOahKZihfmm0',
    135: 'price_1POSZQJyYHbUmOah622LeniZ',
    250: 'price_1PWLKUJyYHbUmOahH6SxYVoZ',
};

export async function uploadProduct(formData: FormData) {
    const imageFile = formData.get('image') as File;
    const title = (formData.get('title') as string ?? '').trim();
    const size = (formData.get('size') as string ?? '').trim();
    const collection = (formData.get('collection') as string ?? '').trim();
    const price = Number(formData.get('price'));

    const access_key = process.env.PUBLIC_AWS_KEY;
    const secret_access_key = process.env.PRIVATE_AWS_KEY;
    const table_name = process.env.DYNAMO_TABLE;

    if (!imageFile || imageFile.size === 0) {
        throw new Error('No file uploaded');
    }
    if (!title) {
        throw new Error('Title is required');
    }
    if (!size) {
        throw new Error('Size is required');
    }
    if (collection !== 'Landscape' && collection !== 'Floral') {
        throw new Error(`Unrecognized collection: ${collection}`);
    }

    const stripeId = STRIPE_IDS[price];
    if (!stripeId) {
        throw new Error(`No Stripe price configured for $${price}`);
    }

    const extension = imageFile.name.split('.').pop()?.toLowerCase() ?? '';
    const contentType = CONTENT_TYPES[extension];
    if (!contentType) {
        throw new Error(`Unsupported image type: .${extension}`);
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

    // UPDATE DYNAMO TABLE
    const dynamoClient = new DynamoDBClient({
        region: "us-east-1",
        credentials:{
            accessKeyId: access_key as string,
            secretAccessKey: secret_access_key as string
        }
    });
    const docClient = DynamoDBDocumentClient.from(dynamoClient);

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

    return product;
};
