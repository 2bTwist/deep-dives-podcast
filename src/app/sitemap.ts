import type { MetadataRoute } from "next";
import { getAllEpisodes, getAllArticles, getAllGuests } from "@/sanity/lib/queries";
import { durationSeconds, metaDescription, siteUrl } from "@/lib/seo";
import { PRIVACY_UPDATED, TERMS_UPDATED } from "@/lib/legal";
import { youtubeEmbedUrl, youtubeThumb } from "@/lib/youtube";

/** Newest of a set of ISO timestamps. Undefined when none are known, so no false freshness is reported. */
function newest(dates: (string | undefined)[]) {
  const known = dates.filter((d): d is string => Boolean(d)).map((d) => new Date(d));
  if (!known.length) return undefined;
  return new Date(Math.max(...known.map((d) => d.getTime())));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();

  const [episodes, articles, guests] = await Promise.all([
    getAllEpisodes(),
    getAllArticles(),
    getAllGuests(),
  ]);

  const latestEpisode = newest(episodes.map((ep) => ep.dateModified ?? ep.publishedAt));

  // lastModified is a real content date or absent. A build timestamp on every
  // entry tells crawlers everything changed on each deploy, so they learn to ignore it.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: latestEpisode, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/episodes`, lastModified: latestEpisode, changeFrequency: "weekly", priority: 0.9 },
    {
      url: `${base}/blog`,
      lastModified: newest(articles.map((a) => a.dateModified ?? a.publishedAt)),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.7 },
    {
      url: `${base}/guests`,
      lastModified: newest(guests.map((g) => g._updatedAt)),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/privacy`, lastModified: PRIVACY_UPDATED, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, lastModified: TERMS_UPDATED, changeFrequency: "yearly", priority: 0.2 },
  ];

  const episodeRoutes: MetadataRoute.Sitemap = episodes.map((ep) => ({
    url: `${base}/episodes/${ep.slug}`,
    lastModified: newest([ep.dateModified ?? ep.publishedAt]),
    changeFrequency: "monthly",
    priority: 0.8,
    videos: [
      {
        title: ep.title,
        thumbnail_loc: youtubeThumb(ep.youtubeId, "sd"),
        description: metaDescription(ep.description ?? ep.title, 2048),
        player_loc: youtubeEmbedUrl(ep.youtubeId),
        ...(durationSeconds(ep.duration) ? { duration: durationSeconds(ep.duration) } : {}),
        ...(ep.publishedAt ? { publication_date: ep.publishedAt } : {}),
      },
    ],
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${base}/blog/${a.slug}`,
    lastModified: newest([a.dateModified ?? a.publishedAt]),
    changeFrequency: "monthly",
    priority: 0.7,
    ...(a.coverImage?.url ? { images: [a.coverImage.url] } : {}),
  }));

  const guestRoutes: MetadataRoute.Sitemap = guests.map((g) => ({
    url: `${base}/guests/${g.slug}`,
    lastModified: newest([g._updatedAt]),
    changeFrequency: "monthly",
    priority: 0.6,
    ...(g.photo?.url ? { images: [g.photo.url] } : {}),
  }));

  return [...staticRoutes, ...episodeRoutes, ...articleRoutes, ...guestRoutes];
}
