// ────────────────────────────────────────────────────────────────────────────
// PAGES LÉGALES — Fichier séparé du blog
// ────────────────────────────────────────────────────────────────────────────

export interface LegalArticle {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  tldr: string[];
  content: string;
}

const LEGAL_ARTICLES: LegalArticle[] = [
  // ── MENTIONS LÉGALES ─────────────────────────────────────────────────────
  {
    slug: "mentions-legales",
    title: "Mentions légales",
    description:
      "Mentions légales du site mita-studio.com conformément à la loi LCEN du 21 juin 2004.",
    date: "2026-03-12",
    readingTime: "3 min",
    tldr: [
      "Éditeur : Tahina Randrianandraina (Mita Studio), titulaire du CAPE n°C1538 (échéant le 28/02/2027) auprès de PCE.",
      "SIRET 423 194 307 00090 · APE 9499Z · TVA 20 %. RCP multiactivité AXA (contrat 1353589504).",
      "Hébergement : Vercel Inc. Aucun cookie publicitaire, de traçage ou d'analyse.",
    ],
    content: `Conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN), voici les informations légales relatives au site mita-studio.com.

## 1. Éditeur du site

- **Nom** : Tahina Randrianandraina
- **Nom commercial** : Mita Studio
- **Statut** : Titulaire d'un Contrat d'Appui au Projet d'Entreprise (CAPE), conformément aux articles L127-1 à L127-7 du Code de commerce
- **Structure d'appui** : PCE, Société Coopérative Ouvrière de Production par Actions Simplifiée (SCOP AS) à Capital Variable
- **Site PCE** : [pce-couveuse.fr](https://www.pce-couveuse.fr)
- **Adresse** : 6 Rue d'Amboise, 75002 Paris
- **SIRET** : 423 194 307 00090
- **SIREN / RCS** : 423 194 307
- **Code APE / NAF** : 9499Z
- **N° TVA intracommunautaire** : FR82423194307
- **CAPE** : Contrat n°C1538, échéant le 28/02/2027
- **TVA** : 20 % (taux normal)
- **Directeur de la publication** : Tahina Randrianandraina
- **Email** : tahina@mita-studio.com
- **Site web** : [mita-studio.com](https://mita-studio.com)

## 2. Assurance responsabilité civile professionnelle

- **Assureur** : AXA, Contrat multiactivité professionnelle
- **N° client** : 0693499104
- **N° contrat** : 1353589504

## 3. Hébergeur

- **Raison sociale** : Vercel Inc.
- **Adresse** : 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis
- **Site web** : [vercel.com](https://vercel.com)

## 4. Propriété intellectuelle

L'ensemble du contenu du site mita-studio.com (textes, images, graphismes, logo, icônes, code source) est la propriété exclusive de Mita Studio ou fait l'objet d'une autorisation d'utilisation. Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sauf autorisation écrite préalable.

## 5. Protection des données personnelles

Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez de droits sur vos données personnelles. Pour en savoir plus, consultez notre [Politique de Confidentialité](/confidentialite).

## 6. Cookies

Le site utilise uniquement des cookies strictement nécessaires au fonctionnement technique (aucun cookie publicitaire, de traçage ou d'analyse). Aucune donnée personnelle n'est collectée via les cookies.

## 7. Limitation de responsabilité

Mita Studio s'efforce de fournir des informations précises et à jour sur ce site. Toutefois, les informations diffusées sur le site ne sauraient prétendre à l'exhaustivité. Mita Studio ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation du site ou de l'impossibilité d'y accéder.

Les sites web et outils digitaux créés par Mita Studio pour ses clients sont livrés conformément au devis validé. La responsabilité de Mita Studio est limitée au montant de la prestation facturée.

## 8. Contact

Pour toute question, contactez-nous à l'adresse **tahina@mita-studio.com**.`,
  },

  // ── CONDITIONS GÉNÉRALES DE VENTE ────────────────────────────────────────
  {
    slug: "conditions-generales-de-vente",
    title: "Conditions Générales de Vente",
    description:
      "Conditions générales de vente des prestations de Mita Studio, entrepreneur accompagné par PCE dans le cadre d'un CAPE : création de sites web, référencement Google et outils digitaux.",
    date: "2026-03-12",
    readingTime: "18 min",
    tldr: [],
    content: `Dernière mise à jour : 12 mars 2026

Les présentes Conditions Générales de Vente (ci-après « CGV ») régissent l'ensemble des prestations de services proposées par Mita Studio à ses clients. Toute commande implique l'acceptation sans réserve des présentes CGV.

## 1. Définitions

- **Prestataire** : Tahina Randrianandraina, exerçant sous le nom commercial Mita Studio, entrepreneur accompagné par PCE dans le cadre d'un CAPE.
- **Client** : Toute personne physique ou morale commandant une prestation auprès du Prestataire.
- **Projet** : L'ensemble des prestations définies dans le devis signé.
- **Livrables** : Les éléments produits par le Prestataire dans le cadre du Projet (site web, contenus, fichiers sources, etc.).
- **Devis** : Le document détaillant la nature, le périmètre, le prix et les délais de la prestation.
- **Révision** : Un tour de modifications dans le périmètre défini au devis (changement de texte, couleur, photo, réorganisation de sections).
- **Modification** : Tout changement hors périmètre du devis (ajout de page, nouvelle fonctionnalité, refonte du design).
- **Recette** : La phase de validation finale des livrables par le Client.
- **Support** : La période d'assistance post-livraison incluse dans le package.
- **Maintenance** : Le contrat de suivi mensuel optionnel, distinct du support post-livraison.

## 2. Identification du prestataire

- **Prestataire** : Tahina Randrianandraina, exerçant sous le nom commercial Mita Studio
- **Statut** : Titulaire d'un Contrat d'Appui au Projet d'Entreprise (CAPE)
- **CAPE** : Contrat n°C1538, échéant le 28/02/2027
- **Structure d'appui** : PCE, Société Coopérative Ouvrière de Production par Actions Simplifiée (SCOP AS) à Capital Variable
- **Site PCE** : [pce-couveuse.fr](https://www.pce-couveuse.fr)
- **Adresse** : 6 Rue d'Amboise, 75002 Paris
- **SIRET** : 423 194 307 00090
- **SIREN/RCS** : 423 194 307
- **Code APE/NAF** : 9499Z
- **N° TVA intracommunautaire** : FR82423194307
- **Assurance RCP** : Contrat multiactivité professionnelle AXA, N° client 0693499104, N° contrat 1353589504
- **Email** : tahina@mita-studio.com
- **Site web** : [mita-studio.com](https://mita-studio.com)

## 3. Objet

Les présentes CGV régissent les relations entre Mita Studio et ses clients pour toute prestation de création de sites web, développement, intégration, et services numériques associés. Le détail exact de chaque prestation est formalisé dans le devis, qui prévaut sur les descriptions générales ci-dessous.

## 4. Détail des prestations

Mita Studio propose des prestations de services digitaux organisées en trois formules :

### Formule Vitrine Express : 890 € HT

- 1 landing page responsive (design sur mesure, pas de template)
- Contenu rédigé pour le client (inclus)
- Formulaire de contact intégré
- SEO technique complet (balises, sitemap, données structurées)
- Google Analytics 4 configuré
- Hébergement Vercel configuré au nom du client
- 2 tours de révisions inclus
- 15 jours de support email post-livraison
- Livraison en 1 semaine (sous réserve de réception des éléments nécessaires)

### Formule Présence Pro : 2 290 € HT (Recommandé)

- 3 à 5 pages responsive (design sur mesure)
- CMS headless : le client modifie ses contenus en autonomie
- Contenu rédigé pour le client (inclus)
- SEO technique complet + Google Search Console
- Jusqu'à 2 formulaires de contact
- Formation CMS (visio 30-45 min enregistrée + guide écrit)
- 3 tours de révisions inclus
- 30 jours de support email post-livraison
- Livraison en 2 semaines (sous réserve de réception des éléments nécessaires)

### Formule Croissance Digitale : 3 990 € HT

- 5 à 8 pages responsive (design sur mesure)
- CMS avancé avec modèles de contenu adaptés au métier
- Contenu rédigé + copywriting orienté conversion (inclus)
- SEO technique + stratégique (recherche de mots-clés)
- 1 fonctionnalité métier incluse au choix (blog, réservation, espace client ou catalogue)
- Jusqu'à 3 formulaires + Google Analytics 4 avec événements de conversion
- Formation CMS (visio 1h enregistrée + guide écrit)
- Rapport de performance à 30 jours (inclus) + call de restitution
- 3 tours de révisions inclus
- 45 jours de support post-livraison
- Livraison en 3 semaines (sous réserve de réception des éléments nécessaires)

### Add-ons (optionnels)

- Page supplémentaire : 290 € HT
- Blog complet : 590 € HT
- Système de réservation : 790 € HT
- Espace client / portail : 990 € HT
- E-commerce simple (jusqu'à 50 produits) : 1 490 € HT
- Identité visuelle (logo + charte) : 490 € HT
- Rédaction de contenu : 150 € HT / page
- Rapport de performance 30 jours : 190 € HT (si non inclus dans le package)

### Abonnements de maintenance (optionnels)

**Essentiel : 49 € HT/mois**
- Monitoring uptime + alertes
- Backups hebdomadaires
- Mises à jour de sécurité
- 30 min de support email / mois
- Temps de réponse : 48h ouvrées

**Pro : 99 € HT/mois**
- Tout ce qui est inclus dans Essentiel
- 1h de modifications / mois (textes, images, petits ajustements)
- Rapport trimestriel (trafic, performance, recommandations)
- Temps de réponse : 24h ouvrées

Les abonnements de maintenance sont souscrits pour un engagement minimum de 3 mois, résiliables avec un préavis de 30 jours. Les heures non utilisées ne sont pas reportables. Au-delà du quota mensuel, facturation au tarif de 90 € HT/heure.

Les tarifs indiqués sont en euros (EUR) hors taxes. TVA au taux de 20 % en sus.

## 5. Devis et commande

Chaque prestation fait l'objet d'un devis personnalisé, détaillant la nature et le périmètre de la prestation, le prix en euros HT, le délai de livraison estimé et le nombre de révisions incluses.

Le devis est valable 30 jours à compter de sa date d'émission. Le devis signé constitue un engagement ferme des deux parties. Tout projet démarre après réception de l'acompte.

Conformément aux articles 1366 et 1367 du Code civil, la signature électronique du devis (ou l'acceptation par email avec mention explicite d'accord) a la même valeur juridique qu'une signature manuscrite.

## 6. Prix et paiement

- **Échéancier** : 30 % acompte à la signature, 40 % à la validation du design, 30 % à la livraison
- **Moyens de paiement** : virement bancaire ou Stripe
- **Délai de paiement** : 14 jours à compter de la date de facturation

Les prix s'entendent hors taxes. La TVA au taux de 20 % est appliquée conformément à la législation en vigueur.

Les factures sont émises via Pennylane, logiciel de facturation agréé, conformément à la réglementation en vigueur.

## 7. Acompte

L'acompte de 30 % est exigible à la signature du devis. Il déclenche le démarrage effectif du projet. L'acompte n'est pas remboursable, sauf accord exprès écrit du Prestataire.

## 8. Retard de paiement

En cas de retard de paiement, des pénalités de retard seront appliquées au taux directeur de la Banque Centrale Européenne majoré de 10 points, ainsi qu'une indemnité forfaitaire de 40 € pour frais de recouvrement (art. L441-10 du Code de commerce).

Le Prestataire se réserve le droit de suspendre les travaux en cours après mise en demeure restée infructueuse pendant 8 jours.

## 9. Délais et planning

Les délais indicatifs sont les suivants :

- **Vitrine Express** : 1 semaine (5 jours ouvrés)
- **Présence Pro** : 2 semaines (10 jours ouvrés)
- **Croissance Digitale** : 3 semaines (15 jours ouvrés)

Le délai court à compter de la réception de l'acompte et de l'ensemble des éléments nécessaires. Tout retard du Client dans la fourniture des éléments (contenus, retours, validations) repousse d'autant le délai de livraison. Les cas de force majeure entraînent la suspension du planning sans pénalité.

## 10. Obligations du client

Le Client s'engage à :

- Fournir les éléments nécessaires au bon déroulement du projet (informations sur son activité, accès au nom de domaine, photos si disponibles)
- Désigner un interlocuteur unique pour centraliser les échanges
- Répondre aux sollicitations du Prestataire sous 5 jours ouvrés
- Valider les étapes clés (design, contenu, recette) dans les délais convenus au devis

## 11. Révisions et modifications

Le nombre de tours de révisions est défini dans le devis : **2 tours pour Vitrine Express**, **3 tours pour Présence Pro et Croissance Digitale**.

Un tour de révision consiste en un envoi consolidé de l'ensemble des retours du Client (document écrit ou email structuré). Le Client dispose de 5 jours ouvrés après chaque présentation pour envoyer ses retours.

Constituent une révision : les changements de couleur, de photo, de texte, ou la réorganisation de sections existantes.

Ne constituent pas une révision : l'ajout d'une page, l'ajout d'une fonctionnalité, la refonte du design. Ces demandes feront l'objet d'un devis complémentaire.

Au-delà des tours inclus, chaque tour supplémentaire est facturé selon la formule choisie (de 150 € à 250 € HT par tour).

## 12. Modification du périmètre

Tout changement de périmètre par rapport au devis initial nécessite un avenant écrit signé par les deux parties. Le devis complémentaire correspondant doit être accepté et l'acompte versé avant exécution. Les délais sont ajustés en conséquence.

## 13. Validation et recette

Le Client dispose de 7 jours ouvrés pour valider chaque livrable présenté. L'absence de retour au-delà de ce délai vaut acceptation tacite.

La livraison finale fait l'objet d'un procès-verbal de recette signé par le Client. Ce PV atteste de la conformité des livrables au devis et déclenche la facturation du solde.

## 14. Propriété intellectuelle

Le transfert intégral des droits de propriété intellectuelle sur les livrables est effectué au profit du Client après paiement complet de l'ensemble des sommes dues.

Les outils, frameworks et librairies open-source utilisés (Next.js, Tailwind CSS, etc.) restent sous leur licence respective. Le Prestataire conserve le droit d'utiliser des composants génériques développés dans le cadre du projet pour d'autres réalisations.

Le code source est transféré au Client après paiement intégral.

## 15. Confidentialité

Les parties s'engagent mutuellement à une obligation de confidentialité portant sur l'ensemble des informations échangées dans le cadre du projet. Cette obligation de confidentialité perdure pendant une durée de 2 ans après la fin du projet.

## 16. Données personnelles / RGPD

Dans le cadre de l'exécution de ses prestations, Mita Studio est susceptible de collecter et traiter des données personnelles du Client (nom, prénom, adresse email, téléphone, adresse postale).

Ces données sont collectées et traitées conformément au Règlement Général sur la Protection des Données (RGPD, Règlement UE 2016/679) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée. Elles sont utilisées aux seules fins d'exécution du contrat et de gestion de la relation commerciale.

Le Client est responsable du traitement des données personnelles collectées via son propre site web. Le Prestataire peut conseiller sur la conformité mais n'agit pas en qualité de Délégué à la Protection des Données (DPO).

Les données du Client ne sont jamais revendues ni transmises à des tiers à des fins commerciales. Le Client dispose d'un droit d'accès, de rectification, d'effacement, de limitation, de portabilité et d'opposition sur ses données personnelles. Contact : **tahina@mita-studio.com**.

Pour plus de détails, consultez notre [Politique de Confidentialité](/confidentialite).

## 17. Limitation de responsabilité

Mita Studio s'engage à exécuter ses prestations avec diligence et professionnalisme (obligation de moyens). Mita Studio est couvert par une assurance Responsabilité Civile Professionnelle multiactivité auprès d'AXA (N° contrat 1353589504).

La responsabilité du Prestataire est plafonnée au montant total du devis. Sont exclus les dommages indirects : perte de chiffre d'affaires, perte de données, manque à gagner.

Le Prestataire n'est pas responsable des contenus fournis par le Client, des performances de référencement (dépendant de facteurs externes), des interruptions de service liées à l'hébergeur ou à des tiers, ni de l'usage fait du site par le Client après livraison.

## 18. Résiliation

Chaque partie peut résilier le contrat avec un préavis de 15 jours, par courrier ou email avec accusé de réception.

En cas de résiliation en cours de prestation, le travail réalisé est facturé au prorata. Les acomptes versés restent acquis au Prestataire. Le code source produit est livré au Client, même en cas de résiliation.

## 19. Force majeure

Aucune des parties ne pourra être tenue responsable de l'inexécution ou du retard dans l'exécution de ses obligations si cela résulte d'un cas de force majeure au sens de l'article 1218 du Code civil.

La partie affectée informera l'autre partie dans les meilleurs délais. Si le cas de force majeure se prolonge au-delà de 30 jours, chacune des parties pourra résilier le contrat sans indemnité, le Client étant remboursé des sommes versées pour les prestations non encore exécutées.

## 20. Sous-traitance

Le Prestataire peut faire appel à des sous-traitants pour l'exécution de tout ou partie des prestations. Le Client en est informé sur demande. Le Prestataire reste seul responsable de la qualité des livrables vis-à-vis du Client.

## 21. Hébergement

L'hébergement du site est configuré au nom du Client sur la plateforme Vercel. Le coût d'hébergement est à la charge du Client si l'utilisation dépasse le tier gratuit de l'hébergeur.

Le Prestataire recommande l'hébergeur mais ne garantit pas sa disponibilité ni ses performances, celles-ci relevant de la responsabilité de l'hébergeur.

## 22. Maintenance

La maintenance n'est pas incluse dans les prestations de création, sauf mention expresse dans le devis. Un contrat de maintenance séparé peut être souscrit (cf. article 4). Sans contrat de maintenance, le Prestataire n'assure pas les mises à jour ni le suivi technique post-livraison au-delà de la période de support incluse.

## 23. Portfolio et référence

Le Prestataire peut utiliser le projet réalisé comme référence dans son portfolio et ses supports de communication. Le Client peut s'y opposer par demande écrite adressée à **tahina@mita-studio.com**.

## 24. Droit de rétractation

Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les prestations de services pleinement exécutées avant la fin du délai de rétractation, avec l'accord exprès du Client.

Pour les prestations non encore commencées, le Client dispose d'un délai de 14 jours pour exercer son droit de rétractation. L'acompte versé sera alors intégralement remboursé.

## 25. Non-validation partielle

Si l'une quelconque des dispositions des présentes CGV était déclarée nulle ou inapplicable par une juridiction compétente, les autres dispositions resteraient en vigueur et de plein effet.

## 26. Droit applicable et médiation

Les présentes CGV sont régies par le droit français.

En cas de litige, les parties s'engagent à rechercher une solution amiable pendant 30 jours avant toute action judiciaire.

Conformément aux articles L611-1 et suivants du Code de la consommation, le Client consommateur a le droit de recourir gratuitement à un médiateur de la consommation :

- **Centre de la Médiation de la Consommation de Conciliateurs de Justice (CM2C)**
- Site web : [cm2c.net](https://www.cm2c.net)
- Adresse : 14 rue Saint-Jean-de-Beauregard, 91400 Orsay

Le Client peut également soumettre sa réclamation sur la plateforme européenne de règlement en ligne des litiges : [ec.europa.eu/consumers/odr](https://ec.europa.eu/consumers/odr).

À défaut de résolution amiable ou de médiation aboutie, les tribunaux compétents de Paris (France) seront seuls compétents.

## 27. Contact

Pour toute question relative aux présentes CGV, contactez-nous à l'adresse **tahina@mita-studio.com**.`,
  },

  // ── POLITIQUE DE CONFIDENTIALITÉ ─────────────────────────────────────────
  {
    slug: "politique-de-confidentialite",
    title: "Politique de Confidentialité",
    description:
      "Politique de confidentialité et protection des données personnelles de Mita Studio, conforme au RGPD.",
    date: "2026-03-12",
    readingTime: "6 min",
    tldr: [
      "Responsable : Tahina Randrianandraina (Mita Studio), CAPE n°C1538 auprès de PCE. SIRET 423 194 307 00090.",
      "Seules les données du formulaire de contact sont collectées. Aucun cookie publicitaire, aucun tracking, aucune revente.",
      "Droits RGPD (accès, rectification, effacement, portabilité) : tahina@mita-studio.com.",
    ],
    content: `Dernière mise à jour : 12 mars 2026

La présente Politique de Confidentialité décrit comment **Mita Studio** collecte, utilise et protège vos données personnelles lorsque vous utilisez le site mita-studio.com.

## 1. Responsable du traitement

Le responsable du traitement des données est :

- **Nom** : Tahina Randrianandraina
- **Nom commercial** : Mita Studio
- **Statut** : Titulaire d'un Contrat d'Appui au Projet d'Entreprise (CAPE)
- **CAPE** : Contrat n°C1538, échéant le 28/02/2027
- **Structure d'appui** : PCE, Société Coopérative Ouvrière de Production par Actions Simplifiée (SCOP AS) à Capital Variable
- **Site PCE** : [pce-couveuse.fr](https://www.pce-couveuse.fr)
- **Adresse** : 6 Rue d'Amboise, 75002 Paris
- **SIRET** : 423 194 307 00090
- **Code APE / NAF** : 9499Z
- **Email de contact** : tahina@mita-studio.com

## 2. Données collectées

### a) Données du formulaire de contact

Lorsque vous nous contactez via le formulaire du site, nous collectons :

- Nom complet
- Adresse email
- Numéro de téléphone (facultatif)
- Nom d'entreprise (facultatif)
- Service souhaité et budget envisagé
- Message décrivant votre projet

### b) Données techniques

Des données techniques minimales sont automatiquement collectées par l'hébergeur (Vercel) :

- Adresse IP (anonymisée)
- Pages visitées
- Type de navigateur et système d'exploitation

**Important** : nous n'utilisons aucun outil d'analyse (pas de Google Analytics, pas de Matomo, pas de pixel Facebook). Aucune donnée de navigation n'est collectée à des fins marketing.

## 3. Finalité et base légale du traitement

- **Répondre à vos demandes de contact** : intérêt légitime (art. 6.1.f RGPD)
- **Établir et envoyer des devis** : exécution de mesures précontractuelles (art. 6.1.b RGPD)
- **Assurer le fonctionnement technique du site** : intérêt légitime (art. 6.1.f RGPD)

## 4. Durée de conservation

- **Données de contact** : conservées pendant 3 ans après le dernier échange, puis supprimées
- **Données de facturation** : conservées pendant 10 ans conformément aux obligations comptables
- **Logs techniques** : conservés 12 mois maximum par l'hébergeur

## 5. Sous-traitants et partenaires

Nous faisons appel aux sous-traitants suivants :

- **Vercel** (hébergement et diffusion CDN), États-Unis, certifié EU-U.S. Data Privacy Framework
- **Resend** (envoi d'emails transactionnels), États-Unis, Clauses Contractuelles Types

Aucune donnée n'est vendue, louée ou partagée avec des tiers à des fins commerciales.

## 6. Transferts internationaux de données

Certaines données sont transférées vers les États-Unis (Vercel, Resend). Ces transferts sont encadrés par :

- Les **Clauses Contractuelles Types (CCT)** de la Commission européenne
- Le cadre **EU-U.S. Data Privacy Framework** lorsque le sous-traitant est certifié
- Le chiffrement des données en transit (HTTPS/TLS)

## 7. Cookies

Le site mita-studio.com **n'utilise aucun cookie publicitaire, de traçage ou d'analyse**. Aucun bandeau cookies n'est nécessaire.

Seuls des cookies strictement techniques peuvent être déposés par l'hébergeur pour le fonctionnement du site (protection DDoS, routage). Ces cookies sont exemptés de consentement conformément à la directive ePrivacy.

## 8. Vos droits

Conformément au RGPD, vous disposez des droits suivants :

- **Droit d'accès** : obtenir une copie de vos données personnelles
- **Droit de rectification** : corriger des données inexactes ou incomplètes
- **Droit à l'effacement** : demander la suppression de vos données
- **Droit à la portabilité** : recevoir vos données dans un format structuré
- **Droit d'opposition** : vous opposer au traitement de vos données
- **Droit à la limitation** : demander la limitation du traitement

Pour exercer vos droits, contactez-nous à **tahina@mita-studio.com**. Nous répondrons dans un délai de 30 jours maximum.

## 9. Réclamation

Vous avez le droit d'introduire une réclamation auprès de la **CNIL** (Commission Nationale de l'Informatique et des Libertés) : [www.cnil.fr](https://www.cnil.fr).

## 10. Mise à jour

Nous nous réservons le droit de modifier la présente Politique de Confidentialité à tout moment. La date de dernière mise à jour est indiquée en haut de cette page.`,
  },
];

// ────────────────────────────────────────────────────────────────────────────
// Helper functions
// ────────────────────────────────────────────────────────────────────────────

export function getLegalArticle(slug: string): LegalArticle | undefined {
  return LEGAL_ARTICLES.find((a) => a.slug === slug);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
