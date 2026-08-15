/* ============================================================
   WEBRO — shared application script
   Loaded by every page. Edit once here.
   ============================================================ */
(function () {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const BIZ = {
  phone: '+916377093356',
  phoneDisplay: '+91 63770 93356',
  email: 'webro284@gmail.com',
  wa: 'https://wa.me/916377093356',
  insta: 'https://www.instagram.com/webro.studio/'
};

/* ---------- Year stamp ---------- */
$$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

/* ---------- Loader: DOM-ready with a hard 3s ceiling ---------- */
(function () {
  const el = $('#loader'); if (!el) return;
  let done = false;
  const hide = () => { if (done) return; done = true; el.classList.add('hide'); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(hide, 1000));
  else setTimeout(hide, 1000);
  setTimeout(hide, 3000);
})();

/* ---------- Header scroll state ---------- */
const hdr = $('#hdr');
if (hdr) {
  const onScroll = () => hdr.classList.toggle('scrolled', window.scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Mobile menu ---------- */
const burger = $('#burger'), mobileMenu = $('#mobileMenu');
if (burger && mobileMenu) {
  burger.addEventListener('click', function () {
    const open = mobileMenu.classList.toggle('open');
    this.classList.toggle('open', open);
    this.setAttribute('aria-expanded', String(open));
  });
}

/* ---------- Scroll reveal ----------
   Content starts at opacity:0 and is revealed on scroll. That is fine until
   IntersectionObserver misbehaves — some in-app browsers (WhatsApp, Instagram,
   Chrome Custom Tabs) throttle or never fire it, which leaves whole sections
   permanently blank. Every path below ends with the content visible. */
function revealAll() { $$('.reveal').forEach(el => el.classList.add('in')); }

if (!('IntersectionObserver' in window)) {
  revealAll();                                   // no support at all
} else {
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: 0, rootMargin: '0px 0px 15% 0px' });   // fire earlier, not later

  $$('.reveal').forEach(el => io.observe(el));

  // Safety net: anything still hidden after 2.5s gets shown regardless.
  // A visitor seeing blank space is far worse than skipping an animation.
  setTimeout(() => {
    $$('.reveal:not(.in)').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight * 1.5) el.classList.add('in');
    });
  }, 2500);

  // Final guarantee — after 6s nothing on the page is invisible.
  setTimeout(revealAll, 6000);
}

/* ---------- Cursor glow on cards ---------- */
document.addEventListener('pointermove', e => {
  const card = e.target.closest('.svc'); if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
  card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
});

/* ---------- FAQ accordion ---------- */
document.addEventListener('click', e => {
  const btn = e.target.closest('.qa button'); if (!btn) return;
  const qa = btn.parentElement, ans = qa.querySelector('.ans'), open = qa.classList.contains('open');
  $$('.qa').forEach(o => {
    o.classList.remove('open');
    o.querySelector('.ans').style.maxHeight = null;
    o.querySelector('button').setAttribute('aria-expanded', 'false');
  });
  if (!open) {
    qa.classList.add('open');
    ans.style.maxHeight = ans.scrollHeight + 'px';
    btn.setAttribute('aria-expanded', 'true');
  }
});

/* ---------- Hero typing ---------- */
(function () {
  const el = $('#typeLine'); if (!el) return;
  const PHRASES = ['Websites that convert.', 'Apps people actually use.', 'AI that does the busywork.', 'QR tools for restaurants.'];
  if (reduceMotion) { el.textContent = PHRASES[0]; return; }
  let pi = 0, ci = 0, deleting = false;
  (function tick() {
    const w = PHRASES[pi];
    ci = deleting ? ci - 1 : ci + 1;
    el.innerHTML = w.slice(0, ci) + '<span class="cursor"></span>';
    let wait = deleting ? 40 : 75;
    if (!deleting && ci === w.length) { wait = 1800; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % PHRASES.length; wait = 350; }
    setTimeout(tick, wait);
  })();
})();

/* ---------- Tech marquee ---------- */
(function () {
  const track = $('#techTrack'); if (!track) return;
  const TECH = [['React','react/react-original'],['Next.js','nextjs/nextjs-original'],['Node.js','nodejs/nodejs-original'],['TypeScript','typescript/typescript-original'],['Tailwind','tailwindcss/tailwindcss-original'],['Figma','figma/figma-original'],['WordPress','wordpress/wordpress-plain'],['Shopify','shopify/shopify-original'],['Python','python/python-original'],['Firebase','firebase/firebase-plain'],['Flutter','flutter/flutter-original'],['MongoDB','mongodb/mongodb-original']];
  const html = TECH.map(([n, p]) => `<span class="chip"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${p}.svg" alt="" loading="lazy" width="20" height="20"/>${n}</span>`).join('');
  track.innerHTML = html + html;
})();

/* The page background is handled by assets/bg3d.js (WebGL, one scene per
   page, selected via <body data-bg="...">). Pages without a data-bg simply
   keep the CSS aurora, which is the cheapest option and always renders. */

/* ============================================================
   ANALYTICS EVENTS
   Fires into GA4 if gtag is present; harmless if not.
   ============================================================ */
function track(name, params) {
  if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
}
document.addEventListener('click', e => {
  const a = e.target.closest('a'); if (!a) return;
  const href = a.getAttribute('href') || '';
  if (href.startsWith('tel:'))       track('call_click',     { method: 'phone' });
  if (href.includes('wa.me'))        track('whatsapp_click', { method: 'whatsapp' });
  if (href.startsWith('mailto:'))    track('email_click',    { method: 'email' });
  if (href.includes('instagram.com'))track('instagram_click',{ method: 'instagram' });
});

/* ============================================================
   CONTACT FORM

   SETUP (2 minutes, free, no backend):
     1. https://web3forms.com  →  enter webro284@gmail.com  →  copy the access key
     2. Paste it into WEB3FORMS_KEY below
     3. Save and push — enquiries then arrive in your inbox.

   Until the key is set the form opens the visitor's email client
   pre-filled, so an enquiry is never silently lost.
   ============================================================ */
const WEB3FORMS_KEY = '';

(function () {
  const form = $('#contactForm'); if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    let ok = true;
    const v = id => $('#' + id).value.trim();
    const setErr = (id, bad) => { $('#' + id).closest('.field').classList.toggle('invalid', bad); if (bad) ok = false; };

    setErr('name',    v('name').length < 2);
    setErr('email',   !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v('email')));
    setErr('phone',   v('phone').replace(/\D/g, '').length < 7);
    setErr('service', v('service') === '');
    setErr('message', v('message').length < 5);
    if (!ok) { const f = form.querySelector('.invalid input, .invalid select, .invalid textarea'); if (f) f.focus(); return; }

    const btn = form.querySelector('button[type="submit"]');
    const label = btn.textContent;
    const busy = on => { btn.disabled = on; btn.style.opacity = on ? '.65' : ''; btn.textContent = on ? 'Sending…' : label; };
    const okBox = $('#formOk');
    const show = msg => { if (msg) okBox.querySelector('b').textContent = msg; okBox.classList.remove('show'); void okBox.offsetWidth; okBox.classList.add('show'); };

    const payload = {
      name: v('name'), email: v('email'), phone: v('phone'),
      service: v('service'), message: v('message'),
      subject: 'New enquiry from webro.studio — ' + v('service'),
      from_name: 'WEBRO website'
    };

    if (!WEB3FORMS_KEY) {
      const body = encodeURIComponent('Name: ' + payload.name + '\nEmail: ' + payload.email +
        '\nPhone: ' + payload.phone + '\nService: ' + payload.service + '\n\n' + payload.message);
      location.href = 'mailto:' + BIZ.email + '?subject=' + encodeURIComponent(payload.subject) + '&body=' + body;
      show('Opening your email app…'); track('generate_lead', { method: 'mailto' });
      return;
    }

    busy(true);
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: WEB3FORMS_KEY, ...payload })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'failed');
      show("Thanks! We'll reply within one business day.");
      form.querySelectorAll('input,select,textarea').forEach(f => f.value = '');
      track('generate_lead', { method: 'form' });
    } catch (err) {
      show('Could not send — please WhatsApp us on ' + BIZ.phoneDisplay + '.');
    } finally { busy(false); }
  });
})();

/* ============================================================
   WEBRO AI — scripted assistant

   How it works: each entry has trigger keywords and an answer.
   The matcher scores every entry against the visitor's words and
   replies with the best match, or offers a handoff when unsure.

   TO ADD A QUESTION: copy any block below, change `k` (keywords)
   and `a` (answer). Order does not matter.
   ============================================================ */
const KB = [
  { k:['hi','hello','hey','good morning','good evening','namaste','hii','hiya'],
    a:"Hello! 👋 I'm WEBRO AI. I can help with pricing, timelines, services or getting a quote.\n\nWhat are you looking to build?" },

  { k:['price','pricing','cost','how much','charge','rate','budget','expensive','quote','fees','fee'],
    a:"Our pricing is fixed and agreed before we start — no hourly billing.\n\n• Starter — $299 (one-page site)\n• Business — $899 (full multi-page website)\n• Premium — from $1,999 (e-commerce, apps, custom platforms)\n\nMonthly: Instagram $199/mo, Menu QR $99 setup + $19/mo, Review QR $79.\n\nSee <a href=\"pricing.html\">full pricing</a> or tell me your project and I'll point you to the right tier." },

  { k:['cheap','cheaper','discount','lower price','less money','tight budget','afford','negotiate'],
    a:"I understand budgets matter. The Starter package at $299 covers a professional one-page site — enough for most new businesses to start getting enquiries.\n\nWe also split larger projects into stages so you spread the cost. Tell us your budget honestly on the <a href=\"contact.html\">contact page</a> and we'll tell you what's realistic within it." },

  { k:['time','how long','timeline','duration','deadline','fast','quick','when ready','delivery time','days','weeks'],
    a:"Typical timelines:\n\n• One-page site — 5 to 7 days\n• Full website — 2 to 3 weeks\n• E-commerce store — 3 to 4 weeks\n• Mobile app — 6 to 10 weeks\n\nWe give you a realistic date during scoping, not an optimistic one. Rush delivery is sometimes possible — just ask." },

  { k:['service','services','what do you do','offer','provide','capabilities','help with'],
    a:"We build:\n\n• Websites & landing pages\n• E-commerce stores\n• Mobile apps (iOS + Android)\n• Custom software & dashboards\n• AI automation & chatbots\n• Instagram management\n• Menu QR & Review QR\n• SEO & digital marketing\n\nFull detail on the <a href=\"services.html\">services page</a>. Which one interests you?" },

  { k:['website','web design','web development','landing page','business website','company website'],
    a:"Websites are our core work. You get a custom design (never a template), mobile-first build, fast load times, SEO setup, contact form and WhatsApp integration.\n\nOne-page from $299, full multi-page from $899, delivered in 5 days to 3 weeks depending on size." },

  { k:['app','mobile app','android','ios','iphone','play store','app store','application'],
    a:"We build iOS and Android apps from a single codebase, so you're not paying twice.\n\nThat covers UI/UX design, the app itself, backend and API, plus store submission for both Apple and Google. Typically 6–10 weeks, starting around $1,999 depending on features." },

  { k:['ecommerce','e-commerce','online store','shop','shopify','sell online','woocommerce','cart','products'],
    a:"Online stores with secure checkout, payment gateways, inventory management and order tracking — built on Shopify or fully custom.\n\nUsually 3–4 weeks, from $1,999. We also handle product photography guidance and launch setup." },

  { k:['ai','chatbot','automation','bot','artificial intelligence','automate','agent','gpt'],
    a:"We build AI that does actual work: chatbots that answer customers day and night, lead qualification that sorts serious enquiries from browsers, and automations that move data between your tools so nobody retypes anything.\n\nMost clients save 10–30 hours a month. Want to tell me what's eating your time?" },

  { k:['menu qr','digital menu','restaurant menu','qr menu','menu code','cafe menu'],
    a:"Menu QR is built for restaurants and cafés. Customers scan a code at the table and see your live menu on their phone.\n\nChange a price or mark something sold out and it updates instantly — no reprinting. $99 setup plus $19/month, live within 3 days." },

  { k:['review qr','google review','reviews','rating','review code','review stand','more reviews'],
    a:"Review QR is a branded stand for your counter or table. Customers scan it and land straight on your Google review page — no searching.\n\nMore reviews lift your local ranking, which is what decides whether you show up in \"near me\" searches. $79 one-time, includes print-ready design files." },

  { k:['instagram','social media','insta','reels','posts','content','smm','facebook'],
    a:"Our Instagram plan is full management at $199/month:\n\n• 12–16 posts\n• Reels and story design\n• Captions and hashtag research\n• Posting schedule\n• Monthly performance report\n\nYou approve the monthly plan; we handle everything else. Our own account is <a href=\"" + BIZ.insta + "\" target=\"_blank\" rel=\"noopener\">@webro.studio</a>." },

  { k:['seo','ranking','google ranking','search engine','rank','traffic','visibility','first page'],
    a:"We handle technical SEO, on-page optimisation, local search setup and content strategy.\n\nHonest expectation: SEO takes 3–6 months to show real movement. Anyone promising page one in 30 days is selling you something. What we guarantee is a technically correct foundation and a clear plan." },

  { k:['software','custom software','crm','dashboard','erp','internal tool','booking system','management system'],
    a:"Custom software built around how your business actually runs — booking systems, CRMs, admin dashboards, inventory tools, reporting.\n\nWe start with a short discovery to map your workflow, then build only what earns its place. Quoted after scoping." },

  { k:['logo','branding','brand','identity','design','ui','ux','graphic'],
    a:"Brand identity covers logo design, colour system, typography and usage guidelines — plus UI/UX design for your product or site.\n\nUsually delivered as a brand kit with all source files. Included in Premium, or available standalone." },

  { k:['maintenance','support','after launch','updates','hosting','backup','fix','warranty'],
    a:"Every website includes 30 days of free support after launch for fixes and small changes.\n\nAfter that you can take a maintenance plan covering hosting, updates, backups, security and speed monitoring — or just pay for changes as you need them. No lock-in either way." },

  { k:['contact','talk','call','phone','number','reach','speak','get in touch','whatsapp'],
    a:"Easiest ways to reach us:\n\n📞 <a href=\"tel:" + BIZ.phone + "\">" + BIZ.phoneDisplay + "</a>\n💬 <a href=\"" + BIZ.wa + "\" target=\"_blank\" rel=\"noopener\">WhatsApp</a>\n✉️ <a href=\"mailto:" + BIZ.email + "\">" + BIZ.email + "</a>\n\nOr send the <a href=\"contact.html\">contact form</a> — we reply within one business day." },

  { k:['location','where','address','based','office','city','jaipur','india','visit'],
    a:"We're based in Jaipur, Rajasthan, India — and we work with clients worldwide.\n\nMost projects run entirely over email, WhatsApp and video calls, so your location isn't a problem. You can find us on <a href=\"contact.html\">Google Maps here</a>." },

  { k:['international','abroad','usa','us','uk','dubai','uae','canada','australia','overseas','foreign','worldwide','global','work with us','us clients','outside india','other country'],
    a:"Yes — we work with clients in the US, UK, UAE, Canada, Australia and across Europe.\n\nWe bill in USD, take international payments, and schedule calls in your timezone. Roughly half our work is for clients outside India." },

  { k:['payment','pay','installment','advance','deposit','emi','bank','paypal','how to pay'],
    a:"We usually work on 50% to start and 50% at delivery. Larger projects are split into milestones.\n\nWe accept bank transfer, UPI, PayPal and international cards. You get a proper invoice for every payment." },

  { k:['refund','cancel','money back','not happy','guarantee','risk'],
    a:"If we haven't started and you change your mind, your deposit is returned in full.\n\nOnce design work begins, completed stages are billable — and we make that clear in writing before starting, so there are no surprises." },

  { k:['own','ownership','code','source code','rights','transfer','mine','belongs'],
    a:"You own everything, completely.\n\nCode, domain, hosting accounts and all design assets are registered in your name and handed over at launch. We never hold anything hostage — if you leave, it all comes with you." },

  { k:['revision','changes','edit','modify','feedback','not like','redo'],
    a:"Revisions are built into the process. You review at design stage and again before launch, and we adjust at each point.\n\nWe'd rather change it during the build than have you live with something you don't like." },

  { k:['portfolio','work','examples','previous','case study','clients','who have you worked','samples','projects'],
    a:"We're rebuilding our portfolio section right now with proper case studies rather than placeholder projects.\n\nIn the meantime, message us on <a href=\"" + BIZ.wa + "\" target=\"_blank\" rel=\"noopener\">WhatsApp</a> and we'll send relevant examples for your industry directly." },

  { k:['who are you','about','company','team','founder','experience','how long in business','trust'],
    a:"WEBRO is a digital studio based in Jaipur, building websites, apps and automation for businesses worldwide.\n\nWe're deliberately small — the people you talk to are the people who build your project. No junior handover after you sign. More on the <a href=\"about.html\">about page</a>." },

  { k:['start','begin','get started','how does it work','process','next step','proceed','ready'],
    a:"Simple:\n\n1. You tell us your goal (not a spec — just what you want to achieve)\n2. We send a fixed quote and timeline within one business day\n3. You approve and pay 50% to start\n4. We design, you review, we build\n5. Launch, handover, and 30 days of support\n\nReady? <a href=\"contact.html\">Send us your project</a>." },

  { k:['domain','hosting','server','ssl','buy domain','where hosted'],
    a:"We can register your domain and set up hosting, or work with what you already have.\n\nEverything is registered in your name. Hosting typically runs $5–20/month depending on the site, and SSL is always included." },

  { k:['mobile friendly','responsive','phone','tablet','device'],
    a:"Every site we build is mobile-first — designed for the phone before the desktop, because that's where most of your visitors are.\n\nWe test on real devices before launch, not just a browser resize." },

  { k:['speed','fast','slow','performance','loading','load time'],
    a:"Speed is treated as part of the design, not an afterthought. We optimise images, fonts and scripts, and target a load under 2 seconds.\n\nA slow site loses customers before they see anything — so this isn't optional for us." },

  { k:['thank','thanks','thankyou','great','awesome','nice','perfect','ok','okay','cool'],
    a:"Happy to help! 🙌\n\nIf you'd like a quote, the <a href=\"contact.html\">contact form</a> takes about a minute — or message us on <a href=\"" + BIZ.wa + "\" target=\"_blank\" rel=\"noopener\">WhatsApp</a> for a faster reply." },

  { k:['bye','goodbye','see you','later','cya'],
    a:"Thanks for stopping by! 👋\n\nWhenever you're ready, we're on <a href=\"" + BIZ.wa + "\" target=\"_blank\" rel=\"noopener\">WhatsApp</a> or at <a href=\"mailto:" + BIZ.email + "\">" + BIZ.email + "</a>." },

  { k:['human','real person','agent','someone','talk to person','manager'],
    a:"Of course — I'm an assistant, not a person.\n\nFor a real reply: <a href=\"" + BIZ.wa + "\" target=\"_blank\" rel=\"noopener\">WhatsApp us</a> or call <a href=\"tel:" + BIZ.phone + "\">" + BIZ.phoneDisplay + "</a>. Someone answers within one business day, usually much sooner." }
];

const FALLBACK =
  "I'm not sure I understood that one — I'd rather send you to a human than guess.\n\n" +
  "💬 <a href=\"" + BIZ.wa + "\" target=\"_blank\" rel=\"noopener\">WhatsApp us</a>\n" +
  "📞 <a href=\"tel:" + BIZ.phone + "\">" + BIZ.phoneDisplay + "</a>\n\n" +
  "Or try asking about pricing, timelines, services, Menu QR, Review QR or Instagram.";

/* Scores each entry against the visitor's words.
   Multi-word phrases outrank single words. Short keywords (under 5 letters)
   must match as whole words — otherwise "yo" would match inside "you" and
   "us" inside "ustom", which produced badly wrong answers. */
function answer(input) {
  const q = ' ' + input.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
  let best = null, bestScore = 0;

  for (const item of KB) {
    let score = 0;
    for (const kw of item.k) {
      const phrase = kw.includes(' ');
      // Whole-word match, tolerating a simple plural ("app" also matches "apps").
      const whole = q.includes(' ' + kw + ' ') || q.includes(' ' + kw + 's ') ||
                    q.includes(' ' + kw + 'es ');
      if (whole)                                 score += phrase ? 6 : 3;
      else if (kw.length >= 5 && q.includes(kw)) score += phrase ? 4 : 1.5;
    }
    if (score > bestScore) { bestScore = score; best = item; }
  }
  return bestScore >= 1.5 && best ? best.a : FALLBACK;
}

(function initChat() {
  const fab = $('#chatFab'), panel = $('#chatPanel'), body = $('#chatBody'),
        input = $('#chatInput'), send = $('#chatSend'), close = $('#chatClose');
  if (!fab || !panel) return;

  let greeted = false;

  const scroll = () => { body.scrollTop = body.scrollHeight; };
  const add = (text, who) => {
    const d = document.createElement('div');
    d.className = 'msg ' + who;
    d.innerHTML = text;
    body.appendChild(d); scroll();
  };
  const typing = () => {
    const t = document.createElement('div');
    t.className = 'typing'; t.id = 'typingDots';
    t.innerHTML = '<i></i><i></i><i></i>';
    body.appendChild(t); scroll();
    return t;
  };

  function respond(text) {
    add(text, 'user');
    const t = typing();
    const reply = answer(text);
    // Delay scales with reply length so it reads like someone typing.
    const delay = Math.min(1500, 420 + reply.length * 3.2);
    setTimeout(() => { t.remove(); add(reply, 'bot'); track('chat_message', { q: text.slice(0, 60) }); }, delay);
  }

  function open() {
    panel.classList.add('open');
    fab.setAttribute('aria-expanded', 'true');
    if (!greeted) {
      greeted = true;
      setTimeout(() => add("Hi! 👋 I'm <b>WEBRO AI</b>.\n\nAsk me about pricing, timelines, services, or anything else — I'll answer straight away.", 'bot'), 200);
    }
    setTimeout(() => input.focus(), 320);
    track('chat_open');
  }
  function shut() { panel.classList.remove('open'); fab.setAttribute('aria-expanded', 'false'); }

  fab.addEventListener('click', () => panel.classList.contains('open') ? shut() : open());
  close.addEventListener('click', shut);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) shut(); });

  const submit = () => {
    const v = input.value.trim();
    if (!v) return;
    input.value = '';
    respond(v);
  };
  send.addEventListener('click', submit);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });

  $$('.chat-quick button').forEach(b => b.addEventListener('click', () => respond(b.dataset.q || b.textContent)));
})();

})();
