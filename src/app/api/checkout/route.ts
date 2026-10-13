import { NextResponse, NextRequest } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { PRINT_STRIPE_PRICE_ID } from "../../actions/productOptions";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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

// Maps each pid to 0 for the original or to a count of prints, as the cart sends it.
function parseCart(raw: unknown): Record<string, number> | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const entries = Object.entries(raw);
  if (entries.length === 0) return null;
  for (const [pid, count] of entries) {
    if (!pid.startsWith('Pid|') || !Number.isInteger(count) || (count as number) < 0) return null;
  }
  return raw as Record<string, number>;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cart = parseCart(body?.SK_metadata);
    if (!cart) {
      return NextResponse.json({ message: "Your cart couldn't be read. Please refresh the page and try again." }, { status: 400 });
    }

    // Consistent reads, so a painting marked sold moments ago is already refused.
    const docClient = getDocClient();
    const products = await Promise.all(Object.keys(cart).map(async (pid) => {
      const result = await docClient.send(new GetCommand({
        TableName: process.env.DYNAMO_TABLE,
        Key: { PK: "Product|Active", SK: pid },
        ProjectionExpression: "title, stripeId, isPurchased",
        ConsistentRead: true
      }));
      return [pid, result.Item] as const;
    }));

    // A sold original takes its prints with it, matching the product page.
    const unavailable = products.filter(([, product]) => !product || product.isPurchased);
    if (unavailable.length) {
      const titles = unavailable.map(([, product]) => product?.title).filter(Boolean);
      const message = titles.length
        ? `Sorry, ${titles.map(title => `"${title}"`).join(' and ')} ${titles.length === 1 ? 'has' : 'have'} already sold. Please remove ${titles.length === 1 ? 'it' : 'them'} from your cart and try again.`
        : "Sorry, something in your cart is no longer available. Please refresh the page and try again.";
      return NextResponse.json({ message }, { status: 409 });
    }

    // Prices come from the products rather than the request, so the charge always
    // matches what the webhook will record as bought.
    const quantities = new Map<string, number>();
    for (const [pid, product] of products) {
      const prints = cart[pid];
      const price = prints === 0 ? product!.stripeId : PRINT_STRIPE_PRICE_ID;
      quantities.set(price, (quantities.get(price) ?? 0) + (prints === 0 ? 1 : prints));
    }
    const line_items = Array.from(quantities, ([price, quantity]) => ({ price, quantity }));

    const session = await stripe.checkout.sessions.create({
      billing_address_collection: 'auto',
      line_items: line_items,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      payment_intent_data: {
        metadata: {
          SK_metadata: JSON.stringify(cart)
        },
      },
      mode: 'payment',
      allow_promotion_codes: true,
      success_url: `${req.headers.get('origin')}/success`,
      cancel_url: `${req.headers.get('origin')}/cancel`,
    });

    return NextResponse.json({id: session.id});
  } catch (err: any) {
    console.error("Checkout failed", err);
    return NextResponse.json({ message: "Checkout isn't working right now. Please try again in a few minutes." }, { status: 500 });
  }
}
