import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { ConversationsSection } from "@/components/site/ConversationsSection";
import { WhyIStartedSection } from "@/components/site/WhyIStartedSection";
import { CommunitySection } from "@/components/site/CommunitySection";
import { Footer } from "@/components/site/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ConversationsSection />
        <WhyIStartedSection />
        <CommunitySection />
      </main>
      <Footer />
    </>
  );
}
