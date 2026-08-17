/** Small typed DOM helpers, so modules stay free of casting noise. */

export const qs = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document) =>
  root.querySelector<T>(selector);

export const qsa = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(selector));

export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isTouchDevice = (): boolean => window.matchMedia('(pointer: coarse)').matches;

/** Runs `fn` when the browser is idle, with a guaranteed fallback. */
export function onIdle(fn: () => void, timeout = 2000): void {
  const idle = window.requestIdleCallback;
  if (typeof idle === 'function') {
    idle(fn, { timeout });
    return;
  }
  window.setTimeout(fn, Math.min(timeout, 700));
}
