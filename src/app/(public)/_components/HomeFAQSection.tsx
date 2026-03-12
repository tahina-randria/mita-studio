"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { setReducedMotionState } from "@/lib/motion";
import { CaretDown } from "@phosphor-icons/react";

export function HomeFAQSection({ faqs }: { faqs: { id: string; question: string; answer: string }[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

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
        if (listRef.current) {
          gsap.fromTo(
            Array.from(listRef.current.children),
            { opacity: 0, y: 15 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.06,
              ease: "power3.out",
              scrollTrigger: {
                trigger: listRef.current,
                start: "top 85%",
              },
            }
          );
        }
      }
    );

    /* Desktop: enhanced stagger */
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
        if (listRef.current) {
          const items = Array.from(listRef.current.children);
          items.forEach((item, i) => {
            gsap.fromTo(
              item,
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                delay: i * 0.08,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: listRef.current,
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
      if (listRef.current) {
        setReducedMotionState(
          Array.from(listRef.current.children) as HTMLElement[]
        );
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="py-20 sm:py-28 border-t border-white/[0.06]"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div ref={headingRef} className="mb-10 sm:mb-14 text-center">
          <h2 className="text-3xl sm:text-4xl text-white tracking-tight">
            Questions fr&eacute;quentes
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white max-w-lg mx-auto">
            Tout ce que vous devez savoir avant de d&eacute;marrer.
          </p>
        </div>

        <div ref={listRef} className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.id}
              className="group rounded-xl border border-white/[0.06] bg-white/[0.02] transition-colors hover:border-white/[0.10] open:bg-white/[0.03]"
            >
              <summary className="flex items-center justify-between cursor-pointer px-5 sm:px-6 py-4 sm:py-5 text-base font-medium text-white select-none list-none [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <CaretDown
                  size={16}
                  weight="bold"
                  className="shrink-0 ml-4 text-white/60 transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-base sm:text-lg leading-relaxed text-white/90">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
