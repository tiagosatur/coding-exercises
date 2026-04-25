import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.chavesnamao.com.br",
      },
    ],
  },
};

export default nextConfig;
