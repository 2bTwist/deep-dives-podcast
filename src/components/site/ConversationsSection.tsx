import Link from "next/link";
import { EpisodeThumbStatic } from "@/components/EpisodeThumbStatic";
import { Reveal } from "@/components/site/Reveal";
import { getAllEpisodes } from "@/sanity/lib/queries";

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export async function ConversationsSection() {
  const all = await getAllEpisodes();
  // Show next 4 episodes after the featured one (top of /episodes will show all)
  const featuredId = all[0]?.youtubeId;
  const list = all.filter((e) => e.youtubeId !== featuredId).slice(0, 4);
  if (list.length === 0) return null;

  return (
    <section className="relative">
      <div className="mx-auto max-w-[1400px] px-8 py-28 lg:px-10 lg:py-32">
        {/* Masthead */}
        <div className="mb-16 grid gap-8 lg:mb-20 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <p className="font-body text-[12px] uppercase tracking-[0.32em] text-gold">
              Latest Episodes
            </p>
            <h2 className="mt-5 font-display text-[56px] leading-[0.98] tracking-[-0.015em] lg:text-[72px]">
              Conversations <span className="block italic font-light text-sub">That Matter</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="self-end lg:col-span-6 lg:col-start-7">
            <p className="max-w-md font-body italic text-sub text-[18px] leading-[1.55]">
              Long-form interviews with people who lived the story before they told it. Founders,
              clergy, planners, lobbyists, immigrants, the under-asked.
            </p>
            <Link
              href="/episodes"
              className="group mt-6 inline-flex items-center gap-3 font-body text-[12px] uppercase tracking-[0.28em] text-paper hover:text-gold transition-colors"
            >
              More Episodes
              <span className="text-[14px] transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </Reveal>
        </div>

        {/* Episode card grid — 4 cards with hairline gold dividers between */}
        <div className="grid grid-cols-1 gap-px bg-rule md:grid-cols-2 lg:grid-cols-4">
          {list.map((ep, i) => (
            <Reveal key={ep.youtubeId} delay={i * 0.08} className="group bg-ink">
              <article>
              <Link href={`/episodes/${ep.slug}`} className="block">
                <div className="relative aspect-video overflow-hidden bg-card">
                  <EpisodeThumbStatic
                    id={ep.youtubeId}
                    alt={ep.title}
                    width={640}
                    height={360}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  {/* small gold play badge bottom-left, only on hover */}
                  <span className="pointer-events-none absolute bottom-3 left-3 grid h-10 w-10 place-items-center rounded-full bg-gold text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <svg viewBox="0 0 12 12" className="h-3.5 w-3.5 translate-x-[1px]" fill="currentColor" aria-hidden>
                      <polygon points="2,0 12,6 2,12" />
                    </svg>
                  </span>
                  {/* duration chip top-right */}
                  <span className="absolute right-3 top-3 bg-ink/85 px-2.5 py-1 font-body text-[11px] uppercase tracking-[0.16em] text-paper">
                    {ep.duration}
                  </span>
                </div>

                <div className="p-6">
                  <p className="font-body text-[11px] uppercase tracking-[0.28em] text-gold">
                    {ep.category}
                  </p>
                  <h3 className="mt-3 font-display text-[22px] leading-[1.18] text-paper transition-colors duration-200 group-hover:text-gold">
                    {ep.title}
                  </h3>
                  <p className="mt-6 font-body italic text-sub text-[13px]">
                    {formatDate(ep.publishedAt)}
                  </p>
                </div>
              </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <div aria-hidden className="mx-auto h-px max-w-[1400px] bg-rule" />
    </section>
  );
}
