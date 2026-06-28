# 🦁 Le Zoo de Luca & Logan

Un petit jeu rigolo pour les enfants, à la manière des vieux Pokémon / Zelda
sur Game Boy : on se promène dans un zoo vu de dessus avec un petit
personnage, et **on enregistre soi-même la voix complètement improbable de
chaque animal** 😄. Quand on passe à côté d'un animal, sa voix se déclenche !

C'est une **application web** (rien à installer, aucun compte, aucune donnée
envoyée sur internet — tout reste sur l'appareil).

## ▶️ Comment jouer

1. Lance un petit serveur web local (obligatoire pour le micro) :

   ```bash
   # avec Python (déjà installé presque partout)
   python3 -m http.server 8080
   ```

   Puis ouvre **http://localhost:8080** dans le navigateur.

   > Le micro ne fonctionne **que** sur `localhost` ou en `https://`.
   > Ouvrir le fichier `index.html` en double-cliquant (`file://`) ne
   > permettra pas d'enregistrer le son.

2. Sur le téléphone / la tablette, héberge le dossier (par ex. avec
   `npx serve` ou tout petit hébergement HTTPS) et ouvre l'adresse. Tu peux
   ensuite **« Ajouter à l'écran d'accueil »** : ça devient une vraie petite
   appli plein écran (PWA).

### Commandes

- **Se déplacer** : flèches du clavier ou **ZQSD / WASD**, ou la **croix
  tactile** en bas à gauche.
- **Ouvrir un animal** : touche l'animal sur la carte, ou approche-toi et
  appuie sur le **bouton 🎤** (ou la touche `E` / `Espace`).

## 🗺️ La carte

Un **monde ouvert** vu de dessus, inspiré de *Zelda: A Link to the Past* :
grandes prairies, **rivières** qui serpentent, **ponts**, forêts d'arbres et
fleurs. La carte est volontairement dégagée pour te laisser construire ton zoo
où tu veux.

## 🏗️ Construire ton zoo (bouton 🏗️)

Le zoo démarre **vide** : c'est toi qui places les enclos !

1. Appuie sur **🏗️** en haut à droite → la **palette des 50 animaux**
   apparaît.
2. Touche l'animal voulu → un **aperçu d'enclos** apparaît au centre.
3. Choisis la **Taille** (Petit → Géant) et le **Nombre** d'animaux dans
   l'enclos (jusqu'à 8 du même animal).
4. **Fais glisser la carte** pour viser l'endroit (vert = OK, rouge = occupé),
   puis **✓ Placer ici**. Le bouton **🎯** recentre la vue sur ton personnage.
5. Le **sentier de terre se dessine tout seul** entre les enclos posés (avec
   des **ponts** quand il traverse une rivière).
6. Touche un enclos déjà posé pour le **déplacer** ou le **retirer** 🗑️.
7. **✓ Terminé** pour repasser en mode promenade.

## 🎤 Les voix

- Les 50 animaux vont de la ferme (🐐 chèvre, cochon, vache…) jusqu'aux plus
  rares (🐼 panda, tigre blanc, ours polaire, dauphin…).
- Un animal posé commence **sans voix** (grisé, icône 🎤).
- Touche-le, **Enregistrer**, fais ta voix la plus drôle, puis **Stop**.
  Tu peux **Écouter**, **Effacer** et **Réenregistrer** autant que tu veux.
- En te promenant, dès que tu passes **près** d'un animal qui a une voix,
  elle se déclenche (le volume dépend de la distance).

## ⚙️ Réglages (bouton engrenage)

- **📢 Tout faire crier en même temps** : mode « cacophonie » — toutes les
  voix tournent en boucle en même temps (le bouton 📢 de la barre du haut
  fait la même chose en un clic).
- **🔊 Volume général**.
- **📏 Distance de déclenchement** : à quelle distance les voix s'activent.
- **🗑️ Tout effacer** : remet toutes les voix à zéro.

## 💾 Où sont stockées les voix ?

- Les enregistrements sont gardés dans le **navigateur** (IndexedDB) de
  l'appareil, et les réglages dans `localStorage`. **Rien n'est partagé ni
  envoyé en ligne.** Vider les données du site efface les voix.

## 🛠️ Détails techniques

- 100 % HTML / CSS / JavaScript côté jeu, **aucune dépendance à l'exécution**,
  aucun build.
- Carte et personnage dessinés sur `<canvas>`. Les **portraits des 50 animaux**,
  les **textures de sol** et les **décors** sont des images générées par IA
  (Gemini) et stockées dans `assets/`. Si ces images sont absentes, le jeu
  retombe automatiquement sur des emoji et des couleurs unies.
- Enregistrement via `MediaRecorder`, lecture par proximité via la
  Web Audio API (volume + panoramique selon la position).

### Fichiers

```
index.html              écran de jeu + panneaux
styles.css              style "jeu pour enfants"
icon.svg                icône de l'appli
manifest.webmanifest    appli installable (PWA)
netlify.toml            config de déploiement Netlify
sw.js                   cache hors-ligne
assets/                 images générées (portraits, textures, décors) + manifest
scripts/generate-visuals.mjs   (re)génération des images via Gemini
js/config.js            réglages de la carte
js/animals.js           la liste des 50 animaux
js/images.js            chargement des images générées (avec repli emoji)
js/storage.js           sauvegarde (IndexedDB + localStorage)
js/audio.js             enregistrement + lecture par proximité / cacophonie
js/world.js             génération et rendu du zoo
js/player.js            le personnage
js/ui.js                panneaux, enregistrement, réglages
js/game.js              boucle de jeu, caméra, entrées
```

## 🚀 Déployer sur Netlify (recommandé)

Netlify sert le site en **HTTPS**, ce qui est nécessaire pour le micro et pour
l'installation en appli (PWA). Le repo est déjà prêt (`netlify.toml`).

1. Va sur [app.netlify.com](https://app.netlify.com) → **Add new site** →
   **Import an existing project** → **GitHub**.
2. Autorise Netlify puis choisis le dépôt `cappadocicum/pepinieresmainaud`.
3. Sélectionne la branche `claude/lucas-logan-zoo-game-9hvtb4`
   (ou fusionne-la dans `main` et choisis `main`).
4. Laisse les réglages par défaut (aucune commande de build, dossier de
   publication `.`) → **Deploy**.
5. Tu obtiens une URL en `https://…netlify.app`. Ouvre-la sur le téléphone,
   puis **« Ajouter à l'écran d'accueil »** pour une vraie appli plein écran.

> Chaque `git push` sur la branche connectée redéploie automatiquement.
> Alternative express sans GitHub : glisse le dossier du projet sur
> [app.netlify.com/drop](https://app.netlify.com/drop).

## 🎨 (Re)générer les visuels avec Gemini

Les images sont déjà incluses dans `assets/`. Pour les régénérer (autre style,
nouveaux animaux, etc.) :

```bash
npm install                                   # installe sharp (génération uniquement)
export GEMINI_API_KEY="votre_cle_google_ai"   # clé Google AI Studio
npm run generate                              # 50 animaux + 4 textures + 3 décors
# options : --limit N | --only animaux|textures|props | --force
```

Le script `scripts/generate-visuals.mjs` appelle le modèle
`gemini-2.5-flash-image`, détoure le fond des portraits (transparence) et
redimensionne/compresse les images, puis met à jour `assets/manifest.json`.
La clé n'est lue que depuis la variable d'environnement et n'est jamais écrite
sur le disque.

Bon zoo, et bonnes voix rigolotes ! 🐮🐷🐸🦒
