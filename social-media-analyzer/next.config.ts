import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add this line to handle the PDF parser correctly
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;