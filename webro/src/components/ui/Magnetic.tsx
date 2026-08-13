'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import * as React from 'react';

type MagneticProps = {
  children: React.ReactNode;
  className?: string;
  /** How far the element drifts toward the cursor (0–1). */
  strength?: number;
};

/** Subtle cursor-attraction wrapper for CTAs. Disabled on touch devices. */
export default function Magnetic({ children, className, strength = 0.25 }: MagneticProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 180, damping: 18, mass: 0.4 });

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const rect = node.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
