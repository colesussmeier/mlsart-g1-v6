'use client';

import { loadStripe } from '@stripe/stripe-js';
import { useCartContext } from '../context/cart';

export default function CheckoutButton() {
  const { cart } = useCartContext();

  const handleCheckout = async() => {

    const stripeIds = cart.map((item: any) => item.stripeId);
    const SKs = cart.map((item: any) => item.SK);

    // Create an object where each key is a unique stripeId and each value is the count of that stripeId
    const stripeIdCounts = stripeIds.reduce((counts: { [key: string]: number }, id: string) => {
      if (id in counts) {
          counts[id]++;
      } else {
          counts[id] = 1;
      }
      return counts;
    }, {});

    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
    const stripe = await stripePromise;
    const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stripeIdCounts, SKs }),
      });
    const session = await response.json();
    await stripe?.redirectToCheckout({ sessionId: session.id });
  }

  return (
    <div>
      <button className="mt-5 px-4 py-2 text-lg bg-white text-custom-blue drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.5)] border-[0.1px] border-solid border-black rounded" onClick={handleCheckout}>Checkout</button>
    </div>
  );
}