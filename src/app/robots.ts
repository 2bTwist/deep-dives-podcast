import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  // Explicit AI search bot allows so future infra changes (CDN, WAF) can't
  // silently strip citations. Wildcard already covers them, but listing them
  // explicitly signals intent and survives stricter overrides.
  const aiBots = [
    "GPTBot",
    "ChatGPT-User",
    "OAI-SearchBot",
    "PerplexityBot",
    "ClaudeBot",
    "anthropic-ai",
    "Google-Extended",
    "Bingbot",
  ];
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/styleguide", "/studio", "/api/"],
      },
      ...aiBots.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/styleguide", "/studio", "/api/"],
      })),
    ],
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
