"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Envelope } from "@phosphor-icons/react";
import type { BlogArticle } from "@/lib/blog";
import { formatDate } from "@/lib/blog";

interface BlogPageClientProps {
  articles: BlogArticle[];
  categories: string[];
}

export function BlogPageClient({ articles, categories }: BlogPageClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const featured = articles[0];
  const restArticles = articles.slice(1);
  const filteredArticles = activeCategory
    ? restArticles.filter((a) => a.category === activeCategory)
    : restArticles;

  return (
    <main className="pt-28 pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav
          aria-label="Fil d'Ariane"
          className="flex items-center gap-2 text-xs text-white/50 mb-10"
        >
          <Link href="/" className="inline-block py-1 hover:text-white transition-colors">
            Accueil
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-white/80">Blog</span>
        </nav>

        {/* Heading */}
        <div className="mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Blog
          </h1>
          <p className="text-base sm:text-lg text-white/50 max-w-2xl">
            Insights, guides et actualit&eacute;s du digital. SEO, IA,
            performance web et strat&eacute;gie business.
          </p>
        </div>

        {/* ── Featured article ──────────────────────────────────────────── */}
        <Link
          href={`/blog/${featured.slug}`}
          className="group mb-16 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:bg-white/[0.04] hover:border-white/[0.1] transition-all"
        >
          {/* Image */}
          {featured.image && (
            <div className="relative aspect-[16/9] lg:aspect-auto lg:min-h-[360px] w-full overflow-hidden">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:py-10 lg:pr-10 lg:pl-0">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center rounded-full bg-white/[0.08] px-3 py-1 text-[10px] font-medium tracking-widest text-white/70 uppercase">
                {featured.category}
              </span>
              <span className="text-xs text-white/30">
                {formatDate(featured.date)}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight group-hover:text-white/90 transition-colors">
              {featured.title}
            </h2>

            <p className="text-sm sm:text-base text-white/50 leading-relaxed mb-6 line-clamp-3">
              {featured.description}
            </p>

            <span className="inline-flex items-center gap-2 text-sm font-medium text-white/50 group-hover:text-white/80 transition-colors">
              Lire l&apos;article &middot; {featured.readingTime}
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </span>
          </div>
        </Link>

        {/* ── Category filter ───────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium tracking-wide transition-all ${
              activeCategory === null
                ? "bg-white text-[#050a1e]"
                : "bg-white/[0.06] text-white/50 hover:bg-white/[0.1] hover:text-white/70"
            }`}
          >
            Tous
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setActiveCategory(activeCategory === cat ? null : cat)
              }
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium tracking-wide transition-all ${
                activeCategory === cat
                  ? "bg-white text-[#050a1e]"
                  : "bg-white/[0.06] text-white/50 hover:bg-white/[0.1] hover:text-white/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Articles grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:bg-white/[0.04] hover:border-white/[0.1] transition-all"
            >
              {/* Thumbnail */}
              {article.image && (
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex flex-col flex-1 p-5 sm:p-6">
                {/* Meta */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-medium tracking-widest text-white/60 uppercase">
                    {article.category}
                  </span>
                  <span className="text-[10px] text-white/30">&middot;</span>
                  <span className="text-[10px] text-white/30">
                    {formatDate(article.date)}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-sm sm:text-base font-semibold text-white mb-2 leading-snug group-hover:text-white/90 transition-colors">
                  {article.title}
                </h2>

                {/* Description */}
                <p className="text-xs sm:text-sm text-white/50 leading-relaxed mb-4 line-clamp-2">
                  {article.description}
                </p>

                {/* Read more */}
                <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-medium text-white/40 group-hover:text-white/70 transition-colors">
                  Lire &middot; {article.readingTime}
                  <ArrowRight
                    size={11}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/40 text-sm">
              Aucun article dans cette cat&eacute;gorie pour le moment.
            </p>
          </div>
        )}

        {/* ── Newsletter ────────────────────────────────────────────────── */}
        <div className="mt-20 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-12 text-center">
          <div className="mx-auto max-w-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/[0.06] mb-5">
              <Envelope size={22} className="text-white/60" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
              Restez inform&eacute;
            </h3>
            <p className="text-sm text-white/50 mb-6">
              Un email par semaine. Pas de spam. Les meilleures ressources SEO,
              IA et web directement dans votre bo&icirc;te.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="votre@email.com"
                className="flex-1 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/40 transition-colors"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-[#050a1e] hover:bg-white/90 active:scale-[0.98] transition-all"
              >
                S&apos;inscrire
              </button>
            </form>
            <p className="text-xs text-white/50 mt-3">
              En vous inscrivant, vous acceptez notre{" "}
              <Link
                href="/confidentialite"
                className="underline hover:text-white/70"
              >
                politique de confidentialit&eacute;
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
