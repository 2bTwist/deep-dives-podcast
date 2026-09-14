import { notFound } from "next/navigation";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { ConversationsSection } from "@/components/site/ConversationsSection";
import { AboutTeaserSection } from "@/components/site/AboutTeaserSection";
import { CommunitySection } from "@/components/site/CommunitySection";
import { BeAGuestSection } from "@/components/site/BeAGuestSection";
import { Footer } from "@/components/site/Footer";
import { JsonLd } from "@/components/site/JsonLd";
import { getFeaturedEpisode } from "@/sanity/lib/queries";
import {
  organizationSchema,
  pageMetadata,
  podcastSeriesSchema,
  SITE_DESCRIPTION,
  SITE_NAME,
  websiteSchema,
} from "@/lib/seo";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: { absolute: SITE_NAME },
  description: SITE_DESCRIPTION,
  path: "/",
});

export default async function HomePage() {
  const featured = await getFeaturedEpisode();
  if (!featured) notFound();

  return (
    <>
      <JsonLd data={[websiteSchema(), organizationSchema(), podcastSeriesSchema()]} />
      <Header />
      <main id="main">
        <Hero featured={featured} />
        <ConversationsSection />
        <AboutTeaserSection />
        <BeAGuestSection className="relative bg-ink" />
        <CommunitySection />
      </main>
      <Footer />
    </>
  );
}
