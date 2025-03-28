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
        const { SK, title, price, image, stripeId, version } = product;
        const existingProductIndex = cart.findIndex((p: any) => p.SK === SK);
        if (existingProductIndex == -1) {
            const printStripeId = 'price_1R7iGjJyYHbUmOahLxpIyNrl';
            if (version === 'print') {
                const cartItems = [...cart, { SK, title, image, price, amount: 1, stripeId: printStripeId, isPrint: true}];
                setCart(cartItems);
            }
            else {
                const cartItems = [...cart, { SK, title, image, price, amount: 1, stripeId, isPrint: false}];
                setCart(cartItems);
            }
            
        } else {
            console.log("duplicate item");
        }
    };

    const clearCart = () => {
        if (typeof window !== 'undefined') {
            localStorage.clear();
        }
        setCart([]);
    };

    const removeFromCart = (SK: string) => {
        const updatedCart = cart.filter((item: any) => item.SK !== SK);
        setCart(updatedCart);
    };

    const updateQuantity = (SK: string, newAmount: number) => {
        const updatedCart = cart.map((item: any) => {
            if (item.SK === SK) {
                return { ...item, amount: newAmount };
            }
            return item;
        });
        setCart(updatedCart);
    };

    return (
        <CartContext.Provider
          value={{ cart, total, addToCart, clearCart, removeFromCart, updateQuantity }}
        >
          {children}
        </CartContext.Provider>
    );
};

export function useCartContext() {
    return React.useContext(CartContext);
}