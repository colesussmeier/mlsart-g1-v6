"use client";
import { useEffect } from "react";

export default function InstagramVhFixer() {
  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor;
    const isInstagram = ua.includes("Instagram");
    if (isInstagram) {
      document.documentElement.classList.add('instagram-inapp');
      const setVh = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--app-vh', `${vh}px`);
      };
      setVh();
      window.addEventListener('resize', setVh);
      return () => window.removeEventListener('resize', setVh);
    }
  }, []);
  return null;
} 