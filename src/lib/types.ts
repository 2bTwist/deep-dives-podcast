export type EpisodeCategory =
  | "Entrepreneurship"
  | "Finance"
  | "Relationships"
  | "Career"
  | "Faith"
  | "Creativity"
  | "Immigrant Journeys";

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
  description?: string;
  /** Optional override; if absent, YouTube thumbnail is used. */
  thumbnailOverride?: { url: string; alt: string };
};
