import type { Plan } from '@/types';

/** One-off project packages. Prices are in USD. */
export const projectPlans: readonly Plan[] = [
  {
    name: 'Starter',
    price: '$299',
    cadence: 'one-time',
    summary: 'A sharp one-page site for new businesses.',
    features: [
      'Up to 3 sections',
      'Mobile responsive',
      'Contact form + WhatsApp',
      'Basic SEO setup',
      'Delivered in 5–7 days',
    ],
  },
  {
    name: 'Business',
    price: '$899',
    cadence: 'one-time',
    summary: 'A complete multi-page website for growing companies.',
    features: [
      'Up to 8 pages',
      'Custom design',
      'SEO optimised',
      'Google Analytics',
      'Free 30-day support',
      'Delivered in 2–3 weeks',
    ],
    featured: true,
  },
  {
    name: 'Premium',
    price: '$1,999',
    cadence: 'starting at',
    summary: 'E-commerce, apps and custom platforms.',
    features: [
      'Unlimited pages',
      'E-commerce or app build',
      'AI chatbot included',
      'Advanced SEO',
      'Priority support',
      'Ongoing improvements',
    ],
  },
];

/** Recurring services — the revenue that compounds. */
export const monthlyPlans: readonly Plan[] = [
  {
    name: 'Instagram Handling',
    price: '$199',
    cadence: '/month',
    summary: 'We run your account end to end.',
    features: [
      '12–16 posts per month',
      'Reels and story design',
      'Captions and hashtags',
      'Monthly performance report',
    ],
    featured: true,
  },
  {
    name: 'Menu QR',
    price: '$99',
    cadence: 'setup + $19/mo',
    summary: 'Digital menu for restaurants and cafés.',
    features: [
      'Branded QR code',
      'Unlimited menu updates',
      'Photos and categories',
      'Works on any phone',
    ],
  },
  {
    name: 'Review QR',
    price: '$79',
    cadence: 'one-time',
    summary: 'Turn happy customers into Google reviews.',
    features: [
      'Branded QR stand design',
      'Direct link to your review page',
      'Print-ready files',
      'Setup guidance',
    ],
  },
];
