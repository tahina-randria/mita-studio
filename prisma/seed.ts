import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...\n");

  // ============================================================================
  // CLEAN UP — Delete all existing data (order matters for FK constraints)
  // ============================================================================
  console.log("→ Cleaning existing data...");
  await prisma.pricingFeature.deleteMany();
  await prisma.pricingTier.deleteMany();
  await prisma.faqItem.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.teaserQuote.deleteMany();
  await prisma.commitment.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.service.deleteMany();
  await prisma.founderMilestone.deleteMany();
  await prisma.founderSkill.deleteMany();
  await prisma.navItem.deleteMany();
  await prisma.siteContent.deleteMany();
  await prisma.siteSetting.deleteMany();

  // ============================================================================
  // SITE SETTINGS
  // ============================================================================
  console.log("→ SiteSettings...");
  const settings = [
    { key: "company_name", value: "Mita Studio", type: "text", label: "Nom de l'entreprise", group: "general" },
    { key: "tagline", value: "Sites web, SEO & automatisation propulsés par l'IA.", type: "text", label: "Tagline", group: "general" },
    { key: "copyright", value: "© {year} Mita Studio. Tous droits réservés.", type: "text", label: "Copyright", group: "general" },
    { key: "email", value: "tahina@mita-studio.com", type: "email", label: "Email principal", group: "contact" },
    { key: "linkedin_url", value: "https://www.linkedin.com/company/mita-studio", type: "url", label: "LinkedIn", group: "social" },
  ];
  for (const s of settings) {
    await prisma.siteSetting.create({ data: s });
  }

  // ============================================================================
  // SITE CONTENT — Hero
  // ============================================================================
  console.log("→ SiteContent (hero)...");
  const heroContent = [
    { key: "hero_title", value: "Le digital pro, enfin accessible", type: "text", section: "hero", label: "Titre hero" },
    { key: "hero_subtitle", value: "Site web, référencement Google et outils digitaux sur mesure.\nLivrés en 1 à 3 semaines.", type: "text", section: "hero", label: "Sous-titre hero" },
    { key: "hero_cta_primary", value: "Démarrer mon projet", type: "text", section: "hero", label: "CTA primaire" },
    { key: "hero_cta_secondary", value: "Voir comment ça marche", type: "text", section: "hero", label: "CTA secondaire" },
    { key: "hero_badge_1_value", value: "2 sem.", type: "text", section: "hero", label: "Badge 1 valeur" },
    { key: "hero_badge_1_label", value: "Délai moyen", type: "text", section: "hero", label: "Badge 1 label" },
    { key: "hero_badge_2_value", value: "890 € HT", type: "text", section: "hero", label: "Badge 2 valeur" },
    { key: "hero_badge_2_label", value: "À partir de", type: "text", section: "hero", label: "Badge 2 label" },
    { key: "hero_badge_3_value", value: "100%", type: "text", section: "hero", label: "Badge 3 valeur" },
    { key: "hero_badge_3_label", value: "Satisfait ou on corrige", type: "text", section: "hero", label: "Badge 3 label" },
  ];
  for (const c of heroContent) {
    await prisma.siteContent.create({ data: c });
  }

  // ============================================================================
  // SITE CONTENT — About
  // ============================================================================
  console.log("→ SiteContent (about)...");
  const aboutContent = [
    { key: "about_quote", value: "On rend accessible ce qui était réservé aux gros budgets.", type: "text", section: "about", label: "Citation" },
    { key: "about_bio_1", value: "J'ai créé Mita Studio après un constat simple : trop de petites entreprises payent 5 000 € pour un site qui ne leur rapporte rien. L'IA change la donne. On peut faire mieux, plus vite, pour beaucoup moins.", type: "text", section: "about", label: "Bio paragraphe 1" },
    { key: "about_bio_2", value: "Mon obsession : que chaque euro investi par nos clients se transforme en résultat concret. Pas de jargon, pas de promesses vides. Juste du travail bien fait.", type: "text", section: "about", label: "Bio paragraphe 2" },
    { key: "about_value_1_label", value: "Votre projet, vos règles", type: "text", section: "about", label: "Valeur 1 titre" },
    { key: "about_value_1_description", value: "On s'adapte à votre budget, vos délais et vos objectifs. Pas l'inverse.", type: "text", section: "about", label: "Valeur 1 description" },
    { key: "about_value_2_label", value: "Résultats mesurables", type: "text", section: "about", label: "Valeur 2 titre" },
    { key: "about_value_2_description", value: "Chaque euro investi doit rapporter. Tracking, analytics, ROI : on ne travaille pas à l'aveugle.", type: "text", section: "about", label: "Valeur 2 description" },
    { key: "about_value_3_label", value: "Zéro surprise", type: "text", section: "about", label: "Valeur 3 titre" },
    { key: "about_value_3_description", value: "Prix fixés dès le départ, livrables clairs, suivi en temps réel. Vous savez toujours où on en est.", type: "text", section: "about", label: "Valeur 3 description" },
  ];
  for (const c of aboutContent) {
    await prisma.siteContent.create({ data: c });
  }

  // ============================================================================
  // SITE CONTENT — CTA
  // ============================================================================
  console.log("→ SiteContent (cta)...");
  const ctaContent = [
    { key: "cta_title", value: "Un projet en tête ?", type: "text", section: "cta", label: "Titre CTA" },
    { key: "cta_description", value: "Premier échange gratuit, sans engagement. On vous répond sous 24h.", type: "text", section: "cta", label: "Description CTA" },
    { key: "cta_button", value: "Recevoir un devis gratuit", type: "text", section: "cta", label: "Bouton CTA" },
  ];
  for (const c of ctaContent) {
    await prisma.siteContent.create({ data: c });
  }

  // ============================================================================
  // SERVICES
  // ============================================================================
  console.log("→ Services...");
  const services = [
    {
      title: "Sites web",
      description: "Sites vitrines et applications web sur mesure. Design soigné, rapide, optimisé pour convertir.",
      iconUrl: "/images/services/icon-web.webp",
      sortOrder: 0,
    },
    {
      title: "Référencement Google",
      description: "Stratégie SEO complète. Contenu optimisé, suivi de positions et Google Search Console pour une visibilité durable.",
      iconUrl: "/images/services/icon-seo.webp",
      sortOrder: 1,
    },
    {
      title: "Outils digitaux",
      description: "Outils sur mesure pour automatiser vos tâches répétitives. Devis, relances, rapports : ce qui prenait des heures se fait en minutes.",
      iconUrl: "/images/services/icon-tools.webp",
      sortOrder: 2,
    },
  ];
  for (const s of services) {
    await prisma.service.create({ data: s });
  }

  // ============================================================================
  // PRICING TIERS — Oneshot
  // ============================================================================
  console.log("→ PricingTiers (oneshot)...");
  const oneshotTiers = [
    {
      name: "Vitrine Express",
      price: "890 €",
      priceNumeric: 890,
      priceLabel: "À partir de",
      priceSuffix: "\u00a0€",
      description: "Une landing page pro qui génère vos premiers contacts. Livrée en 1 semaine.",
      type: "oneshot",
      featured: false,
      sortOrder: 0,
      ctaLabel: "Démarrer mon projet",
      ctaUrl: "/contact",
      features: [
        "1 landing page responsive",
        "Design sur mesure (pas de template)",
        "Contenu rédigé pour vous (inclus)",
        "Formulaire de contact",
        "SEO technique complet",
        "2 tours de révisions inclus",
        "Livraison en 1 semaine",
      ],
    },
    {
      name: "Présence Pro",
      price: "2 290 €",
      priceNumeric: 2290,
      priceLabel: "À partir de",
      priceSuffix: "\u00a0€",
      description: "Site complet avec CMS et contenu rédigé. Pour être trouvé, crédible et convertir.",
      type: "oneshot",
      featured: true,
      sortOrder: 1,
      ctaLabel: "Choisir Présence Pro",
      ctaUrl: "/contact",
      features: [
        "3 à 5 pages responsive",
        "CMS : modifiez vos contenus en autonomie",
        "Contenu rédigé pour vous (inclus)",
        "SEO technique + Google Search Console",
        "Formation CMS (visio + guide écrit)",
        "3 tours de révisions inclus",
        "Livraison en 2 semaines",
      ],
    },
    {
      name: "Croissance Digitale",
      price: "3 990 €",
      priceNumeric: 3990,
      priceLabel: "À partir de",
      priceSuffix: "\u00a0€",
      description: "Site orienté résultats avec outil métier inclus et rapport de performance à 30 jours.",
      type: "oneshot",
      featured: false,
      sortOrder: 2,
      ctaLabel: "Choisir Croissance",
      ctaUrl: "/contact",
      features: [
        "5 à 8 pages responsive",
        "CMS avancé + formation 1h",
        "Contenu rédigé + copywriting conversion",
        "1 fonctionnalité métier incluse (blog, réservation…)",
        "SEO technique + stratégique (mots-clés)",
        "Rapport de performance à 30 jours",
        "Livraison en 3 semaines",
      ],
    },
  ];

  for (const tier of oneshotTiers) {
    const { features, ...tierData } = tier;
    const created = await prisma.pricingTier.create({ data: tierData });
    for (let i = 0; i < features.length; i++) {
      await prisma.pricingFeature.create({
        data: { tierId: created.id, text: features[i], included: true, sortOrder: i },
      });
    }
  }

  // ============================================================================
  // PRICING TIERS — Subscription
  // ============================================================================
  console.log("→ PricingTiers (subscription)...");
  const subscriptionTiers = [
    {
      name: "Essentiel",
      price: "49 €/mois",
      priceNumeric: 49,
      priceLabel: "",
      priceSuffix: "",
      description: "Votre site toujours à jour et sécurisé.",
      type: "subscription",
      featured: false,
      sortOrder: 0,
      ctaLabel: "Souscrire",
      ctaUrl: "/contact",
      features: [
        "Monitoring uptime + alertes",
        "Backups hebdomadaires",
        "Mises à jour de sécurité",
        "30 min de support email / mois",
        "Temps de réponse : 48h ouvrées",
      ],
    },
    {
      name: "Pro",
      price: "99 €/mois",
      priceNumeric: 99,
      priceLabel: "",
      priceSuffix: "",
      description: "Maintenance + modifications mensuelles et suivi trimestriel.",
      type: "subscription",
      featured: false,
      sortOrder: 1,
      ctaLabel: "Souscrire",
      ctaUrl: "/contact",
      features: [
        "Tout ce qui est dans Essentiel",
        "1h de modifications / mois",
        "Rapport trimestriel (trafic, performance)",
        "Temps de réponse : 24h ouvrées",
      ],
    },
  ];

  for (const tier of subscriptionTiers) {
    const { features, ...tierData } = tier;
    const created = await prisma.pricingTier.create({ data: tierData });
    for (let i = 0; i < features.length; i++) {
      await prisma.pricingFeature.create({
        data: { tierId: created.id, text: features[i], included: true, sortOrder: i },
      });
    }
  }

  // ============================================================================
  // TESTIMONIALS
  // ============================================================================
  console.log("→ Testimonials...");
  const testimonials = [
    {
      quote: "J'avais contacté trois agences avant et à chaque fois c'était flou sur les délais. Là, en deux semaines j'avais mon site en ligne. Simple, efficace, zéro prise de tête.",
      name: "Karim Hadj-Saïd",
      role: "Gérant",
      company: "KHS Import",
      initials: "KH",
      accentColor: "oklch(0.65 0.25 265)",
      featured: true,
      sortOrder: 0,
    },
    {
      quote: "Ce que j'ai apprécié c'est qu'on m'a pas vendu du rêve. Le devis était clair, le résultat correspond exactement à ce qu'on avait validé ensemble. Pas de surprise.",
      name: "Claire Dumont",
      role: "Fondatrice",
      company: "Atelier Bonne Maille",
      initials: "CD",
      accentColor: "oklch(0.55 0.22 290)",
      featured: true,
      sortOrder: 1,
    },
    {
      quote: "On est une petite équipe et on n'y connaissait rien en web. Ils nous ont tout expliqué, formés après la livraison, et même 3 mois après ils répondent encore à nos questions.",
      name: "Yuki Tanaka-Morel",
      role: "Cofondatrice",
      company: "Hanami Thérapies",
      initials: "YT",
      accentColor: "oklch(0.68 0.18 45)",
      featured: true,
      sortOrder: 2,
    },
  ];
  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  // ============================================================================
  // TEASER QUOTES
  // ============================================================================
  console.log("→ TeaserQuotes...");
  const teaserQuotes = [
    "« Un vrai gain de temps au quotidien »",
    "« Je recommande les yeux fermés »",
    "« Enfin un prestataire qui écoute »",
  ];
  for (let i = 0; i < teaserQuotes.length; i++) {
    await prisma.teaserQuote.create({ data: { text: teaserQuotes[i], sortOrder: i } });
  }

  // ============================================================================
  // COMMITMENTS
  // ============================================================================
  console.log("→ Commitments...");
  const commitments = [
    {
      title: "Livraison rapide",
      description: "Votre site est en ligne en 1 à 3 semaines selon la formule. Planning précis dès la signature.",
      iconUrl: "/images/icons/icon-timer.webp",
      sortOrder: 0,
    },
    {
      title: "Prix fixé, zéro surprise",
      description: "Le devis est définitif. Pas de frais cachés, pas de rallonge budget. Ce qui est signé est respecté.",
      iconUrl: "/images/icons/icon-contract.webp",
      sortOrder: 1,
    },
    {
      title: "Satisfait ou on corrige",
      description: "2 à 3 tours de révisions inclus selon la formule pour affiner le résultat.",
      iconUrl: "/images/icons/icon-shield.webp",
      sortOrder: 2,
    },
    {
      title: "Accompagnement inclus",
      description: "Formation et jusqu'à 45 jours de support post-lancement selon la formule choisie.",
      iconUrl: "/images/icons/icon-handshake.webp",
      sortOrder: 3,
    },
  ];
  for (const c of commitments) {
    await prisma.commitment.create({ data: c });
  }

  // ============================================================================
  // PROBLEMS
  // ============================================================================
  console.log("→ Problems...");
  const problems = [
    {
      stat: "5 000 €+",
      title: "Les agences coûtent trop cher",
      description: "C'est le prix moyen d'un site d'agence. Inaccessible pour la plupart des TPE, PME et indépendants.",
      iconUrl: "/images/icons/icon-euro.webp",
      sortOrder: 0,
    },
    {
      stat: "6 mois",
      title: "Le DIY, c'est souvent du temps perdu",
      description: "La plupart des sites faits maison finissent abandonnés. Wix, WordPress… sans expertise, le rendu reste amateur.",
      iconUrl: "/images/icons/icon-paintbrush.webp",
      sortOrder: 1,
    },
    {
      stat: "50+ salariés",
      title: "Les outils ciblent les grands comptes",
      description: "HubSpot, Salesforce… prix et complexité réservés aux entreprises de taille. Pas adapté à votre réalité.",
      iconUrl: "/images/icons/icon-buildings.webp",
      sortOrder: 2,
    },
  ];
  for (const p of problems) {
    await prisma.problem.create({ data: p });
  }

  // ============================================================================
  // FAQ
  // ============================================================================
  console.log("→ FaqItems...");
  const faqs = [
    {
      question: "Combien de temps faut-il pour créer un site ?",
      answer: "En moyenne 2 à 4 semaines, selon la complexité du projet. Un site vitrine simple peut être livré en 10 jours. Nous définissons un planning précis dès le démarrage.",
      category: "general",
      sortOrder: 0,
    },
    {
      question: "Quels sont vos tarifs ?",
      answer: "À partir de 890 € HT pour une landing page professionnelle (Vitrine Express). Le tarif dépend du nombre de pages, des fonctionnalités et du niveau de personnalisation. TVA non applicable, art. 293 B du CGI. Chaque devis est définitif, pas de frais cachés.",
      category: "pricing",
      sortOrder: 1,
    },
    {
      question: "Est-ce que le référencement Google est inclus ?",
      answer: "Le référencement (ou SEO) désigne l'ensemble des techniques pour que votre site apparaisse dans les premiers résultats Google. Oui, chaque site inclut une optimisation de base : balises, performance, structure. Pour aller plus loin (contenu, liens, suivi de positions), on propose un accompagnement dédié.",
      category: "technical",
      sortOrder: 2,
    },
    {
      question: "Je ne suis pas technique, c'est un problème ?",
      answer: "Pas du tout. On gère toute la partie technique. Vous n'avez qu'à fournir vos textes et images (on peut aussi s'en charger). Après livraison, on vous forme pour gérer votre site en autonomie.",
      category: "general",
      sortOrder: 3,
    },
    {
      question: "Que se passe-t-il après la livraison ?",
      answer: "Vous bénéficiez de 30 jours de support post-lancement inclus (corrections et ajustements mineurs). Ensuite, nos abonnements mensuels prennent le relais : maintenance technique et suivi de visibilité. Engagement minimum 3 mois, résiliable avec 30 jours de préavis.",
      category: "general",
      sortOrder: 4,
    },
    {
      question: "Travaillez-vous avec des clients hors de France ?",
      answer: "Oui, on travaille à distance avec des clients partout dans le monde. Nos échanges se font par visio, email et messagerie. Le fuseau horaire n'est jamais un frein.",
      category: "general",
      sortOrder: 5,
    },
  ];
  for (const f of faqs) {
    await prisma.faqItem.create({ data: f });
  }

  // ============================================================================
  // FOUNDER — Milestones
  // ============================================================================
  console.log("→ FounderMilestones...");
  const milestones = [
    { year: 2024, title: "Création de Mita Studio", description: "Lancement du studio avec une mission claire : rendre le digital pro accessible aux petites structures.", sortOrder: 0 },
    { year: 2024, title: "Premiers projets clients", description: "Sites web, SEO, outils sur mesure. Les premiers retours confirment l'approche.", sortOrder: 1 },
    { year: 2025, title: "Accélération", description: "Intégration de l'IA dans le processus de travail. Résultats plus rapides, coûts réduits pour les clients.", sortOrder: 2 },
  ];
  for (const m of milestones) {
    await prisma.founderMilestone.create({ data: m });
  }

  // ============================================================================
  // FOUNDER — Skills
  // ============================================================================
  console.log("→ FounderSkills...");
  const skills = [
    { title: "Développement web", description: "Next.js, React, TypeScript, Tailwind CSS", sortOrder: 0 },
    { title: "SEO & Contenu", description: "Audit SEO, stratégie de contenu, analytics", sortOrder: 1 },
    { title: "IA & Automatisation", description: "Workflows IA, outils métier sur mesure", sortOrder: 2 },
    { title: "Design UI/UX", description: "Interfaces modernes, responsive, centrées utilisateur", sortOrder: 3 },
  ];
  for (const s of skills) {
    await prisma.founderSkill.create({ data: s });
  }

  // ============================================================================
  // NAV ITEMS — Header
  // ============================================================================
  console.log("→ NavItems (header)...");
  const headerNav = [
    { label: "Services", href: "#services", location: "header", sortOrder: 0, external: false },
    { label: "Notre approche", href: "#process", location: "header", sortOrder: 1, external: false },
    { label: "Tarifs", href: "#pricing", location: "header", sortOrder: 2, external: false },
    { label: "Blog", href: "/blog", location: "header", sortOrder: 3, external: false },
  ];
  for (const n of headerNav) {
    await prisma.navItem.create({ data: n });
  }

  // ============================================================================
  // NAV ITEMS — Footer
  // ============================================================================
  console.log("→ NavItems (footer)...");
  const footerNavStudio = [
    { label: "Fondateur", href: "/fondateur", location: "footer_services", sortOrder: 0, external: false },
    { label: "Blog", href: "/blog", location: "footer_services", sortOrder: 1, external: false },
  ];
  const footerNavLegal = [
    { label: "Mentions légales", href: "/mentions-legales", location: "footer_legal", sortOrder: 0, external: false },
    { label: "CGV", href: "/cgv", location: "footer_legal", sortOrder: 1, external: false },
    { label: "Confidentialité", href: "/confidentialite", location: "footer_legal", sortOrder: 2, external: false },
  ];
  const footerNavSocial = [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/mita-studio", location: "footer_social", sortOrder: 0, external: true },
  ];
  for (const n of [...footerNavStudio, ...footerNavLegal, ...footerNavSocial]) {
    await prisma.navItem.create({ data: n });
  }

  // ============================================================================
  // ADMIN USER
  // ============================================================================
  console.log("→ AdminUser...");
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || "MitaAdmin2025!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: "tahina@mita-studio.com" },
    update: { passwordHash, active: true },
    create: {
      email: "tahina@mita-studio.com",
      name: "Tahina",
      passwordHash,
      role: "super_admin",
      active: true,
    },
  });
  console.log(`  Admin: tahina@mita-studio.com (password: ${adminPassword})`);

  console.log("\n✅ Seed complete! All data inserted.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
