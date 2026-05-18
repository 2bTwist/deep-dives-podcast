import type { Episode } from "@/lib/types";

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

const SITE = {
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
function durationToISO(d?: string): string | undefined {
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
    image: `${siteUrl()}/og.jpg`,
    inLanguage: "en",
    webFeed: SITE.channel,
    author: { "@type": "Person", name: "Raissa", url: `${siteUrl()}/about` },
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
    inLanguage: "en",
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

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    alternateName: SITE.shortName,
    url: siteUrl(),
    inLanguage: "en",
    publisher: { "@type": "Person", name: "Raissa", url: `${siteUrl()}/about` },
  };
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Raissa",
    url: `${siteUrl()}/about`,
    image: `${siteUrl()}/brand/raissa-portrait.jpg`,
    jobTitle: "Host and creator, Deep Dives Podcast",
    description:
      "Host of Deep Dives Podcast. Long-form conversations with founders, planners, clergy, civic voices, immigrants, and creatives.",
    sameAs: [SITE.social.youtube, SITE.social.instagram, SITE.social.tiktok],
  };
}

type EpisodeListItem = Pick<Episode, "slug" | "title">;

export function episodeListSchema(episodes: EpisodeListItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Deep Dives Podcast episodes",
    numberOfItems: episodes.length,
    itemListElement: episodes.map((ep, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteUrl()}/episodes/${ep.slug}`,
      name: ep.title,
    })),
  };
}

export function guestArchetypesSchema(items: { label: string; body: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Guest archetypes on Deep Dives Podcast",
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Thing",
        name: it.label,
        description: it.body,
      },
    })),
  };
}
