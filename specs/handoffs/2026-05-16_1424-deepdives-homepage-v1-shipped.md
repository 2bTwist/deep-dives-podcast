---
date: 2026-05-16T18:24:49Z
git_commit: ad2cc69
branch: main
repository: DeepDive Website
topic: "Deep Dives Podcast homepage v1 shipped; deciding next direction"
tags: [handoff, homepage, deepdives, nextjs16, tailwind4, sanity, design-system]
status: in-progress
last_updated: 2026-05-16
type: handoff
---

**Update after handoff write:** Strengthened `text-gold-shine` utility — wider white highlight band + faster 4s sweep + pulsing halo glow (2.8s). Added `scripts/screenshot-shine.mjs` for element-level animation capture. Committed as `ad2cc69`.

# Handoff: Deep Dives Podcast homepage v1 shipped, deciding next direction

## Task(s)

**Project:** Building a premium dark-luxury website for Edmond's sister's podcast — "Deep Dive Podcast with Raissa" (YouTube @DeepDives237, ~1.18K subs, 260+ videos as of 2026-05-16). It's a **surprise gift** — Edmond does NOT have access to her photos/accounts/bio. All host imagery must be either public YouTube channel content or AI-stylized stand-ins. See auto-memory `project-deepdives` for the full constraint surface.

**Status:** Homepage v1 SHIPPED. All 6 foundation phases + all 5 homepage sections complete. Committed as `bb4a8d7` on `main`. Repo cleaned (screenshots gitignored, refs moved to tracked `reference/refs/`).

**Where we are in the user's workflow:** Foundation → /grill-me → /implement (foundation) → homepage section build → DONE. Now at decision point for next phase.

**Locked decisions from this session:**
- v1 scope = HOMEPAGE ONLY (multi-page deferred)
- YouTube-only distribution (no Spotify/Apple/RSS buttons yet)
- AI-stylized host imagery approved as placeholder — but we ended up using her REAL public YouTube banner photo (cropped) instead, which is better
- Script font = Allura (picked over Pinyon Script / Great Vibes after side-by-side)

## Critical References

1. **Foundation plan:** `specs/plans/2026-05-16-groundwork-deepdives-foundation.md` — 6 phases, all checkboxes ticked except Phase 6 final manual items. Includes Q1–Q12 self-grill revisions inline.
2. **Vision mockup (composition anchor):** `reference/vision-mockup.png` — three-column hero + episodes grid + Why I Started + community CTA + footer. **DO NOT** propose alternative compositions; mockup is locked. See memory `feedback-mockup-is-anchor`.
3. **Auto-memory (load on resume):** `~/.claude/projects/-Users-edmond-Projects-DeepDive-Website/MEMORY.md` indexes 8 entries that capture every load-bearing decision and feedback signal — read it before doing anything visual.

## Recent changes

Single commit `bb4a8d7` on `main`. 46 files. Key changes:

**Foundation (`src/lib/`, `src/app/`):**
- `src/app/layout.tsx` — Playfair Display + Fraunces + Allura via `next/font/google`; metadata with env-based `metadataBase` + OG/Twitter blocks
- `src/app/globals.css` — Tailwind v4 `@theme inline` with full token set (ink #050505, surface #0d0b08 warm-shifted, gold #c8a25d, gold-bright, champagne, paper, muted, sub); `rule-gold` utility; `text-gold-shine` utility with `gold-shimmer` keyframes; SVG film grain on body
- `src/lib/motion.ts` — `fadeUp`, `reveal`, `stagger`, `microHover`, `ambient` presets (motion v12)
- `src/lib/types.ts` — `Episode` shape (currently unused; will feed Sanity schema)
- `src/lib/youtube.ts` — `youtubeThumb` / `youtubeWatchUrl` / `youtubeEmbedUrl` helpers
- `src/components/EpisodeThumb.tsx` — client-fallback (maxres → sd → hq → mq)
- `src/components/EpisodeThumbStatic.tsx` — Server Component, sd-only, used in grid
- `src/app/icon.png` — favicon set to her real D-monogram logo
- `src/app/robots.ts` — disallows /styleguide and /studio
- `src/app/styleguide/page.tsx` + `MotionDemos.tsx` — dev-only design system (env-fenced)

**Homepage sections (`src/components/site/`):**
- `Header.tsx` — sticky top, top gold-bright rule, real D-monogram (white circle), 4-link nav (Episodes/Guests/About/Contact), social icons (custom SVGs since Lucide v1 dropped brand logos), filled-gold Subscribe
- `Logo.tsx` — uses `/brand/raissa-avatar.png` (her real D-monogram)
- `SocialIcons.tsx` — inline YouTube/Instagram/TikTok SVGs (Lucide v1 doesn't ship brand icons)
- `Hero.tsx` — three-column per mockup. Left: "Real Stories. Real People. Real Impact." gold tracked → "Deep Dives" Playfair 88px → "Podcast" Allura 96px gold → "with Raissa" Fraunces italic + Playfair italic "Raissa" with `text-gold-shine` → italic tagline → gold Watch + outline Explore → A/M/T avatar listener proof. Center: real Raissa photo from her banner with edge vignettes. Right: Featured Episode card using real `Y2trutykmrs` episode (You Don't Have the American Dream). Staggered page-load reveal with `useReducedMotion` fallback.
- `ConversationsSection.tsx` — left-col masthead "Conversations *That Matter*" + right-col body+link, then 4-card grid (Solar/Lobbying/Wedding Planner/Voice in Democracy) with real YouTube thumbs and hairline gold dividers between cards
- `WhyIStartedSection.tsx` — bg-surface (warm-shifted). Left: 4:5 portrait of Raissa with bottom-overlay "The Founder" + gold-shine "Raissa" + script "in her own words" + "Host, Creator, @DeepDives237" caption. Right: "About Raissa" eyebrow + "Why I Started *Deep Dives*" headline + 2 paragraphs in HER VOICE (but WRITTEN BY ME, see Placeholders) + "Read My Story →" link. Below: 4 value cards (Real Conversations/Inspiring Guests/Meaningful Impact/A Community) with Lucide icons (Mic/Users/Globe/Heart)
- `CommunitySection.tsx` — gold-tinted card, "Join the conversation *before it airs.*" headline, italic body, email input + ink JOIN THE LIST button, frontend-only with success state
- `Footer.tsx` — 12-col grid: brand col (logo with wordmark + tagline + @DeepDives237) + Explore nav + Listen platforms (YouTube live, Apple/Spotify/RSS placeholder `#`) + bottom row with social + italic copyright

**Data + assets:**
- `src/data/episodes.ts` — 6 REAL episodes pulled from her channel (real video IDs, titles from oEmbed, durations from scrape, categories assigned editorially by me)
- `public/brand/raissa-avatar.png` — her official D-monogram (downloaded from `yt3.googleusercontent.com`)
- `public/brand/raissa-banner.png` — full 2048×339 YouTube channel banner
- `public/brand/raissa-portrait.png` — 200×339 ImageMagick crop of just Raissa from banner (eliminates overlay text)

## Learnings

**Critical Next.js 16 gotchas (caught during build, baked into memory):**
- `images.qualities` defaults to `[75]` only — must explicitly configure for higher (we use `[75, 90]`)
- `images.domains` deprecated → use `images.remotePatterns`
- `_next/image?w=N` only accepts widths in `images.deviceSizes` — w=1280 returns 400. Use 1920 for hero, default deviceSizes for grid.
- Turbopack's HMR can partially-merge `@theme` blocks when you substantially rewrite globals.css — colors define on disk but utility classes don't generate. **Fix:** `rm -rf .next && pnpm dev`. See memory `feedback-turbopack-theme-cache`.

**Lucide v1 (1.16.0) DROPPED brand icons.** No `Instagram`, `Youtube`, etc. (trademark concerns). Use inline SVGs for brand marks (done in `SocialIcons.tsx`).

**YouTube channel scraping via Playwright:**
- ytInitialData JSON in `<script>` tags is the cleanest path but YouTube's data shape varies — fell back to DOM scrape of `a[href*="/watch?v="]` to get IDs
- Titles came back as durations in DOM scrape because the wrong selector matched; use `https://www.youtube.com/oembed?url=…&format=json` to get clean title + author per ID
- Avatar/banner URLs found via fallback scan of ALL `<img>` tags then upgraded via URL transform (`=s160-c-k` → `=s800-c-k`)
- See `scripts/fetch-youtube-videos.mjs` and `scripts/fetch-channel-assets.mjs`

**Banner image crop:** The 2048×339 banner has overlay text wrapping Raissa on both sides ("Subscribe for real talks…" left, "Deep Dive Podcast / with Raissa" pill right). Tight 200×339 crop centered on her at x=875 cleared most text. Edge gradients (`bg-gradient-to-l from-ink/95 …`) on right + left further hide residual. Some "DPDP" ghost still visible at the right edge — Edmond noted but acceptable for v1.

**Visual reference correction mid-session (load-bearing):** User redirected the visual language away from podcast templates (Acquired.fm, Smartless) to luxury media brands (MasterClass, A24, NOWNESS, Kinfolk, Monocle, Apple TV+, Diary of a CEO, TED). Podcast sites are now IA reference only. See memory `feedback-visual-references`. Reference screenshots in `reference/refs/`.

**Editorial typography decisions:**
- Inter is explicitly forbidden by the frontend-design skill (AI-slop tell). Swapped to Fraunces variable serif body. No sans-serif anywhere now.
- All bullet dots (`•`) before category labels and all gold-rule prefixes (`<span className="rule-gold w-X" />`) before eyebrows REMOVED — user explicitly hated them ("the dashes at the side thing"). Trust typography to carry the eyebrow alone.
- Font-mono labels REMOVED — swapped to Fraunces tracked uppercase.
- `Raissa` everywhere uses `text-gold-shine` utility (metallic gradient + shimmer) per user feedback "she should glow or glitter".

**Workflow pacing:** User explicitly does NOT want pauses between programmatic /implement phases — chain through, only pause for real human judgment (visual review, taste picks, env setup, destructive ops). See memory `feedback-no-phase-pauses`.

**Playwright was already available locally** via `npx playwright` even though no Playwright MCP was wired. Installed as devDep + chromium, screenshot pipeline at `scripts/screenshot.mjs`. No MCP needed.

## Artifacts

**Plans + handoffs:**
- `specs/plans/2026-05-16-groundwork-deepdives-foundation.md` (foundation plan, 6 phases all completed)
- `specs/handoffs/2026-05-16_1424-deepdives-homepage-v1-shipped.md` (this file)

**Auto-memory (8 entries, ALL load-bearing):**
- `~/.claude/projects/-Users-edmond-Projects-DeepDive-Website/MEMORY.md`
- `memory/project_deepdives.md` — surprise gift context, YouTube-only, AI-stylized imagery approved
- `memory/feedback_build_quality_bar.md` — Framer-tier finish, Playwright verify between sections
- `memory/feedback_no_phase_pauses.md` — chain phases straight through, no courtesy pauses
- `memory/feedback_turbopack_theme_cache.md` — rm -rf .next when @theme tokens don't apply
- `memory/feedback_visual_references.md` — MasterClass/A24/Kinfolk visual refs, podcast sites IA-only
- `memory/feedback_mockup_is_anchor.md` — vision-mockup.png IS the composition, don't propose alternatives
- `memory/feedback_brand_should_pop.md` — vibrant + distinctive, not safe-restrained; gold filled not just outline

**Source code (all new in commit bb4a8d7):**
- `src/app/{layout.tsx,globals.css,page.tsx,robots.ts,icon.png}`
- `src/app/styleguide/{page.tsx,MotionDemos.tsx}`
- `src/components/{EpisodeThumb.tsx,EpisodeThumbStatic.tsx}`
- `src/components/site/{Header.tsx,Logo.tsx,SocialIcons.tsx,Hero.tsx,ConversationsSection.tsx,WhyIStartedSection.tsx,CommunitySection.tsx,Footer.tsx}`
- `src/lib/{motion.ts,types.ts,youtube.ts}`
- `src/data/episodes.ts`

**Dev tools (`scripts/`, all kept, JSON outputs gitignored):**
- `screenshot.mjs` — homepage screenshots at 390/768/1440 to `screenshots/<name>/`
- `screenshot-refs.mjs` — captures the 8 reference sites at 1440
- `screenshot-hero.mjs` — focused hero-only screenshot
- `fetch-youtube-videos.mjs` — scrapes @DeepDives237 for video IDs (writes `scripts/youtube-videos.json`, gitignored)
- `fetch-channel-assets.mjs` — fetches avatar + banner URLs

**Reference materials (tracked):**
- `reference/vision-mockup.png` — north-star composition
- `reference/youtube-banner.png` — raw banner before public/ copy
- `reference/refs/` — 8 reference site screenshots (masterclass, a24, nowness, kinfolk, monocle, diaryofaceo, ted, appletv)

**Public assets:**
- `public/brand/raissa-avatar.png` — official D-monogram (also used as favicon)
- `public/brand/raissa-banner.png` — full YouTube banner
- `public/brand/raissa-portrait.png` — 200×339 ImageMagick crop of Raissa from banner

**Background process state (probably gone after fresh session):** Dev server was running on port 3000 via `pnpm dev` (background ID `bbino75wb`). To restart: `pnpm dev`.

## Action Items & Next Steps

User asked me at end of session: "Which?" — referring to which direction to take next. Options I surfaced, in rough priority order:

1. **Build `/episodes` listing page** (HIGHEST visible win) — episode cards in `ConversationsSection.tsx` link to YouTube directly today, but the "All Episodes →" link in that section + the EPISODES nav link both go to `/episodes` which 404s. Building this completes the primary browsing flow. Reuse `EpisodeThumbStatic`, the same card pattern as ConversationsSection, but with category filters per the original ChatGPT brief (Entrepreneurship / Finance / Relationships / Career / Faith / Creativity / Immigrant Journeys).

2. **Wire up Sanity** — schema TS shape exists in `src/lib/types.ts`. Use the Sanity MCP (already active in session, see memory) to programmatically create the project (`whoami` → `list_organizations` → `create_project` → `create_dataset`). Then build `sanity.config.ts` + `src/sanity/{env.ts,lib/{client,live}.ts,schemas/episode.ts}` + `src/app/studio/[[...tool]]/page.tsx` per the canonical agent-toolkit pattern. Swap `src/data/episodes.ts` for live `sanityFetch` queries. Must do before reveal so Raissa can edit content.

3. **Tighten remaining hero/visual items:**
   - "DPDP" ghost still faintly visible on right edge of Raissa hero photo despite edge vignette
   - `<Link href="/about">` for "Read My Story" + "About" nav + Footer "About" all 404 today
   - Value-card copy in WhyIStarted is mine, not hers
   - "10,000+ listeners" proof in hero is aspirational (real ~1.18K)
   - Body copy in WhyIStarted is in her voice but written by me — needs Edmond's real source or her bio

4. **Build `/about` page** — both the nav and the Read My Story link target this. Same composition logic as WhyIStarted but more elaborate.

5. **AI-stylized portrait swap** — when Edmond generates an AI portrait in ChatGPT, drop in to replace `/brand/raissa-portrait.png` and update the `objectPosition` in `Hero.tsx:line~104` and `WhyIStartedSection.tsx:line~38`.

6. **Episode detail pages `/episodes/[slug]`** — episodes have slugs in `src/data/episodes.ts` but no pages yet. Hero with YouTube embed, key topics, timestamps, related episodes. Per original ChatGPT brief.

7. **Guests page, Clips page placeholder, Contact form** — additional pages from original ChatGPT brief, lower priority.

**Decisions still needed from user (DON'T ask without making the reasonable call first):**
- Use Sanity MCP to create the project, or wait for him to do it manually? (Recommend: use the MCP — it's wired up and avoids the manual `sanity init` step)
- For `/episodes` listing — full-fat with category filters now, or simple grid first? (Recommend: simple grid first, filters in a polish pass)

## Other Notes

**Repo cleanup at end of session:**
- All iteration screenshots deleted; `screenshots/` is now gitignored
- `scripts/*.json` gitignored (intermediate scrape data — `youtube-videos.json` was the only one)
- Reference screenshots moved to tracked `reference/refs/`
- Commit `bb4a8d7` is the clean baseline

**Single previous commit `f057cbb` is the auto-generated "Initial commit from Create Next App" — only adjust if absolutely needed.**

**User pacing notes (load-bearing for next session):**
- Edmond gets frustrated by over-confirmation. Make the call and continue.
- Edmond gets frustrated when references I cite turn out to be made-up. Don't fabricate biographical detail. (I fabricated "Atlanta" as her city based on the 237 Cameroon area code earlier — got called out, removed.)
- Edmond's design eye is sharp on small details: he flagged bullets, mono fonts, gold-rule prefixes, and lack of pop in one session. Take his visual feedback at face value and apply broadly across components.
- He prefers shipping > polishing in isolation. Build + screenshot + iterate beats build-perfect-in-the-dark.

**Skills that have been used this session:** `groundwork`, `grill-me`, `implement`, `compact`, `frontend-design:frontend-design`. The last one is critical — load it before any visual work resumes.

**Memory write convention:** All project memory goes into `~/.claude/projects/-Users-edmond-Projects-DeepDive-Website/memory/` with frontmatter + body, indexed in `MEMORY.md`. Don't write new memory entries for ephemeral state; reserve for load-bearing decisions and feedback patterns.

**Dead ends ruled out this session:**
- Tried to find a Dribbble MCP / API — Dribbble API is partner-only since 2020, no MCP available. Replaced with Playwright screenshots of named reference sites.
- Tried `bg-gradient-to-br` soft gradients on episode-card placeholders — user called them "weird blur," removed entirely. Solid `bg-ink` cards with hairline-gold dividers replaced them.
- Tried "Section 01 — chapter" eyebrow framing → too college-essay → swapped to plain numerals "01" / "02".
- Tried to pre-pick a script font (Pinyon Script from memory) → had to backtrack to load all 3 candidates and let user pick (he chose Allura). Lesson: when you can't render fonts mentally, defer the pick to the styleguide screenshot.
