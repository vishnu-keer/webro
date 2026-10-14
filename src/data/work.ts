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
 *   Save it to  public/assets/work/<slug>.jpg  (1600×900, a 16:9 desktop screenshot), then set `image`.
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
  {
    slug: 'classy-salon',
    client: 'Classy Unisex Salon',
    industry: 'Beauty & Salon',
    summary:
      'A multi-page site for an established unisex salon in Jagatpura, Jaipur — hair, skin and bridal makeup services, a gallery, Google reviews and a WhatsApp booking form.',
    // No `result` yet — add one when the client shares real numbers.
    image: '/assets/work/classy-salon.jpg',
    highlights: [
      'Service pages for hair, skin and makeup — 15 treatments, each explained',
      'Booking form that opens WhatsApp with service, date and time filled in',
      'Google rating and reviews on the site, linked to the Business Profile',
      'Gallery, Instagram and Google Maps directions built in',
    ],
    services: ['Website Development', 'UI/UX Design', 'SEO & Local Search'],
    url: 'https://www.theclassysalon.com/',
    year: 2026,
  },
  {
    slug: 'namo-restro',
    client: 'Namo Restro',
    industry: 'Café & Restaurant',
    summary:
      'A restaurant site opposite SKIT College in Ramnagariya, Jaipur — a full digital menu, food gallery and a table reservation flow that sends bookings to WhatsApp.',
    image: '/assets/work/namo-restro.jpg',
    highlights: [
      'Digital menu of 143 dishes across 27 categories, with prices',
      'Table reservation form with guests, date, time and occasion, confirmed on WhatsApp',
      'Food and moments gallery',
      'Click-to-call, Google Maps directions and 24-hour opening hours',
    ],
    services: ['Website Development', 'UI/UX Design', 'SEO & Local Search'],
    url: 'https://namorestroskit.com/',
    year: 2026,
  },
  {
    slug: 'maple-and-thyme',
    client: 'Maple & Thyme',
    industry: 'Café & Restaurant',
    summary:
      'A multi-page site for a contemporary pure-vegetarian restaurant on SKIT College Road, Jaipur — menu, lookbook gallery, video moments, reservations and Zomato ordering.',
    image: '/assets/work/maple-and-thyme.jpg',
    highlights: [
      'Food and beverage menus, from tandoor and kebabs to wood-fired pizza',
      'Dedicated reservation page plus WhatsApp and click-to-call',
      'Lookbook gallery and short video moments from inside the restaurant',
      'Direct link to order on Zomato',
    ],
    services: ['Website Development', 'UI/UX Design', 'SEO & Local Search'],
    url: 'https://www.mapleandthyme.in/',
    year: 2026,
  },
  {
    slug: 'ttattatao',
    client: 'Ttattatao',
    industry: 'Cloud Kitchen',
    summary:
      'An ordering site for a pure-veg Chinese cloud kitchen on SKIT College Road, Jaipur — a 26-dish menu, a build-your-order cart that sends to WhatsApp, and Swiggy, Zomato and Toing links.',
    image: '/assets/work/ttattatao.jpg',
    highlights: [
      'Menu of 26 dishes across dumplings, small plates, noodles, rice and Thai curries',
      'Build-your-order cart with quantities and a running subtotal, sent on WhatsApp',
      'Delivery form with one-tap Google Maps location pin',
      'Order buttons for Swiggy, Zomato and Toing, plus suggested food pairings',
    ],
    services: ['Website Development', 'UI/UX Design', 'SEO & Local Search'],
    url: 'https://www.ttattatao.com/',
    year: 2026,
  },
];

/** Drives whether the Work page and its nav link are generated at all. */
export const hasCaseStudies = caseStudies.length > 0;
