import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { DropCap } from "@/components/site/DropCap";
import { EpisodeCard } from "@/components/site/EpisodeCard";
import { Button } from "@/components/site/Button";
import { JsonLd } from "@/components/site/JsonLd";
import { getAllEpisodes } from "@/sanity/lib/queries";
import { breadcrumbSchema, guestArchetypesSchema, siteUrl } from "@/lib/seo";

export const revalidate = 3600;

const voices: { label: string; archetype: string; body: string }[] = [
  {
    label: "Founders & Operators",
    archetype: "The story behind the company.",
    body: "People who started something and lived past the launch. What kept the lights on, and what they wish they had known.",
  },
  {
    label: "Planners & Producers",
    archetype: "The makers behind the moments.",
    body: "Wedding planners, event producers, designers. People whose work goes uncredited but whose taste sets the room.",
  },
  {
    label: "Clergy & Counselors",
    archetype: "The people who hold the hard hours.",
    body: "Pastors, therapists, mentors. The ones other people call when the wheels come off.",
  },
  {
    label: "Civic Voices",
    archetype: "Power without the soundbite.",
    body: "Lobbyists, organizers, public servants. How things actually get done, away from the debate clip.",
  },
  {
    label: "Immigrants & Diaspora",
    archetype: "Two continents, one life.",
    body: "Families across borders. The cost of arriving and the cost of staying. The version that rarely makes the headline.",
  },
  {
    label: "Creatives at Work",
    archetype: "The middle of a creative life.",
    body: "Writers, musicians, designers, photographers. Process, paychecks, persistence.",
  },
  {
    label: "Faith & Doubt",
    archetype: "The questions belief asks of you.",
    body: "Believers, seekers, ex-believers. What people work out alone, said out loud.",
  },
];

export const metadata: Metadata = {
  title: "Guests",
  description:
    "The kinds of voices on Deep Dives. Founders, planners, clergy, civic voices, immigrants, creatives. Pitch yourself.",
  alternates: { canonical: "/guests" },
};

export default async function GuestsPage() {
  const recentGuestEpisodes = (await getAllEpisodes()).slice(0, 4);

  return (
    <>
      <JsonLd
        data={[
          guestArchetypesSchema(voices),
          breadcrumbSchema([
            { name: "Home", url: siteUrl() },
            { name: "Guests", url: `${siteUrl()}/guests` },
          ]),
        ]}
      />
      <Header />
      <main id="main">
        {/* Masthead */}
        <section className="relative">
          <div className="mx-auto max-w-content px-8 pb-16 pt-20 lg:px-10 lg:pb-20 lg:pt-28">
            <Reveal className="text-center">
              <h1 className="inline-block text-left font-display text-[44px] leading-[1.0] tracking-[-0.015em] text-paper sm:text-[64px] sm:leading-[0.96] lg:text-[96px]">
                <DropCap letter="V" />oices
                <span className="block whitespace-nowrap italic font-light text-sub">we feature.</span>
                <span className="clear-both block" />
              </h1>
            </Reveal>
          </div>
          <div aria-hidden className="mx-auto h-px max-w-content bg-rule" />
        </section>

        {/* Voices grid */}
        <section className="relative bg-surface">
          <div className="mx-auto max-w-content px-8 py-16 lg:px-10 lg:py-20">
            <div className="grid grid-cols-1 gap-px bg-rule sm:grid-cols-2 lg:grid-cols-3">
              {voices.map((v, i) => (
                <Reveal key={v.label} delay={i * 0.06} className="bg-surface p-8 lg:p-10">
                  <p className="font-body text-[11px] uppercase tracking-[0.32em] text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-5 font-display text-[26px] leading-[1.15] text-paper">
                    {v.label}
                  </h2>
                  <p className="mt-3 font-display italic text-[18px] text-gold">{v.archetype}</p>
                  <p className="mt-5 font-body text-sub text-[15px] leading-[1.6]">{v.body}</p>
                </Reveal>
              ))}
              {Array.from({ length: (3 - (voices.length % 3)) % 3 }).map((_, i) => (
                <div key={`filler-${i}`} aria-hidden className="hidden bg-surface lg:block" />
              ))}
            </div>
          </div>
          <div aria-hidden className="mx-auto h-px max-w-content bg-rule" />
        </section>

        {/* Recent conversations */}
        <section className="relative">
          <div className="mx-auto max-w-content px-8 py-16 lg:px-10 lg:py-20">
            <div className="mb-16 grid gap-8 lg:mb-20 lg:grid-cols-12 lg:gap-12">
              <Reveal className="lg:col-span-7">
                <h2 className="break-words font-display text-[40px] leading-[1.02] tracking-[-0.015em] sm:text-[44px] sm:leading-[1.0] lg:text-[64px]">
                  <DropCap letter="T" size="md" />he latest
                  <span className="italic font-light text-sub"> guests.</span>
                  <span className="clear-both block" />
                </h2>
              </Reveal>
              <Reveal delay={0.08} className="self-end lg:col-span-5 lg:col-start-8">
                <p className="max-w-md font-body italic text-sub text-[17px] leading-[1.55]">
                  Watch the conversations themselves. Guest names and notes are in each
                  episode.
                </p>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-7">
              {recentGuestEpisodes.map((ep, i) => (
                <EpisodeCard
                  key={ep.youtubeId}
                  episode={ep}
                  delay={i * 0.08}
                  showPlayBadge={false}
                />
              ))}
            </div>
          </div>
          <div aria-hidden className="mx-auto h-px max-w-content bg-rule" />
        </section>

        {/* Pitch yourself CTA */}
        <section className="relative">
          <div className="mx-auto max-w-content px-8 py-16 lg:px-10 lg:py-20">
            <Reveal className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-7">
                <h2 className="break-words font-display text-[40px] leading-[1.02] tracking-[-0.015em] sm:text-[44px] sm:leading-[1.0] lg:text-[64px]">
                  <DropCap letter="P" size="md" />itch
                  <span className="italic font-light text-sub"> yourself.</span>
                  <span className="clear-both block" />
                </h2>
                <p className="mt-6 max-w-xl font-body italic text-sub text-[18px] leading-[1.55]">
                  See yourself in any of the voices above? Or somewhere close to
                  them? An expert in a topic the rest of us are trying to figure
                  out? I&rsquo;d love to have you on the show. Get in touch!
                </p>
              </div>
              <div className="lg:col-span-5 lg:flex lg:items-end lg:justify-end">
                <Button variant="primary" href="/contact">
                  Pitch a Guest
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
