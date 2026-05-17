import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { DropCap } from "@/components/site/DropCap";
import { NewBadge } from "@/components/site/NewBadge";
import { EpisodeThumbStatic } from "@/components/EpisodeThumbStatic";
import { getAllEpisodes } from "@/sanity/lib/queries";

export const revalidate = 3600;

const voices: { label: string; archetype: string; body: string }[] = [
  {
    label: "Founders & Operators",
    archetype: "Past the pitch deck.",
    body: "People who started something and lived past the launch. What kept the lights on. What they wish they had known.",
  },
  {
    label: "Planners & Producers",
    archetype: "Past the photo shoot.",
    body: "The makers behind the moments. Wedding planners, event producers, designers, the people whose work goes uncredited.",
  },
  {
    label: "Clergy & Counselors",
    archetype: "Past the Sunday cadence.",
    body: "Pastors, therapists, mentors. The people who hold other people's hardest hours.",
  },
  {
    label: "Civic Voices",
    archetype: "Past the campaign cycle.",
    body: "Lobbyists, organizers, public servants. Conversations about power and participation that don't fit a debate clip.",
  },
  {
    label: "Immigrants & Diaspora",
    archetype: "Past the headline.",
    body: "Families across two continents. The cost of arriving and the cost of staying. The America that rarely asks.",
  },
  {
    label: "Creatives at Work",
    archetype: "Past the highlight reel.",
    body: "Writers, musicians, designers, photographers. The middle of a creative life. Process, paychecks, persistence.",
  },
  {
    label: "Faith & Doubt",
    archetype: "Past the certainty.",
    body: "Believers, seekers, ex-believers. The questions belief asks of the people who hold it.",
  },
];

export const metadata: Metadata = {
  title: "Guests",
  description:
    "The kinds of voices Deep Dives features. Founders, planners, clergy, civic voices, immigrants, creatives. Pitch yourself.",
};

export default async function GuestsPage() {
  const recentGuestEpisodes = (await getAllEpisodes()).slice(0, 4);

  return (
    <>
      <Header />
      <main>
        {/* Masthead */}
        <section className="relative">
          <div className="mx-auto max-w-[1400px] px-8 py-32 lg:px-10 lg:py-40">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-7">
                <h1 className="font-display text-[64px] leading-[0.96] tracking-[-0.015em] lg:text-[96px]">
                  <DropCap letter="V" />oices
                  <span className="italic font-light text-sub"> we feature.</span>
                  <span className="clear-both block" />
                </h1>
              </Reveal>
              <Reveal delay={0.1} className="self-end lg:col-span-5 lg:col-start-8">
                <p className="max-w-md font-body italic text-sub text-[18px] leading-[1.55]">
                  Deep Dives isn't a celebrity show. It's a conversation show. The full guest
                  directory is coming. For now, here's the kind of room we're building.
                </p>
              </Reveal>
            </div>
          </div>
          <div aria-hidden className="mx-auto h-px max-w-[1400px] bg-rule" />
        </section>

        {/* Voices grid */}
        <section className="relative bg-surface">
          <div className="mx-auto max-w-[1400px] px-8 py-28 lg:px-10 lg:py-36">
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
          <div aria-hidden className="mx-auto h-px max-w-[1400px] bg-rule" />
        </section>

        {/* Recent conversations */}
        <section className="relative">
          <div className="mx-auto max-w-[1400px] px-8 py-28 lg:px-10 lg:py-32">
            <div className="mb-16 grid gap-8 lg:mb-20 lg:grid-cols-12 lg:gap-12">
              <Reveal className="lg:col-span-7">
                <h2 className="font-display text-[44px] leading-[1.0] tracking-[-0.015em] lg:text-[64px]">
                  <DropCap letter="T" />he latest
                  <span className="italic font-light text-sub"> guests.</span>
                  <span className="clear-both block" />
                </h2>
              </Reveal>
              <Reveal delay={0.08} className="self-end lg:col-span-5 lg:col-start-8">
                <p className="max-w-md font-body italic text-sub text-[17px] leading-[1.55]">
                  Watch the conversations themselves. Guest names and topic notes live in each
                  episode.
                </p>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-7">
              {recentGuestEpisodes.map((ep, i) => (
                <Reveal
                  key={ep.youtubeId}
                  delay={i * 0.08}
                  className="group border border-rule bg-card transition-colors duration-300 hover:border-gold/40"
                >
                  <Link href={`/episodes/${ep.slug}`} className="block">
                    <div className="relative aspect-video overflow-hidden bg-card">
                      <EpisodeThumbStatic
                        id={ep.youtubeId}
                        alt={ep.title}
                        width={640}
                        height={360}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                      <span className="absolute right-3 top-3 bg-ink/85 px-2.5 py-1 font-body text-[11px] uppercase tracking-[0.16em] text-paper">
                        {ep.duration}
                      </span>
                      <NewBadge publishedAt={ep.publishedAt} />
                    </div>
                    <div className="p-6">
                      <p className="font-body text-[11px] uppercase tracking-[0.28em] text-gold">
                        {ep.category}
                      </p>
                      <h3 className="mt-3 font-display text-[20px] leading-[1.2] text-paper transition-colors duration-200 group-hover:text-gold">
                        {ep.title}
                      </h3>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
          <div aria-hidden className="mx-auto h-px max-w-[1400px] bg-rule" />
        </section>

        {/* Pitch yourself CTA */}
        <section className="relative">
          <div className="mx-auto max-w-[1400px] px-8 py-28 lg:px-10 lg:py-32">
            <Reveal className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-7">
                <h2 className="font-display text-[44px] leading-[1.0] tracking-[-0.015em] lg:text-[64px]">
                  <DropCap letter="P" />itch
                  <span className="italic font-light text-sub"> yourself.</span>
                  <span className="clear-both block" />
                </h2>
                <p className="mt-6 max-w-xl font-body italic text-sub text-[18px] leading-[1.55]">
                  If your story doesn't fit a tweet, or hasn't been told the way you'd tell it,
                  send it in. The best pitches start with the one moment you'd open the
                  conversation with.
                </p>
              </div>
              <div className="lg:col-span-5 lg:flex lg:items-end lg:justify-end">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-3 bg-gold px-7 py-3.5 text-[12px] font-medium uppercase tracking-[0.24em] text-ink transition-colors duration-200 hover:bg-gold-bright"
                >
                  Pitch a Guest
                  <span className="text-[14px] transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
