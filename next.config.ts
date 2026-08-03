import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {

    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fregldukggdkbemysbho.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'framerusercontent.com',
      }
    ],
    qualities: [70, 80, 85, 90],
  },
  allowedDevOrigins: ['192.168.100.224'],
};

export default nextConfig;
