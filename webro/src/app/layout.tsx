import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';

import './globals.css';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import PageTransition from '@/components/layout/PageTransition';
import { SITE } from '@/lib/data';

const display = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    'web design agency',
    'Next.js development',
    'AI automation agency',
    'luxury web design',
    'React development',
    'brand identity',
    'performance engineering',
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export const viewport: Viewport = {
  themeColor: '#050505',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  email: SITE.email,
  areaServed: 'Worldwide',
  serviceType: [
    'Web Development',
    'AI Automation',
    'Brand Identity',
    'Performance Engineering',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <body className="noise min-h-screen bg-obsidian font-sans text-white">
        <script
          type="application/ld+json"
          // Structured data must be injected as raw JSON for crawlers.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-[100] focus:rounded-full focus:border focus:border-white/20 focus:bg-obsidian-200 focus:px-5 focus:py-2.5 focus:text-sm"
        >
          Skip to content
        </a>

        <Navbar />

        <main id="main" className="relative">
          <PageTransition>{children}</PageTransition>
        </main>

        <Footer />
      </body>
    </html>
  );
}
