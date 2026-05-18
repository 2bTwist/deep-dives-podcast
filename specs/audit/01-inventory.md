# Phase 1 — Inventory & Organization

**Scope:** all of `src/`. **Skipped:** `HeroMic.tsx`, `HeroMicCanvas.tsx`, `HeroMicSkeleton.tsx` (uncommitted WIP for `specs/plans/2026-05-18-groundwork-3d-hero-mic.md`).

**Method:** read-only walk of every `.ts`/`.tsx`/`.css` file under `src/`, then targeted spot-checks for naming, placement, fencing, and missing client markers. No code changes.

---

## 1. File map

### `src/app/` — routes, metadata, styles

```
src/app/
├── layout.tsx                 root layout
├── page.tsx                   home
├── globals.css                tokens + base
├── error.tsx                  global error boundary
├── not-found.tsx              404
├── manifest.ts                PWA manifest
├── robots.ts                  robots
├── sitemap.ts                 sitemap
├── api/
│   └── revalidate/route.ts    Sanity → cache bust webhook
├── about/page.tsx
├── contact/page.tsx
├── episodes/
│   ├── page.tsx               list
│   └── [slug]/page.tsx        detail
├── guests/page.tsx
├── privacy/page.tsx
├── terms/page.tsx
├── studio/[[...tool]]/page.tsx     Sanity studio (catch-all)
└── styleguide/
    ├── page.tsx                    dev-only design system
    └── MotionDemos.tsx             colocated demo components
```

10 public pages, 1 dev-only (`styleguide`), 1 embedded studio, 1 API route, 4 metadata files. Reasonable surface.

### `src/components/` — shared UI

```
src/components/
├── EpisodeThumb.tsx           used by Hero, episodes pages, guests page
├── EpisodeThumbStatic.tsx     used by ConversationsSection
└── site/
    ├── CommunitySection.tsx
    ├── ContactForm.tsx
    ├── ConversationsSection.tsx
    ├── DropCap.tsx
    ├── Footer.tsx
    ├── HandSignature.tsx
    ├── Header.tsx
    ├── Hero.tsx
    ├── JsonLd.tsx
    ├── Logo.tsx
    ├── MomentsStack.tsx
    ├── NewBadge.tsx
    ├── PullQuote.tsx
    ├── Reveal.tsx
    ├── SocialIcons.tsx
    └── WhyIStartedSection.tsx
```

### `src/lib/` — utilities

```
src/lib/
├── motion.ts                  motion presets (fadeUp, microHover)
├── seo.ts                     schema + site constants
├── types.ts                   Episode + EpisodeCategory
└── youtube.ts                 thumbnail URL helpers
```

### `src/sanity/` — CMS

```
src/sanity/
├── env.ts                     dataset/project id from env
├── lib/
│   ├── client.ts              sanity client
│   ├── image.ts               image URL builder
│   └── queries.ts             GROQ queries
├── schemaTypes/
│   ├── episode.ts             episode schema
│   └── index.ts               schema barrel
└── structure.ts               studio structure
```

---

## 2. Naming conventions

The codebase has an **implicit `Section` suffix rule** that I want to make explicit before phase 2 starts auditing duplication.

**Components with `Section` suffix** — full-width home-page blocks, one per home concept:
- `CommunitySection`
- `ConversationsSection`
- `WhyIStartedSection`

**Components without suffix** — three sub-categories:
- Layout chrome: `Header`, `Footer`, `Hero`
- Editorial primitives: `DropCap`, `PullQuote`, `HandSignature`, `Reveal`, `NewBadge`
- Standalone widgets: `ContactForm`, `JsonLd`, `Logo`, `MomentsStack`, `SocialIcons`

This is consistent and readable. Keep the rule. No changes recommended here.

---

## 3. Flags

### F1. `EpisodeThumb*` files sit outside `src/components/site/`  (impact: low)

`EpisodeThumb.tsx` and `EpisodeThumbStatic.tsx` live at `src/components/`, while everything else lives at `src/components/site/`. Every other shared component is under `site/`. The flat-vs-nested split has no apparent reason — both files are imported by `site/` components (`Hero`, `ConversationsSection`) and by route pages (`episodes/`, `guests/`).

**Why it matters:** newcomers (and future-you) have to learn two places to look. Inconsistency invites more inconsistency.

**Options:**
- (a) Move both into `src/components/site/`. One folder, one rule. Cheap.
- (b) Promote `src/components/episodes/` as a domain bucket (would need >1 episode-related component to justify).
- (c) Leave it — accept the split and document the rule somewhere.

**Recommendation:** (a). Cheapest, no future ambiguity.

### F2. `WhyIStartedSection` name no longer matches its current job  (impact: low)

The component name implies the section CONTAINS the "why I started" narrative. After the About-page rework, the actual narrative lives on `/about` (the "Letter from Raissa"). On the home page, `WhyIStartedSection` is now a **teaser** that links to About. The name overstates what's in the box.

**Why it matters:** future-you reads `WhyIStartedSection` in the home file and expects the full narrative. Actual content is "portrait + 1 short paragraph + Read my story →".

**Options:**
- (a) Rename to `AboutTeaserSection` / `HostTeaserSection` / `RaissaTeaserSection`.
- (b) Leave it, accept the historical name.

**Recommendation:** (a), if the rename has no other ripples. Will verify in phase 2 (component audit) whether the body inside this component still does anything narrative-y or is purely a teaser.

### F3. Studio route has no `noindex`  (impact: low)

`src/app/studio/[[...tool]]/page.tsx` is the embedded Sanity studio. It re-exports `metadata` from `next-sanity/studio`, which may or may not include `robots: { index: false }` — needs verification. The styleguide is fenced both by `notFound()` in non-dev AND by `robots: { index: false }`. Studio is fenced by Sanity auth, but search engines can still see the route exists.

**Why it matters:** small SEO leak. Studio URL doesn't need to appear in search results.

**Recommendation:** add explicit `metadata.robots = { index: false, follow: false }` to the studio page, regardless of what `next-sanity/studio` exports.

### F4. `studio` is disallowed in robots.ts but `styleguide` only via metadata  (impact: trivial)

`src/app/robots.ts` disallows `/styleguide` and `/studio` for all bots and AI bots. The styleguide also has `robots: { index: false, follow: false }` in metadata. Double-belted, fine.

But: the **API route** `src/app/api/revalidate/route.ts` is not disallowed. Probably fine (it's POST-only) but worth verifying that GET/HEAD on it doesn't 200.

**Recommendation:** add `/api/` to the robots disallow list as a defensive default.

### F5. `MotionDemos.tsx` is colocated with its route  (impact: trivial — pattern call)

`src/app/styleguide/MotionDemos.tsx` lives next to the page that uses it. This is fine in Next.js App Router (private colocation), and it's only used by one page. But the project convention is "shared components live in `src/components/`" — there's no `src/components/styleguide/` precedent.

**Why it matters:** small pattern call. Either:
- (a) Document "demo-only components can be colocated with their route" as a rule.
- (b) Move to `src/components/styleguide/MotionDemos.tsx` for consistency.

**Recommendation:** (a) — the file is private to one page, colocating is what Next.js wants. Just write the rule down so future-you doesn't second-guess it.

### F6. `src/components/` has only the two flat `EpisodeThumb*` files outside any subdir (impact: dup of F1)

Same flag as F1, restated from the components-tree angle.

---

## 4. What looks healthy

These came up clean and don't need any change:

- All `.tsx` files with `useState`/`useEffect`/`onClick` already declare `"use client"`. No missing markers across the tree.
- `src/lib/` is genuinely lib code — no kitchen-sink `utils.ts`, no mystery exports. Four files, four clear purposes.
- `src/sanity/` is laid out per next-sanity convention.
- `src/app/globals.css` is 115 lines, contains the `@theme` block (per CLAUDE.md) — not a 3000-line dump.
- No duplicate type declarations across `lib/types.ts` and route files (only one `Episode` definition).
- `src/app/styleguide/` is env-fenced (`notFound()` if `NODE_ENV !== "development"`) AND robots-disallowed.

---

## 5. Out of scope (saved for later phases)

- **Component duplication / reuse** — phase 2 (e.g., do `EpisodeThumb` and `EpisodeThumbStatic` overlap meaningfully?).
- **Dead exports** — phase 3.
- **Dep hygiene** — phase 4.
- **Route metadata consistency** (each page's `metadata`, `revalidate`, `JsonLd`) — phase 5.
- **Type safety** (`any`, `@ts-ignore` counts) — phase 6.

---

## 6. Punch list from this phase

Ordered by impact. Each item is one decision plus a small edit; nothing here is structural.

| # | Item | Impact | Effort |
|---|---|---|---|
| 1 | Move `EpisodeThumb.tsx` + `EpisodeThumbStatic.tsx` into `src/components/site/`, update imports | low | trivial |
| 2 | Rename `WhyIStartedSection` → `AboutTeaserSection` (verify in phase 2 first) | low | trivial |
| 3 | Add explicit `robots: { index: false }` to studio metadata | low | trivial |
| 4 | Add `/api/` to robots.ts disallow | trivial | trivial |
| 5 | Document the "colocated demo components" rule somewhere (CLAUDE.md or AGENTS.md) | trivial | trivial |

Nothing in this list is load-bearing. Phase 1 conclusion: **organization is healthy.** No scattered concerns, no missing client markers, no surprise utility dumps. The two flat `EpisodeThumb*` files are the only real inconsistency and it's a 5-minute cleanup.

Proceed to phase 2.
