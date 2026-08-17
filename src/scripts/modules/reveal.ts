import { qsa, prefersReducedMotion } from './dom';

const VISIBLE = 'is-visible';

/**
 * Scroll-triggered reveals.
 *
 * Sections start hidden, which is a liability: in-app browsers (WhatsApp,
 * Instagram, Chrome Custom Tabs) throttle or skip IntersectionObserver, and
 * visitors were left looking at blank space. Every branch below ends with the
 * content visible — a skipped animation is always better than missing content.
 */
export function initReveal(): void {
  const items = qsa('.reveal');
  if (!items.length) return;

  const revealAll = (): void => items.forEach((el) => el.classList.add(VISIBLE));

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    revealAll();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add(VISIBLE);
        observer.unobserve(entry.target);
      }),
    { threshold: 0, rootMargin: '0px 0px 15% 0px' },
  );

  items.forEach((el) => observer.observe(el));

  // Anything near the viewport after 2.5s is shown regardless.
  window.setTimeout(() => {
    items
      .filter((el) => !el.classList.contains(VISIBLE))
      .filter((el) => el.getBoundingClientRect().top < window.innerHeight * 1.5)
      .forEach((el) => el.classList.add(VISIBLE));
  }, 2500);

  window.setTimeout(revealAll, 6000); // nothing stays invisible
}
