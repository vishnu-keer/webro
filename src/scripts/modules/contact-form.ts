import { qs } from './dom';
import { trackEvent } from './analytics';

interface FormConfig {
  readonly web3formsKey: string;
  readonly email: string;
  readonly phoneDisplay: string;
}

interface Enquiry {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

const ENDPOINT = 'https://api.web3forms.com/submit';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Validation rule per field id. Kept in one place so submit and live checks agree. */
const RULES: Record<keyof Enquiry, (value: string) => boolean> = {
  name: (v) => v.length >= 2,
  email: (v) => EMAIL_PATTERN.test(v),
  phone: (v) => v.replace(/\D/g, '').length >= 7,
  service: (v) => v !== '',
  message: (v) => v.length >= 5,
};

/**
 * Marks a field valid/invalid and returns whether it passed. Also sets
 * aria-invalid and links the error text, so screen readers announce it.
 */
function validateField(id: keyof Enquiry): boolean {
  const control = qs<HTMLInputElement>(`#${id}`);
  const field = control?.closest<HTMLElement>('.field');
  const isValid = RULES[id](control?.value.trim() ?? '');

  field?.setAttribute('data-invalid', String(!isValid));
  if (control) {
    control.setAttribute('aria-invalid', String(!isValid));
    const error = field?.querySelector<HTMLElement>('.field__error');
    if (error) {
      error.id ||= `${id}-error`;
      control.setAttribute('aria-describedby', error.id);
    }
  }
  return isValid;
}

function readValue(id: string): string {
  return qs<HTMLInputElement>(`#${id}`)?.value.trim() ?? '';
}

function validate(): Enquiry | null {
  const enquiry: Enquiry = {
    name: readValue('name'),
    email: readValue('email'),
    phone: readValue('phone'),
    service: readValue('service'),
    message: readValue('message'),
  };

  const results = (Object.keys(RULES) as (keyof Enquiry)[]).map(validateField);
  return results.every(Boolean) ? enquiry : null;
}

/**
 * Live feedback. A field is checked when the visitor leaves it, never while
 * they are still typing the first time. Once it has shown an error, it
 * re-checks on every keystroke so the message clears the moment it is fixed.
 */
function bindLiveValidation(form: HTMLFormElement): void {
  for (const id of Object.keys(RULES) as (keyof Enquiry)[]) {
    const control = form.querySelector<HTMLElement>(`#${id}`);
    if (!control) continue;

    control.addEventListener('blur', () => {
      if ((control as HTMLInputElement).value.trim() !== '') validateField(id);
    });
    const recheck = (): void => {
      if (control.closest('.field')?.getAttribute('data-invalid') === 'true') validateField(id);
    };
    control.addEventListener('input', recheck);
    control.addEventListener('change', recheck);
  }
}

/**
 * Contact form submission.
 *
 * With a Web3Forms key the enquiry posts straight to the inbox. Without one it
 * falls back to a pre-filled mailto — the previous build silently discarded
 * every submission, which is the worst possible failure for a lead form.
 */
export function initContactForm(config: FormConfig): void {
  const form = qs<HTMLFormElement>('[data-contact-form]');
  if (!form) return;

  bindLiveValidation(form);

  const status = qs('[data-form-status]');
  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const submitLabel = submitButton?.textContent ?? 'Send enquiry';

  const setBusy = (busy: boolean): void => {
    if (!submitButton) return;
    submitButton.disabled = busy;
    submitButton.textContent = busy ? 'Sending…' : submitLabel;
  };

  const announce = (message: string): void => {
    if (!status) return;
    const heading = status.querySelector('strong');
    if (heading) heading.textContent = message;
    status.classList.remove('is-visible');
    void status.offsetWidth; // restart the entry animation
    status.classList.add('is-visible');
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const enquiry = validate();
    if (!enquiry) {
      form.querySelector<HTMLElement>('[data-invalid="true"] input, [data-invalid="true"] select')?.focus();
      return;
    }

    const payload = {
      ...enquiry,
      subject: `New enquiry from webro.studio — ${enquiry.service}`,
      from_name: 'WEBRO website',
    };

    if (!config.web3formsKey) {
      const body = [
        `Name: ${enquiry.name}`,
        `Email: ${enquiry.email}`,
        `Phone: ${enquiry.phone}`,
        `Service: ${enquiry.service}`,
        '',
        enquiry.message,
      ].join('\n');

      window.location.href =
        `mailto:${config.email}?subject=${encodeURIComponent(payload.subject)}` +
        `&body=${encodeURIComponent(body)}`;

      announce('Opening your email app…');
      trackEvent('generate_lead', { method: 'mailto' });
      return;
    }

    setBusy(true);
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: config.web3formsKey, ...payload }),
      });

      const result = (await response.json()) as { success?: boolean; message?: string };
      if (!result.success) throw new Error(result.message ?? 'Submission failed');

      announce("Thanks! We'll reply within one business day.");
      form.reset();
      trackEvent('generate_lead', { method: 'form' });
    } catch {
      announce(`Could not send — please WhatsApp us on ${config.phoneDisplay}.`);
    } finally {
      setBusy(false);
    }
  });
}
