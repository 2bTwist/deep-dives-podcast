import { Fragment } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { DropCap } from "@/components/site/DropCap";
import { EpisodeCard } from "@/components/site/EpisodeCard";
import { JsonLd } from "@/components/site/JsonLd";
import {
  getAllEpisodes,
  getEpisodeBySlug,
  getEpisodeSlugs,
  getGuestsForEpisode,
} from "@/sanity/lib/queries";
import { youtubeEmbedUrl, youtubeThumb, youtubeWatchUrl } from "@/lib/youtube";
import {
  breadcrumbSchema,
  pageMetadata,
  podcastEpisodeSchema,
  siteUrl,
  videoObjectSchema,
} from "@/lib/seo";

type Params = { slug: string };

export const revalidate = 300;

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getEpisodeSlugs();
  return slugs.map((slug) => ({ slug }));
}

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ep = await getEpisodeBySlug(slug);
  if (!ep) return {};
  return pageMetadata({
    title: ep.title,
    description: ep.description ?? `${ep.title}. A full episode of Deep Dives Podcast with Raissa.`,
    path: `/episodes/${ep.slug}`,
    // 'sd' (640x480) is guaranteed for every public video; 'maxres' 404s on
    // older/unprocessed videos and silently breaks the OG card when shared.
    image: { url: youtubeThumb(ep.youtubeId, "sd"), width: 640, height: 480, alt: ep.title },
    og: { type: "video.episode" },
  });
}

export default async function EpisodePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const [ep, all] = await Promise.all([getEpisodeBySlug(slug), getAllEpisodes()]);
  if (!ep) notFound();

  const guests = ep._id ? await getGuestsForEpisode(ep._id) : [];
  const related = all.filter((e) => e.slug !== slug).slice(0, 3);
  const video = videoObjectSchema(ep, guests);

  const structured = [
    podcastEpisodeSchema(ep, guests),
    ...(video ? [video] : []),
    breadcrumbSchema([
      { name: "Home", url: siteUrl() },
      { name: "Episodes", url: `${siteUrl()}/episodes` },
      { name: ep.title },
    ]),
  ];

  return (
    <>
      <JsonLd data={structured} />
      <Header />
      <main id="main">
        {/* Episode hero */}
        <section className="relative">
          <div className="mx-auto max-w-content px-8 py-20 lg:px-10 lg:py-28">
            <Reveal>
              <Link
                href="/episodes"
                className="group inline-flex items-baseline gap-3 font-body text-[14px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-gold"
              >
                <span className="text-[15px] transition-transform duration-200 ease-out group-hover:-translate-x-1">
                  ←
                </span>
                <span className="border-b border-muted/40 pb-1 transition-colors group-hover:border-gold/60">All episodes</span>
              </Link>
            </Reveal>

            <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-8">
                <p className="font-body text-[12px] uppercase tracking-[0.32em] text-gold">
                  {ep.category}
                </p>
                <h1 className="mt-5 font-display text-[44px] leading-[1.0] tracking-[-0.015em] lg:text-[68px]">
                  {ep.title}
                </h1>
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-body italic text-sub text-[14px]">
                  {guests.length > 0 && (
                    <>
                      <span>
                        With{" "}
                        {guests.map((g, i) => (
                          <Fragment key={g.slug}>
                            {i > 0 && (i === guests.length - 1 ? " and " : ", ")}
                            <Link
                              href={`/guests/${g.slug}`}
                              className="text-paper transition-colors hover:text-gold"
                            >
                              {g.name}
                            </Link>
                          </Fragment>
                        ))}
                      </span>
                      <span aria-hidden className="text-rule">·</span>
                    </>
                  )}
                  <span>{formatDate(ep.publishedAt)}</span>
                  {ep.dateModified && ep.dateModified !== ep.publishedAt && (
                    <>
                      <span aria-hidden className="text-rule">·</span>
                      <span>Updated {formatDate(ep.dateModified)}</span>
                    </>
                  )}
                  {ep.duration && (
                    <>
                      <span aria-hidden className="text-rule">·</span>
                      <span>{ep.duration}</span>
                    </>
                  )}
                  <span aria-hidden className="text-rule">·</span>
                  <a
                    href={youtubeWatchUrl(ep.youtubeId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-paper transition-colors hover:text-gold"
                  >
                    Watch on YouTube →
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Embedded player */}
            <Reveal delay={0.08} className="mx-auto mt-12 max-w-3xl lg:mt-16">
              <div className="relative aspect-video w-full overflow-hidden bg-card">
                <iframe
                  src={youtubeEmbedUrl(ep.youtubeId)}
                  title={ep.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </Reveal>

            {/* Description */}
            {ep.description ? (
              <Reveal delay={0.12} className="mt-16 lg:mt-20">
                <p className="mx-auto max-w-3xl font-body text-paper text-[22px] leading-[1.55] lg:text-[26px]">
                  {ep.description}
                </p>
              </Reveal>
            ) : null}
          </div>
          <div aria-hidden className="mx-auto h-px max-w-content bg-rule" />
        </section>

        {/* Related episodes */}
        <section className="relative bg-surface">
          <div className="mx-auto max-w-content px-8 py-24 lg:px-10 lg:py-32">
            <div className="mb-14 grid gap-8 lg:mb-20 lg:grid-cols-12 lg:gap-12">
              <Reveal className="lg:col-span-7">
                <h2 className="break-words font-display text-[36px] leading-[1.02] tracking-[-0.015em] sm:text-[40px] sm:leading-[1.0] lg:text-[56px]">
                  <DropCap letter="M" size="md" />ore
                  <span className="italic font-light text-sub"> conversations.</span>
                  <span className="clear-both block" />
                </h2>
              </Reveal>
              <Reveal delay={0.08} className="self-end lg:col-span-5 lg:col-start-8">
                <p className="max-w-md font-body italic text-sub text-[17px] leading-[1.55]">
                  Three more conversations on the questions that matter.
                </p>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
              {related.map((r, i) => (
                <EpisodeCard
                  key={r.youtubeId}
                  episode={r}
                  delay={i * 0.08}
                  contentClassName="p-6 lg:p-7"
                />
              ))}
            </div>
          </div>
          <div aria-hidden className="mx-auto h-px max-w-content bg-rule" />
        </section>
      </main>
      <Footer />
    </>
  );
}
