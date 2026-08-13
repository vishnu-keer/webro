import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge conditional class names with Tailwind conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Framer Motion viewport config used site-wide for scroll reveals. */
export const viewportOnce = { once: true, margin: '-80px' } as const;

/** Shared easing curve — matches the `ease-lux` Tailwind token. */
export const EASE_LUX = [0.16, 1, 0.3, 1] as const;

/** Standard fade-up reveal variant. */
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: EASE_LUX },
  }),
};

/** Parent container that staggers its children. */
export const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

/** Child of `staggerParent`. */
export const staggerChild = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_LUX } },
};
