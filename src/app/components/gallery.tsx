"use client";

import React from 'react';
import { useProductContext } from '../context/products';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
    SK: string;
    image: string;
    title: string;
    size: string;
    isPurchased: boolean;
}

function Gallery() {
    const { products } = useProductContext();

    const landscapeProducts = products.filter(product => product.collection === 'Landscape');
    const floralProducts = products.filter(product => product.collection === 'Floral');

    return (
        <>
            <section className="w-full grid sm:grid-cols-3 grid-cols-1 px-3">
                {landscapeProducts.length > 0 && landscapeProducts.map((product: Product) => {
                    //const [width, height] = product.size.split(' x ').map(size => Number(size.slice(0, -1)));
                    return (
                        <div key={product.title} className="flex justify-center items-center py-5">
                            {product.isPurchased ? (
                                <div className="relative">
                                <Image 
                                    className="opacity-50 rounded max-h-96 md:max-w-[30vw] md:max-h-[20vw]"
                                    src={product.image} 
                                    alt={product.title} 
                                    width={750}
                                    height={550}
                                    />
                                <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-black">Sold</p>
                                </div>
                            ) : (
                                <Link href={`/products/${product.title}`}>
                                    <Image 
                                        src={product.image} 
                                        alt={product.title} 
                                        width={750}
                                        height={550}
                                        className="rounded md:max-w-[30vw] md:max-h-[20vw]"
                                        />
                                </Link>
                            )}
                        </div>
                    ); 
                })}
            </section>
            {floralProducts.length > 0 && <p className="text-2xl lg:text-3xl text-center pt-12 pb-10 lg:pb-16 text-custom-blue">Floral Collection</p>}
            <section className="w-full grid sm:grid-cols-3 grid-cols-1 px-3">
                {floralProducts.length > 0 && floralProducts.map((product: Product) => {
                    return (
                        <div key={product.title} className="flex justify-center items-center py-5">
                            {product.isPurchased ? (
                                <div className="relative">
                                <Image 
                                    className="opacity-50 rounded max-h-96 md:max-w-[30vw] md:max-h-[20vw]"
                                    src={product.image} 
                                    alt={product.title} 
                                    width={750}
                                    height={550}
                                    />
                                <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-black">Sold</p>
                                </div>
                            ) : (
                                <Link href={`/products/${product.title}`}>
                                    <Image 
                                        src={product.image} 
                                        alt={product.title} 
                                        width={750}
                                        height={550}
                                        className="rounded md:max-w-[30vw] md:max-h-[20vw]"
                                        />
                                </Link>
                            )}
                        </div>
                    ); 
                })}
            </section>
        </>
    );
}
export default Gallery;