import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { DropCap } from "@/components/site/DropCap";
import { PullQuote } from "@/components/site/PullQuote";
import { HandSignature } from "@/components/site/HandSignature";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbSchema, personSchema, podcastSeriesSchema, siteUrl } from "@/lib/seo";

export const revalidate = 3600;

const CHANNEL_URL = "https://www.youtube.com/@DeepDives237";

const topics: { label: string; body: string }[] = [
  {
    label: "Entrepreneurship",
    body: "Founders past the pitch deck. What actually keeps the lights on, and what they wish they had known.",
  },
  {
    label: "Career",
    body: "The shape of work in 2026. Whether the ladder still goes up, and what to climb instead.",
  },
  {
    label: "Finance",
    body: "Money conversations without the LinkedIn voice. How people earn it, lose it, hold it.",
  },
  {
    label: "Relationships",
    body: "What two people actually owe each other, said aloud. The questions partners avoid.",
  },
  {
    label: "Faith",
    body: "Belief in the room, including the doubt that comes with it.",
  },
  {
    label: "Creativity",
    body: "The unglamorous middle of a creative life. Process, paychecks, persistence.",
  },
  {
    label: "Immigrant Journeys",
    body: "What it costs and what it gives. The stories America rarely asks for.",
  },
];

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Raissa started Deep Dives. The conversations behind the show, the topics it covers, and where to find every episode on YouTube.",
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
        {/* Masthead */}
        <section className="relative">
          <div className="mx-auto max-w-[1400px] px-8 py-32 lg:px-10 lg:py-40">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-7">
                <h1 className="font-display text-[64px] leading-[0.96] tracking-[-0.015em] lg:text-[104px]">
                  <DropCap letter="C" />onversations
                  <span className="block italic font-light text-sub">that go the distance.</span>
                  <span className="clear-both block" />
                </h1>
              </Reveal>
              <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8 lg:self-end">
                <p className="max-w-md font-body italic text-sub text-[18px] leading-[1.55]">
                  Deep Dives is a long-form interview show, hosted by Raissa, about the questions
                  short-form media doesn't have time for.
                </p>
              </Reveal>
            </div>
          </div>
          <div aria-hidden className="mx-auto h-px max-w-[1400px] bg-rule" />
        </section>

        {/* Portrait + pull quote */}
        <section className="relative">
          <div className="mx-auto max-w-[1400px] px-8 py-28 lg:px-10 lg:py-32">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-6">
                <div className="relative aspect-[4/5] overflow-hidden bg-card">
                  <Image
                    src="/brand/raissa-portrait.png"
                    alt="Raissa, host and creator of Deep Dives Podcast"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                    style={{ objectPosition: "50% 22%" }}
                  />
                  <div aria-hidden className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-ink/95 via-ink/40 to-transparent" />
                  <div aria-hidden className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-ink/80 to-transparent" />
                  <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
                  <div aria-hidden className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink/70 to-transparent" />

                  <div className="absolute bottom-8 left-8 right-8">
                    <p className="font-display italic font-light text-[64px] leading-[0.92] tracking-[-0.01em] text-gold-shine lg:text-[88px]">
                      Raissa
                    </p>
                    <p className="mt-3 font-script text-[34px] leading-[0.85] text-paper">
                      host, creator, storyteller
                    </p>
                    <p className="mt-5 font-body text-[11px] uppercase tracking-[0.32em] text-paper/80">
                      @DeepDives237
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.12} className="lg:col-span-6 lg:pt-8">
                <h2 className="font-display text-[44px] leading-[1.0] tracking-[-0.015em] lg:text-[56px]">
                  <DropCap letter="T" />he questions
                  <span className="italic font-light text-sub"> short form skips.</span>
                  <span className="clear-both block" />
                </h2>

                <div className="mt-10 space-y-6 font-body text-paper text-[18px] leading-[1.6]">
                  <p>
                    I made Deep Dives because the conversations I most wanted to hear weren&rsquo;t
                    happening anywhere. The kind where someone actually answers the question.
                  </p>
                </div>

                <PullQuote>
                  Where the camera doesn&rsquo;t cut when the truth gets quiet.
                </PullQuote>

                <div className="space-y-6 font-body text-sub text-[18px] leading-[1.6]">
                  <p>
                    No filters. No fluff. Real people sharing the stories that shaped them, and
                    the lessons they&rsquo;re still working out in real time.
                  </p>
                  <p>
                    Founders past the pitch deck. Planners past the photo shoot. Clergy past the
                    Sunday cadence. Every episode runs as long as the conversation deserves. Which
                    is to say, longer than most of the internet thinks you&rsquo;ll sit still for.
                  </p>
                  <p>
                    Subscribe on YouTube and stick around. The next conversation will be worth your
                    time.
                  </p>
                </div>

                <HandSignature className="mt-10" />

                <a
                  href={CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-10 inline-flex items-center gap-3 bg-gold px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.24em] text-ink transition-colors duration-200 hover:bg-gold-bright"
                >
                  Watch on YouTube
                  <span className="text-[14px] transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </a>
              </Reveal>
            </div>
          </div>
          <div aria-hidden className="mx-auto h-px max-w-[1400px] bg-rule" />
        </section>

        {/* What we cover */}
        <section className="relative bg-surface">
          <div className="mx-auto max-w-[1400px] px-8 py-28 lg:px-10 lg:py-36">
            <div className="mb-16 grid gap-8 lg:mb-20 lg:grid-cols-12 lg:gap-12">
              <Reveal className="lg:col-span-7">
                <h2 className="font-display text-[44px] leading-[1.0] tracking-[-0.015em] lg:text-[64px]">
                  <DropCap letter="S" />even kinds of
                  <span className="italic font-light text-sub"> conversation.</span>
                  <span className="clear-both block" />
                </h2>
              </Reveal>
              <Reveal delay={0.08} className="self-end lg:col-span-5 lg:col-start-8">
                <p className="max-w-md font-body italic text-sub text-[17px] leading-[1.55]">
                  Different rooms, same idea. Find the person who lived the story and let them
                  tell it long.
                </p>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 gap-px bg-rule sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((t, i) => (
                <Reveal key={t.label} delay={i * 0.06} className="bg-surface p-8 lg:p-10">
                  <p className="font-body text-[11px] uppercase tracking-[0.32em] text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-5 font-display text-[26px] leading-[1.15] text-paper">
                    {t.label}
                  </h3>
                  <p className="mt-4 font-body text-sub text-[15px] leading-[1.6]">{t.body}</p>
                </Reveal>
              ))}
              {Array.from({ length: (3 - (topics.length % 3)) % 3 }).map((_, i) => (
                <div key={`filler-${i}`} aria-hidden className="hidden bg-surface lg:block" />
              ))}
            </div>
          </div>
          <div aria-hidden className="mx-auto h-px max-w-[1400px] bg-rule" />
        </section>

        {/* Where to find Deep Dives */}
        <section className="relative">
          <div className="mx-auto max-w-[1400px] px-8 py-28 lg:px-10 lg:py-32">
            <Reveal className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-7">
                <h2 className="font-display text-[44px] leading-[1.0] tracking-[-0.015em] lg:text-[64px]">
                  <DropCap letter="E" />very episode
                  <span className="italic font-light text-sub"> on <span className="text-youtube">YouTube</span>.</span>
                  <span className="clear-both block" />
                </h2>
                <p className="mt-6 max-w-xl font-body italic text-sub text-[18px] leading-[1.55]">
                  Subscribe at @DeepDives237 for long-form interviews, shorts, and a back catalog you
                  can actually finish.
                </p>
              </div>
              <div className="lg:col-span-5 lg:flex lg:items-end lg:justify-end">
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
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
