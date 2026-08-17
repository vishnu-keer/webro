import { qs, qsa } from './dom';

/** Sticky header state and the mobile menu toggle. */
export function initNavigation(): void {
  const header = qs('[data-header]');
  const toggle = qs<HTMLButtonElement>('[data-nav-toggle]');
  const menu = qs('[data-mobile-nav]');

  if (header) {
    const update = (): void => {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    // Close when navigating to an in-page anchor.
    qsa('a', menu).forEach((link) =>
      link.addEventListener('click', () => {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }),
    );
  }
}
