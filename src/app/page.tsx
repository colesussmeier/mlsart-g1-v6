import 'server-only';

import Image from "next/image";
import ScrollToButton from "./components/scrollToButton";
import React from 'react';
import Gallery from "./components/gallery";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'MLS Watercolors',
  description: 'Original watercolor paintings by Mary Lou Sussmeier',
  icons: '/favicon.ico',
}



export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-between h-screen relative">
        <div className="absolute inset-0 z-[-1]">
          <Image fill src="/heroCover.jpg" alt="background" quality={90} priority={true}/>
        </div>
        <div className="flex flex-col items-center justify-center h-screen mt-20">
          <ScrollToButton />
        </div>
      </div>
      <div>
      <p className="text-3xl lg:text-4xl text-center pt-12 pb-10 lg:pb-16 text-custom-blue">Gallery</p>
        <Gallery />
      </div>
    </>
  );
}