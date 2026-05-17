# Editorial design pass — 2026-05-17

Goal: replace the AI-generic "small uppercase kicker + big serif title" pattern that recurs across the site with a stronger visual structure, and add a small set of editorial moments (badges, ornaments, signature treatments) that no template would have. **Focus is layout/hierarchy, not copy.**

Output is a phased plan. No code ships without Edmond approving Phase 1 first.

## Context

Edmond shared the show's positioning this session (Cameroonian voices, entrepreneurs and immigrants, long-form). That's useful background but **this plan deliberately does NOT lean on identity-decoration** — no Adinkra motifs, no Yaoundé route metaphors, no Cameroon-themed ornaments. The brand personality should be earned by *good editorial design* that any sophisticated publication would do, not by Cameroon-themed decoration. The cultural identity is in the content; the structure stays universal.

## Diagnosis: the current site

The site renders **eleven instances** of the kicker-over-title pattern. The kicker is always the same recipe: `font-body uppercase tracking-[0.32em] text-gold` over a giant Playfair title. Same font family (or perceptually-similar), same color, same scale ratio. The pattern reads as "section header from a Squarespace template," not "publication with a voice."

| # | File | Line | Kicker copy | Verdict |
|---|---|---|---|---|
| 1 | `src/components/site/Hero.tsx` | 30 | `Real Stories. Real People. Real Impact.` | Kill — corporate filler |
| 2 | `src/components/site/Hero.tsx` | 113-118 | `Vol. 03` + `2026` | **Was placeholder, not real data.** Either give it real meaning (issue number tied to a real cadence + a real date) or drop it. |
| 3 | `src/components/site/Hero.tsx` | 134 | `Featured Episode` | Replace with episode no. + date |
| 4 | `src/components/site/ConversationsSection.tsx` | 24 | `Latest Episodes` | Replace with numbered marker |
| 5 | `src/components/site/WhyIStartedSection.tsx` | 61 | `The Founder` | Kill (portrait + signature do this) |
| 6 | `src/components/site/WhyIStartedSection.tsx` | 89 | `About Raissa` | Replace with numbered marker |
| 7 | `src/components/site/CommunitySection.tsx` | 31 | `The Community` | Replace with stamp treatment |
| 8 | `src/app/about/page.tsx` | 63 | `About the show` | Kill (page is named About) |
| 9 | `src/app/about/page.tsx` | 100 | `The Host` | Kill (same reason as #5) |
| 10 | `src/app/about/page.tsx` | 119 | `The manifesto` | Replace with inline lead-in clause |
| 11 | `src/app/about/page.tsx` | 167 | `What we cover` | Replace with numbered marker |
| 12 | `src/app/about/page.tsx` | 203 | `Where to listen` | Replace with numbered marker |
| 13 | `src/app/episodes/page.tsx` | 37 | `Latest Episodes` | Replace with footnote datum |
| 14 | `src/app/episodes/page.tsx` | 100 | `The Full Archive` | Replace with footnote datum |

The one place where numeric markers exist already and are working (`about/page.tsx:184`, `01`–`07` inside the topics grid) should be amplified, not changed.

## References analyzed (the 7 in `reference/refs/`)

| Reference | Editorial pattern worth stealing |
|---|---|
| `kinfolk.png` | **Issue number set in the same serif at the same size as the title** ("ISSUE 59 / THE CLEAN ISSUE"). The "kicker" and title are a unit, not a hierarchy. |
| `monocle.png` | **Masthead row** — wordmark flanked by dated metadata blocks (`Currently being edited`, `Daily inbox intelligence`). Section headers as mini-mastheads. |
| `a24.png` | **No kicker** — large title with tiny year stamp baseline-right. Scale ratio is the contrast (96px : 11px). Tape stickers + brand wordmark provide personality. |
| `diaryofaceo.png` | **Real date as the kicker** ("NOVEMBER 22, 2024" above the title). Tag pills below for taxonomy. |
| `nowness.png` | **Dates beat categories.** Replace "Latest Episodes" with the actual most recent date. Restraint is the personality. |
| `masterclass.png` | A single short colored rule as a kicker substitute. Semantically empty but visually anchoring. |
| `appletv.png` | The content's own visual identity is the kicker — YouTube thumbnails already do that work on Deep Dives. |

## Part C — Typography hierarchy: three patterns

### Option 1 (RECOMMENDED) — The volume marker

Number set huge in Playfair italic at the same x-height as the title's cap line, flush-left, gold, baseline-aligned with the title. Replaces both the kicker and any divider. A hairline gold rule (the existing `rule-gold` utility) extends from the number to the page edge.

```
N° 02 ───────────────────────────────────────────
       Conversations
       that matter.
                                 12 May · 26 min
```

Number set in `font-display italic` at `text-[88px]` (matching hero h1 scale on home; `text-[64px]` on subsections) in `text-gold`. Title stays Playfair italic. *Date and runtime move to the right side of the rule* as Monocle-style metadata. This pattern repeats with the number incrementing across every section on a page, so the homepage reads `N° 01 Deep Dives`, `N° 02 Conversations`, `N° 03 Why I Started`, `N° 04 The Community` — like chapters in an issue.

**Inspired by:** Kinfolk's issue-number-as-co-equal-with-title, Monocle's masthead structure, A24's scale-ratio metadata.

**Why this one.** Highest-leverage single change. Removes the redundant label, gives the brand a Kinfolk-grade editorial signature, and turns the homepage into an *issue you scroll through*. It's pure layout — no copy edits required, no cultural decoration, just a stronger structural primitive that repeats.

### Option 2 — Inline lead-in clause

No stacked kicker. The label becomes a *script-italic clause* set inline with the title, separated by an em-dash or whitespace, smaller than the title.

```
the manifesto —  The questions
                 short form skips.
```

Lead-in in `font-script` Allura at `text-[28px]`, baseline-aligned with the title's first word. Color: `text-champagne` for the lead-in, `text-paper` for the title. The existing `with Raissa` treatment at `Hero.tsx:43-48` already proves this pattern works — we're just reusing it.

**Use sparingly:** about-page manifesto, and one or two other voice-driven sections.

### Option 3 — Footnote datum

Just the title. Metadata that the kicker carried (date, episode count, location) moves to the right of the title on the baseline, small italic.

```
Recent Conversations.    47 episodes · since Sept '24
```

Title at current size; metadata in `font-body italic text-[13px] text-muted` with `tabular-nums`. Inspired by A24.

**Use:** episodes index page where info density already does the work.

## Part D — Brand personality moments

Picked for Deep Dives' actual positioning (Cameroonian/diaspora long-form), not generic.

**Phase 2 priority (ship together):**

1. **Slanted gold "NEW" stamp on the latest episode card.** Edmond's idea. Absolute-positioned, `rotate-[-8deg]`, gold hairline border, hollow interior, `font-body uppercase tracking-[0.24em] text-[11px]`. Top-right corner of the featured-episode card. Show only for episodes < 14 days old. ~30 min.

2. **Pull-quote treatment.** Pick one line from Raissa's narrated copy on `/about` and on `WhyIStartedSection`. Pull it out: `font-display italic text-[44px]`, hung left with a single oversized opening curly quote in Allura script (gold, half-opacity, sitting in the left margin). The opening quote glyph is the personality moment. ~1.5 hr. **Most underused win on the site — Raissa's voice should literally pop out of the page.**

3. **Hand-set Raissa signature.** Below the manifesto, a single `Raissa` in Allura script at `text-[64px]` gold, with a thin gold underline drawn in SVG (so it can be slightly imperfect/wavy, not a clean CSS border). ~1 hr. **This is the moment the site goes from "podcast website" to "a host who actually shows up."**

4. **Date-stamp ornament on episode cards.** Replace the isolated `Mar 4, 2026` line at `ConversationsSection.tsx:84` with a stamped treatment: small gold-outlined rectangle, two lines (`MAR / 04`), top-left of the thumbnail. Postal-cancellation feel. ~1 hr.

**Phase 3 ornamental (one at a time with screenshot review):**

5. **DPDP monogram as system primitive.** Small (32px) gold monogram glyph used as a section terminator — drop centered between sections. ~1 hr.

6. **Drop the fake `Vol. 03 / 2026` block entirely.** Edmond's decision this session. The hero card top corners free up; we either leave them empty (cleaner) or put a real datum there later (episode count, duration, runtime — but not until something *real* is being tracked).

7. **Single marquee strip between sections.** Thin (~40px) gold-on-ink horizontal strip scrolling: `Deep Dives — long-form conversations — N° 01 · N° 02 · N° 03 · N° 04 — @DeepDives237 —`. Used exactly once on the home page (between `WhyIStartedSection` and `CommunitySection`). Pause on hover. Respects `prefers-reduced-motion`. ~2 hr.

8. **Footnote numerals in body copy.** Where the manifesto has multiple paragraphs (`about/page.tsx:126-144`), prefix each with a tiny superscript number in gold (`¹ ² ³ ⁴`) in Playfair italic. Reads like an essay, not a blog post. ~30 min.

9. **Hover-triggered glyph reveal on wordmark.** Header `DPDP` wordmark; on hover, `Deep Dives Podcast` fades in beneath in Allura script. ~1 hr.

**Phase 4 / deferred (don't ship yet):**

- Custom interview cursor — risk of feeling gimmicky.
- Hand-drawn doodles — off-brand for "long-form."

(Copy edits are out of scope for this plan. Tier 1 of `specs/POST_REVEAL_TODO.md` covers them and they're Raissa's call post-reveal. This plan ships structural improvements that work with the current copy as-is.)

## Phasing

### Phase 1 — Typography reset (1-2 days)

Implement Option 1 (volume markers) on every section marked "Replace" in the diagnosis table. Delete the kickers marked "Kill." Adopt Option 2 (inline lead-in) on the about-page manifesto only. Adopt Option 3 (footnote datum) on the episodes-index headers only. Also: decide what the hero `Vol. 03 / 2026` block should track — or drop it.

This single phase resolves the AI-generic complaint. Nothing else strictly required.

### Phase 2 — Personality moments (2-3 days)

Ship the four highest-leverage moments together: slanted NEW stamp, pull-quote treatment, hand-set Raissa signature, date-stamp episode ornaments. Each one adds a Deep-Dives-specific moment that no template would have.

### Phase 3 — Ornamental layer (1-2 days, optional, screenshot-reviewed per item)

DPDP monogram, real masthead row (post-positioning-decision), single marquee strip, footnote numerals, wordmark hover reveal. One at a time, not as a batch.

### Phase 4 — Deferred

Custom cursor, anything else that emerges during Phase 1/2 review.

## Verification protocol

After each phase, per the project quality bar (`CLAUDE.md`): screenshot every changed section at 390/768/1440px, compare against `reference/vision-mockup.png` and the curated refs, Edmond reviews and signs off before next phase.

## Hand-off

Edmond decides:
1. Green light on Option 1 (volume markers) as the dominant typography pattern? (Or pick Option 2 or 3.)
2. Green light on the four Phase 2 personality moments?

Decision already made this session: `Vol. 03 / 2026` is dropped entirely (Phase 1).

Then `/implement specs/plans/2026-05-17-editorial-design-pass.md` for Phase 1.
