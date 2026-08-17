type GtagFn = (command: string, eventName: string, params?: Record<string, unknown>) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
  }
}

/** No-ops when GA4 is not configured, so nothing breaks without an ID. */
export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  window.gtag?.('event', name, params);
}

/**
 * Contact intent is the metric that matters for an agency site, so calls,
 * WhatsApp taps and email clicks are tracked alongside form submissions.
 */
export function initAnalytics(): void {
  document.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement | null)?.closest('a');
    const href = link?.getAttribute('href');
    if (!href) return;

    if (href.startsWith('tel:')) trackEvent('call_click', { method: 'phone' });
    else if (href.includes('wa.me')) trackEvent('whatsapp_click', { method: 'whatsapp' });
    else if (href.startsWith('mailto:')) trackEvent('email_click', { method: 'email' });
    else if (href.includes('instagram.com')) trackEvent('instagram_click', { method: 'instagram' });
  });
}
