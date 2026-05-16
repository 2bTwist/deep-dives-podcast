import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
    qualities: [75, 90],
  },
  logging: { fetches: { fullUrl: true } },
}

export default nextConfig
