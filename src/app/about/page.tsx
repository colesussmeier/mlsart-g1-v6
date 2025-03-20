'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import FadeInView from '../components/fadeInView';
import Link from 'next/link';

const About = () => {
  const urlPrefix = 'https://image-bucketa5861-dev.s3.us-east-1.amazonaws.com/About'
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Dispatch a custom scroll event with the container's scroll position
      const scrollEvent = new CustomEvent('containerScroll', {
        detail: { scrollTop: container.scrollTop }
      });
      window.dispatchEvent(scrollEvent);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col items-center scroll-smooth">
      <div ref={scrollContainerRef} className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth">
        <section className="min-h-screen w-full flex items-center justify-center p-6 snap-start">
          <FadeInView className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 space-y-4">
              <h2 className="text-2xl font-semibold text-custom-blue">
              &quot;If you could do anything you wanted, what would it be?&quot;
              </h2>
              <p className="text-2xl italic text-right pt-10 font-semibold">
              &quot;I&apos;d paint all the time.&quot;
              </p>
            </div>
            <div className="lg:w-2/3">
              <Image
                src={urlPrefix + '/aboutHero.PNG'}
                alt="Mary Lou painting"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
                priority={true}
              />
            </div>
          </FadeInView>
        </section>

        <section className="min-h-screen w-full flex items-center justify-center bg-custom-bg-blue p-4 snap-start">
          <FadeInView delay={0.2} className="max-w-4xl mx-auto flex flex-col-reverse lg:flex-row items-center lg:gap-20 pb-[75px] lg:pb-0">
            <div className="lg:w-1/2 px-8 py-4">
              <Image
                src="/headshot.jpg"
                alt="Mary Lou painting"
                width={400}
                height={400}
                className="rounded-lg shadow-lg"
                priority={true}
              />
            </div>
            <div className="lg:w-1/2 space-y-4">
              <h2 className="text-2xl text-center font-bold mb-4 text-custom-blue">About Mary Lou</h2>
              <ul className="text-sm md:text-md space-y-4 list-disc pl-5 md:p-10 md:pl-15 lg:p-0 lg:pl-7">
                <FadeInView delay={0.4}>
                  <li>Graduate of the Fashion Institute of Technology in NYC, specializing in interior design</li>
                </FadeInView>
                <FadeInView delay={0.6}>
                  <li>Previously a professional interior designer for Ethan Allen and The Melville Corporation</li>
                </FadeInView>
                <FadeInView delay={0.8}>
                  <li>Independent consultant for custom home design and decor</li>
                </FadeInView>
                <FadeInView delay={1.0}>
                  <li>A lifelong artist and a watercolor painter of over 9 years</li>
                </FadeInView>
              </ul>
            </div>
          </FadeInView>
        </section>

        <section className="min-h-screen w-full flex items-center justify-center p-4 snap-start">
          <FadeInView delay={0.3} className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-5 md:gap-20 pb-[75px] lg:pb-0">
            <div className="lg:w-1/2 space-y-4">
              <h2 className="text-2xl text-center font-bold text-custom-blue">The Woods</h2>
              <p className="text-center">
                Mary Lou creates vibrant watercolors of the woods of her hometown, 
                Cold Spring, New York, a river town in the magnificent Hudson Valley.
              </p>
            </div>
            <div className="lg:w-2/3">
              <div className="grid grid-rows-3 gap-2 py-2">
                <FadeInView delay={0.4}>
                  <div className="aspect-[4/5] w-1/3 rounded-lg shadow-lg overflow-hidden mx-auto">
                    <Image
                      src={urlPrefix + '/Woods/woods1.PNG'}
                      alt="Woods watercolor 1"
                      width={400}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </FadeInView>
                <div className="grid grid-cols-2 gap-2 w-full my-auto">
                  <FadeInView delay={0.6}>
                    <div className="aspect-[5/4] w-full rounded-lg shadow-lg overflow-hidden">
                      <Image
                        src={urlPrefix + '/Woods/woods2.PNG'}
                        alt="Woods watercolor 2"
                        width={500}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </FadeInView>
                  <FadeInView delay={1}>
                    <div className="aspect-[5/4] w-full rounded-lg shadow-lg overflow-hidden">
                      <Image
                        src={urlPrefix + '/Woods/woods4.PNG'}
                        alt="Woods watercolor 4"
                        width={500}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </FadeInView>
                </div>
                <FadeInView delay={0.8}>
                  <div className="aspect-[4/5] w-1/3 rounded-lg shadow-lg overflow-hidden mx-auto">
                    <Image
                      src={urlPrefix + '/Woods/woods3.PNG'}
                      alt="Woods watercolor 3"
                      width={400}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </FadeInView>
              </div>
            </div>
          </FadeInView>
        </section>

        <section className="min-h-screen w-full flex items-center justify-center bg-custom-bg-blue p-4 snap-start">
          <FadeInView delay={0.3} className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-5 md:gap-20 pb-[75px] lg:pb-0">
          <div className="lg:w-2/3">
              <div className="grid grid-rows-3 gap-2">
                <FadeInView delay={0.4}>
                  <div className="aspect-[4/5] w-1/3 rounded-lg shadow-lg overflow-hidden mx-auto">
                    <Image
                      src={urlPrefix + '/Streams/stream1.PNG'}
                      alt="Streams watercolor 1"
                      width={400}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </FadeInView>
                <div className="grid grid-cols-2 gap-2 w-full my-auto">
                  <FadeInView delay={1}>
                    <div className="aspect-[5/4] w-full rounded-lg shadow-lg overflow-hidden">
                      <Image
                        src={urlPrefix + '/Streams/stream2.PNG'}
                        alt="Streams watercolor 2"
                        width={500}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </FadeInView>
                  <FadeInView delay={0.6}>
                    <div className="aspect-[5/4] w-full rounded-lg shadow-lg overflow-hidden">
                      <Image
                        src={urlPrefix + '/Streams/stream4.PNG'}
                        alt="Streams watercolor 4"
                        width={500}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </FadeInView>
                </div>
                <FadeInView delay={0.8}>
                  <div className="aspect-[4/5] w-1/3 rounded-lg shadow-lg overflow-hidden mx-auto">
                    <Image
                      src={urlPrefix + '/Streams/stream3.PNG'}
                      alt="Streams watercolor 3"
                      width={400}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </FadeInView>
              </div>
            </div>
            <div className="lg:w-1/2 space-y-4 pb-2">
              <h2 className="text-2xl text-center font-bold text-custom-blue">Streams & Ponds</h2>
              <p className="text-center">
                Like a bee or a bird, Mary Lou&apos;s eyes are drawn to the silver of the streams
                and reflective surfaces of the ponds throughout the Hudson Valley.
              </p>
            </div>
          </FadeInView>
        </section>

        <section className="min-h-screen w-full flex items-center justify-center p-4 snap-start">
          <FadeInView delay={0.3} className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-5 lg:gap-20 pb-[75px] lg:pb-0">
            <div className="lg:w-1/2 space-y-4 pb-4">
              <h2 className="text-2xl text-center font-bold text-custom-blue">Colors of the Sky</h2>
              <p className="text-center">
                The oranges, blues, and purples of the dawning and dusking skies
                provide endless inspiration for Mary Lou&apos;s paintings.
              </p>
            </div>
            <div className="lg:w-2/3">
              <div className="grid grid-cols-2 gap-2">
                <FadeInView delay={0.4}>
                  <div className="aspect-[5/4] w-full rounded-lg shadow-lg overflow-hidden">
                    <Image
                      src={urlPrefix + '/Sky/sky1.PNG'}
                      alt="Sky watercolor 1"
                      width={500}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </FadeInView>
                <FadeInView delay={0.5}>
                  <div className="aspect-[5/4] w-full rounded-lg shadow-lg overflow-hidden">
                    <Image
                      src={urlPrefix + '/Sky/sky2.PNG'}
                      alt="Sky watercolor 2"
                      width={500}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </FadeInView>
                <FadeInView delay={0.6}>
                  <div className="aspect-[5/4] w-full rounded-lg shadow-lg overflow-hidden">
                    <Image
                      src={urlPrefix + '/Sky/sky3.PNG'}
                      alt="Sky watercolor 3"
                      width={500}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </FadeInView>
                <FadeInView delay={0.7}>
                  <div className="aspect-[5/4] w-full rounded-lg shadow-lg overflow-hidden">
                    <Image
                      src={urlPrefix + '/Sky/sky4.PNG'}
                      alt="Sky watercolor 4"
                      width={500}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </FadeInView>
              </div>
            </div>
          </FadeInView>
        </section>

        <section className="min-h-screen w-full flex items-center justify-center bg-custom-bg-blue p-4 snap-start">
          <FadeInView delay={0.3} className="max-w-4xl mx-auto flex flex-col items-center gap-8 text-center pb-[75px] lg:pb-0">
            <h2 className="text-3xl font-bold text-custom-blue">Get in Touch</h2>
            <p className="max-w-2xl">
              Interested in commissioning a watercolor painting or purchasing an existing piece? 
              Mary Lou would love to hear from you! Contact her using the information below.
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-custom-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>msussmeierart@gmail.com</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="h-6 w-6 relative">
                  <Image 
                    src="/instagram.png" 
                    alt="Instagram" 
                    fill 
                    className="text-custom-blue"
                  />
                </div>
                <a href="https://www.instagram.com/msussmeierart" target="_blank" rel="noopener noreferrer" className="hover:underline">@msussmeierart</a>
              </div>
              <div className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-custom-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Cold Spring, NY</span>
              </div>
            </div>
            
            <Link 
              href="/" 
              className="mt-6 px-4 py-2 text-lg text-custom-blue border-[0.1px] border-solid border-gray-400 rounded-md hover:bg-gray-50 transition-colors"
            >
              Return Home
            </Link>
          </FadeInView>
        </section>
      </div>
    </div>
  );
};

export default About;