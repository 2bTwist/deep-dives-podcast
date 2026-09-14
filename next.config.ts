import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
    qualities: [75, 90],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  logging: { fetches: { fullUrl: true } },
  async headers() {
    // Static security headers applied to every route. HSTS is supplied by
    // Vercel automatically. Content-Security-Policy is intentionally omitted
    // for now: it needs a deliberate report-only-then-enforce pass against the
    // embedded Studio (/studio), YouTube embeds, and Vercel Analytics.
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
    ]
  },
  async redirects() {
    // Articles section was renamed to Blog. Preserve the (brief) indexing and
    // any inbound links with permanent 301s.
    return [
      // One host for search engines. www served a full duplicate of the site
      // with a 200, splitting links and crawl budget across two hostnames.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.deepdives237.com' }],
        destination: 'https://deepdives237.com/:path*',
        permanent: true,
      },
      { source: '/articles', destination: '/blog', permanent: true },
      { source: '/articles/:slug', destination: '/blog/:slug', permanent: true },
    ]
  },
}

export default nextConfig
