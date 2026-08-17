/**
 * Shared domain types.
 *
 * Content lives in `src/data` as typed modules rather than being embedded in
 * markup, so copy changes never require touching a component.
 */

export type IconName =
  | 'web'
  | 'design'
  | 'cart'
  | 'app'
  | 'code'
  | 'seo'
  | 'ai'
  | 'instagram'
  | 'qr'
  | 'star'
  | 'bolt'
  | 'shield';

export interface NavLink {
  readonly href: string;
  readonly label: string;
}

export interface Service {
  readonly slug: string;
  readonly icon: IconName;
  readonly title: string;
  readonly summary: string;
  /** Optional badge, e.g. "Most requested". */
  readonly tag?: string;
}

export interface TrustSignal {
  readonly icon: IconName;
  readonly title: string;
  readonly detail: string;
}

export interface ProcessStep {
  readonly step: `0${number}`;
  readonly title: string;
  readonly detail: string;
}

export interface Plan {
  readonly name: string;
  readonly price: string;
  /** Billing qualifier shown beside the price, e.g. "one-time". */
  readonly cadence: string;
  readonly summary: string;
  readonly features: readonly string[];
  readonly featured?: boolean;
}

export interface Value {
  readonly title: string;
  readonly detail: string;
}

export interface Faq {
  readonly question: string;
  readonly answer: string;
}

/** Scene identifiers for the WebGL page backgrounds. */
export type BackgroundScene = 'orbital' | 'network' | 'columns' | 'helix' | 'globe';

export interface SeoProps {
  readonly title: string;
  readonly description: string;
  readonly keywords?: string;
  /** Set false for legal and error pages. */
  readonly indexable?: boolean;
  readonly background?: BackgroundScene;
}

/** One topic the chat assistant can answer. */
export interface KnowledgeEntry {
  readonly id: string;
  readonly keywords: readonly string[];
  readonly answer: string;
}
