"use client";

import { Cinzel } from "next/font/google";
import "./globals.css";
import Nav from "./components/nav";
import Footer from "./components/footer";
import { Amplify } from 'aws-amplify';
import config from '../amplifyconfiguration.json';
import Script from 'next/script';
import Head from 'next/head';
import { ProductProvider } from './context/products';
import { CartProvider } from "./context/cart";
import React, { useEffect } from "react";

Amplify.configure(config, { ssr: true })

const cinzel = Cinzel({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preload" href="/headshot.jpg" as="image" />
        <meta name="description" content="Original Hudson Valley watercolors painted by Mary Lou Sussmeier"/>
        <meta name="keywords" content="Watercolor, Hudson Valley, Artist, New York, Cold Spring"/>
      </Head>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-Z95YLTM9MW"></Script>
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-Z95YLTM9MW');
        `}
      </Script>
      <body className={cinzel.className}>
        <Nav />
          <ProductProvider>
            <CartProvider> 
            {children}
            </CartProvider>
          </ProductProvider>
        <Footer />
        </body>
    </html>
  );
}