# Phase 7 — SEO + AI-SEO Audit

**Skills loaded:** vendored `.agents/skills/seo/SKILL.md` and `.agents/skills/ai-seo/SKILL.md`.
**Tools:** read-only inspection of route metadata, schema output, `robots.txt`, `sitemap.ts`, `public/llms.txt`, alt-text and anchor-text patterns across all pages. No remote testing (Search Console / Rich Results) — those require browser sessions.

---

## 1. Critical SEO checklist (per skill)

| Item | State | Notes |
|---|---|---|
| HTTPS enabled | ✓ (assumed at deploy) | `metadataBase` builds canonical https URLs |
| robots.txt allows crawling | ✓ | Allows `/` for all + 8 named AI bots, disallows only `/styleguide`, `/studio`, `/api/` |
| No `noindex` on important pages | ✓ | Only `/styleguide` and `/studio` are noindex |
| Title tags present and unique | ✓ | Every route sets `metadata.title`; layout template formats them |
| Single `<h1>` per page | ✓ | All routes have exactly 1 `<h1>` (home's lives inside `Hero`) |

**No critical issues.**

---

## 2. High priority

| Item | State | Notes |
|---|---|---|
| Meta descriptions present | ✓ | Every public route has `metadata.description` |
| Sitemap submitted | ⚠ off-site | `src/app/sitemap.ts` generates `/sitemap.xml` with all routes + dynamic episode slugs. You still need to submit it in Google Search Console once. |
| Canonical URLs set | ✓ | `alternates.canonical` on every route |
| Mobile-responsive | ✓ | Tailwind responsive utilities throughout; viewport meta set in layout |
| Core Web Vitals | n/a | Separate `core-web-vitals` skill — out of scope for this audit |

---

## 3. Medium priority

| Item | State | Notes |
|---|---|---|
| Structured data implemented | ✓ extensive | 9 schema types in use (PodcastSeries, PodcastEpisode, Person, WebSite, BreadcrumbList, ItemList, ListItem, MediaObject, Thing) |
| Internal linking | ✓ | Header, Footer, and in-content links use descriptive anchors. No "Click here" or bare "Read more" anywhere |
| Image alt text | ✓ | All 8 `<Image>` usages have alt; descriptive content (host name + brand) on portraits |
| Descriptive URLs | ✓ | `/episodes/[slug]` uses readable slugs, no IDs |
| Breadcrumb schema | ✓ | Every non-home route ships breadcrumb JSON-LD (added in Batch B) |

---

## 4. AI-SEO findings (per `ai-seo` skill)

The skill emphasizes three pillars: **Structure**, **Authority**, **Presence**.

### Structure — extractability

| Check | State |
|---|---|
| First-paragraph self-contained answer | ⚠ partial — see below |
| Statistics with sources | n/a (this is a podcast site, not a data site) |
| FAQ section | n/a (no FAQ content yet) |
| Schema markup | ✓ extensive |
| Recently updated signal | ✓ on privacy + terms; ⚠ not on about |
| H2/H3 hierarchy matches query phrasing | ✓ headings like "About Deep Dives", "Meet the Host", "What We Cover" map cleanly to search intent |

**Home page lede tradeoff:** the Hero lede reads *"Genuine conversations that inspire, educate, and empower. The interviews you wish more hosts had the courage to do."*

That's emotive editorial voice, not a definition. An AI summarizer trying to answer "What is Deep Dives Podcast?" would prefer something like *"Deep Dives is a long-form interview podcast hosted by Raissa, featuring conversations with founders, planners, clergy, civic voices, and immigrants."*

The current copy is intentional voice. **Don't rewrite for AI** — that would compromise the brand. But: the `<meta description>` at `layout.tsx:48` IS descriptive ("Genuine conversations that inspire, educate, and empower. Real stories. Real people. Real impact.") which still isn't a definition. Worth one polish.

### Authority

| Signal | State |
|---|---|
| Named author with credentials | ✓ Raissa as author/creator in Person schema |
| Expert attribution | ✓ |
| Dates on content | ✓ Episode `datePublished` in schema |
| E-E-A-T alignment | ✓ first-person voice, identifiable host |

### Presence — be where AI looks

| Channel | State |
|---|---|
| YouTube linked from every page | ✓ Header subscribe pill, Footer, multiple in-content CTAs |
| `sameAs` in Person/PodcastSeries schema | ✓ YouTube, Instagram, TikTok |
| `llms.txt` present | ✓ at `/public/llms.txt`, well-formed |
| Wikipedia | ⚠ off-site — no Wikipedia page exists |
| Reddit / third-party mentions | ⚠ off-site — no presence audited |

---

## 5. Real flags

### S1. PodcastEpisode schema image still uses `maxresdefault.jpg`

`src/lib/seo.ts:53` hardcodes `https://i.ytimg.com/vi/${ep.youtubeId}/maxresdefault.jpg` for the episode schema image. This is the same vulnerability as the OG image fix in Phase 5 R4 — older or unprocessed YouTube videos don't have a maxres thumbnail and the URL 404s.

**Fix:** swap `maxresdefault` → `sddefault`. The schema validates fine with `sd` (640×480) which is guaranteed.

### S2. Alt text inconsistency: "creator" vs "founder"

| Where | Alt text |
|---|---|
| `about/page.tsx` | "Raissa, host and creator of Deep Dives Podcast" |
| `AboutTeaserSection.tsx` | "Raissa, host and founder of Deep Dives Podcast" |

Both describe Raissa, but the word choice differs. "creator" is what the schema (`personSchema.jobTitle`) uses, so the alt text should match. Pick one and use everywhere.

**Fix:** standardize on "host and creator" (matches schema + the rest of the copy).

### S3. About page has no freshness signal

`/privacy` and `/terms` show "Last updated May 16, 2026". The skill explicitly calls out freshness signals — AI summarizers weight recency. About page content doesn't move often but adding a small "Updated: May 2026" line under the title would help AI extractors classify the content as current.

**Fix optional:** add a small `<p>` with updated date under the `<h1>` on `/about`. Could also just rely on schema `dateModified` (not currently set).

### S4. Layout description could be more definitional

`layout.tsx:48` description: *"Genuine conversations that inspire, educate, and empower. Real stories. Real people. Real impact."*

That's the brand line. Fine for OG cards. But for AI extractability, the very first sentence of the site description ideally answers "What is Deep Dives?" A more definitional alternative: *"Deep Dives is a long-form interview podcast hosted by Raissa. Genuine conversations with founders, planners, clergy, civic voices, and immigrants."*

Same brand energy, frontloaded with a definition.

**Fix optional:** rewrite layout description and OG description. Editorial taste call — defer to you.

### S5. No `WebPage` schema on individual pages

Pages serve `PodcastSeries`, `Person`, `BreadcrumbList` schemas but not a `WebPage` wrapper that ties them to the specific URL. Adding `WebPage` to each route would clarify "this URL is a webpage that is part of [PodcastSeries]" for AI parsers.

**Fix optional:** add `webPageSchema(name, description)` helper to `lib/seo.ts` and include on each route. Defensive; cheap; not critical.

### S6. No sitemap submission to Search Console (off-site action)

The site generates `/sitemap.xml` automatically. But Google won't discover it as fast unless you submit it once in Google Search Console.

**Action for Edmond, off-site:** once deployed, log into Search Console for `deepdives237.com`, go to Sitemaps, paste `https://deepdives237.com/sitemap.xml`, submit. One-time action, takes 30 seconds.

---

## 6. YouTube channel discoverability — why "Deep Dives Podcast" isn't surfacing

The website **cannot directly influence YouTube's internal search algorithm.** YouTube ranks channels and videos based on signals inside YouTube — channel keywords, video metadata, watch time, click-through-rate on thumbnails, subscriber count, and channel age. The website can only influence YouTube discoverability *indirectly* via Google search backlinks and schema entity signals.

### What the website is already doing right

| Action | Done? |
|---|---|
| `Person.sameAs` schema linking the brand to the YouTube channel | ✓ |
| `PodcastSeries.sameAs` schema linking the show to the YouTube channel | ✓ |
| `webFeed` in `PodcastSeries` schema points at the YouTube channel URL | ✓ |
| Direct anchor links to `@DeepDives237` from Header, Footer, About, multiple CTAs | ✓ |
| `llms.txt` mentions the YouTube channel as "primary distribution. Every episode lives here." | ✓ |
| Embedded YouTube player on each episode detail page (counts as a backlink + view) | ✓ |
| Subscribe link uses `?sub_confirmation=1` (one-click subscribe friction reduction) | ✓ (Header pill) |

The website is doing everything reasonable to send authority to the channel. The bottleneck is **on YouTube itself.**

### Likely reasons the channel doesn't surface for "deep dives podcast" search

Without seeing channel analytics, ranked by probability:

1. **"Deep Dives" is a common phrase.** Lots of unrelated channels and videos contain "deep dives" in titles. Without strong channel authority, ranking competition is brutal.
2. **Channel keywords / about description may not include "podcast"** as a tag. YouTube weights the channel "About" section heavily for channel-level ranking.
3. **Low subscriber count + low watch hours.** YouTube ranks new/small channels lower regardless of optimization. There's no SEO shortcut around this — it accrues with content.
4. **Channel age.** New channels have a cold-start penalty.
5. **Video tags + descriptions** may not consistently include "Deep Dives Podcast" as a phrase. Each video should reinforce the channel brand.
6. **Thumbnail CTR** drives YouTube ranking. If thumbnails underperform, the algorithm demotes the channel in search.

### YouTube-side actions to take (off the website)

Roughly ordered by leverage:

1. **YouTube Studio → Settings → Channel → Basic info** — set "Keywords" to: `Deep Dives Podcast, long form interview, Raissa, founders, immigrant stories, conversations`. These directly influence channel search ranking.
2. **Channel "About" description** — write a 200-300 char description starting with "Deep Dives is a long-form interview podcast hosted by Raissa..." Front-load the exact phrase someone would search.
3. **Channel handle** — already `@DeepDives237`. Consider if a simpler handle is available (`@DeepDivesPodcast` if it's not taken), but switching has costs (existing links break unless redirected by YouTube).
4. **Per-video metadata:** every video title should follow a pattern like *"Deep Dives Podcast — Episode N: {Guest Name} on {Topic}"*. Front-load the brand phrase.
5. **Video tags:** include "deep dives", "deep dives podcast", "long form interview", topic-specific tags. YouTube de-emphasizes tags vs description, but tag matches still help.
6. **Channel trailer** — record a 60-90 sec channel trailer that opens with "Welcome to Deep Dives Podcast." This is the unsubscribed-visitor video and signals brand to the algorithm.
7. **Encourage subscribe + watch-to-end on the first few seconds of each video** — YouTube ranks channels by retention.
8. **Cross-link your own videos** in cards + end-screens to grow session watch-time, which is the single biggest YouTube ranking factor.

### Website-side actions that could marginally help YouTube discoverability

Cheap wins:
- **Add `Organization` schema in addition to `Person`** — gives Google's Knowledge Graph an organizational entity to link the brand to. Currently we have `Person` (Raissa) and `PodcastSeries` (the show), but no `Organization` (the brand entity). Could help Google associate the YouTube channel with a Knowledge Panel.
- **Add `mainEntityOfPage` to PodcastSeries schema** pointing at the home URL. Clarifies the canonical home of the entity.

I'd treat these as defensive rather than load-bearing. The bottleneck is YouTube-side optimization, not website schema.

---

## 7. Punch list

Ordered by impact + ease.

| # | Item | Effort | Impact | Where |
|---|---|---|---|---|
| S1 | Swap `maxresdefault.jpg` → `sddefault.jpg` in PodcastEpisode schema | 1 min | medium (defensive) | `src/lib/seo.ts:53` |
| S2 | Standardize alt text "founder" → "creator" | 1 min | trivial | `AboutTeaserSection.tsx` |
| S3 | Add `Updated: May 2026` subtitle on `/about` | 5 min | low (freshness signal for AI) | `src/app/about/page.tsx` |
| S4 | Rewrite layout description to lead with definition | 2 min | low (taste call) | `src/app/layout.tsx` |
| S5 | Add `webPageSchema` helper + include on routes | 20 min | low (defensive) | `src/lib/seo.ts`, each route |
| Y1 | (Edmond, on YouTube) Set channel keywords to include "Deep Dives Podcast, long form interview" | 5 min | high (channel ranking) | YouTube Studio |
| Y2 | (Edmond, on YouTube) Rewrite channel "About" description leading with "Deep Dives is a long-form interview podcast hosted by Raissa..." | 5 min | high | YouTube Studio |
| Y3 | (Edmond, on YouTube) Set per-video title pattern with "Deep Dives" up front | each upload | high | YouTube Studio |
| Y4 | (Edmond, off-site) Submit `https://deepdives237.com/sitemap.xml` in Google Search Console | 30 sec | medium | Search Console |
| Y5 | (Edmond, off-site) Eventually pursue Wikipedia mention or quality third-party citations | ongoing | high for AI | external |

Phase 7 conclusion: **the site's SEO is already strong.** Real fixes are 2 minutes of code (`maxresdefault` → `sddefault` + alt-text standardization). The bigger wins are off-site, in YouTube Studio and Search Console. The website has done its job — schema is extensive, robots is correct, AI bots are explicitly allowed, llms.txt is in place.

Proceed to Phase 8 (accessibility audit, manual).
