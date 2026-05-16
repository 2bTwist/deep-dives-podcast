import type { Metadata, Viewport } from "next";
import { Playfair_Display, Fraunces, Allura } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-body",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Deep Dives Podcast with Raissa',
    template: '%s — Deep Dives Podcast',
  },
  description:
    'Genuine conversations that inspire, educate, and empower. Real stories. Real people. Real impact.',
  openGraph: {
    type: 'website',
    siteName: 'Deep Dives Podcast',
    title: 'Deep Dives Podcast with Raissa',
    description:
      'Genuine conversations that inspire, educate, and empower. Real stories. Real people. Real impact.',
    locale: 'en_US',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Deep Dive Podcast with Raissa' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deep Dives Podcast with Raissa',
    description: 'Genuine conversations that inspire, educate, and empower.',
    images: ['/og.png'],
    creator: '@DeepDives237',
    site: '@DeepDives237',
  },
  alternates: {
    canonical: '/',
  },
  authors: [{ name: 'Raissa' }],
  keywords: [
    'podcast',
    'long-form interviews',
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
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
