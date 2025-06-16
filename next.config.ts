import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['static.usernames.app-backend.toolsforhumanity.com'],
  },
  allowedDevOrigins: ['world-agora.ngrok.dev'], // Add your dev origin here
  reactStrictMode: false,
  experimental: {
    useCache: true,
  }
};

export default nextConfig;
