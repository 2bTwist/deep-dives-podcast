# Phase 2 — Component Reuse & Duplication

**Scope:** every component in `src/components/` and every route in `src/app/`.
**Skipped:** `HeroMic.tsx`, `HeroMicCanvas.tsx`, `HeroMicSkeleton.tsx`, and any open WIP diff on `Hero.tsx` (per the 3D-hero plan).
**Method:** read each component end-to-end, compare JSX patterns across pages, count occurrences with grep when the same class string appears in 3+ places.

---

## Component-by-component summary

Single sentence each. The ones with notes have flags below.

- **`EpisodeThumb`** — client-side YouTube thumbnail with `maxres → sd → hq → mq` fallback. Used by Hero. Clean.
- **`EpisodeThumbStatic`** — server-rendered, always `sd`. Used in every grid. Clean. **Not a duplicate of `EpisodeThumb`** — different strategy, documented in docstring.
- **`DropCap`** — oversized italic Playfair initial, floats left. **Flag F4: absolute-sized, not heading-relative.**
- **`PullQuote`** — editorial quote with hung Allura curly glyph. Clean primitive.
- **`HandSignature`** — Allura script + hand-drawn underline. Clean.
- **`Reveal`** — IO-based fade-up wrapper, no motion lib. Clean. 12 importers — best-utilized primitive in the repo.
- **`NewBadge`** — slanted "NEW" stamp, auto-hides past `maxDaysOld`. Clean primitive.
- **`JsonLd`** — script-tag emitter for structured data, with `</script>` sanitation. Clean.
- **`Logo`** — D-monogram avatar + optional wordmark. Clean.
- **`SocialIcons`** — YouTube/IG/TikTok inline SVGs. Clean.
- **`MomentsStack`** — polaroid carousel with peel animation, autoplay, drag-to-advance, IO pause. Used once (`/about`). Self-contained.
- **`Header`** — sticky brand + nav + Subscribe pill + mobile overlay. Self-contained.
- **`Footer`** — three-column nav + social + legal. Internal repetition (footer links use the same underline-hover class block 4×) but local to one component, fine.
- **`Hero`** — magazine-cover hero (post-refactor `ca94cf5`). Now embeds `HeroMic` for the 3D widget. Skipped per WIP rule.
- **`ConversationsSection`** — home episode grid. **Flag F1 (episode card duplication).**
- **`CommunitySection`** — gold email-signup panel. **Flag F5 (form-success panel pattern).**
- **`WhyIStartedSection`** — home about-teaser with 4 value cards (Mic/Users/Globe/Heart). The 4 cards are local to this file. **Flag from Phase 1 (name no longer matches its current job — it's a teaser, not the narrative).**
- **`ContactForm`** — multi-field form with subject chips and success state. **Flag F5.**

---

## Flags (ranked by impact)

### F1. Episode card markup duplicated 4× — strongest extraction candidate

The exact same card chrome — `border border-rule bg-card transition-colors duration-300 hover:border-gold/40` plus the hover-grow thumbnail wrapper, the small gold play-badge on hover, the duration chip top-right, the `NewBadge`, the category eyebrow, the title heading — appears verbatim in:

| File | Heading tag | Grid columns | Notes |
|---|---|---|---|
| `src/components/site/ConversationsSection.tsx` (home) | `h3` | 4-col on lg | Wrapped in `<article>` |
| `src/app/episodes/page.tsx` | `h2` | 3-col on lg | No `<article>` |
| `src/app/episodes/[slug]/page.tsx` (related) | `h3` | 3-col on lg | No `<article>` |
| `src/app/guests/page.tsx` (latest) | `h3` | 4-col on lg | No `<article>`, no play badge |

That's four near-copies. The user's recent `68a91d3 Tweak: dial latest-episode card slightly smaller` already had to touch multiple places to dial card sizing — exactly the pain that duplication creates.

**Recommendation:** extract `<EpisodeCard episode={ep} headingLevel={2|3} showPlayBadge?={true} />` into `src/components/site/EpisodeCard.tsx`. Move the card chrome + thumbnail wrapper + chips + meta block into one component. Grid layout stays at the route level (each page can choose its column count). Heading semantics stay configurable via `headingLevel`.

**Impact:** future card design changes touch one file. Onboarding gets simpler.

### F2. `max-w-[1400px]` magic number — 43 occurrences across 17 files

Every section frame and most hairline rules carry the literal `max-w-[1400px]`. Plus the new `Hero.tsx` has `max-w-[1320px]` (your tighter hero). That's a magic number scattered everywhere, plus an inconsistency: 1320 in one place, 1400 in 42 others.

**Recommendation:** tokenize. Two cheap options:

(a) **Tailwind v4 `@theme` token.** Add to `src/app/globals.css`:
```css
@theme inline {
  --container-content: 1400px;
  --container-content-tight: 1320px;
}
```
Then `max-w-[var(--container-content)]` or define utility classes. Future width tuning is a single-file edit.

(b) **Re-export pattern.** Define `const CONTAINER = "max-w-[1400px]"` in a tiny module and import. Tailwind v4 is happier with the `@theme` route, so prefer (a).

**Impact:** zero behavioral change today. Big leverage the next time we want to dial the page narrower (the failed squeeze from earlier would have been a one-line change if this was tokenized — and the drop-cap break would still have happened, but the rollback would have been trivial).

### F3. Gold CTA button class strings duplicated 17× total

Two button styles repeat with the same class strings:

**Gold-filled primary CTA** (11 occurrences):
```
bg-gold px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.24em] text-ink
transition-colors duration-200 hover:bg-gold-bright
```
Used by: Subscribe-on-YouTube (header, footer, about, episodes list, etc.), Pitch a Guest, Get in Touch, Send Message, Join the List.

**Gold-outlined secondary CTA** (6 occurrences):
```
border border-gold px-7 py-3.5 ... text-gold ... hover:bg-gold/10
```
Used by: Browse Episodes (about), Meet Raissa (preview cards), etc.

**Recommendation:** `<Button variant="primary"|"secondary" href? onClick?>` in `src/components/site/Button.tsx`. Forwards either to `<a>` (external) or `<Link>` (internal). The 17 use-sites collapse to one-liners; brand button tuning happens in one place.

**Caveat:** the `/episodes` page has a one-off "View more on YouTube" button with YouTube-red hover state and a custom play glyph (`bg-youtube hover:shadow-[0_8px_24px_rgba(255,0,0,0.25)]`). Keep that as a one-off — its uniqueness is the point. Don't try to encode every variant.

**Impact:** medium. Every "let's tweak the CTA padding / typography / hover" request currently touches 11 files.

### F4. `DropCap` is absolute-sized, not heading-relative — already bit us

Current sizing:
```
text-[64px]  sm:text-[96px]  lg:text-[144px]
```

That works fine next to a `lg:text-[96px]` or larger heading (ratio ~1.5x). It **breaks** next to a `lg:text-[72px]` heading like the home `ConversationsSection` h2 — at 144px the C is 2x the surrounding text and doesn't fit inline at narrower container widths. That's exactly why the 1400 → 1320 squeeze cracked the layout.

**Recommendation:** add a `size?: "md" | "lg" | "xl"` prop. Three discrete steps:
- `md`: `text-[56px] sm:text-[80px] lg:text-[112px]` — for `lg:text-[56-72px]` headings (Conversations, Recent, Voices we feature)
- `lg` (default): current `text-[64px] sm:text-[96px] lg:text-[144px]` — for `lg:text-[96-120px]` heroes
- `xl`: `text-[80px] sm:text-[120px] lg:text-[180px]` — only if needed for a true page-cover

Then every DropCap caller picks the matching size, and the drop cap proportions never break.

**Impact:** unlocks future width experiments. Fixes the specific home-page break I caused.

### F5. Two FormSuccess panels share structure but live inline — minor

`ContactForm.tsx` and `CommunitySection.tsx` both render a "thank you / you're in" panel on submit with:
- small gold uppercase eyebrow
- big serif italic headline
- italic sub-paragraph

Different copy and color treatments (CommunitySection's lives inside a gold panel and inherits ink colors). Genuinely shared structure, only two callers.

**Recommendation:** leave it for now. If a third form arrives, extract `<FormSuccess eyebrow title body theme="ink|gold" />`. Two copies isn't worth abstracting yet.

### F6. Section frame skeleton repeated 20+ times — extract carefully or not at all

Every section uses some form of:
```jsx
<section className="relative [bg-surface|bg-ink]?">
  <div className="mx-auto max-w-[1400px] px-8 py-28 lg:px-10 lg:py-36">
    ...
  </div>
  <div aria-hidden className="mx-auto h-px max-w-[1400px] bg-rule" />
</section>
```

Vertical padding varies (`py-20|24|28|32|36|40`), backgrounds vary, the bottom hairline is sometimes omitted. Variability makes a clean `<SectionFrame>` abstraction tricky.

**Recommendation:** **don't extract yet.** Wait until F2 (`max-w` token) lands — that removes the most painful part of the duplication. The remaining `<section><div mx-auto px-... py-...>...</div></section>` skeleton is forgiving and readable inline. Re-evaluate after F2.

---

## Non-issues (came up clean)

- **EpisodeThumb vs EpisodeThumbStatic** — meaningfully different strategies (client maxres-fallback vs SSR fixed `sd`). The split is intentional and documented.
- **Reveal** — 12 importers, single responsibility, no variants creeping in. Best-utilized primitive in the codebase.
- **JsonLd / NewBadge / Logo / HandSignature / PullQuote / SocialIcons / DropCap-as-a-component** — all clean primitives with single concerns.
- **WhyIStartedSection internals** — 4 value cards (Mic/Users/Globe/Heart) are local to this file. Not duplicated elsewhere. Internal repetition is fine.
- **Footer link underline-hover** — 4 internal occurrences in `Footer.tsx`. Localized, readable, no cross-file leak.

---

## Punch list

| # | Item | Effort | Impact | Notes |
|---|---|---|---|---|
| F4 | Add `size` prop to `DropCap`, retrofit one home section | 30 min | High | Fixes the bug that blocked the width squeeze |
| F2 | Tokenize `max-w-[1400px]` via Tailwind v4 `@theme` | 30 min | High | One-file future width changes |
| F1 | Extract `<EpisodeCard>` from 4 grids | 1-2 hrs | High | Biggest duplication win in the repo |
| F3 | Extract `<Button variant>` primitive | 1 hr | Medium | 17 → 1 callsite |
| Phase 1 punch | (5 items, already listed) | < 1 hr total | Low | Cleanup, not load-bearing |

Suggested order if we implement: **F4 → F2 → F1 → F3.** F4 and F2 are foundation that makes future tweaks safer. F1 is the biggest pure cleanup. F3 last because the button class string is already terse and the win is incremental.

**Estimated total effort to retire all P1+P2 flags: half a day.** Not a tear-down. The codebase is in good shape — these are tidiness wins, not rescue surgery.

Proceed to Phase 3 (dead code, knip/ts-prune), or pick a punch item to implement first.
