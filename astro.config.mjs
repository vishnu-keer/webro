import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// NOTE: @astrojs/sitemap is pinned to an exact version in package.json.
// Releases from 3.3 onward target Astro 5's `astro:build:done` hook signature
// and crash on Astro 4 with "Cannot read properties of undefined (reading
// 'reduce')". Upgrade both together, never one alone.

// https://astro.build/config
export default defineConfig({
  site: 'https://webro.studio',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: {
    // Emit /about.html rather than /about/index.html so URLs match the
    // existing indexed pages and no redirects are needed.
    format: 'file',
    inlineStylesheets: 'auto',
  },
});
