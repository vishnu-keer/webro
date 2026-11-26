#!/usr/bin/env node
/**
 * Post-build SEO check. Reads the built site in dist/ and fails (exit 1) if
 * anything search engines rely on is broken.
 *
 *   npm run build && npm run check:seo
 *
 * Checks: sitemap.xml and robots.txt exist and are well formed; every sitemap
 * URL maps to a built page that is indexable and whose canonical matches; no
 * noindex page is listed; every indexable page has a unique title and meta
 * description, exactly one <h1>, Open Graph and Twitter tags, and JSON-LD that
 * parses. No network access, no dependencies.
 *
 * Before any of that it checks that dist/ is a complete, current build of this
 * source tree (every page and endpoint in src/pages has an output file, the
 * public/ files match, every referenced /_astro asset exists). A missing or
 * stale dist/ fails immediately with a clear message instead of producing
 * results about an old build.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const DIST = join(ROOT, 'dist');
const PAGES_SRC = join(ROOT, 'src', 'pages');
const PUBLIC = join(ROOT, 'public');
const ORIGIN = 'https://webro.studio';

// ---- build artifacts -------------------------------------------------------
// Stop early, with one clear message, if dist/ is missing or does not match
// this source tree. Checking an old build would report misleading results.
function abort(lines) {
  console.error(['', ...lines.map((l) => `  FAIL  ${l}`), ''].join('\n'));
  console.error(
    'dist/ is missing or out of date. Run `npm run build` first, then re-run this check.',
  );
  process.exit(1);
}
if (!existsSync(DIST) || !existsSync(join(DIST, 'index.html')))
  abort([`no build output found at ${DIST}`]);
{
  const missing = [];
  for (const file of readdirSync(PAGES_SRC)) {
    if (file.startsWith('_')) continue;
    let out = null;
    if (file.endsWith('.astro')) out = file.replace(/\.astro$/, '.html');
    else if (/\.(xml|txt|json)\.ts$/.test(file)) out = file.replace(/\.ts$/, '');
    if (out && !existsSync(join(DIST, out))) missing.push(`src/pages/${file} has no dist/${out}`);
  }
  for (const file of ['robots.txt', 'llms.txt']) {
    const src = join(PUBLIC, file);
    const built = join(DIST, file);
    if (
      existsSync(src) &&
      (!existsSync(built) || readFileSync(src, 'utf8') !== readFileSync(built, 'utf8'))
    )
      missing.push(`dist/${file} differs from public/${file}`);
  }
  for (const file of readdirSync(DIST).filter((f) => f.endsWith('.html'))) {
    const html = readFileSync(join(DIST, file), 'utf8');
    for (const [, asset] of html.matchAll(/(?:href|src)="(\/_astro\/[^"?#]+)"/g))
      if (!existsSync(join(DIST, asset))) missing.push(`dist/${file} references missing ${asset}`);
  }
  if (missing.length) abort(missing);
}

const errors = [];
const warnings = [];
const fail = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&#38;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
const meta = (html, attr, name) => {
  const re = new RegExp(`<meta[^>]*${attr}="${name}"[^>]*content="([^"]*)"`, 'i');
  const m = html.match(re);
  return m ? decode(m[1]) : null;
};

// ---- robots.txt ------------------------------------------------------------
const robotsPath = join(DIST, 'robots.txt');
if (!existsSync(robotsPath)) fail('robots.txt missing');
else {
  const robots = readFileSync(robotsPath, 'utf8');
  if (!robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`))
    fail('robots.txt: missing absolute Sitemap line');
  for (const agent of [
    'GPTBot',
    'ClaudeBot',
    'Google-Extended',
    'Meta-ExternalAgent',
    'Applebot-Extended',
    'CCBot',
  ]) {
    const group = robots.split(/\n\s*\n/).find((g) => g.includes(`User-agent: ${agent}`));
    if (!group || !/^Disallow: \/$/m.test(group)) fail(`robots.txt: ${agent} is not blocked`);
  }
  for (const agent of [
    'Googlebot',
    'Bingbot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'Claude-SearchBot',
    'Claude-User',
    'PerplexityBot',
  ]) {
    const group = robots.split(/\n\s*\n/).find((g) => g.includes(`User-agent: ${agent}`));
    if (!group || /^Disallow: \/$/m.test(group)) fail(`robots.txt: ${agent} is not allowed`);
  }
  // Owner decisions: these must stay unnamed, so they fall under the allowed
  // `User-agent: *` group. (Applebot-Extended is a different token.)
  for (const agent of ['Applebot', 'Bytespider'])
    if (new RegExp(`^User-agent: ${agent}\\s*$`, 'mi').test(robots))
      fail(`robots.txt: ${agent} should not be named (it must fall under the allowed * group)`);
  const star = robots.split(/\n\s*\n/).find((g) => /^User-agent: \*$/m.test(g));
  if (!star || /^Disallow: \/$/m.test(star)) fail('robots.txt: the * group must allow crawling');
}

// ---- sitemap.xml -----------------------------------------------------------
const sitemapPath = join(DIST, 'sitemap.xml');
let sitemapUrls = [];
if (!existsSync(sitemapPath)) fail('sitemap.xml missing');
else {
  const xml = readFileSync(sitemapPath, 'utf8');
  if (
    !xml.startsWith('<?xml') ||
    !xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
  )
    fail('sitemap.xml: not a valid urlset');
  sitemapUrls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (sitemapUrls.length === 0) fail('sitemap.xml: no URLs');
  if (new Set(sitemapUrls).size !== sitemapUrls.length) fail('sitemap.xml: duplicate URLs');
  for (const url of sitemapUrls)
    if (!url.startsWith(`${ORIGIN}/`)) fail(`sitemap.xml: foreign or non-HTTPS URL ${url}`);
}

// Compatibility sitemaps (URLs published by the old @astrojs/sitemap setup).
// sitemap-0.xml must list exactly the same URLs as sitemap.xml, and
// sitemap-index.xml must point only at sitemap-0.xml.
const legacyUrlsetPath = join(DIST, 'sitemap-0.xml');
if (!existsSync(legacyUrlsetPath)) fail('sitemap-0.xml missing (compatibility sitemap)');
else {
  const urls = [...readFileSync(legacyUrlsetPath, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => m[1],
  );
  if (urls.join('\n') !== sitemapUrls.join('\n'))
    fail('sitemap-0.xml does not list the same URLs as sitemap.xml');
}
const legacyIndexPath = join(DIST, 'sitemap-index.xml');
if (!existsSync(legacyIndexPath)) fail('sitemap-index.xml missing (compatibility sitemap)');
else {
  const xml = readFileSync(legacyIndexPath, 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (!xml.includes('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'))
    fail('sitemap-index.xml: not a valid sitemapindex');
  if (locs.length !== 1 || locs[0] !== `${ORIGIN}/sitemap-0.xml`)
    fail('sitemap-index.xml must list only sitemap-0.xml');
}

// ---- JSON-LD business rules -------------------------------------------------
let businessBlocks = 0;
let offers = 0;
function checkSchema(path, data) {
  if (data['@type'] === 'LocalBusiness') {
    businessBlocks += 1;
    const accepted = String(data.currenciesAccepted ?? '')
      .split(',')
      .map((c) => c.trim());
    for (const currency of ['USD', 'INR'])
      if (!accepted.includes(currency)) fail(`${path}: LocalBusiness does not accept ${currency}`);
    if (data.address?.streetAddress || data.geo)
      fail(`${path}: LocalBusiness publishes a street address or coordinates`);
  }
  if (data['@type'] === 'OfferCatalog')
    for (const offer of data.itemListElement ?? []) {
      offers += 1;
      if (offer.priceCurrency !== 'USD') fail(`${path}: offer ${offer.name} is not priced in USD`);
    }
}

// ---- pages -----------------------------------------------------------------
const pages = readdirSync(DIST).filter((f) => f.endsWith('.html'));
const seen = { title: new Map(), description: new Map() };
const indexable = new Set();

for (const file of pages) {
  const html = readFileSync(join(DIST, file), 'utf8');
  const path = file === 'index.html' ? '/' : `/${file.replace(/\.html$/, '')}`;
  const url = path === '/' ? `${ORIGIN}/` : `${ORIGIN}${path}`;
  const robots = meta(html, 'name', 'robots') ?? '';
  const isIndexable = !/noindex/i.test(robots);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? null;
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? '');
  const description = meta(html, 'name', 'description');
  const h1s = html.match(/<h1[\s>]/g)?.length ?? 0;

  if (!title) fail(`${path}: no <title>`);
  if (!description) fail(`${path}: no meta description`);
  if (h1s !== 1) fail(`${path}: ${h1s} <h1> elements (expected 1)`);

  for (const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(block[1]);
      if (data['@context'] !== 'https://schema.org')
        fail(`${path}: JSON-LD without schema.org @context`);
      checkSchema(path, data);
    } catch {
      fail(`${path}: JSON-LD does not parse`);
    }
  }

  if (!isIndexable) {
    if (sitemapUrls.includes(url)) fail(`${path}: noindex page is listed in sitemap.xml`);
    continue;
  }

  indexable.add(url);
  if (canonical !== url) fail(`${path}: canonical is ${canonical}, expected ${url}`);
  if (!sitemapUrls.includes(url)) fail(`${path}: indexable page missing from sitemap.xml`);
  for (const [prop, attr] of [
    ['og:title', 'property'],
    ['og:description', 'property'],
    ['og:url', 'property'],
    ['og:image', 'property'],
    ['twitter:card', 'name'],
  ])
    if (!meta(html, attr, prop)) fail(`${path}: missing ${prop}`);
  if (meta(html, 'property', 'og:url') !== url) fail(`${path}: og:url does not match canonical`);

  if (title.length > 60) warn(`${path}: title is ${title.length} characters`);
  if (description && description.length > 160)
    warn(`${path}: description is ${description.length} characters`);
  for (const [key, value] of [
    ['title', title],
    ['description', description],
  ]) {
    if (seen[key].has(value)) fail(`${path}: duplicate ${key} (also on ${seen[key].get(value)})`);
    else seen[key].set(value, path);
  }
}

for (const url of sitemapUrls)
  if (!indexable.has(url)) fail(`sitemap.xml lists ${url}, which is not a built indexable page`);
if (businessBlocks !== pages.length)
  fail(`LocalBusiness JSON-LD found on ${businessBlocks} of ${pages.length} pages`);
if (offers === 0) fail('no priced offers found (expected an OfferCatalog on /pricing)');

// ---- report ----------------------------------------------------------------
console.log(`Checked ${pages.length} pages, ${sitemapUrls.length} sitemap URLs.`);
for (const w of warnings) console.log(`  warn  ${w}`);
for (const e of errors) console.log(`  FAIL  ${e}`);
if (errors.length) process.exit(1);
console.log('SEO check passed.');
