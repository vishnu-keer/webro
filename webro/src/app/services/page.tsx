import type { Metadata } from 'next';
import { ArrowUpRight, Check } from 'lucide-react';

import CTASection from '@/components/home/CTASection';
import PageHero from '@/components/layout/PageHero';
import TechMatrix from '@/components/services/TechMatrix';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import { SERVICES } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Web architecture, AI agents, brand identity, performance engineering, interactive 3D and growth. The full Webro Studio capability stack.',
  alternates: { canonical: '/services' },
};

const ENGAGEMENTS = [
  {
    name: 'Sprint',
    price: 'From $6k',
    duration: '2 weeks',
    description: 'A focused strike on one problem — a landing page, a perf rescue, an agent MVP.',
    includes: ['Single workstream', 'Async updates', 'Deploy + handover', '2 revision rounds'],
  },
  {
    name: 'Build',
    price: 'From $24k',
    duration: '6–8 weeks',
    description: 'The full engagement: discovery, design, engineering and automation end to end.',
    includes: [
      'Strategy + art direction',
      'Full design system',
      'Production Next.js build',
      'AI automation layer',
      '30 days post-launch support',
    ],
    featured: true,
  },
  {
    name: 'Partner',
    price: 'From $8k/mo',
    duration: 'Rolling',
    description: 'An embedded product team on retainer, shipping against a quarterly roadmap.',
    includes: [
      'Dedicated squad',
      'Weekly ship cadence',
      'CRO experiment program',
      'Priority response SLA',
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Everything between the idea and the{' '}
            <span className="italic text-gold-lux">invoice you send</span>
          </>
        }
        description="Six disciplines, one accountable team. We take the strategy, the pixels, the code and the automation — so there is nobody to point at but us."
        glow="violet"
      >
        <Button href="/contact" size="lg">
          Discuss your project
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </PageHero>

      {/* Capability deep-dive */}
      <section className="section pt-0">
        <div className="container space-y-4">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;

            return (
              <Reveal key={service.slug} delay={index * 0.05}>
                <article
                  id={service.slug}
                  className="glass glass-hover group scroll-mt-28 p-7 sm:p-9 lg:p-10"
                >
                  <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
                    {/* Title column */}
                    <div className="lg:col-span-4">
                      <div className="flex items-center gap-4">
                        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/80 transition-colors duration-500 group-hover:text-gold">
                          <Icon className="h-5 w-5" strokeWidth={1.5} />
                        </span>
                        <span className="font-mono text-[11px] text-white/25">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>

                      <h2 className="mt-6 font-display text-2xl tracking-tight text-white sm:text-3xl">
                        {service.title}
                      </h2>

                      <p className="mt-4 text-sm leading-relaxed text-white/50">
                        {service.summary}
                      </p>
                    </div>

                    {/* Capabilities */}
                    <div className="lg:col-span-4">
                      <h3 className="text-[11px] uppercase tracking-[0.22em] text-white/35">
                        What we do
                      </h3>
                      <ul className="mt-5 space-y-3">
                        {service.capabilities.map((capability) => (
                          <li
                            key={capability}
                            className="flex items-start gap-2.5 text-sm text-white/55"
                          >
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/70" />
                            {capability}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Deliverables */}
                    <div className="lg:col-span-4">
                      <h3 className="text-[11px] uppercase tracking-[0.22em] text-white/35">
                        What you get
                      </h3>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {service.deliverables.map((deliverable) => (
                          <li
                            key={deliverable}
                            className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[13px] text-white/55"
                          >
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Tech stack matrix */}
      <section className="section border-y border-white/[0.07] bg-obsidian-50/40">
        <div className="container">
          <SectionHeader
            eyebrow="Tech stack"
            title={
              <>
                Boring where it counts, <span className="italic text-gold-lux">sharp</span> where
                it wins
              </>
            }
            description="We pick tools with long support horizons and large talent pools — you should never be locked into a stack only we can maintain."
          />
          <TechMatrix />
        </div>
      </section>

      {/* Engagement models */}
      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Engagements"
            title={
              <>
                Three ways to <span className="italic text-gold-lux">work together</span>
              </>
            }
            description="Fixed scope and fixed price on every model. Indicative ranges — the real number lands after a 30-minute scoping call."
            align="center"
          />

          <div className="mt-14 grid gap-4 sm:mt-16 lg:grid-cols-3">
            {ENGAGEMENTS.map((tier, index) => (
              <Reveal key={tier.name} delay={index * 0.08}>
                <div
                  className={
                    tier.featured
                      ? 'glass relative flex h-full flex-col border-gold/25 bg-gold/[0.03] p-7 sm:p-8'
                      : 'glass glass-hover flex h-full flex-col p-7 sm:p-8'
                  }
                >
                  {tier.featured ? (
                    <span className="absolute -top-3 left-7 rounded-full border border-gold/30 bg-obsidian px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gold">
                      Most chosen
                    </span>
                  ) : null}

                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-2xl tracking-tight text-white">
                      {tier.name}
                    </h3>
                    <span className="text-[11px] uppercase tracking-[0.16em] text-white/30">
                      {tier.duration}
                    </span>
                  </div>

                  <p className="mt-4 font-display text-3xl text-gold-lux">{tier.price}</p>

                  <p className="mt-4 text-sm leading-relaxed text-white/50">
                    {tier.description}
                  </p>

                  <div className="hairline my-7" />

                  <ul className="space-y-3">
                    {tier.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-white/55">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/70" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    <Button
                      href="/contact"
                      variant={tier.featured ? 'gold' : 'outline'}
                      className="w-full"
                    >
                      Start with {tier.name}
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
