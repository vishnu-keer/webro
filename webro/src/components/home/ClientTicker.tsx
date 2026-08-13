import { CLIENTS } from '@/lib/data';

/**
 * Infinite marquee. The list is duplicated once and the track translates
 * -50%, so the loop is seamless. CSS-only — no JS, no layout thrash.
 */
export default function ClientTicker() {
  const row = [...CLIENTS, ...CLIENTS];

  return (
    <section
      aria-label="Selected clients"
      className="relative border-y border-white/[0.07] bg-obsidian-100/40 py-10 sm:py-12"
    >
      <p className="container mb-8 text-center text-[10px] uppercase tracking-[0.3em] text-white/30">
        Trusted by teams who sweat the details
      </p>

      <div className="mask-fade-x relative flex overflow-hidden">
        <div className="animate-marquee flex shrink-0 items-center gap-14 pr-14 sm:gap-20 sm:pr-20">
          {row.map((client, index) => (
            <span
              key={`${client}-${index}`}
              aria-hidden={index >= CLIENTS.length}
              className="whitespace-nowrap font-display text-lg tracking-[0.18em] text-white/25 transition-colors duration-500 hover:text-white/70 sm:text-xl"
            >
              {client}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
