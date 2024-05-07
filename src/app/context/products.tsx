"use client";

import React, { useEffect, useState, createContext } from "react";
import { queryProducts } from "../actions/queryproducts";

const ProductContext = createContext<any>({
    products: [],
    status: null,
});

export function ProductProvider({ children } : { 
    children:React.ReactNode;
    }) {
    const [products, setProducts] = useState<any>([]);

    async function fetchProducts() {
        const result = await queryProducts();
        const sortedResult = result?.sort((a, b) => (new Date(b.createdAt) as any) - (new Date(a.createdAt) as any));
        setProducts(sortedResult);
        return sortedResult;
    };
    
    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <ProductContext.Provider value={{ products }}>
            {children}
        </ProductContext.Provider>
    );
};

export function useProductContext() {
    return React.useContext(ProductContext);
}
