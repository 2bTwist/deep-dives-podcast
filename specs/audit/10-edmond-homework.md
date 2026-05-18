# Edmond's Homework — Traffic Activation

The website-side SEO work is shipped (commits `b43c58c`, `03d3c50`, `6a08c0e`):
- FAQ schema + visible Q&A on `/about` (AI summarizers cite this disproportionately)
- `dateModified` field on episodes + "Updated" label + schema freshness signal
- `Organization` schema for Google's Knowledge Graph entity
- Earlier Batches B/G: breadcrumb schemas, `/api/` robots disallow, studio noindex, OG image fallback, alt text standardize

The remaining traffic levers are **off-site**. Below are the actions in order, with the exact text/values to use. Cumulative time: ~30 minutes to do all of them.

---

## 1. Submit the sitemap to Google Search Console (you, 30 seconds)

The site generates `/sitemap.xml` automatically. Submitting it once tells Google about every episode page in one signal.

1. Go to **[search.google.com/search-console](https://search.google.com/search-console/)**
2. Add property: `deepdives237.com` (use Domain property if you control DNS — gives the most data; use URL prefix `https://deepdives237.com/` if not)
3. Verify ownership (DNS TXT record, or Vercel will auto-suggest a meta-tag method)
4. Once verified: **Sitemaps → New sitemap → paste** `https://deepdives237.com/sitemap.xml` → Submit
5. Google starts indexing within hours, usually fully indexed within a week

While you're in Search Console, also submit `https://deepdives237.com/llms.txt` if it lets you (it might not — Search Console only takes XML sitemaps, but bookmarking the URL is fine).

---

## 2. Set up Bing Webmaster Tools (you, 60 seconds)

Bing powers Microsoft Copilot AI search and a meaningful chunk of long-tail queries. Worth 60 seconds.

1. Go to **[bing.com/webmasters](https://www.bing.com/webmasters/)**
2. Import from Search Console (one-click since you just set up GSC)
3. Sitemaps → submit `https://deepdives237.com/sitemap.xml`

That's it. Bing's coverage adds ChatGPT + Copilot citation surface.

---

## 3. YouTube channel optimization (Raissa, ~10 minutes)

This is the single highest off-site leverage we identified. Channel keywords + about description directly drive YouTube's internal search ranking and feed Google's AI Overview signals.

### 3a. Channel keywords

YouTube Studio → **Settings (gear icon, bottom left) → Channel → Basic info → Keywords**

Paste this:
```
Deep Dives Podcast, long form interview podcast, Raissa, podcast with Raissa, immigrant stories, founder conversations, faith and doubt podcast, entrepreneur stories, creative life podcast, long form interviews, deep conversations
```

### 3b. Channel "About" description

YouTube Studio → **Customization → Basic info → Description**

Replace whatever's there with:
```
Deep Dives is a long-form interview podcast hosted by Raissa, an entrepreneur and storyteller. Each episode is one conversation with one guest, taken as long as it deserves — usually an hour, sometimes two.

The guests are founders past the pitch deck. Planners past the photo shoot. Clergy past the Sunday cadence. People who've lived a specific thing and are willing to be specific about it. No panel. No co-host. No clips cut for engagement.

New episodes drop here. Subscribe to never miss a conversation: youtube.com/@DeepDives237?sub_confirmation=1

Pitch yourself as a guest: deepdives237.com/contact
```

Why this exact text: it front-loads the phrase **"Deep Dives is a long-form interview podcast hosted by Raissa"** which is what AI summarizers will quote when someone asks "What is Deep Dives Podcast?" It mirrors the site's FAQ answer 1:1 — consistent signal across surfaces.

### 3c. Channel "Tags" / metadata

In the same Channel settings → Country: `United States` (or whichever applies). Set the language. These small fields affect search localization.

---

## 4. Per-video template going forward (Raissa, ongoing)

For every new upload, use this template. Saves time and locks in the brand-phrase repetition that YouTube search rewards.

### Title pattern
```
Deep Dives — Ep {N}: {Guest Name} on {Topic in 4-7 words}
```

Examples:
- `Deep Dives — Ep 12: Sarah Chen on Why Her First Company Almost Killed Her`
- `Deep Dives — Ep 13: Pastor James on Doubt, Belief, and Sunday Mornings`

The brand phrase up front trains YouTube's search index. The colon-then-hook drives CTR.

### Description template
```
{One-sentence hook about the episode — the moment you'd open the conversation with.}

{2-3 sentence summary of what the conversation covers. Be specific. Name the key tension or question.}

Watch on YouTube: {direct watch URL}
Pitch yourself as a guest: deepdives237.com/contact
Listen to the full conversation: deepdives237.com/episodes/{slug}

CHAPTERS
00:00 Cold open
{paste your timestamps}

ABOUT DEEP DIVES
Deep Dives is a long-form interview podcast hosted by Raissa, an entrepreneur and storyteller. One guest, one conversation, taken as long as it deserves. New episodes drop here. Subscribe: youtube.com/@DeepDives237?sub_confirmation=1

#DeepDivesPodcast #LongFormInterview #{TopicTag}
```

The trailing **About Deep Dives** block in every video description means every video reinforces the brand-phrase. YouTube weights description text heavily.

### Tags
First 3 tags should always be: `Deep Dives Podcast`, `long form interview`, `Raissa`. Then 5-10 episode-specific tags (guest name, topics, themes).

---

## 5. Subreddit presence (Raissa, ~30 min/week)

Per the 2026 research: **Reddit is 46.5% of Perplexity's citations**. AI search treats Reddit as a community-validated signal.

Pick 2-3 subreddits where Deep Dives content fits naturally. Suggested starters:

- **`r/podcasts`** (general podcast discussion, recommend episodes when relevant)
- **`r/podcasting`** (creator side — networking, getting better at the craft)
- **One topic-specific sub** — pick one based on which guest you're publishing. e.g.:
  - Founder/business: `r/Entrepreneur`, `r/smallbusiness`
  - Faith: `r/podcasts` + `r/Christianity` (carefully)
  - Immigrant stories: `r/immigration`, country-specific subs

### How NOT to spam

- Don't post "Check out my podcast!" — Reddit downvotes that to oblivion
- Don't post the same link in 5 subs
- Don't post anything if your account is brand-new — comment authentically first

### What to actually do

1. Spend the first 2 weeks **just commenting** on existing threads, no self-promotion. Build comment karma.
2. When you reply to someone's question and Deep Dives genuinely has an episode that answers it, link it: *"We did a whole episode on this with {guest}, where she said {specific thing} — the bit at 34:00 is what convinced me. {link}"*
3. AMAs (Ask Me Anything) on `r/Entrepreneur` once Raissa has 10+ episodes — *"I'm Raissa, host of Deep Dives Podcast. I've interviewed 10+ founders past the pitch deck about what actually keeps the lights on. AMA."* AMAs get heavily archived by AI search.

Expected output: 10-20 organic comments per quarter that mention the show. Each compounds AI citation probability.

---

## 6. Submit to podcast directories (Raissa, 15 min one-time)

Every directory listing = a free authoritative backlink + brand mention. None of these cost anything.

- **[Listen Notes](https://www.listennotes.com/podcast-realm/submit/)** — heavily used by AI search engines as a source
- **[Podchaser](https://www.podchaser.com/lists/submit-a-podcast)** — community ratings + reviews
- **[Goodpods](https://goodpods.com/podcasts)** — younger demographic
- **[Player FM](https://player.fm/featured/submit)** — Android-leaning audience

Deep Dives is YouTube-only but these directories index the YouTube channel as the audio source. Listing on them = brand mention + backlink + entity validation.

---

## 7. Guest cross-promotion (Raissa, ~20 min per episode)

Every guest = 5-10 potential brand mentions if you make it frictionless for them to share.

After each episode publishes, send the guest a "share kit" with:
- 2-3 ready-to-paste social captions (LinkedIn, X, IG)
- 3-5 visual cards (use Canva once, template it forever)
- A 60-90 sec clip of their best line
- The episode link

If they share to LinkedIn (2K followers average), X (1K average), and a Substack (500 readers), each guest brings 3-5K new eyeballs that include the brand-phrase. **Brand mentions correlate 0.664 with AI citation** — these compound.

---

## 8. Track what works (Raissa or you, monthly)

Set up a 5-minute monthly check:

1. **Google Search Console → Performance** — note top queries the site appears for. Anything new?
2. **GA4** (or whatever analytics is wired) — filter referrer for `chatgpt.com`, `perplexity.ai`, `claude.ai`. AI-referred traffic is rare but high-converting (14.2% vs 2.8% organic per 2026 research).
3. **Manual AI check** — ask ChatGPT, Perplexity, Google AI Overviews:
   - "What is Deep Dives Podcast?"
   - "Best long-form interview podcasts 2026"
   - "Podcasts hosted by Raissa"
   - "Podcasts about immigrant founders"
4. Note where you're cited; note who's cited where you're not. Adjust topic focus accordingly.

Log this in a doc once a month. Trends emerge over quarters, not weeks.

---

## 9. Wikipedia (long horizon — do not attempt yet)

ChatGPT cites Wikipedia in **7.8% of all citations**. A Wikipedia article on "Deep Dives Podcast" would be a major AI-search lever.

**Don't try to create it.** Wikipedia editors aggressively reject self-created articles for "non-notable" subjects, and new podcasts are presumed non-notable. The article gets deleted within 24-48 hours and you're blacklisted from trying again.

Instead, build notability signals first:
- 2+ press placements in respected publications (Vulture, The Ringer, Vox, Substack newsletters)
- 1000+ subscribers
- 18-24 months of consistent shipping

At that point, **someone else** will likely create the article. Don't push it.

---

## Recap — the order

| Day | Action | Who | Time |
|---|---|---|---|
| Today | Submit sitemap to Google Search Console (#1) | Edmond | 30 sec |
| Today | Submit sitemap to Bing Webmaster (#2) | Edmond | 60 sec |
| This week | YouTube channel keywords + about description (#3) | Raissa | 10 min |
| This week | Submit to 4 podcast directories (#6) | Raissa | 15 min |
| Per upload going forward | New title + description template (#4) | Raissa | +10 min/upload |
| Ongoing | Reddit comments (#5) | Raissa | ~30 min/week |
| Each episode | Guest share kit (#7) | Raissa | 20 min/episode |
| Monthly | Tracking check (#8) | Either | 5 min/month |

**Total upfront time: ~30 minutes for you + ~30 minutes for Raissa.**
**Total ongoing: ~30 min/week for Raissa.**

Everything else (transcripts, show-notes upgrade, topic-cluster essays) waits until Raissa has time + content to provide. When she does, ping me and I'll ship the website side.
