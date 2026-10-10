import { INPUT_LIMITS, LANGUAGES, LIKED, SERVICES, type Language, type Liked } from './options';

export interface ReviewInput {
  /** A listed service, or the customer's own short label when they chose "Other". */
  service: string;
  liked: Liked[];
  note: string;
  language: Language;
}

type FieldName = 'service' | 'liked' | 'note' | 'language';

export type ValidationResult =
  { ok: true; value: ReviewInput } | { ok: false; fields: Partial<Record<FieldName, string>> };

/** Removes control characters (keeps newlines) and collapses runs of blank lines. */
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
 * The page never asks for contact details, but customers sometimes type them
 * anyway. They add nothing to a review, so they are removed before anything
 * is sent to Gemini.
 */
export function redactContactDetails(value: string): string {
  return value
    .replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, '[removed]')
    .replace(/(?:\+?\d[\s-]?){9,14}\d/g, '[removed]');
}

const asString = (value: unknown): string | null =>
  value === undefined || value === null ? '' : typeof value === 'string' ? clean(value) : null;

export function validateInput(body: unknown): ValidationResult {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { ok: false, fields: { service: 'The request was not understood.' } };
  }
  const record = body as Record<string, unknown>;
  const fields: Partial<Record<FieldName, string>> = {};

  // Service: one of the listed buttons, or "Other" plus a short label.
  const serviceRaw = asString(record['service']);
  const otherRaw = asString(record['otherService']);
  let service = '';
  if (!serviceRaw || !(SERVICES as readonly string[]).includes(serviceRaw)) {
    fields.service = 'Please choose what we did for you.';
  } else if (serviceRaw === 'Other') {
    const { min, max } = INPUT_LIMITS.otherService;
    if (otherRaw === null || otherRaw.length < min || otherRaw.length > max) {
      fields.service = `Please tell us the service in ${min}–${max} characters.`;
    } else {
      service = redactContactDetails(otherRaw);
    }
  } else {
    service = serviceRaw;
  }

  // Liked: a set of listed values only. Anything else is rejected, not ignored.
  const likedRaw = record['liked'] ?? [];
  let liked: Liked[] = [];
  if (
    !Array.isArray(likedRaw) ||
    likedRaw.length > INPUT_LIMITS.maxLiked ||
    !likedRaw.every((item) => (LIKED as readonly unknown[]).includes(item))
  ) {
    fields.liked = 'Please choose from the options shown.';
  } else {
    liked = [...new Set(likedRaw as Liked[])];
  }

  const note = asString(record['note']);
  if (note === null) fields.note = 'The note must be text.';
  else if (note.length > INPUT_LIMITS.note.max) {
    fields.note = `Please keep this under ${INPUT_LIMITS.note.max} characters.`;
  }

  const languageRaw = record['language'] ?? 'en';
  const language = (LANGUAGES as readonly unknown[]).includes(languageRaw)
    ? (languageRaw as Language)
    : null;
  if (!language) fields.language = 'Please choose English or Hindi.';

  // Something real to write from: at least one tap, or a short sentence.
  if (
    !fields.liked &&
    !fields.note &&
    liked.length === 0 &&
    (note ?? '').length < INPUT_LIMITS.noteAloneMin
  ) {
    fields.liked = 'Please tap at least one thing you liked, or write a short note.';
  }

  if (Object.keys(fields).length > 0 || note === null || !language) return { ok: false, fields };

  return {
    ok: true,
    value: { service, liked, note: redactContactDetails(note), language },
  };
}
