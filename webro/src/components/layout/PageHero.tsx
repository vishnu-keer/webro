'use client';

import { motion } from 'framer-motion';
import * as React from 'react';

import AmbientGlow from '@/components/ui/AmbientGlow';
import { EASE_LUX } from '@/lib/utils';

type PageHeroProps = {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  glow?: 'violet' | 'emerald' | 'gold' | 'neutral';
  children?: React.ReactNode;
};

/** Shared inner-page masthead. Keeps every route on the same vertical rhythm. */
export default function PageHero({
  eyebrow,
  title,
  description,
  glow = 'violet',
  children,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden pb-16 pt-36 sm:pb-20 sm:pt-44">
      <AmbientGlow variant={glow} grid />

      <div className="container">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_LUX }}
          className="eyebrow"
        >
          <span className="h-1 w-1 rounded-full bg-gold" />
          {eyebrow}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease: EASE_LUX }}
          className="mt-7 max-w-4xl text-balance font-display text-[clamp(2.4rem,7vw,5.25rem)] font-normal leading-[1.02] tracking-[-0.03em] text-lux"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.16, ease: EASE_LUX }}
          className="mt-7 max-w-2xl text-base leading-relaxed text-white/55 sm:text-lg"
        >
          {description}
        </motion.p>

        {children ? (
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.24, ease: EASE_LUX }}
            className="mt-10"
          >
            {children}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
