'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import Button from '@/components/ui/Button';
import ProjectVisual from '@/components/ui/ProjectVisual';
import SectionHeader from '@/components/ui/SectionHeader';
import { PROJECTS } from '@/lib/data';
import { cn, staggerChild, staggerParent, viewportOnce } from '@/lib/utils';

const featured = PROJECTS.filter((project) => project.featured).slice(0, 3);
const secondary = PROJECTS.filter((project) => !project.featured).slice(0, 2);

/** Bento grid: one hero tile, two stacked tiles, two wide tiles beneath. */
export default function SelectedWork() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeader
          eyebrow="Selected work"
          title={
            <>
              Proof, not <span className="italic text-gold-lux">promises</span>
            </>
          }
          description="A few recent engagements. Each one shipped against a number we agreed on in week one."
          action={
            <Button href="/work" variant="outline">
              View all work
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          }
        />

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-14 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2"
        >
          {/* Hero tile — spans two rows on desktop */}
          <motion.article
            variants={staggerChild}
            className="group glass glass-hover relative flex flex-col overflow-hidden p-5 sm:p-6 lg:row-span-2"
          >
            <ProjectVisual
              gradient={featured[0].gradient}
              label={featured[0].client}
              className="aspect-[4/3] w-full lg:aspect-[4/5]"
            />

            <div className="mt-6 flex flex-1 flex-col">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                  {featured[0].client}
                </span>
                <span className="text-[11px] text-white/25">{featured[0].year}</span>
              </div>

              <h3 className="mt-4 font-display text-2xl leading-snug tracking-tight text-white sm:text-[28px]">
                {featured[0].title}
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-white/50">
                {featured[0].summary}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {featured[0].tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] text-white/45"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between gap-4 pt-8">
                <span className="font-display text-lg text-gold-lux">
                  {featured[0].result}
                </span>
                <Link
                  href={featured[0].href}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all duration-300 group-hover:border-white/25 group-hover:text-white"
                  aria-label={`View ${featured[0].client} case study`}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.article>

          {/* Two stacked tiles */}
          {featured.slice(1).map((project) => (
            <motion.article
              key={project.slug}
              variants={staggerChild}
              className="group glass glass-hover relative flex flex-col overflow-hidden p-5 sm:flex-row sm:items-stretch sm:gap-6 sm:p-6 lg:col-span-2"
            >
              <ProjectVisual
                gradient={project.gradient}
                label={project.client}
                className="aspect-[16/9] w-full sm:aspect-auto sm:w-2/5 sm:shrink-0"
              />

              <div className="mt-5 flex flex-1 flex-col sm:mt-0">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                    {project.client}
                  </span>
                  <span className="text-[11px] text-white/25">{project.year}</span>
                </div>

                <h3 className="mt-3 font-display text-xl leading-snug tracking-tight text-white sm:text-2xl">
                  {project.title}
                </h3>

                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/50">
                  {project.summary}
                </p>

                <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                  <span className="font-display text-base text-gold-lux">{project.result}</span>
                  <Link
                    href={project.href}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all duration-300 group-hover:border-white/25 group-hover:text-white"
                    aria-label={`View ${project.client} case study`}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Compact row */}
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {secondary.map((project) => (
            <motion.article key={project.slug} variants={staggerChild}>
              <Link
                href={project.href}
                className={cn(
                  'group glass glass-hover flex items-center gap-5 p-5',
                  'focus-visible:outline-none',
                )}
              >
                <ProjectVisual
                  gradient={project.gradient}
                  label={project.client}
                  className="h-20 w-24 shrink-0 sm:h-24 sm:w-28"
                />
                <div className="min-w-0">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                    {project.client}
                  </span>
                  <h3 className="mt-2 truncate font-display text-lg tracking-tight text-white">
                    {project.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-white/40">{project.result}</p>
                </div>
                <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-white/25 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
