"use client";

import { Philosopher, Cinzel } from "next/font/google";
import "./globals.css";
import Nav from "./components/nav";
import Footer from "./components/footer";
import { Amplify } from 'aws-amplify';
import config from '../amplifyconfiguration.json';
import Script from 'next/script';
import Head from 'next/head';
import { ProductProvider } from './context/products';
import { CartProvider } from "./context/cart";

Amplify.configure(config, { ssr: true })

const cinzel = Cinzel({ subsets: ["latin"] });
const philosopher = Philosopher({ weight: "400", style: "normal", subsets: ["latin"]});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Hudson Valley Watercolors"/>
      </Head>
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