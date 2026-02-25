"use client";

import { useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Check } from "@phosphor-icons/react";
import { setReducedMotionState } from "@/lib/motion";


interface PricingTier {
  name: string;
  price: string;
  priceNumeric: number | null;
  priceLabel: string;
  priceSuffix: string;
  description: string;
  featured: boolean;
  cta: string;
  ctaHref: string;
  features: string[];
}

interface SubscriptionTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  ctaHref: string;
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: "Essentiel",
    price: "790\u00a0\u20ac",
    priceNumeric: 790,
    priceLabel: "\u00c0 partir de",
    priceSuffix: "\u00a0\u20ac",
    description:
      "Une page, sobre et efficace. Votre activit\u00e9 en ligne en 2\u00a0semaines.",
    featured: false,
    cta: "D\u00e9marrer un projet",
    ctaHref: "/contact",
    features: [
      "Site one-page responsive",
      "Design personnalis\u00e9",
      "H\u00e9bergement 1\u00a0an inclus",
      "Formulaire de contact",
      "R\u00e9f\u00e9rencement Google de base",
      "1 round de r\u00e9visions inclus",
      "Livraison en 2\u00a0semaines*",
    ],
  },
  {
    name: "Croissance",
    price: "2\u00a0490\u00a0\u20ac",
    priceNumeric: 2490,
    priceLabel: "\u00c0 partir de",
    priceSuffix: "\u00a0\u20ac",
    description:
      "Multi-pages, r\u00e9f\u00e9rencement Google, blog. Le site complet pour \u00eatre trouv\u00e9 en ligne.",
    featured: true,
    cta: "Choisir Croissance",
    ctaHref: "/contact",
    features: [
      "Jusqu\u2019\u00e0 7 pages",
      "R\u00e9f\u00e9rencement Google complet",
      "Blog int\u00e9gr\u00e9 + analytics",
      "2 mois de maintenance inclus",
      "Formation prise en main (1h)",
      "2 rounds de r\u00e9visions inclus",
      "Livraison en 4\u00a0semaines*",
    ],
  },
  {
    name: "Premium",
    price: "Sur devis",
    priceNumeric: null,
    priceLabel: "",
    priceSuffix: "",
    description:
      "E-commerce, app web, int\u00e9grations. Projet sur mesure, de A \u00e0 Z.",
    featured: false,
    cta: "Discuter de mon projet",
    ctaHref: "/contact",
    features: [
      "Pages illimit\u00e9es",
      "E-commerce / App web",
      "R\u00e9f\u00e9rencement avanc\u00e9 + suivi mensuel",
      "Int\u00e9grations sur mesure (CRM, API)",
      "Accompagnement sur mesure",
      "Planning personnalis\u00e9",
    ],
  },
];

const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    name: "Maintenance",
    price: "89\u00a0\u20ac/mois",
    description: "Votre site toujours \u00e0 jour et fonctionnel.",
    features: [
      "1h de travail effectif / mois",
      "Mises \u00e0 jour techniques",
      "Modifications mineures (textes, images)",
      "Support par email (48h ouvr\u00e9es)",
      "Sauvegarde mensuelle",
    ],
    ctaHref: "/contact",
  },
  {
    name: "Croissance",
    price: "249\u00a0\u20ac/mois",
    description: "Faites vivre votre site et grimpez sur Google.",
    features: [
      "3h de travail effectif / mois",
      "Tout ce qui est dans Maintenance",
      "1 article SEO optimis\u00e9 / mois",
      "Optimisation SEO continue",
      "Rapport de positionnement mensuel",
    ],
    ctaHref: "/contact",
  },
  {
    name: "Acc\u00e9l\u00e9ration",
    price: "449\u00a0\u20ac/mois",
    description: "Croissance maximale, visibilit\u00e9 acc\u00e9l\u00e9r\u00e9e.",
    features: [
      "6h de travail effectif / mois",
      "Tout ce qui est dans Croissance",
      "2 articles SEO / mois",
      "Gestion Google Business Profile",
      "Audit trimestriel de performance",
      "Support prioritaire (24h ouvr\u00e9es)",
    ],
    ctaHref: "/contact",
  },
];


/* ── Word split component for heading ── */
function SplitHeading({
  text,
  wordsRef,
  className,
}: {
  text: string;
  wordsRef: React.MutableRefObject<HTMLSpanElement[]>;
  className?: string;
}) {
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  return (
    <h2 className={className} aria-label={text}>
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
    </h2>
  );
}

/* ── Price counter component ── */
function PriceDisplay({
  tier,
  priceRef,
}: {
  tier: PricingTier;
  priceRef: (el: HTMLSpanElement | null) => void;
}) {
  if (tier.priceNumeric !== null) {
    return (
      <div className="flex items-baseline gap-2">
        {tier.priceLabel && (
          <span className="text-xs text-white uppercase tracking-wide">
            {tier.priceLabel}
          </span>
        )}
        <span
          ref={priceRef}
          data-target={tier.priceNumeric}
          className={`font-medium tracking-tight ${
            tier.featured ? "text-3xl sm:text-5xl text-white" : "text-3xl sm:text-4xl text-white"
          }`}
        >
          {tier.price}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-baseline gap-2">
      <span
        className={`font-medium tracking-tight ${
          tier.featured ? "text-3xl sm:text-5xl text-white" : "text-3xl sm:text-4xl text-white"
        }`}
      >
        {tier.price}
      </span>
    </div>
  );
}

export function StudioPricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingWordsRef = useRef<HTMLSpanElement[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const priceRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const hasCountedRef = useRef(false);

  const setPriceRef = useCallback((index: number) => (el: HTMLSpanElement | null) => {
    priceRefs.current[index] = el;
  }, []);

  useEffect(() => {
    const mm = gsap.matchMedia();

    /* ── Mobile: no blur, no scale, simpler card entrance ── */
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      if (headingWordsRef.current.length > 0) {
        gsap.set(headingWordsRef.current, { opacity: 0, y: 20 });
        gsap.to(headingWordsRef.current, {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
        });
      }
      if (subtitleRef.current) {
        gsap.fromTo(subtitleRef.current, { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } });
      }
      if (gridRef.current) {
        gsap.fromTo(Array.from(gridRef.current.children),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: gridRef.current, start: "top 85%" } });
      }
      /* ── Price counter ── */
      if (!hasCountedRef.current) {
        PRICING_TIERS.forEach((tier, i) => {
          const el = priceRefs.current[i];
          if (!el || tier.priceNumeric === null) return;
          const target = tier.priceNumeric;
          const suffix = tier.priceSuffix;
          const obj = { value: 0 };
          gsap.to(obj, {
            value: target, duration: 1.5, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%",
              onEnter: () => { hasCountedRef.current = true; } },
            onUpdate() {
              el.textContent = `${Math.round(obj.value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0")}${suffix}`;
            },
          });
        });
      }
    });

    /* ── Desktop: full blur + scale + theatrical card entrance ── */
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      if (headingWordsRef.current.length > 0) {
        gsap.set(headingWordsRef.current, { opacity: 0, y: 30 });
        gsap.to(headingWordsRef.current, {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        });
      }
      if (subtitleRef.current) {
        gsap.fromTo(subtitleRef.current, { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%" } });
      }
      if (gridRef.current) {
        const cards = Array.from(gridRef.current.children) as HTMLElement[];
        const featuredIndex = PRICING_TIERS.findIndex((t) => t.featured);
        cards.forEach((card, i) => {
          const isFeatured = i === featuredIndex;
          gsap.fromTo(card,
            { opacity: 0, y: 80, scale: isFeatured ? 0.9 : 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 1, delay: isFeatured ? 0 : 0.15, ease: "power3.out",
              scrollTrigger: { trigger: gridRef.current, start: "top 80%" } }
          );
          const features = card.querySelectorAll("[data-feature]");
          if (features.length > 0) {
            gsap.fromTo(Array.from(features), { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power2.out",
                scrollTrigger: { trigger: card, start: "top 70%" } });
          }
        });
      }
      /* ── Price counter ── */
      if (!hasCountedRef.current) {
        PRICING_TIERS.forEach((tier, i) => {
          const el = priceRefs.current[i];
          if (!el || tier.priceNumeric === null) return;
          const target = tier.priceNumeric;
          const suffix = tier.priceSuffix;
          const obj = { value: 0 };
          gsap.to(obj, {
            value: target, duration: 1.5, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%",
              onEnter: () => { hasCountedRef.current = true; } },
            onUpdate() {
              el.textContent = `${Math.round(obj.value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0")}${suffix}`;
            },
          });
        });
      }
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      setReducedMotionState(headingWordsRef.current);
      if (subtitleRef.current) {
        setReducedMotionState(subtitleRef.current);
      }
      if (gridRef.current) {
        const cards = Array.from(gridRef.current.children);
        cards.forEach((card) => {
          setReducedMotionState(card as HTMLElement);
          const features = card.querySelectorAll("[data-feature]");
          setReducedMotionState(features);
        });
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="min-h-screen flex flex-col justify-center py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 w-full">
        {/* Heading */}
        <div className="mb-8 sm:mb-10 text-center shrink-0">
          <SplitHeading
            text="Tarifs transparents"
            wordsRef={headingWordsRef}
            className="text-3xl text-white sm:text-4xl tracking-tight"
          />
          <p
            ref={subtitleRef}
            className="mt-4 text-base sm:text-lg text-white max-w-xl mx-auto"
          >
            Des formules claires, sans surprise.
            Choisissez le plan qui correspond &agrave; vos ambitions.
          </p>
        </div>

        {/* Pricing Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-0 md:items-stretch"
        >
          {PRICING_TIERS.map((tier, i) => (
            <div
              key={tier.name}
              className={`relative flex flex-col transition-all duration-300 ${
                tier.featured
                  ? "liquid-glass-strong gradient-border z-10 rounded-2xl p-6 sm:p-8 lg:p-7 xl:p-9 md:scale-[1.04] md:-my-4 overflow-visible"
                  : `liquid-glass overflow-hidden p-5 sm:p-7 lg:p-6 xl:p-8 ${
                      i === 0
                        ? "rounded-2xl md:rounded-l-2xl md:rounded-r-none"
                        : "rounded-2xl md:rounded-r-2xl md:rounded-l-none"
                    }`
              }`}
            >
              {/* Featured badge — gradient accent */}
              {tier.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-block rounded-full bg-white px-5 py-1.5 text-[11px] font-semibold tracking-wider uppercase text-[#0a0a0a]">
                    Recommand&eacute;
                  </span>
                </div>
              )}

              {/* Tier header */}
              <div className={tier.featured ? "mb-6" : "mb-5"}>
                <h3 className="text-lg font-medium text-white mb-1.5">
                  {tier.name}
                </h3>
                <p className="text-[15px] text-white leading-relaxed mb-4 min-h-[36px]">
                  {tier.description}
                </p>

                {/* Price */}
                {tier.name === "Essentiel" ? (
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-white uppercase tracking-wide">
                        Offre de lancement
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-lg text-white/40 line-through">
                        990&nbsp;&euro;
                      </span>
                      <span
                        ref={setPriceRef(i)}
                        data-target={790}
                        className="text-3xl sm:text-4xl font-medium tracking-tight text-white"
                      >
                        790&nbsp;&euro;
                      </span>
                      <span className="text-xs text-white/50">TTC</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <PriceDisplay tier={tier} priceRef={setPriceRef(i)} />
                    {tier.priceNumeric !== null && (
                      <span className="text-xs text-white/50 ml-1">TTC</span>
                    )}
                  </div>
                )}
              </div>

              {/* Separator — accent gradient for featured */}
              <div
                className={`mb-5 ${
                  tier.featured
                    ? "accent-line"
                    : "border-t border-white/[0.06]"
                }`}
              />

              {/* Features */}
              <ul className={`flex-1 space-y-2.5 ${tier.featured ? "mb-6" : "mb-5"}`}>
                {tier.features.map((feature) => (
                  <li key={feature} data-feature className="flex items-start gap-2.5">
                    <Check
                      size={14}
                      weight="regular"
                      className="mt-0.5 shrink-0 text-white"
                    />
                    <span
                      className="text-sm leading-relaxed text-white"
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={tier.ctaHref}
                className={`mt-auto block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                  tier.featured
                    ? "btn-accent"
                    : "border border-white/[0.1] hover:border-white/20 hover:bg-white/[0.04] text-white"
                }`}
              >
                <span className="relative z-10">{tier.cta}</span>
              </a>
            </div>
          ))}
        </div>

        {/* Abonnements mensuels */}
        <div className="mt-14 sm:mt-20">
          <div className="mb-8 text-center">
            <h3 className="text-2xl sm:text-3xl text-white tracking-tight">
              Restez visible apr&egrave;s le lancement
            </h3>
            <p className="mt-3 text-base text-white max-w-lg mx-auto">
              Des forfaits mensuels pour faire vivre votre site et votre visibilit&eacute;.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {SUBSCRIPTION_TIERS.map((sub) => (
              <div
                key={sub.name}
                className="liquid-glass rounded-2xl p-6 sm:p-7 flex flex-col"
              >
                <h4 className="text-lg font-medium text-white mb-1">
                  {sub.name}
                </h4>
                <p className="text-[15px] text-white leading-relaxed mb-4">
                  {sub.description}
                </p>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-2xl sm:text-3xl font-medium text-white">
                    {sub.price}
                  </span>
                  <span className="text-xs text-white/50">TTC</span>
                </div>
                <div className="border-t border-white/[0.06] mb-5" />
                <ul className="flex-1 space-y-2.5 mb-5">
                  {sub.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check
                        size={14}
                        weight="regular"
                        className="mt-0.5 shrink-0 text-white"
                      />
                      <span className="text-sm leading-relaxed text-white">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <a
                  href={sub.ctaHref}
                  className="mt-auto block w-full rounded-xl py-3 text-center text-sm font-semibold border border-white/[0.1] hover:border-white/20 hover:bg-white/[0.04] text-white transition-all active:scale-[0.98]"
                >
                  En savoir plus
                </a>
              </div>
            ))}
          </div>

          <p className="mt-5 text-center text-xs text-white">
            Sans engagement. R&eacute;siliable avec 15&nbsp;jours de pr&eacute;avis. Quotas mensuels non reportables.
          </p>
        </div>

        {/* Outil métier — full-width accent card */}
        <div className="mt-10 sm:mt-14">
          <div className="relative overflow-hidden rounded-2xl gradient-border p-8 sm:p-10">
            {/* Glow */}
            <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-white/[0.06] blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-white/[0.04] blur-3xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <span className="inline-block text-xs uppercase tracking-[0.2em] font-semibold text-white mb-3">
                  Sur mesure
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Besoin d&rsquo;un outil m&eacute;tier&nbsp;?
                </h3>
                <p className="text-base text-white max-w-md leading-relaxed">
                  App web, automatisation, CRM, int&eacute;grations API.
                  On construit votre outil de z&eacute;ro, sur devis.
                </p>
              </div>
              <Link
                href="/contact"
                className="shrink-0 inline-flex items-center justify-center rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-[#0a0a0a] hover:bg-white/90 transition-all active:scale-[0.98]"
              >
                Discuter de mon projet
              </Link>
            </div>
          </div>
        </div>

        {/* Compliance */}
        <p className="mt-8 text-center text-xs text-white leading-relaxed max-w-lg mx-auto">
          Tarifs TTC. Le tarif final est &eacute;tabli sur devis apr&egrave;s &eacute;change.
          D&eacute;lais indicatifs, variables selon la complexit&eacute; du projet.
        </p>
      </div>
    </section>
  );
}
