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
      <div className="flex flex-col items-center justify-between h-[92vh] md:h-[94vh] lg:h-[98vh]">
        <div className="absolute inset-0 z-[-1]">
          <Image fill src="/TurquoiseAbstract.jpg" alt="background" quality={100}/>
        </div>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-6xl font-extrabold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.6)] text-center bottom-10 pb-10 text-white">Mary Lou Sussmeier</h1>
          <p className="text-3xl font-bold pb-12 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.6)] text-center text-white">Local watercolor artist in the Hudson Valley</p>
          <ScrollToButton />
        </div>
      </div>
      <div>
      <h1 className="text-5xl font-bold text-center pb-16 text-black">Gallery</h1>
        <Gallery />
      </div>
    </>
  );
}