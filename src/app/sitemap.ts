import type { MetadataRoute } from "next";
import { getAllEpisodes } from "@/sanity/lib/queries";

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`,         lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/episodes`, lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/about`,    lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/guests`,   lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`,  lastModified: now, changeFrequency: "yearly",  priority: 0.4 },
    { url: `${base}/privacy`,  lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${base}/terms`,    lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
  ];

  const episodes = await getAllEpisodes();
  const episodeRoutes: MetadataRoute.Sitemap = episodes.map((ep) => ({
    url: `${base}/episodes/${ep.slug}`,
    lastModified: ep.publishedAt ? new Date(ep.publishedAt) : now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...episodeRoutes];
}
