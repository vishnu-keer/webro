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
    /** Google's short error reason, for logs. Never contains customer text. */
    readonly reason?: string,
  ) {
    super(kind);
  }
}

export type GenerateDraft = (input: ReviewInput) => Promise<ModelResult>;

/**
 * Thinking settings differ by model family. A rewrite needs little reasoning,
 * so we ask for the lowest level each family accepts (Gemini 3.x rejects
 * MINIMAL; Gemini 2.x uses a token budget instead of levels).
 */
export function thinkingFor(model: string): Record<string, unknown> {
  return /^gemini-2\./.test(model) ? { thinkingBudget: 0 } : { thinkingLevel: ThinkingLevel.LOW };
}

/**
 * Whether a failure on one model is worth retrying on the backup model:
 * timeouts, Google-side overload/outages, an unknown model, or that model's
 * own quota running out. Bad input is not retried.
 */
export function shouldTryNextModel(error: DraftError): boolean {
  if (error.kind === 'timeout' || error.kind === 'quota' || error.kind === 'empty') return true;
  return error.status === undefined || error.status === 404 || error.status >= 500;
}

/**
 * Plain text generation only: no search grounding, tools, files or caching,
 * so no paid add-on features are ever triggered.
 *
 * `models` is tried in order — the configured model first, then the backup.
 */
export function createGeminiGenerator(apiKey: string, models: readonly string[]): GenerateDraft {
  const ai = new GoogleGenAI({ apiKey, httpOptions: { timeout: LIMITS.upstreamTimeoutMs } });

  const call = (model: string, input: ReviewInput, withThinkingConfig: boolean) =>
    ai.models.generateContent({
      model,
      contents: buildUserPrompt(input),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
        maxOutputTokens: LIMITS.maxOutputTokens,
        responseMimeType: 'application/json',
        responseJsonSchema: RESPONSE_SCHEMA,
        ...(withThinkingConfig ? { thinkingConfig: thinkingFor(model) } : {}),
        abortSignal: AbortSignal.timeout(LIMITS.upstreamTimeoutMs),
      },
    });

  const tryModel = async (model: string, input: ReviewInput): Promise<ModelResult> => {
    let response;
    try {
      response = await call(model, input, true);
    } catch (error) {
      // If a model rejects the thinking setting, retry once without it.
      if (error instanceof ApiError && error.status === 400 && /thinking/i.test(error.message)) {
        try {
          response = await call(model, input, false);
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

  return async (input) => {
    let lastError = new DraftError('upstream');
    for (const [index, model] of models.entries()) {
      try {
        return await tryModel(model, input);
      } catch (error) {
        lastError = toDraftError(error);
        const hasNext = index < models.length - 1;
        if (!hasNext || !shouldTryNextModel(lastError)) break;
        console.log(
          JSON.stringify({
            event: 'model_fallback',
            from: model,
            kind: lastError.kind,
            upstreamStatus: lastError.status,
          }),
        );
      }
    }
    throw lastError;
  };
}

/** Maps SDK errors to the few cases the browser needs to know about. Never includes text. */
export function toDraftError(error: unknown): DraftError {
  if (error instanceof DraftError) return error;
  if (error instanceof ApiError) {
    const reason = googleReason(error.message);
    if (error.status === 429) return new DraftError('quota', 429, reason);
    return new DraftError('upstream', error.status, reason);
  }
  const name = error instanceof Error ? error.name : '';
  const message = error instanceof Error ? error.message : '';
  if (name === 'AbortError' || name === 'TimeoutError' || /timed? ?out|abort/i.test(message)) {
    return new DraftError('timeout');
  }
  return new DraftError('upstream', undefined, name || 'unknown_error');
}

/**
 * Pulls Google's status and message out of an API error. Google's error body
 * describes the request settings (key, model, parameters), never the prompt.
 */
function googleReason(message: string): string {
  try {
    const parsed = JSON.parse(message.slice(message.indexOf('{'))) as {
      error?: { status?: string; message?: string };
    };
    const detail = [parsed.error?.status, parsed.error?.message].filter(Boolean).join(': ');
    if (detail) return detail.slice(0, 200);
  } catch {
    /* not JSON — fall through */
  }
  return message.slice(0, 200);
}
