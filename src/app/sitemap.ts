import type { MetadataRoute } from "next";
import { getAllEpisodes, getAllArticles, getAllGuests } from "@/sanity/lib/queries";

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`,         lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/episodes`, lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/about`,    lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/guests`,   lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`,  lastModified: now, changeFrequency: "yearly",  priority: 0.4 },
    { url: `${base}/privacy`,  lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${base}/terms`,    lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
  ];

  const [episodes, articles, guests] = await Promise.all([
    getAllEpisodes(),
    getAllArticles(),
    getAllGuests(),
  ]);

  const episodeRoutes: MetadataRoute.Sitemap = episodes.map((ep) => ({
    url: `${base}/episodes/${ep.slug}`,
    lastModified: ep.publishedAt ? new Date(ep.publishedAt) : now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${base}/blog/${a.slug}`,
    lastModified: a.dateModified
      ? new Date(a.dateModified)
      : a.publishedAt
        ? new Date(a.publishedAt)
        : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const guestRoutes: MetadataRoute.Sitemap = guests.map((g) => ({
    url: `${base}/guests/${g.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...episodeRoutes, ...articleRoutes, ...guestRoutes];
}
