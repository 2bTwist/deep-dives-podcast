# Phase 4 — Dependency Hygiene

**Tooling:** `depcheck` + `pnpm outdated`. Cross-referenced with Phase 3 (`knip`) findings.

---

## 1. Depcheck output (classified)

### Unused dependencies (real)
| Package | Reason | Action |
|---|---|---|
| `@portabletext/react` | No portable-text rendering. Likely for future show-notes. | **Ask Edmond** |
| `server-only` | Runtime SSR guard, no imports. | **Remove** |
| `@sanity/image-url` | Only consumer is `src/sanity/lib/image.ts` (also unused per Phase 3). | **Cascade-remove with `image.ts`** |

### Unused devDependencies (false positives all)
All of these were flagged but verified-used:

| Package | Why flagged | Why kept |
|---|---|---|
| `@tailwindcss/postcss` | No `import` of it | Loaded via `postcss.config.mjs` — required for Tailwind v4 |
| `tailwindcss` | No `import` of it | Required for Tailwind v4 (consumed by `@tailwindcss/postcss`) |
| `@types/node` | No direct import | Auto-included by TypeScript |
| `@types/react-dom` | No direct import | Auto-included by TypeScript |
| `depcheck`, `knip` | Tools, not imports | Used as CLI tools (just ran them) |
| `vercel` | No imports | CLI for deploys |

Plus knip's own false positives (`chrome-launcher`, `lighthouse`, `playwright`) for scripts. None of these need action — they're framework hooks and CLI tools.

---

## 2. Stack vs CLAUDE.md spec

Cross-checked the actual installed versions against the project's `CLAUDE.md` declared stack:

| Per CLAUDE.md | Actual installed | Match? |
|---|---|---|
| Next.js 16.2.6 | `next@16.2.6` | ✓ |
| Tailwind v4 | `@tailwindcss/postcss@^4`, `tailwindcss@^4` | ✓ |
| Motion (formerly framer-motion) v12 | `motion@^12.38.0` | ✓ |
| next-sanity + sanity | `next-sanity@^12.4.5`, `sanity@^5.25.1` | ✓ |
| Allura script font | Configured in `globals.css` | ✓ |
| Pinned React/Next (no caret on those two) | `react: 19.2.4`, `next: 16.2.6` | ✓ |

Stack matches the documented spec perfectly. No drift.

---

## 3. Outdated deps

`pnpm outdated`:

| Package | Current | Latest | Severity | Risk |
|---|---|---|---|---|
| `react` | 19.2.4 | 19.2.6 | patch | none — bug-fix patch |
| `react-dom` | 19.2.4 | 19.2.6 | patch | none — pairs with react |
| `motion` | 12.38.0 | 12.39.0 | patch | none |
| `@types/node` | 20.19.41 | 25.9.0 | **major** | Likely fine — @types/node tracks Node LTS, project is on Node 22, types from 20 still cover that surface. **Stay on 20.** |
| `eslint` | 9.39.4 | 10.4.0 | **major** | ESLint 10 may have breaking changes to flat config. Project uses flat config (`eslint.config.mjs`). Needs upgrade plan, not a one-line bump. |
| `typescript` | 5.9.3 | 6.0.3 | **major** | TS 6 has breaking changes. Next.js 16 supports TS 5.x officially. **Hold until Next 17 or until TS 6 support is announced.** |

### Recommended upgrades
- **Safe to apply now:** `react`, `react-dom`, `motion` (all patch). `socket pnpm update react react-dom motion`.
- **Hold:** TypeScript 6, ESLint 10 (major), @types/node 25 (no benefit at our Node version).

---

## 4. Dependency surface health

### Production deps (13 total)
All justified. Notable:
- `@sanity/icons`, `@sanity/vision`, `sanity`, `next-sanity` — Sanity studio + client. Real.
- `@vercel/speed-insights` — used in `layout.tsx` at line 119. Real.
- `lucide-react` — used by `WhyIStartedSection` (4 icons). Real.
- `motion` — used by `MomentsStack`, `ContactForm`. Real.

### DevDeps (14 total)
All justified.
- `@tailwindcss/postcss`, `tailwindcss`, `postcss` chain — framework.
- `typescript`, `@types/*`, `eslint`, `eslint-config-next` — typecheck + lint.
- `playwright`, `chrome-launcher`, `lighthouse` — scripts.
- `vercel` — deploy CLI.
- `knip`, `depcheck` — added this audit; should stay for ongoing hygiene.

---

## 5. Security note

`pnpm` ignores install scripts globally on this machine (per Edmond's security-defaults). Verified: no postinstall surprises from new deps. The 2026-05-13 supply-chain hardening posture is intact.

The `socket pnpm` prefix was used for installing `knip` + `depcheck`. ✓

---

## 6. Punch list

| # | Item | Effort | Risk | Notes |
|---|---|---|---|---|
| Dep1 | Remove `server-only` dep | 1 min | none | confirmed zero importers |
| Dep2 | Remove `@sanity/image-url` (cascade with `image.ts` from Phase 3) | 1 min | none | only consumer is dead file |
| Dep3 | Patch-update `react`, `react-dom`, `motion` | 2 min | very low | semver-compatible patches |
| Dep4 | Decide `@portabletext/react` — keep for future show-notes, or drop? | (Edmond's call) | none | — |
| Dep5 | Pin ESLint 10 / TypeScript 6 as **out of scope** for this audit | 0 min | n/a | document; revisit when Next 17 / framework support catches up |

Phase 4 conclusion: **dependency tree is healthy.** Three real unused (one pending decision), one trivial patch sweep, no major version traps right now. The biggest risk is the TypeScript/ESLint major waits, but those are conscious-deferral decisions, not problems.

Proceed to Phase 5 (routing & metadata).
