'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react';
import * as React from 'react';

import AmbientGlow from '@/components/ui/AmbientGlow';
import Button from '@/components/ui/Button';
import Counter from '@/components/ui/Counter';
import Magnetic from '@/components/ui/Magnetic';
import { METRICS } from '@/lib/data';
import { EASE_LUX } from '@/lib/utils';

const HEADLINE = ['Digital craft', 'for brands that', 'refuse to blend in.'];

export default function Hero() {
  const ref = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Parallax: content drifts up and dissolves as the user scrolls past.
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const sphereY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const sphereScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-20 pt-32 sm:pt-36"
    >
      <AmbientGlow variant="violet" grid />

      {/* Ambient glowing sphere */}
      <motion.div
        aria-hidden
        style={{ y: sphereY, scale: sphereScale }}
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 sm:h-[52rem] sm:w-[52rem]"
      >
        <div className="animate-float absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.10),rgba(124,58,237,0.10)_38%,transparent_62%)] blur-2xl" />
        <div className="absolute inset-[18%] rounded-full border border-white/[0.06]" />
        <div className="absolute inset-[30%] rounded-full border border-white/[0.04]" />
      </motion.div>

      <motion.div style={{ y: contentY, opacity }} className="container relative">
        {/* Availability badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_LUX }}
        >
          <span className="eyebrow">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Two build slots open · Q4
          </span>
        </motion.div>

        {/* Headline — line-by-line mask reveal */}
        <h1 className="mt-8 max-w-5xl font-display text-[clamp(2.6rem,8vw,6.5rem)] font-normal leading-[0.98] tracking-[-0.03em]">
          {HEADLINE.map((line, index) => (
            <span key={line} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, delay: 0.12 + index * 0.11, ease: EASE_LUX }}
                className={
                  index === HEADLINE.length - 1
                    ? 'block italic text-gold-lux'
                    : 'block text-lux'
                }
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE_LUX }}
          className="mt-8 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg"
        >
          We are an AI-first studio engineering premium websites, custom software and
          intelligent automation — the kind of work that makes a competitor open your site
          and quietly reconsider theirs.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.62, ease: EASE_LUX }}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Magnetic>
            <Button href="/contact" size="lg" className="w-full sm:w-auto">
              Start a project
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
            </Button>
          </Magnetic>

          <Magnetic>
            <Button href="/work" size="lg" variant="outline" className="w-full sm:w-auto">
              <Sparkles className="h-4 w-4 text-gold" />
              See selected work
            </Button>
          </Magnetic>
        </motion.div>

        {/* Metrics */}
        <motion.dl
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.78, ease: EASE_LUX }}
          className="mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.05] sm:mt-20 sm:grid-cols-4"
        >
          {METRICS.map((metric) => (
            <div key={metric.label} className="bg-obsidian px-5 py-6 sm:px-6">
              <dt className="sr-only">{metric.label}</dt>
              <dd>
                <span className="block font-display text-3xl tracking-tight text-white sm:text-4xl">
                  <Counter
                    value={metric.value}
                    suffix={metric.suffix}
                    decimals={metric.decimals}
                  />
                </span>
                <span className="mt-2 block text-[11px] uppercase tracking-[0.16em] text-white/35">
                  {metric.label}
                </span>
              </dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.3 }}
        style={{ opacity }}
        className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.28em] text-white/25">Scroll</span>
        <ArrowDown className="h-3.5 w-3.5 animate-bounce text-white/25" />
      </motion.div>
    </section>
  );
}
