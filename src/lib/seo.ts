import type { Episode } from "@/lib/types";

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export const SITE = {
  name: "Deep Dive Podcast with Raissa",
  shortName: "Deep Dives",
  description:
    "Genuine conversations that inspire, educate, and empower. Real stories. Real people. Real impact.",
  channel: "https://www.youtube.com/@DeepDives237",
  handle: "@DeepDives237",
  social: {
    youtube: "https://www.youtube.com/@DeepDives237",
    instagram: "https://www.instagram.com/deepdives237",
    tiktok: "https://www.tiktok.com/@deepdives237",
  },
};

/** Convert "54:08" or "1:12:34" to ISO 8601 duration like "PT54M8S". */
export function durationToISO(d?: string): string | undefined {
  if (!d) return undefined;
  const parts = d.split(":").map((p) => parseInt(p, 10));
  if (parts.some((n) => Number.isNaN(n))) return undefined;
  let h = 0;
  let m = 0;
  let s = 0;
  if (parts.length === 3) [h, m, s] = parts;
  else if (parts.length === 2) [m, s] = parts;
  else [s] = parts;
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s ? `${s}S` : ""}` || "PT0S";
}

export function podcastSeriesSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    name: SITE.name,
    alternateName: SITE.shortName,
    description: SITE.description,
    url: siteUrl(),
    image: `${siteUrl()}/og.png`,
    webFeed: SITE.channel,
    author: { "@type": "Person", name: "Raissa" },
    sameAs: [SITE.social.youtube, SITE.social.instagram, SITE.social.tiktok],
  };
}

export function podcastEpisodeSchema(ep: Episode) {
  const url = `${siteUrl()}/episodes/${ep.slug}`;
  const image = `https://i.ytimg.com/vi/${ep.youtubeId}/maxresdefault.jpg`;
  return {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: ep.title,
    description: ep.description,
    datePublished: ep.publishedAt,
    duration: durationToISO(ep.duration),
    url,
    image,
    associatedMedia: {
      "@type": "MediaObject",
      contentUrl: `https://www.youtube.com/watch?v=${ep.youtubeId}`,
      embedUrl: `https://www.youtube.com/embed/${ep.youtubeId}`,
    },
    partOfSeries: {
      "@type": "PodcastSeries",
      name: SITE.name,
      url: siteUrl(),
    },
    ...(ep.category ? { genre: ep.category } : {}),
  };
}

export function breadcrumbSchema(items: { name: string; url?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      ...(it.url ? { item: it.url } : {}),
    })),
  };
}
