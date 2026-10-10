/** Hard limits. Kept together so cost and abuse controls are reviewable in one place. */
export const LIMITS = {
  /** Largest request body accepted, in bytes. Real submissions are ~1–3 KB. */
  maxBodyBytes: 8 * 1024,
  service: { min: 2, max: 120 },
  experience: { min: 10, max: 1500 },
  details: { min: 0, max: 800 },
  /** Draft returned to the browser is cut to this many characters. */
  maxDraftChars: 1200,
  maxQuestionChars: 300,
  /** Token ceiling sent to Gemini — bounds cost per request. */
  maxOutputTokens: 1024,
  /** Gemini call is abandoned after this long. */
  upstreamTimeoutMs: 15_000,
} as const;

export const LANGUAGES = ['auto', 'en', 'hi'] as const;
export type Language = (typeof LANGUAGES)[number];

export const BUSINESS_NAME = 'WEBRO Studio';

export interface Env {
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  ALLOWED_ORIGINS?: string;
  PER_IP_LIMITER?: RateLimit;
  GLOBAL_LIMITER?: RateLimit;
}
