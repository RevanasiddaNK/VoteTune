import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.ytimg.com'], // Add the hostname of the image
  },
  webpack: (config, { isServer }) => {
    // Enable Turbopack in experimental mode
    config.experimental = {
      turbopack: true,
    };

    if (!isServer) {
      // Exclude Node.js core modules from the client-side build
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