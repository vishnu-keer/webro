import { LIMITS, type Env } from './config';
import { DraftError, type GenerateDraft } from './gemini';
import { validateInput } from './validate';

export interface Deps {
  /** Built lazily so a missing key is reported cleanly instead of crashing. */
  getGenerator: (env: Env) => GenerateDraft | null;
}

type Json = Record<string, unknown>;

const BASE_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
} as const;

function allowedOrigins(env: Env): string[] {
  return (env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function corsHeaders(origin: string | null, env: Env): Record<string, string> {
  if (!origin || !allowedOrigins(env).includes(origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(
  status: number,
  body: Json,
  cors: Record<string, string>,
  extra: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...BASE_HEADERS, ...cors, ...extra },
  });
}

/** Logs only an event name and numbers — never anything the customer typed. */
function logEvent(event: string, detail: Record<string, string | number | undefined> = {}): void {
  console.log(JSON.stringify({ event, ...detail }));
}

const MESSAGES = {
  quota:
    'Our AI helper has reached its free usage limit for now. You can still write your review in your own words and post it on Google — or try again later.',
  timeout: 'The AI helper took too long to respond. Please try again.',
  empty:
    'The AI helper could not prepare a draft this time. Please try again, or add a little more detail.',
  upstream:
    'The AI helper is unavailable right now. Please try again in a few minutes, or write your review directly on Google.',
  rateLimited: 'Too many requests. Please wait a minute and try again.',
  config:
    'The AI helper is not configured yet. You can still write your review directly on Google.',
} as const;

export async function handleRequest(request: Request, env: Env, deps: Deps): Promise<Response> {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin');
  const cors = corsHeaders(origin, env);

  if (url.pathname === '/health' && request.method === 'GET') {
    return json(200, { ok: true }, {});
  }

  if (url.pathname !== '/draft') return json(404, { error: 'not_found' }, cors);

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: cors['Access-Control-Allow-Origin'] ? 204 : 403,
      headers: cors,
    });
  }
  if (request.method !== 'POST')
    return json(405, { error: 'method_not_allowed' }, cors, { Allow: 'POST, OPTIONS' });

  // Browsers always send Origin on cross-site POSTs; anything else is not our page.
  if (!cors['Access-Control-Allow-Origin']) return json(403, { error: 'forbidden_origin' }, {});

  if (!(request.headers.get('Content-Type') ?? '').includes('application/json')) {
    return json(415, { error: 'unsupported_media_type' }, cors);
  }

  const declaredLength = Number(request.headers.get('Content-Length') ?? '0');
  if (declaredLength > LIMITS.maxBodyBytes)
    return json(413, { error: 'too_large', message: 'Your text is too long.' }, cors);

  // Rate limits run before the body is parsed or Gemini is touched.
  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const [perIp, global] = await Promise.all([
    env.PER_IP_LIMITER?.limit({ key: ip }) ?? { success: true },
    env.GLOBAL_LIMITER?.limit({ key: 'all' }) ?? { success: true },
  ]);
  if (!perIp.success || !global.success) {
    logEvent('rate_limited', { scope: perIp.success ? 'global' : 'ip' });
    return json(429, { error: 'rate_limited', message: MESSAGES.rateLimited }, cors, {
      'Retry-After': '60',
    });
  }

  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > LIMITS.maxBodyBytes) {
    return json(413, { error: 'too_large', message: 'Your text is too long.' }, cors);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { error: 'invalid_json' }, cors);
  }

  const validation = validateInput(body);
  if (!validation.ok) return json(400, { error: 'invalid_input', fields: validation.fields }, cors);

  const generate = deps.getGenerator(env);
  if (!generate) {
    logEvent('misconfigured');
    return json(503, { error: 'not_configured', message: MESSAGES.config }, cors);
  }

  const started = Date.now();
  try {
    const result = await generate(validation.value);
    logEvent('draft_ok', { status: result.status, ms: Date.now() - started });
    return result.status === 'draft'
      ? json(200, { status: 'draft', draft: result.draft }, cors)
      : json(200, { status: 'need_more', question: result.question }, cors);
  } catch (error) {
    const failure = error instanceof DraftError ? error : new DraftError('upstream');
    logEvent('draft_failed', {
      kind: failure.kind,
      upstreamStatus: failure.status,
      ms: Date.now() - started,
    });
    const status = failure.kind === 'quota' ? 503 : failure.kind === 'timeout' ? 504 : 502;
    const code = failure.kind === 'quota' ? 'quota_exhausted' : failure.kind;
    return json(status, { error: code, message: MESSAGES[failure.kind] }, cors);
  }
}
