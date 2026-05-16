import type { Metadata } from "next";
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deep Dives Podcast with Raissa',
    description:
      'Genuine conversations that inspire, educate, and empower.',
  },
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
