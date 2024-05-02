"use client";

import CheckoutButton from "../components/checkoutButton";
import { useCartContext } from "../context/cart";
import Image from "next/image";

export default function Cart() {
    const { cart, total, clearCart } = useCartContext();
    return (
        <div className="flex flex-col w-full min-h-screen items-center">
            <h1 className="text-3xl text-center my-5">Cart</h1>
            {cart.length === 0 && <h2 className="text-2xl pt-20">Your cart is empty</h2>}
            {cart.length !== 0 && <>
                <div className="flex flex-col w-3/4 md:w-1/2 lg:w-1/2 items-center border-gray-300 border-solid border-2 rounded shadow">
                {cart.map((product: any) => {
                    const { SK, title, price, amount, image } = product;
                    return (
                        <div key={SK} className="flex flex-row justify-between w-full p-5">
                            <Image className="rounded h-1/2 w-1/2 mt-4 lg:mt-0"
                                 src={image}
                                 alt={title}
                                 width={400}
                                 height={200}
                                 priority={true} />
                            <div className="flex flex-col justify-center text-right">
                                <h2 className="text-2xl">{title}</h2>
                                <p className="text-2xl">${price}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <h2 className="text-2xl mt-5">Subtotal: ${total}</h2>
            <div className="flex flex-row justify-between w-3/4 m-10 lg:w-1/2 p-2">
            <button className="bg-gray-300 border-2 border-gray-500 w-32 py-1 rounded" onClick={clearCart}>Clear Cart</button>
            <CheckoutButton/>
            </div>
            </>}
        </div>
    );
}