'use client';

import { useEffect, useRef } from 'react';

interface FadeInViewProps {
  children: React.ReactNode;
  delay?: number;
  className?: string; // Add className prop
}

let observer: IntersectionObserver | undefined;

function getObserver() {
  observer ??= new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).dataset.inView = '';
        observer!.unobserve(entry.target);
      }
    }
  }, { rootMargin: '0px 0px -100px 0px' });
  return observer;
}

// The fade is a plain CSS transition on opacity and transform so it runs on the
// compositor; a JS-driven animation stutters whenever the main thread is busy
// scrolling or decoding images, which is most noticeable in Firefox.
export default function FadeInView({ children, delay = 0, className = '' }: FadeInViewProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const io = getObserver();
    io.observe(element);
    return () => io.unobserve(element);
  }, []);

  return (
    <div
      ref={ref}
      className={`fade-in-view w-full ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
