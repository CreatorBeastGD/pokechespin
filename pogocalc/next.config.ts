import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['raw.githubusercontent.com'],
  },
};

export default nextConfig;
