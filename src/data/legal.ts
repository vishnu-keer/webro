import { site } from './site';

export interface LegalSection {
  readonly heading: string;
  readonly paragraphs: readonly string[];
}

export const lastUpdated = 'August 2026';

export const privacySections: readonly LegalSection[] = [
  {
    heading: 'Who we are',
    paragraphs: [
      `${site.name} ("WEBRO", "we", "us") is a digital agency based in Jaipur, Rajasthan, India. You can reach us at ${site.email} or ${site.phoneDisplay}.`,
    ],
  },
  {
    heading: 'What we collect',
    paragraphs: [
      'When you submit our contact form we collect your name, email address, phone number, selected service and your message. We collect nothing else from that form.',
      'If analytics is enabled we also collect anonymous usage data such as pages viewed, approximate region, device type and referring site. This data does not identify you personally.',
    ],
  },
  {
    heading: 'Why we collect it',
    paragraphs: [
      'To reply to your enquiry, prepare a quote and deliver work you have engaged us for. We also use aggregate analytics to understand which pages are useful and improve the site.',
      'We do not sell, rent or trade your personal information to anyone, ever.',
    ],
  },
  {
    heading: 'Third parties',
    paragraphs: [
      'Form submissions are delivered through Web3Forms, which passes the message to our email inbox. Analytics, when enabled, is provided by Google Analytics. Fonts are served by Google Fonts and some icons by jsDelivr. Each of these providers has its own privacy policy.',
      'Our contact page embeds a Google Maps frame, which may set cookies from Google when loaded.',
    ],
  },
  {
    heading: 'How long we keep it',
    paragraphs: [
      'Enquiry emails are retained while there is an active or prospective business relationship, and for a reasonable period afterwards for our records. You may ask us to delete your data at any time.',
    ],
  },
  {
    heading: 'Your rights',
    paragraphs: [
      `You can ask us what data we hold about you, request a correction, or request deletion. Email ${site.email} and we will respond within 30 days.`,
      'If you are in the EU or UK, you also have the right to lodge a complaint with your local data protection authority.',
    ],
  },
  {
    heading: 'Cookies',
    paragraphs: [
      'This site sets no cookies of its own. Third-party services listed above may set their own cookies. You can block cookies in your browser settings without losing access to the site.',
    ],
  },
];

export const termsSections: readonly LegalSection[] = [
  {
    heading: 'Agreement',
    paragraphs: [
      `These terms apply to services provided by ${site.name}. By engaging us, paying a deposit, or approving a quote, you accept them. Any project-specific proposal we send takes precedence where the two differ.`,
    ],
  },
  {
    heading: 'Quotes and scope',
    paragraphs: [
      'Quotes are fixed and valid for 30 days. The quote states what is included. Work outside that scope is quoted separately before it begins — we do not add charges without telling you first.',
    ],
  },
  {
    heading: 'Payment',
    paragraphs: [
      'Standard terms are 50% to begin and 50% on completion, before final handover. Larger projects may be split into milestones. We accept bank transfer, UPI, PayPal and international cards. Prices are quoted in USD unless agreed otherwise, and do not include third-party costs such as domains, hosting, paid plugins or stock assets.',
    ],
  },
  {
    heading: 'Your responsibilities',
    paragraphs: [
      'You agree to supply content, images, brand assets, access credentials and feedback within a reasonable time. Projects delayed more than 30 days awaiting client materials may be paused and rescheduled.',
      "You confirm that any content you supply is yours to use, and does not infringe anyone else's rights.",
    ],
  },
  {
    heading: 'Revisions',
    paragraphs: [
      'Revisions are included at the design stage and again before launch, as described in your quote. Substantial changes of direction after approval are treated as new scope and quoted separately.',
    ],
  },
  {
    heading: 'Ownership',
    paragraphs: [
      'On receipt of final payment, all rights in the delivered work transfer to you, including source code, design files and assets we created. Domains and hosting accounts are registered in your name. Third-party components remain under their own licences.',
      'We reserve the right to display the finished work in our portfolio unless you ask us in writing not to.',
    ],
  },
  {
    heading: 'Cancellation and refunds',
    paragraphs: [
      'If you cancel before work begins, your deposit is refunded in full. Once work has started, completed stages are billable and the deposit is non-refundable to the extent of work performed. We will always show you what has been done.',
    ],
  },
  {
    heading: 'Support and warranty',
    paragraphs: [
      'Websites include 30 days of support after launch covering defects and minor changes. This does not cover new features, third-party breakages, or changes made by others. Ongoing maintenance is available separately.',
    ],
  },
  {
    heading: 'Liability',
    paragraphs: [
      'We deliver work with reasonable skill and care, but we do not warrant uninterrupted or error-free operation. Our total liability is limited to the fees paid for the work concerned. We are not liable for indirect or consequential loss, including lost profits or data.',
      'We make no guarantee of specific search rankings, traffic volumes or revenue. Search engines and social platforms are outside our control.',
    ],
  },
  {
    heading: 'Governing law',
    paragraphs: [
      'These terms are governed by the laws of India, with jurisdiction in Jaipur, Rajasthan. For international clients we will attempt good-faith resolution before any formal proceedings.',
    ],
  },
  {
    heading: 'Contact',
    paragraphs: [`Questions about these terms: ${site.email} or ${site.phoneDisplay}.`],
  },
];
