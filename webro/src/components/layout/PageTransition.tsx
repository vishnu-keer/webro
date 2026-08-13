'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { EASE_LUX } from '@/lib/utils';

/**
 * Route-level fade/lift. Keyed on pathname so each navigation replays.
 * Deliberately short (0.45s) so it never delays perceived load.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE_LUX }}
    >
      {children}
    </motion.div>
  );
}
