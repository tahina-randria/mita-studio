"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setReducedMotionState } from "@/lib/motion";


const LOGOS = [
  "Atelier Bois",
  "TEKNA Solutions",
  "Fl\u014dra D\u00e9co",
  "NovaPharma",
  "UrbanFit",
  "Caf\u00e9 Lumi\u00e8re",
  "Digit\u00e9k",
  "GreenLeaf",
];

export function LogoCloudSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      /* Fade in */
      if (sectionRef.current) {
        gsap.fromTo(
          sectionRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 90%",
            },
          }
        );
      }

      /* Infinite marquee */
      if (trackRef.current) {
        const track = trackRef.current;
        const totalWidth = track.scrollWidth / 2;

        gsap.to(track, {
          x: -totalWidth,
          duration: 30,
          ease: "none",
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize((x: number) => x % totalWidth),
          },
        });
      }
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      if (sectionRef.current) {
        setReducedMotionState(sectionRef.current);
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-10 sm:py-14 border-t border-white/[0.06] overflow-hidden"
    >
      <p className="text-center text-xs uppercase tracking-[0.2em] text-white mb-8">
        Ils nous font confiance
      </p>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none bg-gradient-to-r from-[#050a1e] to-transparent" />
        <div className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none bg-gradient-to-l from-[#050a1e] to-transparent" />

        {/* Marquee track — duplicated for infinite loop */}
        <div ref={trackRef} className="flex items-center gap-12 sm:gap-16 w-max">
          {[...LOGOS, ...LOGOS].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="text-base sm:text-lg font-medium text-white whitespace-nowrap select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
