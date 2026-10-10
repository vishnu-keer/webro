import type { Env } from './config';
import { createGeminiGenerator, type GenerateDraft } from './gemini';
import { handleRequest } from './handler';

let cached: { key: string; model: string; generate: GenerateDraft } | null = null;

/** The key is read here, server-side only, and is never included in any response. */
function getGenerator(env: Env): GenerateDraft | null {
  const key = env.GEMINI_API_KEY?.trim();
  if (!key) return null;
  const model = env.GEMINI_MODEL?.trim() || 'gemini-3.8-flash';
  if (!cached || cached.key !== key || cached.model !== model) {
    cached = { key, model, generate: createGeminiGenerator(key, model) };
  }
  return cached.generate;
}

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return handleRequest(request, env, { getGenerator });
  },
} satisfies ExportedHandler<Env>;
