'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useCartContext } from '../context/cart';

export default function CheckoutButton() {
  const { cart } = useCartContext();
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async() => {
    setError(null);

    // Metadata needed for backend updates. The server prices the cart from it too.
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
    try {
      const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ SK_metadata }),
        });
      const session = await response.json();
      if (!response.ok) {
        setError(session.message ?? "Checkout isn't working right now. Please try again in a few minutes.");
        return;
      }
      await stripe?.redirectToCheckout({ sessionId: session.id });
    } catch {
      setError("Couldn't start checkout. Please check your connection and try again.");
    }
  }

  return (
    <div>
      <button className="w-full px-4 py-2 text-lg font-semibold bg-white text-custom-blue border-[0.1px] border-solid border-gray-500 rounded-md hover:bg-gray-50 transition-colors" onClick={handleCheckout}>Checkout</button>
      {error && <p className="mt-3 text-center text-red-700" role="alert">{error}</p>}
    </div>
  );
}
