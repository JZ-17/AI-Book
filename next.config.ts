// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: true,
  },
  images: {
    domains: [
      'lh3.googleusercontent.com',  // For Google profile pictures
      'localhost',                  // For local development
    ],
    formats: ['image/avif', 'image/webp'],
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  // Enable webpack and swc
  swcMinify: true,
  reactStrictMode: true,
};

export default nextConfig;