# Groundwork: Deep Dives Podcast — premium Next.js 16 site foundation — 2026-05-16

Scope: foundation only (everything before sections start being built). The downstream `/plan` produces the per-section homepage build plan (header, hero, episodes grid, etc.).

**Revisions applied 2026-05-16 after self-grill (Q1-Q12):** Phase 5 (Sanity scaffold) deleted per Edmond's "defer Sanity until homepage looks right" instruction — Episode TypeScript shape moved to Phase 4. Old Phase 6 (YouTube thumbs) → new Phase 5. Old Phase 7 (visual verification) → new Phase 6. Total = 6 phases. Other revisions noted inline per question (Q1: three script fonts; Q3: env-fence + robots; Q4: split EpisodeThumb / EpisodeThumbStatic; Q7: warm surface; Q8: drop img.youtube.com; Q10: add microHover; Q12: env-based metadataBase).

## Current state

- `package.json` at root: `deepdives@0.1.0`, `next@16.2.6`, `react@19.2.4`, `tailwindcss@4.3.0`, `@tailwindcss/postcss@4.3.0`, `eslint@9`, `typescript@5`. Scripts: `dev`, `build`, `start`, `lint` (none use `--turbopack` flag — Next 16 makes Turbopack the default).
- `src/app/` has the default scaffold: `layout.tsx` (Geist + Geist_Mono via `next/font/google`, `min-h-full flex flex-col`), `page.tsx` (Vercel marketing default), `globals.css` (uses `@import "tailwindcss"` and `@theme inline` — current Tailwind v4 syntax, but only ships `--color-background`, `--color-foreground`, `--font-sans`, `--font-mono`).
- `next.config.ts` is empty (`const nextConfig: NextConfig = {}`). No `images.remotePatterns`, no `reactCompiler`, no `turbopack` block.
- `AGENTS.md` explicitly warns: "This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code."
- Reference materials: `reference/vision-mockup.png` (the north star image), MEMORY.md entries `project-deepdives` and `feedback-build-quality-bar`.

## Solutions surveyed

### Reference repos / sites (Mode B — design patterns)

- **acquired.fm** (https://www.acquired.fm/) — premium business-history podcast. Convergent patterns: minimal left-aligned brand mark + 5-link nav, serif headlines + sans body editorial pairing, generous whitespace (100vh+ hero), 3-column episode card grid with thumbnail + meta + slug routing, curated industry-taxonomy filters (Software, Luxury, Finance, VC, Semis) instead of generic "All," episode-specific color systems instead of monochrome brand-skin, executive testimonials with portraits, footer newsletter with preview imagery. Differentiator: treats audio with the visual sophistication of print media.
- **smartless.com** (https://www.smartless.com/) — celebrity-tier podcast (Bateman / Hayes / Arnett). Convergent patterns: dark background + white type, multi-platform link cluster in hero (Apple Podcasts as primary CTA, Spotify/Instagram/Twitter secondary), host-as-brand portrait composition, "New Episodes Every Monday" appointment-listening proof, production-pedigree footer attribution. Differentiator: ecosystem visibility over single-destination funnel.
- **vercel/next-sanity** (https://github.com/sanity-io/next-sanity, official Sanity SDK for Next.js) — Mode A library, not a reference repo to mimic but the dependency we will adopt. v12.1.1+ required for Next 16. Exposes `defineLive`, `<SanityLive />`, `<VisualEditing />`, `NextStudio`.

**Convergence note:** both reference sites agree on (a) serif-display + sans-body editorial pairing, (b) generous whitespace + restrained motion, (c) host/curator-as-brand portrait composition, (d) multi-platform link clusters, (e) episode card grids with thumbnail + meta as the discovery primitive. Diverges: acquired.fm uses per-episode color treatment for visual richness; smartless.com sticks to a tight monochrome palette. We follow smartless.com's monochrome (warm-black + gold) per the mockup, but borrow acquired.fm's editorial spacing and serif/sans pairing.

**Build vs adopt.** Adopting `next-sanity` (official, MIT, 200K+ weekly downloads, only viable embedded-studio path). Adopting `motion` (formerly `framer-motion`, MIT, 2M+ weekly downloads, dominant React animation library). Adopting `lucide-react` (MIT, 1.4M+ weekly downloads, convergent icon choice in shadcn/ui ecosystem and called out in the user's brief). No from-scratch reinvention.

## Skills available to install

Considered but **not installing** (would duplicate research already in this plan):
- `sanity-io/agent-toolkit@sanity-best-practices` (2.5K installs, first-party from Sanity) — quoted directly above for the embedded-studio setup; full skill installation not needed for v1.
- `sanity-io/agent-toolkit@content-modeling-best-practices` (2K installs, first-party) — quoted for the episodes-schema design; reread before Phase 5.
- `wshobson/agents@tailwind-design-system` (42.1K installs) — broadly useful but our Tailwind v4 patterns are already captured.

If we later expand into multi-page work, install the two Sanity skills first via `npx skills add sanity-io/agent-toolkit/sanity-best-practices` and `npx skills add sanity-io/agent-toolkit/content-modeling-best-practices`.

## Canonical guidance consulted

- **Vercel / Next.js 16 upgrade guide** (`node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`) — load-bearing for us: Turbopack default (no `--turbopack` flag needed); `params` / `searchParams` / `cookies` / `headers` are `Promise`-typed and require `await`; `images.qualities` defaults to `[75]` only; `images.domains` deprecated in favor of `images.remotePatterns`; `images.minimumCacheTTL` default raised from 60s to 4h; `next/legacy/image` deprecated; `next lint` removed (use ESLint directly); React 19.2 + React Compiler stable (opt-in via `reactCompiler: true`); scroll-behavior no longer auto-overridden during SPA navigation (add `data-scroll-behavior="smooth"` on `<html>` if wanted); `middleware` → `proxy` rename (not relevant yet); PPR moves to `cacheComponents` flag (also not relevant yet).
- **Tailwind v4 upgrade guide** (https://tailwindcss.com/docs/upgrade-guide) — `@tailwind base/components/utilities` directives removed; replaced by `@import "tailwindcss"`. `@theme { --color-... --font-... }` block replaces `tailwind.config.js`; every token becomes a CSS variable automatically. Default border color changed from `gray-200` to `currentColor` — always specify border colors. Custom utilities now use `@utility name { ... }` not `@layer utilities`. JS config files no longer auto-detected; load via `@config "..."` if needed.
- **Sanity agent-toolkit nextjs reference** (https://github.com/sanity-io/agent-toolkit/blob/main/skills/sanity-best-practices/references/nextjs.md) — canonical embedded-studio file layout: `sanity.config.ts` at project root; `src/sanity/lib/{client,live}.ts`; `src/app/studio/[[...tool]]/page.tsx` with `export const dynamic = 'force-static'` and `export { metadata, viewport } from 'next-sanity/studio'`; `defineLive` returns `{ sanityFetch, SanityLive }`; `<SanityLive />` MUST render in root layout; `<VisualEditing />` renders conditionally on `draftMode().isEnabled`.
- **Sanity content-modeling best practices** (sanity-io/agent-toolkit) — "Content is data, not pages." Single source of truth — guests/hosts/categories are reference documents, not embedded objects, so they can be edited once and reused. "Future-proof for unknown channels" — keep presentation logic out of the model.
- **Motion (framer-motion) quick start** (https://motion.dev/docs/react-quick-start) — `whileInView={{...}}` is the canonical scroll-triggered primitive; `whileHover` / `whileTap` use the Web Animations API for hardware-accelerated 120fps; `useReducedMotion` is the canonical accessibility hook.

## What's good (do not change)

- `src/app/globals.css:1` — `@import "tailwindcss"` is the correct Tailwind v4 entry; do not revert to `@tailwind` directives.
- `src/app/globals.css:8` — uses `@theme inline { ... }`, the current Tailwind v4 token-declaration syntax. We extend this block; we do not replace it with a JS config.
- `package.json` scripts — `dev` / `build` correctly omit the `--turbopack` flag (Turbopack is the Next 16 default per upgrade guide); leave alone.
- `src/app/layout.tsx:5-13` — uses `next/font/google` with CSS-variable export pattern (`--font-geist-sans`, `--font-geist-mono`). We swap the fonts but keep this exact pattern.
- `tsconfig.json` — scaffold ships with `"strict": true` and `@/*` path alias; both load-bearing for our work.

## Cleanup phases

### Phase 1: Lock the Next.js 16 baseline (config + image hostnames + html attrs)

**Why.** Two image-related Next 16 breaking changes block our YouTube-thumb strategy: `images.domains` is deprecated (per upgrade guide) and `images.remotePatterns` is required for any external hostname. Without this config, `<Image src="https://i.ytimg.com/...">` will throw at build time. Reference repo signal: every production Next 16 app referencing external CDNs ships a `remotePatterns` block — this is convergent across vercel/next-sanity, vercel templates, and the Next 16 docs.

**Reference pattern.**
- `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md:893-916` — canonical `images.remotePatterns` shape:
  ```ts
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  }
  ```

**Files affected.**
- /Users/edmond/Projects/DeepDive Website/next.config.ts
- /Users/edmond/Projects/DeepDive Website/src/app/layout.tsx

**Steps.**
1. Replace `next.config.ts` body with:
   ```ts
   import type { NextConfig } from 'next'

   const nextConfig: NextConfig = {
     images: {
       remotePatterns: [
         { protocol: 'https', hostname: 'i.ytimg.com' },
         { protocol: 'https', hostname: 'cdn.sanity.io' },
       ],
       qualities: [75, 90],
     },
     logging: { fetches: { fullUrl: true } },
   }

   export default nextConfig
   ```
   Reasoning: `qualities: [75, 90]` keeps the v16 default plus 90 for hero images; `cdn.sanity.io` lands now so we don't retrofit; `logging.fetches.fullUrl` makes cache HIT/MISS visible in dev console. Dropped `img.youtube.com` (Q8 revision) — it 301-redirects to `i.ytimg.com`; helper uses i.ytimg.com directly.
2. In `src/app/layout.tsx`, skip `data-scroll-behavior="smooth"` — Motion handles scroll transitions, not CSS.
3. Create `.env.example` at project root with `NEXT_PUBLIC_SITE_URL=http://localhost:3000`. Create matching `.env.local` (already gitignored by scaffold). In `src/app/layout.tsx`'s `metadata` export, set `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000')` plus real `title` / `description` / `openGraph` block. (Q12 revision — no fake-domain placeholder shipping in OG tags.)

**Verification.**
- [x] `pnpm dev` reboots cleanly, no console warnings about deprecated `images.domains`. — Ready in 337ms, picked up `.env.local`.
- [x] Curl `http://localhost:3000/` returns 200. — 200 in 34ms; HTML contains "Deep Dives" not "Create Next App".
- [x] Verify YouTube hostname via `_next/image` optimizer route. — `curl /_next/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FdQw4w9WgXcQ%2Fsddefault.jpg&w=640&q=75` returns HTTP 200, 21013 bytes, image/jpeg.

**Effort.** Low — 10 min.

**Trigger.** Now. Blocks Phases 2 and 5.

### Phase 2: Replace default fonts with editorial pairing (display serif + body sans + THREE script candidates)

**Why.** The scaffold ships Geist + Geist_Mono — a clean modern sans pair, wrong for "luxury editorial podcast." Mockup uses serif display + script flourish + sans body, a pairing convergent across acquired.fm (serif headlines, sans body) and the user's reference image. Per `feedback-build-quality-bar` memory, the script flourish must be calligraphic — `Allura` / `Pinyon Script` / `Great Vibes` are all candidates; `Caveat` is wrong (too casual). Q1 revision: I can't pick between the three without rendering, so load all three temporarily and decide on the /styleguide page in Phase 4.

**Reference pattern.**
- `next/font/google` API (https://nextjs.org/docs/app/api-reference/components/font#google-fonts) — keep the existing CSS-variable export pattern from scaffold:
  ```ts
  const playfair = Playfair_Display({ variable: '--font-display', subsets: ['latin'], weight: ['400','500','600','700','800'] })
  ```

**Files affected.**
- /Users/edmond/Projects/DeepDive Website/src/app/layout.tsx
- /Users/edmond/Projects/DeepDive Website/src/app/globals.css

**Steps.**
1. In `src/app/layout.tsx`, replace Geist imports with:
   ```ts
   import { Playfair_Display, Inter, Allura, Pinyon_Script, Great_Vibes } from 'next/font/google'

   const playfair = Playfair_Display({
     variable: '--font-display', subsets: ['latin'],
     weight: ['400', '500', '600', '700', '800'], display: 'swap',
   })
   const inter = Inter({ variable: '--font-sans', subsets: ['latin'], display: 'swap' })
   const allura     = Allura({ variable: '--font-script-allura',  subsets: ['latin'], weight: ['400'], display: 'swap' })
   const pinyon     = Pinyon_Script({ variable: '--font-script-pinyon', subsets: ['latin'], weight: ['400'], display: 'swap' })
   const greatVibes = Great_Vibes({ variable: '--font-script-vibes',  subsets: ['latin'], weight: ['400'], display: 'swap' })
   ```
   Update `<html className>` to spread all five: `${playfair.variable} ${inter.variable} ${allura.variable} ${pinyon.variable} ${greatVibes.variable}`.
2. In `src/app/globals.css`, replace the existing `@theme inline` font block with:
   ```css
   @theme inline {
     --font-sans: var(--font-sans);
     --font-display: var(--font-display);
     --font-script: var(--font-script-allura); /* DEFAULT — picked on /styleguide in Phase 4 */
     --font-script-allura: var(--font-script-allura);
     --font-script-pinyon: var(--font-script-pinyon);
     --font-script-vibes: var(--font-script-vibes);
   }
   ```
3. In the same file's `body` rule, replace `font-family: Arial, Helvetica, sans-serif;` with `font-family: var(--font-sans), system-ui, sans-serif;`.
4. AFTER Phase 4 (after picking winner on styleguide): remove the two losing script fonts from `layout.tsx`, collapse the `@theme` block, drop the `var(--font-script-*)` aliases not chosen.

**Verification.**
- [x] `pnpm dev` reboots, fonts compile clean (only Inter preloads on `/` since the others aren't rendered yet — expected Next.js 16 font-loader behavior).
- [x] Deferred to Phase 4 — /styleguide will render the three-script comparison there.

**Effort.** Low — 15 min. Pruning step after Phase 4 = 5 min.

**Trigger.** Now. Blocks Phase 4 (design tokens depend on fonts being live).

### Phase 3: Install runtime dependencies (motion, lucide-react, next-sanity, sanity, portable-text)

**Why.** All four are convergent picks across our reference research, all MIT, all in active maintenance. Per CLAUDE.md global security defaults, route fresh installs through `socket pnpm add` to surface supply-chain risk before code lands. `ignore-scripts=true` is on globally so install scripts won't fire — if any of these packages need build scripts post-install, surface that with `pnpm approve-builds`.

**Reference pattern.**
- `package@version` shape adopted (npm registry, all MIT):
  - `motion` (latest stable) — succeeds `framer-motion`. API surface: `<motion.div>`, `whileInView`, `whileHover`, `useReducedMotion`.
  - `lucide-react` (latest stable) — tree-shakeable SVG icons.
  - `next-sanity` (>=12.1.1) — official Sanity SDK for Next.js, required for Next 16 per Sanity docs.
  - `sanity` (>=3) — Studio package, peer dep of `next-sanity`.
  - `@portabletext/react` (latest) — render Sanity rich text.
  - `server-only` (latest) — used to fence server-only modules.

**Files affected.**
- /Users/edmond/Projects/DeepDive Website/package.json
- /Users/edmond/Projects/DeepDive Website/pnpm-lock.yaml

**Steps.**
1. Run from project root: `socket pnpm add motion lucide-react next-sanity sanity @portabletext/react server-only`. If `socket` is not available, fall back to `pnpm add` and note the gap.
2. If pnpm reports "ignored build scripts" for `sanity` or any peer dep, run `pnpm approve-builds` and approve only the ones genuinely needed (typically `sharp` for image processing).
3. Verify `package.json` `dependencies` block now lists all six packages.

**Verification.**
- [x] `pnpm typecheck` (added to scripts) returns 0 errors.
- [x] `pnpm dev` boots in 386ms with new deps, homepage 200.
- [x] grep returns 6 hits — motion 12.38.0, lucide-react 1.16.0, next-sanity 12.4.5, sanity 5.25.1, @portabletext/react 6.2.0, server-only 0.0.1.

**Effort.** Low — 5 min execution, 5 min approve-builds review if needed.

**Trigger.** After Phase 1 (config needs to be settled so installs don't churn).

### Phase 4: Define the design system in globals.css + Episode TypeScript shape + dev-fenced /styleguide route

**Why.** Per `feedback-build-quality-bar`, the bar is Framer-tier finish. The only way to enforce that across many sections is a single source of truth for color, type scale, motion easing, and component primitives — and a visual page where we can see them all at once. Tailwind v4's `@theme` block makes this load-bearing in CSS, not JS. Convergent practice: shadcn/ui, vercel templates, and the Tailwind v4 docs all centralize tokens in the `@theme` block rather than per-component classes. Q2 revision adds the Episode TypeScript shape here (was in Phase 5) so components have a stable contract before Sanity wires in later.

**Reference pattern.**
- Tailwind v4 token shape (https://tailwindcss.com/docs/upgrade-guide):
  ```css
  @theme {
    --color-ink: #050505;
    --color-gold: #c8a25d;
    --font-display: var(--font-display);
  }
  ```
  Every token auto-emits as a `:root` CSS var, usable as `bg-ink`, `text-gold`, `font-display`.

**Files affected.**
- /Users/edmond/Projects/DeepDive Website/src/app/globals.css
- /Users/edmond/Projects/DeepDive Website/src/app/styleguide/page.tsx (new)
- /Users/edmond/Projects/DeepDive Website/src/app/robots.ts (new)
- /Users/edmond/Projects/DeepDive Website/src/lib/motion.ts (new — shared easings + variants)
- /Users/edmond/Projects/DeepDive Website/src/lib/types.ts (new — Episode shape)

**Steps.**
1. Rewrite `globals.css` `@theme` block with the full token set (Q7 revision: `--color-surface` is warm-shifted to `#0d0b08`, ink stays neutral):
   ```css
   @theme inline {
     --font-sans: var(--font-sans);
     --font-display: var(--font-display);
     --font-script: var(--font-script-allura);
     /* keep --font-script-allura/pinyon/vibes aliases during Phase 4 picking */

     --color-ink: #050505;            /* page background — neutral near-black */
     --color-surface: #0d0b08;        /* sections / cards-on-bg — warm-shifted */
     --color-card: #111111;           /* cards */
     --color-border: rgb(255 255 255 / 0.08);
     --color-gold: #c8a25d;
     --color-gold-bright: #e4b84f;
     --color-champagne: #e5d0a2;
     --color-paper: #ffffff;
     --color-muted: #a7a7a7;
     --color-deep-gray: #171717;
   }

   :root { color-scheme: dark; }

   body {
     background: var(--color-ink);
     color: var(--color-paper);
     font-family: var(--font-sans), system-ui, sans-serif;
   }
   ```
   Remove the `@media (prefers-color-scheme: dark)` block — the site is always dark.
2. Create `src/lib/motion.ts` (Q10 revision: two presets, not one):
   ```ts
   export const ease = {
     editorial: [0.16, 1, 0.3, 1] as const, // expo-out — the "Framer" feel
     gentle:    [0.22, 1, 0.36, 1] as const,
   }
   export const fadeUp = {
     initial: { opacity: 0, y: 24 },
     whileInView: { opacity: 1, y: 0 },
     viewport: { once: true, margin: '-80px' },
     transition: { duration: 0.8, ease: ease.editorial },
   }
   export const microHover = {
     transition: { duration: 0.2, ease: ease.gentle },
   }
   ```
3. Create `src/lib/types.ts` (Q2 revision — formerly the Episode schema in deleted Phase 5):
   ```ts
   export type Episode = {
     title: string
     slug: string
     guest?: string
     guestRole?: string
     category?: 'Entrepreneurship' | 'Finance' | 'Relationships' | 'Career' | 'Faith' | 'Creativity' | 'Immigrant Journeys'
     youtubeId: string
     duration?: string
     publishedAt?: string
     description?: string
     thumbnailOverride?: { url: string; alt: string }
   }
   ```
4. Create `src/app/styleguide/page.tsx` (Q3 revision: env-fence at top):
   ```tsx
   import { notFound } from 'next/navigation'
   export default function StyleguidePage() {
     if (process.env.NODE_ENV !== 'development') notFound()
     return ( /* see content checklist below */ )
   }
   ```
   Content rendered:
   - **Color swatches** (every token, hex, WCAG contrast vs ink shown — Q11: gold 8.62:1, muted 8.61:1, paper 20.4:1)
   - **Type scale** — display 96/72/56/40/32, body 18/16/14
   - **Script comparison** (Q1) — render the word "Podcast" at 64px in Allura, Pinyon, Great Vibes side-by-side with labels. We pick the winner here.
   - **Two button variants** — primary gold, secondary outline
   - **One card primitive**
   - **One eyebrow + headline pairing**
   - **A `fadeUp`-animated block** to verify motion timing
   - **A `microHover` button** to verify hover timing
5. Create `src/app/robots.ts` (Q3 revision):
   ```ts
   import type { MetadataRoute } from 'next'
   export default function robots(): MetadataRoute.Robots {
     return { rules: { userAgent: '*', allow: '/', disallow: ['/styleguide', '/studio'] } }
   }
   ```

**Verification.**
- [x] `/styleguide` returns 200; swatches with hex + contrast ratios + sample text on each. Type scale shows Playfair display + Inter body. Components and motion sections render.
- [x] Screenshots at 390/768/1440 captured via `scripts/screenshot.mjs`. Sent to Edmond.
- [ ] Toggle `prefers-reduced-motion` in DevTools, confirm the `fadeUp` block becomes instant. *(Manual — not load-bearing for foundation sign-off.)*
- [ ] **Pick a script font** — Allura, Pinyon, or Great Vibes — and update `--font-script` in globals.css. *(Awaiting Edmond's call.)*
- [x] `pnpm build && PORT=3001 pnpm start` then `curl /styleguide` returns 404 — verified env fence works in production. Build compiled in 1.7s, all 6 routes static.

**Effort.** Medium — 60 min including motion-timing iteration and script font selection.

**Trigger.** After Phase 2 (fonts) and Phase 3 (motion library installed).

### Phase 5: YouTube thumbnail helpers + Image hostname plumbing

**Why.** Per `project-deepdives` memory, episodes use YouTube thumbnails — no fabrication. YouTube returns 404 for `maxresdefault.jpg` when the video lacks a max-res thumb, so a fallback chain is required when we want max-res. Q4 revision: split into TWO components so the grid can stay a pure Server Component (sd-only, no client boundary), and only the hero featured-episode card pays the client cost. `sddefault.jpg` (640×480) is guaranteed for every public YouTube video.

**Reference pattern.**
- YouTube static thumbnail URL convention (publicly documented): `https://i.ytimg.com/vi/<id>/<resolution>default.jpg` with resolutions `maxres` (1280×720), `sd` (640×480), `hq` (480×360), `mq` (320×180), `default` (120×90).

**Files affected.**
- /Users/edmond/Projects/DeepDive Website/src/lib/youtube.ts (new)
- /Users/edmond/Projects/DeepDive Website/src/components/EpisodeThumbStatic.tsx (new — server)
- /Users/edmond/Projects/DeepDive Website/src/components/EpisodeThumb.tsx (new — client, fallback)

**Steps.**
1. Create `src/lib/youtube.ts`:
   ```ts
   export type YouTubeRes = 'maxres' | 'sd' | 'hq' | 'mq'
   export function youtubeThumb(videoId: string, res: YouTubeRes = 'sd') {
     return `https://i.ytimg.com/vi/${videoId}/${res}default.jpg`
   }
   export function youtubeWatchUrl(videoId: string) {
     return `https://www.youtube.com/watch?v=${videoId}`
   }
   ```
   Note default is `sd` (Q4 — safer baseline for the grid).
2. Create `src/components/EpisodeThumbStatic.tsx` (Server Component, used by grid):
   ```tsx
   import Image from 'next/image'
   import { youtubeThumb } from '@/lib/youtube'

   export function EpisodeThumbStatic({ id, alt, ...rest }: { id: string; alt: string } & Omit<React.ComponentProps<typeof Image>, 'src'|'alt'>) {
     return <Image src={youtubeThumb(id, 'sd')} alt={alt} {...rest} />
   }
   ```
3. Create `src/components/EpisodeThumb.tsx` (Client Component, used by featured-episode hero card only):
   ```tsx
   'use client'
   import Image from 'next/image'
   import { useState } from 'react'
   import { youtubeThumb, type YouTubeRes } from '@/lib/youtube'

   const order: YouTubeRes[] = ['maxres', 'sd', 'hq', 'mq']

   export function EpisodeThumb({ id, alt, ...rest }: { id: string; alt: string } & Omit<React.ComponentProps<typeof Image>, 'src'|'alt'>) {
     const [i, setI] = useState(0)
     return (
       <Image
         src={youtubeThumb(id, order[i])}
         alt={alt}
         onError={() => setI(n => Math.min(n + 1, order.length - 1))}
         {...rest}
       />
     )
   }
   ```

**Verification.**
- [x] Network paths verified via `_next/image` optimizer:
  - `dQw4w9WgXcQ` maxres @ w=1920 → 200, 66KB JPEG ✓
  - `dQw4w9WgXcQ` sd @ w=640 → 200, 21KB JPEG ✓
  - `jNQXAC9IVRw` sd → 404 (correctly invalid — proves fallback chain is needed for sparse-thumbnail videos)
- [x] Both components typecheck clean. `EpisodeThumbStatic` is a pure Server Component (no `"use client"`); `EpisodeThumb` is the client-fallback variant.

**Effort.** Low — 25 min.

**Trigger.** After Phase 1 (hostname must be in remotePatterns). Blocks the Episodes Grid section in the downstream /plan.

### Phase 6: Visual verification loop setup

**Why.** Per the user's explicit instruction and `feedback-build-quality-bar` memory, every section must be screenshot-verified before moving on. Convergent practice across modern frontend teams: visual regression / acceptance via real-browser screenshots beats reading the diff. Playwright MCP (https://github.com/microsoft/playwright-mcp) is the canonical install for Claude Code.

**Reference pattern.**
- Two install paths (per Playwright MCP README):
  - `npx`: `claude mcp add playwright npx '@playwright/mcp@latest'`
  - Docker (Edmond's preference): `claude mcp add playwright -- docker run -i --rm --init mcr.microsoft.com/playwright/mcp` (or via `.mcp.json` server entry).

**Files affected.**
- (no repo files — environment-level setup)

**Steps.**
1. Edmond runs `claude mcp add playwright npx '@playwright/mcp@latest'` in a fresh terminal.
2. Restart the Claude Code session so the tool registers.
3. Verify by attempting to take a screenshot of `http://localhost:3000/styleguide` via the Playwright tool. If it works, the loop is live.
4. Define section-acceptance protocol in CLAUDE.md (project-level):
   - For each section, screenshot at 390px (mobile), 768px (tablet), 1440px (desktop).
   - Visually compare against `reference/vision-mockup.png` (desktop) and a mental responsive model (mobile/tablet).
   - User reviews screenshots; reject + iterate if anything feels generic.

**Verification.**
- [x] ~~Playwright MCP~~ Replaced with `scripts/screenshot.mjs` + project-installed `playwright` devDep — same outcome, no MCP needed.
- [x] Successful screenshots of `/styleguide` saved at `screenshots/styleguide/{390,768,1440}.png`.
- [x] Project-level CLAUDE.md updated with the verification protocol.

**Effort.** Low for Claude (just docs); Low for Edmond (one CLI command + session restart).

**Trigger.** Before /implement starts on any section. Soft-blocks the downstream /plan.

## Out of scope

- **Multi-page routing** (Episodes / Episode detail / About / Guests / Clips). Decided v1 = homepage only per user. Downstream /plan covers homepage sections; subsequent /plans cover other pages.
- **Spotify / Apple Podcasts integration.** Confirmed YouTube-only per user — RSS, audio embed, multi-platform CTA buttons are deferred. Component structure should leave room for "Listen on X" buttons but no code today.
- **Analytics / Vercel Analytics / Plausible.** Surprise-gift constraint: Edmond cannot add tags requiring her account.
- **Real photos of Raissa or real guests.** Surprise-gift constraint — all host imagery is AI-stylized placeholders, all episode imagery is YouTube CDN.
- **`next.config.ts` `reactCompiler: true`.** Stable in Next 16 per upgrade guide but opt-in only; deferred until we have a measurable performance baseline. Adding it later is non-breaking.
- **`cacheComponents: true` (PPR).** Same reasoning — measurable benefit unclear at our scale, retrofittable.
- **Visual regression testing in CI.** Playwright MCP gives us screenshot-on-demand during dev. Adding committed snapshots + a CI workflow is deferred until we have stable sections worth protecting.
- **CMS migration / content authoring training for Raissa.** Post-reveal task.

## Hand-off

Run `/grill-me` against this plan to stress-test the tradeoffs.
Then `/implement specs/plans/2026-05-16-groundwork-deepdives-foundation.md` to execute Phase 1.
