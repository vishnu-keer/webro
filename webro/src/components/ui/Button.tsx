'use client';

import Link from 'next/link';
import * as React from 'react';

import { cn } from '@/lib/utils';

type Variant = 'primary' | 'ghost' | 'outline' | 'gold';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-white text-obsidian hover:bg-white/90 shadow-[0_10px_40px_-12px_rgba(255,255,255,0.35)]',
  gold:
    'bg-gradient-to-b from-gold-soft to-gold text-obsidian hover:brightness-110 shadow-glow-gold',
  outline:
    'border border-white/15 bg-white/[0.02] text-white backdrop-blur-md hover:border-white/30 hover:bg-white/[0.06]',
  ghost: 'text-white/70 hover:text-white hover:bg-white/[0.05]',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-6 text-sm',
  lg: 'h-[52px] px-8 text-[15px]',
};

const BASE =
  'group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium tracking-tight transition-all duration-300 ease-lux active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50';

type StyleProps = {
  variant?: Variant;
  size?: Size;
  /** Sweeping specular highlight on hover. */
  shine?: boolean;
};

export type ButtonProps = StyleProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export type ButtonLinkProps = StyleProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string };

function Inner({ shine, children }: { shine: boolean; children: React.ReactNode }) {
  return (
    <>
      {shine ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-lux group-hover/btn:translate-x-full"
        />
      ) : null}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  );
}

/**
 * Primary interactive element.
 * Renders a `<button>` by default, or an anchor / `next/link` when `href` is set.
 */
export default function Button(props: ButtonProps | ButtonLinkProps) {
  if (typeof props.href === 'string') {
    const {
      href,
      variant = 'primary',
      size = 'md',
      shine = true,
      className,
      children,
      ...rest
    } = props as ButtonLinkProps;

    const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);
    const isAbsolute = href.startsWith('http');
    const bypassRouter = isAbsolute || href.startsWith('mailto:') || href.startsWith('tel:');

    if (bypassRouter) {
      return (
        <a
          href={href}
          className={classes}
          target={isAbsolute ? '_blank' : undefined}
          rel={isAbsolute ? 'noopener noreferrer' : undefined}
          {...rest}
        >
          <Inner shine={shine}>{children}</Inner>
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...rest}>
        <Inner shine={shine}>{children}</Inner>
      </Link>
    );
  }

  const {
    variant = 'primary',
    size = 'md',
    shine = true,
    className,
    children,
    type = 'button',
    ...rest
  } = props as ButtonProps;

  return (
    <button
      type={type}
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      {...rest}
    >
      <Inner shine={shine}>{children}</Inner>
    </button>
  );
}
