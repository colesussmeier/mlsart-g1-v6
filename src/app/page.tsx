import 'server-only';

import Image from "next/image";
import React from 'react';
import FadeInView from "./components/fadeInView";
import GallerySection from "./components/GallerySection";
import { Metadata } from "next";
import VhFixer from "./components/VhFixer";

export const metadata: Metadata = {
  title: 'MLS Watercolors',
  description: 'Original Hudson Valley watercolors painted by Mary Lou Sussmeier',
  icons: '/favicon.ico',
};

export default function Home() {
  return (
    <>
      <VhFixer />
      <div className="flex flex-col items-center justify-between relative insta-fix-height">
        <div className="absolute inset-0 z-[-1]">
          <Image fill src="/heroCover1.jpg" alt="background" quality={100} priority={true}/>
        </div>
        <div className="flex flex-col items-center justify-center h-screen mt-36">
          <div className="max-w-[85%]">
            <FadeInView>
              <h1 className="text-2xl lg:text-5xl text-center text-custom-blue pb-12">
                Local watercolor artist in New York&apos;s Beautiful Hudson Valley
              </h1>
            </FadeInView>
          </div>
        </div>
      </div>
      <GallerySection />
    </>
  );
}