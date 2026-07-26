# Générer les cartes Tempo restantes depuis votre machine (PowerShell)

Il reste **162 illustrations** à générer (Vikings jours 25-31, puis Moyen Âge,
Renaissance, Temps Modernes, Révolution et Notre époque en entier). Les
prompts sont **déjà construits** dans `cartes-restantes.json` — identiques en
style aux 210 cartes déjà en ligne, pour une cohérence parfaite.

## Marche à suivre

```powershell
# 1. Récupérer le dépôt (ou le mettre à jour)
git clone https://github.com/Cappadocicum/pepinieresmainaud.git
cd pepinieresmainaud            # (ou : git pull si déjà cloné)

# 2. Donner la clé Gemini (celle d'AI Studio, plafond de dépenses relevé
#    sur https://ai.studio/spend)
$env:GEMINI_API_KEY = "votre_cle"

# 3. Lancer la génération (reprenable : relancez-le après toute interruption,
#    les images déjà faites sont sautées)
.\generation\generate-cartes.ps1

# 4. Envoyer les images générées
git add generation/sorties
git commit -m "Cartes generees (lots 7 a 12)"
git push
```

Puis demandez à Claude : « les images sont poussées, intègre-les » — il
convertit en WebP optimisé, met à jour le manifeste thème par thème et
déploie sur https://tempo-voyage-histoire.netlify.app.

## Détails

- ~20-40 s par image, comptez 1h30 à 2h pour les 162 (le script fait une
  pause de 2 s entre chaque appel pour respecter les limites de débit).
- `-Limite 31` permet de générer par petits lots.
- En cas de « spend cap » ou de quota atteint, le script s'arrête proprement ;
  relancez-le plus tard, il reprend où il en était.
- Les images sont écrites dans `generation/sorties/<theme>/<jour>.png`
  (~400-600 Ko chacune). Ce dossier n'est pas publié sur le site : seules
  les versions WebP intégrées par Claude le sont.
