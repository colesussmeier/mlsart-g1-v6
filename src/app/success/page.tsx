"use client";

import { useEffect } from "react";
import { useCartContext } from "../context/cart";

export default function Success() { 
    const { clearCart } = useCartContext();

    useEffect(() => {
        clearCart();
    }, []);

    return (
        <div className="h-[100vh] flex flex-col items-center text-center justify-center space-y-4">
            <h1 className="text-3xl font-bold px-5">Order Successful!</h1>
            <p className="text-lg px-5 md:max-w-lg">Thank you for your purchase! We&apos;ve sent an email confirmation and we&apos;ll send another when your order has shipped.</p>
        </div>
    );
}