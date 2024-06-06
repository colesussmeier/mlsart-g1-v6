"use client";

import { useProductContext } from '../../context/products';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import { useCartContext } from '../../context/cart';
import { queryProducts } from '../../actions/queryproducts';

export default function Product({ params }: 
    { params: { id: string; }; }) {
        const router = useRouter();
        const { products } = useProductContext();
        const { addToCart } = useCartContext();
        const decodedTitle = decodeURIComponent(params.id);
        let title, price, size, collection;

        async function fetchProducts() {
            const result = await queryProducts();
            const product = result.find((product: any) => {
                return product.title === decodedTitle;
            });
            ({ title, price, size, collection } = product);
        };

        const product = products.find((product: any) => {
            return product.title === decodedTitle;
        });
        
        try {
            ({ title, price, size, collection } = product);
        } catch (e) {
            //in case of page refresh (context is lost)
            fetchProducts();
        }

        const url = "https://image-bucketa5861-dev.s3.us-east-1.amazonaws.com/" + decodedTitle + ".jpg";
    return (
        <div className="h-[100vh] pt-14">
            <div className="flex flex-col lg:flex-row w-full items-center">
                <div className="flex flex-row w-2/3 md:w-1/2 justify-center items-center lg:mx-14">
                    <Image 
                        className="rounded"
                        src={url}
                        alt={title}
                        width={750}
                        height={550}
                        priority={true}/>
                </div>
                <div className="w-1/2 pt-5 flex flex-col content-center text-center text-lg justify-center items-center space-y-6">
                    <h1>{title}</h1>
                    <p className="text-sm">{collection} Collection</p>
                    <p>Size - {size}</p>
                    <p>Price - ${price}</p>
                    <button type="button" className="mt-5 px-4 py-2 text-lg bg-white text-custom-blue drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.5)] border-[0.1px] border-solid border-black rounded"
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