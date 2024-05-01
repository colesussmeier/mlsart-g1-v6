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

    return (
        <>
            <section className="w-full grid sm:grid-cols-3 grid-cols-1 gap-4 px-2">
                {products.length > 0 && products.map((product: Product) => {
                    //const [width, height] = product.size.split(' x ').map(size => Number(size.slice(0, -1)));
                    return (
                        <div key={product.title} className="flex justify-center items-center">
                            {product.isPurchased ? (
                                <div className="relative">
                                <Image 
                                    className="opacity-50 max-h-96"
                                    src={product.image} 
                                    alt={product.title} 
                                    width={2000}
                                    height={1000}
                                    objectFit="cover"
                                    layout='responsive'
                                    sizes="(max-width: 768px) 100vw, 33vw"/>
                                <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-red-600">Sold</p>
                                </div>
                            ) : (
                                <Link href={`/products/${product.title}`}>
                                    <Image 
                                        src={product.image} 
                                        alt={product.title} 
                                        width={2000}
                                        height={1000}
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="max-h-[20rem]"/>
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