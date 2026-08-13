import type { Metadata } from 'next';

import CTASection from '@/components/home/CTASection';
import ClientTicker from '@/components/home/ClientTicker';
import Hero from '@/components/home/Hero';
import Process from '@/components/home/Process';
import SelectedWork from '@/components/home/SelectedWork';
import ServicesGrid from '@/components/home/ServicesGrid';

export const metadata: Metadata = {
  title: 'Webro Studio — Digital craft for brands that refuse to blend in',
  description:
    'AI-first digital agency engineering premium websites, custom software and intelligent automation. Next.js, React, and AI agents built to move the numbers that matter.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ClientTicker />
      <SelectedWork />
      <ServicesGrid />
      <Process />
      <CTASection />
    </>
  );
}
