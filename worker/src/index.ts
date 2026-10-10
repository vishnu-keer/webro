import type { Env } from './config';
import { createGeminiGenerator, type GenerateDraft } from './gemini';
import { handleRequest } from './handler';

let cached: { key: string; models: string; generate: GenerateDraft } | null = null;

/** The key is read here, server-side only, and is never included in any response. */
function getGenerator(env: Env): GenerateDraft | null {
  const key = env.GEMINI_API_KEY?.trim();
  if (!key) return null;
  const models = [
    env.GEMINI_MODEL?.trim() || 'gemini-3.8-flash',
    env.GEMINI_FALLBACK_MODEL?.trim(),
  ].filter((m, i, all): m is string => Boolean(m) && all.indexOf(m) === i);
  const signature = models.join(',');
  if (!cached || cached.key !== key || cached.models !== signature) {
    cached = { key, models: signature, generate: createGeminiGenerator(key, models) };
  }
  return cached.generate;
}

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return handleRequest(request, env, { getGenerator });
  },
} satisfies ExportedHandler<Env>;
