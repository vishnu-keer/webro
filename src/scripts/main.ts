import type { BackgroundScene } from '@/types';
import { site } from '@/data/site';

import { initLoader } from './modules/loader';
import { initNavigation } from './modules/navigation';
import { initReveal } from './modules/reveal';
import { initPointerGlow } from './modules/pointer-glow';
import { initAccordion } from './modules/accordion';
import { initTypewriter } from './modules/typewriter';
import { initAnalytics } from './modules/analytics';
import { initContactForm } from './modules/contact-form';
import { initChatWidget } from './chat/widget';
import { initBackground } from './background/renderer';

/**
 * Client entry point.
 *
 * With view transitions enabled, Astro swaps the document body on every
 * navigation. That splits initialisation in two:
 *
 *   • Global — document-level delegated listeners. These survive the swap, so
 *     running them twice would double-fire every handler. Guarded by a flag.
 *   • Per page — anything bound to elements inside <body>, which are destroyed
 *     and recreated. These must run again after each navigation.
 *
 * Every initialiser is a no-op when its markup is absent, so one bundle serves
 * every page without per-page conditionals.
 */

let globalsReady = false;

function initGlobals(): void {
  if (globalsReady) return;
  globalsReady = true;

  initAnalytics(); // document click delegation
  initPointerGlow(); // document pointermove delegation
}

function initPage(): void {
  initLoader();
  initNavigation();
  initReveal();
  initTypewriter();
  initChatWidget();
  initAccordion(); // binds to each trigger element, so must re-run per page

  initContactForm({
    web3formsKey: site.web3formsKey,
    email: site.email,
    phoneDisplay: site.phoneDisplay,
  });

  const sceneName = document.body.dataset.scene as BackgroundScene | undefined;
  if (sceneName) void initBackground(sceneName);
}

/**
 * `astro:page-load` fires on the initial load *and* after every view
 * transition, so it is the only hook needed for per-page setup.
 */
document.addEventListener('astro:page-load', () => {
  initGlobals();
  initPage();
});
