'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import * as React from 'react';

import SectionHeader from '@/components/ui/SectionHeader';
import { PROCESS } from '@/lib/data';
import { cn, EASE_LUX } from '@/lib/utils';

/**
 * Interactive workflow timeline. Steps act as a tablist on desktop and
 * stack into a vertical rail on mobile.
 */
export default function Process() {
  const [active, setActive] = React.useState(0);
  const step = PROCESS[active];
  const Icon = step.icon;

  return (
    <section className="section relative border-y border-white/[0.07] bg-obsidian-50/40">
      <div className="container">
        <SectionHeader
          eyebrow="How we work"
          title={
            <>
              Five phases, zero <span className="italic text-gold-lux">mystery</span>
            </>
          }
          description="You always know what week you're in, what's being built, and what we need from you next."
        />

        <div className="mt-14 grid gap-10 sm:mt-16 lg:grid-cols-12 lg:gap-12">
          {/* Step rail */}
          <div
            role="tablist"
            aria-label="Engagement phases"
            aria-orientation="vertical"
            className="lg:col-span-5"
          >
            {PROCESS.map((item, index) => {
              const isActive = index === active;

              return (
                <button
                  key={item.id}
                  role="tab"
                  id={`process-tab-${item.id}`}
                  aria-selected={isActive}
                  aria-controls={`process-panel-${item.id}`}
                  onClick={() => setActive(index)}
                  onMouseEnter={() => setActive(index)}
                  className={cn(
                    'group relative flex w-full items-center gap-5 border-b border-white/[0.07] py-5 text-left transition-colors duration-500',
                    isActive ? 'text-white' : 'text-white/40 hover:text-white/70',
                  )}
                >
                  {/* Active indicator */}
                  <span
                    aria-hidden
                    className={cn(
                      'absolute bottom-[-1px] left-0 h-px bg-gold-line transition-all duration-700 ease-lux',
                      isActive ? 'w-full opacity-100' : 'w-0 opacity-0',
                    )}
                  />

                  <span
                    className={cn(
                      'font-mono text-xs transition-colors duration-500',
                      isActive ? 'text-gold' : 'text-white/25',
                    )}
                  >
                    {item.id}
                  </span>

                  <span className="flex-1 font-display text-xl tracking-tight sm:text-2xl">
                    {item.title}
                  </span>

                  <span className="text-[11px] uppercase tracking-[0.16em] text-white/25">
                    {item.duration}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-7">
            <div className="glass relative h-full overflow-hidden p-7 sm:p-9">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.14),transparent_70%)] blur-2xl"
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id}
                  role="tabpanel"
                  id={`process-panel-${step.id}`}
                  aria-labelledby={`process-tab-${step.id}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: EASE_LUX }}
                >
                  <div className="flex items-center gap-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-gold">
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/35">
                        {step.phase}
                      </p>
                      <h3 className="mt-1 font-display text-2xl tracking-tight text-white sm:text-3xl">
                        {step.title}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-7 text-base leading-relaxed text-white/55">
                    {step.description}
                  </p>

                  <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                    {step.points.map((point, index) => (
                      <motion.li
                        key={point}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 + index * 0.06, ease: EASE_LUX }}
                        className="flex items-start gap-2.5 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3.5 py-3 text-[13px] text-white/60"
                      >
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/70" />
                        {point}
                      </motion.li>
                    ))}
                  </ul>

                  {/* Progress bar */}
                  <div className="mt-9">
                    <div className="flex items-center justify-between text-[11px] text-white/30">
                      <span>
                        Phase {active + 1} of {PROCESS.length}
                      </span>
                      <span>{step.duration}</span>
                    </div>
                    <div className="mt-3 h-px w-full bg-white/10">
                      <motion.div
                        className="h-px bg-gradient-to-r from-gold-soft to-gold"
                        initial={{ width: 0 }}
                        animate={{ width: `${((active + 1) / PROCESS.length) * 100}%` }}
                        transition={{ duration: 0.6, ease: EASE_LUX }}
                      />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
