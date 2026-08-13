'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import * as React from 'react';

import { cn } from '@/lib/utils';

type GlassCardProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  children?: React.ReactNode;
  /** Adds hover border/glow transition. */
  interactive?: boolean;
  /** Renders a soft radial spotlight that follows the cursor. */
  spotlight?: boolean;
  /** Tailwind gradient stops for the ambient tint, e.g. `from-violet-500/20`. */
  tint?: string;
};

/**
 * The core surface primitive: `backdrop-blur` glass over obsidian with a
 * 1px hairline border and an optional cursor-tracking spotlight.
 */
const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, interactive = true, spotlight = false, tint, ...props }, ref) => {
    const [coords, setCoords] = React.useState({ x: 50, y: 50 });
    const [hovered, setHovered] = React.useState(false);

    const handleMove = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (!spotlight) return;
        const rect = event.currentTarget.getBoundingClientRect();
        setCoords({
          x: ((event.clientX - rect.left) / rect.width) * 100,
          y: ((event.clientY - rect.top) / rect.height) * 100,
        });
      },
      [spotlight],
    );

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          'glass group relative isolate overflow-hidden',
          interactive && 'glass-hover',
          className,
        )}
        {...props}
      >
        {tint ? (
          <div
            aria-hidden
            className={cn(
              'pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br opacity-0 transition-opacity duration-700 group-hover:opacity-100',
              tint,
            )}
          />
        ) : null}

        {spotlight ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500"
            style={{
              opacity: hovered ? 1 : 0,
              background: `radial-gradient(420px circle at ${coords.x}% ${coords.y}%, rgba(255,255,255,0.07), transparent 60%)`,
            }}
          />
        ) : null}

        {children}
      </motion.div>
    );
  },
);

GlassCard.displayName = 'GlassCard';

export default GlassCard;
