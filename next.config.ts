import type { NextConfig } from "next";
import { createProxyMiddleware } from 'http-proxy-middleware';

const nextConfig: NextConfig = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  API_PB_URL: process.env.NEXT_PUBLIC_POKEBATTLER_API,
  API_STATIC_PB_URL: process.env.NEXT_PUBLIC_STATIC_POKEBATTLER_API,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['raw.githubusercontent.com', 'img.pokemondb.net', 'static.pokebattler.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/pokemonImages',
        destination: `${process.env.NEXT_PUBLIC_STATIC_POKEBATTLER_API}/pokemonImages.json`,
      },
    ];
  },
};

export default nextConfig;