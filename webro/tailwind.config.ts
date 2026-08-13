import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '2rem', lg: '3rem', '2xl': '4rem' },
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#050505',
          50: '#0a0a0c',
          100: '#0e0e11',
          200: '#111115',
          300: '#16161a',
          400: '#1c1c21',
        },
        gold: {
          DEFAULT: '#d4af37',
          soft: '#e8cd7a',
          deep: '#a9861f',
        },
        muted: '#a1a1aa',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
        '9xl': ['8rem', { lineHeight: '0.95', letterSpacing: '-0.035em' }],
      },
      boxShadow: {
        glass: '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 20px 60px -20px rgba(0,0,0,0.9)',
        glow: '0 0 40px rgba(255,255,255,0.06)',
        'glow-gold': '0 0 50px -10px rgba(212,175,55,0.35)',
      },
      backgroundImage: {
        'radial-fade':
          'radial-gradient(60% 60% at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 70%)',
        'gold-line':
          'linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)',
        'hairline':
          'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        float: 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 6s ease-in-out infinite',
        shimmer: 'shimmer 2.2s infinite',
      },
      transitionTimingFunction: {
        lux: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
