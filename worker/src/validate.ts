import { LANGUAGES, LIMITS, type Language } from './config';

export interface ReviewInput {
  service: string;
  experience: string;
  details: string;
  language: Language;
}

export type ValidationResult =
  | { ok: true; value: ReviewInput }
  | { ok: false; fields: Partial<Record<keyof ReviewInput, string>> };

/** Removes control characters (keeps newlines and tabs) and collapses runs of blank lines. */
export function clean(value: string): string {
  return (
    value
      .normalize('NFC')
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
      .replace(/\r\n?/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
}

/**
 * The form never asks for contact details, but customers sometimes type them
 * anyway. They add nothing to a review, so they are removed before anything
 * is sent to Gemini.
 */
export function redactContactDetails(value: string): string {
  return value
    .replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, '[removed]')
    .replace(/(?:\+?\d[\s-]?){9,14}\d/g, '[removed]');
}

function readString(body: Record<string, unknown>, key: string): string | null {
  const raw = body[key];
  if (raw === undefined || raw === null) return '';
  return typeof raw === 'string' ? clean(raw) : null;
}

/** Checks one length-bounded text field and records an error message if it fails. */
function checkLength(
  value: string | null,
  bounds: { min: number; max: number },
  messages: { missing: string; short: string; long: string },
): string | undefined {
  if (value === null) return messages.missing;
  if (value.length === 0 && bounds.min > 0) return messages.missing;
  if (value.length < bounds.min) return messages.short;
  if (value.length > bounds.max) return messages.long;
  return undefined;
}

export function validateInput(body: unknown): ValidationResult {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { ok: false, fields: { experience: 'The request was not understood.' } };
  }
  const record = body as Record<string, unknown>;

  const service = readString(record, 'service');
  const experience = readString(record, 'experience');
  const details = readString(record, 'details');
  const languageRaw = record['language'] ?? 'auto';
  const language = (LANGUAGES as readonly unknown[]).includes(languageRaw)
    ? (languageRaw as Language)
    : null;

  const fields: Partial<Record<keyof ReviewInput, string>> = {};

  const serviceError = checkLength(service, LIMITS.service, {
    missing: 'Please tell us which service or product you used.',
    short: 'Please describe the service in a few more letters.',
    long: `Please keep this under ${LIMITS.service.max} characters.`,
  });
  if (serviceError) fields.service = serviceError;

  const experienceError = checkLength(experience, LIMITS.experience, {
    missing: 'Please describe your experience.',
    short: 'Please write at least a sentence about your experience.',
    long: `Please keep this under ${LIMITS.experience.max} characters.`,
  });
  if (experienceError) fields.experience = experienceError;

  const detailsError = checkLength(details, LIMITS.details, {
    missing: 'Details must be text.',
    short: '',
    long: `Please keep this under ${LIMITS.details.max} characters.`,
  });
  if (detailsError) fields.details = detailsError;

  if (!language) fields.language = 'Please choose English, Hindi or "Same as I wrote".';

  if (Object.keys(fields).length > 0 || !service || !experience || details === null || !language) {
    return { ok: false, fields };
  }

  return {
    ok: true,
    value: {
      service: redactContactDetails(service),
      experience: redactContactDetails(experience),
      details: redactContactDetails(details),
      language,
    },
  };
}
