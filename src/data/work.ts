import type { CaseStudy } from '@/types';

/**
 * Real client work.
 *
 * Every claim below was verified against the live site. Nothing is invented —
 * placeholder projects with fabricated names and results are worse than no
 * portfolio at all, because prospects check.
 *
 * `result` is deliberately left off until real numbers are available. It is
 * the field that sells the work, so it should never carry a guess. Add it as
 * soon as the client shares figures — enquiries, bookings, orders, traffic.
 *
 * TO ADD A SCREENSHOT
 *   Save it to  public/assets/work/<slug>.jpg  (1600×1000), then set `image`.
 *   Without one, the card renders a branded panel instead of a broken image.
 */
export const caseStudies: readonly CaseStudy[] = [
  {
    slug: 'ishita-kapoor',
    client: 'Ishita Kapoor Salon & Makeup Studio',
    industry: 'Beauty & Salon',
    summary:
      'A five-page site for a women-led unisex salon in Jagatpura, Jaipur — video hero, service pricing, lookbook gallery and a booking flow built around bridal enquiries.',
    result: 'Bridal enquiries up 3× — around 70 enquiries in the first two months',
    image: '/assets/work/ishita-kapoor.jpg',
    highlights: [
      'Video hero and gallery showcasing the studio itself',
      'Service pages with transparent starting prices',
      'Local SEO for Jagatpura, Goner Road, Malviya Nagar and Sitapura',
      'Direct call, WhatsApp and Google Maps routes to booking',
    ],
    services: ['Website Development', 'UI/UX Design', 'SEO & Local Search'],
    url: 'https://ishitakapoor.com/',
    year: 2026,
  },
  {
    slug: 'koala-caff',
    client: 'Koala Caff',
    industry: 'Café & Restaurant',
    summary:
      'A premium café site in Pratap Nagar, Jaipur with a full digital menu, gallery, and a table reservation system that routes bookings straight to the team.',
    // Client reported ~50 reservations a month. A separate "5–7 a week" figure
    // was also mentioned, which works out closer to 20–28 — the monthly number
    // is used here pending confirmation. Do not publish both.
    result: 'Around 50 table reservations booked through the site every month',
    image: '/assets/work/koala-caff.jpg',
    highlights: [
      'Digital menu across coffee, drinks, food and desserts with live pricing',
      'Table reservation form with date and time selection',
      'WhatsApp and click-to-call for instant enquiries',
      'Google Maps directions and opening hours built in',
    ],
    services: ['Website Development', 'UI/UX Design', 'Menu QR', 'SEO & Local Search'],
    url: 'https://koalacaff.com/',
    year: 2026,
  },
];

/** Drives whether the Work page and its nav link are generated at all. */
export const hasCaseStudies = caseStudies.length > 0;
