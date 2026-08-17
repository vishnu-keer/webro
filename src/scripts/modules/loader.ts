import { qs } from './dom';

const SEEN_KEY = 'webro:splash-seen';

/**
 * Splash screen — shown once per session, on first arrival only.
 *
 * It previously ran on every page navigation, which added roughly a second to
 * each click and made a fast site feel sluggish. Branding earns one moment,
 * not one per click.
 *
 * Also deliberately not tied to `window.load`: that waits for every font, image
 * and third-party script, so a single slow request left visitors staring at a
 * blank screen. DOM-ready plus a hard ceiling guarantees it clears.
 */
export function initLoader(): void {
  const loader = qs('[data-loader]');
  if (!loader) return;

  let seen = false;
  try {
    seen = sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    // Private browsing can throw on storage access — treat as first visit.
  }

  if (seen) {
    loader.remove();
    return;
  }

  let done = false;
  const hide = (): void => {
    if (done) return;
    done = true;
    loader.classList.add('is-hidden');
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      // Non-fatal: worst case the splash shows again next navigation.
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.setTimeout(hide, 900));
  } else {
    window.setTimeout(hide, 900);
  }

  window.setTimeout(hide, 3000); // failsafe
}
