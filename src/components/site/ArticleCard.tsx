import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/site/Reveal";
import type { Article } from "@/lib/types";

type Props = {
  article: Article;
  /** Reveal stagger delay in seconds. */
  delay?: number;
  /** "h2" on the articles index, "h3" elsewhere. */
  headingLevel?: 2 | 3;
};

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Outlined article card, consistent with EpisodeCard chrome. Uses the cover
 * image when present; otherwise a typographic fallback panel.
 */
export function ArticleCard({ article: a, delay = 0, headingLevel = 3 }: Props) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <Reveal
      delay={delay}
      className="group border border-rule bg-card transition-colors duration-300 hover:border-gold/40"
    >
      <article>
        <Link href={`/blog/${a.slug}`} className="block">
          <div className="relative aspect-video overflow-hidden bg-deep-gray">
            {a.coverImage?.url ? (
              <Image
                src={a.coverImage.url}
                alt={a.coverImage.alt ?? a.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center px-6">
                <span className="text-center font-display italic text-[22px] leading-[1.2] text-sub">
                  Deep Dives
                </span>
              </div>
            )}
            {a.featured && (
              <span className="absolute left-3 top-3 bg-gold px-2.5 py-1 font-body text-[11px] uppercase tracking-[0.16em] text-ink">
                Featured
              </span>
            )}
          </div>

          <div className="p-6">
            <div className="flex items-center gap-3 font-body text-[11px] uppercase tracking-[0.28em] text-gold">
              {a.category && <span>{a.category}</span>}
              {a.category && a.publishedAt && (
                <span aria-hidden className="text-rule">·</span>
              )}
              <span className="text-muted">{formatDate(a.publishedAt)}</span>
            </div>
            <Heading className="mt-3 font-display text-[22px] leading-[1.18] text-paper transition-colors duration-200 group-hover:text-gold">
              {a.title}
            </Heading>
            {a.excerpt && (
              <p className="mt-3 font-body text-sub text-[15px] leading-[1.55]">
                {a.excerpt}
              </p>
            )}
          </div>
        </Link>
      </article>
    </Reveal>
  );
}
