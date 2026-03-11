import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { StudioHeader } from "../../_components/StudioHeader";
import { StudioFooter } from "../../_components/StudioFooter";
import {
  BLOG_ARTICLES,
  getArticleBySlug,
  getAllSlugs,
  getRelatedArticles,
  formatDate,
} from "@/lib/blog";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      publishedTime: article.date,
      modifiedTime: article.date,
      authors: ["Tahina Randrianandraina"],
      url: `https://mita-studio.com/blog/${slug}`,
      locale: "fr_FR",
      siteName: "Mita Studio",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Mita Studio",
        },
      ],
    },
  };
}

/** Simple Markdown-to-JSX renderer for blog content */
function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];
  let currentList: string[] = [];
  let key = 0;

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(" ");
      elements.push(
        <p
          key={key++}
          className="text-sm sm:text-base leading-relaxed text-white/90 mb-6"
          dangerouslySetInnerHTML={{ __html: formatInline(text) }}
        />
      );
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul
          key={key++}
          className="list-disc list-outside ml-5 text-sm sm:text-base text-white/90 space-y-2 mb-6"
        >
          {currentList.map((item, i) => (
            <li
              key={i}
              className="leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatInline(item) }}
            />
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  const formatInline = (text: string): string => {
    return text
      .replace(
        /\*\*(.+?)\*\*/g,
        '<strong class="text-white font-medium">$1</strong>'
      )
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white/60 transition-colors">$1</a>'
      );
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // YouTube embed: {{youtube:VIDEO_ID}}
    const ytMatch = trimmed.match(/^\{\{youtube:([a-zA-Z0-9_-]+)\}\}$/);
    if (ytMatch) {
      flushList();
      flushParagraph();
      elements.push(
        <div key={key++} className="my-8 aspect-video w-full overflow-hidden rounded-2xl border border-white/[0.06]">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${ytMatch[1]}`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
            loading="lazy"
          />
        </div>
      );
      continue;
    }

    // Blockquote: > text
    if (trimmed.startsWith("> ")) {
      flushList();
      flushParagraph();
      const quote = trimmed.slice(2);
      elements.push(
        <blockquote
          key={key++}
          className="my-8 border-l-2 border-white/20 pl-5 text-sm sm:text-base italic text-white/70 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatInline(quote) }}
        />
      );
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushList();
      flushParagraph();
      const heading = trimmed.slice(4);
      elements.push(
        <h3
          key={key++}
          className="text-base sm:text-lg font-semibold text-white mt-8 mb-3"
          dangerouslySetInnerHTML={{ __html: formatInline(heading) }}
        />
      );
    } else if (trimmed.startsWith("## ")) {
      flushList();
      flushParagraph();
      const heading = trimmed.slice(3);
      elements.push(
        <h2
          key={key++}
          className="text-lg sm:text-xl font-semibold text-white mt-10 mb-4"
          dangerouslySetInnerHTML={{ __html: formatInline(heading) }}
        />
      );
    } else if (trimmed.startsWith("- ")) {
      flushParagraph();
      currentList.push(trimmed.slice(2));
    } else if (/^\d+\.\s/.test(trimmed)) {
      flushParagraph();
      flushList();
      currentList.push(trimmed.replace(/^\d+\.\s/, ""));
    } else if (trimmed === "") {
      flushList();
      flushParagraph();
    } else {
      if (currentList.length > 0) {
        flushList();
      }
      currentParagraph.push(trimmed);
    }
  }

  flushList();
  flushParagraph();

  return elements;
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(slug);

  // Find prev/next articles for navigation
  const currentIndex = BLOG_ARTICLES.findIndex((a) => a.slug === slug);
  const prevArticle =
    currentIndex > 0 ? BLOG_ARTICLES[currentIndex - 1] : null;
  const nextArticle =
    currentIndex < BLOG_ARTICLES.length - 1
      ? BLOG_ARTICLES[currentIndex + 1]
      : null;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    image: "https://mita-studio.com/opengraph-image",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://mita-studio.com/blog/${slug}`,
    },
    author: {
      "@type": "Person",
      name: "Tahina Randrianandraina",
      url: "https://mita-studio.com/fondateur",
    },
    publisher: {
      "@type": "Organization",
      name: "Mita Studio",
      url: "https://mita-studio.com",
      logo: {
        "@type": "ImageObject",
        url: "https://mita-studio.com/logo.webp",
      },
    },
    url: `https://mita-studio.com/blog/${slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://mita-studio.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://mita-studio.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
      },
    ],
  };

  return (
    <div className="studio-page min-h-screen bg-[#050a1e] text-white">
      <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <StudioHeader />

      <main className="pt-28 pb-20">
        <article className="mx-auto max-w-3xl px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav
            aria-label="Fil d'Ariane"
            className="flex items-center gap-2 text-xs text-white/60 mb-10"
          >
            <Link href="/" className="hover:text-white transition-colors">
              Accueil
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="hover:text-white transition-colors">
              Blog
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-white/80 truncate max-w-[200px]">
              {article.title}
            </span>
          </nav>

          {/* Article header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-medium tracking-widest text-white uppercase">
                {article.category}
              </span>
              <span className="text-xs text-white/60">&middot;</span>
              <span className="text-xs text-white/60">
                {formatDate(article.date)}
              </span>
              <span className="text-xs text-white/60">&middot;</span>
              <span className="text-xs text-white/60">
                {article.readingTime}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
              {article.title}
            </h1>

            <p className="text-base sm:text-lg text-white/60 leading-relaxed">
              {article.description}
            </p>
          </header>

          {/* Hero image */}
          {article.image && (
            <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/[0.06]">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 720px"
                priority
              />
            </div>
          )}

          {/* TL;DR */}
          {article.tldr.length > 0 && (
            <div className="mb-10 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
              <p className="text-[11px] font-semibold tracking-widest text-white/70 uppercase mb-4">
                TL;DR
              </p>
              <ul className="space-y-3">
                {article.tldr.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm sm:text-base text-white/90 leading-relaxed"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/40" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Separator */}
          <div className="border-t border-white/[0.06] mb-10" />

          {/* Article content */}
          <div>{renderContent(article.content)}</div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-[11px] text-white/60 tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Related articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-14 border-t border-white/[0.06] pt-10">
              <p className="text-[11px] font-semibold tracking-widest text-white/70 uppercase mb-6">
                Articles li&eacute;s
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-colors"
                  >
                    <span className="text-xs font-medium tracking-widest text-white/60 uppercase">
                      {related.category}
                    </span>
                    <p className="text-sm font-medium text-white mt-2 leading-snug group-hover:text-white/90 transition-colors">
                      {related.title}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs text-white/60 mt-3 group-hover:text-white/80 transition-colors">
                      Lire
                      <ArrowRight
                        size={10}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Bottom separator */}
          <div className="border-t border-white/[0.06] mt-14 pt-10">
            {/* Prev / Next navigation */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
              {prevArticle ? (
                <Link
                  href={`/blog/${prevArticle.slug}`}
                  className="group flex-1"
                >
                  <span className="text-[11px] font-medium tracking-widest text-white/60 uppercase">
                    Pr&eacute;c&eacute;dent
                  </span>
                  <p className="text-sm font-medium text-white/80 mt-1.5 group-hover:text-white transition-colors">
                    {prevArticle.title}
                  </p>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
              {nextArticle ? (
                <Link
                  href={`/blog/${nextArticle.slug}`}
                  className="group flex-1 sm:text-right"
                >
                  <span className="text-[11px] font-medium tracking-widest text-white/60 uppercase">
                    Suivant
                  </span>
                  <p className="text-sm font-medium text-white/80 mt-1.5 group-hover:text-white transition-colors">
                    {nextArticle.title}
                  </p>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </div>

            {/* CTA */}
            <div className="text-center mt-14">
              <p className="text-sm text-white/60 mb-4">
                Un projet digital en t&ecirc;te&nbsp;?
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-[#050a1e] hover:bg-white/90 active:scale-[0.98] transition-all"
              >
                Discutons de votre projet
              </Link>
            </div>
          </div>
        </article>
      </main>

      <StudioFooter />
    </div>
  );
}
