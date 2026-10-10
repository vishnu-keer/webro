# WEBRO review helper API

A Cloudflare Worker that turns a customer's own notes into an editable Google review draft using Gemini. It powers the page at `https://webro.studio/review`.

## Overview

The website is static and hosted on GitHub Pages, which cannot run server code. This Worker is the only server-side piece. It is also the only place the Gemini API key exists.

```
Customer's phone ──► webro.studio/review (GitHub Pages, static)
                          │  POST /draft  {service, experience, details, language}
                          ▼
                     Cloudflare Worker (this folder) ── GEMINI_API_KEY (encrypted secret)
                          │  plain text generation only
                          ▼
                     Gemini API (gemini-3.8-flash)
```

The customer then copies the draft, opens the official Google review link, pastes it, picks their own rating and posts it themselves. Nothing is posted automatically.

## Architecture

| File | Responsibility |
|---|---|
| `src/index.ts` | Entry point. Reads `GEMINI_API_KEY` server-side and wires the handler. |
| `src/handler.ts` | HTTP layer: CORS allow-list, method and content-type checks, body-size limit, rate limits, error mapping, safe logging. |
| `src/options.ts` | The services and "what you liked" choices. Shared with the website so buttons and validation never drift. |
| `src/validate.ts` | Server-side validation (only listed choices accepted), cleanup, and removal of emails and phone numbers before anything is sent to Gemini. |
| `src/prompt.ts` | The honesty rules (system instruction), prompt builder, JSON output schema and parser. |
| `src/gemini.ts` | `@google/genai` call: text only, temperature 0.3, max 1024 output tokens, lowest thinking level each model accepts, 12 s timeout per model, automatic backup model. |
| `src/config.ts` | All limits in one place. |
| `test/` | 29 Vitest tests covering validation, CORS, limits, all error paths and log hygiene. |

### Protection and cost controls

- **Rate limits** (Cloudflare Rate Limiting binding): 5 drafts per minute per IP, plus a ceiling of 10 per minute for the whole site. Both are configured in `wrangler.toml`.
- **Body limit:** 8 KB. **Field limits:** only listed services and choices are accepted, "Other" service 60 characters, note 600 characters. **Output:** at most 1,024 tokens, and the draft is cut to 1,200 characters.
- **CORS allow-list:** only `webro.studio` and local dev can call it from a browser.
- **No storage:** nothing is written to a database or KV.
- **Logs** contain only an event name, an error kind, an HTTP status and a duration. Review text, drafts and the key are never logged, and a test enforces this.
- **Gemini quota exhausted (429):** returns 503 `quota_exhausted` with a friendly message, and the page still lets the customer write the review themselves.

### Data use (Gemini API free tier)

On the free (unpaid) tier, Google may use submitted text to improve its products, and human reviewers may read it. On a paid tier, Google does not use prompts or responses to improve its products. The page shows the matching notice. If you enable billing, change `review.geminiTier` in `src/data/site.ts` to `'paid'`. Reference: https://ai.google.dev/gemini-api/terms

## Local testing

```bash
cd worker
npm install
cp .dev.vars.example .dev.vars        # then put your real key in .dev.vars (gitignored)
npm run check                         # type-check + 25 tests + bundle dry-run
npm run dev                           # http://localhost:8787
```

Quick API test, in a second terminal:

```bash
curl -s -X POST http://localhost:8787/draft \
  -H 'Origin: http://localhost:4321' -H 'Content-Type: application/json' \
  -d '{"service":"Website","liked":["Fast delivery","Great design"],"note":"They missed one deadline.","language":"en"}'
```

To test the page against the local Worker, temporarily set `review.apiUrl` in `src/data/site.ts` to `http://localhost:8787/draft`. Then run `npm run dev` in the site root and open `http://localhost:4321/review`. Do not commit that local URL.

## Production deployment

1. Create a free Cloudflare account at https://dash.cloudflare.com/sign-up.
2. Deploy:

   ```bash
   cd worker
   npm install
   npx wrangler login
   npx wrangler secret put GEMINI_API_KEY      # paste the key when prompted; it is stored encrypted
   npm run deploy
   ```

   Wrangler prints the URL, for example `https://webro-review-api.<your-subdomain>.workers.dev`.
3. Check it: `curl https://webro-review-api.<your-subdomain>.workers.dev/health` should return `{"ok":true}`.
4. Put `https://webro-review-api.<your-subdomain>.workers.dev/draft` into `review.apiUrl` in `src/data/site.ts`, then commit and push. GitHub Actions rebuilds the site.
5. Open `https://webro.studio/review` on your phone and generate one draft.

### Changing things later

| Change | Where |
|---|---|
| Gemini model | `GEMINI_MODEL` in `wrangler.toml`, then `npm run deploy` |
| Backup model (used only if the main one times out, is overloaded or out of quota) | `GEMINI_FALLBACK_MODEL` in `wrangler.toml` |
| Check the key and models from your Mac | `GEMINI_API_KEY=... node scripts/diagnose.mjs` |
| Rotate the key | `npx wrangler secret put GEMINI_API_KEY` |
| Rate limits | `[[ratelimits]]` in `wrangler.toml` |
| Google review link | `review.googleReviewUrl` in `src/data/site.ts` (not a secret) |
| Turn the AI step off | Set `review.apiUrl` to `''`. The page becomes a plain "write and copy" helper. |

## Future improvements

- Turnstile (free Cloudflare CAPTCHA) if abuse appears despite rate limits.
- A QR code on the Review QR stands that points to `/review`.
