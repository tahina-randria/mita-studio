import type { MetadataRoute } from "next";
import { getAllSlugs, getArticleBySlug } from "@/lib/blog";

const BASE_URL = "https://mita-studio.com";

/** Use a stable build date for static pages instead of new Date() on every request. */
const LAST_DEPLOY = new Date("2026-02-25");

export default function sitemap(): MetadataRoute.Sitemap {
  const blogSlugs = getAllSlugs();

  return [
    // Homepage
    { url: BASE_URL, lastModified: LAST_DEPLOY, changeFrequency: "weekly", priority: 1 },
    // Pages
    { url: `${BASE_URL}/contact`, lastModified: LAST_DEPLOY, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/fondateur`, lastModified: LAST_DEPLOY, changeFrequency: "monthly", priority: 0.6 },
    // Blog
    { url: `${BASE_URL}/blog`, lastModified: LAST_DEPLOY, changeFrequency: "weekly", priority: 0.7 },
    ...blogSlugs.map((slug) => {
      const article = getArticleBySlug(slug);
      return {
        url: `${BASE_URL}/blog/${slug}`,
        lastModified: article ? new Date(article.date) : LAST_DEPLOY,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      };
    }),
    // Legal
    { url: `${BASE_URL}/mentions-legales`, lastModified: LAST_DEPLOY, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/cgv`, lastModified: LAST_DEPLOY, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/confidentialite`, lastModified: LAST_DEPLOY, changeFrequency: "monthly", priority: 0.3 },
  ];
}
