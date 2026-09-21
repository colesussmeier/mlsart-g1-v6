"use client";

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useEffect, useState, useRef } from 'react';
import { uploadProduct } from '../actions/uploadProduct';
import { queryOrders } from '../actions/queryOrders';
import { Amplify } from 'aws-amplify';
import config from '../../amplifyconfiguration.json';
import { getProduct } from '../actions/getProduct';
import { updateOrder } from '../actions/updateOrder';
import { sendConfirmationEmail } from '../actions/sendEmails';
import Image from 'next/image';

Amplify.configure(config);

const Mom: React.FC<any> = (props) => {
    const [image, setImage] = useState<string | null>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    // Keyed by order, so pasting a link against one order cannot email it to another.
    const [trackingLinks, setTrackingLinks] = useState<Record<string, string>>({});
    const ref = useRef<HTMLFormElement>(null);

    const validateForm = (formData: FormData) => {
        const title = (formData.get('title') as string ?? '').trim();
        const size = (formData.get('size') as string ?? '').trim();
        const price = formData.get('price');
        const collection = formData.get('collection');
        const image = formData.get('image') as File;
    
        if (!title || !size || !price || !collection || !image || image.size === 0) {
            alert('Please fill out all fields');
            return false;
        }
    
        return true;
    };

    useEffect(() => {
        const fetchOrders = async () => {
            const orders = await queryOrders();
            setOrders(orders as any);
            console.log(orders);
        };
        fetchOrders();
    }, []);

    //{ "SK_metadata" : { "S" : "{\"Pid|1e4b7f60-aa2b-4662-87e4-5db69e25dacf\":1}" } }

    const fetchProducts = async (pid: string, numPrints: number) => {
        const product = await getProduct(pid);
        setProducts(prevProducts => [...prevProducts, { ...product, numPrints }]);
    }

  return (
    <>
    <main className="flex flex-col min-h-screen" {...props}>
        <div className="flex-grow flex flex-col items-center">
            <header>
                <h1 className="font-bold underline text-lg pt-10">Add new Product</h1>
            </header>

            <form ref={ref} className="flex flex-col items-center space-y-4 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" 
                action={async (formData) => {
                    if (!validateForm(formData)) {
                        return;
                    }
                    try {
                        await uploadProduct(formData);
                    } catch (err) {
                        alert(`Upload failed, the product was not added: ${(err as Error).message}`);
                        return;
                    }
                    ref.current?.reset();
                    setImage(null);
                    alert('Product added');
                }}>
                <div className="relative flex justify-center items-center">
                {image ? (
                    <>
                        <img className="image-preview w-32 h-32 object-cover rounded" src={image} alt="" />
                    </>
                    ) : (
                        <div className="flex justify-center items-center">
                            <div className="w-32 h-32 bg-gray-200 rounded" />
                        </div>
                    )
                    }
                    <input
                    className="py-2 ml-3 rounded border border-gray-300"
                    type="file"
                    name="image"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                        if (e.target.files) {
                            setImage(URL.createObjectURL(e.target.files[0]));
                        }
                    }}
                />
                </div>
                <label className="block">
                    <span className="text-gray-700">Title</span>
                    <input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" type="text" name="title" placeholder="Type the title"/>
                </label>
                <label className="block">
                    <span className="text-gray-700">Size</span>
                    <input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" type="text" name="size" placeholder="What's the size?"/>
                </label>
                <label className="flex flex-row">
                    <div>
                    <span className="text-gray-700">Price</span>
                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" name="price">
                        <option value="185">$185</option>
                        <option value="165">$165</option>
                        <option value="135">$135</option>
                        <option value="250">$250</option>
                    </select>
                    </div>
                    <div className="ml-10">
                    <span className="text-gray-700">Collection</span>
                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" name="collection">
                        <option value="Landscape">Landscape</option>
                        <option value="Floral">Floral</option>
                    </select>
                    </div>
                </label>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Add Product</button>
            </form>

            <header>
                <h1 className="font-bold underline text-lg pt-10">Outstanding Orders</h1>
            </header>

            <table className="table-auto w-2/4 mt-8">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Ship To</th>
                        <th className="px-4 py-2">Address</th>
                        <th className="px-4 py-2">Total</th>
                        <th className="px-4 py-2">Paintings</th>
                        <th className="px-4 py-2">Ship it</th>
                    </tr>
                </thead>
                <tbody>
                {orders.map((order, index) => {
                const splitSK = order.SK.split("|");
                return (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                        <td className="border px-4 py-2">{splitSK[0]}</td>
                        <td className="border px-4 py-2">{order.shipTo}</td>
                        <td className="border px-4 py-2">{`${order.address.line1}, ${order.address.city}, ${order.address.state}, ${order.address.postal_code}`}</td>
                        <td className="border px-4 py-2">{order.total}</td>
                        <td className="border px-4 py-2">
                            <details onToggle={async (e) => {
                                if (e.currentTarget.open) {
                                  for (const [key, value] of Object.entries(order.keys)) {
                                    await fetchProducts(key as string, value as number);
                                  }
                                } else {
                                  setProducts([]);
                                }
                            }}>
                                {products.map((product, index) => (
                                    <div key={index} className="flex flex-col items-center space-y-2 mb-10 border-b border-gray-300 pb-4">
                                        <Image src={product.image} width={100} height={50} alt={product.title} />
                                        <span>{product.title}</span>
                                        {product.numPrints > 0 && (
                                            <span className="bg-blue-100 text-md font-bold px-2.5 py-0.5 rounded">
                                                {product.numPrints} print{product.numPrints > 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>
                                ))}

                            </details>
                        </td>
                        <td className="border px-4 py-2">
                            <input type="text" name="tracking" placeholder="Paste tracking link here" 
                                className="border mb-2" value={trackingLinks[order.SK] ?? ''}
                                onChange={(e) => setTrackingLinks(current => ({ ...current, [order.SK]: e.target.value }))}/>
                            <button onClick={async () => {
                                const trackingLink = (trackingLinks[order.SK] ?? '').trim();
                                if (!trackingLink) {
                                    alert('Paste a tracking link before sending the confirmation');
                                    return;
                                }
                                // Marking the order shipped first means a failure here can be
                                // retried without emailing the customer a second time.
                                try {
                                    await updateOrder(order.SK);
                                } catch (err) {
                                    alert(`The order was not marked shipped and nothing was emailed: ${(err as Error).message}`);
                                    return;
                                }
                                setOrders(current => current.filter(o => o.SK !== order.SK));
                                try {
                                    await sendConfirmationEmail(splitSK[0], trackingLink);
                                } catch (err) {
                                    alert(`The order was marked shipped but the email failed, please email ${splitSK[0]} directly: ${(err as Error).message}`);
                                }
                            }}
                                type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                Send shipping confirmation
                            </button>
                        </td>
                    </tr>
                    );
                })}
                </tbody>
            </table>
        </div>

        <div className="w-full flex justify-center py-4">
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={props.signOut}>Sign out</button>
        </div>
    </main>
    </>
  );
}


export default withAuthenticator(Mom, { hideSignUp: true });