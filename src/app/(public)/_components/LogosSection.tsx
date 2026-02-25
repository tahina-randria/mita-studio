"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setReducedMotionState } from "@/lib/motion";


/**
 * Placeholder client logos — text-based with varied font styles.
 * Replace with real SVG/image logos when available.
 */
const LOGOS = [
  { name: "Atelier Bois", style: "font-serif italic" },
  { name: "NØRD", style: "font-mono tracking-[0.2em] uppercase" },
  { name: "véloci", style: "font-sans font-light lowercase" },
  { name: "Maison Baobab", style: "font-serif tracking-wide" },
  { name: "TEKNA", style: "font-mono font-bold uppercase tracking-[0.15em]" },
  { name: "flōra", style: "font-sans font-extralight lowercase tracking-wider" },
];

export function LogosSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      /* ── Label fade ── */
      if (labelRef.current) {
        gsap.fromTo(
          labelRef.current,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 90%",
            },
          }
        );
      }

      /* ── Logos stagger reveal ── */
      if (trackRef.current) {
        const logos = Array.from(trackRef.current.children);
        gsap.fromTo(
          logos,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
            },
          }
        );
      }
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      setReducedMotionState(labelRef.current);
      if (trackRef.current) {
        setReducedMotionState(Array.from(trackRef.current.children) as HTMLElement[]);
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-12 sm:py-16 border-t border-white/[0.06]"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p
          ref={labelRef}
          className="text-center text-xs sm:text-sm uppercase tracking-[0.2em] text-white mb-8 sm:mb-10 font-medium"
        >
          Ils nous font confiance
        </p>

        <div
          ref={trackRef}
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-16 sm:gap-y-8"
        >
          {LOGOS.map((logo) => (
            <span
              key={logo.name}
              className={`text-white text-lg sm:text-xl lg:text-2xl select-none transition-colors duration-500 hover:text-white ${logo.style}`}
            >
              {logo.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
