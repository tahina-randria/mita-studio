import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

// ============================================================================
// HELPER — consistent inline styles for email body content
// ============================================================================

const s = {
  h1: 'style="margin:0 0 16px;font-size:22px;font-weight:700;color:#0a0a0a;line-height:1.3;"',
  h2: 'style="margin:24px 0 12px;font-size:18px;font-weight:600;color:#0a0a0a;line-height:1.4;"',
  p: 'style="margin:0 0 16px;font-size:15px;color:#3f3f46;line-height:1.7;"',
  pLast: 'style="margin:0;font-size:15px;color:#3f3f46;line-height:1.7;"',
  strong: 'style="color:#0a0a0a;font-weight:600;"',
  btn: 'style="display:inline-block;padding:12px 28px;background-color:#0a0a0a;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;margin:8px 0 16px;"',
  btnOutline: 'style="display:inline-block;padding:12px 28px;border:2px solid #0a0a0a;color:#0a0a0a;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;margin:8px 0 16px;"',
  divider: 'style="border:0;border-top:1px solid #e4e4e7;margin:24px 0;"',
  muted: 'style="margin:0 0 16px;font-size:13px;color:#71717a;line-height:1.6;"',
  ul: 'style="margin:0 0 16px;padding-left:20px;font-size:15px;color:#3f3f46;line-height:1.8;"',
  badge: 'style="display:inline-block;padding:4px 12px;background-color:#f4f4f5;color:#3f3f46;font-size:13px;font-weight:500;border-radius:6px;margin:0 4px 4px 0;"',
  highlight: 'style="background-color:#fef9c3;padding:16px 20px;border-radius:8px;margin:0 0 16px;"',
};

// ============================================================================
// 15 TEMPLATES
// ============================================================================

interface TemplateData {
  name: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  variables: string[];
}

const templates: TemplateData[] = [
  // ─── T01 : Accusé de réception ──────────────────────────────────
  {
    name: "accuse_reception",
    subject: "Merci {{prenom}} ! Votre demande est bien reçue",
    htmlBody: `<h1 ${s.h1}>Merci {{prenom}}, message bien reçu !</h1>
<p ${s.p}>Nous avons bien enregistré votre demande et nous y répondons <strong ${s.strong}>sous 24h ouvrées</strong>.</p>
<p ${s.p}>En attendant, voici un récapitulatif :</p>
<ul ${s.ul}>
  <li><strong ${s.strong}>Service :</strong> {{service}}</li>
  <li><strong ${s.strong}>Budget :</strong> {{budget}}</li>
  <li><strong ${s.strong}>Message :</strong> {{message}}</li>
</ul>
<hr ${s.divider}>
<p ${s.pLast}>À très vite,<br><strong ${s.strong}>Tahina — Mita Studio</strong></p>`,
    textBody: `Merci {{prenom}}, message bien reçu !

Nous avons bien enregistré votre demande et nous y répondons sous 24h ouvrées.

Récapitulatif :
- Service : {{service}}
- Budget : {{budget}}
- Message : {{message}}

À très vite,
Tahina — Mita Studio`,
    variables: ["prenom", "nom", "email", "service", "budget", "message"],
  },

  // ─── T02 : Premier contact admin ──────────────────────────────────
  {
    name: "premier_contact",
    subject: "{{prenom}}, je reviens vers vous",
    htmlBody: `<h1 ${s.h1}>Bonjour {{prenom}},</h1>
<p ${s.p}>Merci pour votre intérêt pour Mita Studio. J'ai bien pris connaissance de votre demande concernant <strong ${s.strong}>{{service}}</strong>.</p>
<p ${s.p}>J'aimerais en discuter avec vous pour mieux comprendre votre projet et vos objectifs. Seriez-vous disponible pour un appel de 15 minutes cette semaine ?</p>
<a href="https://calendly.com/tahina-mitastudio/15min" ${s.btn}>Réserver un créneau</a>
<p ${s.p}>Si vous préférez échanger par email, n'hésitez pas à me répondre directement.</p>
<hr ${s.divider}>
<p ${s.pLast}>À bientôt,<br><strong ${s.strong}>{{admin_name}} — Mita Studio</strong></p>`,
    textBody: `Bonjour {{prenom}},

Merci pour votre intérêt pour Mita Studio. J'ai bien pris connaissance de votre demande concernant {{service}}.

J'aimerais en discuter avec vous pour mieux comprendre votre projet et vos objectifs. Seriez-vous disponible pour un appel de 15 minutes cette semaine ?

Réserver un créneau : https://calendly.com/tahina-mitastudio/15min

Si vous préférez échanger par email, n'hésitez pas à me répondre directement.

À bientôt,
{{admin_name}} — Mita Studio`,
    variables: ["prenom", "nom", "service", "admin_name"],
  },

  // ─── T03 : Relance J+3 ──────────────────────────────────
  {
    name: "relance_j3",
    subject: "{{prenom}}, avez-vous eu le temps de réfléchir ?",
    htmlBody: `<h1 ${s.h1}>Bonjour {{prenom}},</h1>
<p ${s.p}>Je me permets de revenir vers vous suite à votre demande il y a quelques jours concernant <strong ${s.strong}>{{service}}</strong>.</p>
<p ${s.p}>Avez-vous eu le temps d'y réfléchir ? Je reste disponible pour répondre à vos questions ou planifier un échange rapide.</p>
<a href="https://calendly.com/tahina-mitastudio/15min" ${s.btn}>Planifier un appel</a>
<p ${s.pLast}>Bonne journée,<br><strong ${s.strong}>Tahina — Mita Studio</strong></p>`,
    textBody: `Bonjour {{prenom}},

Je me permets de revenir vers vous suite à votre demande il y a quelques jours concernant {{service}}.

Avez-vous eu le temps d'y réfléchir ? Je reste disponible pour répondre à vos questions ou planifier un échange rapide.

Planifier un appel : https://calendly.com/tahina-mitastudio/15min

Bonne journée,
Tahina — Mita Studio`,
    variables: ["prenom", "service"],
  },

  // ─── T04 : Relance J+5 ──────────────────────────────────
  {
    name: "relance_j5",
    subject: "{{prenom}}, on en parle ?",
    htmlBody: `<h1 ${s.h1}>{{prenom}}, un petit point rapide ?</h1>
<p ${s.p}>Je reviens vers vous une dernière fois au sujet de votre projet <strong ${s.strong}>{{service}}</strong>.</p>
<p ${s.p}>Si vous avez des questions, des doutes ou si le timing n'est pas le bon — dites-le-moi simplement. Je préfère une réponse honnête plutôt que du silence 😊</p>
<p ${s.p}>Un simple "pas maintenant" me convient parfaitement.</p>
<hr ${s.divider}>
<p ${s.pLast}>À bientôt,<br><strong ${s.strong}>Tahina — Mita Studio</strong></p>`,
    textBody: `{{prenom}}, un petit point rapide ?

Je reviens vers vous une dernière fois au sujet de votre projet {{service}}.

Si vous avez des questions, des doutes ou si le timing n'est pas le bon — dites-le-moi simplement. Je préfère une réponse honnête plutôt que du silence.

Un simple "pas maintenant" me convient parfaitement.

À bientôt,
Tahina — Mita Studio`,
    variables: ["prenom", "service"],
  },

  // ─── T05 : Relance J+7 (dernière) ──────────────────────────────────
  {
    name: "relance_j7",
    subject: "Dernière nouvelle de ma part, {{prenom}}",
    htmlBody: `<h1 ${s.h1}>Bonjour {{prenom}},</h1>
<p ${s.p}>C'est mon dernier message à ce sujet. Je ne veux pas être insistant — je comprends que le timing n'est peut-être pas le bon.</p>
<p ${s.p}>Si un jour votre projet <strong ${s.strong}>{{service}}</strong> redevient d'actualité, n'hésitez pas à me recontacter. Je serai ravi d'en discuter.</p>
<p ${s.p}>En attendant, je vous souhaite une excellente continuation !</p>
<hr ${s.divider}>
<p ${s.pLast}>Bien cordialement,<br><strong ${s.strong}>Tahina — Mita Studio</strong></p>`,
    textBody: `Bonjour {{prenom}},

C'est mon dernier message à ce sujet. Je ne veux pas être insistant — je comprends que le timing n'est peut-être pas le bon.

Si un jour votre projet {{service}} redevient d'actualité, n'hésitez pas à me recontacter. Je serai ravi d'en discuter.

En attendant, je vous souhaite une excellente continuation !

Bien cordialement,
Tahina — Mita Studio`,
    variables: ["prenom", "service"],
  },

  // ─── T06 : Confirmation appel ──────────────────────────────────
  {
    name: "confirmation_appel",
    subject: "Appel confirmé — {{date_appel}} à {{heure_appel}}",
    htmlBody: `<h1 ${s.h1}>C'est noté, {{prenom}} !</h1>
<p ${s.p}>Notre appel est bien confirmé :</p>
<div ${s.highlight}>
  <p style="margin:0;font-size:15px;color:#0a0a0a;line-height:1.6;">
    📅 <strong ${s.strong}>{{date_appel}}</strong> à <strong ${s.strong}>{{heure_appel}}</strong><br>
    🎥 <a href="{{lien_visio}}" ${s.strong}>Rejoindre la visio</a>
  </p>
</div>
<p ${s.p}>L'appel durera environ <strong ${s.strong}>15 minutes</strong>. On parlera de votre projet, de vos objectifs et je pourrai vous donner une première estimation.</p>
<p ${s.p}>Si vous avez un empêchement :</p>
<a href="{{lien_reprogrammer}}" ${s.btnOutline}>Reprogrammer l'appel</a>
<hr ${s.divider}>
<p ${s.pLast}>À très vite,<br><strong ${s.strong}>Tahina — Mita Studio</strong></p>`,
    textBody: `C'est noté, {{prenom}} !

Notre appel est bien confirmé :
📅 {{date_appel}} à {{heure_appel}}
🎥 Rejoindre la visio : {{lien_visio}}

L'appel durera environ 15 minutes. On parlera de votre projet, de vos objectifs et je pourrai vous donner une première estimation.

Si vous avez un empêchement :
Reprogrammer : {{lien_reprogrammer}}

À très vite,
Tahina — Mita Studio`,
    variables: ["prenom", "date_appel", "heure_appel", "lien_visio", "lien_reprogrammer"],
  },

  // ─── T07 : Rappel appel (T-1h) ──────────────────────────────────
  {
    name: "rappel_appel",
    subject: "Rappel : notre appel dans 1h",
    htmlBody: `<h1 ${s.h1}>{{prenom}}, petit rappel !</h1>
<p ${s.p}>Notre appel est prévu <strong ${s.strong}>dans 1 heure</strong> ({{heure_appel}}).</p>
<div ${s.highlight}>
  <p style="margin:0;font-size:15px;color:#0a0a0a;line-height:1.6;">
    🎥 <a href="{{lien_visio}}" ${s.strong}>Rejoindre la visio</a>
  </p>
</div>
<p ${s.p}>Pas besoin de préparer quoi que ce soit — on discutera simplement de votre projet.</p>
<p ${s.p}>Un empêchement ? <a href="{{lien_reprogrammer}}" ${s.strong}>Reprogrammer</a></p>
<p ${s.pLast}>À tout de suite,<br><strong ${s.strong}>Tahina — Mita Studio</strong></p>`,
    textBody: `{{prenom}}, petit rappel !

Notre appel est prévu dans 1 heure ({{heure_appel}}).
🎥 Rejoindre la visio : {{lien_visio}}

Pas besoin de préparer quoi que ce soit — on discutera simplement de votre projet.

Un empêchement ? Reprogrammer : {{lien_reprogrammer}}

À tout de suite,
Tahina — Mita Studio`,
    variables: ["prenom", "heure_appel", "lien_visio", "lien_reprogrammer"],
  },

  // ─── T08 : No-show ──────────────────────────────────
  {
    name: "no_show",
    subject: "On a raté notre appel — replanifions ?",
    htmlBody: `<h1 ${s.h1}>Pas de souci, {{prenom}} !</h1>
<p ${s.p}>On avait un appel prévu et il semble qu'on se soit ratés. Aucun problème — ça arrive.</p>
<p ${s.p}>Quand vous êtes disponible, on peut facilement replanifier :</p>
<a href="{{lien_calendly}}" ${s.btn}>Choisir un nouveau créneau</a>
<p ${s.p}>Vous pouvez aussi me répondre par email avec vos disponibilités.</p>
<hr ${s.divider}>
<p ${s.pLast}>À bientôt,<br><strong ${s.strong}>Tahina — Mita Studio</strong></p>`,
    textBody: `Pas de souci, {{prenom}} !

On avait un appel prévu et il semble qu'on se soit ratés. Aucun problème — ça arrive.

Quand vous êtes disponible, on peut facilement replanifier :
{{lien_calendly}}

Vous pouvez aussi me répondre par email avec vos disponibilités.

À bientôt,
Tahina — Mita Studio`,
    variables: ["prenom", "lien_calendly"],
  },

  // ─── T09 : Récapitulatif appel ──────────────────────────────────
  {
    name: "recap_appel",
    subject: "Récapitulatif de notre échange",
    htmlBody: `<h1 ${s.h1}>Merci pour cet échange, {{prenom}} !</h1>
<p ${s.p}>Voici un résumé de ce qu'on s'est dit :</p>
<div ${s.highlight}>
  {{recap_appel}}
</div>
<h2 ${s.h2}>Prochaines étapes</h2>
<p ${s.p}>Je vous prépare une proposition détaillée que vous recevrez sous <strong ${s.strong}>48h</strong>. Elle comprendra le périmètre du projet, le planning et le tarif fixe.</p>
<p ${s.p}>En attendant, n'hésitez pas à me poser des questions par email.</p>
<hr ${s.divider}>
<p ${s.pLast}>À très vite,<br><strong ${s.strong}>{{admin_name}} — Mita Studio</strong></p>`,
    textBody: `Merci pour cet échange, {{prenom}} !

Voici un résumé de ce qu'on s'est dit :

{{recap_appel}}

Prochaines étapes :
Je vous prépare une proposition détaillée que vous recevrez sous 48h. Elle comprendra le périmètre du projet, le planning et le tarif fixe.

En attendant, n'hésitez pas à me poser des questions par email.

À très vite,
{{admin_name}} — Mita Studio`,
    variables: ["prenom", "recap_appel", "admin_name"],
  },

  // ─── T10 : Envoi devis ──────────────────────────────────
  {
    name: "envoi_devis",
    subject: "Votre devis est prêt, {{prenom}}",
    htmlBody: `<h1 ${s.h1}>{{prenom}}, votre proposition est prête !</h1>
<p ${s.p}>Suite à notre échange, j'ai préparé votre devis détaillé. Vous y trouverez :</p>
<ul ${s.ul}>
  <li>Le périmètre exact du projet</li>
  <li>Le planning de livraison</li>
  <li>Le tarif fixe — sans surprise</li>
</ul>
<a href="{{lien_devis}}" ${s.btn}>Consulter le devis</a>
<p ${s.p}>Ce devis est valable <strong ${s.strong}>30 jours</strong>. Prenez le temps de le lire, et n'hésitez pas à me poser toutes vos questions.</p>
<hr ${s.divider}>
<p ${s.pLast}>À votre disposition,<br><strong ${s.strong}>Tahina — Mita Studio</strong></p>`,
    textBody: `{{prenom}}, votre proposition est prête !

Suite à notre échange, j'ai préparé votre devis détaillé. Vous y trouverez :
- Le périmètre exact du projet
- Le planning de livraison
- Le tarif fixe — sans surprise

Consulter le devis : {{lien_devis}}

Ce devis est valable 30 jours. Prenez le temps de le lire, et n'hésitez pas à me poser toutes vos questions.

À votre disposition,
Tahina — Mita Studio`,
    variables: ["prenom", "lien_devis"],
  },

  // ─── T11 : Relance devis non lu ──────────────────────────────────
  {
    name: "relance_devis_non_lu",
    subject: "{{prenom}}, votre devis vous attend",
    htmlBody: `<h1 ${s.h1}>Un petit rappel, {{prenom}}</h1>
<p ${s.p}>Je vous ai envoyé votre devis il y a quelques jours et je voulais m'assurer que vous l'avez bien reçu.</p>
<a href="{{lien_devis}}" ${s.btnOutline}>Revoir le devis</a>
<p ${s.p}>Si vous avez des questions ou souhaitez ajuster quelque chose, je suis disponible.</p>
<hr ${s.divider}>
<p ${s.pLast}>Bonne journée,<br><strong ${s.strong}>Tahina — Mita Studio</strong></p>`,
    textBody: `Un petit rappel, {{prenom}}

Je vous ai envoyé votre devis il y a quelques jours et je voulais m'assurer que vous l'avez bien reçu.

Revoir le devis : {{lien_devis}}

Si vous avez des questions ou souhaitez ajuster quelque chose, je suis disponible.

Bonne journée,
Tahina — Mita Studio`,
    variables: ["prenom", "lien_devis"],
  },

  // ─── T12 : Relance devis lu ──────────────────────────────────
  {
    name: "relance_devis_lu",
    subject: "Des questions sur le devis, {{prenom}} ?",
    htmlBody: `<h1 ${s.h1}>Bonjour {{prenom}},</h1>
<p ${s.p}>Vous avez eu le temps de consulter la proposition. Est-ce que tout est clair ? Avez-vous des questions ?</p>
<p ${s.p}>Si le budget, le périmètre ou le planning nécessitent des ajustements, on peut en discuter. L'objectif est de trouver la formule qui vous convient.</p>
<a href="https://calendly.com/tahina-mitastudio/15min" ${s.btn}>En discuter en 15 min</a>
<hr ${s.divider}>
<p ${s.pLast}>À votre disposition,<br><strong ${s.strong}>Tahina — Mita Studio</strong></p>`,
    textBody: `Bonjour {{prenom}},

Vous avez eu le temps de consulter la proposition. Est-ce que tout est clair ? Avez-vous des questions ?

Si le budget, le périmètre ou le planning nécessitent des ajustements, on peut en discuter. L'objectif est de trouver la formule qui vous convient.

En discuter en 15 min : https://calendly.com/tahina-mitastudio/15min

À votre disposition,
Tahina — Mita Studio`,
    variables: ["prenom"],
  },

  // ─── T13 : Bienvenue client (WON) ──────────────────────────────────
  {
    name: "bienvenue_client",
    subject: "Bienvenue chez Mita Studio, {{prenom}} !",
    htmlBody: `<h1 ${s.h1}>Bienvenue {{prenom}} ! 🎉</h1>
<p ${s.p}>C'est officiel — on démarre votre projet ensemble. Merci pour votre confiance.</p>
<h2 ${s.h2}>Ce qui se passe maintenant</h2>
<ul ${s.ul}>
  <li><strong ${s.strong}>Sous 24h</strong> : je vous envoie le brief à valider</li>
  <li><strong ${s.strong}>Sous 48h</strong> : on démarre la production</li>
  <li><strong ${s.strong}>Chaque semaine</strong> : un point d'avancement par email</li>
</ul>
<p ${s.p}>Vous pouvez me joindre à tout moment par email pour toute question.</p>
<hr ${s.divider}>
<p ${s.pLast}>Hâte de commencer,<br><strong ${s.strong}>Tahina — Mita Studio</strong></p>`,
    textBody: `Bienvenue {{prenom}} !

C'est officiel — on démarre votre projet ensemble. Merci pour votre confiance.

Ce qui se passe maintenant :
- Sous 24h : je vous envoie le brief à valider
- Sous 48h : on démarre la production
- Chaque semaine : un point d'avancement par email

Vous pouvez me joindre à tout moment par email pour toute question.

Hâte de commencer,
Tahina — Mita Studio`,
    variables: ["prenom"],
  },

  // ─── T14 : Lead perdu (LOST) ──────────────────────────────────
  {
    name: "lead_perdu",
    subject: "Merci pour votre intérêt, {{prenom}}",
    htmlBody: `<h1 ${s.h1}>Merci {{prenom}},</h1>
<p ${s.p}>Je comprends que ce n'est pas le bon moment ou que notre offre ne correspondait pas à vos attentes actuelles. Pas de souci — chaque projet a son timing.</p>
<p ${s.p}>Si un jour vous avez besoin d'un coup de main sur le digital, vous savez où me trouver. Mes coordonnées ne changent pas 😊</p>
<p ${s.p}>Je vous souhaite une belle réussite dans vos projets.</p>
<hr ${s.divider}>
<p ${s.pLast}>À bientôt peut-être,<br><strong ${s.strong}>Tahina — Mita Studio</strong></p>`,
    textBody: `Merci {{prenom}},

Je comprends que ce n'est pas le bon moment ou que notre offre ne correspondait pas à vos attentes actuelles. Pas de souci — chaque projet a son timing.

Si un jour vous avez besoin d'un coup de main sur le digital, vous savez où me trouver. Mes coordonnées ne changent pas.

Je vous souhaite une belle réussite dans vos projets.

À bientôt peut-être,
Tahina — Mita Studio`,
    variables: ["prenom"],
  },

  // ─── T15 : Template libre (admin) ──────────────────────────────────
  {
    name: "template_libre",
    subject: "{{prenom}}, un message de Mita Studio",
    htmlBody: `<h1 ${s.h1}>Bonjour {{prenom}},</h1>
<p ${s.p}>{{message}}</p>
<hr ${s.divider}>
<p ${s.pLast}>Cordialement,<br><strong ${s.strong}>{{admin_name}} — Mita Studio</strong></p>`,
    textBody: `Bonjour {{prenom}},

{{message}}

Cordialement,
{{admin_name}} — Mita Studio`,
    variables: ["prenom", "nom", "email", "message", "admin_name"],
  },

  // ─── T16 : Rappel appel 24h avant ──────────────────────────────────
  {
    name: "rappel_appel_24h",
    subject: "Rappel : notre appel demain, {{prenom}}",
    htmlBody: `<h1 ${s.h1}>{{prenom}}, à demain !</h1>
<p ${s.p}>Un petit rappel : nous avons rendez-vous <strong ${s.strong}>demain</strong> pour discuter de votre projet.</p>
<div ${s.highlight}>
  <p style="margin:0;font-size:15px;color:#0a0a0a;line-height:1.6;">
    📅 <strong ${s.strong}>{{date_appel}}</strong> à <strong ${s.strong}>{{heure_appel}}</strong><br>
    🎥 <a href="{{lien_visio}}" ${s.strong}>Lien visio</a>
  </p>
</div>
<p ${s.p}>Pas besoin de préparer quoi que ce soit — on fera le point ensemble.</p>
<p ${s.p}>Un empêchement ? <a href="{{lien_reprogrammer}}" ${s.strong}>Reprogrammer l'appel</a></p>
<hr ${s.divider}>
<p ${s.pLast}>À demain,<br><strong ${s.strong}>Tahina — Mita Studio</strong></p>`,
    textBody: `{{prenom}}, à demain !

Un petit rappel : nous avons rendez-vous demain pour discuter de votre projet.

📅 {{date_appel}} à {{heure_appel}}
🎥 Lien visio : {{lien_visio}}

Pas besoin de préparer quoi que ce soit — on fera le point ensemble.

Un empêchement ? Reprogrammer : {{lien_reprogrammer}}

À demain,
Tahina — Mita Studio`,
    variables: ["prenom", "date_appel", "heure_appel", "lien_visio", "lien_reprogrammer"],
  },

  // ─── T17 : Merci post-appel ──────────────────────────────────
  {
    name: "merci_post_appel",
    subject: "Merci pour notre échange, {{prenom}} !",
    htmlBody: `<h1 ${s.h1}>Merci {{prenom}} !</h1>
<p ${s.p}>C'était un plaisir d'échanger avec vous aujourd'hui. Merci d'avoir pris le temps de me parler de votre projet.</p>
<p ${s.p}>Je travaille sur votre proposition et je reviens vers vous très vite avec tous les détails.</p>
<p ${s.p}>En attendant, n'hésitez pas à me contacter si vous avez des questions ou des précisions à apporter.</p>
<hr ${s.divider}>
<p ${s.pLast}>À très vite,<br><strong ${s.strong}>{{admin_name}} — Mita Studio</strong></p>`,
    textBody: `Merci {{prenom}} !

C'était un plaisir d'échanger avec vous aujourd'hui. Merci d'avoir pris le temps de me parler de votre projet.

Je travaille sur votre proposition et je reviens vers vous très vite avec tous les détails.

En attendant, n'hésitez pas à me contacter si vous avez des questions ou des précisions à apporter.

À très vite,
{{admin_name}} — Mita Studio`,
    variables: ["prenom", "admin_name"],
  },
];

// ============================================================================
// SEED
// ============================================================================

async function main() {
  console.log("📧 Seeding 17 email templates...\n");

  for (const t of templates) {
    const result = await prisma.emailTemplate.upsert({
      where: { name: t.name },
      update: {
        subject: t.subject,
        htmlBody: t.htmlBody,
        textBody: t.textBody,
        variables: t.variables,
        active: true,
      },
      create: {
        name: t.name,
        subject: t.subject,
        htmlBody: t.htmlBody,
        textBody: t.textBody,
        variables: t.variables,
        active: true,
      },
    });
    console.log(`  ✅ ${t.name} (${result.id})`);
  }

  console.log(`\n✅ Done! ${templates.length} templates seeded.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
