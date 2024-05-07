import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";
import { createOrder } from "../../actions/createOrder";
import { sendCustomerEmail } from "../../actions/sendEmails";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const res = JSON.parse(payload);
  const sig = req.headers.get("Stripe-Signature");

  try {
    let event = stripe.webhooks.constructEvent(
      payload,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("Event", event?.type);
    // charge.succeeded
    // payment_intent.succeeded
    // payment_intent.created

    if (event.type === "charge.succeeded") {

      const chargeDetails = {
        pids: res?.data?.object.metadata,
        email: res?.data?.object.billing_details.email,
        address: res?.data?.object?.shipping?.address,
        shipTo: res?.data?.object?.shipping?.name,
        total: Number(res?.data?.object.amount) / 100,
        receipt_url: res?.data?.object.receipt_url
      };
      sendCustomerEmail(chargeDetails.email, chargeDetails.receipt_url);
      createOrder(chargeDetails);
    }

    return NextResponse.json({ status: "Success", event: event.type, response: res });
  } catch (error) {
    return NextResponse.json({ status: "Failed", error });
  }
}