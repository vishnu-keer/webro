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

/** Marks a field valid/invalid and returns whether it passed. */
function validateField(id: string, isValid: boolean): boolean {
  qs(`#${id}`)?.closest<HTMLElement>('.field')?.setAttribute('data-invalid', String(!isValid));
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

  const checks = [
    validateField('name', enquiry.name.length >= 2),
    validateField('email', EMAIL_PATTERN.test(enquiry.email)),
    validateField('phone', enquiry.phone.replace(/\D/g, '').length >= 7),
    validateField('service', enquiry.service !== ''),
    validateField('message', enquiry.message.length >= 5),
  ];

  return checks.every(Boolean) ? enquiry : null;
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
