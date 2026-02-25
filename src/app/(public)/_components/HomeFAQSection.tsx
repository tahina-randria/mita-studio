"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { setReducedMotionState } from "@/lib/motion";
import { CaretDown } from "@phosphor-icons/react";

interface FAQ {
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  {
    question: "Combien de temps faut-il pour cr\u00e9er un site\u00a0?",
    answer:
      "En moyenne 2 \u00e0 4\u00a0semaines, selon la complexit\u00e9 du projet. Un site vitrine simple peut \u00eatre livr\u00e9 en 10\u00a0jours. Nous d\u00e9finissons un planning pr\u00e9cis d\u00e8s le d\u00e9marrage.",
  },
  {
    question: "Quels sont vos tarifs\u00a0?",
    answer:
      "\u00c0 partir de 790\u00a0\u20ac TTC pour un site vitrine (offre de lancement). Le tarif d\u00e9pend du nombre de pages, des fonctionnalit\u00e9s et du niveau de personnalisation. Chaque devis est d\u00e9finitif, pas de frais cach\u00e9s.",
  },
  {
    question: "Est-ce que le r\u00e9f\u00e9rencement Google est inclus\u00a0?",
    answer:
      "Le r\u00e9f\u00e9rencement (ou SEO) d\u00e9signe l\u2019ensemble des techniques pour que votre site apparaisse dans les premiers r\u00e9sultats Google. Oui, chaque site inclut une optimisation de base\u00a0: balises, performance, structure. Pour aller plus loin (contenu, liens, suivi de positions), on propose un accompagnement d\u00e9di\u00e9.",
  },
  {
    question: "Je ne suis pas technique, c\u2019est un probl\u00e8me\u00a0?",
    answer:
      "Pas du tout. On g\u00e8re toute la partie technique. Vous n\u2019avez qu\u2019\u00e0 fournir vos textes et images (on peut aussi s\u2019en charger). Apr\u00e8s livraison, on vous forme pour g\u00e9rer votre site en autonomie.",
  },
  {
    question: "Que se passe-t-il apr\u00e8s la livraison\u00a0?",
    answer:
      "Vous b\u00e9n\u00e9ficiez d\u2019un support post-lancement inclus. On reste disponible pour les ajustements, la formation et les questions. L\u2019h\u00e9bergement et la maintenance peuvent \u00eatre g\u00e9r\u00e9s par nos soins si souhait\u00e9.",
  },
  {
    question: "Travaillez-vous avec des clients hors de France\u00a0?",
    answer:
      "Oui, on travaille \u00e0 distance avec des clients partout dans le monde. Nos \u00e9changes se font par visio, email et messagerie. Le fuseau horaire n\u2019est jamais un frein.",
  },
];

export function HomeFAQSection() {
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
          {FAQS.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-xl border border-white/[0.06] bg-white/[0.02] transition-colors hover:border-white/[0.10] open:bg-white/[0.03]"
            >
              <summary className="flex items-center justify-between cursor-pointer px-5 sm:px-6 py-4 sm:py-5 text-[15px] sm:text-base font-medium text-white select-none list-none [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <CaretDown
                  size={16}
                  weight="bold"
                  className="shrink-0 ml-4 text-white/40 transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-[15px] sm:text-lg leading-relaxed text-white/90">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
