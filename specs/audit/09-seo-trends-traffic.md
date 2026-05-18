# Phase 9 — 2026 SEO Trends + Traffic Playbook

**Sources consulted:** position.digital, saspod.com, lowerstreet.co, frase.io, pixelmojo.io, sapt.ai, almcorp.com, heroicrankings.com, neilpatel.com (top results across "SEO trends 2026", "podcast SEO 2026", "GEO get cited 2026").

This phase is **strategy, not code**. It maps the 2026 search landscape to concrete moves Deep Dives can make. Some are website-side (I can build them). Most are Raissa-side (content, channel, presence).

---

## 1. The 2026 search landscape — what changed

A few numbers that matter:

| Stat | Source | Implication |
|---|---|---|
| **~50%** of US Google searches now show AI Overviews | heroicrankings.com | Half of search queries never produce a click |
| **58.5%** of Google searches end without a click | position.digital | "Zero-click" is the default outcome |
| **44.2%** of LLM citations come from the first 30% of text | frase.io | Front-load every answer; don't bury the point |
| AI-referred visitors convert at **14.2%** vs organic's **2.8%** | frase.io | AI citation traffic is 5× higher quality |
| **Reddit = 46.5%** of Perplexity's citations | frase.io | Authentic community presence is huge for Perplexity |
| **Brand mention frequency** correlates 0.664 with AI citation | almcorp.com | The strongest predictor — get talked about |
| **YouTube mentions are the #1 ranking factor** for AI brand visibility | pinmeto.com | Hugely relevant for Deep Dives — your distribution IS your authority |
| SEO ↔ GEO winners overlap **<20%** (was ~70% two years ago) | almcorp.com | Optimizing for Google rank ≠ optimizing for AI citation |
| ~**4.5M** podcasts exist worldwide as of 2026 | saspod.com | Competition is brutal; differentiation matters |

The shape of this:
- Traditional SEO still matters (Google AI Overviews source 97% of citations from top 20 organic results).
- But it's no longer enough. AI search engines (Perplexity, ChatGPT, Claude) cite based on different signals: content structure, brand mentions, third-party validation.
- The biggest leverage point for a small podcast is **YouTube + community presence**, not on-page keywords.

---

## 2. What the website is already doing right

Before the playbook, give yourself credit:

- Full structured data (PodcastSeries, PodcastEpisode, Person, BreadcrumbList, etc.)
- AI bots explicitly allowed in robots.txt (GPTBot, ChatGPT-User, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended, Bingbot)
- `llms.txt` at site root
- Canonical URLs and per-page metadata
- Indexable episode pages with descriptive slugs
- `revalidate` cache strategy that picks up new content within 5 minutes
- Speculation rules + DNS prefetch for performance
- WCAG AA accessibility (which AI summarizers also reward)

**The technical foundation is in place.** The remaining work is content + presence, not code.

---

## 3. Traffic playbook — three time horizons

### THIS MONTH (high-leverage, mostly content)

**1. Add episode transcripts.** This is the **biggest single SEO multiplier for podcasts** per multiple 2026 guides. Search engines can't read audio. Transcripts turn 60-90 minutes of conversation into indexable text on every episode page — that's hundreds of thousands of words of keyword-rich content across the catalog. Each transcript adds:
- Long-tail search visibility for specific phrases guests said
- Anchor points for shorter related-clip pages
- AI extractability — transcripts are the easiest format for LLMs to cite
- Accessibility wins (also helps WCAG)

*What I'd build:* a `transcript` field on the Sanity Episode schema, render under the embedded player on each episode detail page, mark up with `transcript` HTML and a `TranscribedAudioObject` schema. ~4 hours of work. Highest-impact item on this entire list.

**2. Per-episode show notes.** Currently episode pages have title + category + duration + description. Expand each to include:
- 3-5 sentence summary
- Key topics covered as a bullet list (helps with "What did [guest] say about [topic]?" queries)
- Timestamps with topic labels (e.g. "12:34 — Why she left her first company")
- Guest bio + links to their work
- Resources mentioned in the conversation

These exist in the Sanity schema already (`description`, `guest`, `guestRole`). Need to extend with `topics: string[]`, `timestamps: { ts: string, label: string }[]`, `resources: { name: string, url: string }[]`. Then render. Probably another 3-4 hours.

**3. YouTube channel optimization (off-site, Raissa-side).** Already covered in Phase 7 punch list (Y1-Y3). Restated here because it's the highest off-site leverage:
- Channel keywords: `Deep Dives Podcast, long form interview, Raissa, immigrant stories, founder conversations`
- Channel "About": open with "Deep Dives is a long-form interview podcast hosted by Raissa." Front-load the brand phrase.
- Per-video title pattern: `Deep Dives — Ep N: {Guest Name} on {Topic}`
- Per-video description: open with the show description, follow with episode-specific blurb (4-5 lines), then timestamps, then resources. YouTube weights description heavily for video search.

**4. Audit current AI citations.** Per Phase 7. Take 30 minutes to manually search ChatGPT, Perplexity, and Google for:
- "Deep Dives Podcast"
- "Raissa podcast"
- "best long-form interview podcasts 2026"
- "podcasts about immigrant stories"
- "podcasts about founders failing"

Note where you appear, where competitors do, what types of pages get cited. This gives you the targets for the next 3 months.

---

### NEXT 3 MONTHS (compound — authority + presence)

**5. Build third-party brand mentions.** Brand mention frequency is **the single strongest predictor of AI citation** (0.664 correlation). Ways to compound:
- **Guest cross-promotion.** Every guest gets a "share kit" with shareable graphics, a 60-sec clip, and a paragraph they can drop into LinkedIn/X/Substack. Aim: 7 mentions per episode × 7 episodes = 49 brand mentions per quarter.
- **Reddit presence.** 46.5% of Perplexity citations come from Reddit. Pick 3-5 subreddits where Deep Dives content would fit organically (`r/podcasts`, `r/podcasting`, `r/Entrepreneur`, topic-specific subs). Don't spam — participate authentically, mention the show when it genuinely helps. Even 10-20 organic comments per quarter compound over time.
- **Podcast directories.** Submit to Podchaser, Goodpods, Listen Notes, Player FM — each is a citable third-party brand mention even without ad spend. Most are free.
- **Guest podcast appearances.** Raissa interviews guests; the inverse should also happen. Pitch her as a guest on adjacent podcasts (interview hosts, immigrant-story shows, faith-and-doubt shows). Each appearance = 1 high-authority backlink + brand mention.

**6. Topic clusters.** Currently the site has 7 archetype categories on /guests but no editorial content around them. Add 7 evergreen long-form posts:
- "What founders past the pitch deck wish they'd known" (Entrepreneurship cluster)
- "The questions partners avoid" (Relationships cluster)
- ... one per archetype

Each post:
- Synthesizes themes across 3-5 episodes
- Front-loads a clear definitional answer (first 40-60 words)
- Links back to the episodes that informed it
- Uses Article schema with `mentions` linking to PodcastEpisode entities
- Ends with a "listen to the full conversations" CTA

These are the pages most likely to get cited by AI search engines for definitional queries. They also re-up the catalog's organic SEO by giving Google fresh, topical content that interlinks to old episodes (compounding internal authority).

*What I'd build:* a new content type in Sanity (`Article` or `Essay`), a route `/essays/[slug]` or fold into existing structure, the schema, the listing page. ~6-8 hours.

**7. Wikipedia presence (long horizon, high payoff).** ChatGPT cites Wikipedia in 7.8% of all citations. A Wikipedia article on "Deep Dives Podcast" (once notable enough) becomes a major AI-search lever. **Don't try to create it yourself** — Wikipedia editors reject self-created articles. Instead, build the notability signals (press coverage, third-party mentions, subscriber growth) until someone else creates the page.

**8. Press / earned media (1-2 placements).** Pitch the show to 5-10 publications that cover podcasts (`Vulture`, `The Ringer`, `Vox`, `Substack newsletters`). One placement in a respected outlet = a permanent high-authority citation that AI systems will reference for years. Hardest item on the list but highest ceiling.

---

### ONGOING FLYWHEEL (after the above land)

**9. Episode consistency drives YouTube ranking.** YouTube's algorithm rewards channels that ship on a predictable cadence. If Raissa can ship every 2 weeks, the channel ranking compounds. Erratic schedules get demoted.

**10. Watch-time + retention beats subscriber count.** YouTube ranks channels by total session watch-time, not subscriber count. Long episodes with high retention (people finishing them) outrank channels with more subscribers but shorter watch sessions. Deep Dives' format is naturally aligned with this.

**11. Quarterly content refresh.** Update the homepage tagline, the about page bio, the topic-cluster essays as the show evolves. AI summarizers weight recency — pages with `dateModified` in the last 6 months get cited more often than evergreen-but-undated pages. Just touch the metadata + add a brief "updated: {month year}" line and you get the freshness signal for free.

**12. Watch the analytics for compounding.** Set up Google Search Console (need to submit the sitemap once — see Phase 7 Y4). Track which queries the site appears for. Track which episode pages get the most AI-referrer traffic (chatgpt.com, perplexity.ai, claude.ai as referrers in GA4). The cluster of pages that AI cites = the editorial lane to lean into.

---

## 4. What NOT to do

Per the GEO research and SEO skill:

- **Don't keyword-stuff** — actively hurts AI visibility by 10% (Princeton GEO study)
- **Don't write for AI at the expense of human voice** — gameable content gets de-ranked
- **Don't gate content** — AI can't read what it can't access. Keep episodes + transcripts open
- **Don't chase every channel** — pick 2-3 (YouTube + Reddit + maybe LinkedIn) and go deep, not 10 channels at half effort
- **Don't reorganize content around llms.txt** — the format is unproven, no major AI vendor has confirmed they read it
- **Don't pursue Spotify/Apple Podcasts integration** — Phase 3 of the audit confirmed YouTube-only distribution is correct for this brand; splitting attention dilutes the signal

---

## 5. What I can ship from the website side now

Ranked by impact ÷ effort. **You pick which to authorize.**

| # | Item | Effort | Impact | Blocked on |
|---|---|---|---|---|
| T1 | Transcript field + render block on episode pages, with TranscribedAudioObject schema | 4 hrs | **very high** | needs at least one transcript draft from Raissa to validate the UX |
| T2 | Show-notes upgrade: timestamps + topics + resources fields on episodes | 3-4 hrs | high | needs Raissa to fill in for existing episodes |
| T3 | Topic-cluster essay route (`/essays/[slug]`) + Sanity schema + Article JsonLd | 6-8 hrs | high (medium-term) | needs at least one essay draft |
| T4 | Add `dateModified` field on episodes + render "Updated {date}" if it differs from publish date | 1 hr | medium | none |
| T5 | Add `Organization` schema (in addition to `Person` + `PodcastSeries`) to give Google's Knowledge Graph an organizational entity | 30 min | low-medium | none |
| T6 | Add FAQ schema to /about with 3-5 questions ("What is Deep Dives?", "Who is Raissa?", "How long are episodes?") — these get cited disproportionately by AI | 1 hr | medium | low — I can draft initial copy from existing content |
| T7 | Submit sitemap to Google Search Console (Edmond does this once it's deployed) | 30 sec | medium | Search Console access |

**My recommended order:** T6 (lowest friction, AI-citation win), then T4 + T5 (small cleanups), then queue T1+T2 for when Raissa has time to provide transcripts/show-notes for one episode, then T3 once she's tested the essay format.

---

## 6. What only Raissa can do (the part you can't shortcut)

1. **Channel keywords + about description on YouTube** (5 minutes, highest leverage)
2. **Per-video title + description pattern going forward** (10 min per upload)
3. **Cross-promotion graphics for guests** (one template, reuse per episode)
4. **Picking 2 subreddits and engaging genuinely** (~30 min/week)
5. **One quarterly "essay" or transcript-derived blog post** (~3 hrs/quarter)
6. **One quarterly podcast appearance** as a guest (off-site brand mention)

That's roughly 4-6 hours/quarter of Raissa-side work that compounds. The website is the foundation; her content + presence is the engine.

---

## Sources

- [SEO Trends 2026: Win Google AI Overviews & ChatGPT Citations](https://almcorp.com/blog/seo-trends-2026-rank-google-ai-search/)
- [150+ AI SEO Statistics for 2026](https://www.position.digital/blog/ai-seo-statistics/)
- [Podcast SEO: How to Get Your Show Found in 2026](https://saspod.com/blog/post/podcast-seo)
- [Podcast SEO in 2026: The New Rules for Discoverability](https://whatsgood-productions.com/blog/podcast-seo-in-2026)
- [Podcast SEO Best Practices 2026 — Lower Street](https://lowerstreet.co/blog/podcast-seo)
- [Mastering AI Citations: The Ultimate GEO Playbook — Frase.io](https://www.frase.io/blog/how-to-get-cited-by-ai-search-engines-the-complete-geo-playbook)
- [How to Get Cited by ChatGPT, Gemini & Claude (2026) — Pixelmojo](https://www.pixelmojo.io/blogs/geo-playbook-get-cited-chatgpt-perplexity-claude)
- [AI Search Optimization Guide — Sapt.ai](https://sapt.ai/insights/ai-search-optimization-complete-guide-chatgpt-perplexity-citations)
- [Local SEO + AI Ranking Factors — PinMeTo](https://www.pinmeto.com/blog/how-ai-changes-google-search-ranking/)
- [Google AI Overview Statistics 2026 — Heroic Rankings](https://heroicrankings.com/seo/managed/google-ai-overview-statistics-2026/)
