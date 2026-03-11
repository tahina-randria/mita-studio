import type { MetadataRoute } from "next";
import { getAllSlugs, getArticleBySlug } from "@/lib/blog";

const BASE_URL = "https://mita-studio.com";

/** Use build time as lastModified for static pages. */
const BUILD_DATE = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const blogSlugs = getAllSlugs();

  return [
    // Homepage
    { url: BASE_URL, lastModified: BUILD_DATE, changeFrequency: "weekly", priority: 1 },
    // Pages
    { url: `${BASE_URL}/contact`, lastModified: BUILD_DATE, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/fondateur`, lastModified: BUILD_DATE, changeFrequency: "monthly", priority: 0.6 },
    // Blog
    { url: `${BASE_URL}/blog`, lastModified: BUILD_DATE, changeFrequency: "weekly", priority: 0.7 },
    ...blogSlugs.map((slug) => {
      const article = getArticleBySlug(slug);
      return {
        url: `${BASE_URL}/blog/${slug}`,
        lastModified: article ? new Date(article.date) : BUILD_DATE,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      };
    }),
    // Legal
    { url: `${BASE_URL}/mentions-legales`, lastModified: BUILD_DATE, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/cgv`, lastModified: BUILD_DATE, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/confidentialite`, lastModified: BUILD_DATE, changeFrequency: "monthly", priority: 0.3 },
  ];
}
