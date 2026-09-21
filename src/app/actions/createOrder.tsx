import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

function getDocClient() {
    const dynamoClient = new DynamoDBClient({
        region: "us-east-1",
        credentials: {
            accessKeyId: process.env.PUBLIC_AWS_KEY as string,
            secretAccessKey: process.env.PRIVATE_AWS_KEY as string
        }
    });
    return DynamoDBDocumentClient.from(dynamoClient);
}

export async function createOrder(chargeDetails: any) {
    const table_name = process.env.DYNAMO_TABLE;
    const docClient = getDocClient();

    // Stripe metadata is a map of strings, so the pid dictionary the checkout route
    // stringified into SK_metadata is what needs parsing, not the map holding it.
    const rawPids = chargeDetails.pids?.SK_metadata;
    if (!rawPids) {
        throw new Error(`Charge ${chargeDetails.chargeId} carries no SK_metadata, so there is no way to tell what was bought`);
    }
    const parsedPids: Record<string, number> = JSON.parse(rawPids);

    // The dashboard reads these unguarded, and a half-written order that breaks it is
    // worse than a loud failure Stripe will redeliver.
    if (!chargeDetails.email || !chargeDetails.shipTo || !chargeDetails.address) {
        throw new Error(`Charge ${chargeDetails.chargeId} is missing the customer email or shipping details`);
    }

    const order = {
        PK: "Order|Purchased",
        // Keyed on the charge rather than a random id, so a redelivered webhook
        // updates the same row instead of creating a second order.
        SK: chargeDetails.email + "|" + chargeDetails.chargeId,
        shipTo: chargeDetails.shipTo,
        address: chargeDetails.address,
        total: chargeDetails.total,
        createdAt: new Date().toISOString(),
        keys: parsedPids
    };

    try {
        await docClient.send(new PutCommand({
            TableName: table_name,
            Item: order,
            ConditionExpression: "attribute_not_exists(SK)"
        }));
    } catch (err) {
        if ((err as Error).name === "ConditionalCheckFailedException") {
            console.log("Charge", chargeDetails.chargeId, "was already recorded, leaving it alone");
            return { created: false, pids: parsedPids };
        }
        throw err;
    }

    console.log("Recorded order", order.SK);
    return { created: true, pids: parsedPids };
}

// Prints are made to order by a third party, so only originals leave the store.
export async function markProductsSold(pids: Record<string, number>) {
    const table_name = process.env.DYNAMO_TABLE;
    const docClient = getDocClient();

    const originals = Object.entries(pids)
        .filter(([, printCount]) => printCount === 0)
        .map(([pid]) => pid);

    await Promise.all(originals.map((pid) => docClient.send(new UpdateCommand({
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
    }))));

    if (originals.length) {
        console.log("Marked sold", originals.join(", "));
    }
}
