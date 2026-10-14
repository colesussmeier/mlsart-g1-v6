'use client';

import { RefObject, useEffect } from 'react';

const DURATION_MS = 600;
// Wheel events closer together than this are one gesture: a spin of the wheel,
// or a trackpad swipe and the momentum events that trail it.
const GESTURE_GAP_MS = 200;
// Ignores trackpad jitter while still firing on a single mouse wheel notch.
const TRIGGER_DELTA = 30;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

function pixelDelta(event: WheelEvent, pageHeight: number) {
    if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * 16;
    if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) return event.deltaY * pageHeight;
    return event.deltaY;
}

// Native snapping turns a wheel gesture into however many sections the browser
// thinks it covered, animated differently in every browser. This moves exactly
// one section per gesture instead. Touch scrolling never fires wheel events, so
// it keeps the native snapping.
export function usePagedWheelScroll(containerRef: RefObject<HTMLElement | null>) {
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let frame = 0;
        let animating = false;
        let gestureUsed = false;
        let accumulated = 0;
        let lastWheel = -Infinity;

        const restoreSnapping = () => {
            container.style.scrollSnapType = '';
            container.style.scrollBehavior = '';
        };

        const animateTo = (target: number) => {
            const start = container.scrollTop;
            const startTime = performance.now();
            animating = true;
            // Mandatory snapping would pull every in-between position back to a section.
            container.style.scrollSnapType = 'none';
            container.style.scrollBehavior = 'auto';

            const step = (now: number) => {
                const progress = Math.min((now - startTime) / DURATION_MS, 1);
                container.scrollTop = start + (target - start) * easeInOutCubic(progress);
                if (progress < 1) {
                    frame = requestAnimationFrame(step);
                } else {
                    restoreSnapping();
                    animating = false;
                }
            };
            frame = requestAnimationFrame(step);
        };

        const onWheel = (event: WheelEvent) => {
            // Ctrl + wheel is pinch-to-zoom on trackpads.
            if (event.ctrlKey || event.deltaY === 0) return;

            const now = performance.now();
            if (now - lastWheel > GESTURE_GAP_MS) {
                gestureUsed = false;
                accumulated = 0;
            }
            lastWheel = now;

            if (animating || gestureUsed) {
                event.preventDefault();
                return;
            }

            const viewTop = container.scrollTop;
            const viewHeight = container.clientHeight;
            const containerTop = container.getBoundingClientRect().top;
            const sections = Array.from(container.children, (section) => {
                const rect = section.getBoundingClientRect();
                const top = rect.top - containerTop + viewTop;
                return { top, bottom: top + rect.height };
            });
            const index = Math.max(sections.findLastIndex(({ top }) => top <= viewTop + 1), 0);
            const current = sections[index];
            const down = pixelDelta(event, viewHeight) > 0;

            // A section taller than the screen scrolls normally until its edge is reached.
            const roomInside = down ? current.bottom - (viewTop + viewHeight) : viewTop - current.top;
            if (roomInside > 1) return;

            const next = sections[index + (down ? 1 : -1)];
            // Past the first or last section, let the page itself scroll (e.g. to the footer).
            if (!next) return;

            event.preventDefault();
            accumulated += pixelDelta(event, viewHeight);
            if (Math.abs(accumulated) < TRIGGER_DELTA) return;

            gestureUsed = true;
            const maxScroll = container.scrollHeight - viewHeight;
            const target = down ? next.top : Math.max(next.top, next.bottom - viewHeight);
            animateTo(Math.min(target, maxScroll));
        };

        container.addEventListener('wheel', onWheel, { passive: false });
        return () => {
            container.removeEventListener('wheel', onWheel);
            cancelAnimationFrame(frame);
            restoreSnapping();
        };
    }, [containerRef]);
}
