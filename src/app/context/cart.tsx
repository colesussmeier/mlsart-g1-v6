"use client";

import React, { useEffect, useState, createContext } from "react";

const CartContext = createContext<any>({
    products: [],
});

export function CartProvider({ children }: { 
    children:React.ReactNode;
    }) {

    const [cart, setCart] = useState(() => {
        const localData = typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
        return localData ? JSON.parse(localData) : [];
    });

    const [total, setTotal] = useState(0);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
        
        const total = [...cart].reduce((total, { amount, price }) => {
            return (total += amount * price);
        }, 0);
        setTotal(parseFloat(total.toFixed(2)));
    }, [cart]);

    const addToCart = (product: any) => {
        const { SK, title, price, image, stripeId } = product;
        const cartItems = [...cart, { SK, title, image, price, amount: 1, stripeId }];
        setCart(cartItems);
    };

    const clearCart = () => {
        if (typeof window !== 'undefined') {
            localStorage.clear();
        }
        setCart([]);
    };

    return (
        <CartContext.Provider
          value={{ cart, total, addToCart, clearCart }}
        >
          {children}
        </CartContext.Provider>
      );
    };

export function useCartContext() {
    return React.useContext(CartContext);
}