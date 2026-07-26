// Cache hors-ligne : l'appli et tout son contenu (fiches, lieux, idées)
// fonctionnent sans connexion. Seuls la carte interactive et « autour de
// moi » demandent internet.
const CACHE = "tempo-v2";
const FICHIERS = [
  "./",
  "index.html",
  "styles.css",
  "icon.svg",
  "manifest.webmanifest",
  "js/storage.js",
  "js/map.js",
  "js/app.js",
  "js/data/themes.js",
  "js/data/books.js",
  "js/data/activities.js",
  "js/data/places.js",
  "js/data/facts/commencement.js",
  "js/data/facts/prehistoire.js",
  "js/data/facts/egypte.js",
  "js/data/facts/grece.js",
  "js/data/facts/rome.js",
  "js/data/facts/gaulois.js",
  "js/data/facts/vikings.js",
  "js/data/facts/moyen-age.js",
  "js/data/facts/renaissance.js",
  "js/data/facts/temps-modernes.js",
  "js/data/facts/revolution.js",
  "js/data/facts/notre-epoque.js",
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  // On ne met en cache que nos propres fichiers ; les API (Overpass,
  // Nominatim, tuiles) passent toujours par le réseau.
  if (url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then(hit =>
      hit ||
      fetch(e.request).then(resp => {
        if (resp.ok && e.request.method === "GET") {
          const copie = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, copie));
        }
        return resp;
      }).catch(() => caches.match("index.html"))
    )
  );
});
