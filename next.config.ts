import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Pages service supprimées → /contact
      { source: "/web", destination: "/contact", permanent: true },
      { source: "/seo", destination: "/contact", permanent: true },
      { source: "/audit", destination: "/contact", permanent: true },
      { source: "/ugc-ads", destination: "/contact", permanent: true },
      // Ancien CGU → CGV
      { source: "/cgu", destination: "/cgv", permanent: true },
      // Anciens slugs blog → pages légales dédiées
      { source: "/blog/conditions-generales-de-vente", destination: "/cgv", permanent: true },
      { source: "/blog/cgv", destination: "/cgv", permanent: true },
      { source: "/blog/mentions-legales", destination: "/mentions-legales", permanent: true },
      { source: "/blog/politique-de-confidentialite", destination: "/confidentialite", permanent: true },
      { source: "/blog/confidentialite", destination: "/confidentialite", permanent: true },
    ];
  },
};

export default nextConfig;
