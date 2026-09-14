import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { DropCap } from "@/components/site/DropCap";
import { EpisodeCard } from "@/components/site/EpisodeCard";
import { JsonLd } from "@/components/site/JsonLd";
import { getAllEpisodes } from "@/sanity/lib/queries";
import { breadcrumbSchema, episodeListSchema, pageMetadata, siteUrl } from "@/lib/seo";

const CHANNEL_URL = "https://www.youtube.com/@DeepDives237/videos";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "Episodes",
  description:
    "Every episode of Deep Dives Podcast with Raissa. Long-form interviews on work, money, faith, immigration and relationships, with the people who live them.",
  path: "/episodes",
});

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
      <main id="main">
        <section className="relative">
          <div className="mx-auto max-w-content px-8 py-32 lg:px-10 lg:py-40">
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
                  The newest drops. The full archive (episodes and clips) lives on YouTube.
                </p>
              </Reveal>
            </div>

            {/* Episode grid — outlined cards with hairline border + breathing room */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
              {latest.map((ep, i) => (
                <EpisodeCard
                  key={ep.youtubeId}
                  episode={ep}
                  delay={i * 0.08}
                  headingLevel={2}
                />
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

          <div aria-hidden className="mx-auto h-px max-w-content bg-rule" />
        </section>
      </main>
      <Footer />
    </>
  );
}
