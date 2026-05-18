# Phase 3 — Dead Code & Dead Exports

**Tooling:** `knip` (default config) ran against the full repo. Output below was verified by hand for every flag — knip false-positives are filtered out.

**Scope reminder:** auditing `src/`. Scripts and config files (out of audit scope) are noted only where they collide with src concerns (e.g. `image.ts` ↔ `@sanity/image-url` dep).

---

## 1. Raw knip output (classified)

Knip flagged 13 unused files, 8 unused deps, 9 unused exports, 1 unused type. Each one verified by hand:

### Files
| Path | Knip says | Verified | Real status |
|---|---|---|---|
| `scripts/*.mjs` (×12) | unused | yes | **False positive** — CLI entry points, not modules. Knip can't see `node scripts/X.mjs` invocations. Need knip config to whitelist. |
| `src/sanity/lib/image.ts` | unused | yes | **TRUE DEAD** — exports `urlFor()` Sanity image-URL builder. Zero importers. Architecture uses YouTube thumbnails instead. |

### Dependencies
| Package | Knip says | Real status |
|---|---|---|
| `@portabletext/react` | unused | **TRUE UNUSED** — no portable-text rendering anywhere. Likely earmarked for future episode show-notes. **Keep if planned, remove if not.** |
| `@sanity/image-url` | unused | **TRUE UNUSED** — only consumer was `image.ts` (also dead). Cascade-removable. |
| `server-only` | unused | **TRUE UNUSED** — runtime SSR-boundary guard, was once imported in `client.ts` probably, dropped. Safe to remove. |
| `chrome-launcher` | unused | **False positive** — used by `scripts/lh.mjs`. |
| `depcheck` | unused | **False positive** — installed for Phase 4 of this audit. Not yet invoked. |
| `lighthouse` | unused | **False positive** — used by `scripts/lh.mjs`. |
| `playwright` | unused | **False positive** — used by all `scripts/screenshot-*.mjs`. |
| `vercel` | unused | **False positive** — `vercel` CLI for deploys, not an import. |

### Exports (knip-classified "unused")
All nine of these were verified by grep:

| Export | File | Reality |
|---|---|---|
| `client` | `src/sanity/lib/client.ts:4` | Only used internally by `sanityFetch` in the same file. **Remove `export` keyword** — internal-only. |
| `ALL_EPISODES_QUERY` | `src/sanity/lib/queries.ts:22` | Used by `getAllEpisodes()` in same file. **Remove `export`**. |
| `FEATURED_EPISODE_QUERY` | `queries.ts:29` | Used by `getFeaturedEpisode()` in same file. **Remove `export`**. |
| `EPISODE_BY_SLUG_QUERY` | `queries.ts:36` | Used by `getEpisodeBySlug()` in same file. **Remove `export`**. |
| `EPISODE_SLUGS_QUERY` | `queries.ts:42` | Used by `getEpisodeSlugs()` in same file. **Remove `export`**. |
| `SITE` | `src/lib/seo.ts:7` | Used 9× internally by schema builders in same file. **Remove `export`**. |
| `durationToISO` | `src/lib/seo.ts:22` | Used by `podcastEpisodeSchema()` in same file. **Remove `export`**. |
| `ease` | `src/lib/motion.ts:1` | Used by `fadeUp`, `reveal`, `microHover` in same file. **Remove `export`**. |
| `ambient` | `src/lib/motion.ts:39` | **TRUE DEAD** — defined, exported, zero callers anywhere. Decorative motion preset that fell out of use. |

### Types
| Type | File | Reality |
|---|---|---|
| `EpisodeCategory` | `src/lib/types.ts:1` | Used internally in `types.ts` as `Episode.category` field. Knip doesn't see "uses for typing within same file" as a consumer. **Keep export** — useful as a public type for `topics` arrays in routes if/when they're typed. Safe to mark in knip config as `entry` if we don't want re-flags. |

---

## 2. What's actually dead

After filtering false positives, the actual dead code is small:

### Code to delete
1. `src/sanity/lib/image.ts` — entire file (9 lines). Unused.
2. `ambient` constant in `src/lib/motion.ts` — 2 lines (definition only). Unused.

### `export` keywords to drop (internal-only members)
3. `client` in `client.ts`
4. `ALL_EPISODES_QUERY`, `FEATURED_EPISODE_QUERY`, `EPISODE_BY_SLUG_QUERY`, `EPISODE_SLUGS_QUERY` in `queries.ts`
5. `SITE`, `durationToISO` in `seo.ts`
6. `ease` in `motion.ts`

### Dependencies to remove (after #1 lands)
7. `@sanity/image-url` (cascade after `image.ts` deletion)
8. `server-only` (zero importers)

### Dependencies to evaluate
9. `@portabletext/react` — not used, but Sanity show-notes may be planned. **Ask user: keep or drop?**

### Tooling fix
10. Add a `knip.json` whitelisting scripts as entries, plus their deps:
```json
{
  "entry": ["src/app/**/page.tsx", "src/app/**/route.ts", "src/app/**/layout.tsx", "scripts/*.mjs"],
  "ignoreDependencies": ["chrome-launcher", "lighthouse", "playwright", "vercel"]
}
```
Without this, every future knip run re-surfaces the 5 false-positive devDeps + 12 script files.

---

## 3. Bonus discoveries

### `WhyIStartedSection`'s `lucide-react` icons may be over-broad

`WhyIStartedSection.tsx` imports `Mic, Users, Globe, Heart` from `lucide-react` for the 4 value cards. The Next.js compiler tree-shakes lucide-react well so bundle impact is minimal, but worth confirming the icons render where intended (per Phase 1 flag, this section is now a *teaser* — does it still have the 4-card grid, or is that part also stale?). Spot-check shows yes, the 4 cards still render. Not dead, just contextually mismatched per Phase 1 punch.

### Two screenshot scripts may be one-shot iterations

`scripts/screenshot-hero.mjs`, `screenshot-mobile-menu.mjs`, `screenshot-moments.mjs`, `screenshot-portrait-swap.mjs`, `screenshot-refs.mjs`, `screenshot-shine.mjs` — these read like single-feature iteration scripts from past design passes. None are currently invoked by package.json or CI. They have archival value but if the user wants a leaner `scripts/` directory, several could be deleted. **Out of audit scope** (audit covers `src/`), but worth a "yes/no/keep" pass when we clean up.

### No commented-out code blocks found

Spot-checked every component and route — no large `/* */` or `//` blocks of disabled code. Clean.

### No `TODO`/`FIXME` rot

Found 2 TODOs:
- `ContactForm.tsx:26` — `TODO: wire to Resend / Formspree / Supabase. Frontend-only for now.`
- `CommunitySection.tsx:15` — `TODO: wire to Resend / ConvertKit / Supabase. Frontend-only for now.`

Both are intentional placeholders awaiting Edmond's "after the reveal" decision on form backend. Not rot. Keep.

---

## 4. Punch list

Grouped by what they affect:

| # | Item | Effort | Impact | Risk |
|---|---|---|---|---|
| D1 | Delete `src/sanity/lib/image.ts` + remove `@sanity/image-url` dep | 5 min | trivial | none (no callers) |
| D2 | Remove `ambient` from `motion.ts` | 1 min | trivial | none |
| D3 | Demote 8 unnecessary exports to internal (`client`, 4× `*_QUERY`, `SITE`, `durationToISO`, `ease`) | 10 min | tidy | none |
| D4 | Remove `server-only` dep | 1 min | trivial | none |
| D5 | Decide `@portabletext/react` — keep or remove | 1 min | depends | (Edmond's call) |
| D6 | Add `knip.json` config so false positives stop reappearing | 5 min | low | none |

Total real cleanup: **under 30 minutes**. None of these can break runtime — they're all "things that already aren't used."

**Note for the unified plan:** D1-D4 + D6 can ship as a single PR after the bigger fixes (F1-F4 from Phase 2). They're trivial cleanup and benefit from running after the structural changes, not before.

Phase 3 conclusion: **the repo has almost no dead code.** Two real files of code to remove, ~10 lines total. The rest is just `export` keywords that point at internal-only members. Healthy codebase.

Proceed to Phase 4 (dependency hygiene with `depcheck`).
