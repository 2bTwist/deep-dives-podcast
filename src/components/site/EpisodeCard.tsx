import Link from "next/link";
import { EpisodeThumbStatic } from "@/components/site/EpisodeThumbStatic";
import { Reveal } from "@/components/site/Reveal";
import { NewBadge } from "@/components/site/NewBadge";
import type { Episode } from "@/lib/types";

type Props = {
  episode: Episode;
  /** Reveal stagger delay in seconds. */
  delay?: number;
  /** "h2" on pages where cards are the primary content (episodes list). "h3" elsewhere. */
  headingLevel?: 2 | 3;
  /** Hide the hover play badge for sidebar/preview grids (e.g. /guests "latest"). */
  showPlayBadge?: boolean;
  /** Padding override on the content block. Defaults to "p-6". */
  contentClassName?: string;
};

/**
 * Standard outlined episode card used in every episode grid:
 *   - home (ConversationsSection)
 *   - /episodes (full list)
 *   - /episodes/[slug] (related)
 *   - /guests (latest)
 *
 * Card chrome stays identical across grids; callers choose heading level,
 * stagger delay, and whether to render the play badge.
 */
export function EpisodeCard({
  episode: ep,
  delay = 0,
  headingLevel = 3,
  showPlayBadge = true,
  contentClassName = "p-6",
}: Props) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <Reveal
      delay={delay}
      className="group border border-rule bg-card transition-colors duration-300 hover:border-gold/40"
    >
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
            {showPlayBadge && (
              <span className="pointer-events-none absolute bottom-3 left-3 grid h-10 w-10 place-items-center rounded-full bg-gold text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <svg viewBox="0 0 12 12" className="h-3.5 w-3.5 translate-x-[1px]" fill="currentColor" aria-hidden>
                  <polygon points="2,0 12,6 2,12" />
                </svg>
              </span>
            )}
            <span className="absolute right-3 top-3 bg-ink/85 px-2.5 py-1 font-body text-[11px] uppercase tracking-[0.16em] text-paper">
              {ep.duration}
            </span>
            <NewBadge publishedAt={ep.publishedAt} />
          </div>

          <div className={contentClassName}>
            <p className="font-body text-[11px] uppercase tracking-[0.28em] text-gold">
              {ep.category}
            </p>
            <Heading className="mt-3 font-display text-[22px] leading-[1.18] text-paper transition-colors duration-200 group-hover:text-gold">
              {ep.title}
            </Heading>
          </div>
        </Link>
      </article>
    </Reveal>
  );
}
