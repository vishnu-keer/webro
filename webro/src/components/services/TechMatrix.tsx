'use client';

import { motion } from 'framer-motion';
import * as React from 'react';

import { TECH_STACK } from '@/lib/data';
import { cn, EASE_LUX, viewportOnce } from '@/lib/utils';

/**
 * Interactive stack matrix. Hovering a category dims the others so the
 * grid reads as a system rather than a logo dump.
 */
export default function TechMatrix() {
  const [active, setActive] = React.useState<string | null>(null);

  return (
    <div className="mt-14 grid gap-4 sm:mt-16 sm:grid-cols-2">
      {TECH_STACK.map((group, groupIndex) => {
        const dimmed = active !== null && active !== group.category;

        return (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, delay: groupIndex * 0.08, ease: EASE_LUX }}
            onMouseEnter={() => setActive(group.category)}
            onMouseLeave={() => setActive(null)}
            className={cn(
              'glass glass-hover p-6 transition-opacity duration-500 sm:p-7',
              dimmed && 'opacity-40',
            )}
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display text-xl tracking-tight text-white">
                {group.category}
              </h3>
              <span className="font-mono text-[11px] text-white/25">
                {String(groupIndex + 1).padStart(2, '0')}
              </span>
            </div>

            <p className="mt-2 text-[13px] text-white/40">{group.note}</p>

            <div className="hairline my-6" />

            <ul className="flex flex-wrap gap-2">
              {group.items.map((item, itemIndex) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, scale: 0.94 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={viewportOnce}
                  transition={{
                    duration: 0.45,
                    delay: groupIndex * 0.08 + itemIndex * 0.04,
                    ease: EASE_LUX,
                  }}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[13px] text-white/60 transition-all duration-300 hover:border-gold/30 hover:bg-gold/[0.06] hover:text-white"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        );
      })}
    </div>
  );
}
