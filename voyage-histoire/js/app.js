// Mon Voyage dans l'Histoire — application principale (écrans + navigation)
(function () {
  const $ = sel => document.querySelector(sel);
  const app = () => $("#app");
  const MOIS_FR = ["janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[c]);
  }

  // Nom du mois calendaire correspondant au mois n° i du voyage
  function moisCalendaire(i) {
    const s = Store.get();
    if (!s.debut) return "";
    const d = new Date(s.debut + "T00:00:00");
    d.setMonth(d.getMonth() + i);
    return MOIS_FR[d.getMonth()] + " " + d.getFullYear();
  }

  function themeCourant() { return window.THEMES[Store.moisCourant()]; }
  function cat(id) { return window.CATEGORIES.find(c => c.id === id); }

  // Illustrations d'un thème (js/data/art.js) : visuel IA pour les
  // médaillons, dessin vectoriel pleine largeur pour les fonds de carte.
  function artSvg(slug) { return (window.ART || {})[slug] || ""; }
  function fondSvg(slug) { return (window.ART_SVG || {})[slug] || artSvg(slug); }
  // Fenêtre d'illustration des cartes à collectionner : fond IA en priorité
  function fondCarte(slug) {
    const url = (window.CARD_ART || {})[slug];
    if (url) return '<div class="cf-fond plein" aria-hidden="true"><img src="' + url + '" alt="" decoding="async"></div>';
    const svg = fondSvg(slug);
    return svg ? '<div class="cf-fond" aria-hidden="true">' + svg + "</div>" : "";
  }
  function medaillon(t, classe) {
    const svg = artSvg(t.slug);
    return '<div class="' + classe + '"' +
      (svg ? ">" + svg : ' data-emoji="1"><span>' + t.emoji + "</span>") + "</div>";
  }

  function faitDuJour(slug, jour) {
    const list = (window.FUNFACTS || {})[slug] || [];
    return list.find(f => f.j === jour) || list[0] || {
      j: jour, e: "✨", t: "Bientôt", s: "Une nouvelle découverte arrive bientôt !",
    };
  }

  // ——— Navigation ———
  const NAV = [
    { id: "home", emoji: "🏠", label: "Accueil" },
    { id: "voyage", emoji: "🗺️", label: "Voyage" },
    { id: "carte", emoji: "📍", label: "Carte" },
    { id: "album", emoji: "🃏", label: "Album" },
    { id: "bons", emoji: "🎟️", label: "Mes bons" },
  ];

  function navHtml(active) {
    return '<nav class="navbar">' + NAV.map(n =>
      '<a href="#' + n.id + '" class="nav-item' + (active === n.id ? " active" : "") + '">' +
      '<span class="nav-emoji">' + n.emoji + '</span><span class="nav-label">' + n.label + "</span></a>"
    ).join("") + "</nav>";
  }

  function go(hash) { location.hash = hash; }

  function route() {
    const s = Store.get();
    const h = (location.hash || "#home").slice(1);
    const [screen, arg] = h.split("/");
    if (!s.prenom && screen !== "onboarding") { location.hash = "#onboarding"; return; }
    window.scrollTo(0, 0);
    switch (screen) {
      case "onboarding": return renderOnboarding();
      case "voyage": return renderVoyage();
      case "theme": return renderTheme(parseInt(arg, 10) || 0);
      case "carte": return renderCarte();
      case "album": return renderAlbum(arg != null && arg !== "" ? parseInt(arg, 10) : undefined);
      case "bons": return renderBons();
      case "reglages": return renderReglages();
      default: return renderHome();
    }
  }

  // ——— Modales ———
  function ouvrirModale(html, onMount) {
    fermerModale();
    const ov = document.createElement("div");
    ov.className = "overlay";
    ov.id = "overlay";
    ov.innerHTML = '<div class="modale">' + html + "</div>";
    ov.addEventListener("click", e => { if (e.target === ov) fermerModale(); });
    document.body.appendChild(ov);
    if (onMount) onMount(ov);
  }
  function fermerModale() {
    const ov = $("#overlay");
    if (ov) ov.remove();
  }
  window.fermerModale = fermerModale;

  // ═══════════ ÉCRAN : Inscription ═══════════
  function renderOnboarding() {
    document.body.className = "fond-onboarding";
    app().innerHTML =
      '<div class="onboarding">' +
      '<div class="ob-logo">🎈</div>' +
      '<h1 class="ob-titre">Tempo</h1>' +
      '<div class="ob-marque">Mon voyage dans l’Histoire</div>' +
      '<p class="ob-sous">Pars pour un grand voyage de 12 mois,<br>du Big Bang jusqu’à aujourd’hui ! 🦖🏰🚀</p>' +
      '<div class="carte-blanche">' +
      '<label class="champ"><span>Ton prénom</span>' +
      '<input id="ob-prenom" type="text" maxlength="20" placeholder="Ex. : Luca" autocomplete="off"></label>' +
      '<label class="champ"><span>Ta date de naissance</span>' +
      '<input id="ob-naissance" type="date"></label>' +
      '<button id="ob-go" class="btn-grand">C’est parti ! 🚀</button>' +
      '<p class="ob-note">🔒 Tout reste sur cet appareil, rien n’est envoyé sur internet.</p>' +
      "</div></div>";
    $("#ob-go").addEventListener("click", () => {
      const prenom = $("#ob-prenom").value.trim();
      if (!prenom) { $("#ob-prenom").classList.add("erreur"); $("#ob-prenom").focus(); return; }
      Store.creerProfil(prenom, $("#ob-naissance").value || null);
      renderBienvenue();
    });
  }

  function renderBienvenue() {
    const s = Store.get();
    const t = themeCourant();
    document.body.className = "fond-onboarding";
    app().innerHTML =
      '<div class="onboarding bienvenue">' +
      '<div class="ob-logo pop">🎉</div>' +
      '<h1 class="ob-titre">Bienvenue dans Tempo,<br>' + esc(s.prenom) + " !</h1>" +
      '<p class="ob-sous">Ton voyage dans l’Histoire commence<br>en <b>' + moisCalendaire(0) + "</b> avec…</p>" +
      '<div class="carte-theme pop" style="--c1:' + t.couleur + ";--c2:" + t.couleur2 + '">' +
      medaillon(t, "ct-medaille") +
      '<div class="ct-nom">' + t.nom + '</div>' +
      '<div class="ct-accroche">' + t.accroche + "</div></div>" +
      '<button class="btn-grand" onclick="location.hash=\'#home\'">Commencer l’aventure ✨</button>' +
      "</div>";
  }

  // ═══════════ ÉCRAN : Accueil ═══════════
  function renderHome() {
    const s = Store.get();
    const i = Store.moisCourant();
    const t = window.THEMES[i];
    const jour = new Date().getDate();
    const fait = faitDuJour(t.slug, jour);
    const dejaVue = Store.estVue(t.slug, jour);
    const choix = Store.choixDuMois(i);
    const age = Store.age();
    const fini = Store.voyageTermine() && !s.modeDecouverte;
    document.body.className = "fond-app";

    let bandeau;
    if (fini) {
      bandeau =
        '<div class="carte-theme large" style="--c1:#f59e0b;--c2:#b45309">' +
        '<div class="ct-emoji">🏆</div>' +
        '<div class="ct-nom">Bravo, voyage terminé !</div>' +
        '<div class="ct-accroche">Tu as traversé toute l’Histoire. Envie de repartir ?</div>' +
        '<button class="btn-blanc" id="btn-restart">🔁 Recommencer un voyage</button></div>';
    } else {
      bandeau =
        '<a class="carte-theme large" href="#theme/' + i + '" style="--c1:' + t.couleur + ";--c2:" + t.couleur2 + '">' +
        '<div class="ct-mois">Mois ' + (i + 1) + " / 12 · " + moisCalendaire(i) + "</div>" +
        medaillon(t, "ct-medaille") +
        '<div class="ct-nom">' + t.nom + '</div>' +
        '<div class="ct-accroche">' + t.accroche + "</div>" +
        (choix
          ? '<div class="ct-badge">Bon du mois : ' + cat(choix.cat).emoji + " " + cat(choix.cat).nom + " ✔️</div>"
          : '<div class="ct-badge attention">🎟️ Choisis ton bon du mois !</div>') +
        "</a>";
    }

    app().innerHTML =
      '<header class="entete">' +
      '<div><div class="salut">Bonjour ' + esc(s.prenom) + " ! 👋</div>" +
      '<div class="salut-sous">' + (age != null ? age + " ans · " : "") + "Explorateur du temps</div></div>" +
      '<a class="btn-rond" href="#reglages" aria-label="Réglages">⚙️</a>' +
      "</header>" +
      '<main class="contenu">' +
      bandeau +
      '<h2 class="titre-section">🃏 La carte du jour</h2>' +
      '<div class="carte-fait' + (dejaVue ? "" : " neuve") + '" id="carte-jour" style="--c1:' + t.couleur + ";--c2:" + t.couleur2 + '">' +
      '<div class="cf-haut">' + fondCarte(t.slug) +
      '<span class="cf-emoji">' + fait.e + '</span>' +
      '<span class="cf-jour">' + jour + " " + moisCalendaire(i).split(" ")[0] + "</span></div>" +
      '<div class="cf-bas"><div class="cf-titre">' + esc(fait.t) + '</div>' +
      '<div class="cf-texte">' + esc(fait.s) + "</div>" +
      (dejaVue ? "" : '<div class="cf-nouveau">✨ Nouvelle carte ! Touche-la pour la ranger dans ton album.</div>') +
      "</div></div>" +
      '<div class="tuiles">' +
      '<a class="tuile" href="#voyage"><span>🗺️</span>Mon voyage</a>' +
      '<a class="tuile" href="#album"><span>🃏</span>Mon album<br><small>' + Store.nbCartesVues() + " cartes</small></a>" +
      '<a class="tuile" href="#carte"><span>📍</span>Autour de moi</a>' +
      '<a class="tuile" href="#bons"><span>🎟️</span>Mes bons</a>' +
      "</div></main>" + navHtml("home");

    $("#carte-jour").addEventListener("click", () => {
      Store.carteVue(t.slug, jour);
      const el = $("#carte-jour");
      el.classList.remove("neuve");
      el.classList.add("rangee");
      setTimeout(() => { el.classList.remove("rangee"); route(); }, 500);
    });
    const btnRestart = $("#btn-restart");
    if (btnRestart) btnRestart.addEventListener("click", confirmerRecommencer);
  }

  function confirmerRecommencer() {
    ouvrirModale(
      "<h3>🔁 Recommencer un voyage ?</h3>" +
      "<p>Tu repars pour 12 nouveaux mois avec 12 nouveaux bons. Ton album de cartes est conservé !</p>" +
      '<div class="modale-boutons">' +
      '<button class="btn-secondaire" onclick="fermerModale()">Pas encore</button>' +
      '<button class="btn-grand" id="ok-restart">Oui, on repart ! 🚀</button></div>',
      ov => ov.querySelector("#ok-restart").addEventListener("click", () => {
        Store.recommencerVoyage();
        fermerModale();
        go("#home");
        route();
      })
    );
  }

  // ═══════════ ÉCRAN : Le voyage (frise des 12 mois) ═══════════
  function renderVoyage() {
    const courant = Store.moisCourant();
    const s = Store.get();
    document.body.className = "fond-app";
    // Tous les mois sont visibles (nom, période, illustration) ; ceux à venir
    // restent cadenassés tant que le voyage n'y est pas arrivé.
    const etapes = window.THEMES.map((t, i) => {
      const debloque = Store.estDebloque(i);
      const choix = Store.choixDuMois(i);
      const estCourant = i === courant && !Store.voyageTermine();
      const classe = debloque ? (estCourant ? "etape courante" : "etape ouverte") : "etape verrouillee";
      const rond = '<div class="etape-rond art">' +
        (artSvg(t.slug) || '<span class="etape-emoji">' + t.emoji + "</span>") +
        (debloque ? "" : '<span class="etape-cadenas" title="Encore verrouillé">🔒</span>') + "</div>";
      const inner = rond +
        '<div class="etape-texte"><div class="etape-mois">Mois ' + (i + 1) + " · " + moisCalendaire(i) + "</div>" +
        '<div class="etape-nom">' + t.nom + "</div>" +
        '<div class="etape-periode">' + t.periode + "</div>" +
        (debloque ? "" : '<div class="etape-verrou">🔒 S’ouvre en ' + moisCalendaire(i) + "</div>") +
        "</div>" +
        (choix ? '<div class="etape-sticker" title="Bon utilisé">' + cat(choix.cat).emoji + "</div>" :
          (estCourant ? '<div class="etape-sticker vide">🎟️</div>' : ""));
      return debloque
        ? '<a class="' + classe + '" href="#theme/' + i + '" style="--c1:' + t.couleur + ";--c2:" + t.couleur2 + '">' + inner + "</a>"
        : '<div class="' + classe + '" style="--c1:' + t.couleur + ";--c2:" + t.couleur2 + '">' + inner + "</div>";
    }).join('<div class="etape-lien"></div>');

    app().innerHTML =
      '<header class="entete"><div><div class="salut">🗺️ Mon voyage</div>' +
      '<div class="salut-sous">De l’origine du monde à aujourd’hui, dans l’ordre !</div></div></header>' +
      '<main class="contenu"><div class="frise">' + etapes + "</div>" +
      (s.toursTermines > 0 ? '<p class="note-centre">🏆 Voyages déjà terminés : ' + s.toursTermines + "</p>" : "") +
      "</main>" + navHtml("voyage");
  }

  // ═══════════ ÉCRAN : Un thème ═══════════
  function renderTheme(i) {
    i = Math.max(0, Math.min(11, i));
    const t = window.THEMES[i];
    if (!Store.estDebloque(i)) { go("#voyage"); return; }
    const choix = Store.choixDuMois(i);
    const estMoisCourant = i === Store.moisCourant();
    document.body.className = "fond-app";

    let sectionBon;
    if (choix) {
      const c = cat(choix.cat);
      sectionBon =
        '<div class="sticker-pose pop">' +
        '<div class="sticker-rond" style="--cc:' + c.couleur + '">' + c.emoji + "</div>" +
        '<div><b>Bon utilisé : ' + c.nom + "</b><br><small>" + c.bon + " · le " +
        new Date(choix.date + "T00:00:00").toLocaleDateString("fr-FR") + "</small></div></div>";
    } else if (estMoisCourant || Store.get().modeDecouverte) {
      sectionBon =
        '<h2 class="titre-section">🎟️ Choisis ton bon du mois</h2>' +
        '<p class="note">Ce mois-ci, tu as le droit à <b>un</b> bon. Choisis bien : il te reste ' +
        window.CATEGORIES.map(c => c.emoji + " ×" + Store.bonsRestants(c.id)).join(" · ") + "</p>" +
        '<div class="choix-grille">' +
        window.CATEGORIES.map(c => {
          const reste = Store.bonsRestants(c.id);
          return '<button class="choix-carte' + (reste ? "" : " epuise") + '" data-cat="' + c.id + '" style="--cc:' + c.couleur + '"' + (reste ? "" : " disabled") + ">" +
            '<span class="cc-emoji">' + c.emoji + '</span><span class="cc-nom">' + c.nom + "</span>" +
            '<span class="cc-reste">' + (reste ? reste + " bon" + (reste > 1 ? "s" : "") + " restant" + (reste > 1 ? "s" : "") : "Plus de bons !") + "</span></button>";
        }).join("") + "</div>";
    } else {
      sectionBon = '<p class="note-centre">Tu as déjà voyagé dans ce mois. Regarde les idées ci-dessous ou retourne au mois en cours ! 😉</p>';
    }

    // Onglets d'idées : le choix fait est mis en avant, mais tout reste consultable
    const ongletActif = choix ? choix.cat : "livre";
    app().innerHTML =
      '<header class="entete-theme" style="--c1:' + t.couleur + ";--c2:" + t.couleur2 + '">' +
      '<a class="btn-rond retour" href="#voyage">←</a>' +
      medaillon(t, "et-medaille") +
      '<h1 class="et-nom">' + t.nom + '</h1>' +
      '<div class="et-periode">' + t.periode + '</div>' +
      '<p class="et-intro">' + t.intro + "</p></header>" +
      '<main class="contenu">' +
      sectionBon +
      '<h2 class="titre-section">💡 Les idées du mois</h2>' +
      '<div class="onglets" id="onglets">' +
      window.CATEGORIES.map(c =>
        '<button class="onglet' + (c.id === ongletActif ? " actif" : "") + '" data-tab="' + c.id + '">' + c.emoji + " " + c.nom + "</button>"
      ).join("") + "</div>" +
      '<div id="zone-idees"></div>' +
      '<a class="lien-album" href="#album/' + i + '">🃏 Voir les cartes « Le savais-tu ? » de ce thème →</a>' +
      "</main>" + navHtml("voyage");

    document.querySelectorAll(".choix-carte").forEach(b =>
      b.addEventListener("click", () => confirmerBon(i, b.dataset.cat)));
    document.querySelectorAll(".onglet").forEach(b =>
      b.addEventListener("click", () => {
        document.querySelectorAll(".onglet").forEach(x => x.classList.toggle("actif", x === b));
        montrerIdees(t, b.dataset.tab);
      }));
    montrerIdees(t, ongletActif);
  }

  function confirmerBon(moisIndex, catId) {
    const c = cat(catId);
    const t = window.THEMES[moisIndex];
    ouvrirModale(
      '<div class="modale-emoji">' + c.emoji + "</div>" +
      "<h3>Utiliser un bon « " + c.nom + " » ?</h3>" +
      "<p>Pour le thème <b>" + t.nom + "</b>, tu choisis : <b>" + c.bon + "</b>.<br>" +
      "Il te restera " + (Store.bonsRestants(catId) - 1) + " bon(s) " + c.nom + ".</p>" +
      '<div class="modale-boutons">' +
      '<button class="btn-secondaire" onclick="fermerModale()">Je réfléchis…</button>' +
      '<button class="btn-grand" id="ok-bon">Je colle mon sticker ! ' + c.emoji + "</button></div>",
      ov => ov.querySelector("#ok-bon").addEventListener("click", () => {
        Store.utiliserBon(moisIndex, catId);
        fermerModale();
        route();
      })
    );
  }

  // ——— Idées par catégorie ———
  function montrerIdees(t, catId) {
    const zone = $("#zone-idees");
    if (!zone) return;
    const age = Store.age();
    if (catId === "livre") {
      const livres = (window.BOOKS[t.slug] || []);
      zone.innerHTML =
        '<div class="liste">' + livres.map(l => {
          const pourToi = age != null && age >= l.ageMin && age <= l.ageMax;
          return '<div class="item"><div class="item-emoji">📖</div><div class="item-corps">' +
            "<b>" + esc(l.t) + "</b> <small>· " + esc(l.ed) + " · " + l.ageMin + "-" + l.ageMax + " ans</small>" +
            (pourToi ? ' <span class="badge-age">Pour ton âge !</span>' : "") +
            "<p>" + esc(l.d) + "</p></div></div>";
        }).join("") + "</div>" +
        '<button class="btn-grand" id="btn-librairies">📍 Trouver une librairie près de chez moi</button>' +
        '<div id="zone-proche"></div>' +
        '<p class="note">Idées de lecture à retrouver en librairie (Fnac, Cultura, Espace culturel, librairies indépendantes…) ou en bibliothèque.</p>';
      $("#btn-librairies").addEventListener("click", () => chercherProche("librairie"));
    } else if (catId === "activite") {
      const acts = (window.ACTIVITIES[t.slug] || []);
      const em = { kit: "🎁", maison: "✂️", jardin: "🌳", cuisine: "🍪", jeu: "🎲" };
      zone.innerHTML = '<div class="liste">' + acts.map(a =>
        '<div class="item"><div class="item-emoji">' + (em[a.type] || "🎨") + '</div><div class="item-corps">' +
        "<b>" + esc(a.t) + "</b><p>" + esc(a.d) + "</p></div></div>"
      ).join("") + "</div>" +
        '<p class="note">💡 Les kits se trouvent en magasin de jouets, en librairie ou en ligne. Les activités « maison » se font avec ce qu’on a déjà !</p>';
    } else {
      // musée ou sortie : lieux conseillés triés par distance
      const types = catId === "musee" ? ["musee"] : ["site", "parc"];
      const pos = Store.get().position;
      const lieux = Carte.lieuxDuTheme(t.slug, pos, types);
      zone.innerHTML =
        (pos ? '<p class="note">📍 Distances depuis : <b>' + esc(pos.label) + "</b></p>"
          : '<button class="btn-grand" id="btn-localiser">📍 Me localiser pour trier par distance</button>') +
        '<div class="liste">' + (lieux.length ? lieux.map(p =>
          '<div class="item"><div class="item-emoji">' + (p.type === "parc" ? "🎡" : p.type === "site" ? "🏰" : "🏛️") + "</div>" +
          '<div class="item-corps"><b>' + esc(p.nom) + "</b> <small>· " + esc(p.ville) +
          (p.dist != null ? " · à " + Carte.formatKm(p.dist) : "") + "</small>" +
          "<p>" + esc(p.d) + "</p>" +
          '<a class="lien-itineraire" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=' + p.lat + "," + p.lng + '">🧭 Itinéraire</a>' +
          "</div></div>").join("")
          : '<p class="note-centre">Pas encore de lieu conseillé pour ce thème — regarde la carte !</p>') + "</div>" +
        (catId === "musee" ? '<button class="btn-grand" id="btn-musees">🏛️ Tous les musées autour de moi</button><div id="zone-proche"></div>' : "") +
        '<a class="lien-album" href="#carte">🗺️ Ouvrir la grande carte →</a>';
      const bl = $("#btn-localiser");
      if (bl) bl.addEventListener("click", async () => {
        bl.textContent = "🔄 Localisation…";
        try { Store.setPosition(await Carte.localiser()); montrerIdees(t, catId); }
        catch (e) { bl.textContent = "❌ Localisation refusée — ouvre la Carte pour chercher ta ville"; }
      });
      const bm = $("#btn-musees");
      if (bm) bm.addEventListener("click", () => chercherProche("musee"));
    }
  }

  async function chercherProche(kind) {
    const zone = $("#zone-proche");
    if (!zone) return;
    zone.innerHTML = '<p class="note-centre">🔄 Recherche en cours…</p>';
    let pos = Store.get().position;
    if (!pos) {
      try { pos = await Carte.localiser(); Store.setPosition(pos); }
      catch (e) {
        zone.innerHTML = '<p class="note-centre">❌ Impossible de te localiser. Ouvre l’écran « Carte » et tape le nom de ta ville !</p>';
        return;
      }
    }
    try {
      const res = await Carte.chercherAutour(pos, kind, 20);
      zone.innerHTML = res.length
        ? '<div class="liste">' + res.slice(0, 10).map(p =>
          '<div class="item"><div class="item-emoji">' + (kind === "librairie" ? "📚" : "🏛️") + "</div>" +
          '<div class="item-corps"><b>' + esc(p.nom) + "</b> <small>· à " + Carte.formatKm(p.dist) + "</small>" +
          (p.horaires ? "<p>🕐 " + esc(p.horaires) + "</p>" : "") +
          '<a class="lien-itineraire" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=' + p.lat + "," + p.lng + '">🧭 Itinéraire</a>' +
          "</div></div>").join("") + "</div>" +
        '<p class="note">Source : OpenStreetMap. Pense à vérifier les horaires avant de partir !</p>'
        : '<p class="note-centre">Rien trouvé à moins de 20 km. Essaie depuis la grande carte !</p>';
    } catch (e) {
      zone.innerHTML = '<p class="note-centre">😕 La recherche n’a pas fonctionné (pas de connexion ?). Réessaie plus tard.</p>';
    }
  }

  // ═══════════ ÉCRAN : Carte ═══════════
  function renderCarte() {
    const s = Store.get();
    const iCourant = Store.moisCourant();
    document.body.className = "fond-app";
    app().innerHTML =
      '<header class="entete"><div><div class="salut">📍 Autour de moi</div>' +
      '<div class="salut-sous">Musées, sorties et librairies pour ton voyage</div></div></header>' +
      '<main class="contenu">' +
      '<div class="barre-carte">' +
      '<button class="btn-mini" id="c-localiser">📍 Me localiser</button>' +
      '<input id="c-ville" type="text" placeholder="ou tape ta ville…">' +
      '<button class="btn-mini" id="c-chercher">🔎</button></div>' +
      '<div class="barre-carte">' +
      '<select id="c-theme">' +
      '<option value="tous">🌍 Tous les thèmes</option>' +
      window.THEMES.map((t, i) =>
        '<option value="' + i + '"' + (i === iCourant ? " selected" : "") + ">" +
        t.emoji + " " + t.nom + "</option>").join("") + "</select>" +
      '<button class="btn-mini" id="c-librairies">📚 Librairies</button>' +
      '<button class="btn-mini" id="c-musees">🏛️ Musées OSM</button></div>' +
      '<div id="la-carte"></div>' +
      '<div id="c-liste"></div>' +
      '<p class="note">Les lieux conseillés viennent de notre sélection « spéciale enfants ». Les librairies et musées « autour de moi » viennent d’OpenStreetMap (horaires affichés quand ils sont connus).</p>' +
      "</main>" + navHtml("carte");

    let pos = s.position;
    const themeSel = () => {
      const v = $("#c-theme").value;
      return v === "tous" ? null : window.THEMES[parseInt(v, 10)];
    };

    async function rafraichir(extra) {
      const t = themeSel();
      const lieux = t ? Carte.lieuxDuTheme(t.slug, pos, null) : Carte.tousLesLieux(pos);
      const points = lieux.concat(extra || []);
      try { await Carte.afficherCarte("la-carte", pos, points); }
      catch (e) { $("#la-carte").innerHTML = '<div class="carte-hors-ligne">🗺️ Carte indisponible (hors-ligne ?) — voici la liste :</div>'; }
      $("#c-liste").innerHTML = '<div class="liste">' + points.map(p =>
        '<div class="item"><div class="item-emoji">' + (p.kind === "librairie" ? "📚" : p.type === "parc" ? "🎡" : p.type === "site" ? "🏰" : "🏛️") + "</div>" +
        '<div class="item-corps"><b>' + esc(p.nom) + "</b> <small>· " + esc(p.ville || "") +
        (p.dist != null ? " · à " + Carte.formatKm(p.dist) : "") + "</small>" +
        (p.horaires ? "<p>🕐 " + esc(p.horaires) + "</p>" : (p.d ? "<p>" + esc(p.d) + "</p>" : "")) +
        '<a class="lien-itineraire" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=' + p.lat + "," + p.lng + '">🧭 Itinéraire</a>' +
        "</div></div>").join("") + "</div>";
    }

    $("#c-localiser").addEventListener("click", async () => {
      $("#c-localiser").textContent = "🔄…";
      try { pos = await Carte.localiser(); Store.setPosition(pos); } catch (e) { alert("Localisation impossible. Tape le nom de ta ville !"); }
      $("#c-localiser").textContent = "📍 Me localiser";
      rafraichir();
    });
    $("#c-chercher").addEventListener("click", async () => {
      const q = $("#c-ville").value.trim();
      if (!q) return;
      $("#c-chercher").textContent = "🔄";
      try {
        const r = await Carte.chercherVille(q);
        if (r) { pos = r; Store.setPosition(pos); rafraichir(); }
        else alert("Ville introuvable, essaie autrement !");
      } catch (e) { alert("Recherche impossible (pas de connexion ?)"); }
      $("#c-chercher").textContent = "🔎";
    });
    $("#c-ville").addEventListener("keydown", e => { if (e.key === "Enter") $("#c-chercher").click(); });
    $("#c-theme").addEventListener("change", () => rafraichir());
    $("#c-librairies").addEventListener("click", async () => {
      if (!pos) { alert("Localise-toi d’abord (ou tape ta ville) !"); return; }
      $("#c-librairies").textContent = "🔄…";
      try { rafraichir(await Carte.chercherAutour(pos, "librairie", 20)); }
      catch (e) { alert("Recherche impossible pour le moment."); }
      $("#c-librairies").textContent = "📚 Librairies";
    });
    $("#c-musees").addEventListener("click", async () => {
      if (!pos) { alert("Localise-toi d’abord (ou tape ta ville) !"); return; }
      $("#c-musees").textContent = "🔄…";
      try { rafraichir(await Carte.chercherAutour(pos, "musee", 30)); }
      catch (e) { alert("Recherche impossible pour le moment."); }
      $("#c-musees").textContent = "🏛️ Musées OSM";
    });

    rafraichir();
  }

  // ═══════════ ÉCRAN : Album de cartes ═══════════
  function renderAlbum(moisDemande) {
    const courant = Store.moisCourant();
    const i = moisDemande != null && !isNaN(moisDemande)
      ? Math.max(0, Math.min(11, moisDemande)) : courant;
    if (!Store.estDebloque(i)) { go("#album"); return; }
    const t = window.THEMES[i];
    const aujourdHui = new Date().getDate();
    const jourMax = (i < courant || Store.get().modeDecouverte) ? 31 : aujourdHui;
    document.body.className = "fond-app";

    const artCarte = (window.CARD_ART || {})[t.slug];
    const mcArt = artCarte
      ? '<img class="mc-art" src="' + artCarte + '" alt="" loading="lazy" decoding="async">' : "";
    const cartes = [];
    for (let j = 1; j <= 31; j++) {
      const f = faitDuJour(t.slug, j);
      const ouverte = j <= jourMax;
      const vue = Store.estVue(t.slug, j);
      cartes.push(
        ouverte
          ? '<button class="mini-carte' + (vue ? " vue" : "") + (mcArt ? " avec-art" : "") + '" data-jour="' + j + '" style="--c1:' + t.couleur + ";--c2:" + t.couleur2 + '">' +
            mcArt +
            '<span class="mc-emoji">' + f.e + '</span><span class="mc-jour">' + j + "</span>" +
            (vue ? "" : '<span class="mc-point"></span>') + "</button>"
          : '<div class="mini-carte fermee"><span class="mc-emoji">❓</span><span class="mc-jour">' + j + "</span></div>"
      );
    }

    app().innerHTML =
      '<header class="entete"><div><div class="salut">🃏 Mon album</div>' +
      '<div class="salut-sous">Une nouvelle carte « Le savais-tu ? » chaque jour !</div></div></header>' +
      '<main class="contenu">' +
      '<div class="barre-carte"><select id="a-mois">' +
      window.THEMES.map((th, k) =>
        '<option value="' + k + '"' + (k === i ? " selected" : "") + (Store.estDebloque(k) ? "" : " disabled") + ">" +
        th.emoji + " Mois " + (k + 1) + " — " + th.nom + "</option>").join("") +
      "</select></div>" +
      '<p class="note-centre">' + Store.nbCartesVues() + " carte" + (Store.nbCartesVues() > 1 ? "s" : "") + " collectionnée" + (Store.nbCartesVues() > 1 ? "s" : "") + " en tout ✨</p>" +
      '<div class="album-grille">' + cartes.join("") + "</div>" +
      "</main>" + navHtml("album");

    $("#a-mois").addEventListener("change", e => go("#album/" + e.target.value));
    document.querySelectorAll(".mini-carte[data-jour]").forEach(b =>
      b.addEventListener("click", () => {
        const j = parseInt(b.dataset.jour, 10);
        const f = faitDuJour(t.slug, j);
        Store.carteVue(t.slug, j);
        ouvrirModale(
          '<div class="grande-carte" style="--c1:' + t.couleur + ";--c2:" + t.couleur2 + '">' +
          '<div class="gc-haut">' + fondCarte(t.slug) +
          '<span class="gc-emoji">' + f.e + '</span>' +
          '<span class="gc-numero">' + t.emoji + " n°" + j + "</span></div>" +
          '<div class="gc-bas"><div class="gc-titre">' + esc(f.t) + '</div>' +
          '<div class="gc-texte">' + esc(f.s) + "</div></div></div>" +
          '<div class="modale-boutons"><button class="btn-grand" onclick="fermerModale()">Trop bien ! ✨</button></div>',
          null
        );
        b.classList.add("vue");
        const pt = b.querySelector(".mc-point");
        if (pt) pt.remove();
      }));
  }

  // ═══════════ ÉCRAN : Mes bons ═══════════
  function renderBons() {
    const s = Store.get();
    document.body.className = "fond-app";
    const utilisesParCat = {};
    Object.entries(s.choix).forEach(([mois, c]) => {
      (utilisesParCat[c.cat] = utilisesParCat[c.cat] || []).push(parseInt(mois, 10));
    });

    app().innerHTML =
      '<header class="entete"><div><div class="salut">🎟️ Mes bons</div>' +
      '<div class="salut-sous">12 bons pour 12 mois : 3 par famille, à toi de choisir !</div></div></header>' +
      '<main class="contenu">' +
      window.CATEGORIES.map(c => {
        const utilises = (utilisesParCat[c.id] || []).sort((a, b) => a - b);
        const tickets = [];
        for (let k = 0; k < window.BONS_PAR_CATEGORIE; k++) {
          if (k < utilises.length) {
            const t = window.THEMES[utilises[k]];
            tickets.push('<div class="ticket utilise" style="--cc:' + c.couleur + '">' +
              '<span class="tk-emoji">' + t.emoji + '</span><span class="tk-texte">' + t.nom + "</span>" +
              '<span class="tk-tampon">UTILISÉ</span></div>');
          } else {
            tickets.push('<div class="ticket" style="--cc:' + c.couleur + '">' +
              '<span class="tk-emoji">' + c.emoji + '</span><span class="tk-texte">' + c.bon + "</span>" +
              '<span class="tk-numero">n°' + (k + 1) + "</span></div>");
          }
        }
        return '<h2 class="titre-section">' + c.emoji + " " + c.nom +
          ' <small class="ts-reste">' + Store.bonsRestants(c.id) + "/" + window.BONS_PAR_CATEGORIE + " restants</small></h2>" +
          '<div class="tickets">' + tickets.join("") + "</div>";
      }).join("") +
      '<p class="note">Chaque mois, tu utilises un seul bon pour le thème en cours : une entrée au musée, un livre, une visite ou un jeu/une activité — comme dans le cahier !</p>' +
      "</main>" + navHtml("bons");
  }

  // ═══════════ ÉCRAN : Réglages ═══════════
  function renderReglages() {
    const s = Store.get();
    document.body.className = "fond-app";
    app().innerHTML =
      '<header class="entete"><a class="btn-rond" href="#home">←</a>' +
      '<div><div class="salut">⚙️ Réglages</div><div class="salut-sous">Coin des parents</div></div></header>' +
      '<main class="contenu">' +
      '<div class="carte-blanche">' +
      '<label class="champ"><span>Prénom</span><input id="r-prenom" type="text" maxlength="20" value="' + esc(s.prenom || "") + '"></label>' +
      '<label class="champ"><span>Date de naissance</span><input id="r-naissance" type="date" value="' + esc(s.naissance || "") + '"></label>' +
      '<button class="btn-grand" id="r-save">Enregistrer</button></div>' +
      '<div class="carte-blanche">' +
      '<label class="ligne-toggle"><span>🔓 Mode découverte<br><small>Débloque les 12 mois d’un coup (pour regarder)</small></span>' +
      '<input type="checkbox" id="r-decouverte"' + (s.modeDecouverte ? " checked" : "") + "></label></div>" +
      '<div class="carte-blanche">' +
      "<p><b>Voyage commencé :</b> " + (s.debut ? moisCalendaire(0) : "—") + "<br>" +
      "<b>Mois en cours :</b> " + (Store.voyageTermine() ? "terminé 🏆" : (Store.moisCourant() + 1) + "/12") + "</p>" +
      '<button class="btn-secondaire" id="r-restart">🔁 Recommencer le voyage (bons remis à zéro)</button>' +
      '<button class="btn-danger" id="r-reset">🗑️ Tout effacer et repartir de zéro</button></div>' +
      '<p class="note-centre">Tempo · Mon voyage dans l’Histoire · v1<br>🔒 Toutes les données restent sur cet appareil.</p>' +
      "</main>" + navHtml("home");

    $("#r-save").addEventListener("click", () => {
      const p = $("#r-prenom").value.trim();
      if (p) s.prenom = p;
      s.naissance = $("#r-naissance").value || null;
      Store.save();
      go("#home");
    });
    $("#r-decouverte").addEventListener("change", e => Store.setModeDecouverte(e.target.checked));
    $("#r-restart").addEventListener("click", confirmerRecommencer);
    $("#r-reset").addEventListener("click", () => {
      ouvrirModale(
        "<h3>🗑️ Tout effacer ?</h3><p>Profil, bons utilisés et album de cartes seront supprimés de cet appareil. C’est définitif !</p>" +
        '<div class="modale-boutons">' +
        '<button class="btn-secondaire" onclick="fermerModale()">Annuler</button>' +
        '<button class="btn-danger" id="ok-reset">Oui, tout effacer</button></div>',
        ov => ov.querySelector("#ok-reset").addEventListener("click", () => {
          Store.toutEffacer();
          fermerModale();
          go("#onboarding");
          route();
        })
      );
    });
  }

  // ——— Démarrage ———
  window.addEventListener("hashchange", route);
  route();
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
