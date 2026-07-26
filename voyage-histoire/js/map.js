// Carte et géolocalisation.
// - Fond de carte + marqueurs : Leaflet (chargé depuis un CDN, avec repli
//   en liste si hors-ligne).
// - Lieux conseillés : base locale (js/data/places.js), triée par distance.
// - Autour de moi : librairies et musées trouvés en direct via
//   l'API Overpass (OpenStreetMap), horaires inclus quand ils existent.
// - Recherche de ville : Nominatim (OpenStreetMap).
(function () {
  const R = 6371; // km
  function distanceKm(a, b) {
    const dLat = (b.lat - a.lat) * Math.PI / 180;
    const dLng = (b.lng - a.lng) * Math.PI / 180;
    const la1 = a.lat * Math.PI / 180, la2 = b.lat * Math.PI / 180;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  function formatKm(km) {
    if (km < 1) return Math.round(km * 1000) + " m";
    if (km < 100) return (Math.round(km * 10) / 10).toLocaleString("fr-FR") + " km";
    return Math.round(km).toLocaleString("fr-FR") + " km";
  }

  // ——— Géolocalisation ———
  function localiser() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error("geo-indisponible"));
      navigator.geolocation.getCurrentPosition(
        p => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, label: "Ma position" }),
        () => reject(new Error("geo-refusee")),
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 }
      );
    });
  }

  // ——— Recherche de ville (Nominatim) ———
  async function chercherVille(q) {
    const url = "https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=fr,be,ch&q=" + encodeURIComponent(q);
    const r = await fetch(url, { headers: { "Accept-Language": "fr" } });
    if (!r.ok) throw new Error("nominatim");
    const data = await r.json();
    if (!data.length) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), label: (data[0].display_name || q).split(",")[0] };
  }

  // ——— Autour de moi : Overpass (OpenStreetMap) ———
  // kind: "librairie" | "musee"
  async function chercherAutour(pos, kind, rayonKm) {
    const r = Math.round((rayonKm || 15) * 1000);
    const filtre = kind === "librairie"
      ? '(node["shop"="books"](around:' + r + "," + pos.lat + "," + pos.lng + ');way["shop"="books"](around:' + r + "," + pos.lat + "," + pos.lng + "););"
      : '(node["tourism"="museum"](around:' + r + "," + pos.lat + "," + pos.lng + ');way["tourism"="museum"](around:' + r + "," + pos.lat + "," + pos.lng + "););";
    const query = "[out:json][timeout:15];" + filtre + "out center tags 40;";
    const resp = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: "data=" + encodeURIComponent(query),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    if (!resp.ok) throw new Error("overpass");
    const data = await resp.json();
    return (data.elements || [])
      .map(e => {
        const lat = e.lat != null ? e.lat : (e.center && e.center.lat);
        const lng = e.lon != null ? e.lon : (e.center && e.center.lon);
        if (lat == null || !e.tags || !e.tags.name) return null;
        return {
          nom: e.tags.name,
          lat, lng,
          horaires: e.tags.opening_hours || null,
          ville: e.tags["addr:city"] || "",
          adresse: [e.tags["addr:housenumber"], e.tags["addr:street"]].filter(Boolean).join(" "),
          dist: distanceKm(pos, { lat, lng }),
          kind,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 20);
  }

  // ——— Lieux conseillés (base locale) ———
  function lieuxDuTheme(slug, pos, types) {
    let list = window.PLACES.filter(p => p.slug === slug);
    if (types && types.length) list = list.filter(p => types.includes(p.type));
    list = list.map(p => Object.assign({}, p, { dist: pos ? distanceKm(pos, p) : null }));
    if (pos) list.sort((a, b) => a.dist - b.dist);
    return list;
  }

  // ——— Leaflet ———
  let leafletPromise = null;
  function chargerLeaflet() {
    if (window.L) return Promise.resolve(window.L);
    if (leafletPromise) return leafletPromise;
    leafletPromise = new Promise((resolve, reject) => {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(css);
      const s = document.createElement("script");
      s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      s.onload = () => resolve(window.L);
      s.onerror = () => { leafletPromise = null; reject(new Error("leaflet")); };
      document.head.appendChild(s);
    });
    return leafletPromise;
  }

  let carte = null;
  let calqueMarqueurs = null;

  async function afficherCarte(elId, pos, points) {
    const L = await chargerLeaflet();
    const el = document.getElementById(elId);
    if (!el) return null;
    if (carte) { try { carte.remove(); } catch (e) {} carte = null; }
    const centre = pos || { lat: 46.6, lng: 2.4 }; // centre France par défaut
    carte = L.map(elId).setView([centre.lat, centre.lng], pos ? 9 : 6);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(carte);
    calqueMarqueurs = L.layerGroup().addTo(carte);
    if (pos) {
      L.circleMarker([pos.lat, pos.lng], { radius: 8, color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 0.9 })
        .addTo(calqueMarqueurs).bindPopup("📍 " + (pos.label || "Ma position"));
    }
    poserMarqueurs(points || []);
    return carte;
  }

  function poserMarqueurs(points) {
    if (!carte || !window.L || !calqueMarqueurs) return;
    points.forEach(p => {
      const emoji = p.kind === "librairie" ? "📚" : (p.type === "parc" ? "🎡" : p.type === "site" ? "🏰" : "🏛️");
      const icon = window.L.divIcon({
        className: "emoji-pin",
        html: '<div class="emoji-pin-in">' + emoji + "</div>",
        iconSize: [34, 34],
        iconAnchor: [17, 30],
      });
      const gmaps = "https://www.google.com/maps/dir/?api=1&destination=" + p.lat + "," + p.lng;
      const html = "<b>" + p.nom + "</b><br>" + (p.ville || "") +
        (p.dist != null ? "<br>À " + formatKm(p.dist) : "") +
        (p.horaires ? "<br>🕐 " + p.horaires : "") +
        '<br><a href="' + gmaps + '" target="_blank" rel="noopener">🧭 Itinéraire</a>';
      window.L.marker([p.lat, p.lng], { icon }).addTo(calqueMarqueurs).bindPopup(html);
    });
  }

  function recentrer(pos, zoom) {
    if (carte && pos) carte.setView([pos.lat, pos.lng], zoom || 9);
  }

  window.Carte = { distanceKm, formatKm, localiser, chercherVille, chercherAutour, lieuxDuTheme, afficherCarte, poserMarqueurs, recentrer };
})();
