import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Plotly.js uses some server-only APIs that need to be ignored during client build
  serverExternalPackages: ["plotly.js"],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
