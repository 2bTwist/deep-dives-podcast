# POST-REVEAL TODO

Everything that needs Raissa's input, real source material, or your follow-up action **after** the surprise reveal. The site ships with reasonable placeholders for all of these — they work today, but each one has my voice on it instead of hers.

Grouped by urgency. Get her on the highest-impact items first.

---

## Status updates since this doc was written

**2026-05-17 (post-DNS-fix session):**

- ✅ **Sanity CORS** added on the live project (`f63p2zht`) for apex, www, and `vercel.app` aliases. `/studio` editing works on production.
- ✅ **Vercel GitHub App** installed and connected to the repo. `git push origin main` now auto-deploys to production (no more manual `vercel --prod`).
- ✅ **Cloudflare DNS swapped from A `76.76.21.21` to CNAME `cname.vercel-dns.com`** for both apex and www. Fixes a real reachability issue (the Anycast IP `76.76.21.21` had broken carrier routes on some networks — Edmond's iPhone literally couldn't reach the site, while a Mac on the same WiFi could). CNAME flattening at the apex works on Cloudflare by default. See `specs/handoffs/2026-05-17_1442-deepdives-shipped-and-perf-tuned.md` for the longer story and `specs/perf-log.md` for the numbers.
- ✅ **Vercel Speed Insights** wired into `layout.tsx`. Real-user p75 LCP/INP/CLS surfaces in the Vercel dashboard after 24-48h of traffic.
- ✅ **Lighthouse CI** gates every PR. Fails the check if median mobile LCP > 3s, FCP > 2s, TBT > 200ms, or CLS > 0.1. See `.github/workflows/lighthouse.yml`.
- ✅ **OG image PNG → JPG** (317KB → 109KB on every social-share preview fetch).
- ✅ **Fonts (Fraunces + Allura)** moved to `display: optional` so late font swaps don't push the h1 LCP measurement.
- ✅ **Speculation Rules** added: Chromium prerenders likely-next pages on hover. Ignored by Safari.
- ⏸ **Item 13 below ("Domain DNS hygiene")** — done in spirit (DNS is correct, DNS-only/grey-cloud confirmed) but the SPECIFIC record swap that actually mattered is captured above, not in the original write-up.

Everything else in the tiers below still stands.

---

## Tier 1 — Copy she should own (her voice, not mine)

### 1. `/about` manifesto (4 paragraphs)
**File:** `src/app/about/page.tsx`
**Look for:** The four `<p>` tags inside the "The manifesto" block, currently starting with "I made Deep Dives because the conversations I most wanted to hear weren't happening anywhere..."

The whole block is written in *her voice* as if she's speaking — but the words are mine. Have her rewrite it in a single sitting. Encourage her to be specific (what conversation she wanted that didn't exist? what was the moment she decided to start?) rather than abstract.

### 2. Homepage "Why I Started Deep Dives" body (2 paragraphs)
**File:** `src/components/site/WhyIStartedSection.tsx`
**Look for:** The `<p>` tags inside `<div className="mt-10 max-w-xl space-y-6 ...">`.

Same problem as above. Two short paragraphs of her actual voice. Could be excerpts of the longer /about manifesto, or different prose entirely.

### 3. Homepage value cards (4 cards)
**File:** `src/components/site/WhyIStartedSection.tsx`
**Look for:** The `values` array at the top — `Real Conversations`, `Inspiring Guests`, `Meaningful Impact`, `A Community`.

Each card has a one-line description I wrote. Ask her to tighten or rewrite each to match how *she* would describe what Deep Dives is. Keep them short (one sentence each).

### 4. Episode descriptions (6 episodes)
**Location:** Sanity Studio at `/studio` → Episodes
The description on each episode card is mine, scraped editorially. If she has actual show notes or her own framing of each episode, swap them in the Studio (instant — no code edit needed).

---

## Tier 2 — Visual swaps

### 5. AI-stylized portrait of Raissa
**File:** `public/brand/raissa-portrait.png`
Currently a 150×339 crop from her real YouTube banner. Approved as a v1 placeholder. If she'd like a stylized portrait (charcoal sketch, editorial illustration, etc.), generate it in ChatGPT or Midjourney at roughly the same aspect ratio (or wider/taller — `object-cover` will handle), drop it at the same path, and any `objectPosition` tweaks happen in `src/components/site/Hero.tsx` (~line 137) and `src/components/site/WhyIStartedSection.tsx` (~line 38).

### 6. Founder portrait crop on `/about`
**File:** `public/brand/raissa-portrait.png` (shared with above)
Same source image. If you generate a higher-res or differently-cropped portrait specifically for the bigger /about card, you can either replace the shared file or introduce a second file like `raissa-portrait-large.png` and update the `<Image src=>` in `src/app/about/page.tsx`.

---

## Tier 3 — Wiring that's deliberately stubbed

### 7. Contact form backend
**File:** `src/components/site/ContactForm.tsx`
Form currently fakes submission (700ms delay, success state). No emails are actually sent.

**To wire it:**
- Sign up for Resend at resend.com (free 3k emails/mo)
- Create an API key
- Add `RESEND_API_KEY=...` and `CONTACT_INBOX_EMAIL=<her email>` to `.env.local` (also to Vercel project env vars for prod)
- Build `src/app/api/contact/route.ts` to receive POSTs and send via Resend
- Update `ContactForm.tsx` to `fetch('/api/contact', { method: 'POST', body: JSON.stringify(...) })` instead of the fake `await new Promise`

I deliberately skipped this — it requires an account she doesn't have yet.

### 8. Newsletter signup backend
**File:** `src/components/site/CommunitySection.tsx`
Same deal — fake submit, no list. Need either Resend Audiences, ConvertKit, Mailchimp, or a Sanity `subscriber` document type.

---

## Tier 4 — Legal copy review

### 9. Privacy + Terms language
**Files:** `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`
Both pages exist with **generic placeholder copy**. They cover the basics (no analytics, no selling data, standard usage terms) but are not lawyer-reviewed. Have her run them by someone (or rewrite for her specific situation) before going public if there are unique concerns.

The "Last updated" date is hardcoded — update when you make material changes.

---

## Tier 5 — Operational housekeeping

### 10. Sanity content access
She needs to log into `/studio` to actually edit content. Currently the Sanity project (`f63p2zht`) is under your **eddyb** account. Either:
- Add her as a member via sanity.io/manage → Members → Invite (she gets her own login)
- Or transfer project ownership entirely to her once she has a Sanity account

### 11. Sanity API token rotation
The write token currently in `.env.local` appeared briefly in our build chat. Low risk (it's gitignored and only used server-side), but for hygiene: sanity.io/manage → Deep Dives Podcast → API → Tokens → revoke current + add new → paste new token into `.env.local` and Vercel project env vars.

### 12. Form destination email
Even before wiring Resend, decide where contact form messages and signups should ultimately land. Likely her email or a shared inbox.

### 13. Domain DNS hygiene
**Done 2026-05-17.** Both apex and www are `CNAME → cname.vercel-dns.com`, DNS only (grey cloud). Cloudflare's CNAME flattening makes the CNAME-at-apex work. **Do NOT switch back to A records** at `76.76.21.21` even though Vercel's docs show that as the easy path. The Anycast `76.76.21.21` IP has known bad carrier routes on some networks (caused a real "site won't load on my phone" outage during this session). The CNAME path resolves to a wider IP block (`66.33.60.x` + others) with reliable routing.

If you ever want to enable Cloudflare proxy (orange cloud) for global edge caching: SSL mode must be **Full (strict)** before flipping. Vercel cert is already issued and renews automatically, so the original "grey cloud required for SSL issuance" warning no longer applies.

---

## Tier 6 — Nice to have, post-launch

- **Episode chapters / timestamps** — Sanity schema doesn't have a `timestamps` array yet. Could add a portable-text-ish field per episode for chaptered playback.
- **Transcripts** — Sanity field + simple display on episode pages. Big lift, high SEO win.
- **Search** — once she has 30+ episodes worth searching, add Algolia or a simple GROQ text search.
- **"Listen on..." subscribe buttons** — currently YouTube-only. If she ever puts episodes on Spotify/Apple, add the icons + links to the hero or footer.
- **Real photography swap** — once she's comfortable being "the face" of the brand, replace the cropped banner portrait with a proper editorial photoshoot.

---

## What's already done

- ✅ Homepage hero, conversations grid, founder section, community signup CTA
- ✅ `/about`, `/episodes`, `/episodes/[slug]`, `/guests`, `/contact`, `/privacy`, `/terms`
- ✅ Sanity wired with 6 long-form episodes seeded
- ✅ `/studio` embedded for content editing
- ✅ Mobile + tablet + desktop responsive
- ✅ Custom 404 + error pages
- ✅ Sitemap, structured data, OG images for sharing
- ✅ Full favicon + PWA manifest
- ✅ Scroll-reveal animations + micro-interactions
- ✅ Lighthouse 95+ across the board (target)
- ✅ Privacy + Terms placeholder pages

When you ship: smoke-test, then hand her the `/studio` URL + login and watch her face.
