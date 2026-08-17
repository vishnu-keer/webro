import type { QualityTier } from './types';

const TIERS: Record<QualityTier['name'], QualityTier> = {
  phone: { name: 'phone', pixelRatio: 1.5, density: 0.45, antialias: false },
  tablet: { name: 'tablet', pixelRatio: 1.75, density: 0.7, antialias: true },
  desktop: { name: 'desktop', pixelRatio: 2, density: 1, antialias: true },
};

/**
 * Phones still get the animation — just fewer objects and a lower pixel ratio.
 * That is the difference between 60fps and a warm battery.
 */
export function detectQuality(width: number = window.innerWidth): QualityTier {
  if (width < 700) return TIERS.phone;
  if (width < 1100) return TIERS.tablet;
  return TIERS.desktop;
}

/** Scales a desktop object count down for the current tier. */
export function scaleCount(base: number, quality: QualityTier, minimum = 3): number {
  return Math.max(minimum, Math.round(base * quality.density));
}
