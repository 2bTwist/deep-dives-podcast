@AGENTS.md

# Deep Dives Podcast — project CLAUDE.md

Premium website for "Deep Dive Podcast with Raissa" (YouTube @DeepDives237). **Surprise gift for Edmond's sister** — see auto-memory `project-deepdives` for the load-bearing constraints (no real photos, AI-stylized host imagery only, YouTube-only distribution).

## Stack quick reference

- **Next.js 16.2.6** (App Router, Turbopack default) — `params`/`searchParams` are `Promise`-typed, `images.remotePatterns` is required, `next/legacy/image` deprecated, `next lint` removed. See `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` before writing Next-specific code.
- **Tailwind v4** — tokens live in `src/app/globals.css` `@theme inline` block. No `tailwind.config.js`. `@tailwind` directives replaced by `@import "tailwindcss"`. Default border color is `currentColor` (always specify).
- **Motion (formerly framer-motion) v12** — `import { motion } from 'motion/react'`. Use `fadeUp` and `microHover` presets from `src/lib/motion.ts`. Respect `useReducedMotion`.
- **next-sanity** + **sanity** — embedded studio pattern, wired post-homepage.

## Design tokens (single source of truth)

`src/app/globals.css` `@theme inline` block:

| Class | Hex | Use |
|---|---|---|
| `bg-ink` / `text-ink` | `#050505` | Page background (neutral near-black) |
| `bg-surface` | `#0d0b08` | Section bg (warm-shifted) |
| `bg-card` | `#111111` | Cards |
| `bg-deep-gray` | `#171717` | Subtle surfaces |
| `text-gold` / `bg-gold` | `#c8a25d` | Primary accent (8.62:1 vs ink — AAA) |
| `text-gold-bright` | `#e4b84f` | Hover/active accent (11.20:1) |
| `text-champagne` | `#e5d0a2` | Soft accent (13.42:1) |
| `text-paper` | `#ffffff` | Primary text (20.4:1) |
| `text-muted` | `#a7a7a7` | Secondary text (8.61:1) |
| `border-border` | `rgb(255 255 255 / 0.08)` | Standard borders |

Fonts: `font-display` (Playfair Display), `font-sans` (Inter), `font-script` (currently aliased to Allura — final pick TBD on `/styleguide`).

## Quality bar — verification protocol

Per auto-memory `feedback-build-quality-bar`: **every section must be screenshot-verified before moving on.** Bar is "Framer-tier, not an inch vibe-coded."

For each section built:
1. Build the section
2. Open in browser via Playwright MCP at three viewports: **390px (mobile), 768px (tablet), 1440px (desktop)**
3. Screenshot each viewport
4. Compare against `reference/vision-mockup.png` (desktop) and a mental responsive model (mobile/tablet)
5. Edmond reviews. Reject + iterate if anything feels generic. Don't move on until signed off.

For section-internal motion/interaction: also verify `prefers-reduced-motion` behavior in DevTools.

## Workflow phase pacing

Per auto-memory `feedback-no-phase-pauses`: chain `/implement` phases through programmatic work without pausing. Only pause for real human-judgment (visual review, taste picks, environment setup, destructive ops). Foundation phases are not sections — sections (header/hero/etc.) DO trigger the per-viewport screenshot review above.

## Where things live

- **Plan:** `specs/plans/2026-05-16-groundwork-deepdives-foundation.md`
- **Design tokens:** `src/app/globals.css`
- **Motion presets:** `src/lib/motion.ts`
- **Episode TypeScript shape:** `src/lib/types.ts`
- **YouTube helpers:** `src/lib/youtube.ts`
- **YouTube thumbnail components:** `src/components/EpisodeThumb{,Static}.tsx`
- **Design system showcase:** `src/app/styleguide/page.tsx` (dev-only, env-fenced + robots-disallowed)
- **North-star design:** `reference/vision-mockup.png`

## Commands

- `pnpm dev` — start dev (Turbopack, no flag needed in Next 16)
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm build` — production build
- `pnpm start` — start prod server
- `pnpm lint` — eslint flat config

## Critical out-of-scope (don't accidentally add)

- Spotify/Apple Podcasts integration (YouTube-only confirmed)
- Analytics tags (surprise gift — can't add things requiring her account)
- Real photos of Raissa (use AI-stylized placeholders, swap post-reveal)
- Multi-page routing (homepage v1 only — Episodes/About/Guests come later)
