"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { EpisodeThumb } from "@/components/site/EpisodeThumb";
import { NewBadge } from "@/components/site/NewBadge";
import { EASE, MOTION_OK, floatLoop, gsap, mouseParallax, riseOnScroll, useGSAP } from "@/lib/gsap";
import type { Episode } from "@/lib/types";

const ART = "/art";

type Props = {
  featured: Episode;
};

/**
 * Centered magazine-cover masthead with three small 3D blobs around it.
 * The <h1> is server-rendered and never hidden, so the LCP element still
 * paints on the first frame. Only the supporting copy and blobs animate in.
 */
export function Hero({ featured }: Props) {
  const root = useRef<HTMLElement>(null);

  const formattedDate = featured.publishedAt
    ? new Date(featured.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  useGSAP(
    () => {
      const scope = root.current!;
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.set("[data-reveal]", { visibility: "visible" });

        gsap
          .timeline({ defaults: { ease: EASE, duration: 1.2 } })
          .from("[data-blob]", { scale: 0.6, autoAlpha: 0, stagger: 0.12, duration: 1.6 }, 0)
          .from("[data-intro]", { y: 18, autoAlpha: 0, stagger: 0.08 }, 0.15);

        // Blobs drift up at different rates as the hero scrolls away.
        gsap.utils.toArray<HTMLElement>("[data-blob]").forEach((el, i) => {
          gsap.to(el, {
            yPercent: -25 - i * 20,
            ease: "none",
            scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: true },
          });
        });

        floatLoop(scope);
        riseOnScroll(scope);
        return mouseParallax(scope);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div data-blob data-reveal className="absolute left-3 top-[4px] w-[64px] sm:left-[2%] sm:top-[40px] sm:w-[100px] lg:left-[9%] lg:top-[90px] lg:w-[160px]">
          <div data-mouse="-16">
            <div data-float>
              <Image src={`${ART}/blob-gold.png`} alt="" width={480} height={480} sizes="160px" className="h-auto w-full" />
            </div>
          </div>
        </div>
        <div data-blob data-reveal className="absolute right-3 top-[235px] w-[56px] sm:right-[2%] sm:top-[330px] sm:w-[90px] lg:right-[9%] lg:top-[330px] lg:w-[150px]">
          <div data-mouse="12">
            <div data-float>
              <Image src={`${ART}/blob-obsidian.png`} alt="" width={480} height={480} sizes="150px" className="h-auto w-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-content-tight px-8 lg:px-10">
        <div className="flex flex-col items-center pb-24 pt-20 text-center lg:pb-32 lg:pt-28">
          {/* Masthead */}
          <h1>
            <span className="block font-display text-[64px] leading-[0.92] tracking-[-0.018em] text-paper sm:text-[96px] md:text-[120px] lg:text-[160px]">
              Deep Dives
            </span>{" "}
            <span className="-mt-2 block font-script text-[64px] leading-[0.78] text-gold sm:text-[96px] md:text-[124px] lg:text-[164px]">
              Podcast
            </span>
          </h1>

          {/* Host attribution */}
          <p data-intro data-reveal className="mt-10 font-body italic text-gold text-[18px] leading-none">
            with{" "}
            <span className="font-display italic font-medium text-[32px] tracking-[-0.005em] text-gold-shine">
              Raissa
            </span>
          </p>

          {/* Lede */}
          <p data-intro data-reveal className="mt-12 max-w-xl font-body italic text-sub text-[20px] leading-[1.55]">
            Deep conversations on the questions of the moment, with the experts
            who actually live them.
          </p>

          {/* CTAs */}
          <div data-intro data-reveal className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`https://www.youtube.com/watch?v=${featured.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 bg-gold px-8 py-4 text-[11px] font-medium uppercase tracking-[0.24em] text-ink transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-gold-bright"
            >
              Watch Latest Episode
              <span className="text-[14px] transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </a>
            <Link
              href="/episodes"
              className="inline-flex items-center gap-3 border border-gold px-8 py-4 text-[11px] font-medium uppercase tracking-[0.24em] text-gold transition-colors duration-200 hover:bg-gold/10"
            >
              Explore Episodes
            </Link>
          </div>

          {/* Latest episode — horizontal card below the masthead */}
          <div data-rise data-reveal className="relative mt-16 w-full max-w-4xl text-left sm:mt-24 lg:mt-28">
            <div aria-hidden className="pointer-events-none absolute -bottom-16 -left-28 hidden w-[150px] lg:block">
              <div data-mouse="20">
                <div data-float>
                  <Image src={`${ART}/blob-pearl.png`} alt="" width={480} height={480} sizes="150px" className="h-auto w-full" />
                </div>
              </div>
            </div>

            <div className="mb-7 flex items-center justify-center gap-4">
              <span aria-hidden className="h-px w-10 bg-gold/45" />
              <p className="font-body text-[11px] uppercase tracking-[0.34em] text-gold/80">
                Latest episode
              </p>
              <span aria-hidden className="h-px w-10 bg-gold/45" />
            </div>

            <Link
              href={`/episodes/${featured.slug}`}
              className="group relative grid gap-7 sm:grid-cols-12 sm:gap-10"
            >
              <div className="relative aspect-video overflow-hidden bg-card sm:col-span-7">
                <EpisodeThumb
                  id={featured.youtubeId}
                  alt={featured.title}
                  width={1280}
                  height={720}
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <NewBadge publishedAt={featured.publishedAt} />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-gold text-ink transition-transform duration-300 group-hover:scale-110">
                    <svg viewBox="0 0 12 12" className="h-5 w-5 translate-x-[1px]" fill="currentColor" aria-hidden>
                      <polygon points="2,0 12,6 2,12" />
                    </svg>
                  </span>
                </span>
              </div>

              <div className="sm:col-span-5 sm:self-center">
                <p className="font-body text-[11px] uppercase tracking-[0.28em] text-gold">
                  {featured.category}
                </p>
                <h3 className="mt-3 font-display text-[26px] leading-[1.15] text-paper transition-colors group-hover:text-gold sm:text-[32px]">
                  {featured.title}
                </h3>
                <p className="mt-4 font-body italic text-sub text-[16px] leading-[1.5]">
                  {featured.description}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-rule pt-4">
                  <p className="font-body italic text-sub text-[13px]">{featured.duration}</p>
                  <p className="font-body italic text-sub text-[13px]">{formattedDate}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div aria-hidden className="mx-auto h-px max-w-content-tight bg-rule" />
    </section>
  );
}
