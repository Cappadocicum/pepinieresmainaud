// Configuration globale du jeu
const CFG = {
  TILE: 44,            // taille d'une case en pixels
  MARGIN: 2,           // marge (en cases) autour du zoo
  ENC_W: 5,            // largeur d'un enclos (cases)
  ENC_H: 4,            // hauteur d'un enclos (cases)
  PATH_X: 2,           // allée verticale entre enclos (cases)
  PATH_Y: 3,           // allée horizontale entre enclos (cases)
  COLS: 6,             // nombre d'enclos par rangée
  PLAYER_SPEED: 185,   // vitesse du personnage (px/s)
  INTERACT_RADIUS: 1.7,            // distance (cases) pour ouvrir un enclos
  DEFAULT_TRIGGER_RADIUS: 3.0,     // distance (cases) pour déclencher la voix
};

// Petit utilitaire : rectangle arrondi
function roundRect(ctx, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
