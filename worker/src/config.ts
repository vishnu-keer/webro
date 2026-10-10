/** Hard limits. Kept together so cost and abuse controls are reviewable in one place. */
export const LIMITS = {
  /** Largest request body accepted, in bytes. Real submissions are ~1–3 KB. */
  maxBodyBytes: 8 * 1024,
  /** Draft returned to the browser is cut to this many characters. */
  maxDraftChars: 1200,
  maxQuestionChars: 300,
  /** Token ceiling sent to Gemini — bounds cost per request. */
  maxOutputTokens: 1024,
  /** Each Gemini call is abandoned after this long (primary, then backup). */
  upstreamTimeoutMs: 12_000,
} as const;

export const BUSINESS_NAME = 'WEBRO Studio';

export interface Env {
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  /** Tried automatically if the main model times out, is overloaded or out of quota. */
  GEMINI_FALLBACK_MODEL?: string;
  ALLOWED_ORIGINS?: string;
  PER_IP_LIMITER?: RateLimit;
  GLOBAL_LIMITER?: RateLimit;
}
