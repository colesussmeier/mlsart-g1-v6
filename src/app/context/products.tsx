"use client";

import React, { useEffect, useState, createContext } from "react";
import { getProducts } from "../actions/getProducts";

const ProductContext = createContext<any>({
    products: [],
    status: null,
});

export function ProductProvider({ children } : { 
    children:React.ReactNode;
    }) {
    const [products, setProducts] = useState<any>([]);
    const [status, setStatus] = useState(null);

    async function fetchProducts() {
        const result = await getProducts();
        const sortedResult = result?.sort((a, b) => (new Date(b.createdAt) as any) - (new Date(a.createdAt) as any));
        setProducts(sortedResult);
    };
    
    useEffect(() => {
        fetchProducts();
    }, []);

    const resetProducts = () => {
        setProducts([]);
        fetchProducts();
    };

    return (
        <ProductContext.Provider value={{ products, status, resetProducts }}>
            {children}
        </ProductContext.Provider>
    );
};

export function useProductContext() {
    return React.useContext(ProductContext);
}
