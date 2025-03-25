import { NextResponse, NextRequest } from "next/server";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === 'POST') {
    try {
      const body = await req.json();

      const line_items = Object.entries(body.stripeIdCounts).map(([stripeId, count]) => ({
        price: stripeId,
        quantity: count,
      }));

      const SK_metadata = body.SK_metadata;

      console.log('SK_metadata', SK_metadata);
      
      const session = await stripe.checkout.sessions.create({
        billing_address_collection: 'auto',
        line_items: line_items,
        shipping_address_collection: {
          allowed_countries: ['US', 'CA'],
        },
        payment_intent_data: {
          metadata: {
            SK_metadata: JSON.stringify(SK_metadata)
          },
        },
        mode: 'payment',
        allow_promotion_codes: true,
        success_url: `${req.headers.get('origin')}/success`,
        cancel_url: `${req.headers.get('origin')}/cancel`,
      });

      return NextResponse.json({id: session.id});
    } catch (err: any) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: req.method }, { status: 405 });
  }
}