import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/vibe-coding-library",
  assetPrefix: "/vibe-coding-library",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
