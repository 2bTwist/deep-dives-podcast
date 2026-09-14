import Link from "next/link";
import { Reveal } from "@/components/site/Reveal";
import { DropCap } from "@/components/site/DropCap";
import { EpisodeCard } from "@/components/site/EpisodeCard";
import { getAllEpisodes } from "@/sanity/lib/queries";

export async function ConversationsSection() {
  const all = await getAllEpisodes();
  // Show next 4 episodes after the featured one (top of /episodes will show all)
  const featuredId = all[0]?.youtubeId;
  const list = all.filter((e) => e.youtubeId !== featuredId).slice(0, 4);
  if (list.length === 0) return null;

  return (
    <section className="relative">
      <div className="mx-auto max-w-content px-8 py-28 lg:px-10 lg:py-32">
        {/* Masthead */}
        <div className="mb-16 grid gap-8 lg:mb-20 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <h2 className="break-words font-display text-[44px] leading-[1.0] tracking-[-0.015em] sm:text-[56px] sm:leading-[0.98] lg:text-[72px]">
              <DropCap letter="R" size="md" />ecent
              <span className="block italic font-light text-sub">Conversations</span>
              <span className="clear-both block" />
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="self-end lg:col-span-7 lg:col-start-6">
            <p className="max-w-md font-body italic text-sub text-[18px] leading-[1.55]">
              The newest drops. Founders, planners, pastors, lobbyists, writers,
              and a few people who don&rsquo;t fit any of those.
            </p>
            <Link
              href="/episodes"
              className="group mt-6 inline-flex items-baseline gap-3 font-body text-[14px] uppercase tracking-[0.14em] text-gold transition-colors hover:text-gold-bright"
            >
              <span className="border-b border-gold/50 pb-1 transition-colors group-hover:border-gold-bright">More episodes</span>
              <span className="text-[15px] transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>
        </div>

        {/* Phones swipe through the cards, with the next one peeking in. Tablets and up get the grid. */}
        <ul className="-mx-8 flex snap-x snap-mandatory scroll-px-8 gap-4 overflow-x-auto px-8 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4 lg:gap-7">
          {list.map((ep, i) => (
            <li key={ep.youtubeId} className="w-[82%] shrink-0 snap-start md:w-auto [&>div]:h-full">
              <EpisodeCard episode={ep} delay={i * 0.08} />
            </li>
          ))}
        </ul>
      </div>

      <div aria-hidden className="mx-auto h-px max-w-content bg-rule" />
    </section>
  );
}
