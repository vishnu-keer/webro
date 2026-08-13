import { cn } from '@/lib/utils';

type AmbientGlowProps = {
  className?: string;
  /** Colour theme of the ambient spot lighting. */
  variant?: 'violet' | 'emerald' | 'gold' | 'neutral';
  /** Renders a faint 64px grid behind the glow. */
  grid?: boolean;
};

const TINTS: Record<NonNullable<AmbientGlowProps['variant']>, [string, string]> = {
  violet: ['rgba(139,92,246,0.20)', 'rgba(56,189,248,0.14)'],
  emerald: ['rgba(16,185,129,0.18)', 'rgba(45,212,191,0.12)'],
  gold: ['rgba(212,175,55,0.20)', 'rgba(251,191,36,0.10)'],
  neutral: ['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.05)'],
};

/**
 * Decorative background layer: two soft radial spots plus optional grid.
 * Purely presentational — always `aria-hidden` and pointer-events-none.
 */
export default function AmbientGlow({
  className,
  variant = 'violet',
  grid = false,
}: AmbientGlowProps) {
  const [a, b] = TINTS[variant];

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}
    >
      {grid ? <div className="absolute inset-0 grid-lines mask-fade-b opacity-70" /> : null}

      <div
        className="absolute left-1/2 top-[-18rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full blur-[130px] animate-pulse-slow"
        style={{ background: `radial-gradient(circle, ${a} 0%, transparent 70%)` }}
      />
      <div
        className="absolute bottom-[-14rem] right-[-10rem] h-[30rem] w-[30rem] rounded-full blur-[130px] animate-pulse-slow"
        style={{
          background: `radial-gradient(circle, ${b} 0%, transparent 70%)`,
          animationDelay: '2s',
        }}
      />

      {/* Vignette to seal the edges into pure obsidian */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#050505_100%)]" />
    </div>
  );
}
