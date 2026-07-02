import { defineQuery } from "next-sanity";
import { sanityFetch } from "./client";
import type { Episode, Article } from "@/lib/types";

const EPISODE_PROJECTION = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  youtubeId,
  category,
  duration,
  publishedAt,
  dateModified,
  description,
  guest,
  guestRole,
  newsletterDraftCreated,
  thumbnailOverride{
    "url": asset->url,
    alt
  }
`;

// List/card projection — deliberately omits `body` so the index page does not
// fetch full article content for every card.
const ARTICLE_CARD_PROJECTION = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage{
    "url": asset->url,
    alt
  },
  category,
  publishedAt,
  dateModified,
  featured
`;

// Full projection — includes the Portable Text body + resolved related episode.
const ARTICLE_PROJECTION = /* groq */ `
  ${ARTICLE_CARD_PROJECTION},
  body,
  relatedEpisode->{
    title,
    "slug": slug.current,
    youtubeId
  }
`;

const ALL_EPISODES_QUERY = defineQuery(/* groq */ `
  *[_type == "episode" && defined(slug.current)]
    | order(publishedAt desc) {
      ${EPISODE_PROJECTION}
    }
`);

const FEATURED_EPISODE_QUERY = defineQuery(/* groq */ `
  *[_type == "episode" && defined(slug.current)]
    | order(publishedAt desc)[0] {
      ${EPISODE_PROJECTION}
    }
`);

const EPISODE_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "episode" && slug.current == $slug][0] {
    ${EPISODE_PROJECTION}
  }
`);

const EPISODE_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "episode" && defined(slug.current)].slug.current
`);

export function getAllEpisodes(): Promise<Episode[]> {
  return sanityFetch<Episode[]>({
    query: ALL_EPISODES_QUERY,
    tags: ["episode"],
  });
}

export function getFeaturedEpisode(): Promise<Episode | null> {
  return sanityFetch<Episode | null>({
    query: FEATURED_EPISODE_QUERY,
    tags: ["episode"],
  });
}

export function getEpisodeBySlug(slug: string): Promise<Episode | null> {
  return sanityFetch<Episode | null>({
    query: EPISODE_BY_SLUG_QUERY,
    params: { slug },
    tags: [`episode:${slug}`, "episode"],
  });
}

export function getEpisodeSlugs(): Promise<string[]> {
  return sanityFetch<string[]>({
    query: EPISODE_SLUGS_QUERY,
    tags: ["episode"],
    revalidate: false,
  });
}

const ALL_ARTICLES_QUERY = defineQuery(/* groq */ `
  *[_type == "article" && defined(slug.current)]
    | order(featured desc, publishedAt desc) {
      ${ARTICLE_CARD_PROJECTION}
    }
`);

const ARTICLE_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "article" && slug.current == $slug][0] {
    ${ARTICLE_PROJECTION}
  }
`);

const ARTICLE_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "article" && defined(slug.current)].slug.current
`);

export function getAllArticles(): Promise<Article[]> {
  return sanityFetch<Article[]>({
    query: ALL_ARTICLES_QUERY,
    tags: ["article"],
  });
}

export function getArticleBySlug(slug: string): Promise<Article | null> {
  return sanityFetch<Article | null>({
    query: ARTICLE_BY_SLUG_QUERY,
    params: { slug },
    tags: [`article:${slug}`, "article"],
  });
}

export function getArticleSlugs(): Promise<string[]> {
  return sanityFetch<string[]>({
    query: ARTICLE_SLUGS_QUERY,
    tags: ["article"],
    revalidate: false,
  });
}
