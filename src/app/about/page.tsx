import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { DropCap } from "@/components/site/DropCap";
import { PullQuote } from "@/components/site/PullQuote";
import { HandSignature } from "@/components/site/HandSignature";
import { MomentsStack, type Moment } from "@/components/site/MomentsStack";
import { BeAGuestSection } from "@/components/site/BeAGuestSection";
import { JsonLd } from "@/components/site/JsonLd";
import {
  breadcrumbSchema,
  faqPageSchema,
  pageMetadata,
  personSchema,
  podcastSeriesSchema,
  siteUrl,
} from "@/lib/seo";

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

type FAQ = {
  question: string;
  answer: string;
  answerNode?: React.ReactNode;
};

const FAQS: FAQ[] = [
  {
    question: "What is Deep Dives Podcast?",
    answer:
      "Deep Dives is an interview podcast hosted by Raissa. Each episode goes deep on a single topic with the expert who actually lives it. The subjects range across work, money, faith, immigration, relationships, and the questions shaping today's professional life. New episodes are on YouTube at @DeepDives237.",
  },
  {
    question: "Who is Raissa?",
    answer:
      "Raissa is the host and creator of Deep Dives. She's an entrepreneur who has built businesses, raised money, lost some, started over. She makes the show she wanted to listen to and couldn't find.",
  },
  {
    question: "How long are Deep Dives episodes?",
    answer:
      "Most episodes run between 60 and 90 minutes. Some go to two hours. The length isn't the point; it's whatever the topic actually needs.",
  },
  {
    question: "Where can I listen to Deep Dives Podcast?",
    answer:
      "Every episode is on YouTube at @DeepDives237. That's the only place it lives for now.",
  },
  {
    question: "How can I be a guest on Deep Dives?",
    answer:
      "Pitch yourself via the Contact form. The best pitches start with the topic you know better than most people, and the question you wish more people would actually ask you about it.",
    answerNode: (
      <>
        Pitch yourself via the{" "}
        <Link
          href="/contact"
          className="text-gold transition-colors hover:text-gold-bright"
        >
          Contact form
        </Link>
        . The best pitches start with the topic you know better than most
        people, and the question you wish more people would actually ask you
        about it.
      </>
    ),
  },
];

const MOMENTS: Moment[] = [
  { src: "/brand/moments/01.jpg", alt: "Raissa at dusk on a velvet sofa, draped in a faux-fur coat", vol: "I", tag: "After hours" },
  { src: "/brand/moments/02.jpg", alt: "Raissa on a bouclé chair with framed art behind", vol: "II", tag: "Between takes" },
  { src: "/brand/moments/03.jpg", alt: "Raissa beside a botanical wall in red and white", vol: "III", tag: "Off the record" },
  { src: "/brand/moments/04.jpg", alt: "Raissa against pleated velvet in soft plum light", vol: "IV", tag: "Quiet hours" },
];

export const metadata = pageMetadata({
  title: "About",
  description:
    "A letter from Raissa, host of Deep Dives. What the show is, who it's for, and where to find every episode on YouTube.",
  path: "/about",
});

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
          faqPageSchema(FAQS),
        ]}
      />
      <Header />
      <main id="main">
        {/* 1. A Letter from Raissa. */}
        <section className="relative">
          <div className="mx-auto max-w-content px-8 py-28 lg:px-10 lg:py-36">
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
                    I&rsquo;m Raissa. I&rsquo;m an{" "}
                    <span className="font-semibold uppercase tracking-[0.04em] text-gold">
                      Entrepreneur
                    </span>{" "}
                    first, a{" "}
                    <span className="font-semibold uppercase tracking-[0.04em] text-gold">
                      Host
                    </span>{" "}
                    second. I&rsquo;ve started companies, raised money, lost some,
                    started over. I know the part of a founder&rsquo;s story that gets
                    edited out, because I&rsquo;ve lived a few of them.
                  </p>
                  <p>
                    I made Deep Dives because I was hungry for real conversations on
                    the things actually shaping our generation. Work, money, faith,
                    immigration, relationships, the questions you only get into
                    seriously when you&rsquo;re with someone who has lived them.
                  </p>
                  <p>
                    Most interviews stay on the surface. I wanted the version where
                    the expert gets asked about their subject like it matters.
                  </p>
                </div>

                <PullQuote>
                  What an expert actually thinks, said out loud.
                </PullQuote>

                <div className="space-y-7 font-body text-paper text-[19px] leading-[1.75]">
                  <p>
                    The guests are people who actually know what they&rsquo;re talking
                    about: founders, planners, writers, pastors, lobbyists, organizers.
                    People whose work I keep thinking about a week later.
                  </p>
                  <p>
                    The topics are the questions I&rsquo;m wrestling with, and that
                    most people I know are wrestling with too. How to build something.
                    How to belong somewhere. How to hold a life together when the
                    rules keep changing.
                  </p>
                  <p>
                    The first time a guest told me something they&rsquo;d never said
                    out loud before, I knew the show was working.
                  </p>
                  <p>
                    If those are the conversations you&rsquo;ve been looking for too,
                    the whole thing lives on YouTube.
                  </p>
                </div>

                <div className="mt-14">
                  <p className="font-body italic text-sub text-[17px]">Yours truly,</p>
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
                    {/* Edge vignettes — smoother, wider falloff so corners blend into ink without a hard band */}
                    <div aria-hidden className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-ink/75 via-ink/20 to-transparent" />
                    <div aria-hidden className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-ink/55 via-ink/15 to-transparent" />
                    <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
                    <div aria-hidden className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink/50 to-transparent" />

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
          <div aria-hidden className="mx-auto h-px max-w-content bg-rule" />
        </section>

        {/* 2. Vision & Mission. */}
        <section className="relative bg-surface">
          <div className="mx-auto max-w-content px-8 py-24 lg:px-10 lg:py-32">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-5">
                <h2 className="break-words font-display text-[52px] leading-[0.98] tracking-[-0.02em] sm:text-[68px] lg:text-[88px]">
                  <DropCap letter="V" />ision &amp;
                  <span className="italic font-light text-sub"> Mission.</span>
                  <span className="clear-both block" />
                </h2>
                <p className="mt-8 max-w-sm font-body italic text-sub text-[17px] leading-[1.6]">
                  Why Deep Dives exists, and where it&rsquo;s going.
                </p>
              </Reveal>

              <Reveal delay={0.1} className="lg:col-span-7">
                <div className="space-y-10">
                  <div>
                    <p className="font-body text-[11px] uppercase tracking-[0.32em] text-gold/80">
                      Vision
                    </p>
                    <p className="mt-5 font-body text-paper text-[19px] leading-[1.75]">
                      At Deep Dives, our vision is to become a leading platform
                      for authentic conversations that inspire people to overcome
                      adversity, embrace personal growth, and build lives of
                      purpose, impact, and fulfillment. We believe that true
                      success is not defined solely by achievements, titles, or
                      wealth, but by the resilience, courage, and lessons
                      developed through life&rsquo;s challenges. Through powerful
                      storytelling and meaningful dialogue, we aim to create a
                      global community where individuals are empowered to learn
                      from the journeys of others, discover their own potential,
                      and pursue lives aligned with their values and aspirations.
                    </p>
                  </div>

                  <div>
                    <p className="font-body text-[11px] uppercase tracking-[0.32em] text-gold/80">
                      Mission
                    </p>
                    <div className="mt-5 space-y-6 font-body text-paper text-[19px] leading-[1.75]">
                      <p>
                        Deep Dives exists to uncover the untold stories behind
                        success. Through honest and thought-provoking
                        conversations with entrepreneurs, business leaders,
                        creators, athletes, innovators, and changemakers, we
                        explore the defining moments, failures, sacrifices,
                        breakthroughs, and lessons that have shaped their
                        journeys. Hosted by entrepreneur and healthcare executive
                        Raissa, the podcast goes beyond surface-level interviews
                        to reveal the human experiences behind achievement.
                      </p>
                      <p>
                        Our mission is to provide listeners with inspiration,
                        practical wisdom, and actionable insights that can help
                        them navigate their own personal and professional
                        challenges. We strive to create a space where
                        authenticity is valued, vulnerability is welcomed, and
                        meaningful conversations lead to growth. By sharing
                        genuine stories of resilience, transformation, leadership,
                        and perseverance, Deep Dives seeks to encourage people to
                        move beyond limitations, embrace continuous learning, and
                        build lives that reflect both success and purpose.
                      </p>
                      <p>
                        At its core, Deep Dives is about reminding people that
                        behind every accomplishment is a story worth
                        understanding, and within every challenge lies an
                        opportunity for growth.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
          <div aria-hidden className="mx-auto h-px max-w-content bg-rule" />
        </section>

        {/* 3. What We Cover. */}
        <section className="relative">
          <div className="mx-auto max-w-content px-8 py-24 lg:px-10 lg:py-32">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-6">
                <h2 className="break-words font-display text-[52px] leading-[0.98] tracking-[-0.02em] sm:text-[68px] lg:text-[88px]">
                  <DropCap letter="W" />hat We
                  <span className="italic font-light text-sub"> Cover.</span>
                  <span className="clear-both block" />
                </h2>
                <p className="mt-8 max-w-sm font-body italic text-sub text-[17px] leading-[1.6]">
                  Seven topics I keep coming back to, with the people who actually
                  know what they&rsquo;re talking about.
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
          <div aria-hidden className="mx-auto h-px max-w-content bg-rule" />
        </section>

        {/* 3. Off the Mic. */}
        <section className="relative bg-ink">
          <div className="mx-auto max-w-content px-8 py-24 lg:px-10 lg:py-32">
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
                  A few frames between takes.
                </p>
              </Reveal>
              <Reveal delay={0.15} className="lg:col-span-7">
                <div className="flex items-center justify-center py-6 lg:py-0">
                  <MomentsStack moments={MOMENTS} />
                </div>
              </Reveal>
            </div>
          </div>
          <div aria-hidden className="mx-auto h-px max-w-content bg-rule" />
        </section>

        {/* 4. Watch More. */}
        <section className="relative">
          <div className="mx-auto max-w-content px-8 py-24 lg:px-10 lg:py-32">
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
                  Every episode lives on{" "}
                  <a
                    href={CHANNEL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold not-italic transition-colors hover:text-gold-bright"
                  >
                    YouTube
                  </a>
                  . Subscribe at{" "}
                  <a
                    href={CHANNEL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold not-italic transition-colors hover:text-gold-bright"
                  >
                    @DeepDives237
                  </a>
                  .
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
          <div aria-hidden className="mx-auto h-px max-w-content bg-rule" />
        </section>

        {/* 5. Be a Guest. */}
        <BeAGuestSection />

        {/* 6. Quick Answers. — bottom-of-page FAQ for AI extractability. */}
        <section className="relative">
          <div className="mx-auto max-w-content px-8 py-24 lg:px-10 lg:py-32">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-5">
                <h2 className="break-words font-display text-[52px] leading-[0.98] tracking-[-0.02em] sm:text-[68px] lg:text-[88px]">
                  <DropCap letter="Q" />uick
                  <span className="italic font-light text-sub"> Answers.</span>
                  <span className="clear-both block" />
                </h2>
                <p className="mt-8 max-w-sm font-body italic text-sub text-[17px] leading-[1.6]">
                  The questions people actually ask, answered straight.
                </p>
              </Reveal>

              <Reveal delay={0.1} className="lg:col-span-7">
                <dl className="divide-y divide-rule">
                  {FAQS.map((f) => (
                    <div key={f.question} className="py-6 first:pt-0 last:pb-0">
                      <dt className="font-display text-[22px] leading-[1.25] text-paper lg:text-[26px]">
                        {f.question}
                      </dt>
                      <dd className="mt-4 font-body text-sub text-[17px] leading-[1.7]">
                        {f.answerNode ?? f.answer}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
