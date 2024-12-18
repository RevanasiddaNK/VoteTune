import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
   domains: ['i.ytimg.com', 'img.lovepik.com', 'img.youtube.com'],
  },
  webpack: (config, { isServer }) => {
    // Remove the experimental turbopack configuration
    // config.experimental = {
    //   turbopack: true,
    // };

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
