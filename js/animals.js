// Liste des 50 animaux, du plus simple (la ferme) au plus rare (exotiques).
// ground : grass | sand | water | snow  (décor de l'enclos)
// tier   : ferme | foret | savane | exotique
const TIERS = {
  ferme:    { label: "Ferme · Facile",      color: "#cdebb0" },
  foret:    { label: "Forêt · Commun",      color: "#bfe3c0" },
  savane:   { label: "Savane · Moyen",      color: "#f2e0a6" },
  exotique: { label: "Exotique · Rare",     color: "#e9c9f2" },
};

const ANIMALS = [
  // --- La ferme (faciles) ---
  { id: "chevre",   name: "Chèvre",        emoji: "🐐", tier: "ferme", ground: "grass" },
  { id: "cochon",   name: "Cochon",        emoji: "🐷", tier: "ferme", ground: "grass" },
  { id: "vache",    name: "Vache",         emoji: "🐄", tier: "ferme", ground: "grass" },
  { id: "mouton",   name: "Mouton",        emoji: "🐑", tier: "ferme", ground: "grass" },
  { id: "poule",    name: "Poule",         emoji: "🐔", tier: "ferme", ground: "grass" },
  { id: "coq",      name: "Coq",           emoji: "🐓", tier: "ferme", ground: "grass" },
  { id: "canard",   name: "Canard",        emoji: "🦆", tier: "ferme", ground: "water" },
  { id: "oie",      name: "Oie",           emoji: "🪿", tier: "ferme", ground: "water" },
  { id: "lapin",    name: "Lapin",         emoji: "🐰", tier: "ferme", ground: "grass" },
  { id: "cheval",   name: "Cheval",        emoji: "🐴", tier: "ferme", ground: "grass" },
  { id: "ane",      name: "Âne",           emoji: "🫏", tier: "ferme", ground: "grass" },
  { id: "chien",    name: "Chien",         emoji: "🐶", tier: "ferme", ground: "grass" },
  { id: "chat",     name: "Chat",          emoji: "🐱", tier: "ferme", ground: "grass" },
  { id: "dindon",   name: "Dindon",        emoji: "🦃", tier: "ferme", ground: "grass" },
  { id: "souris",   name: "Souris",        emoji: "🐭", tier: "ferme", ground: "grass" },

  // --- La forêt (communs) ---
  { id: "renard",      name: "Renard",        emoji: "🦊", tier: "foret", ground: "grass" },
  { id: "ecureuil",    name: "Écureuil",      emoji: "🐿️", tier: "foret", ground: "grass" },
  { id: "herisson",    name: "Hérisson",      emoji: "🦔", tier: "foret", ground: "grass" },
  { id: "cerf",        name: "Cerf",          emoji: "🦌", tier: "foret", ground: "grass" },
  { id: "sanglier",    name: "Sanglier",      emoji: "🐗", tier: "foret", ground: "grass" },
  { id: "loup",        name: "Loup",          emoji: "🐺", tier: "foret", ground: "grass" },
  { id: "oursbrun",    name: "Ours brun",     emoji: "🐻", tier: "foret", ground: "grass" },
  { id: "hibou",       name: "Hibou",         emoji: "🦉", tier: "foret", ground: "grass" },
  { id: "chauvesouris",name: "Chauve-souris", emoji: "🦇", tier: "foret", ground: "grass" },
  { id: "grenouille",  name: "Grenouille",    emoji: "🐸", tier: "foret", ground: "water" },

  // --- La savane et le grand zoo (moyens) ---
  { id: "lion",        name: "Lion",          emoji: "🦁", tier: "savane", ground: "sand" },
  { id: "tigre",       name: "Tigre",         emoji: "🐯", tier: "savane", ground: "sand" },
  { id: "elephant",    name: "Éléphant",      emoji: "🐘", tier: "savane", ground: "sand" },
  { id: "girafe",      name: "Girafe",        emoji: "🦒", tier: "savane", ground: "sand" },
  { id: "zebre",       name: "Zèbre",         emoji: "🦓", tier: "savane", ground: "sand" },
  { id: "hippopotame", name: "Hippopotame",   emoji: "🦛", tier: "savane", ground: "water" },
  { id: "rhinoceros",  name: "Rhinocéros",    emoji: "🦏", tier: "savane", ground: "sand" },
  { id: "singe",       name: "Singe",         emoji: "🐵", tier: "savane", ground: "grass" },
  { id: "gorille",     name: "Gorille",       emoji: "🦍", tier: "savane", ground: "grass" },
  { id: "crocodile",   name: "Crocodile",     emoji: "🐊", tier: "savane", ground: "water" },
  { id: "serpent",     name: "Serpent",       emoji: "🐍", tier: "savane", ground: "sand" },
  { id: "flamant",     name: "Flamant rose",  emoji: "🦩", tier: "savane", ground: "water" },
  { id: "paon",        name: "Paon",          emoji: "🦚", tier: "savane", ground: "grass" },
  { id: "perroquet",   name: "Perroquet",     emoji: "🦜", tier: "savane", ground: "grass" },
  { id: "kangourou",   name: "Kangourou",     emoji: "🦘", tier: "savane", ground: "sand" },

  // --- Les exotiques (rares) ---
  { id: "panda",       name: "Panda",         emoji: "🐼", tier: "exotique", ground: "grass" },
  { id: "koala",       name: "Koala",         emoji: "🐨", tier: "exotique", ground: "grass" },
  { id: "paresseux",   name: "Paresseux",     emoji: "🦥", tier: "exotique", ground: "grass" },
  { id: "pingouin",    name: "Pingouin",      emoji: "🐧", tier: "exotique", ground: "snow" },
  { id: "ourspolaire", name: "Ours polaire",  emoji: "🐻‍❄️", tier: "exotique", ground: "snow" },
  { id: "tigreblanc",  name: "Tigre blanc",   emoji: "🐅", tier: "exotique", ground: "snow" },
  { id: "leopard",     name: "Léopard",       emoji: "🐆", tier: "exotique", ground: "sand" },
  { id: "dauphin",     name: "Dauphin",       emoji: "🐬", tier: "exotique", ground: "water" },
  { id: "baleine",     name: "Baleine",       emoji: "🐳", tier: "exotique", ground: "water" },
  { id: "tortue",      name: "Tortue",        emoji: "🐢", tier: "exotique", ground: "water" },
];
