import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/site/Reveal";
import type { GuestCard } from "@/lib/types";

/**
 * A single entry on the guest wall. Typographic (name / title · company),
 * with an optional headshot. Links to the guest's profile page.
 */
export function GuestEntry({ guest: g, delay = 0 }: { guest: GuestCard; delay?: number }) {
  return (
    <Reveal
      delay={delay}
      className="group border border-rule bg-card transition-colors duration-300 hover:border-gold/40"
    >
      <Link
        href={`/guests/${g.slug}`}
        className="flex h-full items-start gap-5 p-6 lg:p-7"
      >
        {g.photo?.url && (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-deep-gray">
            <Image
              src={g.photo.url}
              alt={g.photo.alt ?? g.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[22px] leading-[1.15] text-paper transition-colors group-hover:text-gold">
            {g.name}
          </h3>
          {(g.title || g.company) && (
            <p className="mt-2 font-body text-sub text-[14px] leading-[1.5]">
              {g.title}
              {g.title && g.company ? " · " : ""}
              {g.company}
            </p>
          )}
          {g.episodeCount > 1 && (
            <p className="mt-3 font-body text-[11px] uppercase tracking-[0.2em] text-gold/70">
              {g.episodeCount} episodes
            </p>
          )}
        </div>
        <span
          aria-hidden
          className="mt-1 shrink-0 text-gold/50 transition-all duration-200 group-hover:translate-x-1 group-hover:text-gold"
        >
          →
        </span>
      </Link>
    </Reveal>
  );
}
