import type { Metadata } from 'next';
import { Clock, Mail, MapPin, MessageSquare } from 'lucide-react';

import InquiryForm from '@/components/contact/InquiryForm';
import PageHero from '@/components/layout/PageHero';
import Reveal from '@/components/ui/Reveal';
import { SITE } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Tell Webro Studio what you are building. We reply within one business day with a candid read on scope, timeline and fit.',
  alternates: { canonical: '/contact' },
};

const FAQ = [
  {
    q: 'How fast can you start?',
    a: 'Usually within two weeks. We keep one slot open each month for projects that genuinely cannot wait.',
  },
  {
    q: 'Do you work with early-stage startups?',
    a: 'Yes — the Sprint engagement exists for exactly that. Small scope, senior team, no discount on quality.',
  },
  {
    q: 'Who actually does the work?',
    a: 'The people on the call. We are a small studio by design; there is no junior handover after you sign.',
  },
  {
    q: 'Do you hand over the code?',
    a: 'Always. You own the repo, the accounts and the infrastructure from day one. No hostage-taking.',
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Tell us what you&apos;re <span className="italic text-gold-lux">building</span>
          </>
        }
        description="Three short steps. It takes about ninety seconds, and it means our first reply is useful rather than a request for more information."
        glow="emerald"
      />

      <section className="section pt-0">
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
            {/* Form */}
            <div className="lg:col-span-7">
              <Reveal>
                <InquiryForm />
              </Reveal>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 lg:col-span-5">
              <Reveal delay={0.08}>
                <div className="glass p-7">
                  <h2 className="text-[11px] uppercase tracking-[0.22em] text-white/35">
                    Direct lines
                  </h2>

                  <div className="mt-6 space-y-5">
                    <a
                      href={`mailto:${SITE.email}`}
                      className="group flex items-start gap-4 transition-colors"
                    >
                      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/60 transition-colors group-hover:text-gold">
                        <Mail className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                      <span>
                        <span className="block text-[11px] uppercase tracking-[0.16em] text-white/30">
                          Email
                        </span>
                        <span className="mt-1 block text-sm text-white/70 transition-colors group-hover:text-white">
                          {SITE.email}
                        </span>
                      </span>
                    </a>

                    <div className="flex items-start gap-4">
                      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/60">
                        <MapPin className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                      <span>
                        <span className="block text-[11px] uppercase tracking-[0.16em] text-white/30">
                          Based in
                        </span>
                        <span className="mt-1 block text-sm text-white/70">{SITE.location}</span>
                      </span>
                    </div>

                    <div className="flex items-start gap-4">
                      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/60">
                        <Clock className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                      <span>
                        <span className="block text-[11px] uppercase tracking-[0.16em] text-white/30">
                          Response time
                        </span>
                        <span className="mt-1 block text-sm text-white/70">
                          Within one business day
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="hairline my-7" />

                  {/* Availability */}
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    <p className="text-sm text-white/60">
                      Two build slots open for Q4
                      <span className="mt-0.5 block text-[13px] text-white/30">
                        Consultations booking 3–5 days out
                      </span>
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* FAQ */}
              <Reveal delay={0.16}>
                <div className="glass p-7">
                  <h2 className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.22em] text-white/35">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Before you ask
                  </h2>

                  <dl className="mt-6">
                    {FAQ.map((item) => (
                      <div
                        key={item.q}
                        className="border-b border-white/[0.07] py-5 first:pt-0 last:border-0 last:pb-0"
                      >
                        <dt className="text-sm font-medium text-white/85">{item.q}</dt>
                        <dd className="mt-2 text-sm leading-relaxed text-white/45">{item.a}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
