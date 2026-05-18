import { notFound } from "next/navigation";
import { FadeUpDemo, HeroRevealDemo, MicroHoverButton } from "./MotionDemos";

export const metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

type Swatch = {
  name: string;
  hex: string;
  bg: string;
  text?: string;
  ratio?: string;
};

const surfaces: Swatch[] = [
  { name: "ink", hex: "#050505", bg: "bg-ink", text: "text-paper" },
  { name: "surface", hex: "#0d0b08", bg: "bg-surface", text: "text-paper" },
  { name: "card", hex: "#111111", bg: "bg-card", text: "text-paper" },
  { name: "deep-gray", hex: "#171717", bg: "bg-deep-gray", text: "text-paper" },
];

const brand: Swatch[] = [
  { name: "gold", hex: "#c8a25d", bg: "bg-gold", text: "text-ink", ratio: "8.62" },
  { name: "gold-bright", hex: "#e4b84f", bg: "bg-gold-bright", text: "text-ink", ratio: "11.20" },
  { name: "champagne", hex: "#e5d0a2", bg: "bg-champagne", text: "text-ink", ratio: "13.42" },
];

const text: Swatch[] = [
  { name: "paper", hex: "#ffffff", bg: "bg-paper", text: "text-ink", ratio: "20.4" },
  { name: "muted", hex: "#a7a7a7", bg: "bg-muted", text: "text-ink", ratio: "8.61" },
];

const displaySizes = [
  { label: "96 / leading 0.95", className: "text-[96px] leading-[0.95] -tracking-[0.01em]" },
  { label: "72 / leading 1.0", className: "text-[72px] leading-[1.0] -tracking-[0.01em]" },
  { label: "56 / leading 1.05", className: "text-[56px] leading-[1.05]" },
  { label: "40 / leading 1.1", className: "text-[40px] leading-[1.1]" },
  { label: "32 / leading 1.2", className: "text-[32px] leading-[1.2]" },
];

const bodySizes = [
  { label: "20 lede", className: "text-[20px] leading-[1.55]", italic: true },
  { label: "18 body", className: "text-[18px] leading-[1.55]" },
  { label: "16 body", className: "text-[16px] leading-[1.6]" },
  { label: "14 small", className: "text-[14px] leading-[1.6] text-sub" },
];

export default function StyleguidePage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return (
    <main className="min-h-screen text-paper">
      {/* Top bar — editorial masthead */}
      <header className="border-b border-rule">
        <div className="mx-auto flex max-w-content items-end justify-between px-10 pb-6 pt-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-gold">Deep Dives</p>
            <h1 className="mt-2 font-display text-[40px] leading-[1.0]">
              Design <span className="italic font-light">System</span>
            </h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.28em] text-muted">Internal · not indexed</p>
            <p className="mt-1 font-body italic text-sub text-[12px]">v0 — foundation pass</p>
          </div>
        </div>
      </header>

      {/* SECTION I — Foundations */}
      <Section number={0} title="Foundations" subtitle="What every page in this site is built from.">
        <Subhead>Surfaces</Subhead>
        <div className="grid grid-cols-2 gap-px bg-rule md:grid-cols-4">
          {surfaces.map((s) => (
            <Swatch key={s.name} s={s} />
          ))}
        </div>

        <Subhead className="mt-16">Brand</Subhead>
        <div className="grid grid-cols-1 gap-px bg-rule md:grid-cols-3">
          {brand.map((s) => (
            <Swatch key={s.name} s={s} />
          ))}
        </div>

        <Subhead className="mt-16">Text</Subhead>
        <div className="grid grid-cols-2 gap-px bg-rule">
          {text.map((s) => (
            <Swatch key={s.name} s={s} />
          ))}
        </div>
      </Section>

      {/* SECTION II — Typography */}
      <Section number={1} title="Typography" subtitle="Playfair display · Fraunces body · Allura script.">
        <div className="grid gap-16 lg:grid-cols-[3fr_2fr]">
          <div>
            <Subhead>Display · Playfair</Subhead>
            <div className="space-y-5">
              {displaySizes.map((s) => (
                <div key={s.label} className="border-l border-rule pl-6">
                  <p className="font-body text-[10px] uppercase tracking-[0.22em] text-muted">{s.label}</p>
                  <p className={`font-display ${s.className} mt-1`}>Deep Dives</p>
                </div>
              ))}
            </div>

            <Subhead className="mt-16">Body · Fraunces</Subhead>
            <div className="space-y-5">
              {bodySizes.map((s) => (
                <div key={s.label} className="border-l border-rule pl-6">
                  <p className="font-body text-[10px] uppercase tracking-[0.22em] text-muted">{s.label}</p>
                  <p className={`font-body ${s.className} ${s.italic ? "italic" : ""} mt-1`}>
                    Genuine conversations that inspire, educate, and empower.
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — wordmark + an A24-style ALL-CAPS variant */}
          <div className="space-y-12">
            <div>
              <Subhead>Script wordmark · Allura</Subhead>
              <div className="border-l border-rule pl-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted">
                  Hero — mixed case + italic
                </p>
                <div className="mt-6">
                  <p className="font-display text-[88px] leading-[0.95] -tracking-[0.01em]">Deep Dives</p>
                  <p className="font-script text-gold text-[88px] leading-[0.85] -mt-3 -ml-1">Podcast</p>
                </div>
                <p className="mt-6 font-body italic text-sub text-[13px] max-w-xs">
                  The Kinfolk treatment — restrained, single-flourish, used only for the show name.
                </p>
              </div>
            </div>

            <div>
              <Subhead>All-caps title · A24 variant</Subhead>
              <div className="border-l border-rule pl-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted">
                  Section + episode titles — uppercase Playfair
                </p>
                <div className="mt-6">
                  <p className="font-display uppercase text-[64px] leading-[0.95] tracking-[0.01em]">
                    Conversations
                  </p>
                  <p className="font-display uppercase italic font-light text-[64px] leading-[0.95] tracking-[0.04em] text-sub">
                    That Matter
                  </p>
                </div>
                <p className="mt-6 font-body italic text-sub text-[13px] max-w-xs">
                  Reserve for section masthead + episode titles. All-caps Playfair carries the
                  cinematic weight; the italic counterpoint keeps it editorial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* SECTION III — Components */}
      <Section number={2} title="Components" subtitle="Primitive shapes composed into every section.">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <Subhead>Buttons</Subhead>
            <div className="flex flex-wrap items-center gap-4">
              <button className="inline-flex items-center gap-3 bg-gold px-7 py-3 text-[12px] font-medium uppercase tracking-[0.22em] text-ink">
                Watch Latest Episode <span className="text-[14px]">→</span>
              </button>
              <button className="inline-flex items-center gap-3 border border-gold px-7 py-3 text-[12px] font-medium uppercase tracking-[0.22em] text-gold">
                Explore Episodes
              </button>
              <button className="inline-flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.22em] text-paper">
                <span className="rule-gold w-8 mr-2 mt-px" /> Read more
              </button>
            </div>
          </div>

          <div>
            <Subhead>Eyebrow + headline</Subhead>
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-gold">II — Latest Episodes</p>
              <h3 className="mt-3 font-display text-[44px] leading-[1.05] -tracking-[0.005em]">
                Conversations <span className="italic font-light">That Matter</span>
              </h3>
              <p className="mt-3 max-w-md font-body italic text-sub text-[18px] leading-[1.55]">
                Real people. Unfiltered stories. Long-form on purpose.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <Subhead>Episode card · asymmetric grid (A24-inspired)</Subhead>
            <div className="grid grid-cols-12 gap-px bg-rule">
              {/* Featured — wide 16:9 left */}
              <article className="col-span-12 lg:col-span-7 bg-ink p-10">
                <div className="aspect-[16/9] bg-deep-gray mb-8 flex items-end p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted">
                    16 : 9 · YouTube maxres
                  </p>
                </div>
                <div className="rule-gold w-10" />
                <p className="mt-5 text-[10px] uppercase tracking-[0.32em] text-gold">Featured</p>
                <h4 className="mt-3 font-display text-[40px] leading-[1.05] tracking-[-0.005em]">
                  From Nurse to <span className="italic font-light">Fashion CEO</span>
                </h4>
                <p className="mt-5 font-body italic text-sub text-[16px] leading-[1.5] max-w-md">
                  Aida Diallo on building a brand from zero, the night-shift years, and what nobody
                  tells you about leaving healthcare.
                </p>
                <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
                  Episode 142 · 38:12
                </p>
              </article>

              {/* Two stacked sibling cards — taller 4:5 portraits */}
              <div className="col-span-12 grid grid-cols-1 gap-px bg-rule lg:col-span-5">
                {[
                  { eyebrow: "Faith & Purpose", title: "Why I Walked Away From Everything", meta: "Marc Owens · 41:48", n: "141" },
                  { eyebrow: "Career", title: "The Secret World of Lobbying", meta: "Tessa Park · 39:28", n: "140" },
                ].map((c, i) => (
                  <article key={i} className="bg-ink p-8">
                    <div className="aspect-[4/5] bg-deep-gray mb-6 flex items-end p-4">
                      <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-muted">
                        4 : 5 · portrait crop
                      </p>
                    </div>
                    <div className="rule-gold w-8" />
                    <p className="mt-4 text-[10px] uppercase tracking-[0.32em] text-gold">{c.eyebrow}</p>
                    <h4 className="mt-2 font-display text-[22px] leading-[1.15]">{c.title}</h4>
                    <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
                      Episode {c.n} · {c.meta.split(" · ")[1]}
                    </p>
                  </article>
                ))}
              </div>
            </div>
            <p className="mt-5 font-body italic text-sub text-[13px] max-w-2xl">
              Alternating aspect ratios prevent scroll monotony (A24). Hairline gold dividers replace the
              soft gradients that read as podcast-template. One featured story carries narrative weight;
              siblings support without competing.
            </p>
          </div>
        </div>
      </Section>

      {/* SECTION IV — Motion */}
      <Section number={3} title="Motion" subtitle="Staggered page-load reveal on the hero. Scroll-triggered fade on sections. Subtle hover lift on chrome. Nothing else.">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <Subhead>Hero page-load reveal · staggered</Subhead>
            <div className="border-l border-rule pl-6">
              <HeroRevealDemo />
            </div>
            <p className="mt-6 font-body italic text-sub text-[13px] max-w-md">
              Children stagger by 120ms after a 100ms delay. Reload the page to see it fire.
            </p>
          </div>
          <div>
            <Subhead>Scroll fade · `fadeUp`</Subhead>
            <FadeUpDemo />
            <Subhead className="mt-12">Hover lift · `microHover`</Subhead>
            <div className="flex items-center gap-6">
              <MicroHoverButton />
              <p className="font-body italic text-sub text-[13px]">0.2s · gentle · -2px lift</p>
            </div>
          </div>
        </div>
      </Section>

      <footer className="border-t border-rule">
        <div className="mx-auto max-w-content px-10 py-10">
          <p className="font-body italic text-sub text-[12px]">
            Tokens · <span className="font-mono not-italic text-paper">src/app/globals.css</span>.
            Motion · <span className="font-mono not-italic text-paper">src/lib/motion.ts</span>.
            North star · <span className="font-mono not-italic text-paper">reference/vision-mockup.png</span>.
          </p>
        </div>
      </footer>
    </main>
  );
}

/* ============================ small primitives ============================ */

function Section({
  number,
  title,
  subtitle,
  children,
}: {
  number: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-rule">
      <div className="mx-auto max-w-content px-10 py-24">
        <div className="mb-14 grid gap-8 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted">
              {String(number + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-4 font-display uppercase text-[44px] leading-[0.95] tracking-[-0.01em]">
              {title}
            </h2>
          </div>
          <p className="font-body italic text-sub text-[20px] leading-[1.45] max-w-xl self-end">
            {subtitle}
          </p>
        </div>
        {children}
      </div>
    </section>
  );
}

function Subhead({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mb-6 flex items-center gap-3 ${className}`}>
      <span className="rule-gold w-6" />
      <p className="text-[10px] uppercase tracking-[0.32em] text-paper">{children}</p>
    </div>
  );
}

function Swatch({ s }: { s: { name: string; hex: string; bg: string; text?: string; ratio?: string } }) {
  return (
    <div className={`${s.bg} ${s.text ?? "text-paper"} relative px-6 py-10`}>
      <p className="font-display text-3xl">Aa</p>
      <div className="mt-12 flex items-baseline justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em]">{s.name}</p>
        <p className="font-mono text-[11px]">{s.hex}</p>
      </div>
      {s.ratio && <p className="mt-1 font-mono text-[10px] opacity-70">{s.ratio} : 1 vs ink</p>}
    </div>
  );
}
