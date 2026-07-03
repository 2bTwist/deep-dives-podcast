import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { EpisodeCard } from "@/components/site/EpisodeCard";
import { JsonLd } from "@/components/site/JsonLd";
import { getGuestBySlug, getGuestSlugs } from "@/sanity/lib/queries";
import { guestSchema, breadcrumbSchema, siteUrl } from "@/lib/seo";

type Params = { slug: string };

export const revalidate = 3600;

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getGuestSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = await getGuestBySlug(slug);
  if (!g) return {};
  const role = [g.title, g.company].filter(Boolean).join(" · ");
  const description = g.bio ?? `${g.name}${role ? ` — ${role}` : ""}, on Deep Dives.`;
  const image = g.photo?.url ?? `${siteUrl()}/og.jpg`;
  return {
    title: g.name,
    description,
    alternates: { canonical: `/guests/${g.slug}` },
    openGraph: {
      type: "profile",
      title: g.name,
      description,
      url: `/guests/${g.slug}`,
      images: [{ url: image, alt: g.photo?.alt ?? g.name }],
    },
  };
}

export default async function GuestProfilePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const g = await getGuestBySlug(slug);
  if (!g) notFound();

  const role = [g.title, g.company].filter(Boolean).join(" · ");

  const structured = [
    guestSchema(g),
    breadcrumbSchema([
      { name: "Home", url: siteUrl() },
      { name: "Guests", url: `${siteUrl()}/guests` },
      { name: g.name },
    ]),
  ];

  return (
    <>
      <JsonLd data={structured} />
      <Header />
      <main id="main">
        <section className="relative">
          <div className="mx-auto max-w-content px-8 py-20 lg:px-10 lg:py-28">
            <Reveal>
              <Link
                href="/guests"
                className="group inline-flex items-baseline gap-3 font-body text-[14px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-gold"
              >
                <span className="text-[15px] transition-transform duration-200 ease-out group-hover:-translate-x-1">
                  ←
                </span>
                <span className="border-b border-muted/40 pb-1 transition-colors group-hover:border-gold/60">
                  All guests
                </span>
              </Link>
            </Reveal>

            <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-16">
              {g.photo?.url && (
                <Reveal className="lg:col-span-4">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-card">
                    <Image
                      src={g.photo.url}
                      alt={g.photo.alt ?? g.name}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                </Reveal>
              )}

              <Reveal
                delay={0.06}
                className={g.photo?.url ? "lg:col-span-8" : "lg:col-span-9"}
              >
                <p className="font-body text-[12px] uppercase tracking-[0.32em] text-gold">
                  {g.archetype}
                </p>
                <h1 className="mt-5 font-display text-[40px] leading-[1.04] tracking-[-0.015em] lg:text-[62px]">
                  {g.name}
                </h1>
                {role && (
                  <p className="mt-5 font-body italic text-sub text-[18px] leading-[1.5]">
                    {role}
                  </p>
                )}
                {g.bio && (
                  <p className="mt-8 max-w-2xl font-body text-paper text-[19px] leading-[1.7]">
                    {g.bio}
                  </p>
                )}
              </Reveal>
            </div>
          </div>
          <div aria-hidden className="mx-auto h-px max-w-content bg-rule" />
        </section>

        {/* Their episodes */}
        <section className="relative bg-surface">
          <div className="mx-auto max-w-content px-8 py-16 lg:px-10 lg:py-24">
            <Reveal className="mb-12 lg:mb-16">
              <h2 className="font-display text-[30px] leading-[1.1] tracking-[-0.01em] text-paper lg:text-[44px]">
                On Deep Dives
                <span className="italic font-light text-sub">
                  {" "}
                  {g.episodes.length > 1
                    ? `· ${g.episodes.length} episodes`
                    : ""}
                </span>
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
              {g.episodes.map((ep, i) => (
                <EpisodeCard key={ep.slug} episode={ep} delay={i * 0.08} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
