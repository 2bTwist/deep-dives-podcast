import Link from "next/link";
import Image from "next/image";
import { Mic, Users, Globe, Heart } from "lucide-react";
import type { ComponentType } from "react";
import { Reveal } from "./Reveal";
import { DropCap } from "./DropCap";
import { PullQuote } from "./PullQuote";

const values: { Icon: ComponentType<{ className?: string }>; title: string; body: string }[] = [
  {
    Icon: Mic,
    title: "Real Conversations",
    body: "Two real people, one mic, no filters between you and the story.",
  },
  {
    Icon: Users,
    title: "Inspiring Guests",
    body: "Founders, planners, lobbyists, immigrants. Voices you don't hear on autopilot.",
  },
  {
    Icon: Globe,
    title: "Meaningful Impact",
    body: "Stories that travel, from launch to listener to action.",
  },
  {
    Icon: Heart,
    title: "A Community",
    body: "Listeners who came for one episode and stayed for the conversation.",
  },
];

export function WhyIStartedSection() {
  return (
    <section className="relative bg-surface">
      <div className="mx-auto max-w-[1400px] px-8 py-28 lg:px-10 lg:py-36">
        {/* Top: portrait + copy */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* LEFT — real portrait of Raissa (vertical crop from banner) */}
          <Reveal className="lg:col-span-5">
            <Link
              href="/about"
              aria-label="Read about Raissa"
              className="group relative block aspect-[4/5] overflow-hidden bg-card"
            >
              <Image
                src="/brand/raissa-portrait.jpg"
                alt="Raissa, host and founder of Deep Dives Podcast"
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover transition-transform duration-[3000ms] ease-out group-hover:scale-[1.06]"
                style={{ objectPosition: "50% 25%" }}
              />
              {/* edge vignettes */}
              <div aria-hidden className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-ink/95 via-ink/40 to-transparent" />
              <div aria-hidden className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-ink/80 to-transparent" />
              {/* gradient floor for legibility of overlay text */}
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent" />
              {/* gradient ceiling for top label */}
              <div aria-hidden className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink/70 to-transparent" />

              {/* bottom overlay */}
              <div className="absolute bottom-8 left-8 right-8">
                <p className="font-display italic font-light text-[64px] leading-[0.92] tracking-[-0.01em] text-gold-shine lg:text-[80px]">
                  Raissa
                </p>
                <p className="mt-3 font-script text-[34px] leading-[0.85] text-paper">
                  in her own words
                </p>
                {/* Caption swaps on hover: handle/role → "Read her story →" */}
                <div className="relative mt-5 h-[14px]">
                  <p className="absolute inset-0 font-body text-[11px] uppercase tracking-[0.32em] text-paper/80 transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:opacity-0">
                    Host, Creator, @DeepDives237
                  </p>
                  <p className="absolute inset-0 flex translate-y-2 items-center gap-2 font-body text-[11px] uppercase tracking-[0.32em] text-gold opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    Read her story
                    <span aria-hidden>→</span>
                  </p>
                </div>
              </div>
            </Link>
          </Reveal>

          {/* RIGHT — copy */}
          <Reveal delay={0.12} className="lg:col-span-7 lg:pt-6">
            <h2 className="break-words font-display text-[44px] leading-[1.02] tracking-[-0.015em] sm:text-[56px] sm:leading-[1.0] lg:text-[64px]">
              <DropCap letter="W" />hy I Started
              <span className="block italic font-light text-sub">Deep Dives</span>
              <span className="clear-both block" />
            </h2>

            <div className="mt-10 max-w-xl space-y-6 font-body text-sub text-[18px] leading-[1.6]">
              <p>
                I made Deep Dives because the conversations I most wanted to hear weren't happening
                anywhere. The kind where someone actually answers the question.
              </p>
            </div>

            <PullQuote className="max-w-xl">
              Where the camera doesn&rsquo;t cut when the truth gets quiet.
            </PullQuote>

            <div className="max-w-xl font-body text-sub text-[18px] leading-[1.6]">
              <p>
                No filters. No fluff. Real people sharing the stories that shaped them, and the
                lessons they&rsquo;re still working out in real time.
              </p>
            </div>

            <Link
              href="/about"
              className="group mt-10 inline-flex items-baseline gap-3 font-body text-[14px] uppercase tracking-[0.14em] text-gold transition-colors hover:text-gold-bright"
            >
              <span className="border-b border-gold/50 pb-1 transition-colors group-hover:border-gold-bright">Read my story</span>
              <span className="text-[15px] transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>
        </div>

        {/* Bottom: 4 value cards */}
        <div className="mt-24 grid grid-cols-1 gap-px bg-rule sm:grid-cols-2 lg:mt-32 lg:grid-cols-4">
          {values.map(({ Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 0.08} className="group bg-surface p-8 lg:p-10">
              <span className="inline-grid h-12 w-12 place-items-center border border-gold text-gold transition-all duration-300 ease-out group-hover:border-gold-bright group-hover:text-gold-bright">
                <Icon className="h-5 w-5 transition-transform duration-500 ease-out group-hover:-rotate-6 group-hover:scale-110" />
              </span>
              <h3 className="mt-7 font-display text-[22px] leading-[1.2] text-paper transition-colors duration-300 group-hover:text-gold">
                {title}
              </h3>
              <p className="mt-3 font-body italic text-sub text-[15px] leading-[1.55]">{body}</p>
            </Reveal>
          ))}
        </div>
      </div>

      <div aria-hidden className="mx-auto h-px max-w-[1400px] bg-rule" />
    </section>
  );
}
