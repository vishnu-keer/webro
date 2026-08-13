'use client';

import { motion } from 'framer-motion';
import * as React from 'react';

import { cn, EASE_LUX, viewportOnce } from '@/lib/utils';

type SectionHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
  /** Slot for a CTA rendered opposite the title on large screens. */
  action?: React.ReactNode;
};

/** Consistent section intro: eyebrow, display title, supporting copy. */
export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  action,
}: SectionHeaderProps) {
  const centered = align === 'center';

  return (
    <div
      className={cn(
        'flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between',
        centered && 'lg:flex-col lg:items-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', centered && 'mx-auto text-center')}>
        {eyebrow ? (
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, ease: EASE_LUX }}
            className="eyebrow"
          >
            <span className="h-1 w-1 rounded-full bg-gold" />
            {eyebrow}
          </motion.span>
        ) : null}

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.75, delay: 0.06, ease: EASE_LUX }}
          className="mt-6 text-balance text-4xl font-normal leading-[1.05] tracking-tight text-lux sm:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h2>

        {description ? (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.75, delay: 0.12, ease: EASE_LUX }}
            className={cn(
              'mt-6 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg',
              centered && 'mx-auto',
            )}
          >
            {description}
          </motion.p>
        ) : null}
      </div>

      {action ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.75, delay: 0.18, ease: EASE_LUX }}
          className="shrink-0"
        >
          {action}
        </motion.div>
      ) : null}
    </div>
  );
}
