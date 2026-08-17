import type { ProcessStep, Service, TrustSignal, Value } from '@/types';

export const services: readonly Service[] = [
  {
    slug: 'website-development',
    icon: 'web',
    title: 'Website Development',
    summary:
      'Fast, responsive business websites built to load quickly and turn visitors into enquiries.',
    tag: 'Most requested',
  },
  {
    slug: 'ecommerce',
    icon: 'cart',
    title: 'E-commerce Stores',
    summary:
      'Online stores with secure checkout, payment gateways and inventory — Shopify or fully custom.',
  },
  {
    slug: 'mobile-apps',
    icon: 'app',
    title: 'Mobile App Development',
    summary:
      'iOS and Android apps from a single codebase, with clean UX and the backend to support it.',
  },
  {
    slug: 'custom-software',
    icon: 'code',
    title: 'Custom Software',
    summary:
      'Dashboards, booking systems, CRMs and internal tools built around how your business actually runs.',
  },
  {
    slug: 'ai-automation',
    icon: 'ai',
    title: 'AI Automation & Chatbots',
    summary:
      'AI agents that answer customers, qualify leads and handle repetitive work around the clock.',
    tag: 'High ROI',
  },
  {
    slug: 'design',
    icon: 'design',
    title: 'UI/UX & Logo Design',
    summary:
      'Brand identity, logo systems and interface design that make a premium price feel obvious.',
  },
  {
    slug: 'instagram',
    icon: 'instagram',
    title: 'Instagram Handling',
    summary:
      'Full account management — content planning, design, captions, hashtags, reels and scheduling.',
    tag: 'Monthly',
  },
  {
    slug: 'menu-qr',
    icon: 'qr',
    title: 'Menu QR',
    summary:
      'Digital menu with a scannable QR code for restaurants and cafés. Update prices instantly, no reprinting.',
    tag: 'For restaurants',
  },
  {
    slug: 'review-qr',
    icon: 'star',
    title: 'Review QR',
    summary:
      'A branded QR stand that sends customers straight to your Google review page — the fastest way to build local ranking.',
    tag: 'Local SEO',
  },
  {
    slug: 'seo',
    icon: 'seo',
    title: 'SEO & Digital Marketing',
    summary:
      'Technical SEO, local search, content and ads that bring qualified traffic instead of vanity numbers.',
  },
  {
    slug: 'business-automation',
    icon: 'bolt',
    title: 'Business Automation',
    summary:
      'Connect your tools so orders, leads, invoices and reports move themselves. Less admin, fewer mistakes.',
  },
  {
    slug: 'maintenance',
    icon: 'shield',
    title: 'Maintenance & Support',
    summary:
      'Hosting, updates, backups, security and speed monitoring so your site never quietly breaks.',
  },
];

/**
 * Promises we control, deliberately chosen over invented statistics.
 * Nothing here can be contradicted by a prospect checking up on us.
 */
export const trustSignals: readonly TrustSignal[] = [
  { icon: 'bolt', title: 'Fast delivery', detail: 'Most websites live in 2–3 weeks, not months.' },
  { icon: 'shield', title: 'You own everything', detail: 'Code, domain, hosting and accounts — all yours.' },
  { icon: 'star', title: 'Fixed pricing', detail: 'Agreed before we start. No hourly surprises.' },
  { icon: 'ai', title: '1 business day', detail: 'That is our reply time on every enquiry.' },
];

export const processSteps: readonly ProcessStep[] = [
  {
    step: '01',
    title: 'Discover',
    detail: 'We learn your business, your customers and the one result that matters most.',
  },
  {
    step: '02',
    title: 'Design',
    detail: 'You see real layouts with real content before a line of code is written.',
  },
  {
    step: '03',
    title: 'Build',
    detail: 'Development with preview links, so you watch it come together and give feedback early.',
  },
  {
    step: '04',
    title: 'Launch',
    detail: 'We deploy, test on real devices, hand over everything, and stay available after.',
  },
];

export const values: readonly Value[] = [
  {
    title: 'We tell you the truth',
    detail: 'If a feature will not help your business, we say so before you pay for it.',
  },
  {
    title: 'Speed is a feature',
    detail: 'A slow website loses customers. We treat load time as part of the design.',
  },
  {
    title: 'No lock-in, ever',
    detail: 'You own your code, hosting and domain. Leave whenever you like.',
  },
  {
    title: 'Built to be handed over',
    detail: 'Clean, documented work any developer can pick up later.',
  },
  {
    title: 'Mobile decides',
    detail: 'Most of your visitors are on a phone. That is where we design first.',
  },
  {
    title: 'We answer',
    detail: 'Real replies from real people, within one business day.',
  },
];
