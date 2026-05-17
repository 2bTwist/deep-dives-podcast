"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { EpisodeThumb } from "@/components/EpisodeThumb";
import { reveal, stagger, microHover } from "@/lib/motion";
import type { Episode } from "@/lib/types";

type Props = {
  featured: Episode;
};

export function Hero({ featured }: Props) {
  const reduced = useReducedMotion();
  const formattedDate = featured.publishedAt
    ? new Date(featured.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";
  const initialPose = reduced ? false : reveal.initial;

  return (
    <section className="relative">
      <div className="relative mx-auto max-w-[1400px] px-8 lg:px-10">
        <motion.div
          initial={reduced ? false : stagger(0.12, 0.14).initial}
          animate={stagger(0.12, 0.14).animate}
          className="grid gap-x-10 gap-y-16 pb-28 pt-20 lg:grid-cols-12 lg:gap-x-12 lg:pb-36 lg:pt-24"
        >
          {/* LEFT — copy column */}
          <div className="lg:col-span-5">
            <motion.p
              initial={initialPose}
              animate={reveal.animate}
              transition={reveal.transition}
              className="font-body text-[12px] uppercase tracking-[0.32em] text-gold"
            >
              Real Stories. Real People. Real Impact.
            </motion.p>

            {/* h1 renders statically (no opacity fade) so it lands as LCP element
                ASAP. Surrounding stagger continues to animate. */}
            <h1 className="mt-8">
              <span className="block font-display text-[88px] leading-[0.92] tracking-[-0.015em] text-paper">
                Deep Dives
              </span>
              <span className="-mt-3 ml-[-4px] block font-script text-[96px] leading-[0.78] text-gold">
                Podcast
              </span>
            </h1>

            <motion.p
              initial={initialPose}
              animate={reveal.animate}
              transition={reveal.transition}
              className="mt-5 font-body italic text-gold text-[18px] leading-none"
            >
              with{" "}
              <span className="font-display italic font-medium text-[28px] tracking-[-0.005em] text-gold-shine">
                Raissa
              </span>
            </motion.p>

            <motion.p
              initial={initialPose}
              animate={reveal.animate}
              transition={reveal.transition}
              className="mt-10 max-w-md font-body italic text-sub text-[20px] leading-[1.5]"
            >
              Genuine conversations that inspire, educate, and empower. The interviews you wish more
              hosts had the courage to do.
            </motion.p>

            <motion.div
              initial={initialPose}
              animate={reveal.animate}
              transition={reveal.transition}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <motion.a
                href={`https://www.youtube.com/watch?v=${featured.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                transition={microHover.transition}
                className="group inline-flex items-center gap-3 bg-gold px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.24em] text-ink hover:bg-gold-bright"
              >
                Watch Latest Episode
                <span className="text-[14px] transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </motion.a>
              <Link
                href="/episodes"
                className="inline-flex items-center gap-3 border border-gold px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.24em] text-gold transition-colors duration-200 hover:bg-gold/10"
              >
                Explore Episodes
              </Link>
            </motion.div>

            <motion.a
              initial={initialPose}
              animate={reveal.animate}
              transition={reveal.transition}
              href="https://www.youtube.com/@DeepDives237"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-14 inline-flex items-center gap-4"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full border border-gold text-gold transition-colors duration-200 group-hover:bg-gold/10">
                <svg viewBox="0 0 12 12" className="h-3.5 w-3.5 translate-x-[1px]" fill="currentColor" aria-hidden>
                  <polygon points="2,0 12,6 2,12" />
                </svg>
              </span>
              <span className="leading-tight">
                <span className="block font-body text-[15px] font-medium tracking-[-0.005em] text-paper transition-colors duration-200 group-hover:text-gold">
                  @DeepDives237
                </span>
                <span className="mt-1 block font-body italic text-sub text-[13px]">
                  Long-form conversations on YouTube.
                </span>
              </span>
            </motion.a>
          </div>

          {/* CENTER — real photo of Raissa from the YouTube banner */}
          <motion.div
            initial={initialPose}
            animate={reveal.animate}
            transition={{ ...reveal.transition, duration: 1.1 }}
            className="lg:col-span-4"
          >
            <div className="relative h-full min-h-[520px] overflow-hidden bg-surface">
              <Image
                src="/brand/raissa-portrait.png"
                alt="Raissa, host of the Deep Dives Podcast"
                fill
                priority
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover"
                style={{ objectPosition: "50% 20%" }}
              />
              {/* edge vignettes to hide any residual banner text overlap */}
              <div aria-hidden className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-ink/95 via-ink/40 to-transparent" />
              <div aria-hidden className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-ink/80 to-transparent" />
              {/* warm dark gradient floor for caption legibility */}
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
              {/* warm dark gradient ceiling for top labels */}
              <div aria-hidden className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink/70 to-transparent" />

              {/* episode counter top */}
              <div className="absolute left-6 right-6 top-6 flex items-center justify-between">
                <p className="font-body text-[11px] uppercase tracking-[0.32em] text-gold">
                  Vol. 03
                </p>
                <p className="font-body text-[11px] uppercase tracking-[0.32em] text-paper/80">
                  2026
                </p>
              </div>

              {/* caption bottom */}
              <div className="absolute bottom-6 left-6 right-6 text-center">
                <p className="font-display italic text-[36px] leading-none text-gold-shine">
                  Raissa
                </p>
                <p className="mt-3 font-body text-[11px] uppercase tracking-[0.32em] text-paper">
                  Host, Creator, Storyteller
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — Featured Episode card */}
          <motion.aside
            initial={initialPose}
            animate={reveal.animate}
            transition={{ ...reveal.transition, duration: 1.0 }}
            className="lg:col-span-3"
          >
            <p className="pb-5 font-body text-[11px] uppercase tracking-[0.32em] text-gold">
              Featured Episode
            </p>

            <Link href={`/episodes/${featured.slug}`} className="group block">
              <div className="relative aspect-video overflow-hidden bg-card">
                <EpisodeThumb
                  id={featured.youtubeId}
                  alt={featured.title}
                  width={640}
                  height={360}
                  priority
                  sizes="(min-width: 1024px) 25vw, 100vw"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                {/* play affordance */}
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-gold text-ink transition-transform duration-300 group-hover:scale-110">
                    <svg viewBox="0 0 12 12" className="h-4 w-4 translate-x-[1px]" fill="currentColor" aria-hidden>
                      <polygon points="2,0 12,6 2,12" />
                    </svg>
                  </span>
                </span>
              </div>

              <p className="mt-5 font-body text-[11px] uppercase tracking-[0.28em] text-gold">
                {featured.category}
              </p>
              <h3 className="mt-2 font-display text-[26px] leading-[1.15] text-paper transition-colors group-hover:text-gold">
                {featured.title}
              </h3>
              <p className="mt-3 font-body italic text-sub text-[14px]">
                {featured.description}
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-rule pt-4">
                <p className="font-body italic text-sub text-[13px]">
                  {featured.duration}
                </p>
                <p className="font-body italic text-sub text-[13px]">
                  {formattedDate}
                </p>
              </div>
            </Link>
          </motion.aside>
        </motion.div>
      </div>

      {/* hairline section divider */}
      <div aria-hidden className="mx-auto h-px max-w-[1400px] bg-rule" />
    </section>
  );
}
