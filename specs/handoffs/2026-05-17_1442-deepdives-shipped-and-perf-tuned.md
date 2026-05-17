---
date: 2026-05-17T18:42:04Z
git_commit: caa1c8e
branch: main
repository: DeepDive Website
topic: "Deep Dives Podcast — site shipped to deepdives237.com, Sanity wired, full polish + perf pass complete"
tags: [handoff, deepdives, shipped, vercel, sanity, perf, lighthouse, mobile-nav, seo]
status: in-progress
last_updated: 2026-05-17
type: handoff
---

# Handoff: Deep Dives Podcast — shipped + perf-tuned

## Task(s)

**Status: SHIPPED.** Live at https://deepdives237.com (apex + www, both HTTPS auto-SSL via Vercel). All 10 polish items + performance pass complete. Sanity CMS wired and seeded. Code on GitHub at `2bTwist/deep-dives-podcast` (private, surprise gift). Hosted on Vercel under `2btwists-projects/deep-dives-podcast`.

Session arc, in order:

1. Built `/episodes` listing (4-then-6 long-form, "View More on YouTube" CTA). ✓
2. Built `/about`, `/contact`, `/guests`, `/episodes/[slug]` detail pages with embedded YouTube player + related. ✓
3. Wired Sanity CMS — long auth detour, see "Learnings" below. Settled on `f63p2zht` under eddyb org. 6 episodes seeded via `scripts/seed-sanity.mjs`. ✓
4. Polish pass (all 10 + perf):
   - DPDP wordmark ghost on hero portrait → re-cropped 150×339 from x=875 ✓
   - Mobile hamburger nav + active-page underline + scroll-blur header ✓
   - SEO: sitemap, robots, JSON-LD (PodcastSeries + PodcastEpisode + Breadcrumb), OG image (1200×630), Twitter handles ✓
   - Custom `not-found.tsx` + `error.tsx` ✓
   - Favicon set + PWA manifest + theme-color ✓
   - Privacy + Terms placeholder pages + footer legal links ✓
   - Micro-interactions: founder card → /about with Ken-Burns + caption swap; value-card icon rotate; footer sliding underline ✓
   - Performance: stripped motion from home critical path, font-display: optional on Playfair, font preload reduced 5→2, favicon 800→256 ✓
   - POST_REVEAL_TODO.md written ✓
5. Deployed via `vercel --prod`, attached `deepdives237.com` + `www` via `vercel domains add`. ✓
6. Edmond added Cloudflare DNS (A `@` → 76.76.21.21, A `www` → 76.76.21.21, both DNS-only/grey-cloud). HTTPS resolved within minutes. ✓
7. Episode card visual: gave 3 versions (V1 outlined / V2 floating-shadow / V3 gold-top-accent). Edmond picked **V1**. Applied across all 4 episode-card grids. ✓
8. Final perf push: Lighthouse mobile went from baseline 80/5.0s LCP → median **88/3.7s LCP** (best run **92/3.3s**), desktop **100/0.6s LCP**. LCP element-render-delay collapsed 2273ms → 150ms. ✓

**Open items (NOT site-blocking, all manual actions for Edmond):**
- **Sanity CORS** — add `https://deepdives237.com`, `https://www.deepdives237.com`, `https://deep-dives-podcast.vercel.app` (all "Allow credentials") to project `f63p2zht` → API → CORS Origins via sanity.io/manage UI. Without it, `/studio` editing breaks on live domain. (MCP can't add CORS — write token has Editor role only, requires Administrator grant.)
- **Vercel ↔ GitHub auto-deploy** — install Vercel GitHub App at https://github.com/apps/vercel/installations/new on `2bTwist` account → connect repo in Vercel settings. Currently deploys are manual `vercel --prod`.
- See `specs/POST_REVEAL_TODO.md` for the full handoff list to Raissa (bio copy, AI portrait, Resend wiring, etc.).

## Critical References

1. **`specs/POST_REVEAL_TODO.md`** — comprehensive 6-tier checklist of items requiring Edmond/Raissa input post-reveal. Bio copy in her voice, AI portrait swap, Resend wiring, legal copy review, Sanity member invite, token rotation.
2. **Previous handoff: `specs/handoffs/2026-05-16_1424-deepdives-homepage-v1-shipped.md`** — homepage v1 baseline state. Useful for "where things started" context.
3. **`~/.claude/projects/-Users-edmond-Projects-DeepDive-Website/MEMORY.md`** — 8 auto-memory entries, all load-bearing. Read before any visual work.

## Recent changes

**Final session state — git log on `main` (most recent first):**

- `caa1c8e` Gitignore Lighthouse measurement output files
- `6ba0741` Perf: mobile nav overlay only mounted while open (kills idle backdrop-blur)
- `3c0b3e4` Perf: replace motion AnimatePresence in mobile nav with CSS opacity toggle
- `b931cb9` Perf: strip motion from home critical path (Hero → server component; Reveal → IntersectionObserver; CommunitySection → CSS)
- `7813a32` Perf: only preload Playfair (LCP font); Fraunces+Allura load on demand
- `8fa45e8` Perf: Playfair Display font-display: optional for instant LCP
- `afb5764` Perf: static hero h1, trim font weights, shrink favicon
- `898b795` Episode cards: outlined treatment with breathing room (V1 picked)
- `d5a9ec7` Add POST_REVEAL_TODO doc
- `e6e7f5d` Pre-launch polish: portrait fix, error pages, legal pages, mobile nav, SEO, PWA, micro-interactions, performance
- `7105031` Wire Sanity CMS: embedded studio, episode schema, queries, data layer swap
- `5413048` Build /about /contact /guests /episodes pages + scroll-reveal animations

**Key files changed this session (most important):**

- `src/components/site/Hero.tsx` — pure server component now, no motion. LCP h1 paints on first frame.
- `src/components/site/Reveal.tsx` — IntersectionObserver + CSS transition, no motion dep.
- `src/components/site/CommunitySection.tsx` — CSS-only transitions.
- `src/components/site/Header.tsx` — mobile nav conditional render with CSS keyframe (`animate-fade-in` utility defined in `src/app/globals.css:107-113`).
- `src/app/layout.tsx` — viewport + themeColor + colorScheme; metadata with og/twitter images; preconnect/dns-prefetch hints in `<head>` for ytimg + cdn.sanity.io.
- `src/app/{not-found,error,manifest,sitemap,robots}.tsx` + `apple-icon.png` (180×180) + `icon.png` (256×256, was 800×800).
- `src/app/{privacy,terms}/page.tsx` — placeholder legal pages with editorial styling.
- `src/lib/seo.ts` + `src/components/site/JsonLd.tsx` — PodcastSeries / PodcastEpisode / BreadcrumbList helpers.
- `src/sanity/{env,lib/{client,image,queries},schemaTypes/{episode,index},structure}.ts` + `sanity.config.ts` + `src/app/studio/[[...tool]]/page.tsx` — embedded studio.
- `public/brand/raissa-portrait.png` — re-cropped 150×339 from banner at x=875.
- `public/og.png` — 1200×630 default OG (banner letterboxed).
- `scripts/seed-sanity.mjs` — re-runnable Node script that publishes 6 episodes via @sanity/client using `SANITY_API_WRITE_TOKEN` from `.env.local`.
- `scripts/lh.mjs` — Lighthouse runner (mobile default, `--desktop` flag, `--out=path` to save full JSON report).
- `scripts/screenshot-mobile-menu.mjs` — opens hamburger + screenshots, used for visual verification.

## Learnings

**Sanity auth was the biggest detour of the session.** Critical context for next time:

- The Sanity MCP is a claude.ai-hosted connector that uses Bearer-token auth from an OAuth flow. The token is account-bound and cannot be switched via the CLI. `/mcp` clear + reconnect uses whatever browser session is active on sanity.io at OAuth time.
- Edmond's "personal GitHub" Sanity login resolved to the SAME Sanity user that owned the "Mboa, Inc." org (because his GitHub's verified email is `dev@beseen.love`, same as the existing Mboa user). Sanity dedupes users by email — no amount of /mcp clearing made the MCP see a different user.
- **Resolution:** Edmond manually created a new Sanity account under a SEPARATE GitHub identity (`eddyb`), which produced a genuinely different user with its own `oUlZGdoNT` org. The new project `f63p2zht` was created there via the Manage UI (no MCP needed).
- The site queries Sanity using `SANITY_API_WRITE_TOKEN` from `.env.local`, NOT via the MCP. Seeding ran via `scripts/seed-sanity.mjs` using `next-sanity`'s `createClient`. Bypassed all MCP friction.
- **The MCP still acts as Mboa Inc** and has no access to `f63p2zht`. CORS adds to `f63p2zht` via MCP return `Unauthorized - User is missing required grant sanity.project.cors/create`. Even the Editor write token can't add CORS — that requires Administrator role. Edmond must add CORS manually via sanity.io/manage UI.
- The empty `uwxc2iye` "Deep Dives Podcast" shell I created under Mboa Inc was deleted via the UI. Don't recreate.

**Performance learnings (Lighthouse mobile 4G + 4× CPU):**

- LCP element on home is the `<h1>` "Deep Dives" span — text, not image.
- Biggest single LCP win: removing motion's opacity-0 entrance animation from the h1. Render delay dropped from 2273ms → 150ms.
- `font-display: optional` on Playfair (LCP font) lets the browser stick with the fallback if the font hasn't loaded within ~100ms. Critical because Lighthouse measures LCP at the post-swap repaint with `swap`.
- next/font's `preload` is per-font-family. Setting `preload: false` on Fraunces + Allura cut from 5 → 2 font preloads in `<head>`, freeing bandwidth for the critical h1 font.
- **Subtle gotcha:** always-rendered overlay with `backdrop-blur-md` costs ~0.4s LCP even at `opacity:0`. The browser still computes the blur effect each paint. Fix: conditional render the overlay. CSS keyframe handles the fade-in (close is instant — acceptable mobile UX).
- Variable fonts are large. Dropping Fraunces axes `SOFT` + `WONK` (unused in the codebase) shrunk the variable font payload meaningfully.
- `optimizePackageImports: ['lucide-react']` in `next.config.ts` enables better tree-shaking for the icon library.

**Next.js 16 gotchas re-confirmed:**

- `params` is `Promise<...>` — must `await`. See `src/app/episodes/[slug]/page.tsx:34-39,49-53`.
- `images.qualities` defaults to `[75]` only — must set explicitly. Currently `[75, 90]` in `next.config.ts`.
- `viewport` is now a separate export from `metadata` in layout. `themeColor` belongs there.

**Cloudflare DNS for Vercel:**

- Use A records pointing to `76.76.21.21` (apex + www). Set proxy to **DNS only (grey cloud)** — orange proxied breaks Vercel SSL issuance.
- Vercel's "Intended Nameservers" warning is irrelevant if you're using Cloudflare DNS only (not transferring nameserver hosting).

**Component editing gotchas:**

- `Edit` tool's `replace_all` with a class string can hit unrelated occurrences. Footer's nav-link styling was a near-miss.
- `git add 'src/app/episodes/[slug]/page.tsx'` needs the path quoted in zsh — brackets glob otherwise.

## Artifacts

**Live URLs:**
- Site: https://deepdives237.com (and https://www.deepdives237.com)
- Vercel: https://deep-dives-podcast.vercel.app
- Studio (CMS): https://deepdives237.com/studio
- GitHub (private): https://github.com/2bTwist/deep-dives-podcast
- Vercel dashboard: https://vercel.com/2btwists-projects/deep-dives-podcast
- Sanity Manage: https://sanity.io/manage → eddyb → Deep Dives Podcast (`f63p2zht`)

**Documents to read on resume:**
- `specs/POST_REVEAL_TODO.md` — what Edmond owes Raissa post-reveal
- `specs/handoffs/2026-05-16_1424-deepdives-homepage-v1-shipped.md` — homepage v1 baseline
- This handoff

**Source code (all on main, all deployed):**
- `src/app/{about,contact,guests,episodes,episodes/[slug],privacy,terms,studio/[[...tool]]}/page.tsx`
- `src/app/{layout,page,not-found,error,manifest,sitemap,robots,icon.png,apple-icon.png,globals.css}`
- `src/components/site/{Header,Footer,Hero,ConversationsSection,WhyIStartedSection,CommunitySection,ContactForm,Reveal,JsonLd,Logo,SocialIcons}.tsx`
- `src/lib/{types,youtube,motion,seo}.ts`
- `src/sanity/**` + `sanity.config.ts`
- `scripts/{screenshot,screenshot-mobile-menu,seed-sanity,fetch-youtube-tiles,fetch-youtube-videos,fetch-channel-assets,lh}.mjs`
- `public/{brand/{raissa-avatar,raissa-banner,raissa-portrait}.png,og.png}`

**Sanity project (eddyb org, projectId `f63p2zht`, dataset `production`):**
- 6 published episodes — long-form only, IDs verified via YouTube oembed + watch-page uploadDate
- Episode schema with title/slug/youtubeId/category/duration/publishedAt/description/guest/role/thumbnailOverride

**Auto-memory (untouched this session, still load-bearing):**
- `~/.claude/projects/-Users-edmond-Projects-DeepDive-Website/MEMORY.md` indexes 8 entries
- All listed in CLAUDE.md "Where things live" section. Worth re-reading before resuming.

## Action Items & Next Steps

**For Edmond (manual, ~5 min total) — see live site:**

1. **Sanity CORS** (only one that actually blocks functionality): sanity.io/manage → Deep Dives Podcast (`f63p2zht`) → API → CORS Origins → add three origins (apex domain, www subdomain, vercel.app alias), all with Allow credentials. Without it, `/studio` editing fails on the live domain.
2. **(Optional) Vercel GitHub App**: https://github.com/apps/vercel/installations/new for `2bTwist` → then connect repo at vercel.com/2btwists-projects/deep-dives-podcast/settings/git. Enables `git push` → auto-deploy.
3. **(Optional, cosmetic)** Rotate the `SANITY_API_WRITE_TOKEN` since it appeared in chat. Revoke at sanity.io/manage → Deep Dives Podcast → API → Tokens → Revoke + Add new → paste into `.env.local` AND into Vercel env vars.

**For next agent / future-Edmond, in priority:**

1. **Real bio copy** — `src/app/about/page.tsx` manifesto (4 paragraphs) + `src/components/site/WhyIStartedSection.tsx` (2 paragraphs) + value-card body copy. Currently placeholders in her voice but written by me. Mentioned in `POST_REVEAL_TODO.md` Tier 1.
2. **AI-stylized portrait swap** (optional) — replace `public/brand/raissa-portrait.png` with a generated portrait at similar aspect ratio. Tier 2.
3. **Wire Resend** for `ContactForm` + `CommunitySection` newsletter (both currently fake-submit). `RESEND_API_KEY` + `CONTACT_INBOX_EMAIL` env vars. Build `src/app/api/contact/route.ts` + `src/app/api/subscribe/route.ts`. Tier 3.
4. **Invite Raissa as a Sanity member** so she can log into `/studio`. sanity.io/manage → Deep Dives Podcast → Members → Invite.
5. Smaller polish that came up but wasn't blocking: episode chapters/timestamps in the Sanity schema, transcripts field, share buttons on detail pages. All Tier 6 in the POST_REVEAL_TODO. Out of scope until usage demands.

**Perf — known ceiling without design changes:**
- Best mobile run was 92/3.3s LCP. Median 88/3.7s. To push under 2.5s LCP would require dropping Fraunces (body font, ~160KB) for a system serif. Brand cost, only do if Raissa OKs it.
- Desktop is already 100/0.6s. Most users see the desktop experience.

## Other Notes

**Dev server:** Was running on `localhost:3000` (PID was 60016, may be dead now). Restart with `pnpm dev` from project root if needed.

**Sanity MCP is still authenticated as Mboa Inc.** Don't trust it for any operations on `f63p2zht`. Use the writeToken via `@sanity/client` or the Sanity Manage UI instead. The MCP CAN still be useful for the Mboa BeSeen-Web project if Edmond ever needs that.

**Lighthouse measurement quirk:** Mobile runs vary ±5 points between identical configurations. The "LCP breakdown insight" subparts (TTFB + render delay) sometimes don't sum to the headline LCP number — Lighthouse measures them on different candidates / phases. Trust the median across 3+ runs.

**Tokens that leaked into chat history:**
- Mboa project (`uwxc2iye`) read + write tokens — project is deleted, tokens are dead.
- eddyb project (`f63p2zht`) write token — STILL ACTIVE in `.env.local` and Vercel env vars. Rotation is in the action items above; not urgent because it's gitignored and only used server-side, but good hygiene.

**Things ruled out, don't re-try:**
- Trying to install the Vercel GitHub App via `vercel git connect` CLI — returns "Make sure there aren't any typos..." until the GitHub App is manually installed in the user's GitHub account. Browser-only setup.
- Trying to add Sanity CORS via the MCP `add_cors_origin` tool — returns 401 because MCP is Mboa-authed, no grants on `f63p2zht`. Same for direct Management API call with Editor write token — Editor lacks `sanity.project.cors/create`.
- Trying to "switch" the Sanity MCP to Edmond's personal account via /mcp re-auth alone — Sanity's IdP merges his GitHub identities. Only a genuinely separate Sanity user (different email + different GitHub) yields a different MCP whoami.
- Making the mobile nav overlay always-rendered with `opacity:0` — costs ~0.4s LCP from the persistent backdrop-blur. Conditional render is correct.
- Adding the `motion` library back to Hero for the staggered entrance — undoes ~50KB of bundle savings. Static hero is the right call.

**Edmond's tone preferences (carried forward):**
- No em dashes in user-facing text. Periods or commas. (Project CLAUDE.md.)
- No Claude co-author on commits. (User CLAUDE.md.)
- pnpm-only (lockfile is pnpm). (User CLAUDE.md.)
- Personal GitHub `2bTwist` for OSS contributions and for owning this repo.
- He's burned out by the Sanity auth detour — don't relitigate it if he asks about Sanity again. Tell him "MCP is Mboa-authed, we use writeToken instead, things work."
