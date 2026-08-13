'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Check } from 'lucide-react';
import Link from 'next/link';

import AmbientGlow from '@/components/ui/AmbientGlow';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { SERVICES } from '@/lib/data';
import { staggerChild, staggerParent, viewportOnce } from '@/lib/utils';

/** Capability cards. Hover reveals the underlying capability list. */
export default function ServicesGrid() {
  return (
    <section className="section relative">
      <AmbientGlow variant="emerald" />

      <div className="container">
        <SectionHeader
          eyebrow="Capabilities"
          title={
            <>
              One studio, the whole <span className="italic text-gold-lux">stack</span>
            </>
          }
          description="Strategy, design, engineering and automation under one roof — so nothing gets lost in a handoff between three vendors."
          action={
            <Button href="/services" variant="outline">
              Explore services
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          }
        />

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-14 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SERVICES.map((service) => {
            const Icon = service.icon;

            return (
              <motion.div key={service.slug} variants={staggerChild}>
                <GlassCard
                  spotlight
                  tint={service.accent}
                  className="group flex h-full flex-col p-6 sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/80 transition-colors duration-500 group-hover:border-white/20 group-hover:text-white">
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-white/20 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/70" />
                  </div>

                  <h3 className="mt-6 font-display text-xl tracking-tight text-white sm:text-[22px]">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-white/50">
                    {service.summary}
                  </p>

                  {/* Capability list — collapsed until hover/focus on desktop */}
                  <ul className="mt-5 space-y-2.5 lg:max-h-0 lg:overflow-hidden lg:opacity-0 lg:transition-all lg:duration-700 lg:ease-lux lg:group-hover:max-h-56 lg:group-hover:opacity-100">
                    {service.capabilities.map((capability) => (
                      <li
                        key={capability}
                        className="flex items-start gap-2.5 text-[13px] text-white/45"
                      >
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/70" />
                        {capability}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/services"
                    className="mt-auto inline-flex items-center gap-1.5 pt-7 text-[13px] text-white/50 transition-colors duration-300 hover:text-white"
                  >
                    <span className="sr-only">{service.title}: </span>
                    Learn more
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
