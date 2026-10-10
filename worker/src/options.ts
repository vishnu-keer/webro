/**
 * The choices customers tap on /review. Single source of truth: the website
 * imports this file to render the buttons, and the Worker uses it to validate.
 * Each value here is a fact the customer chose — the AI may phrase it
 * naturally but must not add detail beyond it.
 */

export const SERVICES = [
  'Website',
  'Online store',
  'Mobile app',
  'Menu QR',
  'Review QR',
  'Instagram handling',
  'SEO',
  'AI chatbot or automation',
  'Logo and branding',
  'Other',
] as const;

export const LIKED = [
  'Fast delivery',
  'Great design',
  'Clear communication',
  'Fair pricing',
  'Easy to work with',
  'Understood my business',
  'Works well on mobile',
  'Brought more enquiries or orders',
  'Easy for me to update',
  'Helpful support after launch',
  "I'd recommend them",
] as const;

export const LANGUAGES = ['en', 'hi'] as const;

export type Service = (typeof SERVICES)[number];
export type Liked = (typeof LIKED)[number];
export type Language = (typeof LANGUAGES)[number];

/** Field limits, shared so the page and the Worker agree. */
export const INPUT_LIMITS = {
  otherService: { min: 2, max: 60 },
  note: { min: 0, max: 600 },
  /** A note this long counts as "enough to write from" even with no taps. */
  noteAloneMin: 10,
  maxLiked: LIKED.length,
} as const;
