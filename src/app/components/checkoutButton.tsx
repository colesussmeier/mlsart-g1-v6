'use client';

import { loadStripe } from '@stripe/stripe-js';
import { useCartContext } from '../context/cart';

export default function CheckoutButton() {
  const { cart } = useCartContext();

  const handleCheckout = async() => {
    // Create an object where each key is a unique stripeId and each value is the sum of amounts for that stripeId
    const stripeIdCounts = cart.reduce((counts: { [key: string]: number }, item: any) => {
      const { stripeId, amount } = item;
      if (stripeId in counts) {
        counts[stripeId] += amount;
      } else {
        counts[stripeId] = amount;
      }
      return counts;
    }, {});

    // Metadata needed for backend updates
    const SK_metadata = cart.reduce((result: { [key: string]: number }, item: any) => {
      const { SK, amount, isPrint } = item;
      if (isPrint) {
        result[SK] = amount;
      } else {
        result[SK] = 0;
      }
      return result;
    }, {});

    
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
    const stripe = await stripePromise;
    const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stripeIdCounts, SK_metadata }),
      });
    const session = await response.json();
    await stripe?.redirectToCheckout({ sessionId: session.id });
  }

  return (
    <div>
      <button className="w-full px-4 py-2 text-lg font-semibold bg-white text-custom-blue border-[0.1px] border-solid border-gray-500 rounded-md hover:bg-gray-50 transition-colors" onClick={handleCheckout}>Checkout</button>
    </div>
  );
}