"use server";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';

export async function uploadProduct(formData: FormData) {
    //UPLOAD IMAGE TO S3
    const imageFile = formData.get('image') as File;

    if(!imageFile) {
        throw new Error('No file uploaded');
    }

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const s3Client = new S3Client({ region: "us-east-1" });
    const uploadParams = {
        Bucket: "image-bucketa5861-dev",
        Key: imageFile.name,
        Body: buffer,
    };

    try {
        const data = await s3Client.send(new PutObjectCommand(uploadParams));
    } catch (err) {
        console.log("Error", err);
    }

    // UPDATE DYNAMO TABLE
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

    const price = Number(formData.get('price') as unknown as number);
    
    const product = {
        PK: "Product|Active",
        SK: "Pid|" + uuidv4(),
        title: formData.get('title') as string,
        price: price,
        image: `https://image-bucketa5861-dev.s3.us-east-1.amazonaws.com/${imageFile.name}`,
        size: formData.get('size') as string,
        collection: formData.get('collection') as string,
        stripeId: price === 185 ? 'price_1PEHdpJyYHbUmOahmDlbyBBC' : price === 165 ? 'price_1PEHeHJyYHbUmOahKZihfmm0' : '',
        createdAt: new Date().toISOString()
    };
    
    const params = {
        TableName: table_name,
        Item: product
    };
    
    try {
        const data = await docClient.send(new PutCommand(params));
        console.log("Success", data);
    } catch (err) {
        console.log("Error", err);
    }
};