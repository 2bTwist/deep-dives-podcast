import type { Metadata } from "next";
import type { Episode, Article, Guest, GuestCard, GuestRef } from "@/lib/types";
import { youtubeEmbedUrl, youtubeThumb } from "@/lib/youtube";

/** Absolute site origin. Every canonical, sitemap, feed and JSON-LD URL derives from this. */
export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

const SITE = {
  name: "Deep Dives Podcast with Raissa",
  shortName: "Deep Dives",
  description:
    "A show with Raissa. Going deep on the questions that shape modern life, with the experts who actually live them. New on YouTube.",
  channel: "https://www.youtube.com/@DeepDives237",
  handle: "@DeepDives237",
  social: {
    youtube: "https://www.youtube.com/@DeepDives237",
    instagram: "https://www.instagram.com/deepdives237",
    tiktok: "https://www.tiktok.com/@deepdives237",
  },
};

export const SITE_NAME = SITE.name;
export const SITE_DESCRIPTION = SITE.description;
export const FEED_PATH = "/feed.xml";
/** Must match the title template in src/app/layout.tsx. */
const TITLE_SUFFIX = " | Deep Dives Podcast";

const DEFAULT_OG_IMAGE: OgImage = { url: "/og.jpg", width: 1200, height: 630, alt: SITE.name };

type OgImage = { url: string; width?: number; height?: number; alt?: string };

type OgExtras =
  | { type?: "website" }
  | { type: "article"; publishedTime?: string; modifiedTime?: string; authors?: string[]; section?: string }
  | { type: "profile" }
  | { type: "video.episode" };

/**
 * Metadata for one indexable page. Next replaces (not merges) `openGraph`,
 * `twitter` and `alternates` from the layout whenever a page sets them, so every
 * page builds the full set here. That keeps og:title, og:url, twitter:title and
 * the feed link page-specific instead of silently falling back to the site name.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  og = {},
}: {
  title: string | { absolute: string };
  description: string;
  path: string;
  image?: OgImage;
  og?: OgExtras;
}): Metadata {
  const text = metaDescription(description);
  const socialTitle = typeof title === "string" ? title : title.absolute;
  // Results truncate near 60 characters. A long page title keeps its own words
  // rather than spending that space on the " | Deep Dives Podcast" suffix.
  const tagged = typeof title === "string" && `${title}${TITLE_SUFFIX}`.length > 65 ? { absolute: title } : title;
  return {
    title: tagged,
    description: text,
    alternates: { canonical: path, types: { "application/rss+xml": FEED_PATH } },
    openGraph: {
      siteName: "Deep Dives Podcast",
      locale: "en_US",
      title: socialTitle,
      description: text,
      url: path,
      images: [image],
      type: "website",
      ...og,
    },
    twitter: {
      card: "summary_large_image",
      site: SITE.handle,
      creator: SITE.handle,
      title: socialTitle,
      description: text,
      images: [image.url],
    },
  };
}

/** Search snippets cut off near 160 characters. Trim at a word boundary so the cut reads cleanly. */
export function metaDescription(text: string, max = 160) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  const head = space > max / 2 ? cut.slice(0, space) : cut;
  return `${head.replace(/[\s,;:.]+$/, "")}…`;
}

/** "54:08" or "1:12:34" to whole seconds. */
export function durationSeconds(d?: string): number | undefined {
  if (!d) return undefined;
  const parts = d.split(":").map((p) => parseInt(p, 10));
  if (parts.length > 3 || parts.some((n) => Number.isNaN(n))) return undefined;
  return parts.reduce((total, n) => total * 60 + n, 0);
}

/** Convert "54:08" or "1:12:34" to ISO 8601 duration like "PT54M8S". */
function durationToISO(d?: string): string | undefined {
  const total = durationSeconds(d);
  if (total === undefined) return undefined;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s ? `${s}S` : ""}` || "PT0S";
}

const publisher = () => ({
  "@type": "Organization",
  name: SITE.name,
  url: siteUrl(),
  logo: { "@type": "ImageObject", url: `${siteUrl()}/brand/raissa-avatar.png` },
});

const guestPeople = (guests: GuestRef[]) =>
  guests.map((g) => ({ "@type": "Person", name: g.name, url: `${siteUrl()}/guests/${g.slug}` }));

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
    webFeed: `${siteUrl()}${FEED_PATH}`,
    author: { "@type": "Person", name: "Raissa", url: `${siteUrl()}/about` },
    sameAs: [SITE.social.youtube, SITE.social.instagram, SITE.social.tiktok],
  };
}

export function podcastEpisodeSchema(ep: Episode, guests: GuestRef[] = []) {
  const url = `${siteUrl()}/episodes/${ep.slug}`;
  // 'sd' (640x480) is guaranteed for every public video; 'maxres' 404s on
  // older/unprocessed videos and silently breaks any consumer using the schema.
  const image = youtubeThumb(ep.youtubeId, "sd");
  return {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: ep.title,
    description: ep.description,
    datePublished: ep.publishedAt,
    ...(ep.dateModified ? { dateModified: ep.dateModified } : {}),
    duration: durationToISO(ep.duration),
    url,
    image,
    inLanguage: "en",
    associatedMedia: {
      "@type": "MediaObject",
      contentUrl: `https://www.youtube.com/watch?v=${ep.youtubeId}`,
      embedUrl: youtubeEmbedUrl(ep.youtubeId),
    },
    partOfSeries: {
      "@type": "PodcastSeries",
      name: SITE.name,
      url: siteUrl(),
    },
    ...(guests.length ? { actor: guestPeople(guests) } : {}),
    ...(ep.category ? { genre: ep.category } : {}),
  };
}

/**
 * The episode page's main content is the embedded YouTube video, which is what
 * Google's video results key off. Returns null without an upload date, which
 * Google requires.
 */
export function videoObjectSchema(ep: Episode, guests: GuestRef[] = []) {
  if (!ep.publishedAt) return null;
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: ep.title,
    description: ep.description ?? ep.title,
    thumbnailUrl: [youtubeThumb(ep.youtubeId, "sd"), youtubeThumb(ep.youtubeId, "hq")],
    uploadDate: ep.publishedAt,
    ...(durationToISO(ep.duration) ? { duration: durationToISO(ep.duration) } : {}),
    embedUrl: youtubeEmbedUrl(ep.youtubeId),
    url: `${siteUrl()}/episodes/${ep.slug}`,
    inLanguage: "en",
    publisher: publisher(),
    ...(guests.length ? { actor: guestPeople(guests) } : {}),
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

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    ...publisher(),
    alternateName: SITE.shortName,
    description: SITE.description,
    founder: {
      "@type": "Person",
      name: "Raissa",
      url: `${siteUrl()}/about`,
    },
    sameAs: [SITE.social.youtube, SITE.social.instagram, SITE.social.tiktok],
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
      "Entrepreneur and host of Deep Dives Podcast. Going deep on the questions that shape modern life, with the experts who actually live them.",
    sameAs: [SITE.social.youtube, SITE.social.instagram, SITE.social.tiktok],
  };
}

export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Deep Dives Podcast",
    url: `${siteUrl()}/contact`,
    about: publisher(),
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

/** Share image for an article: its cover, else the related episode's thumbnail, else the site card. */
export function articleImage(a: Article): OgImage {
  if (a.coverImage?.url) return { url: a.coverImage.url, alt: a.coverImage.alt ?? a.title };
  if (a.relatedEpisode?.youtubeId) {
    return { url: youtubeThumb(a.relatedEpisode.youtubeId, "sd"), width: 640, height: 480, alt: a.title };
  }
  return DEFAULT_OG_IMAGE;
}

export function articleSchema(a: Article) {
  const url = `${siteUrl()}/blog/${a.slug}`;
  const image = articleImage(a).url;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.excerpt,
    datePublished: a.publishedAt,
    ...(a.dateModified ? { dateModified: a.dateModified } : {}),
    image: image.startsWith("/") ? `${siteUrl()}${image}` : image,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: "en",
    author: { "@type": "Person", name: "Raissa", url: `${siteUrl()}/about` },
    publisher: publisher(),
    ...(a.category ? { articleSection: a.category } : {}),
  };
}

type ArticleListItem = Pick<Article, "slug" | "title">;

export function articleListSchema(articles: ArticleListItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Deep Dives articles",
    numberOfItems: articles.length,
    itemListElement: articles.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteUrl()}/blog/${a.slug}`,
      name: a.title,
    })),
  };
}

/** Share image for a guest: their photo, else their latest episode's thumbnail, else the site card. */
export function guestImage(g: Guest): OgImage {
  if (g.photo?.url) return { url: g.photo.url, alt: g.photo.alt ?? g.name };
  const latest = g.episodes[0];
  if (latest?.youtubeId) {
    return { url: youtubeThumb(latest.youtubeId, "sd"), width: 640, height: 480, alt: g.name };
  }
  return DEFAULT_OG_IMAGE;
}

export function guestSchema(g: Guest) {
  const url = `${siteUrl()}/guests/${g.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: g.name,
    ...(g.title ? { jobTitle: g.title } : {}),
    ...(g.company
      ? { worksFor: { "@type": "Organization", name: g.company } }
      : {}),
    ...(g.bio ? { description: g.bio } : {}),
    ...(g.photo?.url ? { image: g.photo.url } : {}),
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(g.episodes.length
      ? {
          subjectOf: g.episodes.map((ep) => ({
            "@type": "PodcastEpisode",
            name: ep.title,
            url: `${siteUrl()}/episodes/${ep.slug}`,
          })),
        }
      : {}),
  };
}

export function guestListSchema(guests: Pick<GuestCard, "name" | "slug">[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Guests on Deep Dives Podcast",
    numberOfItems: guests.length,
    itemListElement: guests.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteUrl()}/guests/${g.slug}`,
      name: g.name,
    })),
  };
}

export function faqPageSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: it.answer },
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
