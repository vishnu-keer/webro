# WEBRO Studio

Marketing site for [webro.studio](https://webro.studio) — a web, app and AI development agency.

Built with **Astro**, **TypeScript** and **SCSS**. Ships as static HTML with no
client-side framework, so every page is fully rendered for crawlers and the
JavaScript payload stays close to zero.

---

## Stack

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | Astro 4 | Static output by default — best-in-class for SEO on a content site |
| Language | TypeScript (strict) | Catches content/shape errors at build time, not in production |
| Styling | SCSS, 7-1 style layers | Tokens and mixins shared without a runtime CSS-in-JS cost |
| 3D | Three.js, dynamically imported | Never blocks first paint; page works without it |
| Hosting | GitHub Pages via Actions | Free, and the build output is never committed |

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:4321
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Type check, then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run check` | Astro + TypeScript diagnostics |
| `npm run lint` | ESLint across `.ts` and `.astro` |
| `npm run format` | Prettier write |

Node 20+ required.

---

## Project structure

```
src/
├── components/
│   ├── background/   Backdrop (aurora + grain + WebGL canvas)
│   ├── chat/         WEBRO AI widget markup
│   ├── layout/       Header, Footer, Brand, Loader, QuickActions
│   └── ui/           Presentational pieces — cards, accordion, icons
├── data/             All copy and business data, typed
│   ├── site.ts       Contact details, nav, API keys
│   ├── services.ts   Services, trust signals, process, values
│   ├── pricing.ts    Project and monthly plans
│   ├── faqs.ts       Also emitted as FAQPage schema
│   └── legal.ts      Privacy and Terms content
├── layouts/
│   └── BaseLayout.astro   HTML shell, SEO meta, structured data
├── pages/            One file per route
├── scripts/
│   ├── background/   WebGL renderer + one module per scene
│   ├── chat/         Knowledge base, matcher, widget
│   ├── modules/      Nav, loader, reveal, form, analytics…
│   └── main.ts       Client entry point
├── styles/           SCSS layers (abstracts → base → layout → components)
└── types/            Shared domain types
```

### Conventions

- **Content lives in `src/data`, never in markup.** Changing a price or a phone
  number touches exactly one file.
- **One responsibility per script module.** Each `init*` function no-ops when its
  markup is absent, so a single bundle serves every page.
- **SCSS is layered.** `abstracts` is auto-injected into every file, so partials
  use tokens without importing them.

---

## Common tasks

**Change contact details or pricing** — edit `src/data/site.ts` or
`src/data/pricing.ts`.

**Enable the contact form** — get a free key at [web3forms.com](https://web3forms.com)
and set `web3formsKey` in `src/data/site.ts`. Until it is set the form falls back
to a pre-filled `mailto:` so an enquiry is never lost.

**Enable analytics** — set `gaMeasurementId` in `src/data/site.ts`. No script is
emitted while it is empty. Conversion events (form submit, WhatsApp, call, email)
are already wired in `src/scripts/modules/analytics.ts`.

**Teach the chatbot a new answer** — append an entry to
`src/scripts/chat/knowledge-base.ts`. Order does not matter; the matcher scores
all entries and hands off to WhatsApp when confidence is low.

**Change a page background** — set `background` on the page's `BaseLayout`.
Available scenes: `orbital`, `network`, `columns`, `helix`, `globe`
(see `src/scripts/background/scenes`).

---

## Deployment

Every push to `main` triggers `.github/workflows/deploy.yml`, which lints, type
checks, builds, and publishes `dist/` to GitHub Pages. The custom domain is set
by `public/CNAME`.

Build output is **not** committed — `dist/` is gitignored.

---

## Accessibility and performance notes

- Scroll reveals have a guaranteed timeout, so content can never be stranded
  invisible if `IntersectionObserver` is throttled (common in in-app browsers).
- 3D backgrounds respect `prefers-reduced-motion`, scale object counts down on
  small screens, and pause in background tabs.
- If WebGL is unavailable the CSS aurora carries the page — it never renders blank.

---

## Licence

© WEBRO Studio. All rights reserved.
