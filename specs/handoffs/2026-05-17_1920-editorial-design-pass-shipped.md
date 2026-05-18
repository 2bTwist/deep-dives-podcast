---
date: 2026-05-17T23:20:51Z
git_commit: 776f656
branch: main
repository: DeepDive Website
topic: "Editorial design pass (drop caps + personality + iteration polish) shipped; brand fonts reverted to swap; SEO + AI-SEO skills vendored"
tags: [handoff, design, typography, perf, seo, dropcaps, dns-fix, fonts]
status: in-progress
last_updated: 2026-05-17
type: handoff
---

# Handoff: Editorial design pass shipped + brand fonts reverted

## Task(s)

**Just pushed (3 commits, `776f656` HEAD, on `main`, Vercel auto-deploying):**

1. `c0c8cb2 Design: editorial pass (drop caps + personality moments + polish)` — Phase 1 + Phase 2 + iteration fixes.
2. `97b06fc Perf: revert brand fonts from display:optional to display:swap` — fixes the cold-load wrong-fonts behavior Edmond saw on his phone.
3. `776f656 Chore: vendor SEO + AI-SEO skills, loosen screenshot script wait` — installed `addyosmani/seo` + `coreyhaines31/ai-seo`; screenshot script no longer times out on dev's HMR.

**Verification expected in the next 24-48h:** Vercel Speed Insights p75 LCP / INP / CLS from real users. Need to compare to the baseline `1a2d434` perf log (best LCP 2.4s, median 3.7s, ERD 137ms). Expecting modest LCP regression (~100-200ms) from the font-display revert.

**In-flight earlier in session, also done:** DNS migration from A records (`76.76.21.21` Anycast) to CNAME flattening (`cname.vercel-dns.com`) on Cloudflare — fixed the "site won't load on my phone" outage caused by carrier-route to that specific Anycast IP. Both apex and `www` records now CNAME, DNS-only (grey cloud). Captured in `specs/POST_REVEAL_TODO.md` Tier 5 #13.

## Critical References

1. **`specs/plans/2026-05-17-editorial-design-pass.md`** — full research, options considered, decisions made. Phase 1 (typography) + Phase 2 (personality) done; brand-font swap done; Phase 3/4 are explicit non-goals per Edmond ("no brand changes").
2. **`specs/POST_REVEAL_TODO.md`** — Tier 1-6 of remaining work, with status updates at the top reflecting today's session (Sanity CORS done, GitHub App done, DNS fix done, Speed Insights live, LH CI armed, OG to JPG, font display:optional then reverted).
3. **`specs/perf-log.md`** — perf baseline before/after the LCP fix session. Compare new measurements against this.

## Recent changes

### New components (Phase 2 + Phase 1 primitive)
- `src/components/site/DropCap.tsx` — oversized italic Playfair initial, floats left, accepts `color="gold"|"ink"`. Used everywhere across the site as the section anchor.
- `src/components/site/NewBadge.tsx` — slanted gold "NEW" stamp, auto-hides for episodes >14 days old. Default position bottom-right of thumbnail. Used on Hero featured card, ConversationsSection cards, /episodes cards, /guests cards, /episodes/[slug] related cards.
- `src/components/site/PullQuote.tsx` — oversized Allura curly opening quote (`&ldquo;` at 120-160px gold/55%) hung in margin, big italic Playfair body. Used in /about manifesto + WhyIStartedSection.
- `src/components/site/HandSignature.tsx` — Allura "Raissa" 64-80px with hand-drawn-feeling SVG underline path (cubic bezier `M 3 8 C 28 4, 62 11, 96 5 S 158 9, 197 6`). Used once below /about manifesto.

### Component file deleted (built then yanked)
- `src/components/site/DateStamp.tsx` — postal MAR/04 stamp was built and applied site-wide, Edmond said "remove it." File deleted, all usages stripped.
- `src/components/site/SectionMarker.tsx` — earlier "N° 02" volume marker primitive was built, Edmond rejected the `N°` convention specifically, picked Variant 7 (drop cap) from an 8-option comparison page. File deleted.

### Section-by-section edits (drop caps applied everywhere)
- `src/components/site/Hero.tsx:30,113-118,134` — killed "Real Stories…" kicker, killed Vol.03/2026 stamp, replaced "Featured Episode" with `Latest episode · {date}`.
- `src/components/site/Hero.tsx` — also imports + uses NewBadge on the featured card.
- `src/components/site/ConversationsSection.tsx:24` — drop cap on "Conversations / That Matter", NewBadge on every episode card, deleted the bottom-card date line.
- `src/components/site/WhyIStartedSection.tsx:61,89-93,104` — killed "The Founder" kicker, drop cap on "Why I Started / Deep Dives", PullQuote splits the body copy.
- `src/components/site/CommunitySection.tsx:31,34` — drop cap on "Join the conversation / before it airs." in INK color (not gold) because the section's panel is bg-gold.
- `src/app/about/page.tsx` — killed 2 kickers, drop cap on hero h1 + 3 section h2s, PullQuote + HandSignature in manifesto. Topics grid (7 items in 3 cols) gets 2 filler `<div bg-surface>` cells to cover the empty-grid brown-box issue.
- `src/app/episodes/page.tsx` — drop cap on h1, drop cap on archive h2, killed `{count} episodes` footnote (drop cap replaces it), **completely rebuilt bottom CTA section** into a single centered button with YouTube-red hover transformation, DateStamp removed, NewBadge added.
- `src/app/episodes/[slug]/page.tsx` — drop cap on "More" related section, killed "About this episode" sidebar label (description now spans full-width), kept `{ep.category}` kicker because it's real metadata. NewBadge on related cards.
- `src/app/guests/page.tsx` — drop cap on hero + 2 sections, voices grid gets filler cells (same 7-in-3 problem as about), DateStamp removed, NewBadge added.
- `src/app/contact/page.tsx`, `src/app/privacy/page.tsx`, `src/app/terms/page.tsx` — drop cap on each page hero.

### Cross-cutting fixes
- **Column gap** (`src/app/{about,contact,episodes,guests,privacy,terms}/page.tsx` + `src/app/episodes/[slug]/page.tsx` + `src/components/site/ConversationsSection.tsx`): bulk sed-replaced `lg:col-span-4 lg:col-start-9` → `lg:col-span-5 lg:col-start-8` (and `col-span-6 col-start-7` → `col-span-7 col-start-6`). Removes the empty middle column that made subtitles feel disconnected from titles.
- **Em-dash sweep**: 30+ instances removed from rendered copy across `src/app/**` and `src/components/site/**`. Page titles use `|`, body uses periods/commas/parens. PullQuote attribution uses `·`. Logo aria-label uses comma.
- **Page title duplication** fix: each page's `metadata.title` trimmed from `"Page | Deep Dive Podcast with Raissa"` to just `"Page"`. Layout template at `src/app/layout.tsx:42` appends `| Deep Dives Podcast`. Browser tab now reads `Episodes | Deep Dives Podcast` instead of triple-pipe.
- **Inline "More episodes" CTA readability** (`src/components/site/ConversationsSection.tsx:39`, `src/components/site/WhyIStartedSection.tsx:111`, `src/app/episodes/[slug]/page.tsx:94`): 14px (was 12), tracking 0.14em (was 0.28), always gold, persistent gold underline, brighter on hover, arrow slides farther.
- **YouTube CTA on /episodes** (`src/app/episodes/page.tsx:96-118`): killed the heavy bottom section, single centered gold-outline button with YouTube-red play triangle in rounded square. Hover: full red fill, white text, triangle inverts to red-on-white, scale-up 1.03, red glow shadow. SVG uses `fill-[#ffffff] group-hover:fill-[#ff0000]` explicitly (currentColor inheritance was unreliable across the group-hover boundary).
- **YouTube red token** added to `src/app/globals.css:22`: `--color-youtube: #ff0000`. Used as `text-youtube` for the word "YouTube" in italic title spans, `bg-youtube` for hover backgrounds, `border-youtube` for hover borders.
- **OG image** previously PNG→JPG (`public/og.jpg` 109K vs `og.png` 317K) and unused banner moved to `reference/`.

### Brand-fonts revert (the cold-load fix)
- `src/app/layout.tsx:5-29`: Playfair, Fraunces, Allura all switched from `display: "optional"` → `display: "swap"` with implicit preload enabled. Trade documented in commit `97b06fc` body. Real-user p75 will show in Vercel Speed Insights within 24-48h.

### Tooling
- `.agents/skills/seo/` — `addyosmani/web-quality-skills@seo` (21.6K installs, Chrome team)
- `.agents/skills/ai-seo/` — `coreyhaines31/marketingskills@ai-seo` (54.7K installs)
- `.agents/skills/core-web-vitals/` — already vendored from earlier session
- `skills-lock.json` updated with new entries
- `scripts/screenshot.mjs:21-22`: `waitUntil: 'domcontentloaded'` + 1500ms hydration sleep. Original `'networkidle'` never settled on dev because of HMR websocket → screenshot runs timed out every time. This fix is committed.

## Learnings

- **`display: optional` is wrong for brand-led sites.** On cold devices, the font loses the 100ms race → fallback sticks for the entire pageview, no swap. Repeat visits cache the font and look fine. But first-time impressions show wrong fonts — exactly the opposite of what you want for a brand-led podcast. **Trade-off:** `swap` costs ~100-200ms of synthetic LCP for guaranteed brand fidelity. For Deep Dives, brand wins. The Lighthouse CI we set up will flag if regression is severe.
- **Anycast IP `76.76.21.21` (Vercel's old apex recommendation) has carrier-route issues.** Edmond's iPhone couldn't reach it from home WiFi or cellular while my Mac on same WiFi could. Fix is Cloudflare CNAME flattening to `cname.vercel-dns.com` which resolves to the modern `66.33.60.x` + `216.198.x.x` blocks with better global routing. Captured in `POST_REVEAL_TODO.md` Tier 5 #13 with a loud "do NOT switch back" warning.
- **No em dashes in site copy** is now a durable preference (memory: `feedback-no-em-dashes-site-copy.md`). Applies to ALL rendered text — titles, body, alt, aria, attribution strings. Use periods/commas/parens/pipes/middle-dots instead.
- **Drop caps with `float-left` need `clear-both`** after the title to prevent body copy from wrapping around the cap. Pattern: `<span className="clear-both block" />` immediately before closing the heading.
- **CSS Grid with `gap-px bg-rule` exposes parent bg in empty cells.** With 7 items in 3 cols, the trailing 2 cells show the parent's `bg-rule` (gold-on-surface composite = brown box). Fix: render explicit filler `<div bg-surface>` for the missing cells via `(3 - (items.length % 3)) % 3`.
- **`fill="currentColor"` on SVG doesn't reliably cascade across group-hover boundaries.** Edmond saw the play triangle disappear in the hover state because parent's `hover:text-paper` competed with child's `group-hover:text-youtube`. Fix: explicit `fill-[#ffffff] group-hover:fill-[#ff0000]` on the SVG directly.
- **Playwright MCP's hover + screenshot can't reliably capture the active `:hover` state.** Confirmed the CSS is correct in compiled output (`grep bg-youtube` in `.next/static/chunks/*.css`), but `browser_hover` + `browser_take_screenshot` shows the resting state. For hover verification, trust the compiled CSS or test in a real browser.
- **`pnpm dev | head -20` wedges the dev server** after head closes its stdin. Next.js blocks on the broken pipe. Always start dev server with `nohup pnpm dev > /tmp/log 2>&1 &` or full output capture.
- **Playwright in MCP Docker can't reach `localhost:3000` on host** — use `host.docker.internal:3000`. Project's own `scripts/screenshot.mjs` uses Playwright on the host (not in Docker), so `localhost:3000` works there.
- **Edmond's "regular feedback loop" expectation:** he wants verification at every step (build + screenshot + present), not just at major checkpoints. Tonight he reminded me twice. Don't ship without screenshot review.

## Artifacts

### New / modified components
- `src/components/site/DropCap.tsx` (new)
- `src/components/site/NewBadge.tsx` (new)
- `src/components/site/PullQuote.tsx` (new)
- `src/components/site/HandSignature.tsx` (new)
- `src/components/site/Hero.tsx` (modified)
- `src/components/site/ConversationsSection.tsx` (modified)
- `src/components/site/WhyIStartedSection.tsx` (modified)
- `src/components/site/CommunitySection.tsx` (modified)
- `src/components/site/Logo.tsx` (modified, aria-label em dash → comma)
- `src/components/site/Header.tsx` (modified, em dash → period)
- `src/components/site/ContactForm.tsx` (modified, em dash → comma)

### Pages
- All `src/app/**/page.tsx` modified for drop caps + title trimming + em-dash removal + (where applicable) filler grid cells.
- `src/app/layout.tsx` — font display revert.
- `src/app/globals.css:22` — `--color-youtube` token.
- `src/app/error.tsx`, `src/app/not-found.tsx` — em-dash sweep.

### Docs
- `specs/plans/2026-05-17-editorial-design-pass.md` (new) — full design plan with research, alternatives, decisions.
- `specs/POST_REVEAL_TODO.md` (modified, updates section at top reflects today's progress + the do-not-switch-back DNS warning).
- `specs/perf-log.md` (unchanged this round, ready for next measurement).

### Tooling
- `.agents/skills/seo/SKILL.md` (new, Addy Osmani SEO)
- `.agents/skills/ai-seo/SKILL.md` (new, Corey Haines AI-SEO) + references/
- `skills-lock.json` updated
- `scripts/screenshot.mjs` waitUntil change

### Memory (auto-memory dir)
- `~/.claude/projects/-Users-edmond-Projects-DeepDive-Website/memory/feedback-no-em-dashes-site-copy.md` (new)
- `~/.claude/projects/-Users-edmond-Projects-DeepDive-Website/MEMORY.md` (updated)

### Live URLs to verify after Vercel deploy lands
- https://deepdives237.com (apex, via Cloudflare CNAME → Vercel)
- https://www.deepdives237.com (www, same)
- https://deep-dives-podcast.vercel.app (Vercel direct)
- https://vercel.com/2btwists-projects/deep-dives-podcast (dashboard for deploy status, Speed Insights, env vars)

## Action Items & Next Steps

**Immediate (when Edmond gets back to the keyboard or his phone):**

1. **Verify the deploy landed.** `curl -sI https://deepdives237.com/ | grep x-vercel-id` should show a fresh edge ID. Or visit the live site on a fresh tab.
2. **Cold-load test on his phone.** Real device, real cold cache (or private/incognito tab). Confirm Playfair + Fraunces + Allura all render correctly without needing a refresh. This is the regression we just shipped a fix for.
3. **Hover the YouTube CTA on `/episodes`** (live or via dev). Should turn YouTube red with white text and red triangle on white square, scale up, red glow. If it doesn't, dig into compiled CSS for `bg-youtube` / `hover:bg-youtube` matches.
4. **Browser tab title check.** Should read `Episodes | Deep Dives Podcast` (single pipe), `About | Deep Dives Podcast`, etc. If it shows a doubled name, the per-page `metadata.title` still has the full string somewhere I missed.
5. **Re-measure perf.** `node scripts/lh.mjs https://deepdives237.com` 3 times for median. Compare to `specs/perf-log.md` baseline (best 2.4s LCP, median 3.7s). Expect a 100-300ms LCP regression from the font-display:swap revert; if it's worse, investigate.
6. **Lighthouse CI workflow** — was added in earlier commit `1d4c09e`. Should fire on the next PR. Won't fire on direct pushes to main (by design).

**Next session priorities (Edmond named these explicitly):**

1. **SEO skill application.** Both `.agents/skills/seo/` and `.agents/skills/ai-seo/` are vendored. Read both SKILL.md, then apply to the site:
   - Per-page meta descriptions audit (some are duplicated, e.g. /episodes uses the site-wide description).
   - JSON-LD coverage check — `src/lib/seo.ts` has PodcastSeries + PodcastEpisode + Breadcrumb. May be missing Person (for Raissa), Article (for the about/manifesto), or other entity types.
   - Sitemap completeness (`src/app/sitemap.tsx`) — verify all routes listed.
   - Canonical URLs per page.
   - Alt-text audit on all images.
2. **AI SEO (`llms.txt` etc.).** New standard for AI crawlers (Perplexity, ChatGPT search, Claude search). Add `/public/llms.txt` describing the site's content to AI models. The `ai-seo` skill should have the format spec.
3. **Resend wiring** (Tier 3 in `POST_REVEAL_TODO.md`). Edmond needs to sign up at resend.com first, then drop `RESEND_API_KEY` + `CONTACT_INBOX_EMAIL` in `.env.local` + Vercel. I have the code path ready — `src/app/api/contact/route.ts` and `src/app/api/subscribe/route.ts` need to be created, then update `src/components/site/ContactForm.tsx` and `src/components/site/CommunitySection.tsx` to fetch them instead of the fake setTimeout submit.

**Pre-reveal punch list (from session #24 audit):**

1. Real-device test on Edmond's phone (critical — he had multiple issues today).
2. `NewBadge` smoke-test by temporarily setting an episode's `publishedAt` to today in Sanity Studio. Verify it renders correctly.
3. 404 + error page live tests (visit a bad URL, intentionally break a route).
4. The Subscribe → button in the Header — verify the link actually goes somewhere useful (probably https://www.youtube.com/@DeepDives237?sub_confirmation=1).
5. Vercel Speed Insights p75 data after 24-48h of traffic.

**Operational (Edmond, manual):**

1. Sanity write token rotation (token leaked in chat history earlier; gitignored and server-side only so low risk).
2. Invite Raissa as Sanity member when ready to hand off `/studio` post-reveal.

**Post-reveal (Raissa input required, will not block):**

1. Real bio copy on `/about`, `WhyIStartedSection`, value cards.
2. Real episode descriptions in Sanity Studio (currently placeholders by me).
3. AI-stylized portrait swap if she wants one.
4. Privacy + Terms legal review.

## Other Notes

- **Sanity MCP disconnected** during this session. Doesn't block anything since I've been editing schema/data through code path (`scripts/seed-sanity.mjs`), not the MCP. If it's needed for the SEO work next session, re-add via /mcp.
- **Edmond gets frustrated when I don't verify in the feedback loop.** He explicitly called it out tonight: "make sure you verify all these things in our regular feedback loop." Build + screenshot + send + wait for confirmation is the rhythm. Don't ship more than ~3 changes without screenshotting back.
- **He doesn't want over-indexing on the Cameroon/diaspora context** even though he shared it. The design should be brand-correct and editorial, NOT decorated with cultural motifs. He pulled me back from this twice. Lean on universal editorial design instead.
- **NEW badge auto-hides for old episodes.** The full catalog is currently >14 days old so you won't see any NEW badges on the live site right now. This is correct behavior. To verify rendering, temporarily edit an episode's `publishedAt` in Sanity Studio.
- **Bundle audit done earlier in session:** homepage ships 155KB compressed total, the 4MB Sanity Studio chunk is route-split to `/studio` only. Already-clean — don't re-audit unless something added a heavy dep.
- **The `feedback-no-em-dashes-site-copy.md` memory file** ensures I won't reintroduce em dashes in future copy. Apply to any new strings — body, titles, alt, aria.
- **Hover screenshot capture via Playwright MCP is unreliable** (the SVG hover-fill issue we just fixed needed real-browser verification, not MCP). When iterating on hover states, ask Edmond to verify live rather than trying to capture via MCP.
- **Old `screenshots/` directories** cleaned up earlier in session — 7 folders kept (live-home, live-about, mobile-menu, studio, v1-detail, v1-episodes, v1-guests). The newer screenshots/phase1-typography, /phase2, /youtube-cta, /iteration-check, etc. are also gitignored. The folder is purely local — never bundled, never committed.
