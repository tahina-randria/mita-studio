"use client";

import { useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";


function SplitTitle({ text, wordsRef }: { text: string; wordsRef: React.MutableRefObject<HTMLSpanElement[]> }) {
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  return (
    <span aria-hidden="true">
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <span
            ref={(el) => {
              if (el) wordsRef.current[i] = el;
            }}
            className="inline-block"
          >
            {word}
          </span>
          {i < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </span>
  );
}

export function StudioHeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleWordsRef = useRef<HTMLSpanElement[]>([]);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    /* ── Mobile: no blur (causes repaint storms), simpler animations ── */
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (titleWordsRef.current.length > 0) {
        gsap.set(titleWordsRef.current, { opacity: 0, y: 20 });
        tl.to(titleWordsRef.current, {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.04,
        });
      }

      tl.fromTo(descRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3"
      );

      if (ctasRef.current) {
        tl.fromTo(Array.from(ctasRef.current.children),
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
          "-=0.3"
        );
      }
    });

    /* ── Desktop: full blur + scale animations ── */
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (titleWordsRef.current.length > 0) {
        gsap.set(titleWordsRef.current, { opacity: 0, y: 35 });
        tl.to(titleWordsRef.current, {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.06,
        });
      }

      tl.fromTo(descRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.4"
      );

      if (ctasRef.current) {
        tl.fromTo(Array.from(ctasRef.current.children),
          { opacity: 0, y: 25, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.15 },
          "-=0.4"
        );
      }
    });

    /* Parallax — desktop only (no scrub on touch devices) */
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      if (sectionRef.current && titleRef.current) {
        gsap.to(titleRef.current, {
          yPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set([titleRef.current, descRef.current].filter(Boolean), {
        opacity: 1, y: 0,
      });
      gsap.set(titleWordsRef.current, { opacity: 1, y: 0 });
      if (ctasRef.current) {
        gsap.set(Array.from(ctasRef.current.children), { opacity: 1, y: 0, scale: 1 });
      }
    });

    return () => mm.revert();
  }, []);

  const handleScrollTo = (target: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const lenis = (
      window as unknown as {
        __lenis?: { scrollTo: (t: string | Element, opts?: { offset?: number }) => void };
      }
    ).__lenis;
    if (lenis) {
      lenis.scrollTo(target, { offset: -80 });
    } else {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-5 sm:px-6 py-20 sm:py-28"
    >
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h1
          ref={titleRef}
          className="text-[2rem] leading-[1.05] tracking-tight text-white sm:text-[2.75rem] lg:text-[3.5rem] xl:text-[4rem]"
          aria-label="Le digital pro, enfin accessible"
        >
          <SplitTitle
            text="Le digital pro, enfin accessible"
            wordsRef={titleWordsRef}
          />
        </h1>

        <p
          ref={descRef}
          className="mx-auto mt-4 sm:mt-5 max-w-2xl text-base sm:text-lg lg:text-xl leading-relaxed text-white"
        >
          Site web, r&eacute;f&eacute;rencement Google et outils digitaux sur mesure.
          <br />
          Livr&eacute;s en 2&nbsp;semaines.
        </p>

        <div
          ref={ctasRef}
          className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
        >
          <Link
            href="/contact"
            className="btn-accent cursor-pointer rounded-xl px-7 py-3 text-[13px] sm:px-8 sm:py-3.5 sm:text-[14px] inline-block active:scale-[0.97]"
          >
            D&eacute;marrer mon projet
          </Link>
          <button
            onClick={handleScrollTo("#process")}
            className="text-center rounded-xl border border-white/[0.15] px-7 py-3 text-[13px] sm:px-8 sm:py-3.5 sm:text-[14px] font-medium text-white cursor-pointer hover:border-white/30 hover:bg-white/[0.04] active:scale-[0.97] transition-all"
          >
            Voir comment &ccedil;a marche
          </button>
        </div>

        {/* Social proof badges */}
        <div className="mt-10 sm:mt-14 flex items-stretch justify-center gap-0">
          {[
            { value: "2 sem.", label: "D\u00e9lai moyen" },
            { value: "790\u00a0\u20ac", label: "\u00c0 partir de" },
            { value: "100%", label: "Satisfait ou refait" },
          ].map((badge, i) => (
            <div key={badge.label} className="flex items-stretch">
              {i > 0 && (
                <div className="w-px bg-white/[0.12] self-stretch mx-5 sm:mx-8" />
              )}
              <div className="flex flex-col items-center gap-1">
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  {badge.value}
                </span>
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.15em] text-white">
                  {badge.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
