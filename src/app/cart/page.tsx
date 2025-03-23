"use client";

import { useCartContext } from "../context/cart";
import Image from "next/image";
import { FiTrash2 } from "react-icons/fi";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import CheckoutButton from "../components/checkoutButton";

export default function Cart() {
    const { cart, total, clearCart, updateQuantity, removeFromCart } = useCartContext();
    
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[100vh]">
            <h1 className="text-3xl my-8 text-center">Shopping Cart</h1>
            
            {cart.length === 0 ? (
                <div className="text-center py-16">
                    <h2 className="text-2xl font-medium text-gray-600">Your cart is empty</h2>
                    <p className="mt-2 text-gray-500">Add some items to get started!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Cart Items Section */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-lg shadow">
                            {cart.map((product: any) => {
                                const { SK, title, price, amount, image, isPrint } = product;
                                return (
                                    <div key={SK} className="flex items-center p-[1.6rem] border-b border-gray-200 last:border-b-0">
                                        <div className="flex-shrink-0 w-24 h-24 relative">
                                            <Image
                                                src={image}
                                                alt={title}
                                                fill
                                                className="object-cover rounded-md"
                                                priority={true}
                                                sizes="10vw"
                                            />
                                        </div>
                                        <div className="ml-6 flex-1">
                                            <div className="flex justify-between">
                                                <h3 className="text-lg font-medium text-gray-900">{title}{isPrint && " (print)"}</h3>
                                                <p className="text-lg font-medium text-gray-900">${price}</p>
                                            </div>
                                            <div className="mt-4 flex items-center justify-between min-h-[40px]">
                                                <div className="flex-1">
                                                    {isPrint && (
                                                        <div className="flex items-center border rounded-md w-fit">
                                                            <button
                                                                onClick={() => updateQuantity(SK, amount - 1)}
                                                                className="p-2 hover:bg-gray-100"
                                                                disabled={amount <= 1}
                                                            >
                                                                <AiOutlineMinus className="w-4 h-4" />
                                                            </button>
                                                            <span className="px-4 py-2 text-gray-600">{amount}</span>
                                                            <button
                                                                onClick={() => updateQuantity(SK, amount + 1)}
                                                                className="p-2 hover:bg-gray-100"
                                                            >
                                                                <AiOutlinePlus className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(SK)}
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    <FiTrash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Order Summary Section */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-medium text-gray-900 mb-4">Order Summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <p className="text-gray-600">Subtotal</p>
                                    <p className="font-medium">${total}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-gray-600">Shipping</p>
                                    <p className="font-medium">Free</p>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between">
                                        <p className="text-lg font-medium">Total</p>
                                        <p className="text-lg font-bold">${total}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 space-y-4">
                                <CheckoutButton />
                                <button
                                    onClick={clearCart}
                                    className="w-full px-4 py-2 text-lg text-gray-600 border-[0.1px] border-solid border-gray-400 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}