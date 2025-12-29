import type { NextConfig } from "next";
import { createProxyMiddleware } from 'http-proxy-middleware';

const nextConfig: NextConfig = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  API_PB_URL: process.env.NEXT_PUBLIC_POKEBATTLER_API,
  API_STATIC_PB_URL: process.env.NEXT_PUBLIC_STATIC_POKEBATTLER_API,
  API_MONGODB_URI: process.env.NEXT_PUBLIC_MONGODB_URI,
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
        destination: `${process.env.NEXT_PUBLIC_STATIC_POKEBATTLER_API}pokemonImages.json`,
      },
      {
        source: '/api/pokemonNames',
        destination: `${process.env.NEXT_PUBLIC_STATIC_POKEBATTLER_API}locales/en-US/constants.json`,
      }
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

export default nextConfig;