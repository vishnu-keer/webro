import type { Metadata } from 'next';

import CTASection from '@/components/home/CTASection';
import PageHero from '@/components/layout/PageHero';
import Reveal from '@/components/ui/Reveal';
import WorkGrid from '@/components/work/WorkGrid';
import { METRICS } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Selected Webro Studio case studies across web apps, AI solutions and luxury branding — each shipped against a measurable business outcome.',
  alternates: { canonical: '/work' },
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Selected work"
        title={
          <>
            Work that had to <span className="italic text-gold-lux">earn its budget</span>
          </>
        }
        description="Every engagement below started with a number the client cared about. The outcome sits under each card — no vanity metrics, no invented awards."
        glow="gold"
      >
        <dl className="grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.05] sm:grid-cols-4">
          {METRICS.map((metric) => (
            <div key={metric.label} className="bg-obsidian px-5 py-5">
              <dt className="sr-only">{metric.label}</dt>
              <dd>
                <span className="block font-display text-2xl tracking-tight text-white sm:text-3xl">
                  {metric.decimals ? metric.value.toFixed(metric.decimals) : metric.value}
                  {metric.suffix}
                </span>
                <span className="mt-1.5 block text-[10px] uppercase tracking-[0.16em] text-white/35">
                  {metric.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <section className="section pt-4">
        <div className="container">
          <Reveal>
            <WorkGrid />
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
