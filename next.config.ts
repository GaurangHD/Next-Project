import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
};

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,  // Disable ESLint checks during build
  },
  typescript: {
    ignoreBuildErrors: true,   // Disable TypeScript errors during build
  },
};

// export default nextConfig;
