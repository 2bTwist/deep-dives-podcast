import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { DropCap } from "@/components/site/DropCap";
import { NewBadge } from "@/components/site/NewBadge";
import { EpisodeThumbStatic } from "@/components/EpisodeThumbStatic";
import { JsonLd } from "@/components/site/JsonLd";
import { getAllEpisodes } from "@/sanity/lib/queries";
import { breadcrumbSchema, episodeListSchema, siteUrl } from "@/lib/seo";

const CHANNEL_URL = "https://www.youtube.com/@DeepDives237/videos";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Episodes",
  description:
    "The latest episodes of Deep Dive Podcast with Raissa. Long-form conversations with founders, lobbyists, planners, clergy, immigrants, and the under-asked.",
  alternates: { canonical: "/episodes" },
};

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function EpisodesPage() {
  const latest = await getAllEpisodes();

  return (
    <>
      <JsonLd
        data={[
          episodeListSchema(latest),
          breadcrumbSchema([
            { name: "Home", url: siteUrl() },
            { name: "Episodes", url: `${siteUrl()}/episodes` },
          ]),
        ]}
      />
      <Header />
      <main>
        <section className="relative">
          <div className="mx-auto max-w-[1400px] px-8 py-32 lg:px-10 lg:py-40">
            {/* Masthead */}
            <div className="mb-20 grid gap-8 lg:mb-24 lg:grid-cols-12 lg:gap-12">
              <Reveal className="lg:col-span-7">
                <h1 className="break-words font-display text-[44px] leading-[1.02] tracking-[-0.015em] sm:text-[64px] sm:leading-[0.98] lg:text-[88px]">
                  <DropCap letter="R" />ecent
                  <span className="italic font-light text-sub"> Conversations.</span>
                  <span className="clear-both block" />
                </h1>
              </Reveal>
              <Reveal delay={0.08} className="self-end lg:col-span-5 lg:col-start-8">
                <p className="max-w-md font-body italic text-sub text-[18px] leading-[1.55]">
                  A handful of the newest drops. The full library (long-form episodes and clips)
                  lives on YouTube.
                </p>
              </Reveal>
            </div>

            {/* Episode grid — outlined cards with hairline border + breathing room */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
              {latest.map((ep, i) => (
                <Reveal
                  key={ep.youtubeId}
                  delay={i * 0.08}
                  className="group border border-rule bg-card transition-colors duration-300 hover:border-gold/40"
                >
                  <article>
                    <Link href={`/episodes/${ep.slug}`} className="block">
                      <div className="relative aspect-video overflow-hidden bg-card">
                        <EpisodeThumbStatic
                          id={ep.youtubeId}
                          alt={ep.title}
                          width={640}
                          height={360}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />
                        <span className="pointer-events-none absolute bottom-3 left-3 grid h-10 w-10 place-items-center rounded-full bg-gold text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <svg viewBox="0 0 12 12" className="h-3.5 w-3.5 translate-x-[1px]" fill="currentColor" aria-hidden>
                            <polygon points="2,0 12,6 2,12" />
                          </svg>
                        </span>
                        <span className="absolute right-3 top-3 bg-ink/85 px-2.5 py-1 font-body text-[11px] uppercase tracking-[0.16em] text-paper">
                          {ep.duration}
                        </span>
                        <NewBadge publishedAt={ep.publishedAt} />
                      </div>

                      <div className="p-6">
                        <p className="font-body text-[11px] uppercase tracking-[0.28em] text-gold">
                          {ep.category}
                        </p>
                        <h2 className="mt-3 font-display text-[22px] leading-[1.18] text-paper transition-colors duration-200 group-hover:text-gold">
                          {ep.title}
                        </h2>
                      </div>
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>

            {/* Single CTA button — hover transforms to YouTube red with bouncing play icon */}
            <Reveal className="mt-20 flex justify-center lg:mt-24">
              <a
                href={CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View more episodes on YouTube"
                className="group relative inline-flex items-center gap-4 border-2 border-gold bg-transparent px-8 py-4 font-body text-[12px] font-medium uppercase tracking-[0.24em] text-gold transition-all duration-300 ease-out hover:scale-[1.03] hover:border-youtube hover:bg-youtube hover:text-paper hover:shadow-[0_8px_24px_rgba(255,0,0,0.25)]"
              >
                <span className="grid h-5 w-7 place-items-center rounded-[3px] bg-youtube transition-all duration-300 ease-out group-hover:scale-110 group-hover:bg-paper">
                  <svg
                    viewBox="0 0 12 12"
                    className="h-2.5 w-2.5 translate-x-[0.5px] fill-[#ffffff] transition-colors duration-300 group-hover:fill-[#ff0000]"
                    aria-hidden
                  >
                    <polygon points="2,0 12,6 2,12" />
                  </svg>
                </span>
                View more on YouTube
                <span className="text-[14px] transition-transform duration-300 ease-out group-hover:translate-x-1">
                  →
                </span>
              </a>
            </Reveal>
          </div>

          <div aria-hidden className="mx-auto h-px max-w-[1400px] bg-rule" />
        </section>
      </main>
      <Footer />
    </>
  );
}
