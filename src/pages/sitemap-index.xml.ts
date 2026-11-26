import type { APIRoute } from 'astro';
import { sitemapIndexXml, xmlResponse } from '@/lib/sitemap';

/**
 * /sitemap-index.xml — compatibility index, same structure @astrojs/sitemap
 * published: one entry, pointing at /sitemap-0.xml. It deliberately does not
 * also list /sitemap.xml, so a crawler reading the index sees each URL once.
 */
export const GET: APIRoute = () => xmlResponse(sitemapIndexXml(['/sitemap-0.xml']));
