/** Logos shown in the marquee. Slugs map to the devicon CDN path. */
export interface TechLogo {
  readonly name: string;
  readonly slug: string;
}

/**
 * Deliberately four, not twelve.
 *
 * A twelve-logo wall mixing WordPress, Shopify, Flutter and MongoDB reads as
 * "we do anything", which a buyer hears as "they specialise in nothing" — and
 * a cafe owner does not know what MongoDB is. These four cover what actually
 * ships client work and are recognisable enough to mean something.
 */
export const techLogos: readonly TechLogo[] = [
  { name: 'React', slug: 'react/react-original' },
  { name: 'Next.js', slug: 'nextjs/nextjs-original' },
  { name: 'Shopify', slug: 'shopify/shopify-original' },
  { name: 'Figma', slug: 'figma/figma-original' },
];
