import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Exclude Node.js core modules from the client-side build

    experimental: {
      turbopack : true
    }

    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        child_process: false,
        readline: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
