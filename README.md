# 🦁 Le Zoo de Lucas & Logan

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

## 🎤 Le principe

- Le zoo contient **50 animaux**, rangés du plus simple au plus rare :
  - 🐐 **La ferme** (chèvre, cochon, vache, mouton, poule…)
  - 🦊 **La forêt** (renard, cerf, loup, hibou…)
  - 🦁 **La savane & le grand zoo** (lion, éléphant, girafe, singe…)
  - 🐼 **Les exotiques rares** (panda, tigre blanc, ours polaire, dauphin…)
- Chaque animal commence **sans voix** (grisé, avec une icône 🎤).
- Ouvre-le, appuie sur **Enregistrer**, fais ta voix la plus drôle, puis
  **Stop**. Tu peux **Écouter**, **Effacer** et **Réenregistrer** autant
  que tu veux.
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

- 100 % HTML / CSS / JavaScript, **aucune dépendance**, aucun build.
- Carte et personnage dessinés sur `<canvas>`. Les vignettes des animaux
  sont de gros **emoji** sur des cartes colorées (joli, lisible pour les
  enfants, fonctionne hors-ligne et sans clé API).
- Enregistrement via `MediaRecorder`, lecture par proximité via la
  Web Audio API (volume + panoramique selon la position).

### Fichiers

```
index.html              écran de jeu + panneaux
styles.css              style "jeu pour enfants"
icon.svg                icône de l'appli
manifest.webmanifest    appli installable (PWA)
sw.js                   cache hors-ligne
js/config.js            réglages de la carte
js/animals.js           la liste des 50 animaux
js/storage.js           sauvegarde (IndexedDB + localStorage)
js/audio.js             enregistrement + lecture par proximité / cacophonie
js/world.js             génération et rendu du zoo
js/player.js            le personnage
js/ui.js                panneaux, enregistrement, réglages
js/game.js              boucle de jeu, caméra, entrées
```

Bon zoo, et bonnes voix rigolotes ! 🐮🐷🐸🦒
