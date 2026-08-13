'use client';

import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import Button from '@/components/ui/Button';
import { NAV_LINKS, SITE } from '@/lib/data';
import { cn, EASE_LUX } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 24);
  });

  // Close the mobile sheet whenever the route changes.
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll behind the mobile sheet.
  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE_LUX }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            'transition-all duration-500 ease-lux',
            scrolled
              ? 'border-b border-white/[0.07] bg-obsidian/70 backdrop-blur-xl'
              : 'border-b border-transparent bg-transparent',
          )}
        >
          <nav
            aria-label="Primary"
            className="container flex h-[72px] items-center justify-between gap-6"
          >
            {/* Wordmark */}
            <Link
              href="/"
              className="group flex items-center gap-2.5"
              aria-label={`${SITE.name} home`}
            >
              <span className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04]">
                <span className="font-display text-[15px] leading-none text-gold-soft">W</span>
                <span className="absolute inset-0 rounded-lg opacity-0 shadow-glow-gold transition-opacity duration-500 group-hover:opacity-100" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-[13px] font-semibold tracking-[0.28em] text-white">
                  WEBRO
                </span>
                <span className="mt-1 text-[9px] uppercase tracking-[0.3em] text-white/35">
                  Studio
                </span>
              </span>
            </Link>

            {/* Desktop links */}
            <ul className="hidden items-center gap-1 lg:flex">
              {NAV_LINKS.map((link) => {
                const active =
                  link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'relative rounded-full px-4 py-2 text-[13.5px] transition-colors duration-300',
                        active ? 'text-white' : 'text-white/55 hover:text-white',
                      )}
                    >
                      {active ? (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 -z-10 rounded-full border border-white/10 bg-white/[0.06]"
                          transition={{ duration: 0.5, ease: EASE_LUX }}
                        />
                      ) : null}
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2">
              <Button href="/contact" size="sm" variant="outline" className="hidden lg:inline-flex">
                Start a project
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>

              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? 'Close menu' : 'Open menu'}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/80 transition-colors hover:text-white lg:hidden"
              >
                {open ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-obsidian/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="container flex h-full flex-col justify-between pb-10 pt-28">
              <ul className="flex flex-col">
                {NAV_LINKS.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.06 * index, ease: EASE_LUX }}
                    className="border-b border-white/[0.07]"
                  >
                    <Link
                      href={link.href}
                      className="flex items-center justify-between py-5 font-display text-3xl text-white/85 transition-colors hover:text-white"
                    >
                      {link.label}
                      <ArrowUpRight className="h-5 w-5 text-white/25" />
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.36, ease: EASE_LUX }}
                className="space-y-5"
              >
                <Button href="/contact" size="lg" className="w-full">
                  Start a project
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
                <a
                  href={`mailto:${SITE.email}`}
                  className="block text-center text-sm text-white/45 transition-colors hover:text-white"
                >
                  {SITE.email}
                </a>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
