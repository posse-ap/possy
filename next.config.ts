import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
  ],
};

export default nextConfig;
