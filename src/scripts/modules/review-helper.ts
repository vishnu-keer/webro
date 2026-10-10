import { qs } from './dom';
import { trackEvent } from './analytics';

/**
 * Client side of the AI review helper (/review).
 *
 * The browser only ever talks to our Cloudflare Worker, which holds the Gemini
 * key. Nothing here is a secret. The customer's text is sent once, for that
 * one draft, and is not stored or sent to analytics.
 */

type Field = 'service' | 'experience' | 'details';

/** Mirrors worker/src/config.ts. The Worker re-checks everything. */
const RULES: Record<Field, { min: number; max: number }> = {
  service: { min: 2, max: 120 },
  experience: { min: 10, max: 1500 },
  details: { min: 0, max: 800 },
};

const REQUEST_TIMEOUT_MS = 25_000;

interface DraftResponse {
  status?: 'draft' | 'need_more';
  draft?: string;
  question?: string;
  error?: string;
  message?: string;
  fields?: Partial<Record<Field, string>>;
}

function setFieldError(form: HTMLFormElement, field: Field, message: string | null): boolean {
  const control = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${field}"]`);
  const wrapper = control?.closest<HTMLElement>('.field');
  const error = wrapper?.querySelector<HTMLElement>('.field__error');
  const invalid = message !== null;

  wrapper?.setAttribute('data-invalid', String(invalid));
  if (control) {
    control.setAttribute('aria-invalid', String(invalid));
    if (error) {
      error.id ||= `${control.id}-error`;
      control.setAttribute('aria-describedby', error.id);
      if (message) error.textContent = message;
    }
  }
  return !invalid;
}

function checkField(form: HTMLFormElement, field: Field): boolean {
  const value = (form.elements.namedItem(field) as HTMLInputElement | null)?.value.trim() ?? '';
  const { min, max } = RULES[field];
  if (value.length > max)
    return setFieldError(form, field, `Please keep this under ${max} characters.`);
  if (value.length < min) {
    const message =
      field === 'service'
        ? 'Please tell us which service or product you used.'
        : 'Please write at least a sentence about your experience.';
    return setFieldError(form, field, message);
  }
  return setFieldError(form, field, null);
}

/** Copies text, falling back to a selection-based copy for older mobile browsers. */
async function copyText(textarea: HTMLTextAreaElement): Promise<boolean> {
  const text = textarea.value;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, text.length);
  try {
    // Deprecated but still the only option on some in-app browsers.
    return document.execCommand('copy');
  } catch {
    return false;
  }
}

export function initReviewHelper(): void {
  const result = qs('[data-review-result]');
  if (!result) return;

  const form = qs<HTMLFormElement>('[data-review-form]');
  const status = qs('[data-review-status]');
  const generate = qs<HTMLButtonElement>('[data-review-generate]');
  const draft = qs<HTMLTextAreaElement>('#review-draft');
  const aiNotice = qs('[data-ai-notice]');
  const copyButton = qs<HTMLButtonElement>('[data-review-copy]');
  const copyStatus = qs('[data-copy-status]');
  const openLink = qs<HTMLAnchorElement>('[data-review-open]');
  const back = qs<HTMLButtonElement>('[data-review-back]');
  if (!draft) return;

  const say = (
    el: HTMLElement | null,
    message: string,
    tone: 'info' | 'error' | 'ok' = 'info',
  ): void => {
    if (!el) return;
    el.textContent = message;
    el.dataset['tone'] = tone;
  };

  // ---- Final actions (work with or without AI) ----------------------------

  copyButton?.addEventListener('click', async () => {
    if (draft.value.trim() === '') {
      say(
        copyStatus,
        'There is nothing to copy yet — write or generate your review first.',
        'error',
      );
      draft.focus();
      return;
    }
    const copied = await copyText(draft);
    if (copied) {
      say(
        copyStatus,
        'Copied. Now open Google Reviews, paste it into the review box, check the text, choose your own rating and submit it yourself.',
        'ok',
      );
      trackEvent('review_copied');
    } else {
      draft.focus();
      draft.select();
      say(
        copyStatus,
        'Your browser blocked copying. The text is selected — copy it manually, then open Google Reviews.',
        'error',
      );
    }
  });

  openLink?.addEventListener('click', () => trackEvent('review_google_opened'));

  // ---- AI step -------------------------------------------------------------

  const apiUrl = form?.dataset['apiUrl'] ?? '';
  if (!form || !apiUrl) return;

  const showResult = (text: string): void => {
    draft.value = text;
    draft.lang =
      (form.elements.namedItem('language') as HTMLSelectElement | null)?.value === 'hi' ? 'hi' : '';
    aiNotice?.removeAttribute('hidden');
    say(copyStatus, '');
    form.hidden = true;
    result.hidden = false;
    draft.focus();
  };

  back?.addEventListener('click', () => {
    result.hidden = true;
    form.hidden = false;
    say(status, '');
    qs<HTMLTextAreaElement>('#review-experience')?.focus();
  });

  for (const field of Object.keys(RULES) as Field[]) {
    const control = form.elements.namedItem(field) as HTMLElement | null;
    control?.addEventListener('blur', () => {
      if ((control as HTMLInputElement).value.trim() !== '') checkField(form, field);
    });
    control?.addEventListener('input', () => {
      if (control.closest('.field')?.getAttribute('data-invalid') === 'true')
        checkField(form, field);
    });
  }

  let busy = false;
  const setBusy = (value: boolean): void => {
    busy = value;
    if (!generate) return;
    generate.disabled = value;
    generate.textContent = value ? 'Preparing your draft…' : 'Generate Review Draft';
    form.setAttribute('aria-busy', String(value));
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy) return;

    const checks = (Object.keys(RULES) as Field[]).map((field) => checkField(form, field));
    if (!checks.every(Boolean)) {
      form
        .querySelector<HTMLElement>('[data-invalid="true"] input, [data-invalid="true"] textarea')
        ?.focus();
      return;
    }

    const read = (name: string): string =>
      (form.elements.namedItem(name) as HTMLInputElement | null)?.value.trim() ?? '';
    const payload = {
      service: read('service'),
      experience: read('experience'),
      details: read('details'),
      language: read('language') || 'auto',
    };

    setBusy(true);
    say(status, 'Preparing your draft…');

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        credentials: 'omit',
      });
      const data = (await response.json().catch(() => ({}))) as DraftResponse;

      if (response.ok && data.status === 'draft' && data.draft) {
        say(status, '');
        showResult(data.draft);
        trackEvent('review_draft_generated');
        return;
      }

      if (response.ok && data.status === 'need_more' && data.question) {
        say(
          status,
          `${data.question} Please add a little more detail above and try again.`,
          'info',
        );
        qs<HTMLTextAreaElement>('#review-details')?.focus();
        return;
      }

      if (response.status === 400 && data.fields) {
        for (const [field, message] of Object.entries(data.fields)) {
          if (field in RULES && message) setFieldError(form, field as Field, message);
        }
        say(status, 'Please check the highlighted fields.', 'error');
        return;
      }

      say(
        status,
        data.message ??
          'The AI helper is unavailable right now. You can still write your review directly on Google.',
        'error',
      );
    } catch {
      say(
        status,
        'Could not reach the AI helper. Check your connection and try again, or write your review directly on Google.',
        'error',
      );
    } finally {
      setBusy(false);
    }
  });
}
