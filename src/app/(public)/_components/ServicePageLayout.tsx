"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { setReducedMotionState } from "@/lib/motion";
import { CaretDown } from "@phosphor-icons/react";
import { StudioHeader } from "./StudioHeader";
import { StudioFooter } from "./StudioFooter";

interface ServiceFeature {
  icon: string;
  title: string;
  description: string;
}

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface ServicePageProps {
  title: string;
  subtitle: string;
  description: string;
  features: ServiceFeature[];
  process: ProcessStep[];
  faqs: FAQ[];
  ctaText?: string;
  jsonLd: Record<string, unknown>;
}

export function ServicePageLayout({
  title,
  subtitle,
  description,
  features,
  process,
  faqs,
  ctaText,
  jsonLd,
}: ServicePageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresHeadRef = useRef<HTMLDivElement>(null);
  const featuresGridRef = useRef<HTMLDivElement>(null);
  const processHeadRef = useRef<HTMLDivElement>(null);
  const processGridRef = useRef<HTMLDivElement>(null);
  const faqHeadRef = useRef<HTMLDivElement>(null);
  const faqListRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    /* ── Mobile: simple fades ── */
    mm.add(
      "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
      () => {
        // Hero
        if (heroRef.current) {
          gsap.fromTo(
            Array.from(heroRef.current.children),
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }
          );
        }
        // Features
        if (featuresHeadRef.current) {
          gsap.fromTo(
            Array.from(featuresHeadRef.current.children),
            { opacity: 0, y: 15 },
            {
              opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out",
              scrollTrigger: { trigger: featuresHeadRef.current, start: "top 85%" },
            }
          );
        }
        if (featuresGridRef.current) {
          gsap.fromTo(
            Array.from(featuresGridRef.current.children),
            { opacity: 0, y: 20 },
            {
              opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out",
              scrollTrigger: { trigger: featuresGridRef.current, start: "top 85%" },
            }
          );
        }
        // Process
        if (processHeadRef.current) {
          gsap.fromTo(
            Array.from(processHeadRef.current.children),
            { opacity: 0, y: 15 },
            {
              opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out",
              scrollTrigger: { trigger: processHeadRef.current, start: "top 85%" },
            }
          );
        }
        if (processGridRef.current) {
          gsap.fromTo(
            Array.from(processGridRef.current.children),
            { opacity: 0, y: 20 },
            {
              opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out",
              scrollTrigger: { trigger: processGridRef.current, start: "top 85%" },
            }
          );
        }
        // FAQ
        if (faqHeadRef.current) {
          gsap.fromTo(
            Array.from(faqHeadRef.current.children),
            { opacity: 0, y: 15 },
            {
              opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out",
              scrollTrigger: { trigger: faqHeadRef.current, start: "top 85%" },
            }
          );
        }
        if (faqListRef.current) {
          gsap.fromTo(
            Array.from(faqListRef.current.children),
            { opacity: 0, y: 15 },
            {
              opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out",
              scrollTrigger: { trigger: faqListRef.current, start: "top 85%" },
            }
          );
        }
        // CTA
        if (ctaRef.current) {
          gsap.fromTo(
            Array.from(ctaRef.current.children),
            { opacity: 0, y: 15 },
            {
              opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out",
              scrollTrigger: { trigger: ctaRef.current, start: "top 85%" },
            }
          );
        }
      }
    );

    /* ── Desktop: richer animations ── */
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        // Hero
        if (heroRef.current) {
          gsap.fromTo(
            Array.from(heroRef.current.children),
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" }
          );
        }
        // Features
        if (featuresHeadRef.current) {
          gsap.fromTo(
            Array.from(featuresHeadRef.current.children),
            { opacity: 0, y: 20 },
            {
              opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
              scrollTrigger: { trigger: featuresHeadRef.current, start: "top 80%" },
            }
          );
        }
        if (featuresGridRef.current) {
          const cards = Array.from(featuresGridRef.current.children);
          cards.forEach((card, i) => {
            gsap.fromTo(
              card,
              { opacity: 0, y: 30, scale: 0.97 },
              {
                opacity: 1, y: 0, scale: 1, duration: 0.8, delay: i * 0.1, ease: "power3.out",
                scrollTrigger: { trigger: featuresGridRef.current, start: "top 80%" },
              }
            );
          });
        }
        // Process
        if (processHeadRef.current) {
          gsap.fromTo(
            Array.from(processHeadRef.current.children),
            { opacity: 0, y: 20 },
            {
              opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
              scrollTrigger: { trigger: processHeadRef.current, start: "top 80%" },
            }
          );
        }
        if (processGridRef.current) {
          const steps = Array.from(processGridRef.current.children);
          steps.forEach((step, i) => {
            gsap.fromTo(
              step,
              { opacity: 0, y: 30 },
              {
                opacity: 1, y: 0, duration: 0.8, delay: i * 0.1, ease: "power3.out",
                scrollTrigger: { trigger: processGridRef.current, start: "top 80%" },
              }
            );
          });
        }
        // FAQ
        if (faqHeadRef.current) {
          gsap.fromTo(
            Array.from(faqHeadRef.current.children),
            { opacity: 0, y: 20 },
            {
              opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
              scrollTrigger: { trigger: faqHeadRef.current, start: "top 80%" },
            }
          );
        }
        if (faqListRef.current) {
          gsap.fromTo(
            Array.from(faqListRef.current.children),
            { opacity: 0, y: 20 },
            {
              opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out",
              scrollTrigger: { trigger: faqListRef.current, start: "top 80%" },
            }
          );
        }
        // CTA
        if (ctaRef.current) {
          gsap.fromTo(
            Array.from(ctaRef.current.children),
            { opacity: 0, y: 20 },
            {
              opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
              scrollTrigger: { trigger: ctaRef.current, start: "top 85%" },
            }
          );
        }
      }
    );

    /* ── Reduced motion ── */
    mm.add("(prefers-reduced-motion: reduce)", () => {
      const refs = [heroRef, featuresHeadRef, featuresGridRef, processHeadRef, processGridRef, faqHeadRef, faqListRef, ctaRef];
      refs.forEach((ref) => {
        if (ref.current) {
          setReducedMotionState(
            ref.current.children
              ? (Array.from(ref.current.children) as HTMLElement[])
              : ref.current
          );
        }
      });
    });

    return () => mm.revert();
  }, []);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
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
        name: title,
      },
    ],
  };

  return (
    <div className="studio-page min-h-screen bg-[#050a1e] text-white">
      <Script
        id="service-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <StudioHeader />

      {/* ── Hero ── */}
      <section className="relative pt-32 sm:pt-44 pb-16 sm:pb-20" style={{ zIndex: 1 }}>
        <div ref={heroRef} className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          {/* Breadcrumb */}
          <nav aria-label="Fil d'Ariane" className="flex items-center justify-center gap-2 text-xs text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white/80">{title}</span>
          </nav>

          <span className="text-sm uppercase tracking-[0.2em] text-white/50 mb-4 block">
            {subtitle}
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
            {title}
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-white/70 leading-relaxed mt-6">
            {description}
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-white text-[#050a1e] px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-white/90 active:scale-[0.98] transition-all mt-8"
          >
            Nous contacter
          </Link>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative py-20 sm:py-28" style={{ zIndex: 1 }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div ref={featuresHeadRef} className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="text-3xl sm:text-4xl text-white tracking-tight">
              Ce que nous offrons
            </h2>
          </div>

          <div ref={featuresGridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300"
              >
                <span className="text-2xl mb-3 block">{feature.icon}</span>
                <h3 className="text-base font-medium text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section
        id="process"
        className="relative py-20 sm:py-28 border-t border-b border-white/[0.06]"
        style={{ zIndex: 1 }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div ref={processHeadRef} className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="text-3xl sm:text-4xl text-white tracking-tight">
              Notre processus
            </h2>
          </div>

          <div ref={processGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-0">
            {process.map((step, idx) => (
              <div
                key={step.number}
                className={`p-6 sm:p-8 ${
                  idx < process.length - 1
                    ? "sm:border-b lg:border-b-0 lg:border-r border-white/[0.06]"
                    : ""
                }`}
              >
                <span className="text-3xl font-bold text-white/20 block mb-4">
                  {step.number}
                </span>
                <h3 className="text-base font-medium text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="relative py-20 sm:py-28" style={{ zIndex: 1 }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div ref={faqHeadRef} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl text-white tracking-tight">
              Questions fr&eacute;quentes
            </h2>
          </div>

          <div ref={faqListRef}>
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="border-b border-white/[0.06] group"
              >
                <summary className="flex items-center justify-between py-5 cursor-pointer text-white font-medium text-sm sm:text-base hover:text-white/80 transition-colors list-none [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>
                  <CaretDown
                    size={16}
                    weight="bold"
                    className="text-white/40 transition-transform duration-200 group-open:rotate-180 shrink-0 ml-4"
                  />
                </summary>
                <div className="pb-5 text-sm sm:text-base text-white/90 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        ref={ctaRef}
        className="relative py-20 sm:py-28 border-t border-white/[0.06] text-center"
        style={{ zIndex: 1 }}
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl text-white tracking-tight">
            {ctaText || "Pr\u00eat \u00e0 commencer\u00a0?"}
          </h2>

          <p className="text-lg text-white/60 mt-4 mb-8">
            Contactez-nous pour un premier &eacute;change gratuit et sans
            engagement.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-white text-[#050a1e] px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-white/90 active:scale-[0.98] transition-all"
          >
            Nous contacter
          </Link>

          <p className="mt-6 text-sm text-white/40">
            contact@mita-studio.com
          </p>
        </div>
      </section>

      <StudioFooter />
    </div>
  );
}
