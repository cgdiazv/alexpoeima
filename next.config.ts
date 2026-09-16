import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "y522eijlaut4nakz.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;

