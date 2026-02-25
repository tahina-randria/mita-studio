"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";


const ARTICLES = [
  {
    label: "SEO",
    title: "Google f\u00e9vrier 2026 : l\u2019Authenticity Update p\u00e9nalise le contenu IA",
    description:
      "E-E-A-T devient obligatoire. Le contenu IA g\u00e9n\u00e9rique est p\u00e9nalis\u00e9. Ce que \u00e7a change pour votre site.",
    href: "/blog/google-fevrier-2026-authenticity-update",
  },
  {
    label: "Web",
    title: "Votre site vous co\u00fbte des clients (les signaux)",
    description:
      "43% des sites \u00e9chouent au nouveau seuil de performance Google. Les chiffres et les solutions.",
    href: "/blog/votre-site-vous-coute-des-clients",
  },
  {
    label: "IA",
    title: "Claude, GPT-5, Gemini 3.1 : la course \u00e0 l\u2019IA en f\u00e9vrier 2026",
    description:
      "Anthropic l\u00e8ve 30 milliards, Gemini double ses scores, ChatGPT affiche des pubs. Le point complet.",
    href: "/blog/claude-gpt5-gemini-course-ia-2026",
  },
];

export function BlogSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Heading
      if (headingRef.current) {
        const children = Array.from(headingRef.current.children);
        gsap.fromTo(
          children,
          { opacity: 0, y: 20, filter: "blur(4px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: { trigger: headingRef.current, start: "top 85%" },
          }
        );
      }

      // Cards
      if (gridRef.current) {
        gsap.fromTo(
          Array.from(gridRef.current.children),
          { opacity: 0, y: 25, filter: "blur(4px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.6,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: { trigger: gridRef.current, start: "top 80%" },
          }
        );
      }

      // Bottom CTA
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: { trigger: ctaRef.current, start: "top 90%" },
          }
        );
      }
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      if (headingRef.current) {
        gsap.set(Array.from(headingRef.current.children), { opacity: 1, y: 0, filter: "blur(0px)" });
      }
      if (gridRef.current) {
        gsap.set(Array.from(gridRef.current.children), { opacity: 1, y: 0, filter: "blur(0px)" });
      }
      if (ctaRef.current) {
        gsap.set(ctaRef.current, { opacity: 1, y: 0 });
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="blog" className="py-20 sm:py-28 bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-14 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Ressources
          </h2>
          <p className="text-base sm:text-lg text-foreground/60 max-w-2xl mx-auto">
            Guides et bonnes pratiques pour des vid&eacute;os sans fautes
          </p>
        </div>

        {/* Articles grid with Linear-style separators */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-3 border-t border-border/40"
        >
          {ARTICLES.map((article, i) => (
            <Link
              key={article.title}
              href={article.href}
              className={`group p-8 sm:p-10 border-b border-border/40 transition-colors hover:bg-foreground/[0.02] ${
                i < ARTICLES.length - 1 ? "sm:border-r sm:border-border/40" : ""
              }`}
            >
              {/* Category label */}
              <span className="text-[11px] font-medium tracking-widest text-foreground/30 uppercase">
                {article.label}
              </span>

              {/* Title */}
              <h3 className="text-base font-semibold mt-4 mb-3 group-hover:text-foreground transition-colors">
                {article.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-foreground/50 leading-relaxed mb-6">
                {article.description}
              </p>

              {/* Read more */}
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/40 group-hover:text-foreground/70 transition-colors">
                Lire
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div ref={ctaRef} className="text-center mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/50 hover:text-foreground transition-colors"
          >
            Tous les articles
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
