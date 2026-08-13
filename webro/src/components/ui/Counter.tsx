'use client';

import { animate, useInView } from 'framer-motion';
import * as React from 'react';

type CounterProps = {
  value: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
};

/**
 * Counts from 0 to `value` the first time it scrolls into view.
 * Uses a ref-write rather than state to avoid a render per frame.
 */
export default function Counter({
  value,
  suffix = '',
  decimals = 0,
  duration = 1.8,
  className,
}: CounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  React.useEffect(() => {
    if (!inView || !ref.current) return;

    const node = ref.current;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      node.textContent = value.toFixed(decimals) + suffix;
      return;
    }

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        node.textContent = latest.toFixed(decimals) + suffix;
      },
    });

    return () => controls.stop();
  }, [inView, value, decimals, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}
