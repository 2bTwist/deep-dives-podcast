# Perf deep pass — 2026-05-17

Goal: get real-user mobile LCP under **2.5s** (Google "Good" threshold) and eliminate the "server stopped responding" Safari errors. Every recommendation cites the installed `core-web-vitals` skill (Addy Osmani / Chrome team) or a measured number.

## Current state (verified this session)

- Server is healthy: TTFB 60-100ms from US, page weight 155KB compressed across 16 chunks. Not a server problem.
- Vercel deploys single-region (`iad1`, Virginia). No QUIC advertised. DNS via Cloudflare grey-cloud.
- Lighthouse mobile against live site (4G + 4x CPU throttle): **Perf 85 / LCP 3.9s / FCP 1.8s / TBT 40ms / CLS 0**. LCP element = `<span>Deep Dives</span>` h1, element render delay 2136ms.
- Already shipped this session (3 commits, not yet deployed): Fraunces+Allura → `display:optional`, Speculation Rules on hover, OG image PNG→JPG (-208KB).
- Images: brand assets go through `next/image` → WebP. OG is now JPG. Favicons PNG (correct).
- Bundle: homepage 155KB. Sanity Studio 4MB but route-split to `/studio` only.

## Skills consulted

- `addyosmani/web-quality-skills@core-web-vitals` (installed at `.agents/skills/core-web-vitals/`) — Chrome team perf guidance, 6.8K installs. Used for LCP checklist, INP patterns, Speculation Rules.

## What's good — leave alone

- `src/app/layout.tsx:5-29` — fonts now consistent on `display:optional`, Playfair preloaded, others not. Matches Addy's "fonts don't block text rendering" rule.
- `src/components/site/Hero.tsx` — pure server component, no JS gating LCP h1.
- `next.config.ts` — `optimizePackageImports: ['lucide-react']`, image qualities set.
- All images flow through `next/image` (verified: zero raw `<img>` tags in `src/`).
- `.gitignore` covers screenshots, lighthouse reports, script JSON caches.

## Phases (ordered by impact/effort ratio)

### Phase 0 — Deploy what's already on main, re-baseline

**Why.** We have three perf commits sitting locally. Until they ship, the current Lighthouse number is meaningless. Step 1 of any perf work is "measure the thing you have."

**Steps.**
1. `vercel --prod` (3 perf commits + 2 chore commits ride along).
2. Wait for deploy to be HIT-cached: hit the URL twice.
3. Run `node scripts/lh.mjs https://deepdives237.com --out=lh-postdeploy.json` three times. Take the median LCP. Compare to the 3.9s baseline.
4. Open the live URL on Edmond's iPhone over home WiFi. Note actual perceived load. Does it still feel "horrible"?

**Verification.**
- [ ] Median LCP from 3 runs documented in `specs/perf-log.md` (new file).
- [ ] Mobile Safari feel test: "yes/no/somewhat" snappier.

**Effort.** 10 min.

**Trigger.** Now.

**Decision gate.** If median LCP ≤ 2.5s AND mobile feels good: stop, ship Phase 1 only for safety. If LCP > 2.5s OR mobile still feels bad: continue to Phase 2+.

---

### Phase 1 — Wire real-user monitoring (RUM)

**Why.** Lighthouse synthetic lies. The skill: *"Lab data and field data both matter — field data tells you what users actually experience."* We have no field data. Vercel Speed Insights is free on Hobby, drop-in, gives p75 LCP/INP/CLS from real visits.

**Reference.** `@vercel/speed-insights` package — official, MIT, 1.x stable.

**Files.**
- `src/app/layout.tsx` (add `<SpeedInsights />` in body)
- `package.json` (add dep)

**Steps.**
1. `socket pnpm add @vercel/speed-insights`
2. Import and mount in `layout.tsx` body.
3. Confirm it pings `/_vercel/speed-insights/script.js` post-deploy.
4. Wait 24-48h, check the Vercel dashboard for the first real-user numbers.

**Verification.**
- [ ] Build succeeds, no console errors.
- [ ] Network tab on prod shows the SI ping on page load.
- [ ] After 48h: at least one real-user data point in Vercel dashboard.

**Effort.** 15 min.

**Trigger.** Ship in same deploy as Phase 0.

---

### Phase 2 — Preload the hero portrait image

**Why.** The hero portrait is the second-largest element on the home page. On slow connections it can compete for LCP with the h1, and even if it doesn't win, decoding it late causes visual jitter. Skill checklist item: *"LCP image preloaded with fetchpriority='high'."* Currently we have `priority` on `next/image` but no explicit preload link.

**Reference.** Chrome docs: `<link rel="preload" as="image" fetchpriority="high">` is the canonical pattern.

**Files.**
- `src/app/layout.tsx` (`<head>` — but only on home; needs route-aware solution OR per-page metadata)
- Better: `src/app/page.tsx` — add `<link rel="preload">` via a small server component, or use Next 16's `preload()` from `react-dom`.

**Steps.**
1. Use `import ReactDOM from 'react-dom'; ReactDOM.preload('/brand/raissa-portrait.png', { as: 'image', fetchPriority: 'high' });` at top of `app/page.tsx`.
2. Confirm via the served HTML that the `<link rel="preload">` appears.

**Verification.**
- [ ] `curl --compressed https://deepdives237.com/ | grep preload` shows portrait preload tag.
- [ ] Lighthouse "LCP request discovery" audit goes green.

**Effort.** 30 min.

**Trigger.** After Phase 0 measurement confirms LCP > 2.5s.

---

### Phase 5 — Cache-Control for warm edge

**Why.** Current `Cache-Control: public, max-age=0, must-revalidate` means every browser visit does a 304 round-trip to Vercel before showing the page. For a content site that changes ~weekly, this is excessive. Setting `s-maxage` lets Vercel's edge serve warm copies without a revalidation hop.

**Reference.** Vercel docs on ISR + `revalidate`. Next.js App Router: `export const revalidate = 300` on a route caches at edge for 5 minutes.

**Files.**
- `src/app/page.tsx`, `src/app/episodes/page.tsx`, `src/app/about/page.tsx`, etc. — add `export const revalidate = 300` (or 3600 for less-changing pages).

**Steps.**
1. Add `export const revalidate = 300` to home + episode list (changes when new episode publishes).
2. Add `export const revalidate = 3600` to about/guests/contact/privacy/terms (rarely change).
3. Deploy, verify `x-vercel-cache: HIT` shows up on second request, and `Cache-Control` header includes `s-maxage`.

**Verification.**
- [ ] `curl -sI deepdives237.com | grep cache` shows `s-maxage=300`.
- [ ] Two rapid hits both show `x-vercel-cache: HIT`.

**Effort.** 30 min.

**Trigger.** Ship with Phase 2.

---

### Phase 6 — Lighthouse CI on PRs

**Why.** We just fought a regression that wasn't a regression (the handoff claimed LCP element-render-delay was 150ms; current measurement is 2136ms — either it never was 150ms, or it regressed silently). A perf budget enforced by CI prevents this. Skill checklist principle: *"Set perf budgets and fail builds that exceed them."*

**Reference.** `treosh/lighthouse-ci-action` (8K stars, GitHub Action, free for public repos and Edmond's private one).

**Files.**
- `.github/workflows/lighthouse.yml` (new)
- `lighthouserc.json` (new — budgets)

**Steps.**
1. Add workflow that runs on PRs targeting `main`.
2. Set budgets: LCP < 2.5s, TBT < 200ms, CLS < 0.1.
3. Fail the PR check if any budget is exceeded.

**Verification.**
- [ ] First PR after this lands triggers the workflow.
- [ ] Intentionally-bad PR fails the budget check.

**Effort.** 2hr.

**Trigger.** After Vercel GitHub App is connected (current blocker — manual deploys today).

---

### Phase 7 — Cloudflare proxy (orange cloud) — DEFER

**Why.** Was ruled out during initial deploy because Vercel's auto-SSL needed grey-cloud DNS. Now that the cert is issued and renews automatically, proxying through Cloudflare with SSL mode "Full (strict)" is safe and adds 300+ global edge PoPs. Benefit limited for US-only audience; bigger if/when Raissa attracts international listeners.

**Trigger.** Only revisit if real-user data (Phase 1) shows international users with poor LCP. Don't enable on speculation.

---

## Out of scope

- **Dropping or swapping any brand font (Playfair, Fraunces, Allura).** Non-negotiable per Edmond. Plan only ships perf wins that preserve the typography exactly as-is.
- **Service worker / offline mode.** Overkill for a content site.
- **Hosting platform switch.** Vercel is correct for Next 16 App Router. Cloudflare Pages or Netlify would not change LCP meaningfully.
- **HTTP/3 (QUIC) tuning.** Vercel doesn't advertise QUIC currently. Out of our hands.
- **Rebuilding without Next.js.** No.
- **Eliminating Sanity.** Studio is route-split, doesn't affect homepage. Editing UX is worth the 4MB on `/studio` route only.

## Verification protocol (applies to every phase)

After each phase:
1. `node scripts/lh.mjs https://deepdives237.com` × 3, record median.
2. Open on iPhone, fresh Safari tab, note perceived load.
3. Log result in `specs/perf-log.md` with commit hash + median LCP + subjective note.

No phase ships without measurement before and after.

## Hand-off

Run `/grill-me` against this plan if anything feels weak or hand-wavy.
Then `/implement specs/plans/2026-05-17-perf-deep-pass.md` to execute Phase 0.
