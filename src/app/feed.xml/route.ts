import { getAllEpisodes } from "@/sanity/lib/queries";
import { siteUrl } from "@/lib/seo";

export const revalidate = 300;

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * RSS 2.0 feed of episodes. Useful for feed readers, and the input an
 * RSS-to-email tool can watch if the show ever switches to hands-off auto-send.
 */
export async function GET() {
  const base = siteUrl();
  const episodes = await getAllEpisodes();

  const items = episodes
    .map((ep) => {
      const url = `${base}/episodes/${ep.slug}`;
      const pubDate = ep.publishedAt ? new Date(ep.publishedAt).toUTCString() : "";
      return `    <item>
      <title>${escapeXml(ep.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ""}
      ${ep.description ? `<description>${escapeXml(ep.description)}</description>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Deep Dive Podcast with Raissa</title>
    <link>${base}</link>
    <description>New episodes of Deep Dive Podcast with Raissa.</description>
    <language>en</language>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${base}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
