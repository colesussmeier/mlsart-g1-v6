"use client";

import { useEffect } from "react";
import { useCartContext } from "../context/cart";

export default function Success() { 
    const { clearCart } = useCartContext();

    useEffect(() => {
        clearCart();
    }, []);

    return (
        <div className="h-[100vh] flex flex-col items-center justify-center space-y-4">
            <h1 className="text-3xl font-bold">Order Successful!</h1>
            <p className="text-xl">Thank you for your purchase.</p>
            <p className="text-lg">You will receive an email when your product is shipped.</p>
        </div>
    );
}