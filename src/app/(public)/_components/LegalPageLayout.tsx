import Link from "next/link";
import type { LegalArticle } from "@/lib/legal";
import { formatDate } from "@/lib/legal";

/** Simple Markdown-to-JSX renderer (same as blog articles) */
function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];
  let currentList: string[] = [];
  let isOrderedList = false;
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
      const Tag = isOrderedList ? "ol" : "ul";
      const listClass = isOrderedList ? "list-decimal" : "list-disc";
      elements.push(
        <Tag
          key={key++}
          className={`${listClass} list-outside ml-5 text-sm sm:text-base text-white/90 space-y-2 mb-6`}
        >
          {currentList.map((item, i) => (
            <li
              key={i}
              className="leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatInline(item) }}
            />
          ))}
        </Tag>
      );
      currentList = [];
      isOrderedList = false;
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
      isOrderedList = false;
      currentList.push(trimmed.slice(2));
    } else if (/^\d+\.\s/.test(trimmed)) {
      flushParagraph();
      if (currentList.length === 0) isOrderedList = true;
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

interface LegalPageLayoutProps {
  article: LegalArticle;
  breadcrumbLabel: string;
}

export function LegalPageLayout({ article, breadcrumbLabel }: LegalPageLayoutProps) {
  return (
    <main className="pt-28 pb-20">
      <article className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav
          aria-label="Fil d'Ariane"
          className="flex items-center gap-2 text-xs text-white/60 mb-10"
        >
          <Link href="/" className="inline-block py-1 hover:text-white transition-colors">
            Accueil
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-white/80">{breadcrumbLabel}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] font-medium tracking-widest text-white/70 uppercase">
              Légal
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

        {/* TL;DR */}
        {article.tldr.length > 0 && (
          <div className="mb-10 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
            <p className="text-[11px] font-semibold tracking-widest text-white/70 uppercase mb-4">
              En résumé
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

        {/* Content */}
        <div>{renderContent(article.content)}</div>

        {/* CTA */}
        <div className="border-t border-white/[0.06] mt-14 pt-10 text-center">
          <p className="text-sm text-white/60 mb-4">
            Une question&nbsp;?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-[#050a1e] hover:bg-white/90 active:scale-[0.98] transition-all"
          >
            Contactez-nous
          </Link>
        </div>
      </article>
    </main>
  );
}
