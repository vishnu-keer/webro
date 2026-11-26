import { site } from '@/data/site';
import { isIndexable } from '@/data/seo';

/**
 * One list of sitemap URLs, shared by every sitemap endpoint so they can
 * never disagree:
 *   /sitemap.xml        primary sitemap (referenced by robots.txt)
 *   /sitemap-index.xml  kept for compatibility: the URL @astrojs/sitemap used
 *   /sitemap-0.xml      kept for compatibility: the file that index points to
 *
 * Built from the real page files, so a new page in src/pages appears
 * automatically and a page listed in NOINDEX_PATHS never does.
 *
 * <lastmod> is deliberately omitted. This site has no CMS or database with
 * real per-page edit dates, and GitHub Actions checks out a shallow clone, so
 * git dates would all read as the deploy date. A wrong lastmod is worse than
 * none: search engines learn to ignore a site whose dates are unreliable.
 */
/*
 * Only the file names are used. Importing the files as raw text (`?raw`)
 * keeps the page components out of this endpoint's module graph, so Vite
 * names the shared CSS bundle exactly as it did before the sitemap existed
 * (`/_astro/about.*.css`). Cached HTML that still points at that file keeps
 * working after a deploy.
 */
const pages = import.meta.glob('../pages/*.astro', { query: '?raw', import: 'default' });

export const sitemapUrls: readonly string[] = Object.keys(pages)
  .map((file) => file.replace(/^\.\.\/pages/, '').replace(/\.astro$/, ''))
  .map((path) => (path === '/index' ? '/' : path))
  .filter(isIndexable)
  .sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)))
  .map((path) => new URL(path, site.url).href);

const SITEMAP_NS = 'http://www.sitemaps.org/schemas/sitemap/0.9';

/** A <urlset> listing every indexable, canonical page URL. */
export function urlsetXml(): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<urlset xmlns="${SITEMAP_NS}">`,
    ...sitemapUrls.map((loc) => `  <url><loc>${loc}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');
}

/** A <sitemapindex> pointing at the given sitemap paths. */
export function sitemapIndexXml(paths: readonly string[]): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<sitemapindex xmlns="${SITEMAP_NS}">`,
    ...paths.map((path) => `  <sitemap><loc>${new URL(path, site.url).href}</loc></sitemap>`),
    '</sitemapindex>',
    '',
  ].join('\n');
}

export const xmlResponse = (body: string): Response =>
  new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
