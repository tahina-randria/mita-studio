"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Image from "next/image";
import { setReducedMotionState } from "@/lib/motion";

export function ProblemSection({ problems }: { problems: { id: string; stat: string; title: string; description: string; iconUrl: string | null }[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    /* ── Mobile: no blur, no scale ── */
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      if (headingRef.current) {
        gsap.fromTo(
          Array.from(headingRef.current.children),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: headingRef.current, start: "top 85%" } }
        );
      }
      if (cardsRef.current) {
        gsap.fromTo(
          Array.from(cardsRef.current.children),
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: cardsRef.current, start: "top 85%" } }
        );
      }
      if (taglineRef.current) {
        gsap.fromTo(taglineRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
            scrollTrigger: { trigger: taglineRef.current, start: "top 90%" } }
        );
      }
    });

    /* ── Desktop: full blur + scale animations ── */
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      if (headingRef.current) {
        gsap.fromTo(
          Array.from(headingRef.current.children),
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out",
            scrollTrigger: { trigger: headingRef.current, start: "top 85%" } }
        );
      }
      if (cardsRef.current) {
        const cards = Array.from(cardsRef.current.children);
        cards.forEach((card, i) => {
          gsap.fromTo(card,
            { opacity: 0, y: 40, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: i * 0.12, ease: "power3.out",
              scrollTrigger: { trigger: cardsRef.current, start: "top 80%" } }
          );
        });
      }
      if (taglineRef.current) {
        gsap.fromTo(taglineRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: taglineRef.current, start: "top 90%" } }
        );
      }
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      if (headingRef.current) {
        setReducedMotionState(Array.from(headingRef.current.children));
      }
      if (cardsRef.current) {
        setReducedMotionState(Array.from(cardsRef.current.children) as HTMLElement[]);
      }
      if (taglineRef.current) {
        setReducedMotionState(taglineRef.current);
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-[80vh] flex flex-col justify-center py-20 sm:py-28 border-t border-white/[0.06]"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 w-full">
        {/* Heading */}
        <div ref={headingRef} className="mb-10 sm:mb-14 text-center">
          <h2 className="text-3xl sm:text-4xl text-white tracking-tight">
            Pourquoi les solutions actuelles
            <br />
            ne marchent pas
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white max-w-lg mx-auto">
            Le probl&egrave;me que nos clients rencontrent tous.
          </p>
        </div>

        {/* Problem cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {problems.map((problem) => (
            <div
              key={problem.id}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 sm:p-8 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.05]"
            >
              {/* Icon — large, top-right corner with gradient mask + bend */}
              <div
                className="absolute -top-6 -right-6 w-48 h-48 sm:w-52 sm:h-52 pointer-events-none transition-opacity duration-500 opacity-40 group-hover:opacity-55 md:mix-blend-screen"
                style={{
                  maskImage: "radial-gradient(ellipse at 85% 15%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 65%)",
                  WebkitMaskImage: "radial-gradient(ellipse at 85% 15%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 65%)",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    transform: "perspective(600px) rotateY(-8deg) rotateX(5deg)",
                    transformOrigin: "top right",
                  }}
                >
                  <Image
                    src={problem.iconUrl ?? ""}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="208px"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Stat — big number */}
                <p className="text-2xl sm:text-3xl font-semibold text-white mb-2">
                  {problem.stat}
                </p>

                {/* Title */}
                <h3 className="text-base font-medium text-white mb-2">
                  {problem.title}
                </h3>

                {/* Description */}
                <p className="text-[15px] sm:text-base leading-relaxed text-white max-w-[80%]">
                  {problem.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tagline — the solution teaser */}
        <p
          ref={taglineRef}
          className="mt-10 sm:mt-14 text-center text-base sm:text-lg text-white max-w-2xl mx-auto leading-relaxed"
        >
          Il existe une meilleure approche.
          Qualit&eacute; agence, prix adapt&eacute; aux petites structures.
        </p>
      </div>
    </section>
  );
}
