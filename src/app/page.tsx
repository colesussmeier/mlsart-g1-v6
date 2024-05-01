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
          <Image fill src="/heroCover.jpg" alt="background" quality={90} priority={true}/>
        </div>
        <div className="flex flex-col items-center justify-center h-screen">
          <ScrollToButton />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
          <p className="text-3xl lg:text-4xl pb-5 lg:pb-12 text-center text-custom-blue pt-5">Local watercolor artist in the Hudson Valley</p>
      </div>
      <div className="text-black max-w-64 lg:max-w-7xl mx-auto px-2 lg:px-7 space-y-5 lg:space-y-0 lg:space-x-28 flex flex-col lg:flex-row items-center justify-center pt-5 pb-16">
      <p className="text-black">
        Having lived in the Hudson Valley my entire life, I&apos;ve developed a deep appreciation for its beauty. 
        This includes the mountains, the Hudson River, and the quaint towns along the river. 
        I&apos;m also captivated by the woods, the small streams and ponds, all encased in the most beautiful skies. 
        The colors of nature have always fascinated me and are reflective in my painting.
        </p>
        <p>
          As an Interior Designer, design and color were always things I spent much of my time thinking about. 
          After raising my kids, I couldn&apos;t wait to get started on my watercolor journey. Painting has always
          been therapeutic for me and I look forward to every moment that I can get doing what I love.
        </p>
        </div>
        <div>
      <h1 className="text-5xl text-center pb-16 text-custom-blue">Gallery</h1>
        <Gallery />
      </div>
    </>
  );
}