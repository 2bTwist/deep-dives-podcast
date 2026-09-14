import type { GUEST_ARCHETYPES } from "@/sanity/schemaTypes/guest";

type EpisodeCategory =
  | "Entrepreneurship"
  | "Finance"
  | "Relationships"
  | "Career"
  | "Faith"
  | "Creativity"
  | "Immigrant Journeys"
  | "Mental Health";

export type Episode = {
  /** Sanity document id (e.g. "6e217fe6-…"). Absent only for legacy seed data. */
  _id?: string;
  title: string;
  slug: string;
  guest?: string;
  guestRole?: string;
  category?: EpisodeCategory;
  /** 11-char YouTube video ID, e.g. "dQw4w9WgXcQ" */
  youtubeId: string;
  /** Display string like "34:03" */
  duration?: string;
  /** ISO 8601 datetime */
  publishedAt?: string;
  /** ISO 8601 datetime. Optional — set when an episode is materially updated
   *  (description rewrite, transcript added, corrections) so AI/SEO can pick
   *  up the freshness signal. Falls back to publishedAt in schema if absent. */
  dateModified?: string;
  description?: string;
  /** Optional override; if absent, YouTube thumbnail is used. */
  thumbnailOverride?: { url: string; alt: string };
  /** Set automatically once the new-episode newsletter draft has been created. */
  newsletterDraftCreated?: boolean;
};

/** Portable Text block array as returned by Sanity. Kept loose: the
 *  @portabletext/react renderer accepts the raw block shape. */
export type PortableTextContent = unknown[];

export type Article = {
  _id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: { url: string; alt?: string };
  body?: PortableTextContent;
  category?: EpisodeCategory;
  /** ISO 8601 datetime */
  publishedAt?: string;
  /** ISO 8601 datetime; set when materially updated. */
  dateModified?: string;
  featured?: boolean;
  /** Minimal resolved shape of the linked episode, for internal linking and
   *  the video thumbnail shown at the top of the article. */
  relatedEpisode?: { slug: string; title: string; youtubeId?: string } | null;
};

/** The guest archetypes — the sections of the guest wall. Derived from the schema list. */
type GuestArchetype = (typeof GUEST_ARCHETYPES)[number];

/** Minimal resolved episode shape shown on a guest card/profile. */
type GuestEpisodeRef = {
  title: string;
  slug: string;
  youtubeId: string;
  category?: EpisodeCategory;
  duration?: string;
  publishedAt?: string;
};

export type Guest = {
  _id?: string;
  name: string;
  slug: string;
  /** Role/title, e.g. "Cybersecurity Executive". */
  title?: string;
  /** Business/organization, e.g. "FinServePro". */
  company?: string;
  archetype: GuestArchetype;
  /** Optional headshot; the wall is typographic without it. */
  photo?: { url: string; alt?: string } | null;
  bio?: string;
  /** Episodes this guest appears in, latest first. */
  episodes: GuestEpisodeRef[];
};

/** Just enough of a guest to link to their profile. */
export type GuestRef = Pick<Guest, "name" | "slug">;

/** Lighter wall-card shape: no bio/episodes, just an episode count for the hint. */
export type GuestCard = {
  _id?: string;
  /** Sanity's last-edit timestamp, used as the sitemap freshness date. */
  _updatedAt?: string;
  name: string;
  slug: string;
  title?: string;
  company?: string;
  archetype: GuestArchetype;
  photo?: { url: string; alt?: string } | null;
  episodeCount: number;
};
