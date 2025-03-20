'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface FadeInViewProps {
  children: React.ReactNode;
  delay?: number;
  className?: string; // Add className prop
}

export default function FadeInView({ children, delay = 0, className = '' }: FadeInViewProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  return (
    <motion.div
      ref={ref}
      className={`w-full ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{
        duration: .8,
        delay: delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
}