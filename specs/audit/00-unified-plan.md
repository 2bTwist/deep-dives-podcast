# Unified Implementation Plan

**Source:** consolidated punch lists from Phase 1-6 audit docs.
**Goal:** ship every flagged improvement in safe, verifiable batches with rollback points between each.

---

## How this plan is structured

Six batches, ordered by risk (low → high). Each batch:

1. Lists the changes from the audit docs that ship together.
2. Specifies the verification gates that must pass before the next batch.
3. Has an explicit rollback strategy if a gate fails.

After all batches pass, the codebase is fully cleaned per the audit, with screenshot evidence of no regressions.

---

## Decisions needed before starting

These three answers shape the plan. Without them, batch A and F can't fully ship.

| # | Question | Default if no answer |
|---|---|---|
| Q1 | Keep `@portabletext/react` for future Sanity show-notes, or drop? | **Drop** — easier to re-add than to leave dead. |
| Q2 | `react/no-unescaped-entities` lint rule — fix all 32 escapes, or disable the rule project-wide? | **Disable** — rule has near-zero safety value and the team is mixing styles. |
| Q3 | Enable TypeScript `noUncheckedIndexedAccess`? | **No, defer** — quality improvement, not load-bearing. Optional follow-up. |

---

## Verification protocol (used between every batch)

Standard gate (run before declaring a batch done):

```bash
pnpm typecheck           # must pass clean
pnpm lint                # must not introduce new errors vs baseline
pnpm build               # must succeed
node scripts/screenshot.mjs http://localhost:3000/        ./screenshots/audit-home
node scripts/screenshot.mjs http://localhost:3000/about   ./screenshots/audit-about
node scripts/screenshot.mjs http://localhost:3000/episodes ./screenshots/audit-episodes
```

Compare new screenshots against the pre-audit baseline. Any visual difference outside the intended scope of the batch is a regression → roll back.

**Baseline screenshots:** capture once before batch A starts, named `screenshots/audit-baseline-<route>-<viewport>.png`. These are the reference for every subsequent batch comparison.

**Rollback:** since each batch is one git commit, rollback is `git revert <sha>`. If a batch combines multiple commits, the batch revert is `git revert <first>..<last>`.

---

## Batch A — Trivial cleanup (no visible change)

**Scope:** dead code removal, dep cleanup, lint hygiene, knip config. **Zero visible change to any page.**

Changes:
- **D2.** Remove `ambient` constant from `src/lib/motion.ts` (lines 38-40).
- **D3.** Drop `export` keyword from 8 internal-only members:
  - `client` in `src/sanity/lib/client.ts`
  - `ALL_EPISODES_QUERY`, `FEATURED_EPISODE_QUERY`, `EPISODE_BY_SLUG_QUERY`, `EPISODE_SLUGS_QUERY` in `src/sanity/lib/queries.ts`
  - `SITE`, `durationToISO` in `src/lib/seo.ts`
  - `ease` in `src/lib/motion.ts`
- **D1 + Dep2.** Delete `src/sanity/lib/image.ts`. Remove `@sanity/image-url` from `package.json` dependencies.
- **D4 + Dep1.** Remove `server-only` from `package.json` dependencies.
- **D5 + Dep4.** Remove `@portabletext/react` from `package.json` dependencies (per Q1 default).
- **T2.** Delete unused `formatDate` from `src/components/site/ConversationsSection.tsx:8` and `src/app/episodes/page.tsx:24`.
- **D6.** Add `knip.json` at repo root:
  ```json
  {
    "entry": ["src/app/**/page.tsx", "src/app/**/route.ts", "src/app/**/layout.tsx", "scripts/*.mjs"],
    "ignoreDependencies": ["chrome-launcher", "lighthouse", "playwright", "vercel"]
  }
  ```
- **Dep3.** Patch-update `react`, `react-dom`, `motion`. Command: `socket pnpm update react react-dom motion`.

Gate:
- `pnpm typecheck` clean
- `pnpm lint` — 32 errors → 30 errors (2 unused-vars warnings resolved by T2; 32 unescaped-entities, 3 hooks errors still pending later batches)
- `pnpm build` succeeds
- `pnpm knip` shows fewer false positives (validates the new config)
- Screenshot diff against baseline: **zero pixel difference expected.**

Rollback if gate fails: `git revert HEAD`. No state at risk.

**Estimated effort:** 30 min.

---

## Batch B — SEO / routes polish (additive)

**Scope:** add missing schemas, defensive robots tweaks, OG fallback. **Zero visible change to user-facing pages; metadata-only.**

Changes:
- **R3.** Add `breadcrumbSchema` `<JsonLd>` block to `src/app/privacy/page.tsx` and `src/app/terms/page.tsx`.
- **R4.** Change `src/app/episodes/[slug]/page.tsx:41` from `youtubeThumb(ep.youtubeId, "maxres")` → `youtubeThumb(ep.youtubeId, "sd")` for OG card reliability.
- **P1.3 / R1.** Add explicit `robots: { index: false, follow: false }` to `src/app/studio/[[...tool]]/page.tsx` metadata export.
- **P1.4 / R2.** Add `'/api/'` to disallow rules in `src/app/robots.ts` (both `*` rule and each AI bot rule).
- **R5.** (Optional, per Q-not-asked-here) Drop `keywords` array from `src/app/layout.tsx`. Trivial, no impact.

Gate:
- `pnpm typecheck` clean
- `pnpm lint` no new errors
- `pnpm build` succeeds
- `curl http://localhost:3000/robots.txt` shows `/api/` in disallow
- `curl http://localhost:3000/privacy` → grep response for `BreadcrumbList` → confirmed present
- Visual diff: zero (no visible UI change)

Rollback: `git revert <commit>`. Metadata-only changes; trivial revert.

**Estimated effort:** 20 min.

---

## Batch C — File organization (mechanical)

**Scope:** move two files, optionally rename one component. **Zero visible change.**

Changes:
- **P1.1.** Move `src/components/EpisodeThumb.tsx` → `src/components/site/EpisodeThumb.tsx`. Same for `EpisodeThumbStatic.tsx`. Update all 8 import paths.
- **P1.2.** Rename `src/components/site/WhyIStartedSection.tsx` → `src/components/site/AboutTeaserSection.tsx`. Rename the exported component too. Update the one import in `src/app/page.tsx`.

Gate:
- `pnpm typecheck` clean
- `pnpm build` succeeds
- Visual diff: zero

Rollback: `git revert <commit>`.

**Estimated effort:** 15 min.

---

## Batch D — Foundation refactors

**Scope:** make `DropCap` size-aware so future width changes are safe. Tokenize the page max-width. **Visible change expected:** zero, if the default size matches the current behavior.

Changes:
- **F4.** Edit `src/components/site/DropCap.tsx`:
  - Add `size?: "md" | "lg" | "xl"` prop, default `"lg"` (current behavior).
  - `md`: `text-[56px] sm:text-[80px] lg:text-[112px]`
  - `lg`: `text-[64px] sm:text-[96px] lg:text-[144px]` (unchanged from today)
  - `xl`: `text-[80px] sm:text-[120px] lg:text-[180px]`
  - Retrofit `<DropCap letter="C" />` in `src/components/site/ConversationsSection.tsx` to `<DropCap letter="C" size="md" />` (because that h2 is `lg:text-[72px]`).
- **F2.** Tokenize `max-w-[1400px]`:
  - Add to `src/app/globals.css` `@theme inline` block:
    ```css
    --container-content: 1400px;
    --container-content-tight: 1320px;
    ```
  - Replace 42 occurrences of `max-w-[1400px]` with `max-w-[var(--container-content)]`. Use sed across `src/**/*.tsx`.
  - Replace the 2 occurrences of `max-w-[1320px]` in `Hero.tsx` with `max-w-[var(--container-content-tight)]`.

Gate:
- `pnpm typecheck` clean
- `pnpm build` succeeds
- Screenshot diff: **zero visible difference at 1440, 768, 390** for `/`, `/about`, `/episodes`, `/episodes/[slug]`.
- Visual confirmation: Conversations h2 still has the "C" inline beside "onversations" at all viewports.

Rollback: `git revert <commit>`. The token-replacement is a single mechanical change; reverting restores 100% of the prior markup.

**Estimated effort:** 45 min.

**Why this batch is foundational:** after it lands, narrowing the site is one CSS variable change, and the drop cap will scale with the heading. The width experiment from earlier today would have been a 1-line edit.

---

## Batch E — Component extraction

**Scope:** extract two reusable primitives. **Visible change expected:** zero, if extraction preserves markup pixel-for-pixel.

Changes:
- **F1.** Create `src/components/site/EpisodeCard.tsx`:
  - Props: `{ episode: Episode, headingLevel?: 2 | 3, showPlayBadge?: boolean }`
  - Encapsulates: card chrome (`border border-rule bg-card ... hover:border-gold/40`), thumbnail wrapper, hover-grow, play badge (conditional), duration chip, `NewBadge`, category eyebrow, title heading.
  - Replace 4 inline copies in: `ConversationsSection.tsx`, `episodes/page.tsx`, `episodes/[slug]/page.tsx`, `guests/page.tsx`.
  - Each callsite passes `headingLevel` (2 for episodes list, 3 elsewhere) and `showPlayBadge=false` for guests page (per current behavior).
- **F3.** Create `src/components/site/Button.tsx`:
  - Variants: `primary` (gold-filled), `secondary` (gold-outlined).
  - Renders either `<a>` (when `href` is external) or `<Link>` (when internal).
  - Replace 11 gold-filled and 6 gold-outlined inline button sites.
  - Keep the `/episodes` page's YouTube-red CTA inline (it's an intentional one-off variant).

Gate:
- `pnpm typecheck` clean
- `pnpm lint` no new errors
- `pnpm build` succeeds — check `First Load JS` per route doesn't grow more than 1KB (extractions should reduce, not grow)
- Screenshot diff at 1440, 768, 390 for **every route**: `/`, `/about`, `/episodes`, `/episodes/[slug]`, `/guests`, `/contact`. **Pixel diff must be zero** outside intended scope.
- Spot-check: hover an episode card on `/episodes` — same play badge animation as before.
- Spot-check: click "Subscribe on YouTube" in header → same destination + behavior.

Rollback: each extraction is one commit. If F1 breaks, revert just F1; F3 can ship independently.

**Estimated effort:** 2 hrs.

**Risk:** highest in the plan. Card markup duplication has accumulated minor variations across files; one of the 4 callsites might have a tweak that's not obvious. Visual diff is the truth source.

---

## Batch F — Lint cleanup (cosmetic)

**Scope:** address remaining lint errors per Q2 + Q3 decisions.

Changes (per Q2 default = disable):
- **T1.** Add to `eslint.config.mjs`:
  ```js
  {
    rules: { "react/no-unescaped-entities": "off" },
  },
  ```

Or (if Q2 = fix all):
- Run a careful find-replace across `src/**/*.tsx` to convert raw apostrophes and quotes in JSX text to `&rsquo;` / `&ldquo;` / `&rdquo;`. Hand-verify each one didn't break the visible character.

Plus:
- **T3.** Address the 3 `react-hooks/*` errors:
  - Investigate each file (Reveal × 2, Header × 1).
  - If false positive, add `// eslint-disable-next-line react-hooks/<rule>` with a one-line justification comment.
  - If real, restructure.

Gate:
- `pnpm typecheck` clean
- `pnpm lint` → **0 errors, 0 warnings** (or a documented exception list of intentional rule-disables)
- `pnpm build` succeeds
- Visual diff: zero (lint changes shouldn't move pixels)

Rollback: `git revert <commit>`. Cosmetic only.

**Estimated effort:** 20 min (disable path) or 45 min (fix path).

---

## After all batches ship

Run a final post-audit pass:

```bash
pnpm knip       # should show only intentional remainders
pnpm depcheck   # same
pnpm lint       # 0 errors
pnpm typecheck  # clean
pnpm build      # succeeds
```

Capture final screenshots and diff against `audit-baseline` set. The acceptable diff is:
- `WhyIStartedSection` → `AboutTeaserSection` rename: no visual change (component identical).
- ConversationsSection drop cap: may shift slightly if `size="md"` resolves to a different visual size than the implicit current `lg`. Compare and confirm Edmond approves.
- All other routes: pixel-identical.

---

## Total estimated effort

| Batch | Effort | Risk |
|---|---|---|
| A — Trivial cleanup | 30 min | very low |
| B — SEO polish | 20 min | very low |
| C — File organization | 15 min | very low |
| D — DropCap + max-w tokenization | 45 min | low |
| E — Component extraction | 2 hrs | medium |
| F — Lint cleanup | 20-45 min | very low |
| **Total** | **~4 hours** | — |

Half a working day, spread across 6 verifiable commits. Each batch can ship as a separate PR with its own screenshot evidence if you want extra safety.

---

## Order of operations

Strict order: **A → B → C → D → E → F.**

- A first because it's pure cleanup with zero behavior risk.
- B next because SEO is additive only.
- C before D/E because file moves are easier when no other refactor is in flight.
- D before E because `<EpisodeCard>` will use the tokenized max-width and the size-aware `DropCap`.
- E before F because lint will catch issues introduced by extraction.
- F last because lint cleanup is cosmetic and shouldn't interleave with structural changes.

---

## What this plan does NOT include

Out of scope for this audit (handle separately):

- **HeroMic 3D widget** (WIP, separate plan exists at `specs/plans/2026-05-18-groundwork-3d-hero-mic.md`)
- **TypeScript 6 / ESLint 10 major upgrades** (defer until framework support catches up)
- **SEO + AI-SEO audit** (next session, vendored skills in `.agents/skills/`)
- **Accessibility audit** (manual, after SEO)
- **YouTube channel discoverability** (overlaps with SEO audit; will surface website-side levers there)

Ready to start Batch A on your approval.
