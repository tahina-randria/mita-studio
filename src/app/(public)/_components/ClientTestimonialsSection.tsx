"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { setReducedMotionState } from "@/lib/motion";
import { Star, ArrowRight, ChatCircleDots } from "@phosphor-icons/react";
import Link from "next/link";

export function ClientTestimonialsSection({
  testimonials,
  teaserQuotes,
}: {
  testimonials: {
    id: string;
    quote: string;
    name: string;
    role: string;
    company: string;
    initials: string | null;
    accentColor: string | null;
  }[];
  teaserQuotes: { id: string; text: string }[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    /* Mobile: simple fade */
    mm.add(
      "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
      () => {
        if (headingRef.current) {
          gsap.fromTo(
            Array.from(headingRef.current.children),
            { opacity: 0, y: 15 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 85%",
              },
            }
          );
        }
        if (gridRef.current) {
          gsap.fromTo(
            Array.from(gridRef.current.children),
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: gridRef.current,
                start: "top 85%",
              },
            }
          );
        }
      }
    );

    /* Desktop: full stagger + scale */
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        if (headingRef.current) {
          gsap.fromTo(
            Array.from(headingRef.current.children),
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
              },
            }
          );
        }
        if (gridRef.current) {
          const cards = Array.from(gridRef.current.children);
          cards.forEach((card, i) => {
            gsap.fromTo(
              card,
              { opacity: 0, y: 30, scale: 0.97 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                delay: i * 0.1,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: gridRef.current,
                  start: "top 80%",
                },
              }
            );
          });
        }
      }
    );

    mm.add("(prefers-reduced-motion: reduce)", () => {
      if (headingRef.current) {
        setReducedMotionState(Array.from(headingRef.current.children));
      }
      if (gridRef.current) {
        setReducedMotionState(
          Array.from(gridRef.current.children) as HTMLElement[]
        );
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="py-20 sm:py-28 border-t border-white/[0.06]"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div ref={headingRef} className="mb-10 sm:mb-14 text-center">
          <h2 className="text-3xl sm:text-4xl text-white tracking-tight">
            Ce que disent nos clients
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/70 max-w-lg mx-auto">
            Des retours sinc&egrave;res, des projets livr&eacute;s.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
        >
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    weight="fill"
                    className="text-white/60"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-sm sm:text-[15px] leading-relaxed text-white/90 mb-6">
                &laquo;&nbsp;{t.quote}&nbsp;&raquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                {/* Avatar with initials */}
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: t.accentColor ?? undefined }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-white/60">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* CTA Card */}
          <div className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.06] mb-4">
                <ChatCircleDots size={20} weight="bold" className="text-white/60" />
              </div>
              <h3 className="text-base font-medium text-white mb-3">
                Et vous, c&rsquo;est quoi votre projet ?
              </h3>
              {/* Teaser quotes */}
              <div className="space-y-2 mb-6">
                {teaserQuotes.map((q) => (
                  <p
                    key={q.id}
                    className="text-sm text-white/60 italic"
                  >
                    {q.text}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white py-3 px-5 text-sm font-semibold text-[#050a1e] hover:bg-white/90 transition-colors"
              >
                Discuter de votre projet
                <ArrowRight size={14} weight="bold" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
