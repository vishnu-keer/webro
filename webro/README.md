# Webro Studio

An ultra-luxury, multi-page agency website built on the Next.js App Router. Obsidian dark theme, glassmorphism surfaces, ambient glow lighting and Framer Motion orchestration throughout.

---

## Overview

| | |
|---|---|
| **Framework** | Next.js 14 (App Router) + TypeScript (strict) |
| **Styling** | Tailwind CSS 3.4 with a custom obsidian token layer |
| **Animation** | Framer Motion 11 |
| **Icons** | Lucide React |
| **Fonts** | Playfair Display (display) + Inter (body), via `next/font` |
| **Deploy target** | Vercel |

---

## Architecture

```
webro/
├── src/
│   ├── app/                        # App Router — one folder per route
│   │   ├── layout.tsx              # Root layout: fonts, metadata, JSON-LD, chrome
│   │   ├── globals.css             # Design tokens, glass/eyebrow/hairline primitives
│   │   ├── page.tsx                # Home  (/)
│   │   ├── services/page.tsx       # Services  (/services)
│   │   ├── work/page.tsx           # Portfolio  (/work)
│   │   ├── about/page.tsx          # About  (/about)
│   │   ├── contact/page.tsx        # Contact  (/contact)
│   │   ├── not-found.tsx           # Branded 404
│   │   ├── sitemap.ts              # Auto-generated sitemap.xml
│   │   └── robots.ts               # Auto-generated robots.txt
│   │
│   ├── components/
│   │   ├── layout/                 # Navbar, Footer, PageHero, PageTransition
│   │   ├── ui/                     # Reusable primitives (see below)
│   │   ├── home/                   # Home page sections
│   │   ├── services/TechMatrix     # Interactive stack grid
│   │   ├── work/WorkGrid           # Filterable portfolio grid
│   │   └── contact/InquiryForm     # 3-step qualification form
│   │
│   └── lib/
│       ├── data.ts                 # Single source of truth for all site content
│       └── utils.ts                # cn() + shared motion variants and easing
│
├── tailwind.config.ts              # Colour, type, shadow and keyframe tokens
└── next.config.mjs
```

### Why this structure

- **`lib/data.ts` holds every string, project, service and metric.** Swapping in a CMS later means replacing one module, not hunting through JSX. Nav, footer and sitemap all derive from the same arrays, so they can never drift apart.
- **`components/ui` are dumb primitives; `components/<page>` are compositions.** A primitive never knows what page it is on, which is what makes the design system reusable.
- **Server Components by default.** Only files that need state, hover or scroll carry `'use client'` — Footer, ClientTicker and every page shell stay on the server, which keeps the client bundle small.
- **Motion variants live in `lib/utils.ts`.** One easing curve (`EASE_LUX`) and one fade-up variant used everywhere, so the whole site moves with the same personality.

---

## Key files

| File | Role |
|---|---|
| `app/globals.css` | Design tokens plus `.glass`, `.eyebrow`, `.hairline`, `.noise`, `.text-lux` component classes |
| `tailwind.config.ts` | Obsidian/gold palette, display+sans font vars, marquee/float/shimmer keyframes, `ease-lux` curve |
| `ui/GlassCard.tsx` | Glass surface with optional cursor-tracking spotlight and hover tint |
| `ui/Button.tsx` | Polymorphic button — renders `<button>`, `<a>` or `next/link` based on `href`; 4 variants, 3 sizes |
| `ui/AmbientGlow.tsx` | Decorative radial spot lighting + optional 64px grid; purely presentational |
| `ui/Counter.tsx` | Scroll-triggered metric counter; writes to a ref rather than state to avoid a render per frame |
| `ui/Magnetic.tsx` | Spring-based cursor attraction for CTAs; auto-disabled on touch devices |
| `ui/ProjectVisual.tsx` | Imagery container with hover-zoom and specular sweep — swap the inner layer for `next/image` when real photography lands |
| `layout/Navbar.tsx` | Scroll-aware glass nav with `layoutId` active pill and a full-screen mobile sheet |
| `contact/InquiryForm.tsx` | 3-step form with per-step validation and an animated progress indicator |

---

## Design system

**Colour** — `#050505` canvas, `#111115` elevated surfaces, `border-white/10` hairlines, `#a1a1aa` secondary text, `#d4af37` champagne gold accent. Ambient glows use violet / emerald / gold radial gradients.

**Typography** — Playfair Display for headings (with italic used as the accent voice), Inter for body. Titles scale fluidly via `clamp()` from 320px to 4K.

**Depth** — `backdrop-blur-xl` over `bg-white/[0.02]`, an inset top highlight, and a fixed SVG noise overlay at 3.5% opacity to kill gradient banding.

**Motion** — every reveal is `opacity: 0, y: 20 → opacity: 1, y: 0` on a `cubic-bezier(0.16, 1, 0.3, 1)` curve. Lists stagger at 80ms. All of it collapses under `prefers-reduced-motion`.

---

## Setup

```bash
npm install
npm run dev          # http://localhost:3000
```

**Scripts**

```bash
npm run build        # production build
npm run start        # serve the production build
npm run lint         # eslint (next/core-web-vitals)
npm run typecheck    # tsc --noEmit
```

Node 18.17+ required. No environment variables are needed to run the site as-is.

---

## Testing

```bash
npm run typecheck    # must pass clean — strict mode is on
npm run lint
npm run build        # catches RSC/client boundary mistakes lint won't
```

Manual checklist before shipping:

1. Resize from 320px → 4K; check the hero, bento grid and process timeline at each breakpoint.
2. Tab through the whole site — focus rings must be visible, the mobile menu must trap sensibly, and the work filters must be reachable.
3. Enable "Reduce motion" in OS settings and confirm animations collapse.
4. Run Lighthouse on `/` and `/work` — target ≥ 95 performance, 100 accessibility.

---

## Deploying to Vercel

```bash
git init
git add .
git commit -m "feat: Webro Studio site"
git branch -M main
git remote add origin https://github.com/vishnu-keer/webro.git
git push -u origin main
```

Then import the repo at [vercel.com/new](https://vercel.com/new). Framework preset auto-detects as Next.js; no build settings need changing. Every PR gets a preview deploy.

After adding your domain, update `SITE.url` in `src/lib/data.ts` — it drives `metadataBase`, the sitemap and all canonical URLs.

---

## Wiring up the contact form

`InquiryForm.tsx` currently resolves a simulated promise. To make it live, create `src/app/api/contact/route.ts` and replace the `await new Promise(...)` line with a `fetch('/api/contact', { method: 'POST', body: JSON.stringify(form) })`. Resend, Postmark or a HubSpot webhook all drop in cleanly at that seam.

---

## Future improvements

- Individual case-study routes at `/work/[slug]` with MDX bodies
- Real photography through `next/image` inside `ProjectVisual`
- CMS (Sanity or Payload) behind `lib/data.ts`
- OG image generation via `next/og`
- Blog / insights section for organic SEO
- Playwright smoke tests on the critical nav and form paths
