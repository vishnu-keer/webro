import type { APIRoute } from 'astro';
import { urlsetXml, xmlResponse } from '@/lib/sitemap';

/**
 * /sitemap-0.xml — compatibility copy of /sitemap.xml.
 * This URL was published by @astrojs/sitemap and may already be known to
 * search engines, so it keeps working and lists the same canonical URLs.
 */
export const GET: APIRoute = () => xmlResponse(urlsetXml());
