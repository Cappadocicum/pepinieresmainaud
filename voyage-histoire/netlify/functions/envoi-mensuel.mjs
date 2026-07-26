// Récap mensuel Tempo — fonction planifiée (le 1er de chaque mois à 8h UTC).
// Lit les abonnés dans Netlify Forms (formulaire « abonnement-tempo ») et
// envoie à chaque parent l'e-mail du thème que son enfant découvre ce mois-ci.
//
// Variables d'environnement à configurer sur le site Netlify :
//   NETLIFY_API_TOKEN : jeton d'accès Netlify (lecture des soumissions de formulaire)
//   RESEND_API_KEY    : clé https://resend.com (envoi des e-mails)
//   EXPEDITEUR        : adresse d'envoi vérifiée, ex. "Tempo <tempo@mondomaine.fr>"
// Sans ces variables, la fonction se contente de journaliser et ne fait rien.

const SITE_ID = "5421d3a0-8dad-47fe-a943-3c433d499d95";
const APP_URL = "https://tempo-voyage-histoire.netlify.app";

const THEMES = [
  { emoji: "🌋", nom: "Le commencement", accroche: "Du Big Bang aux dinosaures !" },
  { emoji: "🦣", nom: "La Préhistoire", accroche: "Le feu, les grottes et les mammouths !" },
  { emoji: "🐫", nom: "L'Égypte Antique", accroche: "Pharaons, pyramides et momies !" },
  { emoji: "🏛️", nom: "La Grèce Antique", accroche: "Dieux, héros et Jeux olympiques !" },
  { emoji: "🛡️", nom: "La Rome Antique", accroche: "Légionnaires, Colisée et gladiateurs !" },
  { emoji: "🐗", nom: "Les Gaulois", accroche: "Nos ancêtres les Gaulois !" },
  { emoji: "⛵", nom: "Les Vikings", accroche: "Drakkars et grandes explorations !" },
  { emoji: "🏰", nom: "Le Moyen Âge", accroche: "Châteaux forts et chevaliers !" },
  { emoji: "🎨", nom: "La Renaissance", accroche: "Léonard de Vinci et les grandes découvertes !" },
  { emoji: "👑", nom: "Les Temps Modernes", accroche: "Le Roi Soleil et Versailles !" },
  { emoji: "🇫🇷", nom: "La Révolution", accroche: "Liberté, Égalité, Fraternité !" },
  { emoji: "🚀", nom: "Notre époque", accroche: "Trains, fusées et internet !" },
];

function moisDuVoyage(debut) {
  const d = new Date(debut + (debut.length === 7 ? "-01" : ""));
  if (isNaN(d)) return -1;
  const now = new Date();
  return (now.getUTCFullYear() - d.getUTCFullYear()) * 12 + (now.getUTCMonth() - d.getUTCMonth());
}

export default async () => {
  const NETLIFY_TOKEN = process.env.NETLIFY_API_TOKEN;
  const RESEND_KEY = process.env.RESEND_API_KEY;
  const EXPEDITEUR = process.env.EXPEDITEUR || "Tempo <onboarding@resend.dev>";
  if (!NETLIFY_TOKEN || !RESEND_KEY) {
    console.log("Envoi mensuel ignoré : NETLIFY_API_TOKEN et/ou RESEND_API_KEY manquantes.");
    return new Response("configuration incomplète", { status: 200 });
  }

  const entetes = { Authorization: "Bearer " + NETLIFY_TOKEN };
  const formes = await (await fetch(
    "https://api.netlify.com/api/v1/sites/" + SITE_ID + "/forms", { headers: entetes })).json();
  const forme = formes.find(f => f.name === "abonnement-tempo");
  if (!forme) return new Response("formulaire introuvable", { status: 200 });

  const soumissions = await (await fetch(
    "https://api.netlify.com/api/v1/forms/" + forme.id + "/submissions?per_page=1000",
    { headers: entetes })).json();

  // Une seule entrée par e-mail (la plus récente)
  const abonnes = new Map();
  for (const s of soumissions) {
    const d = s.data || {};
    if (d.email) abonnes.set(d.email.toLowerCase(), d);
  }

  let envoyes = 0;
  for (const [email, a] of abonnes) {
    const mois = moisDuVoyage(a.debut || "");
    if (mois < 0 || mois > 11) continue;
    const t = THEMES[mois];
    const prenom = a.prenom || "votre enfant";
    const html =
      '<div style="font-family:sans-serif;max-width:520px;margin:auto">' +
      "<h1 style='color:#7c3aed'>" + t.emoji + " Nouveau mois, nouveau voyage !</h1>" +
      "<p>Ce mois-ci, <b>" + prenom + "</b> découvre <b>" + t.nom + "</b> — " + t.accroche + "</p>" +
      "<p>Au programme dans Tempo : une carte « Le savais-tu ? » chaque jour, " +
      "un bon à choisir (musée, livre, sortie ou activité) et des idées de lieux à visiter près de chez vous.</p>" +
      '<p><a href="' + APP_URL + '" style="background:#f59e0b;color:#fff;padding:10px 18px;' +
      'border-radius:10px;text-decoration:none;font-weight:bold">Ouvrir Tempo ' + t.emoji + "</a></p>" +
      "<p style='color:#888;font-size:12px'>Vous recevez cet e-mail car vous avez inscrit " + prenom +
      " sur Tempo — Mon voyage dans l'Histoire (mois " + (mois + 1) + "/12).</p></div>";
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + RESEND_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: EXPEDITEUR,
        to: email,
        subject: t.emoji + " Mois " + (mois + 1) + "/12 : " + prenom + " part pour " + t.nom + " !",
        html,
      }),
    });
    if (r.ok) envoyes++;
    else console.log("Échec envoi à", email, await r.text());
  }
  console.log("Récap mensuel :", envoyes, "e-mail(s) envoyé(s) sur", abonnes.size, "abonné(s).");
  return new Response("ok: " + envoyes, { status: 200 });
};

export const config = { schedule: "0 8 1 * *" };
