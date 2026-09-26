"use client";

import { useLayoutEffect } from 'react';

const STORAGE_KEY = 'home-scroll-y';
let returningHome = false;

if (typeof window !== 'undefined') {
    window.addEventListener('popstate', () => {
        returningHome = location.pathname === '/';
    });
}

// Firefox restores the scroll position on Back while the previous page is still on
// screen, clamping it to that page's height; scroll anchoring then pins the footer
// while the gallery renders above it, landing at the very bottom of the homepage.
export default function HomeScrollMemory() {
    useLayoutEffect(() => {
        if (returningHome) {
            returningHome = false;
            const saved = Number(sessionStorage.getItem(STORAGE_KEY));
            if (saved) window.scrollTo(0, saved);
        }

        let lastY = window.scrollY;
        const remember = () => { lastY = window.scrollY; };
        window.addEventListener('scroll', remember, { passive: true });
        // A layout cleanup runs as the homepage is removed, before the scroll events
        // caused by the shorter next page arrive and would overwrite the position.
        return () => {
            window.removeEventListener('scroll', remember);
            sessionStorage.setItem(STORAGE_KEY, String(lastY));
        };
    }, []);

    return null;
}
