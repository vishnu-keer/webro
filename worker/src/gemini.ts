import { ApiError, GoogleGenAI, ThinkingLevel } from '@google/genai';
import { LIMITS } from './config';
import {
  RESPONSE_SCHEMA,
  SYSTEM_INSTRUCTION,
  buildUserPrompt,
  parseModelOutput,
  type ModelResult,
} from './prompt';
import type { ReviewInput } from './validate';

export type UpstreamFailure = 'quota' | 'timeout' | 'empty' | 'upstream';

export class DraftError extends Error {
  constructor(
    readonly kind: UpstreamFailure,
    readonly status?: number,
  ) {
    super(kind);
  }
}

export type GenerateDraft = (input: ReviewInput) => Promise<ModelResult>;

/**
 * Plain text generation only: no search grounding, tools, files or caching,
 * so no paid add-on features are ever triggered.
 */
export function createGeminiGenerator(apiKey: string, model: string): GenerateDraft {
  const ai = new GoogleGenAI({ apiKey, httpOptions: { timeout: LIMITS.upstreamTimeoutMs } });

  const call = (input: ReviewInput, withThinkingConfig: boolean) =>
    ai.models.generateContent({
      model,
      contents: buildUserPrompt(input),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
        maxOutputTokens: LIMITS.maxOutputTokens,
        responseMimeType: 'application/json',
        responseJsonSchema: RESPONSE_SCHEMA,
        // A rewrite needs little reasoning; minimal thinking keeps tokens and latency down.
        ...(withThinkingConfig ? { thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL } } : {}),
        abortSignal: AbortSignal.timeout(LIMITS.upstreamTimeoutMs),
      },
    });

  return async (input) => {
    let response;
    try {
      response = await call(input, true);
    } catch (error) {
      // If a future model rejects the thinking setting, retry once without it.
      if (error instanceof ApiError && error.status === 400 && /thinking/i.test(error.message)) {
        try {
          response = await call(input, false);
        } catch (retryError) {
          throw toDraftError(retryError);
        }
      } else {
        throw toDraftError(error);
      }
    }

    const result = parseModelOutput(response.text);
    if (!result) throw new DraftError('empty');
    return result;
  };
}

/** Maps SDK errors to the few cases the browser needs to know about. Never includes text. */
export function toDraftError(error: unknown): DraftError {
  if (error instanceof DraftError) return error;
  if (error instanceof ApiError) {
    if (error.status === 429) return new DraftError('quota', 429);
    return new DraftError('upstream', error.status);
  }
  const name = error instanceof Error ? error.name : '';
  const message = error instanceof Error ? error.message : '';
  if (name === 'AbortError' || name === 'TimeoutError' || /timed? ?out|abort/i.test(message)) {
    return new DraftError('timeout');
  }
  return new DraftError('upstream');
}
