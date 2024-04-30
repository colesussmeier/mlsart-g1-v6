"use client";

import type { WithAuthenticatorProps } from '@aws-amplify/ui-react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useEffect, useState } from 'react';
import { uploadProduct } from '../actions/uploadProduct';
import { getOrders } from '../actions/getOrders';
import { Amplify } from 'aws-amplify';
import config from '../../amplifyconfiguration.json';

Amplify.configure(config);

const Mom: React.FC<any> = (props) => {
    const [image, setImage] = useState<string | null>(null);
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const orders = await getOrders();
            setOrders(orders as any);
            console.log(orders);
        };
        fetchOrders();
    }, []);

  return (
    <>
    <main className="flex flex-col w-full h-[100vh] items-center" {...props}>

    <header>
        <h1 className="font-bold underline text-lg pt-10">Add new Product</h1>
    </header>

    <form className="flex flex-col items-center space-y-4 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" action={uploadProduct}>
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
        accept="image/jpg"
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
        </select>
        </div>
        <div className="ml-10">
        <span className="text-gray-700">Collection</span>
        <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" name="collection">
            <option value="Landscape">Landscape</option>
            <option value="Flower">Flower</option>
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
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Address</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Product ID(s)</th>
            </tr>
        </thead>
        <tbody>
        {orders.map((order, index) => {
        const splitSK = order.SK.split("|");
        return (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-200' : ''}>
                <td className="border px-4 py-2">{splitSK[1]}</td>
                <td className="border px-4 py-2">{splitSK[0]}</td>
                <td className="border px-4 py-2">{`${order.address.line1}, ${order.address.city}, ${order.address.state}, ${order.address.postal_code}`}</td>
                <td className="border px-4 py-2">{order.total}</td>
                <td className="border px-4 py-2">{order.keys}</td>
            </tr>
            );
        })}
        </tbody>
    </table>

<button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-44" onClick={props.signOut}>Sign out</button>
    </main>
    </>
  );
}


export default withAuthenticator(Mom);