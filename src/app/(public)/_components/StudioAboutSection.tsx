"use client";

import { useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ArrowRight } from "@phosphor-icons/react";
import Avatar from "boring-avatars";
import { setReducedMotionState } from "@/lib/motion";


interface Value {
  label: string;
  description: string;
}

const VALUES: Value[] = [
  {
    label: "Votre projet, vos r\u00e8gles",
    description:
      "On s\u2019adapte \u00e0 votre budget, vos d\u00e9lais et vos objectifs. Pas l\u2019inverse.",
  },
  {
    label: "R\u00e9sultats mesurables",
    description:
      "Chaque euro investi doit rapporter. Tracking, analytics, ROI \u2014 on ne travaille pas \u00e0 l\u2019aveugle.",
  },
  {
    label: "Z\u00e9ro surprise",
    description:
      "Prix fix\u00e9s d\u00e8s le d\u00e9part, livrables clairs, suivi en temps r\u00e9el. Vous savez toujours o\u00f9 on en est.",
  },
];

const QUOTE_TEXT =
  "On rend accessible ce qui \u00e9tait r\u00e9serv\u00e9 aux gros budgets.";

/* ── Scrub quote with word-by-word spotlight ── */
function ScrubQuote({
  text,
  wordsRef,
}: {
  text: string;
  wordsRef: React.MutableRefObject<HTMLSpanElement[]>;
}) {
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  return (
    <p
      className="text-[1.75rem] sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-medium text-white leading-[1.15] tracking-tight max-w-4xl mx-auto"
      aria-label={text}
    >
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span key={i} className="inline-block mr-[0.3em]">
            <span
              ref={(el) => {
                if (el) wordsRef.current[i] = el;
              }}
              className="inline-block opacity-[0.15] transition-none"
            >
              {word}
            </span>
          </span>
        ))}
      </span>
    </p>
  );
}

export function StudioAboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const quoteWordsRef = useRef<HTMLSpanElement[]>([]);
  const founderRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    /* ── Mobile: simple fades, no blur, no scrub (saves GPU) ── */
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      if (quoteRef.current) {
        const label = quoteRef.current.querySelector("[data-label]");
        if (label) {
          gsap.fromTo(label, { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
              scrollTrigger: { trigger: quoteRef.current, start: "top 85%" } });
        }
      }
      /* Quote: simple stagger instead of scrub on mobile */
      if (quoteWordsRef.current.length > 0 && quoteRef.current) {
        gsap.fromTo(quoteWordsRef.current,
          { opacity: 0.15 },
          { opacity: 1, duration: 0.5, stagger: 0.04, ease: "power2.out",
            scrollTrigger: { trigger: quoteRef.current, start: "top 80%" } }
        );
      }
      if (lineRef.current) {
        gsap.fromTo(lineRef.current, { scaleY: 0 },
          { scaleY: 1, duration: 0.8, ease: "power2.out",
            scrollTrigger: { trigger: lineRef.current, start: "top 85%" } });
      }
      /* Founder: no blur, simple fade */
      if (founderRef.current) {
        gsap.fromTo(founderRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
            scrollTrigger: { trigger: founderRef.current, start: "top 85%" } });
      }
      if (valuesRef.current) {
        const items = Array.from(valuesRef.current.children);
        items.forEach((item) => {
          gsap.fromTo(item, { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power3.out",
              scrollTrigger: { trigger: item, start: "top 90%" } });
          const border = item.querySelector("[data-border]");
          if (border) {
            gsap.fromTo(border, { scaleX: 0 },
              { scaleX: 1, duration: 0.6, ease: "power2.out",
                scrollTrigger: { trigger: item, start: "top 85%" } });
          }
        });
      }
    });

    /* ── Desktop: full blur + scrub + slide animations ── */
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      if (quoteRef.current) {
        const label = quoteRef.current.querySelector("[data-label]");
        if (label) {
          gsap.fromTo(label, { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
              scrollTrigger: { trigger: quoteRef.current, start: "top 85%" } });
        }
      }
      /* Quote word-by-word scrub */
      if (quoteWordsRef.current.length > 0 && quoteRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: quoteRef.current, start: "top 75%", end: "top 25%", scrub: 1 },
        });
        tl.to(quoteWordsRef.current, {
          opacity: 1, duration: 1, stagger: 1 / quoteWordsRef.current.length, ease: "none",
        });
      }
      /* Vertical accent line scrub */
      if (lineRef.current) {
        gsap.fromTo(lineRef.current, { scaleY: 0 },
          { scaleY: 1, ease: "none",
            scrollTrigger: { trigger: lineRef.current, start: "top 85%", end: "bottom 40%", scrub: 1 } });
      }
      /* Founder card slide in with blur */
      if (founderRef.current) {
        gsap.fromTo(founderRef.current,
          { opacity: 0, x: -40 },
          { opacity: 1, x: 0, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: founderRef.current, start: "top 80%" } });
      }
      /* Values sequential scrub reveal */
      if (valuesRef.current) {
        const items = Array.from(valuesRef.current.children);
        items.forEach((item) => {
          gsap.fromTo(item, { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
              scrollTrigger: { trigger: item, start: "top 85%" } });
          const border = item.querySelector("[data-border]");
          if (border) {
            gsap.fromTo(border, { scaleX: 0 },
              { scaleX: 1, duration: 0.8, ease: "power2.out",
                scrollTrigger: { trigger: item, start: "top 80%" } });
          }
        });
      }
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      setReducedMotionState(quoteWordsRef.current, { opacity: 1 });
      if (quoteRef.current) {
        const label = quoteRef.current.querySelector("[data-label]");
        if (label) setReducedMotionState(label as HTMLElement);
      }
      if (lineRef.current) {
        gsap.set(lineRef.current, { scaleY: 1 });
      }
      if (founderRef.current) {
        setReducedMotionState(founderRef.current);
      }
      if (valuesRef.current) {
        const items = Array.from(valuesRef.current.children);
        items.forEach((item) => {
          setReducedMotionState(item as HTMLElement);
          const border = item.querySelector("[data-border]");
          if (border) gsap.set(border, { scaleX: 1 });
        });
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="min-h-screen flex flex-col justify-center py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section heading (visually hidden, for heading hierarchy) */}
        <h2 className="sr-only">&Agrave; propos de Mita Studio</h2>

        {/* Hero quote — full width, scrub-driven */}
        <div ref={quoteRef} className="mb-10 sm:mb-16 text-center">
          <ScrubQuote text={QUOTE_TEXT} wordsRef={quoteWordsRef} />
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          {/* Left — Founder card */}
          <div ref={founderRef} className="flex gap-6">
            <div
              ref={lineRef}
              className="hidden sm:block w-px origin-top flex-shrink-0"
              style={{
                background: "linear-gradient(to bottom, oklch(0.65 0.25 265 / 40%), oklch(0.55 0.22 290 / 20%), transparent)",
              }}
            />
            <div>
              <div className="flex items-center gap-4 mb-6">
                {/* Founder avatar */}
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                  <Avatar
                    size={56}
                    name="Tahina Randrianandraina"
                    variant="marble"
                    colors={["#050a1e", "#7c3aed", "#a78bfa", "#c4b5fd", "#ffffff"]}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Tahina Randrianandraina
                  </h3>
                  <p className="text-sm text-white">
                    Fondateur, Mita Studio
                  </p>
                </div>
              </div>

              <p className="text-base sm:text-lg text-white leading-relaxed mb-4">
                J&rsquo;ai cr&eacute;&eacute; Mita Studio apr&egrave;s un constat simple&nbsp;:
                trop de petites entreprises payent 5&nbsp;000&nbsp;&euro; pour un site
                qui ne leur rapporte rien. L&rsquo;IA change la donne. On
                peut faire mieux, plus vite, pour beaucoup moins.
              </p>
              <p className="text-base sm:text-lg text-white leading-relaxed mb-6">
                Mon obsession&nbsp;: que chaque euro investi par nos clients
                se transforme en r&eacute;sultat concret. Pas de jargon,
                pas de promesses vides. Juste du travail bien fait.
              </p>

              <Link
                href="/fondateur"
                className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-white transition-colors group"
              >
                Voir le portfolio
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right — values */}
          <div ref={valuesRef} className="space-y-0">
            {VALUES.map((value, i) => (
              <div key={value.label} className="py-7 relative">
                <div className="flex items-start gap-4">
                  <span className="text-sm font-mono mt-0.5 shrink-0 accent-text opacity-40">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1.5">
                      {value.label}
                    </h3>
                    <p className="text-sm sm:text-base text-white leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
                {/* Animated border */}
                {i < VALUES.length - 1 && (
                  <div
                    data-border
                    className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.06] origin-left"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
