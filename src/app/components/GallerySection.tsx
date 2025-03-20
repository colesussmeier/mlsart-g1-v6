'use client';

import React, { useState, useRef, useEffect } from 'react';
import Gallery from './gallery';
import FadeInView from './fadeInView';
import { MdSwapVert } from 'react-icons/md';

export default function GallerySection() {
  const [sortOrder, setSortOrder] = useState<'landscape-first' | 'floral-first'>('landscape-first');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (option: 'landscape-first' | 'floral-first') => {
    setSortOrder(option);
    setIsOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center gap-4 mb-8 pt-[80px] pl-5">
          <FadeInView delay={0.1}>
            <h2 className="text-3xl lg:text-6xl text-custom-blue">
              Gallery
            </h2>
          </FadeInView>
          <FadeInView delay={0.2}>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Change collection order"
                aria-label="Toggle collection order"
                aria-expanded={isOpen}
                aria-haspopup="true"
              >
                <MdSwapVert className="w-6 h-6 lg:w-10 lg:h-10 text-custom-blue" />
              </button>
              
              {isOpen && (
                <div className="absolute right-[-40px] lg:right-7 mt-2 py-2 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <button
                    className={`w-full text-left whitespace-nowrap px-4 py-4 text-sm hover:bg-gray-100 transition-colors ${
                      sortOrder === 'landscape-first' ? 'text-custom-blue font-medium' : 'text-gray-700'
                    }`}
                    onClick={() => handleOptionClick('landscape-first')}
                  >
                    Show Landscape Collection First
                  </button>
                  <button
                    className={`w-full text-left whitespace-nowrap px-4 py-4 text-sm hover:bg-gray-100 transition-colors ${
                      sortOrder === 'floral-first' ? 'text-custom-blue font-medium' : 'text-gray-700'
                    }`}
                    onClick={() => handleOptionClick('floral-first')}
                  >
                    Show Floral Collection First
                  </button>
                </div>
              )}
            </div>
          </FadeInView>
        </div>
      </div>
      <Gallery sortOrder={sortOrder} />
    </div>
  );
} 