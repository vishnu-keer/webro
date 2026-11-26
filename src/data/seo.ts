/**
 * Indexing rules, in one place.
 *
 * Every page in src/pages is public and indexable unless it is listed here.
 * The same list drives three things so they can never disagree:
 *   - the robots meta tag (BaseLayout renders `noindex` for these paths),
 *   - sitemap.xml (these paths are left out),
 *   - the post-build check in scripts/check-seo.mjs.
 */
export const NOINDEX_PATHS: readonly string[] = [
  // Served for every unknown URL; never a real page.
  '/404',
  // Utility page for existing customers leaving a review — not a landing page.
  '/review',
];

/** Normalises "/about.html", "/about/" and "/about" to "/about" (home stays "/"). */
export function cleanPath(pathname: string): string {
  const path = pathname.replace(/(index)?\.html$/, '').replace(/(.)\/$/, '$1');
  return path === '' ? '/' : path;
}

export const isIndexable = (pathname: string): boolean =>
  !NOINDEX_PATHS.includes(cleanPath(pathname));
