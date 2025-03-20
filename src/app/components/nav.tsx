"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const pathname = usePathname();
    const isAboutPage = pathname === '/about';

    useEffect(() => {
        if (!isAboutPage) {
            setVisible(true);
            return;
        }

        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
            setPrevScrollPos(currentScrollPos);
        };

        const handleContainerScroll = (e: Event) => {
            const customEvent = e as CustomEvent;
            const currentScrollPos = customEvent.detail.scrollTop;
            setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('containerScroll', handleContainerScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('containerScroll', handleContainerScroll);
        };
    }, [prevScrollPos, isAboutPage]);

    // Reset visibility when leaving the about page
    useEffect(() => {
        if (!isAboutPage) {
            setVisible(true);
        }
    }, [isAboutPage]);

    const navClasses = isAboutPage
        ? `fixed w-full transition-transform duration-300 z-50 ${visible ? 'translate-y-0' : '-translate-y-full'} flex items-center justify-between flex-wrap bg-white px-6 py-1 lg:py-6`
        : 'flex items-center justify-between flex-wrap bg-white px-6 py-1 lg:py-6';

    return (
        <nav className={navClasses}>
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