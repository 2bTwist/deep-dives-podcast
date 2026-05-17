# Perf log

Median across 3 Lighthouse runs against the live URL (`scripts/lh.mjs https://deepdives237.com`). Mobile profile (4G + 4× CPU throttle) unless noted.

Format: commit hash | perf score | LCP | FCP | TBT | CLS | notes.

---

## 2026-05-17 — baseline before Phase 1+5

`caa1c8e` (Lighthouse run from this session, pre-deploy of new perf commits):

| Metric | Value | Status |
|---|---|---|
| Perf score | 85 | needs improvement |
| LCP | 3.9 s | needs improvement (target ≤ 2.5s) |
| FCP | 1.8 s | needs improvement (target ≤ 1.8s) |
| TBT | 40 ms | good |
| CLS | 0 | good |
| TTFB | ~80 ms | good |
| LCP element | `<span>Deep Dives</span>` h1 | — |
| LCP element render delay | 2136 ms | the smoking gun |

Notes: handoff claimed element render delay went 2273ms → 150ms after the "strip motion from home critical path" commit, but live measurement showed 2136ms. Diagnosis: Fraunces + Allura were `display:swap` with `preload:false`, causing late font swap on h1 LCP.

## 2026-05-17 — after deploy of font fix + Speed Insights + ISR

`3b71129` (deploy includes: Fraunces+Allura `display:optional`, Speculation Rules, OG to JPG, Vercel Speed Insights, ISR revalidate 5m/1h):

3 sequential runs against `https://deepdives237.com` immediately post-deploy:

| Run | Perf | LCP | FCP | Speed Idx | TBT | CLS | ERD |
|---|---|---|---|---|---|---|---|
| 1 (cold edge) | 85 | 3.9 s | 1.8 s | 3.9 s | 20 ms | 0 | 2171 ms |
| 2 (warming) | 88 | 3.7 s | 1.8 s | 2.5 s | 20 ms | 0 | 1160 ms |
| 3 (hot) | **98** | **2.4 s** | **0.9 s** | **0.9 s** | 20 ms | 0 | **137 ms** |

**Median LCP: 3.7 s. Best: 2.4 s. The 137ms ERD on run 3 matches the 150ms number the previous handoff originally claimed for this fix.**

Interpretation: Lighthouse spawns a fresh Chrome per run, so it pays the cost of cold DNS / cold TCP / cold edge cache on run 1. By run 3 the connection pool and edge cache are warm, which is what real-world repeat visitors experience. First-time visitors on a cold edge could still see ~3.5s LCP. Vercel Speed Insights (just landed) will give us real-user p75 within 24-48h to tell the truthful story.

Top remaining opportunity per LH: "Reduce unused JavaScript — est savings of 26 KiB." Worth chasing if cold-edge LCP stays above 2.5s in the field.

Phase status:
- Phase 0 (deploy + measure) ✓
- Phase 1 (Speed Insights) ✓ shipped, data pending
- Phase 2 (preload portrait) ✓ already done by `next/image priority`
- Phase 3 (drop Allura) — ruled out by Edmond, brand non-negotiable
- Phase 4 (drop Fraunces) — ruled out, same
- Phase 5 (ISR revalidate) ✓ shipped
- Phase 6 (LH CI on PRs) — pending; GitHub App now installed so unblocked
- Phase 7 (Cloudflare proxy) — deferred
