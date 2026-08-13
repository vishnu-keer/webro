'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, Mail } from 'lucide-react';

import AmbientGlow from '@/components/ui/AmbientGlow';
import Button from '@/components/ui/Button';
import Magnetic from '@/components/ui/Magnetic';
import { SITE } from '@/lib/data';
import { EASE_LUX, viewportOnce } from '@/lib/utils';

const ASSURANCES = [
  'Reply within one business day',
  'Fixed scope, fixed price',
  'No obligation on the first call',
];

/** Closing conversion block used at the foot of every page. */
export default function CTASection() {
  return (
    <section className="section relative overflow-hidden">
      <AmbientGlow variant="gold" grid />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.85, ease: EASE_LUX }}
          className="glass relative overflow-hidden px-6 py-16 text-center sm:px-12 sm:py-20 lg:py-24"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gold-line"
          />

          <span className="eyebrow">
            <span className="h-1 w-1 rounded-full bg-gold" />
            Let&apos;s build
          </span>

          <h2 className="mx-auto mt-8 max-w-3xl text-balance font-display text-[clamp(2.2rem,6vw,4.5rem)] font-normal leading-[1.03] tracking-tight text-lux">
            Your next site should make the
            <span className="italic text-gold-lux"> competition nervous.</span>
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg">
            Tell us what you&apos;re building. We&apos;ll come back with a candid read on scope,
            timeline and whether we&apos;re the right studio for it.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Magnetic>
              <Button href="/contact" size="lg" className="w-full sm:w-auto">
                Book a consultation
                <Calendar className="h-4 w-4" />
              </Button>
            </Magnetic>

            <Magnetic>
              <Button
                href={`mailto:${SITE.email}`}
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Mail className="h-4 w-4" />
                {SITE.email}
              </Button>
            </Magnetic>
          </div>

          <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] text-white/35">
            {ASSURANCES.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <ArrowUpRight className="h-3.5 w-3.5 text-gold/60" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
