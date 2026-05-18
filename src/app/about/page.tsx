import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { DropCap } from "@/components/site/DropCap";
import { PullQuote } from "@/components/site/PullQuote";
import { HandSignature } from "@/components/site/HandSignature";
import { MomentsStack, type Moment } from "@/components/site/MomentsStack";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbSchema, personSchema, podcastSeriesSchema, siteUrl } from "@/lib/seo";

export const revalidate = 3600;

const CHANNEL_URL = "https://www.youtube.com/@DeepDives237";

const topics = [
  "Entrepreneurship",
  "Career",
  "Finance",
  "Relationships",
  "Faith",
  "Creativity",
  "Immigrant Journeys",
];

const MOMENTS: Moment[] = [
  { src: "/brand/moments/01.jpg", alt: "Raissa at dusk on a velvet sofa, draped in a faux-fur coat", vol: "I", tag: "After hours" },
  { src: "/brand/moments/02.jpg", alt: "Raissa on a bouclé chair with framed art behind", vol: "II", tag: "Between takes" },
  { src: "/brand/moments/03.jpg", alt: "Raissa beside a botanical wall in red and white", vol: "III", tag: "Off the record" },
  { src: "/brand/moments/04.jpg", alt: "Raissa against pleated velvet in soft plum light", vol: "IV", tag: "Quiet hours" },
];

export const metadata: Metadata = {
  title: "About",
  description:
    "A letter from Raissa, host of Deep Dives. What the show is about, who it's for, and where to find every long-form conversation on YouTube.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          podcastSeriesSchema(),
          personSchema(),
          breadcrumbSchema([
            { name: "Home", url: siteUrl() },
            { name: "About", url: `${siteUrl()}/about` },
          ]),
        ]}
      />
      <Header />
      <main>
        {/* 1. A Letter from Raissa. */}
        <section className="relative">
          <div className="mx-auto max-w-[1400px] px-8 py-28 lg:px-10 lg:py-36">
            <Reveal>
              <h1 className="break-words font-display text-[56px] leading-[0.96] tracking-[-0.02em] sm:text-[80px] lg:text-[112px]">
                <DropCap letter="A" /> Letter
                <span className="block italic font-light text-sub">from Raissa.</span>
                <span className="clear-both block" />
              </h1>
            </Reveal>

            <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-20">
              {/* Letter body */}
              <Reveal delay={0.05} className="order-2 lg:order-1 lg:col-span-7">
                <p className="font-display italic text-[30px] leading-[1.2] text-paper lg:text-[36px]">
                  Dear Reader,
                </p>

                <div className="mt-10 space-y-7 font-body text-paper text-[19px] leading-[1.75]">
                  <p>
                    I&rsquo;m Raissa, and Deep Dives is the show I made because the conversations
                    I most wanted to hear weren&rsquo;t happening anywhere. Not in a clip. Not in
                    a thread. Not on a stage with a timer running.
                  </p>
                  <p>
                    So I built the room. Two chairs, a mic, and the time to let a person finish a
                    thought. The first time a guest told me something they&rsquo;d never said out
                    loud before, I knew the show was working.
                  </p>
                </div>

                <PullQuote>
                  Where the camera doesn&rsquo;t cut when the truth gets quiet.
                </PullQuote>

                <div className="space-y-7 font-body text-paper text-[19px] leading-[1.75]">
                  <p>
                    The guests aren&rsquo;t celebrities. They&rsquo;re founders who can name the
                    month their company nearly died. Planners who can tell you what a wedding
                    actually costs the marriage. Clergy who&rsquo;ll say what they believe, and
                    what they don&rsquo;t. People who&rsquo;ve lived a specific thing and are
                    willing to be specific about it.
                  </p>
                  <p>
                    Each episode is one conversation, one guest, taken as long as it deserves.
                    Usually an hour. Sometimes two. No panel. No co-host arguing for sport. No
                    clips cut for engagement.
                  </p>
                  <p>
                    What you&rsquo;ll find here is the long version. The honest one. The hour or
                    two it actually takes to say a true thing about a life.
                  </p>
                </div>

                <div className="mt-14">
                  <p className="font-body italic text-sub text-[17px]">With every conversation,</p>
                  <HandSignature className="mt-4" />
                  <p className="mt-4 font-body text-[11px] uppercase tracking-[0.32em] text-sub">
                    Host &amp; creator &middot; @DeepDives237
                  </p>
                </div>
              </Reveal>

              {/* Portrait inset — full original treatment: 4-side vignettes + full overlay stack */}
              <Reveal delay={0.12} className="order-1 lg:order-2 lg:col-span-5">
                <div className="lg:sticky lg:top-28">
                  <div className="relative aspect-[4/5] overflow-hidden bg-card">
                    <Image
                      src="/brand/raissa-portrait.jpg"
                      alt="Raissa, host and creator of Deep Dives Podcast"
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover"
                      style={{ objectPosition: "50% 22%" }}
                      priority
                    />
                    {/* Edge vignettes — all four sides, so corners blend into ink */}
                    <div aria-hidden className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-ink/95 via-ink/40 to-transparent" />
                    <div aria-hidden className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-ink/80 to-transparent" />
                    <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
                    <div aria-hidden className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink/70 to-transparent" />

                    {/* Overlay name plate */}
                    <div className="absolute bottom-8 left-8 right-8">
                      <p className="font-display italic font-light text-[56px] leading-[0.92] tracking-[-0.01em] text-gold-shine lg:text-[72px]">
                        Raissa
                      </p>
                      <p className="mt-3 font-script text-[28px] leading-[0.85] text-paper lg:text-[32px]">
                        host, creator, storyteller
                      </p>
                      <p className="mt-5 font-body text-[11px] uppercase tracking-[0.32em] text-paper/80">
                        @DeepDives237
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
          <div aria-hidden className="mx-auto h-px max-w-[1400px] bg-rule" />
        </section>

        {/* 2. What We Cover. */}
        <section className="relative bg-surface">
          <div className="mx-auto max-w-[1400px] px-8 py-24 lg:px-10 lg:py-32">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-6">
                <h2 className="break-words font-display text-[52px] leading-[0.98] tracking-[-0.02em] sm:text-[68px] lg:text-[88px]">
                  <DropCap letter="W" />hat We
                  <span className="italic font-light text-sub"> Cover.</span>
                  <span className="clear-both block" />
                </h2>
                <p className="mt-8 max-w-sm font-body italic text-sub text-[17px] leading-[1.6]">
                  Seven kinds of room. The same posture in each: stay long enough to let the
                  person finish their thought.
                </p>
              </Reveal>
              <Reveal delay={0.1} className="lg:col-span-6 lg:pt-4">
                <ul className="grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
                  {topics.map((t, i) => (
                    <li
                      key={t}
                      className="flex items-baseline gap-5 border-b border-rule pb-4"
                    >
                      <span className="font-body text-[11px] uppercase tracking-[0.32em] text-gold/80">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-[24px] leading-[1.15] text-paper">
                        {t}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
          <div aria-hidden className="mx-auto h-px max-w-[1400px] bg-rule" />
        </section>

        {/* 3. Off the Mic. */}
        <section className="relative bg-ink">
          <div className="mx-auto max-w-[1400px] px-8 py-24 lg:px-10 lg:py-32">
            <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-20">
              <Reveal className="lg:col-span-5">
                <h2 className="break-words font-display text-[52px] leading-[0.98] tracking-[-0.02em] sm:text-[68px] lg:text-[88px]">
                  <DropCap letter="O" />ff the
                  <span className="italic font-light text-sub"> Mic.</span>
                  <span className="clear-both block" />
                </h2>
                <p className="mt-8 font-body text-[11px] uppercase tracking-[0.32em] text-gold/80">
                  Vol. I&nbsp;&middot;&nbsp;IV
                </p>
                <p className="mt-6 max-w-md font-body italic text-sub text-[17px] leading-[1.6]">
                  A few frames from the spaces between conversations.
                </p>
              </Reveal>
              <Reveal delay={0.15} className="lg:col-span-7">
                <div className="flex items-center justify-center py-6 lg:py-0">
                  <MomentsStack moments={MOMENTS} />
                </div>
              </Reveal>
            </div>
          </div>
          <div aria-hidden className="mx-auto h-px max-w-[1400px] bg-rule" />
        </section>

        {/* 4. Watch More. */}
        <section className="relative">
          <div className="mx-auto max-w-[1400px] px-8 py-24 lg:px-10 lg:py-32">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-7">
                <h2 className="break-words font-display text-[52px] leading-[0.98] tracking-[-0.02em] sm:text-[68px] lg:text-[88px]">
                  <DropCap letter="W" />atch
                  <span className="italic font-light text-sub"> More.</span>
                  <span className="clear-both block" />
                </h2>
              </Reveal>
              <Reveal delay={0.1} className="lg:col-span-5 lg:self-end">
                <p className="max-w-md font-body italic text-sub text-[18px] leading-[1.55]">
                  Every episode lives on YouTube. Subscribe at{" "}
                  <span className="text-gold not-italic">@DeepDives237</span>.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.18} className="mt-14">
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 bg-gold px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.24em] text-ink transition-colors duration-200 hover:bg-gold-bright"
                >
                  Subscribe on YouTube
                  <span className="text-[14px] transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </a>
                <Link
                  href="/episodes"
                  className="inline-flex items-center gap-3 border border-gold px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.24em] text-gold transition-colors duration-200 hover:bg-gold/10"
                >
                  Browse Episodes
                </Link>
              </div>
            </Reveal>
          </div>
          <div aria-hidden className="mx-auto h-px max-w-[1400px] bg-rule" />
        </section>

        {/* 5. Be a Guest. */}
        <section className="relative bg-surface">
          <div className="mx-auto max-w-[1400px] px-8 py-24 lg:px-10 lg:py-32">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-7">
                <h2 className="break-words font-display text-[52px] leading-[0.98] tracking-[-0.02em] sm:text-[68px] lg:text-[88px]">
                  <DropCap letter="B" />e a
                  <span className="italic font-light text-sub"> Guest.</span>
                  <span className="clear-both block" />
                </h2>
              </Reveal>
              <Reveal delay={0.1} className="lg:col-span-5 lg:self-end">
                <p className="max-w-md font-body italic text-sub text-[18px] leading-[1.55]">
                  Got a story Deep Dives should hear? Send it over. The next conversation could be
                  yours.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.18} className="mt-14">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 bg-gold px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.24em] text-ink transition-colors duration-200 hover:bg-gold-bright"
              >
                Get in Touch
                <span className="text-[14px] transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
