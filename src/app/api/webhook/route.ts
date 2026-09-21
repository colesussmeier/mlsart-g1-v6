import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";
import { createOrder, markProductsSold } from "../../actions/createOrder";
import { sendCustomerEmail } from "../../actions/sendEmails";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get("Stripe-Signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Rejected a webhook with an invalid signature", error);
    return NextResponse.json({ status: "Failed" }, { status: 400 });
  }

  console.log("Event", event.type);

  if (event.type !== "charge.succeeded") {
    return NextResponse.json({ status: "Ignored", event: event.type });
  }

  const charge = event.data.object as Stripe.Charge;

  const chargeDetails = {
    chargeId: charge.id,
    pids: charge.metadata,
    email: charge.billing_details.email,
    address: charge.shipping?.address,
    shipTo: charge.shipping?.name,
    total: Number(charge.amount) / 100,
    receipt_url: charge.receipt_url
  };

  try {
    const { created, pids } = await createOrder(chargeDetails);

    // An email is the one step that cannot be taken back, so only the delivery that
    // actually recorded the order sends one, and a failure here is logged instead of
    // retried: a customer emailed twice is worse than a customer emailed late.
    if (created) {
      try {
        await sendCustomerEmail(chargeDetails.email, chargeDetails.receipt_url);
      } catch (error) {
        console.error("Recorded charge", chargeDetails.chargeId, "but its emails failed", error);
      }
    }

    await markProductsSold(pids);

    return NextResponse.json({ status: "Success", event: event.type });
  } catch (error) {
    // Reporting the failure is what makes Stripe redeliver the event. Both steps above
    // are keyed on the charge, so a redelivery cannot duplicate the order or the email.
    console.error("Failed to process charge", chargeDetails.chargeId, error);
    return NextResponse.json({ status: "Failed" }, { status: 500 });
  }
}
