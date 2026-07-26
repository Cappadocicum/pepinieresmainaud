# 🎈 Tempo — Mon voyage dans l'Histoire

**Tempo**, l'application du cahier « Mon Voyage dans l'Histoire » : un voyage de
**12 mois à travers l'Histoire** pour les enfants de 4 à 10 ans, à vivre
avec leurs parents.

C'est une **application web installable (PWA)** : elle s'utilise dans le
navigateur sur ordinateur, et s'installe comme une vraie appli sur
smartphone et tablette (« Ajouter à l'écran d'accueil »). Aucun compte,
aucune donnée envoyée sur internet : tout reste sur l'appareil.

## ✨ Ce que fait l'appli

- **Inscription toute simple** : prénom + date de naissance de l'enfant,
  puis « Bienvenue dans Mon Voyage dans l'Histoire ! ».
- **12 thèmes, un par mois, dans l'ordre chronologique** (repris du cahier) :
  Le commencement, la Préhistoire, l'Égypte antique, la Grèce antique, la
  Rome antique, les Gaulois, les Vikings, le Moyen Âge, la Renaissance, les
  Temps modernes, la Révolution, Notre époque. Le voyage démarre **le mois
  de l'inscription**, quel que soit le mois de l'année.
- **12 bons à coller** comme dans le cahier : 4 familles (🏛️ Musée,
  📚 Livre, 🚌 Sortie, 🎲 Activité/Jeu) × 3 bons. Chaque mois, l'enfant
  choisit **un** bon, « colle son sticker » sur le thème du mois, et l'appli
  devient force de proposition :
  - **Livre** → sélection de livres adaptés (4-10 ans, mis en avant selon
    l'âge de l'enfant) + recherche des **librairies autour de soi** (avec
    horaires quand ils sont connus) ;
  - **Activité/Jeu** → kits (fouille de fossiles…), activités maison,
    jardin, cuisine et jeux, par thème ;
  - **Musée / Sortie** → **sélection de plus de 60 lieux en France**
    (Grottes du Cerdon, Lascaux IV, Guédelon, Alésia, Versailles, Vizille…)
    triés par distance, + tous les musées autour de soi via OpenStreetMap.
- **Une carte « Le savais-tu ? » chaque jour** : 31 fiches par thème
  (**372 en tout**), façon carte à collectionner (grande image en haut,
  petite phrase en bas), à ranger dans **l'album**.
- **La zone Carte** 📍 : géolocalisation (ou recherche de ville), carte
  interactive OpenStreetMap, lieux conseillés du thème, musées et
  librairies à proximité, itinéraire en un clic.
- **Frise du voyage** : les 12 mois sous forme de parcours, les mois futurs
  restent verrouillés (mystère !), les stickers apparaissent sur les mois
  faits.
- **Fin du voyage** : écran bravo 🏆 et possibilité de repartir pour un
  tour (les bons sont remis à zéro, l'album est conservé).
- **Coin des parents** ⚙️ : modifier le profil, mode découverte (tout
  débloquer pour regarder), recommencer, tout effacer.

## ▶️ Essayer en local

```bash
cd voyage-histoire
python3 -m http.server 8080
# puis ouvrir http://localhost:8080
```

> Astuce : dans Réglages, activer le **mode découverte** pour voir les
> 12 mois sans attendre un an 😉. La géolocalisation nécessite
> `localhost` ou HTTPS.

## 🚀 Déployer sur Netlify

1. [app.netlify.com](https://app.netlify.com) → **Add new site** →
   **Import an existing project** → GitHub → ce dépôt.
2. Branche : celle qui contient ce dossier. **Base directory** :
   `voyage-histoire`. Aucune commande de build, publication : `.`.
3. L'URL `https://….netlify.app` obtenue s'installe ensuite sur le
   téléphone (« Ajouter à l'écran d'accueil »).

## 🛠️ Architecture

100 % HTML/CSS/JavaScript, aucun build, aucune dépendance à l'exécution
(Leaflet est chargé depuis un CDN uniquement pour la carte, avec repli en
liste hors-ligne).

```
index.html                  point d'entrée (une seule page)
styles.css                  style « cahier coloré » pour enfants
icon.svg                    icône (montgolfière-horloge)
manifest.webmanifest        installation PWA
sw.js                       cache hors-ligne
js/app.js                   écrans + navigation (accueil, voyage, thème,
                            carte, album, bons, réglages)
js/storage.js               sauvegarde locale (profil, bons, album)
js/map.js                   géolocalisation, Leaflet, lieux, Overpass/Nominatim
js/data/themes.js           les 12 thèmes + les 4 familles de bons
js/data/books.js            idées de livres par thème (avec âges)
js/data/activities.js       idées d'activités/kits/jeux par thème
js/data/places.js           64 lieux en France géolocalisés, par thème
js/data/facts/*.js          12 × 31 fiches « Le savais-tu ? »
```

### Sources en ligne (uniquement pour la zone carte)

- Fond de carte et marqueurs : OpenStreetMap + Leaflet (CDN unpkg)
- Musées/librairies à proximité : API Overpass (horaires si renseignés)
- Recherche de ville : Nominatim

## 🗺️ Pistes pour la suite

- Vraies illustrations sur les cartes (générées par IA comme pour le zoo,
  script à ajouter dans `scripts/`).
- D'autres voyages : les sciences, les arts, la géographie… la structure
  (thèmes/fiches/lieux) est prête pour ça.
- Notifications « ta carte du jour est arrivée ! » (PWA).
- Partage de l'album ou impression des bons.
