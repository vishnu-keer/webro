/** Logos shown in the marquee. Slugs map to the devicon CDN path. */
export interface TechLogo {
  readonly name: string;
  readonly slug: string;
}

export const techLogos: readonly TechLogo[] = [
  { name: 'React', slug: 'react/react-original' },
  { name: 'Next.js', slug: 'nextjs/nextjs-original' },
  { name: 'Node.js', slug: 'nodejs/nodejs-original' },
  { name: 'TypeScript', slug: 'typescript/typescript-original' },
  { name: 'Tailwind', slug: 'tailwindcss/tailwindcss-original' },
  { name: 'Figma', slug: 'figma/figma-original' },
  { name: 'WordPress', slug: 'wordpress/wordpress-plain' },
  { name: 'Shopify', slug: 'shopify/shopify-original' },
  { name: 'Python', slug: 'python/python-original' },
  { name: 'Firebase', slug: 'firebase/firebase-plain' },
  { name: 'Flutter', slug: 'flutter/flutter-original' },
  { name: 'MongoDB', slug: 'mongodb/mongodb-original' },
];
