# Phase 6 — Type Safety & Build Health

**Method:** read `tsconfig.json`, count type-system bypasses, run `pnpm typecheck`, `pnpm lint`, `pnpm build`. Look at the output for warnings being silently ignored, route generation modes, bundle signals.

---

## 1. TypeScript config

`tsconfig.json`:

| Setting | Value | Status |
|---|---|---|
| `strict` | `true` | ✓ |
| `target` | `ES2017` | ✓ (matches Next 16) |
| `module` / `moduleResolution` | `esnext` / `bundler` | ✓ |
| `jsx` | `react-jsx` | ✓ |
| `paths` | `@/* → ./src/*` | ✓ |
| `skipLibCheck` | `true` | ✓ standard for app code |
| `isolatedModules` | `true` | ✓ |
| `incremental` | `true` | ✓ |

Strictness flags **NOT** enabled but worth considering:
- `noUncheckedIndexedAccess` — would force `undefined` checks on array index access
- `noUnusedLocals` / `noUnusedParameters` — eslint already covers this with warnings
- `noImplicitReturns` — would catch missing return paths

**Recommendation:** consider adding `noUncheckedIndexedAccess`. It catches a class of bugs where you assume an array has elements. Not a P0 — just a quality improvement.

---

## 2. Type-system bypass counts

| Marker | Count | Where |
|---|---|---|
| `: any`, `as any`, `<any>` | **0** | — |
| `@ts-ignore` | **0** | — |
| `@ts-expect-error` | **0** | — |

**Zero bypasses across the entire `src/` tree.** This is the strongest signal in the entire audit — the team (you) writes proper types or stops to figure them out. That's rare and worth saying.

---

## 3. Typecheck

`pnpm typecheck` (= `tsc --noEmit`): **passes clean.** Zero errors, zero warnings.

---

## 4. Lint

`pnpm lint`: **37 problems (35 errors, 2 warnings).** Breakdown:

| Rule | Count | Severity | Notes |
|---|---|---|---|
| `react/no-unescaped-entities` | 32 | error | Raw `'` and `"` in JSX text (e.g. `doesn't`, `she's`). |
| `@typescript-eslint/no-unused-vars` | 2 | warning | `formatDate` defined but unused in `ConversationsSection.tsx:8` and `episodes/page.tsx:24` |
| `react-hooks/set-state-in-effect` | 2 | error | Calling `setState` synchronously inside `useEffect` |
| `react-hooks/purity` | 1 | error | Calling an impure function during render |

### `react/no-unescaped-entities` (32 errors)

The codebase mixes two styles for apostrophes/quotes:
- HTML entities: `doesn&rsquo;t`, `she&rsquo;ll` — passes lint
- Raw characters: `doesn't`, `she'll` — fails lint

About a third of the JSX text uses raw characters. Mass fix is a series of careful find-replaces, or disable the rule (some projects do). The escape-required behavior is React's default — `react/no-unescaped-entities` is a sanity check that's mostly cosmetic but the team has been mixing styles.

**Recommendation:** either fix all 32 (one PR) or **disable the rule project-wide** if you don't care. The rule has near-zero safety value when `react-jsx` is on. I'd lean: disable it. Edmond can decide.

### Hooks errors (3) — worth understanding

These are surfacing because Next 16 / `eslint-config-next` ships a new `react-hooks` plugin with stricter rules from React 19's compiler era. They're not classic bugs — they're modern-best-practice hints:

1. **`Reveal.tsx:28` — set-state-in-effect.** Inside the `useEffect`, when `prefers-reduced-motion` is true, we call `setShown(true)`. The lint rule wants this derived from state instead of imperatively set. Genuine pattern: derive `shown` from a media-query state. **But:** Reveal is exactly the kind of "set state once on mount based on a side-effect" that effects are for. The rule is over-eager here. Either suppress with a comment or restructure.

2. **`Reveal.tsx:53` (or similar)** — same rule on the IO callback setting `shown`. Same analysis.

3. **`Header.tsx:17`** — `usePathname()` at the top of the component is fine, but the `isActive` helper reads `pathname` (closed-over via React hook return) inside what the linter considers render-time computation. Most likely a false positive too, but I'd need a close read of the exact line the rule fires on.

**Recommendation:** read each of the 3 carefully, decide per-case to either (a) suppress with a justified comment, (b) restructure, or (c) accept and move on. None look like real bugs.

### Unused `formatDate` (2 warnings)

`src/components/site/ConversationsSection.tsx:8` and `src/app/episodes/page.tsx:24` both define a `formatDate(iso)` helper that returns a "Mon DD, YYYY" string. Neither file calls it anymore — likely dead code from when the episode cards showed publish dates. The recent commit `68a91d3 Tweak: dial latest-episode card slightly smaller, drop duplicate date` removed the date display. The helper definitions are leftover.

**Recommendation:** delete both. Trivial.

---

## 5. Build

`pnpm build`: **succeeds.** Route generation summary:

```
○  Static    /, /about, /contact, /guests, /privacy, /terms, /styleguide,
             /studio, /not-found, /icon.png, /apple-icon.png, /manifest,
             /robots.txt, /sitemap.xml
●  SSG       /episodes, /episodes/[slug] (6 paths pre-rendered)
ƒ  Dynamic   /api/revalidate
```

Revalidate timers correctly assigned (5m for content-driven routes, 1h for evergreen). Episodes pre-rendered at build time via `generateStaticParams`. API route correctly dynamic.

No build warnings. No font fallback warnings. No image-optimization warnings.

---

## 6. Bundle signals

`pnpm build` output (route table) doesn't print KB sizes in Next 16's default output, but `Hero` includes the new `HeroMic` 3D widget (WIP) which uses Three.js — that bundle will dominate the home `First Load JS`. Out of audit scope (skipping WIP), but flag for the unified plan: **measure home bundle size after the 3D hero lands.**

---

## 7. Punch list

| # | Item | Effort | Impact |
|---|---|---|---|
| T1 | Decide on `react/no-unescaped-entities` — fix all 32 or disable the rule | 30 min (fix) or 30 sec (disable) | low — cosmetic |
| T2 | Delete unused `formatDate` from `ConversationsSection.tsx` + `episodes/page.tsx` | 2 min | trivial |
| T3 | Read + resolve 3 `react-hooks/*` errors (Reveal × 2, Header × 1) | 20 min | low — likely false positives, but worth confirming |
| T4 | (Optional) enable `noUncheckedIndexedAccess` in tsconfig + fix fallout | 30 min | medium — long-term safety |
| T5 | (Tracking, not action) Measure home First Load JS after `HeroMic` 3D widget ships | — | — |

Phase 6 conclusion: **type safety is excellent (zero bypasses, strict on), build is clean, lint has surface noise (mostly entity escapes).** The hooks rule hits are noteworthy but appear to be false positives from a new plugin version. The codebase is in very good shape on this dimension.

---

## All-phases summary appears in `00-unified-plan.md` next.
