import type { Metadata, Viewport } from "next";
import { Playfair_Display, Fraunces, Allura } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NewsletterPopup } from "@/components/site/NewsletterPopup";
import { FEED_PATH, siteUrl } from "@/lib/seo";
import "./globals.css";

// All three brand fonts use display:swap with preload so the real fonts always
// render eventually, even on cold first visits. We accept ~100-200ms of LCP
// cost in exchange for brand fidelity — the original display:optional setup
// caused first-time visitors to see system fallbacks for the entire pageview
// when the fonts lost the ~100ms initial race.
const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-body",
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
});

const allura = Allura({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

// Site-wide defaults. Indexable pages override these through pageMetadata() in
// src/lib/seo.ts, which also sets the page's canonical URL. No canonical lives
// here, so pages without their own (404s, error states) never point at the homepage.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: 'Deep Dives Podcast with Raissa',
    template: '%s | Deep Dives Podcast',
  },
  description:
    'A show with Raissa. Going deep on the questions that shape modern life, with the experts who actually live them. New on YouTube.',
  openGraph: {
    type: 'website',
    siteName: 'Deep Dives Podcast',
    title: 'Deep Dives Podcast with Raissa',
    description:
      'A show with Raissa. Going deep on the questions that shape modern life, with the experts who actually live them. New on YouTube.',
    locale: 'en_US',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Deep Dives Podcast with Raissa' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deep Dives Podcast with Raissa',
    description: 'Going deep on the questions that shape modern life, with the experts who actually live them. New on YouTube.',
    images: ['/og.jpg'],
    creator: '@DeepDives237',
    site: '@DeepDives237',
  },
  alternates: {
    types: { 'application/rss+xml': FEED_PATH },
  },
  authors: [{ name: 'Raissa' }],
  keywords: [
    'podcast',
    'interview podcast',
    'Deep Dives',
    'Raissa',
    'DeepDives237',
    'conversations',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${fraunces.variable} ${allura.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://www.youtube-nocookie.com" />
        {/* Prerender same-origin links on hover (Chromium only, ignored elsewhere).
            Excludes /studio (5MB Sanity bundle) and /api routes. */}
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              prerender: [
                {
                  where: {
                    and: [
                      { href_matches: "/*" },
                      { not: { href_matches: "/studio*" } },
                      { not: { href_matches: "/api/*" } },
                    ],
                  },
                  eagerness: "moderate",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-gold focus:px-4 focus:py-2 focus:text-[11px] focus:font-medium focus:uppercase focus:tracking-[0.24em] focus:text-ink"
        >
          Skip to main content
        </a>
        {children}
        <NewsletterPopup />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
