import type { Metadata } from 'next';
import { ArrowUpRight, Quote } from 'lucide-react';

import CTASection from '@/components/home/CTASection';
import PageHero from '@/components/layout/PageHero';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import { STANDARDS, VALUES } from '@/lib/data';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Webro Studio is an AI-first agency built on a simple bet: taste and engineering rigour are the same discipline. Our philosophy, standards and values.',
  alternates: { canonical: '/about' },
};

const TIMELINE = [
  {
    year: '2021',
    title: 'Started as one engineer and a stubborn opinion',
    body: 'That most agency websites were slow, forgettable and built to be replaced in eighteen months.',
  },
  {
    year: '2023',
    title: 'Became a studio',
    body: 'Design and engineering merged into one team. Handoff documents disappeared. Quality went up.',
  },
  {
    year: '2024',
    title: 'Added the automation practice',
    body: 'Clients stopped asking for websites and started asking what else the machine could run.',
  },
  {
    year: '2025',
    title: 'AI-first by default',
    body: 'Every engagement now ships with an intelligence layer — retrieval, routing or internal copilots.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={
          <>
            A small studio with an{' '}
            <span className="italic text-gold-lux">unreasonable standard</span>
          </>
        }
        description="We are deliberately small. Fewer clients, deeper work, and a senior person on every part of your project — not a pitch team followed by a junior handover."
        glow="neutral"
      >
        <Button href="/contact" size="lg" variant="outline">
          Work with us
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </PageHero>

      {/* Narrative */}
      <section className="section pt-0">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="space-y-6 text-base leading-relaxed text-white/60 sm:text-lg">
                  <p className="font-display text-2xl leading-snug text-white sm:text-3xl">
                    Most websites fail quietly. They load slowly, say nothing specific, and get
                    replaced two years later by another one exactly like it.
                  </p>
                  <p>
                    Webro started because that cycle is expensive and entirely avoidable. The
                    problem is rarely the design tool or the framework — it is that strategy,
                    design and engineering get split across three vendors who never speak, and the
                    thing that ships is the average of their disagreements.
                  </p>
                  <p>
                    So we built a studio where those three live in one room. The person who wrote
                    the positioning is in the same standup as the person shipping the component.
                    Decisions get made once, by people who understand the whole picture.
                  </p>
                  <p>
                    The AI part is not a bolt-on. Every engagement now asks the same question in
                    week one: which part of this business should a machine be handling? Usually
                    the honest answer is more than the client expected — lead qualification,
                    document intake, first-line support, internal reporting. We build that layer
                    alongside the site, not as a phase two that never arrives.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Standards panel */}
            <div className="lg:col-span-5">
              <Reveal delay={0.1}>
                <div className="glass sticky top-28 p-7 sm:p-8">
                  <h2 className="text-[11px] uppercase tracking-[0.22em] text-white/35">
                    Technical standards
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-white/50">
                    Non-negotiables on every build. If we cannot hit them, we say so before you
                    sign.
                  </p>

                  <dl className="mt-7 space-y-0">
                    {STANDARDS.map((standard) => (
                      <div
                        key={standard.label}
                        className="flex items-center justify-between gap-4 border-b border-white/[0.07] py-4 last:border-0"
                      >
                        <dt className="text-sm text-white/50">{standard.label}</dt>
                        <dd className="font-mono text-sm text-gold-soft">{standard.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section border-y border-white/[0.07] bg-obsidian-50/40">
        <div className="container">
          <SectionHeader
            eyebrow="Philosophy"
            title={
              <>
                What we actually <span className="italic text-gold-lux">believe</span>
              </>
            }
            description="Not wall art. These are the arguments we have internally, written down."
          />

          <div className="mt-14 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.06}>
                <div className="glass glass-hover group h-full p-7">
                  <span className="font-mono text-[11px] text-white/25">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-5 font-display text-xl tracking-tight text-white">
                    {value.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/50">{value.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Trajectory"
            title={
              <>
                How we got <span className="italic text-gold-lux">here</span>
              </>
            }
          />

          <ol className="mt-14 sm:mt-16">
            {TIMELINE.map((entry, index) => (
              <Reveal key={entry.year} delay={index * 0.06} as="li">
                <div className="group grid gap-4 border-b border-white/[0.07] py-8 transition-colors duration-500 hover:border-white/20 sm:grid-cols-12 sm:gap-8">
                  <span className="font-mono text-sm text-gold sm:col-span-2">{entry.year}</span>
                  <h3 className="font-display text-xl tracking-tight text-white sm:col-span-5 sm:text-2xl">
                    {entry.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/50 sm:col-span-5">
                    {entry.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>

          {/* Closing statement */}
          <Reveal delay={0.1}>
            <blockquote className="glass mt-16 p-8 sm:p-12">
              <Quote className="h-7 w-7 text-gold/40" strokeWidth={1.5} />
              <p className="mt-6 max-w-3xl text-balance font-display text-2xl leading-snug text-white sm:text-3xl">
                We would rather turn down a project than ship something we would not put our name
                on. That has cost us revenue. It has never cost us a client.
              </p>
              <footer className="mt-7 text-sm text-white/35">— The Webro Studio team</footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
