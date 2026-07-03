import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { DropCap } from "@/components/site/DropCap";
import { ArticleCard } from "@/components/site/ArticleCard";
import { JsonLd } from "@/components/site/JsonLd";
import { getAllArticles } from "@/sanity/lib/queries";
import { articleListSchema, breadcrumbSchema, siteUrl } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Essays and notes from Deep Dives Podcast with Raissa. Going deep on the questions that shape modern life: work, money, faith, immigration, relationships.",
  alternates: { canonical: "/blog" },
};

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  return (
    <>
      <JsonLd
        data={[
          articleListSchema(articles),
          breadcrumbSchema([
            { name: "Home", url: siteUrl() },
            { name: "Blog", url: `${siteUrl()}/blog` },
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
                  <DropCap letter="T" />he
                  <span className="italic font-light text-sub"> Blog.</span>
                  <span className="clear-both block" />
                </h1>
              </Reveal>
              <Reveal delay={0.08} className="self-end lg:col-span-5 lg:col-start-8">
                <p className="max-w-md font-body italic text-sub text-[18px] leading-[1.55]">
                  Writing around the conversations: the ideas, the questions, and what
                  the experts taught us. New episodes always on YouTube.
                </p>
              </Reveal>
            </div>

            {articles.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
                {articles.map((a, i) => (
                  <ArticleCard
                    key={a._id ?? a.slug}
                    article={a}
                    delay={i * 0.08}
                    headingLevel={2}
                  />
                ))}
              </div>
            ) : (
              <Reveal>
                <p className="font-body italic text-sub text-[18px]">
                  First pieces are on the way. Check back soon.
                </p>
              </Reveal>
            )}
          </div>

          <div aria-hidden className="mx-auto h-px max-w-content bg-rule" />
        </section>
      </main>
      <Footer />
    </>
  );
}
