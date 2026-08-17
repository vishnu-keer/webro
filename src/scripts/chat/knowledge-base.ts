import type { KnowledgeEntry } from '@/types';
import { site } from '@/data/site';

/**
 * Answers for the WEBRO AI assistant.
 *
 * Deliberately a curated knowledge base rather than a live LLM: an API key
 * cannot be shipped in a static site without exposing it publicly, and a
 * scripted assistant that is always right beats a clever one that invents
 * prices. To add a topic, append an entry — order is irrelevant.
 */
export const knowledgeBase: readonly KnowledgeEntry[] = [
  {
    id: 'greeting',
    keywords: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'namaste', 'hii', 'hiya'],
    answer:
      "Hello! 👋 I'm WEBRO AI. I can help with pricing, timelines, services or getting a quote.\n\nWhat are you looking to build?",
  },
  {
    id: 'pricing',
    keywords: ['price', 'pricing', 'cost', 'how much', 'charge', 'rate', 'budget', 'quote', 'fees'],
    answer:
      'Our pricing is fixed and agreed before we start — no hourly billing.\n\n• Starter — $299 (one-page site)\n• Business — $899 (full multi-page website)\n• Premium — from $1,999 (e-commerce, apps, custom platforms)\n\nMonthly: Instagram $199/mo, Menu QR $99 setup + $19/mo, Review QR $79.\n\nSee <a href="/pricing">full pricing</a>, or tell me your project and I will point you to the right tier.',
  },
  {
    id: 'budget',
    keywords: ['cheap', 'cheaper', 'discount', 'lower price', 'tight budget', 'afford', 'negotiate'],
    answer:
      'I understand budgets matter. The Starter package at $299 covers a professional one-page site — enough for most new businesses to start getting enquiries.\n\nWe also split larger projects into stages so you can spread the cost. Tell us your budget honestly on the <a href="/contact">contact page</a> and we will tell you what is realistic within it.',
  },
  {
    id: 'timeline',
    keywords: ['time', 'how long', 'timeline', 'deadline', 'fast', 'quick', 'days', 'weeks', 'delivery'],
    answer:
      'Typical timelines:\n\n• One-page site — 5 to 7 days\n• Full website — 2 to 3 weeks\n• E-commerce store — 3 to 4 weeks\n• Mobile app — 6 to 10 weeks\n\nWe give you a realistic date during scoping, not an optimistic one. Rush delivery is sometimes possible — just ask.',
  },
  {
    id: 'services',
    keywords: ['service', 'services', 'what do you do', 'offer', 'provide', 'help with'],
    answer:
      'We build:\n\n• Websites & landing pages\n• E-commerce stores\n• Mobile apps (iOS + Android)\n• Custom software & dashboards\n• AI automation & chatbots\n• Instagram management\n• Menu QR & Review QR\n• SEO & digital marketing\n\nFull detail on the <a href="/services">services page</a>. Which one interests you?',
  },
  {
    id: 'website',
    keywords: ['website', 'web design', 'web development', 'landing page', 'business website'],
    answer:
      'Websites are our core work. You get a custom design (never a template), mobile-first build, fast load times, SEO setup, contact form and WhatsApp integration.\n\nOne-page from $299, full multi-page from $899, delivered in 5 days to 3 weeks depending on size.',
  },
  {
    id: 'apps',
    keywords: ['app', 'mobile app', 'android', 'ios', 'iphone', 'play store', 'app store'],
    answer:
      'We build iOS and Android apps from a single codebase, so you are not paying twice.\n\nThat covers UI/UX design, the app itself, backend and API, plus store submission for both Apple and Google. Typically 6–10 weeks, starting around $1,999 depending on features.',
  },
  {
    id: 'ecommerce',
    keywords: ['ecommerce', 'e-commerce', 'online store', 'shop', 'shopify', 'sell online', 'cart'],
    answer:
      'Online stores with secure checkout, payment gateways, inventory management and order tracking — built on Shopify or fully custom.\n\nUsually 3–4 weeks, from $1,999. We also handle product photography guidance and launch setup.',
  },
  {
    id: 'ai',
    keywords: ['ai', 'chatbot', 'automation', 'bot', 'artificial intelligence', 'automate', 'agent'],
    answer:
      'We build AI that does actual work: chatbots that answer customers day and night, lead qualification that sorts serious enquiries from browsers, and automations that move data between your tools so nobody retypes anything.\n\nMost clients save 10–30 hours a month. Want to tell me what is eating your time?',
  },
  {
    id: 'menu-qr',
    keywords: ['menu qr', 'digital menu', 'restaurant menu', 'qr menu', 'cafe menu'],
    answer:
      'Menu QR is built for restaurants and cafés. Customers scan a code at the table and see your live menu on their phone.\n\nChange a price or mark something sold out and it updates instantly — no reprinting. $99 setup plus $19/month, live within 3 days.',
  },
  {
    id: 'review-qr',
    keywords: ['review qr', 'google review', 'reviews', 'rating', 'review stand', 'more reviews'],
    answer:
      'Review QR is a branded stand for your counter or table. Customers scan it and land straight on your Google review page — no searching.\n\nMore reviews lift your local ranking, which is what decides whether you show up in "near me" searches. $79 one-time, includes print-ready design files.',
  },
  {
    id: 'instagram',
    keywords: ['instagram', 'social media', 'insta', 'reels', 'posts', 'content', 'smm'],
    answer: `Our Instagram plan is full management at $199/month:\n\n• 12–16 posts\n• Reels and story design\n• Captions and hashtag research\n• Posting schedule\n• Monthly performance report\n\nYou approve the monthly plan; we handle everything else. Our own account is <a href="${site.instagram}" target="_blank" rel="noopener">@webro.studio</a>.`,
  },
  {
    id: 'seo',
    keywords: ['seo', 'ranking', 'google ranking', 'search engine', 'rank', 'traffic', 'first page'],
    answer:
      'We handle technical SEO, on-page optimisation, local search setup and content strategy.\n\nHonest expectation: SEO takes 3–6 months to show real movement. Anyone promising page one in 30 days is selling you something. What we guarantee is a technically correct foundation and a clear plan.',
  },
  {
    id: 'software',
    keywords: ['software', 'custom software', 'crm', 'dashboard', 'erp', 'booking system'],
    answer:
      'Custom software built around how your business actually runs — booking systems, CRMs, admin dashboards, inventory tools, reporting.\n\nWe start with a short discovery to map your workflow, then build only what earns its place. Quoted after scoping.',
  },
  {
    id: 'design',
    keywords: ['logo', 'branding', 'brand', 'identity', 'design', 'ui', 'ux'],
    answer:
      'Brand identity covers logo design, colour system, typography and usage guidelines — plus UI/UX design for your product or site.\n\nUsually delivered as a brand kit with all source files. Included in Premium, or available standalone.',
  },
  {
    id: 'support',
    keywords: ['maintenance', 'support', 'after launch', 'updates', 'hosting', 'backup', 'warranty'],
    answer:
      'Every website includes 30 days of free support after launch for fixes and small changes.\n\nAfter that you can take a maintenance plan covering hosting, updates, backups, security and speed monitoring — or just pay for changes as you need them. No lock-in either way.',
  },
  {
    id: 'contact',
    keywords: ['contact', 'talk', 'call', 'phone', 'number', 'reach', 'get in touch', 'whatsapp'],
    answer: `Easiest ways to reach us:\n\n📞 <a href="tel:${site.phone}">${site.phoneDisplay}</a>\n💬 <a href="${site.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>\n✉️ <a href="mailto:${site.email}">${site.email}</a>\n\nOr send the <a href="/contact">contact form</a> — we reply within one business day.`,
  },
  {
    id: 'location',
    keywords: ['location', 'where', 'address', 'based', 'office', 'jaipur', 'india', 'visit'],
    answer:
      'We are based in Jaipur, Rajasthan, India — and we work with clients worldwide.\n\nMost projects run entirely over email, WhatsApp and video calls, so your location is not a problem. You can find us on <a href="/contact">Google Maps here</a>.',
  },
  {
    id: 'international',
    keywords: [
      'international', 'abroad', 'usa', 'us', 'uk', 'dubai', 'uae', 'canada', 'australia',
      'overseas', 'worldwide', 'global', 'work with us', 'us clients', 'outside india',
    ],
    answer:
      'Yes — we work with clients in the US, UK, UAE, Canada, Australia and across Europe.\n\nWe bill in USD, take international payments, and schedule calls in your timezone. Roughly half our work is for clients outside India.',
  },
  {
    id: 'payment',
    keywords: ['payment', 'pay', 'installment', 'advance', 'deposit', 'upi', 'paypal', 'how to pay'],
    answer:
      'We usually work on 50% to start and 50% at delivery. Larger projects are split into milestones.\n\nWe accept bank transfer, UPI, PayPal and international cards. You get a proper invoice for every payment.',
  },
  {
    id: 'refund',
    keywords: ['refund', 'cancel', 'money back', 'not happy', 'guarantee', 'risk'],
    answer:
      'If we have not started and you change your mind, your deposit is returned in full.\n\nOnce design work begins, completed stages are billable — and we make that clear in writing before starting, so there are no surprises.',
  },
  {
    id: 'ownership',
    keywords: ['own', 'ownership', 'code', 'source code', 'rights', 'transfer', 'belongs'],
    answer:
      'You own everything, completely.\n\nCode, domain, hosting accounts and all design assets are registered in your name and handed over at launch. We never hold anything hostage — if you leave, it all comes with you.',
  },
  {
    id: 'revisions',
    keywords: ['revision', 'changes', 'edit', 'modify', 'feedback', 'redo'],
    answer:
      'Revisions are built into the process. You review at design stage and again before launch, and we adjust at each point.\n\nWe would rather change it during the build than have you live with something you do not like.',
  },
  {
    id: 'portfolio',
    keywords: ['portfolio', 'work', 'examples', 'previous', 'case study', 'clients', 'samples', 'projects'],
    answer: `We are rebuilding our portfolio section with proper case studies rather than placeholder projects.\n\nIn the meantime, message us on <a href="${site.whatsapp}" target="_blank" rel="noopener">WhatsApp</a> and we will send relevant examples for your industry directly.`,
  },
  {
    id: 'about',
    keywords: ['who are you', 'about', 'company', 'team', 'founder', 'experience', 'trust'],
    answer:
      'WEBRO is a digital studio based in Jaipur, building websites, apps and automation for businesses worldwide.\n\nWe are deliberately small — the people you talk to are the people who build your project. No junior handover after you sign. More on the <a href="/about">about page</a>.',
  },
  {
    id: 'process',
    keywords: ['start', 'begin', 'get started', 'how does it work', 'process', 'next step', 'ready'],
    answer:
      'Simple:\n\n1. You tell us your goal (not a spec — just what you want to achieve)\n2. We send a fixed quote and timeline within one business day\n3. You approve and pay 50% to start\n4. We design, you review, we build\n5. Launch, handover, and 30 days of support\n\nReady? <a href="/contact">Send us your project</a>.',
  },
  {
    id: 'hosting',
    keywords: ['domain', 'hosting', 'server', 'ssl', 'buy domain', 'where hosted'],
    answer:
      'We can register your domain and set up hosting, or work with what you already have.\n\nEverything is registered in your name. Hosting typically runs $5–20/month depending on the site, and SSL is always included.',
  },
  {
    id: 'mobile',
    keywords: ['mobile friendly', 'responsive', 'phone', 'tablet', 'device'],
    answer:
      'Every site we build is mobile-first — designed for the phone before the desktop, because that is where most of your visitors are.\n\nWe test on real devices before launch, not just a browser resize.',
  },
  {
    id: 'speed',
    keywords: ['speed', 'fast', 'slow', 'performance', 'loading', 'load time'],
    answer:
      'Speed is treated as part of the design, not an afterthought. We optimise images, fonts and scripts, and target a load under 2 seconds.\n\nA slow site loses customers before they see anything — so this is not optional for us.',
  },
  {
    id: 'thanks',
    keywords: ['thank', 'thanks', 'thankyou', 'great', 'awesome', 'nice', 'perfect', 'cool'],
    answer: `Happy to help! 🙌\n\nIf you would like a quote, the <a href="/contact">contact form</a> takes about a minute — or message us on <a href="${site.whatsapp}" target="_blank" rel="noopener">WhatsApp</a> for a faster reply.`,
  },
  {
    id: 'human',
    keywords: ['human', 'real person', 'agent', 'someone', 'talk to person', 'manager'],
    answer: `Of course — I am an assistant, not a person.\n\nFor a real reply: <a href="${site.whatsapp}" target="_blank" rel="noopener">WhatsApp us</a> or call <a href="tel:${site.phone}">${site.phoneDisplay}</a>. Someone answers within one business day, usually much sooner.`,
  },
];

/** Shown when nothing matches — hands off rather than guessing. */
export const fallbackAnswer =
  `I am not sure I understood that one — I would rather send you to a human than guess.\n\n` +
  `💬 <a href="${site.whatsapp}" target="_blank" rel="noopener">WhatsApp us</a>\n` +
  `📞 <a href="tel:${site.phone}">${site.phoneDisplay}</a>\n\n` +
  `Or try asking about pricing, timelines, services, Menu QR, Review QR or Instagram.`;
