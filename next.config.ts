import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "piewbeerlwukwlymcvhp.supabase.co",
      },
    ],
  },
};

export default nextConfig;
