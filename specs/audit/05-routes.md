# Phase 5 — Routing & Metadata Consistency

**Scope:** every page in `src/app/`, plus `layout.tsx`, `robots.ts`, `sitemap.ts`, `manifest.ts`, and the `api/revalidate` route. Checking metadata coverage, JsonLd schemas, canonical URLs, revalidate strategy, OG/Twitter completeness.

---

## 1. Site-level metadata (layout.tsx)

| Item | Status |
|---|---|
| `metadataBase` | ✓ uses `NEXT_PUBLIC_SITE_URL` with localhost fallback |
| `title.default` + `title.template` | ✓ `'Deep Dives Podcast with Raissa'` / `'%s \| Deep Dives Podcast'` |
| `description` | ✓ |
| `openGraph` (type, siteName, title, description, locale, image) | ✓ — `/og.jpg` 1200×630 |
| `twitter` (card, title, description, image, creator, site) | ✓ |
| `alternates.canonical: '/'` | ✓ |
| `authors`, `keywords` | ✓ |
| `viewport` (themeColor, colorScheme, width, initialScale) | ✓ |
| `<head>` preconnect to `i.ytimg.com`, `cdn.sanity.io` | ✓ |
| DNS-prefetch to `youtube.com`, `youtube-nocookie.com` | ✓ |
| Speculation rules for prerender (excluding /studio, /api) | ✓ smart |

Site-level metadata is **complete and well-considered.** Nothing to add here.

---

## 2. Per-route metadata + JsonLd matrix

| Route | Title | Description | Canonical | Revalidate | JsonLd | OG/Twitter | Notes |
|---|---|---|---|---|---|---|---|
| `/` (home) | inherits | inherits | inherits | 300 | `websiteSchema`, `podcastSeriesSchema` | inherits | No page-level title/description override — fine for home |
| `/about` | "About" | ✓ | ✓ | 3600 | `podcastSeries`, `person`, `breadcrumb` | inherits | Healthy |
| `/episodes` | "Episodes" | ✓ | ✓ | 300 | `episodeList`, `breadcrumb` | inherits | Healthy |
| `/episodes/[slug]` | dynamic | dynamic | dynamic | 300 | `podcastEpisode`, `breadcrumb` | `generateMetadata` with custom OG `video.episode` + Twitter | Best-handled route in repo |
| `/guests` | "Guests" | ✓ | ✓ | 3600 | `guestArchetypes`, `breadcrumb` | inherits | Healthy |
| `/contact` | "Contact" | ✓ | ✓ | 3600 | (present) | inherits | Healthy |
| `/privacy` | ✓ | ✓ | ✓ | 3600 | **none** | inherits | Legal — breadcrumb could be added |
| `/terms` | ✓ | ✓ | ✓ | 3600 | **none** | inherits | Same |
| `/studio` | re-exported from `next-sanity/studio` | — | — | — | — | — | **No explicit `noindex` override** (Phase 1 F3) |
| `/styleguide` | "Design system" | — | — | — | — | — | `robots: { index: false, follow: false }` + env-fenced |
| `/not-found` | ✓ | — | — | — | — | — | OK |
| `/error` | — | — | — | — | — | — | Error boundary, no metadata |

**Cache strategy consistency:**
- `revalidate = 300` (5 min) on routes that pull live episode data: `/`, `/episodes`, `/episodes/[slug]`
- `revalidate = 3600` (1 hr) on mostly-static routes: `/about`, `/guests`, `/contact`, `/privacy`, `/terms`
- Static (no revalidate): `/studio`, `/styleguide`, `/not-found`, `/error`

This split has a clear rationale — content-driven routes refresh on a short cycle, evergreen content on a long cycle. **Consistent.**

The `/api/revalidate` webhook (commit `f39e17e`) calls `revalidatePath()` on a Sanity write, which bypasses the `revalidate` timer entirely. Belt-and-suspenders. Good.

---

## 3. Sitemap + robots

`src/app/sitemap.ts`:
- Static routes: `/`, `/episodes`, `/about`, `/guests`, `/contact`, `/privacy`, `/terms` (priority + changeFrequency assigned per route)
- Dynamic: `/episodes/[slug]` for every published episode via `getAllEpisodes()`
- ✓ Healthy

`src/app/robots.ts`:
- `userAgent: '*'` allow `/`, disallow `/styleguide`, `/studio`
- AI bots (GPTBot, ChatGPT-User, OAI-SearchBot, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, Bingbot) each explicitly allowed `/` and disallowed `/styleguide`, `/studio`
- `sitemap: ${siteUrl()}/sitemap.xml`
- **Missing:** `/api/` not in disallow list (Phase 1 F4)

---

## 4. Flags

### R1. Studio route lacks explicit `noindex` (Phase 1 F3, restated)

`src/app/studio/[[...tool]]/page.tsx` re-exports `metadata` from `next-sanity/studio`. We don't control what that export contains. Robots disallow already covers it via `robots.ts`, but the page itself doesn't set `robots: { index: false, follow: false }` directly. Double-belt fix.

**Action:** override with an explicit `export const metadata = { robots: { index: false, follow: false } }` after the re-export, OR drop the re-export and define metadata fresh.

### R2. `/api/` not in robots disallow (Phase 1 F4, restated)

`robots.ts` disallows `/styleguide` and `/studio`. The `/api/revalidate` route is POST-only and won't be indexed in practice, but defensively listing `/api/*` is cheap.

**Action:** add `'/api/'` to both the `*` rule and each AI bot rule.

### R3. Privacy + Terms have no breadcrumb JsonLd

Legal pages don't need rich SEO, but **breadcrumb schema** on every route is good hygiene — helps search engines render the site structure consistently.

**Action:** add `breadcrumbSchema([{name:"Home", url:siteUrl()}, {name:"Privacy"|"Terms"}])` to both pages. Two `<JsonLd>` adds, no other changes.

### R4. `/episodes/[slug]` OG image uses `youtubeThumb(ep.youtubeId, "maxres")` without fallback

Line 41 of `episodes/[slug]/page.tsx` hardcodes `maxres`. Some YouTube videos don't have a maxres thumbnail (older / unprocessed videos), and the OG card breaks silently when shared.

**Action:** either set OG to `sd` (always works) or add a server-side preflight check. Cheapest: change to `sd` and accept slightly lower-resolution social previews. Or: use `hq` (480×360) as a compromise — guaranteed and decent.

### R5. Home (`/`) has no page-level metadata override

Fine for now — relies on the layout's default title `'Deep Dives Podcast with Raissa'`. But if you ever want a more specific home title (e.g., to emphasize a campaign or featured episode), there's no override slot today. Not a flag, just noting.

### R6. `keywords` array in layout.tsx — modern SEO doesn't use this

Google ignores `<meta name="keywords">` for ranking and has for over a decade. Keeping the array doesn't hurt, but it's noise. Many premium media sites have removed it.

**Action:** optional remove. Trivial. Not blocking.

---

## 5. What's healthy (came up clean)

- Every public route has `title`, `description`, `alternates.canonical`. No misses.
- Schema coverage is comprehensive — site, organization, podcast series, person, breadcrumbs, episode (with isoDuration via `durationToISO`), guest archetypes, episode list. SEO-rich.
- `<JsonLd>` component sanitizes against `</script>` injection. Defensive.
- Open Graph + Twitter present at site level, overridden where needed on episode pages.
- Preconnect/dns-prefetch optimization for YouTube + Sanity domains.
- Speculation rules prerender (Chromium) for moderate same-origin link prefetch — excludes `/studio` (5MB Sanity bundle) and `/api`. Smart.
- `metadataBase` set correctly so all relative paths resolve.
- AI bot whitelist in robots.ts is explicit, future-proof against CDN/WAF stripping.

---

## 6. Punch list

| # | Item | Effort | Impact |
|---|---|---|---|
| R1 | Add explicit `robots: { index: false, follow: false }` to `/studio` page | 2 min | low |
| R2 | Add `/api/` to robots.ts disallow rules | 2 min | trivial |
| R3 | Add breadcrumb JsonLd to `/privacy` and `/terms` | 5 min | low |
| R4 | Change `/episodes/[slug]` OG image from `maxres` → `sd` (or `hq`) for guaranteed render | 1 min | low |
| R5 | (Optional) Drop unused `keywords` array from `layout.tsx` | 1 min | trivial |
| R6 | Verify `/api/revalidate` webhook actually fires when Sanity content changes (out-of-scope smoke test) | — | — |

Phase 5 conclusion: **routes + metadata are in good shape.** The route surface is fully covered, schemas are rich, caching strategy is sane, sitemap + robots are configured. Only minor polish remaining.

Proceed to Phase 6 (type safety + build health).
