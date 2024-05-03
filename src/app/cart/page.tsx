"use client";

import CheckoutButton from "../components/checkoutButton";
import { useCartContext } from "../context/cart";
import Image from "next/image";
import Link from "next/link";

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
                            <Image className="rounded mt-5 lg:mt-0 max-w-[150px] md:max-w-[375px] max-h-[110px] md:max-h-[275px]"
                                 src={image}
                                 alt={title}
                                 width={750}
                                 height={550}
                                 priority={true} />
                            <div className="flex flex-col justify-center text-right max-w-32 mt-5 md:mt-0">
                                <h2 className="text-xl">{title}</h2>
                                <p className="text-xl">${price}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <h2 className="text-2xl mt-5">Subtotal: ${total}</h2>
            <div className="flex flex-row justify-between w-3/4 m-10 lg:w-1/2 p-2">
            <button className="mt-5 px-2 py-2 text-lg bg-white text-black drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.5)] border-[0.1px] border-solid border-black rounded" onClick={clearCart}>Clear Cart</button>
            <CheckoutButton/>
            </div>
            </>}
        </div>
    );
}