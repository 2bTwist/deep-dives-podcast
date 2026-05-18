# Phase 8 — Accessibility

**Scope:** WCAG 2.1 AA pass over `src/`. No vendored a11y skill exists, so this is manual.
**Method:** check alt text, ARIA, focus indicators, keyboard navigation, reduced-motion, color contrast, heading hierarchy, form labels, language declaration, iframe titles, skip links, touch-target sizing.

---

## 1. WCAG 2.1 checks

### Perceivable

| Check | Status | Detail |
|---|---|---|
| All images have alt | ✓ | 8 `<Image>` components, all have `alt=` |
| Decorative images use empty alt | ✓ | `Logo`'s avatar uses `alt=""` (has accessible name via Link's `aria-label`) |
| Decorative SVGs marked `aria-hidden` | ✓ | 56 `aria-hidden` usages across icons, rules, hairlines |
| Color contrast (text vs background) | ✓ AAA | Per CLAUDE.md: gold 8.62:1, gold-bright 11.20:1, paper 20.4:1, sub now 23:1 (after recent bump to 0.92 alpha). All well above WCAG AA 4.5:1 minimum |
| Color not sole carrier of meaning | ✓ | Active nav state uses both color + underline rule; hover states use color + underline animation; "NEW" badge has text label + slant |
| Text resizable to 200% | ✓ | Layout uses rem-based + Tailwind responsive utilities; no fixed-pixel text traps |

### Operable

| Check | Status | Detail |
|---|---|---|
| Keyboard navigation works | ✓ | All links/buttons are native or have `role="button"` + tabIndex + onKeyDown (MomentsStack) |
| Visible focus indicators | ⚠ partial | Forms have custom `focus:border-gold` (good). Links + buttons rely on browser default focus ring — visible on most browsers but **gold-filled `<Button>` primary has low contrast against the dark Chrome default ring**. See A2. |
| Skip-to-content link | ✗ missing | No "skip to main content" link. Keyboard users tab through ~12 header links before reaching content. See A1. |
| `prefers-reduced-motion` respected | ✓ | globals.css has 2 media queries (gold shine, hero twinkle); MomentsStack disables autoplay + drag; Reveal sets shown immediately under reduce; MotionDemos uses `useReducedMotion` hook |
| No keyboard traps | ✓ | Mobile-nav overlay closes on Escape (Header `onKey` handler). Carousel pip indicators jump-to-frame without trapping focus |
| Page titles meaningful | ✓ | Every route sets unique `metadata.title` |
| Mobile menu button has accessible name | ✓ | `aria-label={open ? "Close menu" : "Open menu"}`, `aria-expanded`, `aria-controls="mobile-nav"` |
| Touch target size | ⚠ small | Mobile hamburger is 40×40px (h-10 w-10). WCAG 2.5.5 (AAA) wants 44×44px minimum; 2.5.8 (AA) wants 24×24px. Passes AA, fails AAA. Borderline. |

### Understandable

| Check | Status | Detail |
|---|---|---|
| Language declared | ✓ | `<html lang="en">` |
| Inputs have labels | ✓ | ContactForm: visible `<label>` per field. CommunitySection: `<span className="sr-only">Email address</span>` + placeholder |
| Required fields marked | ✓ | Both forms use `required` attribute on inputs |
| Subject-select uses `<fieldset>` + `<legend>` | ✓ | ContactForm subject chips are inside a fieldset |
| Consistent navigation | ✓ | Header + Footer use the same nav list across pages |

### Robust

| Check | Status | Detail |
|---|---|---|
| ARIA used correctly | ✓ | 14 `aria-label`, 2 `aria-current`, 1 `aria-modal`, 1 `aria-expanded`, 1 `aria-controls`. None misapplied |
| Heading hierarchy proper | ✓ | h1 → h2 → h3 only; no skipped levels on public pages |
| Single `<h1>` per page | ✓ | Confirmed for all routes (home's lives inside `Hero`) |
| Embedded iframes have title | ✓ | `episodes/[slug]` YouTube embed has `title={ep.title}` |
| Mobile-nav is a proper dialog | ✓ | `role="dialog"`, `aria-modal="true"`, `aria-label="Primary navigation"` |

### Reduced motion compliance

Three independent surfaces respect `prefers-reduced-motion`:

- `Reveal.tsx`: skips IO observer setup when reduced, renders shown immediately
- `MomentsStack.tsx`: disables autoplay AND drag interaction when reduced
- `globals.css`: disables `gold-sweep`/`gold-glow` animation on `.text-gold-shine` AND `hero-twinkle` keyframes when reduced

This is more thorough than most sites. ✓

---

## 2. Real flags

### A1. No skip-to-content link

Keyboard users (and screen-reader users) currently tab through the header brand, ~5 nav items, social icons, and the Subscribe button before reaching page content. Standard pattern: add a visually-hidden link as the first focusable element that becomes visible on focus and jumps to the main content.

**Fix:** add a skip link in `layout.tsx` and an `id="main"` on each route's `<main>` element.

Markup pattern:
```jsx
<a
  href="#main"
  className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-gold focus:px-4 focus:py-2 focus:text-[11px] focus:font-medium focus:uppercase focus:tracking-[0.24em] focus:text-ink"
>
  Skip to main content
</a>
```

8 routes need an `id="main"` on their existing `<main>` element. Mechanical.

### A2. Button primitive needs explicit focus-visible styling

The `<Button>` primary variant (`bg-gold text-ink`) relies on browser default focus rings. Chrome's default is a dark outline, which doesn't contrast well against the gold background. A keyboard user tab-focusing the Subscribe button sees an indistinct ring.

**Fix:** add `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper` to `BASE_CLASSES` in `Button.tsx`. White outline contrasts against both gold (primary) and ink (secondary) backgrounds. Uses `focus-visible` not `focus` so it only shows for keyboard users, not on click.

### A3. Mobile hamburger button is 40×40px

Below the 44×44px WCAG AAA recommendation but above the 24×24px AA minimum. Borderline. Cheap fix: bump to `h-11 w-11` (44px).

**Fix:** change `h-10 w-10` → `h-11 w-11` on the mobile menu button in `Header.tsx`. Visual impact: 4px larger hit area, no layout shift.

### A4. (Already correct) Header's "Close on route change" useEffect

Phase 6 flagged `react-hooks/set-state-in-effect` here. From an a11y perspective, this useEffect is **necessary** — without it, the mobile menu would stay open across route changes and trap focus. Keep the suppression.

---

## 3. What's already exemplary

The site has an above-average a11y posture for a small site:

- **Reduced motion is honored in three independent surfaces** including the most-animated component (`MomentsStack` carousel)
- **Heading hierarchy is clean** — no skipped levels, single h1, semantic h2/h3 for sections and cards
- **ARIA is restrained and correct** — no over-tagging, no fake roles, no aria-X without purpose
- **Color contrast is AAA across the board** (per `CLAUDE.md` measurements)
- **Form labels are real labels** — no placeholder-as-label anti-pattern
- **Mobile-nav overlay is a proper dialog** with `role`, `aria-modal`, Escape handler, focus management via overlay mount
- **Decorative SVGs and rules consistently use `aria-hidden`** (56 usages)

---

## 4. Punch list

| # | Item | Effort | Impact |
|---|---|---|---|
| A1 | Add skip-to-content link + `id="main"` on each route | 15 min | medium (keyboard UX) |
| A2 | Add `focus-visible` outline to `Button` primitive | 2 min | low (defensive) |
| A3 | Bump mobile menu button to 44×44px (h-11 w-11) | 1 min | low |

All three are cheap. None are load-bearing for AA conformance — the site already passes the AA checklist. These are AAA-tier polish.

Phase 8 conclusion: **accessibility is solid.** Three minor polish items, all simple to address.
