import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import AmbientGlow from '@/components/ui/AmbientGlow';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <AmbientGlow variant="neutral" grid />

      <div className="container text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">Error 404</p>

        <h1 className="mx-auto mt-8 max-w-3xl text-balance font-display text-[clamp(2.5rem,8vw,6rem)] leading-[1.02] tracking-tight text-lux">
          This page never <span className="italic text-gold-lux">shipped</span>
        </h1>

        <p className="mx-auto mt-7 max-w-md text-base leading-relaxed text-white/50">
          The link is broken or the page moved. Everything worth seeing is one click away.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/" size="lg">
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Button>
          <Button href="/work" size="lg" variant="outline">
            See our work
          </Button>
        </div>
      </div>
    </section>
  );
}
