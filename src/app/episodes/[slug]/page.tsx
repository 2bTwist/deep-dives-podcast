import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { EpisodeThumbStatic } from "@/components/EpisodeThumbStatic";
import { JsonLd } from "@/components/site/JsonLd";
import { getAllEpisodes, getEpisodeBySlug, getEpisodeSlugs } from "@/sanity/lib/queries";
import { youtubeEmbedUrl, youtubeThumb, youtubeWatchUrl } from "@/lib/youtube";
import { breadcrumbSchema, podcastEpisodeSchema, siteUrl } from "@/lib/seo";

type Params = { slug: string };

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
  const image = youtubeThumb(ep.youtubeId, "maxres");
  return {
    title: `${ep.title} — Deep Dive Podcast with Raissa`,
    description: ep.description,
    alternates: { canonical: `/episodes/${ep.slug}` },
    openGraph: {
      type: "video.episode",
      title: ep.title,
      description: ep.description,
      url: `/episodes/${ep.slug}`,
      images: [{ url: image, width: 1280, height: 720, alt: ep.title }],
      ...(ep.publishedAt ? { publishedTime: ep.publishedAt } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ep.title,
      description: ep.description,
      images: [image],
    },
  };
}

export default async function EpisodePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const [ep, all] = await Promise.all([getEpisodeBySlug(slug), getAllEpisodes()]);
  if (!ep) notFound();

  const related = all.filter((e) => e.slug !== slug).slice(0, 3);

  const structured = [
    podcastEpisodeSchema(ep),
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
      <main>
        {/* Episode hero */}
        <section className="relative">
          <div className="mx-auto max-w-[1400px] px-8 py-20 lg:px-10 lg:py-28">
            <Reveal>
              <Link
                href="/episodes"
                className="group inline-flex items-center gap-2 font-body text-[12px] uppercase tracking-[0.28em] text-muted transition-colors hover:text-gold"
              >
                <span className="text-[14px] transition-transform duration-200 group-hover:-translate-x-0.5">
                  ←
                </span>
                All Episodes
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
                  <span>{formatDate(ep.publishedAt)}</span>
                  <span aria-hidden className="text-rule">·</span>
                  <span>{ep.duration}</span>
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
            <Reveal delay={0.08} className="mt-12 lg:mt-16">
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
              <Reveal delay={0.12} className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-4">
                  <p className="font-body text-[12px] uppercase tracking-[0.32em] text-gold">
                    About this episode
                  </p>
                </div>
                <div className="lg:col-span-8">
                  <p className="font-body text-paper text-[22px] leading-[1.55] lg:text-[26px]">
                    {ep.description}
                  </p>
                </div>
              </Reveal>
            ) : null}
          </div>
          <div aria-hidden className="mx-auto h-px max-w-[1400px] bg-rule" />
        </section>

        {/* Related episodes */}
        <section className="relative bg-surface">
          <div className="mx-auto max-w-[1400px] px-8 py-24 lg:px-10 lg:py-32">
            <div className="mb-14 grid gap-8 lg:mb-20 lg:grid-cols-12 lg:gap-12">
              <Reveal className="lg:col-span-7">
                <p className="font-body text-[12px] uppercase tracking-[0.32em] text-gold">
                  Keep watching
                </p>
                <h2 className="mt-5 font-display text-[40px] leading-[1.0] tracking-[-0.015em] lg:text-[56px]">
                  More <span className="italic font-light text-sub">conversations.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.08} className="self-end lg:col-span-4 lg:col-start-9">
                <p className="max-w-md font-body italic text-sub text-[17px] leading-[1.55]">
                  Other long-form interviews worth your full attention.
                </p>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
              {related.map((r, i) => (
                <Reveal
                  key={r.youtubeId}
                  delay={i * 0.08}
                  className="group border border-rule bg-card transition-colors duration-300 hover:border-gold/40"
                >
                  <Link href={`/episodes/${r.slug}`} className="block">
                    <div className="relative aspect-video overflow-hidden bg-card">
                      <EpisodeThumbStatic
                        id={r.youtubeId}
                        alt={r.title}
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
                        {r.duration}
                      </span>
                    </div>
                    <div className="p-6 lg:p-7">
                      <p className="font-body text-[11px] uppercase tracking-[0.28em] text-gold">
                        {r.category}
                      </p>
                      <h3 className="mt-3 font-display text-[22px] leading-[1.18] text-paper transition-colors duration-200 group-hover:text-gold">
                        {r.title}
                      </h3>
                      <p className="mt-5 font-body italic text-sub text-[13px]">
                        {formatDate(r.publishedAt)}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
          <div aria-hidden className="mx-auto h-px max-w-[1400px] bg-rule" />
        </section>
      </main>
      <Footer />
    </>
  );
}
