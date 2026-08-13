# Marketing Audit — webro.studio

**Prepared by:** Webro Studio AI Marketing Suite
**Date:** August 12, 2026
**Scope:** Technical SEO, on-page SEO, content, and discoverability audit of the live production site.

---

## Marketing Score: 42 / 100

A single-page marketing site with a solid hosting/security foundation (HTTPS, HSTS, CDN, gzip) but significant gaps in indexability, social sharing, structured data, and content depth — all of which are actively suppressing organic reach and paid/social conversion quality.

| Category | Score | Notes |
|---|---|---|
| Technical Foundation | 7 / 10 | HTTPS, redirects, compression, CDN all solid |
| Discoverability (robots/sitemap/schema) | 1 / 10 | robots.txt, sitemap.xml, and all structured data are missing |
| On-Page SEO | 5 / 10 | Good title/description, clean heading structure, but no canonical tag |
| Social Sharing Readiness | 3 / 10 | Partial Open Graph, zero Twitter Card, no share image |
| Content Depth | 4 / 10 | Decent single-page copy, but no blog and no multi-page architecture |
| Crawlability | 3 / 10 | Key visual content (logos, icons) is injected via JS and invisible to raw crawlers |
| Trust/Branding Signals | 4 / 10 | No favicon, no security headers on the live page |

---

## Critical Issues

These are actively costing the business visibility, trust, or leads. Fix first.

1. **No `robots.txt`** — returns a 404. Crawlers have no explicit guidance, and there's no sitemap reference for them to discover.
2. **No `sitemap.xml`** — returns a 404. Google has no structured map of the site's URLs to index.
3. **No structured data (JSON-LD) at all** — despite the homepage visibly featuring a 4.9/5 rating, testimonials, and an FAQ section, none of it is marked up as `LocalBusiness`, `AggregateRating`, `Review`, or `FAQPage` schema. This is a missed opportunity for rich results (star ratings, FAQ dropdowns) directly in Google search.
4. **No `og:image` and no Twitter Card tags** — when this site is shared on LinkedIn, WhatsApp, Facebook, or X, the link preview will show no image and, on X, likely no preview at all. For an agency whose growth depends on referrals and social shares, this materially weakens every shared link.
5. **No favicon** — `/favicon.ico` 404s and there's no `<link rel="icon">` tag. Every browser tab and bookmark shows a generic icon, undermining brand trust at the exact moment a prospect is evaluating credibility.
6. **Client logos and tech-stack icons are invisible to crawlers** — these images are injected via client-side JS template literals rather than present in the HTML, meaning search engines and most social-share scrapers cannot see them at all.

## Quick Wins

Low effort, meaningful impact — most of these are single-file or single-tag additions.

1. **Add a `robots.txt`** with `Allow: /` and a `Sitemap:` reference — 15-minute fix.
2. **Add a `sitemap.xml`** listing the homepage (and future pages) — pairs directly with #1.
3. **Add a favicon** and its `<link rel="icon">` tag — immediate brand-trust improvement.
4. **Add `og:image`, `og:url`, and the four Twitter Card tags** (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`) — turns every shared link into a proper preview card, likely improving social click-through rate.
5. **Add a `<link rel="canonical" href="https://webro.studio/">`** tag — one line, removes any future duplicate-content ambiguity.
6. **Add `Organization`/`LocalBusiness`, `FAQPage`, and `AggregateRating` JSON-LD** — the FAQ section and "4.9/5" rating already exist on-page; this just marks up content that's already written, unlocking rich results.
7. **Fix or remove the 7 dead `href="#"` links** — quick cleanup, removes a UX/crawl-quality red flag.
8. **Add missing security headers** (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`) at the hosting/CDN config level — low effort since HSTS is already configured correctly.
9. **Add a short "location" keyword to the H1 or a nearby H2** (e.g., city/region) — the phone number is Indian and the copy already says "local businesses," but no geographic term appears in headings, only in the meta description.

---

## Strategic Recommendations (Beyond Quick Wins)

- **Move to a multi-page architecture.** The entire site currently lives on one URL with anchor-based sections (`#services`, `#pricing`, `#faq`, etc.). This caps how many distinct keyword intents the site can rank for. Dedicated landing pages for core services (web design, SEO, e-commerce, mobile apps) would each become an independent ranking asset.
- **Launch a content/blog section.** There is currently zero top-of-funnel content. A blog targeting service-adjacent and local-search queries would compound organic traffic over time — this is the single highest-leverage investment once the technical fixes above are in place.
- **Server-render or statically embed key visual proof** (client logos, tech-stack icons) rather than relying solely on client-side JS injection, so this trust-building content is actually visible to search engines and share-preview bots.

---

## What's Already Working

- HTTPS enforced with HSTS, clean HTTP→HTTPS and www→non-www redirects (no duplicate-content risk from host variants).
- Gzip compression enabled (~74% size reduction) and served through a Fastly CDN in front of GitHub Pages.
- Title tag and meta description are both well-formed, appropriately lengthed, and keyword-relevant.
- Clean heading hierarchy: exactly one H1, nine well-differentiated H2s, no duplication.
- Google Fonts loaded with proper `preconnect` hints — a good, easy-to-overlook performance practice.
- Copy is focused and keyword-healthy (no stuffing) around web design, AI, SEO, and e-commerce services.

---

*This audit was generated from a live technical scan (headers, HTML source, robots.txt, sitemap.xml) of https://webro.studio. Recommendations are prioritized by estimated effort-to-impact ratio.*
