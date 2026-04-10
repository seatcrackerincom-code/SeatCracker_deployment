import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable source maps in production to hide the original source code
  productionBrowserSourceMaps: false,
};

export default nextConfig;
