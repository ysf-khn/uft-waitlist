import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 2592000, // 30 days
  },
};

export default nextConfig;
