import { qs, prefersReducedMotion } from './dom';

const PHRASES = [
  'Websites that convert.',
  'Apps people actually use.',
  'AI that does the busywork.',
  'QR tools for restaurants.',
] as const;

const TYPE_MS = 75;
const DELETE_MS = 40;
const HOLD_MS = 1800;

/** Cycling headline above the hero title. */
export function initTypewriter(): void {
  const target = qs('[data-typewriter]');
  if (!target) return;

  if (prefersReducedMotion()) {
    target.textContent = PHRASES[0] ?? '';
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = (): void => {
    const phrase = PHRASES[phraseIndex] ?? '';
    charIndex += deleting ? -1 : 1;
    target.innerHTML = `${phrase.slice(0, charIndex)}<span class="hero__cursor"></span>`;

    let delay = deleting ? DELETE_MS : TYPE_MS;

    if (!deleting && charIndex === phrase.length) {
      delay = HOLD_MS;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % PHRASES.length;
      delay = 350;
    }

    window.setTimeout(tick, delay);
  };

  tick();
}
