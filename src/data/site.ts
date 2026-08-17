import type { NavLink } from '@/types';

/**
 * Single source of truth for business details.
 * Referenced by components, structured data and the chat assistant, so a
 * change here propagates everywhere.
 */
export const site = {
  name: 'WEBRO Studio',
  shortName: 'WEBRO',
  url: 'https://webro.studio',
  tagline: 'Websites, apps and AI automation that grow your business.',
  description:
    'WEBRO builds high-performance websites, mobile apps, e-commerce stores and AI automation for businesses worldwide. Menu QR, Review QR and Instagram management for restaurants and local brands.',

  email: 'webro284@gmail.com',
  phone: '+916377093356',
  phoneDisplay: '+91 63770 93356',
  whatsapp: 'https://wa.me/916377093356',
  instagram: 'https://www.instagram.com/webro.studio/',

  location: {
    locality: 'Jaipur',
    region: 'Rajasthan',
    country: 'IN',
    latitude: 26.8176736,
    longitude: 75.8617171,
    mapsUrl:
      'https://www.google.com/maps/place/WEBRO+Studio/@26.8176736,75.8591422,761m/data=!3m2!1e3!4b1!4m6!3m5!1s0x396dc96ac7f960d7:0x2caa4d48a42dc22c!8m2!3d26.8176736!4d75.8617171',
  },

  /** Markets targeted by hreflang and structured data. */
  markets: ['India', 'United States', 'United Kingdom', 'United Arab Emirates', 'Canada', 'Australia'],

  /**
   * Google Analytics 4 measurement ID.
   * Leave empty to disable analytics entirely — no script is emitted.
   */
  gaMeasurementId: '',

  /**
   * Web3Forms access key for the contact form (https://web3forms.com).
   * Leave empty and the form falls back to a pre-filled mailto link so an
   * enquiry is never silently lost.
   */
  web3formsKey: '',
} as const;

export const navLinks: readonly NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];
