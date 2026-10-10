import { qs } from './dom';
import { trackEvent } from './analytics';

/**
 * Client side of the tap-to-review helper (/review).
 *
 * The browser only ever talks to our Cloudflare Worker, which holds the Gemini
 * key. Nothing here is a secret. The customer's choices are sent once, for
 * that one review, and are never stored or sent to analytics.
 */

/** The Worker may try a backup model after a slow first attempt, so allow for both. */
const REQUEST_TIMEOUT_MS = 45_000;
const NOTE_ALONE_MIN = 10;
const OTHER_MIN = 2;

interface DraftResponse {
  status?: 'draft' | 'need_more';
  draft?: string;
  question?: string;
  error?: string;
  message?: string;
  fields?: Partial<Record<'service' | 'liked' | 'note' | 'language', string>>;
}

interface Payload {
  services: string[];
  otherService: string;
  liked: string[];
  note: string;
  language: string;
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
      say(copyStatus, 'There is nothing to copy yet — write your review first.', 'error');
      draft.focus();
      return;
    }
    const copied = await copyText(draft);
    if (copied) {
      say(
        copyStatus,
        'Copied ✓ Now tap "Open Google Reviews", paste it in the review box, check it, choose your own rating and post it.',
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

  const otherWrap = qs('[data-other-wrap]', form);
  const otherInput = qs<HTMLInputElement>('#review-other', form);

  const setStepError = (step: 'service' | 'liked', message: string | null): void => {
    const fieldset = form.querySelector<HTMLElement>(`[data-step="${step}"]`);
    const error = form.querySelector<HTMLElement>(`[data-error-for="${step}"]`);
    fieldset?.setAttribute('data-invalid', String(message !== null));
    if (!error) return;
    error.hidden = message === null;
    if (message) error.textContent = message;
    error.id ||= `review-${step}-error`;
    fieldset?.setAttribute('aria-describedby', error.id);
  };

  const read = (): Payload => {
    const data = new FormData(form);
    return {
      services: data.getAll('services').map(String),
      otherService: String(data.get('otherService') ?? '').trim(),
      liked: data.getAll('liked').map(String),
      note: String(data.get('note') ?? '').trim(),
      language: String(data.get('language') ?? 'en'),
    };
  };

  const validate = (payload: Payload): boolean => {
    let ok = true;
    if (payload.services.length === 0) {
      setStepError('service', 'Please choose what we did for you.');
      ok = false;
    } else if (payload.services.includes('Other') && payload.otherService.length < OTHER_MIN) {
      setStepError('service', 'Please type the other service we did for you.');
      ok = false;
    } else {
      setStepError('service', null);
    }
    if (payload.liked.length === 0 && payload.note.length < NOTE_ALONE_MIN) {
      setStepError(
        'liked',
        'Please tap at least one thing you liked, or write a short note below.',
      );
      ok = false;
    } else {
      setStepError('liked', null);
    }
    return ok;
  };

  // Live feedback: show "Other" input, clear errors as soon as they are fixed.
  form.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;
    if (target.name === 'services' && target.value === 'Other') {
      if (otherWrap) otherWrap.hidden = !target.checked;
      if (target.checked) otherInput?.focus();
    }
    if (form.querySelector('[data-invalid="true"]')) validate(read());
  });
  form.addEventListener('input', () => {
    if (form.querySelector('[data-invalid="true"]')) validate(read());
  });

  let busy = false;
  let lastPayload: Payload | null = null;
  const regenerate = qs<HTMLButtonElement>('[data-review-regenerate]');
  const back = qs<HTMLButtonElement>('[data-review-back]');

  const setBusy = (value: boolean): void => {
    busy = value;
    form.setAttribute('aria-busy', String(value));
    if (generate) {
      generate.disabled = value;
      generate.textContent = value ? 'Writing your review…' : 'Write my review';
    }
    if (regenerate) {
      regenerate.disabled = value;
      regenerate.textContent = value ? 'Writing…' : '↻ Write it differently';
    }
  };

  const showResult = (text: string, language: string): void => {
    draft.value = text;
    draft.lang = language === 'hi' ? 'hi' : '';
    aiNotice?.removeAttribute('hidden');
    say(copyStatus, '');
    form.hidden = true;
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
    draft.focus({ preventScroll: true });
  };

  const showForm = (message = '', tone: 'info' | 'error' = 'info'): void => {
    result.hidden = true;
    form.hidden = false;
    say(status, message, tone);
  };

  const request = async (payload: Payload): Promise<void> => {
    if (busy) return;
    setBusy(true);
    say(status, 'Writing your review…');
    say(copyStatus, result.hidden ? '' : 'Writing a new version…');

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
        showResult(data.draft, payload.language);
        trackEvent('review_draft_generated');
        return;
      }

      if (response.ok && data.status === 'need_more' && data.question) {
        showForm(`${data.question} Tap a few more options or add a short note, then try again.`);
        return;
      }

      if (response.status === 400 && data.fields) {
        if (data.fields.service) setStepError('service', data.fields.service);
        if (data.fields.liked) setStepError('liked', data.fields.liked);
        showForm('Please check the highlighted step.', 'error');
        return;
      }

      const message =
        data.message ??
        'The AI helper is unavailable right now. You can still write your review directly on Google.';
      if (result.hidden) say(status, message, 'error');
      else say(copyStatus, message, 'error');
    } catch {
      const message =
        'Could not reach the AI helper. Check your connection and try again, or write your review directly on Google.';
      if (result.hidden) say(status, message, 'error');
      else say(copyStatus, message, 'error');
    } finally {
      setBusy(false);
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const payload = read();
    if (!validate(payload)) {
      form
        .querySelector<HTMLElement>('[data-invalid="true"]')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    lastPayload = payload;
    void request(payload);
  });

  regenerate?.addEventListener('click', () => {
    if (lastPayload) void request(lastPayload);
  });

  back?.addEventListener('click', () => {
    showForm();
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}
