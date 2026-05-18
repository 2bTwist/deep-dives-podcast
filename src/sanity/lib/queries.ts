import { defineQuery } from "next-sanity";
import { sanityFetch } from "./client";
import type { Episode } from "@/lib/types";

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
  thumbnailOverride{
    "url": asset->url,
    alt
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
