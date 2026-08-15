#!/usr/bin/env python3
"""
WEBRO site builder
==================
Generates every .html page from one shared template so the header, footer
and chat widget only exist in ONE place.

Run after any change:      python3 build.py

Edit content below:
  PAGES   -> per-page SEO (title, description, keywords) and body HTML
  SERVICES / PLANS / FAQS -> the data that fills the pages
"""

import html
import json
from pathlib import Path

ROOT = Path(__file__).parent
SITE = "https://webro.studio"

BIZ = {
    "phone": "+916377093356",
    "phone_display": "+91 63770 93356",
    "email": "webro284@gmail.com",
    "wa": "https://wa.me/916377093356",
    "insta": "https://www.instagram.com/webro.studio/",
    "maps": "https://www.google.com/maps/place/WEBRO+Studio/@26.8176736,75.8591422,761m/data=!3m2!1e3!4b1!4m6!3m5!1s0x396dc96ac7f960d7:0x2caa4d48a42dc22c!8m2!3d26.8176736!4d75.8617171",
}

NAV = [
    ("index.html", "Home"),
    ("services.html", "Services"),
    ("pricing.html", "Pricing"),
    ("about.html", "About"),
    ("faq.html", "FAQ"),
    ("contact.html", "Contact"),
]

# ---------------------------------------------------------------- data

SERVICES = [
    ("web",    "Website Development",      "Fast, responsive business websites built to load quickly and turn visitors into enquiries.", "Most requested"),
    ("cart",   "E-commerce Stores",        "Online stores with secure checkout, payment gateways and inventory — Shopify or fully custom.", ""),
    ("app",    "Mobile App Development",   "iOS and Android apps from a single codebase, with clean UX and the backend to support it.", ""),
    ("code",   "Custom Software",          "Dashboards, booking systems, CRMs and internal tools built around how your business actually runs.", ""),
    ("ai",     "AI Automation & Chatbots", "AI agents that answer customers, qualify leads and handle repetitive work around the clock.", "High ROI"),
    ("design", "UI/UX & Logo Design",      "Brand identity, logo systems and interface design that make a premium price feel obvious.", ""),
    ("insta",  "Instagram Handling",       "Full account management — content planning, design, captions, hashtags, reels and scheduling.", "Monthly"),
    ("qr",     "Menu QR",                  "Digital menu with a scannable QR code for restaurants and cafés. Update prices instantly, no reprinting.", "For restaurants"),
    ("star",   "Review QR",                "A branded QR stand that sends customers straight to your Google review page — the fastest way to build local ranking.", "Local SEO"),
    ("seo",    "SEO & Digital Marketing",  "Technical SEO, local search, content and ads that bring qualified traffic instead of vanity numbers.", ""),
    ("bolt",   "Business Automation",      "Connect your tools so orders, leads, invoices and reports move themselves. Less admin, fewer mistakes.", ""),
    ("shield", "Maintenance & Support",    "Hosting, updates, backups, security and speed monitoring so your site never quietly breaks.", ""),
]

TRUST = [
    ("bolt",   "Fast delivery",      "Most websites live in 2–3 weeks, not months."),
    ("shield", "You own everything", "Code, domain, hosting and accounts — all yours."),
    ("star",   "Fixed pricing",      "Agreed before we start. No hourly surprises."),
    ("ai",     "1 business day",     "That is our reply time on every enquiry."),
]

PROCESS = [
    ("01", "Discover", "We learn your business, your customers and the one result that matters most."),
    ("02", "Design",   "You see real layouts with real content before a line of code is written."),
    ("03", "Build",    "Development with preview links, so you watch it come together and give feedback early."),
    ("04", "Launch",   "We deploy, test on real devices, hand over everything, and stay available after."),
]

PLANS = [
    ("Starter", "$299", "one-time", "A sharp one-page site for new businesses.",
     ["Up to 3 sections", "Mobile responsive", "Contact form + WhatsApp", "Basic SEO setup", "Delivered in 5–7 days"], False),
    ("Business", "$899", "one-time", "A complete multi-page website for growing companies.",
     ["Up to 8 pages", "Custom design", "SEO optimised", "Google Analytics", "Free 30-day support", "Delivered in 2–3 weeks"], True),
    ("Premium", "$1,999", "starting at", "E-commerce, apps and custom platforms.",
     ["Unlimited pages", "E-commerce or app build", "AI chatbot included", "Advanced SEO", "Priority support", "Ongoing improvements"], False),
]

MONTHLY = [
    ("Instagram Handling", "$199", "/month", "We run your account end to end.",
     ["12–16 posts per month", "Reels and story design", "Captions and hashtags", "Monthly performance report"], True),
    ("Menu QR", "$99", "setup + $19/mo", "Digital menu for restaurants and cafés.",
     ["Branded QR code", "Unlimited menu updates", "Photos and categories", "Works on any phone"], False),
    ("Review QR", "$79", "one-time", "Turn happy customers into Google reviews.",
     ["Branded QR stand design", "Direct link to your review page", "Print-ready files", "Setup guidance"], False),
]

VALUES = [
    ("We tell you the truth", "If a feature will not help your business, we say so before you pay for it."),
    ("Speed is a feature", "A slow website loses customers. We treat load time as part of the design."),
    ("No lock-in, ever", "You own your code, hosting and domain. Leave whenever you like."),
    ("Built to be handed over", "Clean, documented work any developer can pick up later."),
    ("Mobile decides", "Most of your visitors are on a phone. That is where we design first."),
    ("We answer", "Real replies from real people, within one business day."),
]

FAQS = [
    ("How much does a website cost?", "Our sites start at $299 for a one-page build and $899 for a full multi-page website. E-commerce, apps and custom platforms start at $1,999. You get a fixed quote before any work begins — no hourly billing."),
    ("How long does it take?", "A one-page site takes 5–7 days. A full website is usually 2–3 weeks. Apps and custom software depend on scope, and we give you a realistic timeline during scoping rather than an optimistic one."),
    ("Do you work with international clients?", "Yes. We work with businesses in the US, UK, UAE, Canada, Australia and across Europe. Everything runs over email, WhatsApp and video calls, and we bill in USD."),
    ("Do I own the website and the code?", "Completely. The code, domain, hosting accounts and all assets are registered in your name and handed over at launch. We never hold anything hostage."),
    ("What is a Menu QR and who is it for?", "It is a digital menu with a scannable QR code, made for restaurants and cafés. Customers scan and see your current menu on their phone. When prices change you update instantly — no reprinting."),
    ("What does a Review QR actually do?", "It is a branded QR stand for your counter or table. Customers scan it and land directly on your Google review page. More reviews lift your local ranking, which decides whether you appear in “near me” searches."),
    ("Can you handle our Instagram completely?", "Yes. Our monthly plan covers content planning, post and reel design, captions, hashtags and scheduling, plus a monthly report. You approve the plan; we handle the rest."),
    ("What happens after launch?", "Every website includes 30 days of free support for fixes and small changes. After that you can move to a maintenance plan, or simply pay for changes as you need them."),
    ("How do payments work?", "We usually work on 50% to start and 50% at delivery, with larger projects split into milestones. We accept bank transfer, UPI, PayPal and international cards."),
    ("Do you offer refunds?", "If we have not started and you change your mind, your deposit is returned in full. Once design work begins, completed stages are billable — which we make clear in writing before starting."),
]

ICONS = {
    "web": '<path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/><circle cx="12" cy="12" r="9"/>',
    "design": '<path d="m2 22 4-1 12-12a2.8 2.8 0 0 0-4-4L2 17z"/><path d="m14 5 4 4"/>',
    "cart": '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.5 12h11L21 7H6"/>',
    "app": '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
    "code": '<path d="m8 6-6 6 6 6M16 6l6 6-6 6"/>',
    "seo": '<circle cx="11" cy="11" r="7"/><path d="m20 20-4.3-4.3"/>',
    "ai": '<rect x="4" y="7" width="16" height="12" rx="3"/><path d="M12 7V3M8 13h.01M16 13h.01M9 17h6"/>',
    "insta": '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>',
    "qr": '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM19 19h2M19 14h2v2"/>',
    "star": '<path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.4l6.1-.8z"/>',
    "bolt": '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    "shield": '<path d="M12 2 4 6v6c0 5 3.4 9.2 8 10 4.6-.8 8-5 8-10V6z"/><path d="m9 12 2 2 4-4"/>',
}


def svg(key, size=22):
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
            f'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">{ICONS[key]}</svg>')


def service_cards(items):
    out = []
    for icon, title, desc, tag in items:
        tag_html = f'<span class="tagline">{tag}</span>' if tag else ""
        out.append(f'<article class="svc reveal"><div class="ico">{svg(icon)}</div>'
                   f'<h3>{title}</h3><p>{desc}</p>{tag_html}</article>')
    return "\n".join(out)


def plan_cards(items):
    tick = ('<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
            'stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 6"/></svg>')
    out = []
    ribbon = '<span class="ribbon">Most popular</span>'
    for name, price, sub, desc, feats, hot in items:
        lis = "".join(f"<li>{tick}{f}</li>" for f in feats)
        featured = "featured" if hot else ""
        badge = ribbon if hot else ""
        out.append(
            f'<article class="plan reveal {featured}">'
            f'{badge}'
            f'<h3 style="font-size:20px">{name}</h3>'
            f'<div class="price">{price} <small>{sub}</small></div>'
            f'<p style="color:var(--ink-soft);font-size:14.5px">{desc}</p>'
            f'<ul>{lis}</ul>'
            f'<a class="btn {"btn-primary" if hot else "btn-ghost"}" '
            f'href="contact.html">Get started</a></article>')
    return "\n".join(out)


def faq_items():
    chev = ('<svg class="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" '
            'stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>')
    return "\n".join(
        f'<div class="qa reveal"><button type="button" aria-expanded="false"><span>{q}</span>{chev}</button>'
        f'<div class="ans"><p>{a}</p></div></div>' for q, a in FAQS)


# ---------------------------------------------------------------- template

def schema_for(page):
    """Organisation schema on every page; FAQ schema only on the FAQ page."""
    org = {
        "@context": "https://schema.org", "@type": "ProfessionalService",
        "@id": f"{SITE}/#organization", "name": "WEBRO Studio", "alternateName": "WEBRO",
        "description": "Web design, mobile app, e-commerce, software and AI automation agency serving clients worldwide.",
        "url": f"{SITE}/", "logo": f"{SITE}/assets/logo.png", "image": f"{SITE}/assets/og-image.png",
        "telephone": BIZ["phone"], "email": BIZ["email"], "priceRange": "$$",
        "currenciesAccepted": "USD, INR",
        "address": {"@type": "PostalAddress", "addressLocality": "Jaipur",
                    "addressRegion": "Rajasthan", "addressCountry": "IN"},
        "geo": {"@type": "GeoCoordinates", "latitude": 26.8176736, "longitude": 75.8617171},
        "hasMap": BIZ["maps"],
        "areaServed": [{"@type": "Country", "name": c} for c in
                       ["India", "United States", "United Kingdom", "United Arab Emirates", "Canada", "Australia"]],
        "sameAs": [BIZ["insta"]],
        "hasOfferCatalog": {"@type": "OfferCatalog", "name": "Digital Services",
                            "itemListElement": [{"@type": "Offer", "itemOffered": {"@type": "Service", "name": s[1]}}
                                                for s in SERVICES]},
    }
    blocks = [f'<script type="application/ld+json">{json.dumps(org, ensure_ascii=False)}</script>']
    if page == "faq.html":
        faq = {"@context": "https://schema.org", "@type": "FAQPage",
               "mainEntity": [{"@type": "Question", "name": q,
                               "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQS]}
        blocks.append(f'<script type="application/ld+json">{json.dumps(faq, ensure_ascii=False)}</script>')
    return "\n".join(blocks)


# Which 3D background each page gets. See assets/bg3d.js for the scenes.
# Pages left out (FAQ, privacy, terms, 404) keep the lightweight CSS aurora.
BACKGROUNDS = {
    "index.html":    "h1",   # Orbital Network Sphere
    "services.html": "s3",   # Connected Node Web
    "pricing.html":  "p1",   # Ascending Columns
    "about.html":    "a2",   # Double Helix
    "contact.html":  "c1",   # Globe with Reach Arcs
}


def render(page, meta, body):
    active_attr = ' class="active"'
    nav_links = "".join(
        f'<a href="{href}"{active_attr if href == page else ""}>{label}</a>' for href, label in NAV)
    mob_links = "".join(f'<a href="{href}">{label}</a>' for href, label in NAV)
    canonical = f"{SITE}/" if page == "index.html" else f"{SITE}/{page}"
    bg = BACKGROUNDS.get(page)
    body_attr = f' data-bg="{bg}"' if bg else ""

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />

<title>{meta['title']}</title>
<meta name="description" content="{meta['desc']}" />
<meta name="keywords" content="{meta['kw']}" />
<link rel="canonical" href="{canonical}" />
<meta name="robots" content="{meta.get('robots', 'index, follow, max-image-preview:large')}" />
<meta name="theme-color" content="#F1EBDD" />

<!-- Same English content served to every region; India and international both -->
<link rel="alternate" hreflang="en" href="{canonical}" />
<link rel="alternate" hreflang="en-in" href="{canonical}" />
<link rel="alternate" hreflang="en-us" href="{canonical}" />
<link rel="alternate" hreflang="en-gb" href="{canonical}" />
<link rel="alternate" hreflang="en-ae" href="{canonical}" />
<link rel="alternate" hreflang="x-default" href="{canonical}" />

<meta property="og:type" content="website" />
<meta property="og:url" content="{canonical}" />
<meta property="og:site_name" content="WEBRO" />
<meta property="og:title" content="{meta['title']}" />
<meta property="og:description" content="{meta['desc']}" />
<meta property="og:image" content="{SITE}/assets/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{meta['title']}" />
<meta name="twitter:description" content="{meta['desc']}" />
<meta name="twitter:image" content="{SITE}/assets/og-image.png" />

<link rel="icon" href="assets/favicon-32.png" sizes="32x32" />
<link rel="apple-touch-icon" href="assets/apple-touch-icon.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="assets/styles.css" />

{schema_for(page)}

<!-- GOOGLE ANALYTICS 4
     Replace G-XXXXXXXXXX with your Measurement ID from analytics.google.com,
     then uncomment the two lines below. Conversion events are already wired
     in assets/app.js (form submit, WhatsApp click, call click). -->
<!--
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','G-XXXXXXXXXX');</script>
-->
</head>
<body{body_attr}>

<div id="loader"><div class="load-in">
  <img class="load-logo" src="assets/logo.png" alt="" width="72" height="72" />
  <div class="load-word">WEBRO</div>
  <div class="load-bar"><span></span></div>
</div></div>

<div class="bg-layer" aria-hidden="true">
  <div class="aurora a1"></div><div class="aurora a2"></div>
  <div class="aurora a3"></div><div class="aurora a4"></div>
</div>
<div class="grain" aria-hidden="true"></div>
<canvas id="bgfx" aria-hidden="true"></canvas>

<div class="topbar">Now booking projects worldwide — <a href="contact.html">get a free quote</a></div>

<header id="hdr">
  <div class="wrap">
    <nav class="nav" aria-label="Primary">
      <a class="brand" href="index.html" aria-label="WEBRO home">
        <img src="assets/logo.png" alt="WEBRO logo" width="38" height="38" /><span>WEB<i>RO</i></span>
      </a>
      <div class="menu">{nav_links}</div>
      <div class="hdr-cta">
        <a class="btn btn-primary" href="contact.html">Get a quote</a>
        <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu"><span></span></button>
      </div>
    </nav>
    <div class="mobile" id="mobileMenu">{mob_links}
      <a class="btn btn-primary" style="margin-top:12px" href="contact.html">Get a free quote</a>
    </div>
  </div>
</header>

<main>
{body}
</main>

<footer>
  <div class="wrap">
    <div class="fgrid">
      <div>
        <a class="brand" href="index.html" style="margin-bottom:14px">
          <img src="assets/logo.png" alt="" width="38" height="38" /><span>WEB<i>RO</i></span>
        </a>
        <p style="color:var(--ink-soft);font-size:14.5px;max-width:300px">Websites, apps, e-commerce and AI automation for businesses worldwide. Built in Jaipur, delivered globally.</p>
      </div>
      <div class="foot"><h5>Company</h5>
        <a href="index.html">Home</a><a href="services.html">Services</a>
        <a href="pricing.html">Pricing</a><a href="about.html">About</a></div>
      <div class="foot"><h5>Services</h5>
        <a href="services.html">Website Development</a><a href="services.html">Mobile Apps</a>
        <a href="services.html">AI Automation</a><a href="services.html">Menu &amp; Review QR</a></div>
      <div class="foot"><h5>Get in touch</h5>
        <a href="tel:{BIZ['phone']}">{BIZ['phone_display']}</a>
        <a href="mailto:{BIZ['email']}">{BIZ['email']}</a>
        <a href="{BIZ['insta']}" target="_blank" rel="noopener">Instagram</a>
        <a href="contact.html">Contact form</a></div>
    </div>
    <div class="fbot">
      <span>© <span data-year></span> WEBRO Studio. All rights reserved.</span>
      <span><a href="privacy.html">Privacy</a> · <a href="terms.html">Terms</a> · Jaipur, India — working worldwide</span>
    </div>
  </div>
</footer>

<div class="fabs">
  <a class="fab ig" href="{BIZ['insta']}" target="_blank" rel="noopener" aria-label="WEBRO on Instagram"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg></a>
  <a class="fab wa" href="{BIZ['wa']}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><svg width="23" height="23" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.7.2l-.9 1.1c-.2.2-.3.2-.6.1a8 8 0 0 1-4-3.5c-.2-.4 0-.5.2-.7l.5-.6c.1-.2.1-.4 0-.6l-.9-2.1c-.2-.5-.4-.5-.6-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.8s1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.8 5 .8.3 1.5.5 2 .7.8.2 1.6.2 2.2.1.7-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2z"/></svg></a>
  <a class="fab call" href="tel:{BIZ['phone']}" aria-label="Call WEBRO"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg></a>
</div>

<button class="chat-fab" id="chatFab" aria-expanded="false" aria-controls="chatPanel">
  <span class="dot"></span>
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M21 12a8 8 0 0 1-8 8H7l-4 3v-5a8 8 0 0 1 8-11h2a8 8 0 0 1 8 8z"/></svg>
  <span class="label">Ask WEBRO AI</span>
</button>

<div class="chat-panel" id="chatPanel" role="dialog" aria-label="WEBRO AI assistant">
  <div class="chat-head">
    <img src="assets/logo.png" alt="" width="36" height="36" />
    <div><b>WEBRO AI</b><span><i class="live"></i> Replies instantly</span></div>
    <button class="x" id="chatClose" aria-label="Close chat">&times;</button>
  </div>
  <div class="chat-body" id="chatBody"></div>
  <div class="chat-quick">
    <button data-q="pricing">💰 Pricing</button>
    <button data-q="how long does it take">⏱️ Timeline</button>
    <button data-q="services">🛠️ Services</button>
    <button data-q="menu qr">📱 Menu QR</button>
    <button data-q="contact">📞 Contact</button>
  </div>
  <div class="chat-input">
    <label class="sr-only" for="chatInput">Message WEBRO AI</label>
    <input id="chatInput" type="text" placeholder="Ask anything…" autocomplete="off" />
    <button id="chatSend" aria-label="Send message"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg></button>
  </div>
</div>

<script src="assets/app.js" defer></script>
<script src="assets/bg3d.js" defer></script>
</body>
</html>
"""


# ---------------------------------------------------------------- page bodies

def hero_home():
    return f"""<div class="wrap">
  <div class="hero">
    <span class="type-line" id="typeLine"><span class="cursor"></span></span>
    <h1>Websites, apps and <em>AI automation</em> that grow your business.</h1>
    <p class="lead">WEBRO builds fast, beautiful digital products for companies worldwide — from marketing sites and e-commerce stores to mobile apps, custom software and AI agents that handle the busywork.</p>
    <div class="hero-cta">
      <a class="btn btn-primary" href="contact.html">Start your project</a>
      <a class="btn btn-ghost" href="services.html">Explore services</a>
    </div>
    <div class="hero-strip">
      <span><b>Fixed</b> pricing</span><span><b>1 day</b> reply time</span>
      <span><b>100%</b> code ownership</span><span><b>Global</b> delivery</span>
    </div>
  </div>
</div>

<div class="block" style="padding-top:8px"><div class="wrap">
  <div class="marquee"><div class="track" id="techTrack"></div></div>
</div></div>

<div class="block"><div class="wrap">
  <div class="sec-head reveal"><span class="eyebrow">What we do</span>
    <h2>Everything your business needs online</h2>
    <p>One team for design, development, automation and growth — so nothing gets lost between vendors.</p></div>
  <div class="grid g3">{service_cards(SERVICES[:6])}</div>
  <div style="margin-top:26px" class="reveal"><a class="btn btn-ghost" href="services.html">See all services</a></div>
</div></div>

<div class="block"><div class="wrap">
  <div class="sec-head reveal"><span class="eyebrow">Why WEBRO</span>
    <h2>What you get, every time</h2>
    <p>No agency theatre. Clear scope, clear price, work you own outright.</p></div>
  <div class="trust reveal">{''.join(f'<div class="tsig"><div class="ic">{svg(i)}</div><b>{t}</b><span>{d}</span></div>' for i, t, d in TRUST)}</div>
</div></div>

<div class="block"><div class="wrap"><div class="glass reveal" style="padding:44px 34px;text-align:center">
  <h2 style="font-size:clamp(26px,4vw,36px);margin-bottom:12px">Ready to build something worth showing off?</h2>
  <p style="color:var(--ink-soft);max-width:540px;margin:0 auto 24px">Tell us what you need. We'll reply within one business day with honest scope and pricing.</p>
  <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
    <a class="btn btn-primary" href="contact.html">Get a free quote</a>
    <a class="btn btn-ghost" href="{BIZ['wa']}" target="_blank" rel="noopener">WhatsApp us</a>
  </div>
</div></div></div>"""


def body_services():
    return f"""<div class="wrap">
  <div class="page-head"><span class="eyebrow">Services</span>
    <h1>Built to make you money, not just look good</h1>
    <p>From a one-page site to a full software platform — plus the small, high-leverage tools local businesses actually need.</p></div>
  <div class="block" style="padding-top:34px"><div class="grid g3">{service_cards(SERVICES)}</div></div>
  <div class="block" style="padding-top:0">
    <div class="sec-head reveal"><span class="eyebrow">Process</span><h2>How a project runs</h2>
      <p>Four steps, no mystery. You always know what happens next.</p></div>
    <div class="grid g4">{''.join(f'<div class="svc reveal"><div class="ico" style="font-family:Space Grotesk;font-weight:700">{n}</div><h3>{t}</h3><p>{d}</p></div>' for n, t, d in PROCESS)}</div>
  </div>
  <div class="block" style="padding-top:0"><div class="glass reveal" style="padding:38px 30px;text-align:center">
    <h2 style="font-size:clamp(24px,3.6vw,32px);margin-bottom:12px">Not sure which service you need?</h2>
    <p style="color:var(--ink-soft);max-width:520px;margin:0 auto 22px">Send us your goal, not a spec. We'll tell you the shortest path to it — even if that means a smaller project.</p>
    <a class="btn btn-primary" href="contact.html">Ask us</a></div></div>
</div>"""


def body_pricing():
    return f"""<div class="wrap">
  <div class="page-head"><span class="eyebrow">Pricing</span>
    <h1>Transparent pricing in USD</h1>
    <p>Fixed quotes agreed before work starts. No hourly billing, no surprise invoices.</p></div>
  <div class="block" style="padding-top:34px">
    <div class="grid g3">{plan_cards(PLANS)}</div>
    <p style="margin-top:18px;font-size:14px;color:var(--ink-soft)">All prices in USD. Custom platforms and larger builds are quoted after a short scoping call.</p>
  </div>
  <div class="block" style="padding-top:0">
    <div class="sec-head reveal"><span class="eyebrow">Monthly services</span><h2>Ongoing growth plans</h2>
      <p>Recurring work that compounds — content, reviews and automation that keep working after launch.</p></div>
    <div class="grid g3">{plan_cards(MONTHLY)}</div>
  </div>
</div>"""


def body_about():
    return f"""<div class="wrap">
  <div class="page-head"><span class="eyebrow">About WEBRO</span>
    <h1>A small studio that ships fast and tells the truth</h1>
    <p>We build digital products for businesses that want results, not decoration — delivered by people who answer their own emails.</p></div>
  <div class="block" style="padding-top:34px"><div class="grid g2" style="align-items:center">
    <div class="reveal prose">
      <p>Most agencies split strategy, design and engineering across separate teams who never speak. What ships is the average of their disagreements — slow, generic, and out of date within a year.</p>
      <p>WEBRO works differently. One team owns the whole thing, from the first conversation to the deploy. Fewer handoffs, faster decisions, and a product that matches what you actually asked for.</p>
      <p>We work with restaurants, cafés, retailers, startups and growing companies across India, the US, UK, UAE and beyond. Small enough to care, experienced enough to deliver.</p>
    </div>
    <div class="orbit-wrap reveal" aria-hidden="true">
      <div class="ring r3"><span class="sat">AI Automation</span></div>
      <div class="ring r2"><span class="sat">Mobile Apps</span></div>
      <div class="ring r1"><span class="sat">Websites</span></div>
      <div class="orbit-core"><img src="assets/logo.png" alt="" width="70" height="70" /></div>
    </div>
  </div></div>
  <div class="block" style="padding-top:0">
    <div class="sec-head reveal"><span class="eyebrow">How we work</span><h2>Principles we don't bend</h2></div>
    <div class="grid g3">{''.join(f'<div class="svc reveal"><h3>{t}</h3><p>{d}</p></div>' for t, d in VALUES)}</div>
  </div>
</div>"""


def body_faq():
    return f"""<div class="wrap">
  <div class="page-head"><span class="eyebrow">FAQ</span>
    <h1>Questions we get asked a lot</h1>
    <p>Still unsure about something? Message us — we answer properly, not with a sales script.</p></div>
  <div class="block" style="padding-top:34px">
    <div style="max-width:820px">{faq_items()}</div>
    <div class="glass reveal" style="padding:30px;margin-top:28px;text-align:center;max-width:820px">
      <h3 style="font-size:21px;margin-bottom:10px">Didn't find your answer?</h3>
      <p style="color:var(--ink-soft);margin-bottom:20px">Ask WEBRO AI in the corner, or message us directly.</p>
      <a class="btn btn-primary" href="contact.html">Contact us</a></div>
  </div>
</div>"""


def body_contact():
    opts = "".join(f"<option>{s[1]}</option>" for s in SERVICES) + "<option>Something else</option>"
    return f"""<div class="wrap">
  <div class="page-head"><span class="eyebrow">Contact</span>
    <h1>Let's talk about your project</h1>
    <p>Tell us what you're building and what success looks like. We reply within one business day.</p></div>
  <div class="block" style="padding-top:34px"><div class="grid g2">
    <div class="cinfo reveal">
      <div class="row"><div class="ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg></div>
        <div><b>Call or WhatsApp</b><span><a href="tel:{BIZ['phone']}">{BIZ['phone_display']}</a></span></div></div>
      <div class="row"><div class="ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg></div>
        <div><b>Email</b><span><a href="mailto:{BIZ['email']}">{BIZ['email']}</a></span></div></div>
      <div class="row"><div class="ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg></div>
        <div><b>Instagram</b><span><a href="{BIZ['insta']}" target="_blank" rel="noopener">@webro.studio</a></span></div></div>
      <div class="row"><div class="ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
        <div><b>Studio location</b><span>WEBRO Studio, Jaipur, Rajasthan, India<br><a href="{BIZ['maps']}" target="_blank" rel="noopener">Open in Google Maps</a></span></div></div>
      <div class="map-embed"><iframe title="WEBRO Studio location on Google Maps" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=26.8176736,75.8617171&amp;z=16&amp;output=embed"></iframe></div>
    </div>
    <div class="reveal"><form class="glass" id="contactForm" novalidate style="padding:28px">
      <div class="field"><label for="name">Your name</label><input id="name" name="name" type="text" autocomplete="name" placeholder="Jane Cooper" /><span class="err">Please enter your name.</span></div>
      <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" placeholder="jane@company.com" /><span class="err">Please enter a valid email address.</span></div>
      <div class="field"><label for="phone">Phone / WhatsApp</label><input id="phone" name="phone" type="tel" autocomplete="tel" placeholder="+1 555 000 1234" /><span class="err">Please enter a valid phone number.</span></div>
      <div class="field"><label for="service">What do you need?</label><select id="service" name="service"><option value="">Select a service</option>{opts}</select><span class="err">Please choose a service.</span></div>
      <div class="field"><label for="message">Project details</label><textarea id="message" name="message" rows="4" placeholder="What are you building, and what does success look like?"></textarea><span class="err">Tell us a little more.</span></div>
      <button class="btn btn-primary" type="submit" style="width:100%">Send enquiry</button>
      <div class="form-ok" id="formOk"><b>Thanks! We'll reply within one business day.</b><br><span style="font-size:13px">Prefer instant? WhatsApp us on {BIZ['phone_display']}.</span></div>
    </form></div>
  </div></div>
</div>"""


def legal(title, sections):
    body = "".join(f"<h2>{h}</h2>{''.join(f'<p>{p}</p>' for p in ps)}" for h, ps in sections)
    return f"""<div class="wrap">
  <div class="page-head"><span class="eyebrow">Legal</span><h1>{title}</h1>
    <p>Last updated: {LAST_UPDATED}</p></div>
  <div class="block" style="padding-top:24px"><div class="prose" style="max-width:820px">{body}</div></div>
</div>"""


LAST_UPDATED = "August 2026"

PRIVACY = [
    ("Who we are", [f"WEBRO Studio (“WEBRO”, “we”, “us”) is a digital agency based in Jaipur, Rajasthan, India. You can reach us at <a href=\"mailto:{BIZ['email']}\">{BIZ['email']}</a> or {BIZ['phone_display']}."]),
    ("What we collect", ["When you submit our contact form we collect your name, email address, phone number, selected service and your message. We collect nothing else from that form.",
                         "If analytics is enabled we also collect anonymous usage data such as pages viewed, approximate region, device type and referring site. This data does not identify you personally."]),
    ("Why we collect it", ["To reply to your enquiry, prepare a quote and deliver work you have engaged us for. We also use aggregate analytics to understand which pages are useful and improve the site.",
                           "We do not sell, rent or trade your personal information to anyone, ever."]),
    ("Third parties", ["Form submissions are delivered through Web3Forms, which passes the message to our email inbox. Analytics, when enabled, is provided by Google Analytics. Fonts are served by Google Fonts and some icons by jsDelivr. Each of these providers has its own privacy policy.",
                       "Our contact page embeds a Google Maps frame, which may set cookies from Google when loaded."]),
    ("How long we keep it", ["Enquiry emails are retained while there is an active or prospective business relationship, and for a reasonable period afterwards for our records. You may ask us to delete your data at any time."]),
    ("Your rights", [f"You can ask us what data we hold about you, request a correction, or request deletion. Email <a href=\"mailto:{BIZ['email']}\">{BIZ['email']}</a> and we will respond within 30 days.",
                     "If you are in the EU or UK, you also have the right to lodge a complaint with your local data protection authority."]),
    ("Cookies", ["This site sets no cookies of its own. Third-party services listed above may set their own cookies. You can block cookies in your browser settings without losing access to the site."]),
    ("Changes", ["We may update this policy as our services change. The date at the top reflects the most recent revision."]),
]

TERMS = [
    ("Agreement", ["These terms apply to services provided by WEBRO Studio. By engaging us, paying a deposit, or approving a quote, you accept them. Any project-specific proposal we send takes precedence where the two differ."]),
    ("Quotes and scope", ["Quotes are fixed and valid for 30 days. The quote states what is included. Work outside that scope is quoted separately before it begins — we do not add charges without telling you first."]),
    ("Payment", ["Standard terms are 50% to begin and 50% on completion, before final handover. Larger projects may be split into milestones. We accept bank transfer, UPI, PayPal and international cards. Prices are quoted in USD unless agreed otherwise, and do not include third-party costs such as domains, hosting, paid plugins or stock assets."]),
    ("Your responsibilities", ["You agree to supply content, images, brand assets, access credentials and feedback within a reasonable time. Projects delayed more than 30 days awaiting client materials may be paused and rescheduled.",
                               "You confirm that any content you supply is yours to use, and does not infringe anyone else's rights."]),
    ("Revisions", ["Revisions are included at the design stage and again before launch, as described in your quote. Substantial changes of direction after approval are treated as new scope and quoted separately."]),
    ("Ownership", ["On receipt of final payment, all rights in the delivered work transfer to you, including source code, design files and assets we created. Domains and hosting accounts are registered in your name. Third-party components remain under their own licences.",
                   "We reserve the right to display the finished work in our portfolio unless you ask us in writing not to."]),
    ("Cancellation and refunds", ["If you cancel before work begins, your deposit is refunded in full. Once work has started, completed stages are billable and the deposit is non-refundable to the extent of work performed. We will always show you what has been done."]),
    ("Support and warranty", ["Websites include 30 days of support after launch covering defects and minor changes. This does not cover new features, third-party breakages, or changes made by others. Ongoing maintenance is available separately."]),
    ("Liability", ["We deliver work with reasonable skill and care, but we do not warrant uninterrupted or error-free operation. Our total liability is limited to the fees paid for the work concerned. We are not liable for indirect or consequential loss, including lost profits or data.",
                   "We make no guarantee of specific search rankings, traffic volumes or revenue. Search engines and social platforms are outside our control."]),
    ("Governing law", ["These terms are governed by the laws of India, with jurisdiction in Jaipur, Rajasthan. For international clients we will attempt good-faith resolution before any formal proceedings."]),
    ("Contact", [f"Questions about these terms: <a href=\"mailto:{BIZ['email']}\">{BIZ['email']}</a> or {BIZ['phone_display']}."]),
]

PAGES = {
    "index.html": (
        {"title": "WEBRO | Web Design, App & AI Development Agency",
         "desc": "WEBRO builds high-performance websites, mobile apps, e-commerce stores and AI automation for businesses worldwide. Menu QR, Review QR and Instagram management for restaurants and local brands.",
         "kw": "web development company, website design agency, mobile app development, AI automation agency, digital menu QR code, Google review QR code, Instagram management services, e-commerce development, software development company, SEO agency, web design Jaipur, hire web developers India"},
        hero_home),
    "services.html": (
        {"title": "Services | Web, App, AI & QR Solutions — WEBRO",
         "desc": "Website development, mobile apps, e-commerce, custom software, AI automation and chatbots, Instagram handling, Menu QR and Review QR. One team, worldwide delivery.",
         "kw": "website development services, mobile app development company, ecommerce website development, custom software development, AI chatbot development, instagram management agency, menu qr code for restaurant, google review qr code, seo services"},
        body_services),
    "pricing.html": (
        {"title": "Pricing in USD | Website, App & Monthly Plans — WEBRO",
         "desc": "Transparent fixed pricing from $299. Website, e-commerce and app packages plus monthly Instagram management, Menu QR and Review QR plans. No hourly billing.",
         "kw": "website design cost, web development pricing, how much does a website cost, app development cost, instagram management pricing, menu qr price, affordable web design agency"},
        body_pricing),
    "about.html": (
        {"title": "About WEBRO | Digital Agency in Jaipur, Serving Worldwide",
         "desc": "WEBRO is a small digital studio in Jaipur building websites, apps and automation for businesses across India, the US, UK and UAE. Fixed pricing, full code ownership.",
         "kw": "digital agency jaipur, web design company india, software company jaipur, about webro studio, web development agency"},
        body_about),
    "faq.html": (
        {"title": "FAQ | Costs, Timelines & Ownership — WEBRO",
         "desc": "How much a website costs, how long it takes, how payments work, what Menu QR and Review QR do, and what happens after launch.",
         "kw": "website cost faq, web design questions, how long to build a website, do i own my website code, website payment terms"},
        body_faq),
    "contact.html": (
        {"title": "Contact WEBRO | Free Quote Within One Business Day",
         "desc": "Call +91 63770 93356, message on WhatsApp, or send the form. WEBRO Studio, Jaipur — working with clients worldwide. We reply within one business day.",
         "kw": "contact web design agency, hire web developer india, website quote, web design jaipur contact, whatsapp web developer"},
        body_contact),
    "privacy.html": (
        {"title": "Privacy Policy — WEBRO",
         "desc": "How WEBRO Studio collects, uses and protects your personal information.",
         "kw": "webro privacy policy", "robots": "index, follow"},
        lambda: legal("Privacy Policy", PRIVACY)),
    "terms.html": (
        {"title": "Terms of Service — WEBRO",
         "desc": "The terms that apply to design, development and marketing services provided by WEBRO Studio.",
         "kw": "webro terms of service", "robots": "index, follow"},
        lambda: legal("Terms of Service", TERMS)),
}


def main():
    for page, (meta, body_fn) in PAGES.items():
        (ROOT / page).write_text(render(page, meta, body_fn()), encoding="utf-8")
        print(f"  built {page}")

    # 404
    not_found = """<div class="wrap"><div class="block" style="text-align:center;padding:90px 0">
  <span class="eyebrow">Error 404</span>
  <h1 style="font-size:clamp(32px,7vw,64px);margin-bottom:18px">This page moved on</h1>
  <p style="color:var(--ink-soft);max-width:460px;margin:0 auto 28px">The link is broken or the page no longer exists. Everything worth seeing is one click away.</p>
  <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
    <a class="btn btn-primary" href="index.html">Back home</a>
    <a class="btn btn-ghost" href="services.html">See services</a></div>
</div></div>"""
    (ROOT / "404.html").write_text(render("404.html", {
        "title": "Page not found — WEBRO", "desc": "That page does not exist.",
        "kw": "", "robots": "noindex, follow"}, not_found), encoding="utf-8")
    print("  built 404.html")

    # sitemap
    urls = "".join(
        f"\n  <url><loc>{SITE}/{'' if p == 'index.html' else p}</loc>"
        f"<changefreq>{'weekly' if p == 'index.html' else 'monthly'}</changefreq>"
        f"<priority>{'1.0' if p == 'index.html' else '0.8'}</priority></url>"
        for p in PAGES)
    (ROOT / "sitemap.xml").write_text(
        f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}\n</urlset>\n',
        encoding="utf-8")
    print("  built sitemap.xml")

    (ROOT / "robots.txt").write_text(
        f"User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n", encoding="utf-8")
    print("  built robots.txt")

    # Tells GitHub Pages to serve these files as-is instead of running them
    # through Jekyll. This site needs no build step, and Jekyll would otherwise
    # try to parse unrelated files in the repo and can fail the deployment.
    (ROOT / ".nojekyll").touch()
    print("  built .nojekyll")


if __name__ == "__main__":
    print("Building WEBRO site…")
    main()
    print("Done.")
