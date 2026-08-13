import { cn } from '@/lib/utils';

type ProjectVisualProps = {
  /** Tailwind gradient stops, e.g. `from-amber-500/25 via-yellow-200/10 to-transparent`. */
  gradient: string;
  label: string;
  className?: string;
};

/**
 * Imagery container for project cards. Renders an art-directed gradient
 * plate that zooms on hover — swap the inner layer for `next/image` when
 * real case-study photography is available.
 */
export default function ProjectVisual({ gradient, label, className }: ProjectVisualProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-white/[0.07] bg-obsidian-200',
        className,
      )}
    >
      {/* Zoom layer — replace with <Image fill /> when assets land */}
      <div
        aria-hidden
        className={cn(
          'absolute inset-0 scale-100 bg-gradient-to-br transition-transform duration-[900ms] ease-lux group-hover:scale-110',
          gradient,
        )}
      />

      {/* Technical grid overlay */}
      <div aria-hidden className="absolute inset-0 grid-lines opacity-40" />

      {/* Specular sweep */}
      <div
        aria-hidden
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-[1100ms] ease-lux group-hover:translate-x-full"
      />

      {/* Bottom scrim so overlaid text stays legible */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/25 to-transparent"
      />

      <span className="sr-only">{label}</span>
    </div>
  );
}
