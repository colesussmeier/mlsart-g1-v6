"use client";

import React from 'react';
import Link from 'next/link';

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <nav className="flex items-center justify-between flex-wrap bg-white px-6 py-1 lg:py-6">
            <p className="text-xl text-custom-blue max-w-44 md:text-2xl lg:max-w-xl text-center">Mary Lou Sussmeier <span className="font-medium">Watercolors</span></p>
            <div className="block lg:hidden">
                <button onClick={() => setIsOpen(!isOpen)} className="flex items-center px-3 py-2 border rounded border-custom-blue hover:text-gray-500 hover:border-gray-500">
                    <svg className="fill-custom-blue h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v15z"/></svg>
                </button>
            </div>
            <div className={`${isOpen ? `block` : `hidden`} w-full block flex-grow text-custom-blue font-semibold lg:flex lg:items-center lg:w-auto lg:justify-end`}>
                <div className="ml-auto">
                    <Link href={"/"} onClick={() => setIsOpen(!isOpen)} className="block mt-4 lg:inline-block lg:mt-0 hover:text-gray-500 mr-6 md:text-xl">
                        Home
                    </Link>
                    <Link href={"/cart"} onClick={() => setIsOpen(!isOpen)} className="block mt-4 lg:inline-block lg:mt-0 hover:text-gray-500 mr-6 md:text-xl">
                        Cart
                    </Link>
                    <Link href={"/about"} onClick={() => setIsOpen(!isOpen)} className="block mt-4 lg:inline-block lg:mt-0 hover:text-gray-500 md:text-xl">
                        About
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;