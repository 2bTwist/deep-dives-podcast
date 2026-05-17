import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { EpisodeThumbStatic } from "@/components/EpisodeThumbStatic";
import { getAllEpisodes } from "@/sanity/lib/queries";

const CHANNEL_URL = "https://www.youtube.com/@DeepDives237/videos";

export const metadata: Metadata = {
  title: "Episodes — Deep Dive Podcast with Raissa",
  description:
    "The latest episodes of Deep Dive Podcast with Raissa. Long-form conversations with founders, lobbyists, planners, clergy, immigrants, and the under-asked.",
};

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function EpisodesPage() {
  const latest = await getAllEpisodes();

  return (
    <>
      <Header />
      <main>
        <section className="relative">
          <div className="mx-auto max-w-[1400px] px-8 py-32 lg:px-10 lg:py-40">
            {/* Masthead */}
            <div className="mb-20 grid gap-8 lg:mb-24 lg:grid-cols-12 lg:gap-12">
              <Reveal className="lg:col-span-7">
                <p className="font-body text-[12px] uppercase tracking-[0.32em] text-gold">
                  Latest Episodes
                </p>
                <h1 className="mt-5 font-display text-[64px] leading-[0.98] tracking-[-0.015em] lg:text-[88px]">
                  Recent <span className="italic font-light text-sub">Conversations.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.08} className="self-end lg:col-span-4 lg:col-start-9">
                <p className="max-w-md font-body italic text-sub text-[18px] leading-[1.55]">
                  A handful of the newest drops. The full library — long-form episodes and clips —
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
                      </div>

                      <div className="p-6">
                        <p className="font-body text-[11px] uppercase tracking-[0.28em] text-gold">
                          {ep.category}
                        </p>
                        <h2 className="mt-3 font-display text-[22px] leading-[1.18] text-paper transition-colors duration-200 group-hover:text-gold">
                          {ep.title}
                        </h2>
                        <p className="mt-6 font-body italic text-sub text-[13px]">
                          {formatDate(ep.publishedAt)}
                        </p>
                      </div>
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>

            {/* View-more-on-YouTube CTA */}
            <Reveal className="mt-24 grid grid-cols-1 items-center gap-10 border-t border-rule pt-16 lg:mt-28 lg:grid-cols-12 lg:gap-12 lg:pt-20">
              <div className="lg:col-span-7">
                <p className="font-body text-[12px] uppercase tracking-[0.32em] text-gold">
                  The Full Archive
                </p>
                <h2 className="mt-5 font-display text-[44px] leading-[1.0] tracking-[-0.015em] lg:text-[56px]">
                  Every conversation <span className="italic font-light text-sub">on YouTube.</span>
                </h2>
                <p className="mt-5 max-w-md font-body italic text-sub text-[16px] leading-[1.55]">
                  Long-form episodes, shorts, and behind-the-scenes — all on @DeepDives237.
                </p>
              </div>
              <div className="lg:col-span-5 lg:flex lg:justify-end">
                <a
                  href={CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 bg-gold px-8 py-4 text-[12px] font-medium uppercase tracking-[0.24em] text-ink transition-colors duration-200 hover:bg-gold-bright"
                >
                  View More on YouTube
                  <span className="text-[14px] transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </a>
              </div>
            </Reveal>
          </div>

          <div aria-hidden className="mx-auto h-px max-w-[1400px] bg-rule" />
        </section>
      </main>
      <Footer />
    </>
  );
}
