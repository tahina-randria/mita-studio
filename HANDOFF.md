# HANDOFF — Migration CMS mita-studio

## Contexte
Migration de mita-studio.com : toutes les donnees hardcodees dans les composants React doivent venir de la base de donnees (Prisma + PostgreSQL Neon).

## Ce qui est FAIT
- **Schema Prisma** : 25+ models dans `prisma/schema.prisma`
- **Seed** : `prisma/seed.ts` avec toutes les valeurs actuelles
- **queries.ts** : `src/lib/queries.ts` — 10 fonctions de requetes avec `cache()`
- **page.tsx** : `src/app/(public)/page.tsx` — converti en server component async, fait Promise.all de 17 requetes, passe les props a tous les composants
- **JSON-LD** : genere dynamiquement depuis la DB

## CE QUI RESTE A FAIRE — Phase 4 Tasks 2-12

Convertir ces 11 composants clients pour accepter des props au lieu de tableaux hardcodes.
Le pattern est identique pour chaque composant :
1. Supprimer le tableau/constante hardcode et son interface TypeScript
2. Ajouter des props typees a la signature de la fonction
3. Remplacer les references aux constantes par les props
4. Renommer les champs si le schema DB differe (icon→iconUrl, cta→ctaLabel, ctaHref→ctaUrl)
5. Mettre a jour les `key` props de content-based a `id`-based
6. NE TOUCHER A AUCUNE ANIMATION GSAP

### Fichiers a convertir et changements exacts :

#### 1. ServicesSection.tsx (`src/app/(public)/_components/ServicesSection.tsx`)
- Supprimer interface Service + tableau SERVICES hardcode
- `export function ServicesSection()` → `export function ServicesSection({ services }: { services: { id: string; title: string; description: string; iconUrl: string | null }[] })`
- `SERVICES.map` → `services.map`
- `key={service.title}` → `key={service.id}`
- `src={service.icon}` → `src={service.iconUrl ?? ""}`

#### 2. ProblemSection.tsx (`src/app/(public)/_components/ProblemSection.tsx`)
- Supprimer interface Problem + tableau PROBLEMS hardcode
- Ajouter prop `{ problems }` type `{ id: string; stat: string; title: string; description: string; iconUrl: string | null }[]`
- `PROBLEMS.map` → `problems.map`
- `key={problem.title}` → `key={problem.id}`
- `src={problem.icon}` → `src={problem.iconUrl ?? ""}`

#### 3. HomeFAQSection.tsx (`src/app/(public)/_components/HomeFAQSection.tsx`)
- Supprimer interface FAQ + tableau FAQS hardcode
- Ajouter prop `{ faqs }` type `{ id: string; question: string; answer: string }[]`
- `FAQS.map` → `faqs.map`
- `key={faq.question}` → `key={faq.id}`

#### 4. TestimonialsSection.tsx (exporte CommitmentsSection) (`src/app/(public)/_components/TestimonialsSection.tsx`)
- Supprimer interface Commitment + tableau COMMITMENTS hardcode
- Ajouter prop `{ commitments }` type `{ id: string; title: string; description: string; iconUrl: string | null }[]`
- `COMMITMENTS.map` → `commitments.map`
- `key={c.title}` → `key={c.id}`
- `src={c.icon}` → `src={c.iconUrl ?? ""}`

#### 5. ClientTestimonialsSection.tsx (`src/app/(public)/_components/ClientTestimonialsSection.tsx`)
- Supprimer interface Testimonial + tableau TESTIMONIALS hardcode
- Supprimer tableau TEASER_QUOTES string[] hardcode
- Ajouter props `{ testimonials, teaserQuotes }` avec types :
  - testimonials: `{ id: string; quote: string; name: string; role: string; company: string; initials: string; accentColor: string }[]`
  - teaserQuotes: `{ id: string; text: string }[]`
- `TESTIMONIALS.map` → `testimonials.map`, `key={t.name}` → `key={t.id}`
- `TEASER_QUOTES.map` → `teaserQuotes.map`, `key={q}` → `key={q.id}`, `{q}` → `{q.text}`

#### 6. StudioHeader.tsx (`src/app/(public)/_components/StudioHeader.tsx`)
- Supprimer interface NavLink + tableau NAV_LINKS hardcode
- Ajouter prop `{ navLinks }` type `{ id: string; label: string; href: string; external: boolean }[]`
- `NAV_LINKS.map` → `navLinks.map` (2 endroits : desktop + mobile nav)
- `link.isRoute` → `!link.href.startsWith('#')` (pour le conditionnel Link vs button)

#### 7. StudioHeroSection.tsx (`src/app/(public)/_components/StudioHeroSection.tsx`)
- Ajouter prop `{ content }` type `Record<string, string>`
- `aria-label="Le digital pro, enfin accessible"` → `aria-label={content.title}`
- `text="Le digital pro, enfin accessible"` → `text={content.title}`
- Subtitle hardcode → `{content.subtitle}`
- CTA labels → `{content.cta_primary}` et `{content.cta_secondary}`
- Badges hardcodes → dynamiques depuis `content.badge_1_value`/`content.badge_1_label` (badges 1 a 3)

#### 8. StudioAboutSection.tsx (`src/app/(public)/_components/StudioAboutSection.tsx`)
- Supprimer interface Value + tableau VALUES + constante QUOTE_TEXT
- Ajouter prop `{ content }` type `Record<string, string>`
- `QUOTE_TEXT` → `content.quote`
- Bio paragraphes hardcodes → `{content.bio_1}` / `{content.bio_2}`
- VALUES array → dynamique depuis `content.value_1_label`/`content.value_1_description` (1 a 3)

#### 9. StudioCTASection.tsx (`src/app/(public)/_components/StudioCTASection.tsx`)
- Ajouter props `{ content, settings }` (tous deux `Record<string, string>`)
- `"Un projet en tete ?"` → `{content.title}`
- Description hardcodee → `{content.description}`
- `"Recevoir un devis gratuit"` → `{content.button}`
- `tahina@mita-studio.com` (href + texte) → `{settings.email}`

#### 10. StudioFooter.tsx (`src/app/(public)/_components/StudioFooter.tsx`)
- Supprimer objet FOOTER_LINKS hardcode
- Ajouter props `{ studioLinks, legalLinks, settings }` :
  - studioLinks/legalLinks: `{ id: string; label: string; href: string; external: boolean }[]`
  - settings: `Record<string, string>`
- LinkedIn URL hardcodee → `{settings.linkedin_url}`
- Deux groupes de nav depuis studioLinks et legalLinks
- Email hardcode → `{settings.email}`

#### 11. StudioPricingSection.tsx (`src/app/(public)/_components/StudioPricingSection.tsx`) — LE PLUS COMPLEXE
- Supprimer interfaces PricingTier + SubscriptionTier + tableaux PRICING_TIERS + SUBSCRIPTION_TIERS
- Ajouter props `{ pricingTiers, subscriptionTiers }` avec types Prisma (inclut features[])
- `PRICING_TIERS.forEach/map/findIndex` → `pricingTiers.*`
- `SUBSCRIPTION_TIERS.map` → `subscriptionTiers.map`
- Renommages : `tier.cta` → `tier.ctaLabel`, `tier.ctaHref` → `tier.ctaUrl`, `sub.ctaHref` → `sub.ctaUrl`
- Features : etait `string[]` → maintenant `{ id: string; text: string; included: boolean }[]`
- `key={feature}` → `key={feature.id}`, `{feature}` → `{feature.text}`
- Adapter le composant PriceDisplay interne

## Apres les conversions
- `npm run build` pour verifier que tout compile
- Commit et push

## Commandes utiles
```bash
# Pour Prisma (les .env ont des quotes qui posent probleme)
DATABASE_URL=$(grep '^DATABASE_URL=' .env.production.local | sed 's/^DATABASE_URL=//' | tr -d '"') && export DATABASE_URL
npx prisma generate
npx prisma db push

# Build
npm run build
```

## Notes importantes
- Working directory : `/Users/tahina/Downloads/mita-studio-deploy`
- NE PAS toucher au repo github.com/tahina-randria/mita
- Prisma 7 : config dans `prisma.config.ts` (pas dans schema.prisma)
- Toutes les animations GSAP doivent rester intactes
- `page.tsx` passe deja TOUTES les props — il suffit de modifier les composants pour les accepter
