import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["xlsx"],
  turbopack: {
    root: process.cwd()
  }
};

export default nextConfig;
