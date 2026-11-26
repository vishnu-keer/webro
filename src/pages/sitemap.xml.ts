import type { APIRoute } from 'astro';
import { urlsetXml, xmlResponse } from '@/lib/sitemap';

/** /sitemap.xml — the primary sitemap, referenced by robots.txt. */
export const GET: APIRoute = () => xmlResponse(urlsetXml());
