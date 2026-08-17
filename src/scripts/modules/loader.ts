import { qs } from './dom';

/**
 * Hides the splash screen.
 *
 * Deliberately not tied to `window.load`: that waits for every font, image and
 * third-party script, so a single slow request used to leave visitors staring
 * at a blank screen. DOM-ready plus a hard ceiling guarantees it clears.
 */
export function initLoader(): void {
  const loader = qs('[data-loader]');
  if (!loader) return;

  let done = false;
  const hide = (): void => {
    if (done) return;
    done = true;
    loader.classList.add('is-hidden');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.setTimeout(hide, 900));
  } else {
    window.setTimeout(hide, 900);
  }

  window.setTimeout(hide, 3000); // failsafe
}
