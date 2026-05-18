---
date: 2026-05-18T19:20:04Z
git_commit: f39e17e
branch: main
repository: DeepDive Website
topic: "SEO + AI-SEO pass shipped, mobile drop-cap/overflow QA + fix, new episode added to Sanity, /api/revalidate webhook stood up"
tags: [handoff, seo, ai-seo, mobile, dropcap, sanity, revalidate, automation]
status: in-progress
last_updated: 2026-05-18
type: handoff
---

# Handoff: Mobile QA fix + SEO/AI-SEO + new episode + revalidate webhook

## Task(s)

Picked up from `specs/handoffs/2026-05-17_1920-editorial-design-pass-shipped.md` Next Steps. Completed across one session:

1. **SEO + AI-SEO skill application** — done, deployed in commit `c9f74a8`. Vendored skills at `.agents/skills/seo/SKILL.md` and `.agents/skills/ai-seo/SKILL.md` read in full; applied to the site. Schema.org validator confirmed 12 JSON-LD scripts across 8 routes, 0 errors, 0 warnings on live URL.
2. **Mobile QA pass** — done, deployed in commit `ebc9bcd`. Edmond flagged a screenshot showing "C" drop cap orphaned alone above "onversations / That Matter". Audited all 8 routes at 390x844 via Playwright MCP. Found drop-cap stacking on home/about/episodes AND horizontal scroll bug on /episodes. Fixed and re-verified on host.docker.internal dev server.
3. **New episode added to Sanity** — done. Raissa uploaded `Wu7KRGIwPRw` "You Were Never Lazy. You Were Misdiagnosed." (Dr. Faramade Aranga, 1:23:53) at 13:41 PDT on 2026-05-17. Manually fetched metadata via YouTube oEmbed + watch page scrape, wrote to Sanity via `next-sanity` client with write token. Now live on home (featured), /episodes, and /episodes/never-lazy-misdiagnosed.
4. **`/api/revalidate` endpoint** — done, deployed in commit `f39e17e`. Stood up a Sanity webhook receiver to instantly invalidate the `episode` cache tag + page paths. Edmond still needs to wire the Sanity Studio webhook + Vercel env var (one-time setup, instructions in commit body).
5. **Automation answer** — done, written up in chat. Three paths offered (manual script / Vercel cron polling YouTube RSS / PubSubHubbub push). Edmond asked "Want me to ship path A now?" — answered but not started. **In-flight at session end.**

## Critical References

1. **`specs/handoffs/2026-05-17_1920-editorial-design-pass-shipped.md`** — prior session's handoff, has the Editorial design pass context. The drop-cap orphan bug Edmond flagged today was a pre-existing issue from commit `c0c8cb2` (editorial pass), not introduced by today's SEO work, but exposed because today was the first session where mobile was actually screenshot-audited at 390px.
2. **`.agents/skills/seo/SKILL.md` + `.agents/skills/ai-seo/SKILL.md`** — guidance applied this session. Vendored markdown, not slash-command-registered.
3. **`src/lib/seo.ts`** — JSON-LD helper module. Added 4 new schema builders this session (websiteSchema, personSchema, episodeListSchema, guestArchetypesSchema) plus inLanguage on existing ones.

## Recent changes

### SEO + AI-SEO pass (commit `c9f74a8`)
- `src/lib/seo.ts` — added `websiteSchema()`, `personSchema()`, `episodeListSchema(episodes)`, `guestArchetypesSchema(items)`. Added `inLanguage: "en"` to PodcastSeries + PodcastEpisode.
- `src/app/page.tsx:10-20` — homepage now renders WebSite + PodcastSeries schemas.
- `src/app/about/page.tsx:10-65` — PodcastSeries + Person + BreadcrumbList. Imports updated to pull `personSchema`, `breadcrumbSchema`, `siteUrl` from `@/lib/seo`.
- `src/app/episodes/page.tsx:30-43` — ItemList of all episodes + BreadcrumbList.
- `src/app/guests/page.tsx:61-72` — ItemList of voice archetypes + BreadcrumbList.
- `src/app/contact/page.tsx:18-25` — BreadcrumbList.
- `src/app/episodes/[slug]/page.tsx:43` — **bug fix**: title was `${ep.title} | Deep Dive Podcast with Raissa` which collided with layout template `%s | Deep Dives Podcast`, producing triple-pipe `Title | Deep Dive Podcast with Raissa | Deep Dives Podcast`. Trimmed to just `ep.title` so template appends once.
- `src/app/about|episodes|guests|contact|privacy|terms/page.tsx` — added per-page `alternates: { canonical: '/<path>' }`. Previously only `/` and `/episodes/[slug]` had explicit canonicals.
- `src/app/robots.ts` — switched from single `userAgent: "*"` rule to array of rules: wildcard + explicit allows for GPTBot, ChatGPT-User, OAI-SearchBot, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, Bingbot. Wildcard already covered them; explicit signals intent against future CDN/WAF overrides.
- `public/llms.txt` — new file. Markdown index per llmstxt.org convention. Speculative add per ai-seo skill (unproven, low-cost).

### Mobile drop-cap / overflow fix (commit `ebc9bcd`)
- `src/components/site/DropCap.tsx:24-26` — scaled mobile: `text-[64px]` mobile (was `text-[96px]`), `sm:text-[96px]`, `lg:text-[144px]`. Adjusted `mr` and `-mt` to match.
- `src/components/site/ConversationsSection.tsx:26` — h2 `text-[44px]` mobile (was `text-[56px]`), `sm:text-[56px]`, `lg:text-[72px]`. Added `break-words`.
- `src/components/site/WhyIStartedSection.tsx:85` — h2 `text-[44px]` mobile (was `text-[56px]`), `sm:text-[56px]`, `lg:text-[64px]`. Added `break-words`.
- `src/app/about/page.tsx:75` — h1 `text-[44px]` mobile (was `text-[64px]`), `sm:text-[64px]`, `lg:text-[104px]`. Added `break-words`.
- `src/app/about/page.tsx:126,181,220` — h2s scaled to `text-[40px]` mobile (was `text-[44px]`), `sm:text-[44px]`, `lg:` originals. `break-words` added.
- `src/app/episodes/page.tsx:50` — h1 `text-[44px]` mobile (was `text-[64px]`). `break-words`. This was Edmond's flagged overflow site.
- `src/app/episodes/[slug]/page.tsx:159` — h2 `text-[36px]` mobile (was `text-[40px]`). `break-words`.
- `src/app/guests/page.tsx:81,127,183` — h1 + 2 h2s scaled with `break-words`.
- `src/app/contact/page.tsx:35`, `src/app/privacy/page.tsx:27`, `src/app/terms/page.tsx:26` — h1s scaled with `break-words`.

### New episode in Sanity (no commit — Sanity data)
- Document ID: `Jfkg695YKleT7xwzeSmsvc`
- Slug: `never-lazy-misdiagnosed`
- youtubeId: `Wu7KRGIwPRw`
- Title: "You Were Never Lazy. You Were Misdiagnosed."
- Duration: `1:23:53`
- publishedAt: `2026-05-17T20:41:47Z`
- Category: `Career` *(my best fit — taxonomy is fixed at Entrepreneurship/Finance/Relationships/Career/Faith/Creativity/Immigrant Journeys per `src/sanity/schemaTypes/episode.ts:30-44`; Edmond may want to reclassify in Studio)*
- Description: editorial draft about Dr. Faramade Aranga; overwrite freely in Studio
- Guest: `Dr. Faramade Aranga`
- guestRole: `Doctor of Nursing Practice, Founder of Farama Medical Services`

### /api/revalidate route (commit `f39e17e`)
- `src/app/api/revalidate/route.ts` — new file. POST handler. Accepts Sanity webhook signatures via `parseBody<Record<string, unknown>>(req, secret)` from `next-sanity/webhook`. Falls back to `Authorization: Bearer <SANITY_REVALIDATE_SECRET>` for manual fires. Calls `revalidateTag("episode", "max")` (Next 16 deprecated single-arg form; second arg "max" or CacheLifeConfig required) plus `revalidatePath("/")`, `revalidatePath("/episodes")`, `revalidatePath("/guests")`, and `revalidatePath('/episodes/<slug>')` when slug present in body.
- Route confirmed in build output as `ƒ /api/revalidate` (server function).

## Learnings

- **Drop cap orphan root cause (mobile):** at 326px content area (`px-8` = 32px each side off a 390px viewport), `text-[96px]` cap glyph + `mr-3` ate ~80px, leaving ~256px. Long single words like "Conversations" (13 chars × ~24px = 312px+ at text-[64px]) couldn't fit beside the float. Browser CSS rule: if the first word doesn't fit alongside a left float, push the entire word to the next line. Net effect = cap orphaned alone above the wrapped word. The bug looks like a stacking bug but is really a "first word too wide to share line with float" bug. Fix is reducing either cap size OR heading size so words fit, plus `break-words` (`overflow-wrap: break-word`) on the heading as a safety net.
- **`/episodes` horizontal scroll root cause:** italic span `<span class="italic font-light text-sub">Conversations.</span>` at `text-[64px]` measured 394px wide. Single unbreakable token wider than container forces document `scrollWidth` past `viewportWidth`. Whole page shifts left. `break-words` lets the browser split a token mid-word as a last resort when no break opportunity exists.
- **Sanity CDN propagation lag:** I observed a real lag between `client.create(doc)` returning success and the new doc being visible via `useCdn: true` queries (production client uses CDN — see `src/sanity/lib/client.ts:8`). Vercel built `ebc9bcd` ~2 min after I wrote the episode doc; the build's Sanity query hit a stale CDN snapshot. Lesson: when batching "write to Sanity → trigger rebuild", give Sanity's CDN ~60-90s OR use `useCdn: false` for build-time fetches OR hit `/api/revalidate` after deploy stabilizes.
- **Next 16 `revalidateTag` signature:** now requires 2 args. Single-arg form is deprecated and warns at runtime. Use `revalidateTag(tag, "max")` (or a CacheLifeConfig object). Confirmed by reading `node_modules/next/dist/server/web/spec-extension/revalidate.d.ts:9`.
- **Google Rich Results Test is auth-walled for automation.** reCAPTCHA + "Something went wrong, log in and try again" dialog every time. `validator.schema.org/validate` (POST, `out=json`, response prefixed with Google's `)]}'` XSSI guard) does not require auth and is the right machine-validation pivot. Strip the first line before `JSON.parse`.
- **Playwright MCP browser quirks observed:**
  - Cannot reach host `localhost:3000` — use `host.docker.internal:3000` (already in prior handoff, re-confirmed).
  - Cannot write screenshots to host filesystem paths; only its own roots (`/home/node/.playwright-mcp`). Use plain `filename: "foo.png"` (relative) and the result includes an inline image preview, which is good enough for the assistant to see them.
  - `Reveal` component (uses IntersectionObserver, see `src/components/site/Reveal.tsx`) doesn't always fire visible in the headless context. Worked around by `evaluate(() => document.querySelectorAll('div').forEach(el => { if (el.style.opacity === '0') { el.style.opacity='1'; el.style.transform='none'; el.style.transition='none'; }}))` before screenshotting.
- **YouTube oEmbed gives title + author + thumbnail, no duration or publishedAt.** For those, scrape the watch page HTML and grep `<meta itemprop="datePublished">`, `<meta itemprop="duration">` (ISO8601), and the embedded `"shortDescription":"..."` JSON. Duration ISO format `PT83M53S` corresponds to `1:23:53` site display. See the inline node command in chat history for the exact regex pattern.
- **`fetch-youtube-videos.mjs` "title" field actually returns duration on DOM-scrape fallback.** The script's strategy 2 reads anchor `title` attribute which on YouTube cards is the duration. Strategy 1 (ytInitialData) is correct but isn't always taken. If you re-run the scraper and get durations in the "title" field, you're on strategy 2; treat the `title` as duration and look elsewhere for the real title.
- **Sanity schema is closed-list for category.** `src/sanity/schemaTypes/episode.ts:33-41` enumerates 7 fixed categories. New episode that doesn't fit (e.g. mental health) requires schema edit + redeploy + Studio refresh, OR forced-fit to the closest existing bucket.
- **Pre-existing lint errors** (36 errors, 2 warnings) are unescaped apostrophes in JSX and an unused `formatDate` in `src/app/episodes/page.tsx:24`. None on lines touched today. Build still succeeds. Leaving for a later cleanup.

## Artifacts

### Today's commits (all on main, all pushed, all deployed)
- `c9f74a8` SEO: schemas, canonicals, AI bots, llms.txt (11 files +161 -11)
- `ebc9bcd` Fix: mobile drop-cap stacking and h1 overflow (10 files +17 -15)
- `f39e17e` Feat: /api/revalidate webhook for Sanity → instant cache busting (1 file +56)

### Files modified
- `src/lib/seo.ts` (+ 4 schema builders, inLanguage)
- `src/app/page.tsx` (WebSite schema wired)
- `src/app/about/page.tsx` (canonical + 3 schemas wired + h1/h2 mobile sizes)
- `src/app/episodes/page.tsx` (canonical + 2 schemas + h1 mobile size)
- `src/app/episodes/[slug]/page.tsx` (title double-suffix fix + h2 mobile size)
- `src/app/guests/page.tsx` (canonical + 2 schemas + h1/h2 mobile sizes)
- `src/app/contact/page.tsx` (canonical + BreadcrumbList + h1 mobile size)
- `src/app/privacy/page.tsx` (canonical + h1 mobile size)
- `src/app/terms/page.tsx` (canonical + h1 mobile size)
- `src/app/robots.ts` (explicit AI bot allows)
- `src/components/site/DropCap.tsx` (mobile size scaled down)
- `src/components/site/ConversationsSection.tsx` (h2 mobile size)
- `src/components/site/WhyIStartedSection.tsx` (h2 mobile size)

### Files created
- `public/llms.txt`
- `src/app/api/revalidate/route.ts`

### Sanity data (production dataset)
- Episode doc `Jfkg695YKleT7xwzeSmsvc` — see "Recent changes" above for full payload.

### Untracked at session end
- `specs/handoffs/2026-05-17_1920-editorial-design-pass-shipped.md` — prior session's handoff, never committed by user.
- `specs/handoffs/2026-05-18_1520-mobile-qa-seo-new-episode-revalidate.md` — this handoff.

### Live URLs to verify
- https://deepdives237.com/ (homepage; new episode is the featured Hero)
- https://deepdives237.com/episodes (now shows 7 episodes incl. new one)
- https://deepdives237.com/episodes/never-lazy-misdiagnosed (new episode page)
- https://deepdives237.com/robots.txt (9 user-agent rules)
- https://deepdives237.com/llms.txt (200 OK, text/plain)
- https://deepdives237.com/api/revalidate (returns 500 "SANITY_REVALIDATE_SECRET not configured" until Edmond sets the env var)

## Action Items & Next Steps

**Immediate next move — Edmond explicitly asked at session end: "Want me to ship path A now?"**

Path A = `scripts/add-episode.mjs <youtubeId>` that:
1. Validates `youtubeId` is 11 chars
2. Fetches title via `https://www.youtube.com/oembed?url=https%3A//youtu.be/<id>&format=json`
3. Fetches publishedAt + duration ISO + description by curl'ing the watch page and grepping `<meta itemprop="datePublished">`, `<meta itemprop="duration">`, `"shortDescription":"..."` — see the inline node script from this session for the regex pattern
4. Converts duration ISO `PT83M53S` → display `1:23:53`
5. Auto-generates slug from title (kebab-case, drop articles, max ~30 chars)
6. Prompts user for category from the fixed list (use `@inquirer/prompts` or a simple readline; or accept `--category` CLI flag)
7. Optionally accepts `--description` flag; otherwise uses the YouTube shortDescription truncated to a sentence or two with editorial trimming
8. Idempotency check: `client.fetch('*[_type=="episode" && youtubeId == $id][0]')` — bail if exists
9. `client.create(doc)`
10. POST to `https://deepdives237.com/api/revalidate` with the Bearer secret + `{ slug }` body
11. Print the live URL for the new episode

After A: instructions for B (Vercel Cron + YouTube RSS) and C (PubSubHubbub) are in the chat history. B is the recommended next step after path A proves itself.

**Edmond's manual setup still pending (5 min total):**
1. Vercel → Project → Settings → Environment Variables → add `SANITY_REVALIDATE_SECRET` = some random string (`openssl rand -hex 24`).
2. Sanity Studio → Settings → API → Webhooks → Create webhook:
   - URL: `https://deepdives237.com/api/revalidate`
   - Trigger: Create / Update / Delete
   - Filter: `_type == "episode"`
   - Projection: `{ "slug": slug.current }`
   - Secret: same value as `SANITY_REVALIDATE_SECRET`
3. Without this, the route returns 500 on call. Until then, Sanity changes still go live in 5 min via the existing `revalidate = 300` ISR.

**Open editorial decisions for Edmond:**
- New episode category. I picked `Career`; it might be better as `Faith` or might warrant a new bucket like "Mental Health" — requires schema edit if so.
- New episode description: I wrote an editorial-voice draft. Replace freely in Studio.

**Pre-reveal items still pending from the prior handoff:**
- Cold-load font test on phone (real device)
- Hover YouTube CTA on /episodes (real browser, MCP hover unreliable)
- NewBadge smoke-test (temp set an episode's publishedAt to today)
- 404/error page poke
- Subscribe → destination check (header link)
- Resend wiring (waits on RESEND_API_KEY from resend.com signup)
- Speed Insights p75 LCP/INP/CLS — needs 24-48h of real-user traffic from the editorial pass deploy date

## Other Notes

- **The drop-cap stacking is a pre-existing bug from commit `c0c8cb2` (editorial pass), not introduced by today's work.** It was missed because the editorial pass session never screenshot-audited at 390px viewport. Edmond's frustration was justified — per his auto-memory `feedback-build-quality-bar`, every section must be screenshot-verified before moving on. The SEO commit I shipped before noticing the bug was "no visual change" by design (head metadata only) but I still should have screen-tested mobile. **Going forward: screenshot every page at 390/768/1440 even for invisible work** — there's no "I didn't change anything visual" excuse if mobile is broken.
- **DropCap fix verification approach (notable):** Reveal.tsx's IntersectionObserver doesn't fire in MCP browser, so initial screenshots looked blank. Worked around by overriding inline `style.opacity = '0'` to `'1'` via `browser_evaluate` before each screenshot. If you need to re-screenshot in a future session and see blank pages, that's the fix.
- **Sanity MCP was disconnected** during this session (already noted in prior handoff). All Sanity writes went through `next-sanity` createClient + write token in `.env.local`. Pattern in `scripts/seed-sanity.mjs` is the reference.
- **Playwright MCP screenshots saved to `.playwright-mcp/` in the project root**, not the host filesystem path I tried first. They're gitignored. The MCP returns an inline image preview so the assistant can see them; you don't need to fish them out unless you want to send them to a user via SendUserFile.
- **The user `git push`-es and Vercel auto-deploys**. Deploy time typically 60-90s. I noticed two cycles in this session needed a force or manual revalidate when fresh Sanity data raced the build. The new `/api/revalidate` endpoint exists specifically to resolve this race in the future.
- **`pnpm dev | head -N` wedges the dev server** (already noted in prior handoff). Always start with `nohup pnpm dev > /tmp/dd-dev.log 2>&1 &`.
- **MCP_DOCKER browser tools went offline at session end** (the system reminder before `/compact` notified me). They were available throughout the QA pass. If a future session needs visual QA, the MCP server may need to be re-attached via `/mcp`.
- **Conversation context at session end:** ~280k+ tokens. The `/compact` was called because the user's last message was "Continue from where you left off" after an empty reply turn, and then explicitly invoked `/compact` to start fresh.
