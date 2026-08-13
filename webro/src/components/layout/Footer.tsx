import { ArrowUpRight, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

import { NAV_LINKS, SERVICES, SITE } from '@/lib/data';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07] bg-obsidian">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gold-line opacity-40"
      />

      <div className="container py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand block */}
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center gap-2.5" aria-label={`${SITE.name} home`}>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] font-display text-base text-gold-soft">
                W
              </span>
              <span className="text-[13px] font-semibold tracking-[0.28em] text-white">WEBRO</span>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/45">
              {SITE.description}
            </p>

            <div className="mt-8 space-y-3 text-sm">
              <a
                href={`mailto:${SITE.email}`}
                className="group inline-flex items-center gap-2.5 text-white/65 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 text-white/30 transition-colors group-hover:text-gold" />
                {SITE.email}
              </a>
              <p className="flex items-center gap-2.5 text-white/45">
                <MapPin className="h-4 w-4 text-white/30" />
                {SITE.location}
              </p>
            </div>
          </div>

          {/* Sitemap */}
          <nav aria-label="Footer" className="lg:col-span-3">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/35">
              Navigate
            </h3>
            <ul className="mt-6 space-y-3.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/35">
              Services
            </h3>
            <ul className="mt-6 space-y-3.5">
              {SERVICES.slice(0, 5).map((service) => (
                <li key={service.slug}>
                  <Link
                    href="/services"
                    className="text-sm text-white/55 transition-colors hover:text-white"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/35">
              Elsewhere
            </h3>
            <ul className="mt-6 space-y-3.5">
              {SITE.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-white"
                  >
                    {social.label}
                    <ArrowUpRight className="h-3 w-3 text-white/25 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hairline my-12" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-white/30 sm:flex-row">
          <p>
            © {year} {SITE.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Accepting projects for Q4
          </p>
        </div>
      </div>

      {/* Oversized watermark */}
      <div
        aria-hidden
        className="pointer-events-none select-none overflow-hidden"
      >
        <p className="mask-fade-b -mb-4 text-center font-display text-[18vw] leading-none tracking-tight text-white/[0.025] sm:-mb-8">
          WEBRO
        </p>
      </div>
    </footer>
  );
}
