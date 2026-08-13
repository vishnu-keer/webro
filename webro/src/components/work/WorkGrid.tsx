'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import ProjectVisual from '@/components/ui/ProjectVisual';
import { PROJECTS, WORK_CATEGORIES, type WorkCategory } from '@/lib/data';
import { cn, EASE_LUX } from '@/lib/utils';

/** Filterable portfolio grid with animated layout reflow. */
export default function WorkGrid() {
  const [filter, setFilter] = React.useState<WorkCategory>('All');

  const visible = React.useMemo(
    () => (filter === 'All' ? PROJECTS : PROJECTS.filter((p) => p.category === filter)),
    [filter],
  );

  const counts = React.useMemo(() => {
    const map = new Map<WorkCategory, number>([['All', PROJECTS.length]]);
    PROJECTS.forEach((project) => {
      map.set(project.category, (map.get(project.category) ?? 0) + 1);
    });
    return map;
  }, []);

  return (
    <>
      {/* Filter bar */}
      <div
        role="group"
        aria-label="Filter projects by category"
        className="flex flex-wrap items-center gap-2"
      >
        {WORK_CATEGORIES.map((category) => {
          const active = filter === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              aria-pressed={active}
              className={cn(
                'relative rounded-full px-4 py-2 text-[13px] transition-colors duration-300 sm:px-5',
                active ? 'text-obsidian' : 'text-white/50 hover:text-white',
              )}
            >
              {active ? (
                <motion.span
                  layoutId="work-filter-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-white"
                  transition={{ duration: 0.45, ease: EASE_LUX }}
                />
              ) : (
                <span className="absolute inset-0 -z-10 rounded-full border border-white/10 bg-white/[0.02]" />
              )}
              {category}
              <span className={cn('ml-2 text-[11px]', active ? 'text-obsidian/45' : 'text-white/25')}>
                {counts.get(category) ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <motion.div layout className="mt-12 grid grid-cols-1 gap-4 sm:mt-14 lg:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visible.map((project) => (
            <motion.article
              key={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -12 }}
              transition={{ duration: 0.5, ease: EASE_LUX }}
              className="group glass glass-hover flex flex-col overflow-hidden p-5 sm:p-6"
            >
              <ProjectVisual
                gradient={project.gradient}
                label={project.client}
                className="aspect-[16/10] w-full"
              />

              <div className="mt-6 flex flex-1 flex-col">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                    {project.client}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-white/15" />
                  <span className="rounded-full border border-white/[0.08] px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-white/35">
                    {project.category}
                  </span>
                  <span className="ml-auto text-[11px] text-white/25">{project.year}</span>
                </div>

                <h2 className="mt-4 font-display text-xl leading-snug tracking-tight text-white sm:text-2xl">
                  {project.title}
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-white/50">{project.summary}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] text-white/45"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="hairline my-6" />

                <div className="mt-auto flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                      Outcome
                    </p>
                    <p className="mt-1.5 font-display text-lg text-gold-lux">{project.result}</p>
                  </div>

                  <Link
                    href={project.href}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-[13px] text-white/60 transition-all duration-300 hover:border-white/25 hover:text-white"
                  >
                    View case study
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {visible.length === 0 ? (
        <p className="mt-16 text-center text-sm text-white/40">
          Nothing in this category yet — try another filter.
        </p>
      ) : null}
    </>
  );
}
