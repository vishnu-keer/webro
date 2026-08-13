import type { LucideIcon } from 'lucide-react';
import {
  Boxes,
  Bot,
  Braces,
  Gauge,
  Layers,
  LineChart,
  Palette,
  Search,
  Sparkles,
  Workflow,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Site meta                                                           */
/* ------------------------------------------------------------------ */

export const SITE = {
  name: 'Webro Studio',
  short: 'WEBRO',
  tagline: 'Digital craft for brands that refuse to blend in.',
  description:
    'Webro Studio is an AI-first digital agency engineering premium websites, custom software and intelligent automation for brands that demand more than a template.',
  url: 'https://webro.studio',
  email: 'hello@webro.studio',
  phone: '+91 00000 00000',
  location: 'Bengaluru, India — working worldwide',
  socials: [
    { label: 'X', href: 'https://x.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'Dribbble', href: 'https://dribbble.com' },
    { label: 'GitHub', href: 'https://github.com/vishnu-keer' },
  ],
} as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

/* ------------------------------------------------------------------ */
/* Metrics                                                             */
/* ------------------------------------------------------------------ */

export type Metric = {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
};

export const METRICS: Metric[] = [
  { value: 120, suffix: '+', label: 'Projects shipped' },
  { value: 98, suffix: '', label: 'Avg. Lighthouse score' },
  { value: 3.4, suffix: 'x', label: 'Median conversion lift', decimals: 1 },
  { value: 14, suffix: '', label: 'Countries served' },
];

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export type Service = {
  slug: string;
  title: string;
  summary: string;
  icon: LucideIcon;
  capabilities: string[];
  deliverables: string[];
  accent: string; // tailwind gradient stops
};

export const SERVICES: Service[] = [
  {
    slug: 'web-architecture',
    title: 'Web Architecture',
    summary:
      'Marketing sites and product surfaces engineered on Next.js — fast, indexable and built to scale past launch day.',
    icon: Layers,
    capabilities: [
      'Next.js App Router builds',
      'Headless CMS integration',
      'Design systems & component libraries',
      'Edge rendering & ISR strategy',
    ],
    deliverables: ['Technical blueprint', 'Component library', 'CMS handover', 'Deploy pipeline'],
    accent: 'from-violet-500/20 to-transparent',
  },
  {
    slug: 'ai-agents',
    title: 'AI Agents & Automation',
    summary:
      'Modular agents that answer, qualify and route — wired into the tools your team already lives in.',
    icon: Bot,
    capabilities: [
      'Retrieval-augmented chat agents',
      'Lead qualification workflows',
      'Ops automation & internal copilots',
      'Evaluation, logging & guardrails',
    ],
    deliverables: ['Agent architecture', 'Prompt & tool library', 'Observability dashboard', 'Runbook'],
    accent: 'from-emerald-500/20 to-transparent',
  },
  {
    slug: 'brand-identity',
    title: 'Brand Identity',
    summary:
      'Positioning, visual language and messaging that make a premium price feel obvious rather than argued.',
    icon: Palette,
    capabilities: [
      'Positioning & narrative',
      'Logo systems & typography',
      'Art direction & photography',
      'Brand guideline systems',
    ],
    deliverables: ['Brand book', 'Logo suite', 'Type & colour system', 'Asset library'],
    accent: 'from-gold/20 to-transparent',
  },
  {
    slug: 'performance-engineering',
    title: 'Performance Engineering',
    summary:
      'Core Web Vitals treated as a revenue metric. We profile, cut and re-architect until the numbers move.',
    icon: Gauge,
    capabilities: [
      'Core Web Vitals remediation',
      'Bundle & image optimisation',
      'Caching & edge strategy',
      'Real-user monitoring',
    ],
    deliverables: ['Performance audit', 'Optimisation sprint', 'RUM dashboard', 'Budget guardrails'],
    accent: 'from-sky-500/20 to-transparent',
  },
  {
    slug: 'interactive-3d',
    title: 'Interactive & 3D',
    summary:
      'WebGL scenes, scroll choreography and motion detail that turn a page visit into something people remember.',
    icon: Boxes,
    capabilities: [
      'Three.js / R3F scenes',
      'Scroll-driven storytelling',
      'Custom GLSL shaders',
      'Motion systems',
    ],
    deliverables: ['Motion spec', '3D asset pipeline', 'Interactive build', 'Perf budget'],
    accent: 'from-fuchsia-500/20 to-transparent',
  },
  {
    slug: 'growth-seo',
    title: 'Growth & SEO',
    summary:
      'Technical SEO, structured data and conversion work — so the traffic arrives and then actually converts.',
    icon: LineChart,
    capabilities: [
      'Technical SEO & schema',
      'Programmatic landing pages',
      'CRO & experimentation',
      'Analytics & attribution',
    ],
    deliverables: ['SEO audit', 'Schema layer', 'Experiment backlog', 'Reporting suite'],
    accent: 'from-amber-500/20 to-transparent',
  },
];

/* ------------------------------------------------------------------ */
/* Process                                                             */
/* ------------------------------------------------------------------ */

export type ProcessStep = {
  id: string;
  phase: string;
  title: string;
  duration: string;
  description: string;
  points: string[];
  icon: LucideIcon;
};

export const PROCESS: ProcessStep[] = [
  {
    id: '01',
    phase: 'Phase 01',
    title: 'Discover',
    duration: 'Week 1',
    description:
      'We map the commercial goal before we open a design file. Audience, offer, competitive gap, and the one metric that defines success.',
    points: ['Stakeholder workshop', 'Competitive teardown', 'Analytics & funnel review', 'Success metric lock'],
    icon: Search,
  },
  {
    id: '02',
    phase: 'Phase 02',
    title: 'Design',
    duration: 'Weeks 2–3',
    description:
      'Art direction and interface design in parallel. You see real layouts with real copy, not lorem ipsum on a moodboard.',
    points: ['Art direction', 'Wireframes → hi-fi UI', 'Motion & interaction spec', 'Design system tokens'],
    icon: Sparkles,
  },
  {
    id: '03',
    phase: 'Phase 03',
    title: 'Engineer',
    duration: 'Weeks 4–6',
    description:
      'Typed, tested, component-driven Next.js. Preview deploys from day one so feedback lands on the real thing.',
    points: ['Component build', 'CMS & integrations', 'Accessibility pass', 'Preview deploys per PR'],
    icon: Braces,
  },
  {
    id: '04',
    phase: 'Phase 04',
    title: 'Automate',
    duration: 'Week 7',
    description:
      'Agents and workflows connected to your stack — capture, qualify, route, report. The site stops being a brochure.',
    points: ['Agent integration', 'CRM & email wiring', 'Analytics events', 'Internal copilots'],
    icon: Workflow,
  },
  {
    id: '05',
    phase: 'Phase 05',
    title: 'Scale',
    duration: 'Ongoing',
    description:
      'Launch is the midpoint. We monitor, experiment and iterate against the metric we locked in week one.',
    points: ['Performance monitoring', 'CRO experiments', 'Content velocity', 'Quarterly roadmap'],
    icon: LineChart,
  },
];

/* ------------------------------------------------------------------ */
/* Work / portfolio                                                    */
/* ------------------------------------------------------------------ */

export const WORK_CATEGORIES = [
  'All',
  'Web App',
  'AI Solutions',
  'Luxury Branding',
] as const;

export type WorkCategory = (typeof WORK_CATEGORIES)[number];

export type Project = {
  slug: string;
  client: string;
  title: string;
  category: Exclude<WorkCategory, 'All'>;
  year: string;
  summary: string;
  result: string;
  tags: string[];
  href: string;
  gradient: string;
  featured?: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: 'aurum-hospitality',
    client: 'Aurum Collection',
    title: 'A booking experience worth the room rate',
    category: 'Luxury Branding',
    year: '2025',
    summary:
      'Full identity and direct-booking platform for a nine-property boutique hotel group, built to pull guests off the OTAs.',
    result: '+62% direct bookings',
    tags: ['Next.js', 'Sanity', 'Motion', 'Brand'],
    href: '/work',
    gradient: 'from-amber-500/25 via-yellow-200/10 to-transparent',
    featured: true,
  },
  {
    slug: 'northwind-ai',
    client: 'Northwind',
    title: 'An AI concierge that closes, not chats',
    category: 'AI Solutions',
    year: '2025',
    summary:
      'A retrieval-grounded sales agent that qualifies inbound leads, books calls and writes its own CRM notes.',
    result: '71% of inbound auto-qualified',
    tags: ['Claude', 'RAG', 'Supabase', 'Vercel AI'],
    href: '/work',
    gradient: 'from-emerald-500/25 via-teal-300/10 to-transparent',
    featured: true,
  },
  {
    slug: 'meridian-saas',
    client: 'Meridian',
    title: 'A dashboard that survives 40k rows',
    category: 'Web App',
    year: '2024',
    summary:
      'Analytics workspace rebuilt on the App Router with streaming server components and a virtualised data grid.',
    result: 'TTI cut from 4.1s to 0.9s',
    tags: ['Next.js', 'TypeScript', 'Postgres', 'Prisma'],
    href: '/work',
  gradient: 'from-sky-500/25 via-indigo-300/10 to-transparent',
    featured: true,
  },
  {
    slug: 'saffron-house',
    client: 'Saffron House',
    title: 'Fine dining, finally online',
    category: 'Luxury Branding',
    year: '2024',
    summary:
      'Menu-led storytelling site with reservation flow, multilingual support and a kitchen-side ops dashboard.',
    result: '2.9x reservation conversion',
    tags: ['Next.js', 'Tailwind', 'i18n', 'Brand'],
    href: '/work',
    gradient: 'from-rose-500/25 via-orange-300/10 to-transparent',
  },
  {
    slug: 'vector-ops',
    client: 'Vector Ops',
    title: 'The ops copilot that replaced a spreadsheet',
    category: 'AI Solutions',
    year: '2025',
    summary:
      'Internal agent suite handling document intake, classification and exception routing across four teams.',
    result: '~30 hrs/week returned',
    tags: ['Agents', 'OpenAI', 'Supabase', 'Automation'],
    href: '/work',
    gradient: 'from-violet-500/25 via-fuchsia-300/10 to-transparent',
  },
  {
    slug: 'atlas-commerce',
    client: 'Atlas',
    title: 'Headless commerce at 98 Lighthouse',
    category: 'Web App',
    year: '2024',
    summary:
      'Storefront replatform with edge-cached PDPs, instant search and a checkout that stopped leaking revenue.',
    result: '+41% mobile revenue',
    tags: ['Next.js', 'Edge', 'Commerce', 'CRO'],
    href: '/work',
    gradient: 'from-cyan-500/25 via-blue-300/10 to-transparent',
  },
  {
    slug: 'lumen-studio',
    client: 'Lumen',
    title: 'A 3D portfolio you scroll through',
    category: 'Luxury Branding',
    year: '2025',
    summary:
      'WebGL-driven studio site where the camera walks the visitor through each project as they scroll.',
    result: '4m 12s avg. session',
    tags: ['Three.js', 'R3F', 'GLSL', 'Motion'],
    href: '/work',
    gradient: 'from-purple-500/25 via-pink-300/10 to-transparent',
  },
  {
    slug: 'harbor-fintech',
    client: 'Harbor',
    title: 'Compliance-grade onboarding, in 4 minutes',
    category: 'Web App',
    year: '2025',
    summary:
      'KYC onboarding flow with resumable state, document capture and an audit trail regulators actually accept.',
    result: '−48% drop-off',
    tags: ['Next.js', 'Prisma', 'Security', 'A11y'],
    href: '/work',
    gradient: 'from-slate-400/25 via-zinc-300/10 to-transparent',
  },
];

/* ------------------------------------------------------------------ */
/* Clients ticker                                                      */
/* ------------------------------------------------------------------ */

export const CLIENTS = [
  'AURUM',
  'NORTHWIND',
  'MERIDIAN',
  'SAFFRON HOUSE',
  'VECTOR OPS',
  'ATLAS',
  'LUMEN',
  'HARBOR',
  'KESTREL',
  'OBELISK',
];

/* ------------------------------------------------------------------ */
/* Tech stack matrix                                                   */
/* ------------------------------------------------------------------ */

export type TechGroup = {
  category: string;
  note: string;
  items: string[];
};

export const TECH_STACK: TechGroup[] = [
  {
    category: 'Frontend',
    note: 'What the visitor actually touches',
    items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Three.js'],
  },
  {
    category: 'Backend & Data',
    note: 'State, auth and everything persistent',
    items: ['Node.js', 'PostgreSQL', 'Prisma', 'Supabase', 'Redis', 'tRPC'],
  },
  {
    category: 'AI Layer',
    note: 'Reasoning, retrieval and orchestration',
    items: ['Claude', 'OpenAI', 'Vercel AI SDK', 'pgvector', 'Firecrawl', 'LangGraph'],
  },
  {
    category: 'Infrastructure',
    note: 'Ship, observe, roll back',
    items: ['Vercel', 'Cloudflare', 'GitHub Actions', 'Sentry', 'Playwright', 'Docker'],
  },
];

/* ------------------------------------------------------------------ */
/* About — values                                                      */
/* ------------------------------------------------------------------ */

export type Value = {
  title: string;
  body: string;
};

export const VALUES: Value[] = [
  {
    title: 'Taste is a discipline',
    body:
      'Restraint takes longer than decoration. We cut until only the things that earn their place are left — then we obsess over those.',
  },
  {
    title: 'Performance is design',
    body:
      'A beautiful page that takes four seconds to appear is a broken page. Speed budgets are set in week one and defended to launch.',
  },
  {
    title: 'Own the outcome',
    body:
      'We are not order-takers. If a requested feature will hurt the number you care about, we will say so before we build it.',
  },
  {
    title: 'Automate the boring',
    body:
      'Every engagement asks the same question: which part of this should a machine be doing? Usually the answer is more than you expect.',
  },
  {
    title: 'Build to be inherited',
    body:
      'Typed, documented, conventionally structured. The next engineer to open the repo should not need a séance.',
  },
  {
    title: 'Accessible by default',
    body:
      'Keyboard paths, contrast ratios and semantics are part of the definition of done, not a remediation ticket after launch.',
  },
];

export const STANDARDS = [
  { label: 'Lighthouse performance', value: '≥ 95' },
  { label: 'WCAG conformance', value: '2.2 AA' },
  { label: 'Type coverage', value: '100% TS' },
  { label: 'LCP budget', value: '< 1.8s' },
  { label: 'Preview deploy', value: 'Every PR' },
  { label: 'Handover', value: 'Docs + Loom' },
];

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export const BUDGET_RANGES = [
  '$5k – $15k',
  '$15k – $40k',
  '$40k – $100k',
  '$100k+',
  'Not sure yet',
];

export const TIMELINES = ['ASAP', '1–2 months', '3–6 months', 'Just exploring'];

export const PROJECT_TYPES = [
  'Website / Marketing site',
  'Web app or product',
  'AI agent or automation',
  'Brand identity',
  'Performance rescue',
  'Something else',
];
