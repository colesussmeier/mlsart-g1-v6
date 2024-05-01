"use client";

import { useProductContext } from '../../context/products';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import { useCartContext } from '../../context/cart';

export default function Product({ params }: 
    { params: { id: string; }; }) {
        const router = useRouter();
        const { products } = useProductContext();
        const { addToCart } = useCartContext();
        const decodedTitle = decodeURIComponent(params.id);
    
        const product = products.find((product: any) => {
            return product.title === decodedTitle;
        });
    
        const { title, price, size, collection } = product;
        const url = "https://image-bucketa5861-dev.s3.us-east-1.amazonaws.com/" + decodedTitle + ".jpg";
    return (
        <div className="h-[100vh] pt-14">
            <div className="flex flex-col lg:flex-row w-full items-center lg:mx-14">
                <div className="flex flex-row w-1/2 justify-center items-center">
                    <Image 
                        className="rounded"
                        src={url}
                        alt={title}
                        height={500}
                        width={700}
                        priority={true}/>
                </div>
                <div className="w-1/2 pt-5 flex flex-col content-center text-center text-lg justify-center items-center space-y-6">
                    <h1>{title}</h1>
                    <p className="text-sm">{collection} Collection</p>
                    <p>Size - {size}</p>
                    <p>Price - ${price}</p>
                    <button type="button" className="bg-gray-300 border-2 border-gray-500 w-32 py-1 rounded"
                    onClick={() => {
                        router.push('/cart');
                        addToCart({ ...product });
                        }}>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}