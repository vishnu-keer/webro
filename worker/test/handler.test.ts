import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Env } from '../src/config';
import { DraftError, type GenerateDraft } from '../src/gemini';
import { handleRequest } from '../src/handler';

const ORIGIN = 'https://webro.studio';
const SECRET = 'test-secret-key-should-never-leak';

const okLimiter = { limit: async () => ({ success: true }) } as unknown as RateLimit;
const blockedLimiter = { limit: async () => ({ success: false }) } as unknown as RateLimit;

function env(overrides: Partial<Env> = {}): Env {
  return {
    GEMINI_API_KEY: SECRET,
    GEMINI_MODEL: 'gemini-3.8-flash',
    ALLOWED_ORIGINS: 'https://webro.studio,http://localhost:4321',
    PER_IP_LIMITER: okLimiter,
    GLOBAL_LIMITER: okLimiter,
    ...overrides,
  };
}

const goodBody = {
  service: 'Website development',
  experience: 'They built our cafe website in two weeks and replied quickly on WhatsApp.',
  details: 'Menu page could load faster.',
  language: 'en',
};

function post(
  body: unknown,
  init: { origin?: string | null; contentType?: string; raw?: string } = {},
): Request {
  const headers = new Headers({
    'Content-Type': init.contentType ?? 'application/json',
    'CF-Connecting-IP': '203.0.113.9',
  });
  if (init.origin !== null) headers.set('Origin', init.origin ?? ORIGIN);
  return new Request('https://api.example.dev/draft', {
    method: 'POST',
    headers,
    body: init.raw ?? JSON.stringify(body),
  });
}

function deps(generate: GenerateDraft | null) {
  return { getGenerator: () => generate };
}

afterEach(() => vi.restoreAllMocks());

describe('routing and CORS', () => {
  it('answers health checks', async () => {
    const res = await handleRequest(
      new Request('https://api.example.dev/health'),
      env(),
      deps(null),
    );
    expect(res.status).toBe(200);
  });

  it('allows preflight from the site only', async () => {
    const ok = await handleRequest(
      new Request('https://api.example.dev/draft', {
        method: 'OPTIONS',
        headers: { Origin: ORIGIN },
      }),
      env(),
      deps(null),
    );
    expect(ok.status).toBe(204);
    expect(ok.headers.get('Access-Control-Allow-Origin')).toBe(ORIGIN);

    const bad = await handleRequest(
      new Request('https://api.example.dev/draft', {
        method: 'OPTIONS',
        headers: { Origin: 'https://evil.example' },
      }),
      env(),
      deps(null),
    );
    expect(bad.status).toBe(403);
    expect(bad.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });

  it('rejects other origins, missing origin and wrong methods', async () => {
    const generate = vi.fn();
    expect(
      (
        await handleRequest(
          post(goodBody, { origin: 'https://evil.example' }),
          env(),
          deps(generate),
        )
      ).status,
    ).toBe(403);
    expect(
      (await handleRequest(post(goodBody, { origin: null }), env(), deps(generate))).status,
    ).toBe(403);
    const get = new Request('https://api.example.dev/draft', { headers: { Origin: ORIGIN } });
    expect((await handleRequest(get, env(), deps(generate))).status).toBe(405);
    expect(generate).not.toHaveBeenCalled();
  });

  it('rejects non-JSON content types', async () => {
    const res = await handleRequest(
      post(goodBody, { contentType: 'text/plain' }),
      env(),
      deps(vi.fn()),
    );
    expect(res.status).toBe(415);
  });
});

describe('limits and validation', () => {
  it('rejects bodies over 8 KB', async () => {
    const res = await handleRequest(
      post(null, { raw: JSON.stringify({ ...goodBody, experience: 'x'.repeat(9000) }) }),
      env(),
      deps(vi.fn()),
    );
    expect(res.status).toBe(413);
  });

  it('returns 429 when the per-IP or global limiter blocks', async () => {
    const generate = vi.fn();
    const a = await handleRequest(
      post(goodBody),
      env({ PER_IP_LIMITER: blockedLimiter }),
      deps(generate),
    );
    const b = await handleRequest(
      post(goodBody),
      env({ GLOBAL_LIMITER: blockedLimiter }),
      deps(generate),
    );
    expect(a.status).toBe(429);
    expect(b.status).toBe(429);
    expect(a.headers.get('Retry-After')).toBe('60');
    expect(generate).not.toHaveBeenCalled();
  });

  it('rejects empty input with field messages and never calls Gemini', async () => {
    const generate = vi.fn();
    const res = await handleRequest(
      post({ service: '', experience: '', language: 'en' }),
      env(),
      deps(generate),
    );
    expect(res.status).toBe(400);
    const body = (await res.json()) as { fields: Record<string, string> };
    expect(body.fields.service).toBeTruthy();
    expect(body.fields.experience).toBeTruthy();
    expect(generate).not.toHaveBeenCalled();
  });

  it('rejects malformed JSON', async () => {
    const res = await handleRequest(post(null, { raw: '{not json' }), env(), deps(vi.fn()));
    expect(res.status).toBe(400);
  });
});

describe('generation', () => {
  it('returns a draft and never echoes the key', async () => {
    const generate = vi.fn(async () => ({
      status: 'draft' as const,
      draft: 'They built our cafe website in two weeks.',
    }));
    const res = await handleRequest(post(goodBody), env(), deps(generate));
    const text = await res.text();
    expect(res.status).toBe(200);
    expect(JSON.parse(text)).toEqual({
      status: 'draft',
      draft: 'They built our cafe website in two weeks.',
    });
    expect(text).not.toContain(SECRET);
    expect(res.headers.get('Cache-Control')).toBe('no-store');
  });

  it('passes a follow-up question through when input is too thin', async () => {
    const generate = vi.fn(async () => ({
      status: 'need_more' as const,
      question: 'What did they build for you?',
    }));
    const res = await handleRequest(post(goodBody), env(), deps(generate));
    expect(await res.json()).toEqual({
      status: 'need_more',
      question: 'What did they build for you?',
    });
  });

  it('sends Hindi input through unchanged', async () => {
    const generate = vi.fn(async () => ({ status: 'draft' as const, draft: 'ठीक' }));
    await handleRequest(
      post({
        service: 'वेबसाइट',
        experience: 'वेबसाइट समय पर बनी, पर बदलाव में देर लगी।',
        language: 'hi',
      }),
      env(),
      deps(generate),
    );
    expect(generate).toHaveBeenCalledWith(
      expect.objectContaining({
        experience: 'वेबसाइट समय पर बनी, पर बदलाव में देर लगी।',
        language: 'hi',
      }),
    );
  });

  it.each([
    ['quota', 503, 'quota_exhausted'],
    ['timeout', 504, 'timeout'],
    ['empty', 502, 'empty'],
    ['upstream', 502, 'upstream'],
  ] as const)('maps %s failures to %i with a friendly message', async (kind, status, code) => {
    const generate = vi.fn(async () => {
      throw new DraftError(kind);
    });
    const res = await handleRequest(post(goodBody), env(), deps(generate));
    const body = (await res.json()) as { error: string; message: string };
    expect(res.status).toBe(status);
    expect(body.error).toBe(code);
    expect(body.message.length).toBeGreaterThan(10);
  });

  it('reports a missing key without crashing', async () => {
    const res = await handleRequest(post(goodBody), env({ GEMINI_API_KEY: undefined }), deps(null));
    expect(res.status).toBe(503);
  });

  it('never logs what the customer wrote or the draft', async () => {
    const logs: string[] = [];
    vi.spyOn(console, 'log').mockImplementation((...args) => logs.push(args.join(' ')));
    vi.spyOn(console, 'error').mockImplementation((...args) => logs.push(args.join(' ')));
    const generate = vi.fn(async () => ({
      status: 'draft' as const,
      draft: 'UNIQUE-DRAFT-MARKER',
    }));
    await handleRequest(
      post({ ...goodBody, experience: 'UNIQUE-INPUT-MARKER and a full sentence.' }),
      env(),
      deps(generate),
    );
    const all = logs.join('\n');
    expect(all).not.toContain('UNIQUE-INPUT-MARKER');
    expect(all).not.toContain('UNIQUE-DRAFT-MARKER');
    expect(all).not.toContain(SECRET);
  });
});
