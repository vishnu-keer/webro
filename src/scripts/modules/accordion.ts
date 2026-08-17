import { qsa } from './dom';

/** Accessible single-open accordion used by the FAQ page. */
export function initAccordion(): void {
  const items = qsa('[data-accordion-item]');
  if (!items.length) return;

  const close = (item: HTMLElement): void => {
    item.dataset.open = 'false';
    item.querySelector<HTMLElement>('[data-accordion-panel]')?.style.setProperty('max-height', '');
    item.querySelector('[data-accordion-trigger]')?.setAttribute('aria-expanded', 'false');
  };

  items.forEach((item) => {
    const trigger = item.querySelector<HTMLButtonElement>('[data-accordion-trigger]');
    const panel = item.querySelector<HTMLElement>('[data-accordion-panel]');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.dataset.open === 'true';
      items.forEach(close);

      if (!isOpen) {
        item.dataset.open = 'true';
        panel.style.maxHeight = `${panel.scrollHeight}px`;
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}
