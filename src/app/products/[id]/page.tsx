"use client";

import { useProductContext } from '../../context/products';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartContext } from '../../context/cart';
import { queryProducts } from '../../actions/queryproducts';
import { useState } from 'react';

export default function Product({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { products } = useProductContext();
    const { addToCart } = useCartContext();
    const decodedTitle = decodeURIComponent(params.id);
    const [selectedVersion, setSelectedVersion] = useState<'original' | 'print'>('original');
    let title, price, size, collection;

    async function fetchProducts() {
        const result = await queryProducts();
        const product = result.find((product: any) => {
            return product.title === decodedTitle;
        });
        ({ title, price, size, collection } = product);
    }

    const product = products.find((product: any) => {
        return product.title === decodedTitle;
    });

    try {
        ({ title, price, size, collection } = product);
    } catch (e) {
        fetchProducts();
    }

    const url = "https://image-bucketa5861-dev.s3.us-east-1.amazonaws.com/" + decodedTitle + ".jpg";
    const printPrice = 30;

    const handleAddToCart = () => {
        const productToAdd = {
            ...product,
            price: selectedVersion === 'original' ? price : printPrice,
            version: selectedVersion,
        };
        addToCart(productToAdd);
        router.push('/cart');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 lg:mt-10 sm:px-6 lg:px-8 py-8 min-h-[100vh]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10">
                {/* Image Section */}
                <div>
                    <div className="aspect-w-4 aspect-h-3 rounded-lg bg-gray-100 overflow-hidden">
                        <Image
                            src={url}
                            alt={title}
                            width={750}
                            height={550}
                            className="object-cover object-center"
                            priority={true}
                        />
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-4 bg-white rounded-lg shadow">
                <div className="flex flex-col justify-between h-full min-h-[50vh] lg:min-h-0 border-b border-gray-200 last:border-b-0">
                    <div className="pb-3">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                        <p className="text-lg text-gray-500">{collection} Collection</p>
                    </div>

                        <div className="pt-4 border-t border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Size</h2>
                            <p className="mt-1 text-lg text-gray-500">{size}</p>
                        </div>

                        <div className="pt-4">
                            <h2 className="text-lg font-medium text-gray-900 mb-2">Select Version</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    className={`px-4 py-3 text-sm border rounded-md ${
                                        selectedVersion === 'original'
                                            ? 'border-custom-blue bg-custom-blue bg-opacity-5 text-custom-blue'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                    onClick={() => setSelectedVersion('original')}
                                >
                                    <span className="font-medium">Original Painting</span>
                                    <p className="mt-1">${price}</p>
                                </button>
                                <button
                                    className={`px-4 py-3 text-sm border rounded-md ${
                                        selectedVersion === 'print'
                                            ? 'border-custom-blue bg-custom-blue bg-opacity-5 text-custom-blue'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                    onClick={() => setSelectedVersion('print')}
                                >
                                    <span className="font-medium">Print Version</span>
                                    <p className="mt-1">${printPrice}</p>
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 pr-1">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium text-gray-900">Price</h2>
                                <p className="text-xl font-semibold text-gray-900">
                                    ${selectedVersion === 'original' ? price : printPrice}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full px-4 py-2 text-lg bg-white text-custom-blue border-[0.1px] border-solid border-gray-400 rounded-md hover:bg-gray-50 transition-colors"
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>
                </div>
                </div>
            </div>
        </div>
    );
}