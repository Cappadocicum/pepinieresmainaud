// Sauvegarde locale : tout reste sur l'appareil (localStorage), rien n'est
// envoyé sur internet.
(function () {
  const KEY = "voyage-histoire-v1";

  const defaults = () => ({
    // Profil
    prenom: null,
    naissance: null, // "AAAA-MM-JJ"
    // Début du voyage : premier jour du mois de l'inscription
    debut: null, // "AAAA-MM-01"
    // Choix de bon par mois : { 0: {cat:"livre", date:"..."}, 1: {...} }
    choix: {},
    // Fiches "Le savais-tu ?" déjà retournées : ["prehistoire-3", ...]
    cartesVues: [],
    // Voyages terminés (tours complets)
    toursTermines: 0,
    // Mode découverte : débloque tous les mois (pour les parents)
    modeDecouverte: false,
    // Dernière position connue (pour la carte)
    position: null, // {lat, lng, label}
  });

  let state = defaults();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = Object.assign(defaults(), JSON.parse(raw));
  } catch (e) { /* stockage indisponible : l'appli marche quand même */ }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  // ——— Aide dates ———
  function moisEcoules() {
    // Nombre de mois complets écoulés depuis le début du voyage (0 = 1er mois)
    if (!state.debut) return 0;
    const d = new Date(state.debut + "T00:00:00");
    const now = new Date();
    return (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
  }

  const api = {
    get: () => state,
    save,

    creerProfil(prenom, naissance) {
      state.prenom = prenom;
      state.naissance = naissance || null;
      const now = new Date();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      state.debut = now.getFullYear() + "-" + mm + "-01";
      save();
    },

    age() {
      if (!state.naissance) return null;
      const n = new Date(state.naissance + "T00:00:00");
      if (isNaN(n)) return null;
      const now = new Date();
      let a = now.getFullYear() - n.getFullYear();
      const m = now.getMonth() - n.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < n.getDate())) a--;
      return (a >= 0 && a < 120) ? a : null;
    },

    // Index (0-11) du mois en cours dans le voyage
    moisCourant() {
      if (state.modeDecouverte) return 11;
      return Math.min(moisEcoules(), 11);
    },
    moisEcoules,
    voyageTermine() { return moisEcoules() > 11; },

    // Un mois est-il accessible ?
    estDebloque(i) { return state.modeDecouverte || i <= Math.min(moisEcoules(), 11); },

    // ——— Bons / choix du mois ———
    choixDuMois(i) { return state.choix[i] || null; },
    bonsRestants(catId) {
      const utilises = Object.values(state.choix).filter(c => c.cat === catId).length;
      return Math.max(0, window.BONS_PAR_CATEGORIE - utilises);
    },
    utiliserBon(moisIndex, catId) {
      if (state.choix[moisIndex]) return false;
      if (api.bonsRestants(catId) <= 0) return false;
      state.choix[moisIndex] = { cat: catId, date: new Date().toISOString().slice(0, 10) };
      save();
      return true;
    },

    // ——— Cartes "Le savais-tu ?" ———
    carteVue(slug, jour) {
      const id = slug + "-" + jour;
      if (!state.cartesVues.includes(id)) { state.cartesVues.push(id); save(); }
    },
    estVue(slug, jour) { return state.cartesVues.includes(slug + "-" + jour); },
    nbCartesVues() { return state.cartesVues.length; },

    setPosition(pos) { state.position = pos; save(); },
    setModeDecouverte(on) { state.modeDecouverte = !!on; save(); },

    recommencerVoyage() {
      // Nouveau tour : on garde le profil et les cartes, on remet les bons à zéro
      state.toursTermines += 1;
      state.choix = {};
      const now = new Date();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      state.debut = now.getFullYear() + "-" + mm + "-01";
      save();
    },

    toutEffacer() {
      state = defaults();
      try { localStorage.removeItem(KEY); } catch (e) {}
    },
  };

  window.Store = api;
})();
