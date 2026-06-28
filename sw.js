// Service worker minimal : met l'appli en cache pour un usage hors-ligne.
// (Les voix enregistrées restent dans IndexedDB, pas ici.)
const CACHE = "zoo-ll-v9";
const ASSETS = [
  "./", "./index.html", "./styles.css", "./manifest.webmanifest", "./icon.svg",
  "./js/config.js", "./js/animals.js", "./js/images.js", "./js/storage.js",
  "./js/audio.js", "./js/world.js", "./js/player.js", "./js/ui.js", "./js/game.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).then((res) => {
        // Cache au vol les ressources locales (images générées, etc.)
        if (res.ok && new URL(e.request.url).origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      }).catch(() => hit);
    })
  );
});
