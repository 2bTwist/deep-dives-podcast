import { notFound } from "next/navigation";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { ConversationsSection } from "@/components/site/ConversationsSection";
import { WhyIStartedSection } from "@/components/site/WhyIStartedSection";
import { CommunitySection } from "@/components/site/CommunitySection";
import { Footer } from "@/components/site/Footer";
import { JsonLd } from "@/components/site/JsonLd";
import { getFeaturedEpisode } from "@/sanity/lib/queries";
import { podcastSeriesSchema, websiteSchema } from "@/lib/seo";

export const revalidate = 300;

export default async function HomePage() {
  const featured = await getFeaturedEpisode();
  if (!featured) notFound();

  return (
    <>
      <JsonLd data={[websiteSchema(), podcastSeriesSchema()]} />
      <Header />
      <main>
        <Hero featured={featured} />
        <ConversationsSection />
        <WhyIStartedSection />
        <CommunitySection />
      </main>
      <Footer />
    </>
  );
}
