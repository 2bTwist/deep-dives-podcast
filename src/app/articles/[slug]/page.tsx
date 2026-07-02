import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { PortableBody } from "@/components/site/PortableBody";
import { EpisodeThumbStatic } from "@/components/site/EpisodeThumbStatic";
import { CommunitySection } from "@/components/site/CommunitySection";
import { JsonLd } from "@/components/site/JsonLd";
import { getArticleBySlug, getArticleSlugs } from "@/sanity/lib/queries";
import { articleSchema, breadcrumbSchema, siteUrl } from "@/lib/seo";
import { readingTimeMinutes } from "@/lib/reading-time";

type Params = { slug: string };

export const revalidate = 300;

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getArticleSlugs();
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
  const a = await getArticleBySlug(slug);
  if (!a) return {};
  const image = a.coverImage?.url ?? `${siteUrl()}/og.jpg`;
  return {
    title: a.title,
    description: a.excerpt,
    alternates: { canonical: `/articles/${a.slug}` },
    openGraph: {
      type: "article",
      title: a.title,
      description: a.excerpt,
      url: `/articles/${a.slug}`,
      images: [{ url: image, alt: a.coverImage?.alt ?? a.title }],
      ...(a.publishedAt ? { publishedTime: a.publishedAt } : {}),
      ...(a.dateModified ? { modifiedTime: a.dateModified } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: a.title,
      description: a.excerpt,
      images: [image],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const a = await getArticleBySlug(slug);
  if (!a) notFound();

  const minutes = readingTimeMinutes(a.body);

  const structured = [
    articleSchema(a),
    breadcrumbSchema([
      { name: "Home", url: siteUrl() },
      { name: "Articles", url: `${siteUrl()}/articles` },
      { name: a.title },
    ]),
  ];

  return (
    <>
      <JsonLd data={structured} />
      <Header />
      <main id="main">
        <article>
          <section className="relative">
            <div className="mx-auto max-w-content px-8 py-20 lg:px-10 lg:py-28">
              <Reveal>
                <Link
                  href="/articles"
                  className="group inline-flex items-baseline gap-3 font-body text-[14px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-gold"
                >
                  <span className="text-[15px] transition-transform duration-200 ease-out group-hover:-translate-x-1">
                    ←
                  </span>
                  <span className="border-b border-muted/40 pb-1 transition-colors group-hover:border-gold/60">
                    All articles
                  </span>
                </Link>
              </Reveal>

              <Reveal className="mt-10 lg:mt-14">
                {a.category && (
                  <p className="font-body text-[12px] uppercase tracking-[0.32em] text-gold">
                    {a.category}
                  </p>
                )}
                <h1 className="mt-5 font-display text-[40px] leading-[1.04] tracking-[-0.015em] lg:text-[62px]">
                  {a.title}
                </h1>
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-body italic text-sub text-[14px]">
                  <span>By Raissa</span>
                  <span aria-hidden className="text-rule">·</span>
                  <span>{formatDate(a.publishedAt)}</span>
                  {a.dateModified && a.dateModified !== a.publishedAt && (
                    <>
                      <span aria-hidden className="text-rule">·</span>
                      <span>Updated {formatDate(a.dateModified)}</span>
                    </>
                  )}
                  <span aria-hidden className="text-rule">·</span>
                  <span>{minutes} min read</span>
                </div>
              </Reveal>

              {a.coverImage?.url ? (
                <Reveal delay={0.08} className="mt-12 lg:mt-16">
                  <div className="relative aspect-video w-full overflow-hidden bg-card">
                    <Image
                      src={a.coverImage.url}
                      alt={a.coverImage.alt ?? a.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 1100px"
                      className="object-cover"
                    />
                  </div>
                </Reveal>
              ) : (
                a.relatedEpisode?.youtubeId && (
                  <Reveal delay={0.08} className="mt-12 lg:mt-16">
                    <Link
                      href={`/episodes/${a.relatedEpisode.slug}`}
                      className="group block"
                      aria-label={`Watch the full episode: ${a.relatedEpisode.title}`}
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-card">
                        <EpisodeThumbStatic
                          id={a.relatedEpisode.youtubeId}
                          alt={a.relatedEpisode.title}
                          width={1280}
                          height={720}
                          priority
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                        <span className="pointer-events-none absolute inset-0 grid place-items-center">
                          <span className="grid h-16 w-16 place-items-center rounded-full bg-gold/95 text-ink shadow-lg transition-transform duration-300 group-hover:scale-110 lg:h-20 lg:w-20">
                            <svg
                              viewBox="0 0 12 12"
                              className="h-5 w-5 translate-x-[1px] lg:h-6 lg:w-6"
                              fill="currentColor"
                              aria-hidden
                            >
                              <polygon points="2,0 12,6 2,12" />
                            </svg>
                          </span>
                        </span>
                      </div>
                      <p className="mt-3 font-body text-[13px] uppercase tracking-[0.22em] text-muted transition-colors group-hover:text-gold">
                        Watch the full episode
                        <span
                          aria-hidden
                          className="ml-2 inline-block transition-transform group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </p>
                    </Link>
                  </Reveal>
                )
              )}

              <Reveal delay={0.12} className="mx-auto mt-14 max-w-3xl lg:mt-16">
                <PortableBody value={a.body} />
              </Reveal>

              {a.relatedEpisode?.slug && (
                <Reveal className="mx-auto mt-16 max-w-3xl">
                  <Link
                    href={`/episodes/${a.relatedEpisode.slug}`}
                    className="group block border border-rule bg-card p-7 transition-colors duration-300 hover:border-gold/40"
                  >
                    <p className="font-body text-[11px] uppercase tracking-[0.28em] text-gold">
                      Watch the full episode
                    </p>
                    <p className="mt-3 font-display text-[24px] leading-[1.2] text-paper transition-colors group-hover:text-gold">
                      {a.relatedEpisode.title}
                      <span className="ml-2 inline-block text-[16px] transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </p>
                  </Link>
                </Reveal>
              )}
            </div>
            <div aria-hidden className="mx-auto h-px max-w-content bg-rule" />
          </section>
        </article>

        <CommunitySection />
      </main>
      <Footer />
    </>
  );
}
