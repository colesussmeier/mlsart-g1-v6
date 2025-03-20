"use client";

import React from 'react';
import { useProductContext } from '../context/products';
import Image from 'next/image';
import Link from 'next/link';
import FadeInView from './fadeInView';

interface Product {
    SK: string;
    image: string;
    title: string;
    size: string;
    isPurchased: boolean;
}

interface GalleryProps {
    sortOrder: 'landscape-first' | 'floral-first';
}

function Gallery({ sortOrder = 'landscape-first' }: GalleryProps) {
    const { products } = useProductContext();

    const landscapeProducts = products.filter(product => product.collection === 'Landscape');
    const floralProducts = products.filter(product => product.collection === 'Floral');

    const collections = sortOrder === 'landscape-first' 
        ? [
            { products: landscapeProducts, title: 'Landscape Collection' },
            { products: floralProducts, title: 'Floral Collection' }
          ]
        : [
            { products: floralProducts, title: 'Floral Collection' },
            { products: landscapeProducts, title: 'Landscape Collection' }
          ];

    return (
        <>
            {collections.map(({ products: collectionProducts, title }) => (
                <React.Fragment key={title}>
                    {collectionProducts.length > 0 && (
                        <>
                            <FadeInView delay={0.1} key={`sort-${sortOrder}`}>
                                <p className="text-xl lg:text-2xl text-center pt-12 pb-10 lg:pb-16 text-custom-blue">
                                    {title}
                                </p>
                            </FadeInView>
                            <section className="w-full grid md:grid-cols-3 grid-cols-1 px-8">
                                {collectionProducts.map((product: Product) => (
                                    <FadeInView key={`${product.title}-${sortOrder}`} delay={0.2}>
                                        <div className="flex justify-center items-center py-10">
                                            {product.isPurchased ? (
                                                <div className="relative">
                                                    <Image 
                                                        className="opacity-50 rounded max-h-96 md:max-w-[27vw] md:max-h-[18vw]"
                                                        src={product.image} 
                                                        alt={product.title} 
                                                        width={750}
                                                        height={550}
                                                    />
                                                    <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-black">
                                                        Sold
                                                    </p>
                                                </div>
                                            ) : (
                                                <Link href={`/products/${product.title}`}>
                                                    <Image 
                                                        src={product.image} 
                                                        alt={product.title} 
                                                        width={750}
                                                        height={550}
                                                        className="rounded md:max-w-[27vw] md:max-h-[18vw]"
                                                    />
                                                </Link>
                                            )}
                                        </div>
                                    </FadeInView>
                                ))}
                            </section>
                        </>
                    )}
                </React.Fragment>
            ))}
        </>
    );
}

export default Gallery;