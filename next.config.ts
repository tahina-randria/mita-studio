import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Pages service supprimées → /contact
      { source: "/web", destination: "/contact", permanent: true },
      { source: "/seo", destination: "/contact", permanent: true },
      { source: "/audit", destination: "/contact", permanent: true },
      { source: "/ugc-ads", destination: "/contact", permanent: true },
      // Ancien CGU → CGV
      { source: "/cgu", destination: "/cgv", permanent: true },
    ];
  },
};

export default nextConfig;
