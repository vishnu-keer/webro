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
 * Every initialiser is a no-op when its markup is absent, so a single bundle
 * serves every page without per-page conditionals.
 */
function bootstrap(): void {
  initLoader();
  initNavigation();
  initReveal();
  initPointerGlow();
  initAccordion();
  initTypewriter();
  initAnalytics();
  initChatWidget();

  initContactForm({
    web3formsKey: site.web3formsKey,
    email: site.email,
    phoneDisplay: site.phoneDisplay,
  });

  const sceneName = document.body.dataset.scene as BackgroundScene | undefined;
  if (sceneName) void initBackground(sceneName);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
