'use client';

import { motion } from 'framer-motion';
import * as React from 'react';

import { cn, EASE_LUX, viewportOnce } from '@/lib/utils';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Travel distance in px before settling. */
  y?: number;
  as?: 'div' | 'li' | 'section' | 'article';
};

/** Scroll-triggered fade-up wrapper used across every section. */
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
  as = 'div',
}: RevealProps) {
  const MotionTag = motion[as];

  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.75, delay, ease: EASE_LUX }}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  );
}
