import { isTouchDevice } from './dom';

/** Feeds cursor position to `.card` as CSS custom properties. */
export function initPointerGlow(): void {
  if (isTouchDevice()) return;

  document.addEventListener(
    'pointermove',
    (event) => {
      const card = (event.target as HTMLElement | null)?.closest<HTMLElement>('.card');
      if (!card) return;

      const rect = card.getBoundingClientRect();
      card.style.setProperty('--pointer-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
      card.style.setProperty('--pointer-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
    },
    { passive: true },
  );
}
