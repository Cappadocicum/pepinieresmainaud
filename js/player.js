// Le personnage joueur : déplacement, collisions et dessin.
const Player = {
  x: 0, y: 0,
  dir: "down",
  moving: false,
  _saveT: 0,

  spawn() {
    const saved = SaveState.loadPlayer();
    if (saved && saved.x && saved.y && !World.isSolidPx(saved.x, saved.y)) {
      this.x = saved.x; this.y = saved.y;
    } else {
      this.x = (CFG.MARGIN + (CFG.COLS * World.blockW) / 2) * CFG.TILE;
      this.y = 1.2 * CFG.TILE;
    }
  },

  update(dt, input) {
    let vx = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    let vy = (input.down ? 1 : 0) - (input.up ? 1 : 0);
    this.moving = vx !== 0 || vy !== 0;

    if (this.moving) {
      const len = Math.hypot(vx, vy) || 1;
      vx /= len; vy /= len;
      if (Math.abs(vx) > Math.abs(vy)) this.dir = vx > 0 ? "right" : "left";
      else this.dir = vy > 0 ? "down" : "up";

      const step = CFG.PLAYER_SPEED * dt;
      this._tryMove(vx * step, 0);
      this._tryMove(0, vy * step);

      this._saveT += dt;
      if (this._saveT > 1.2) { this._saveT = 0; SaveState.savePlayer(this.x, this.y); }
    }
  },

  // boîte de collision "aux pieds"
  _hits(x, y) {
    const hw = 13, top = 4, bot = 16;
    return (
      World.isSolidPx(x - hw, y + top) || World.isSolidPx(x + hw, y + top) ||
      World.isSolidPx(x - hw, y + bot) || World.isSolidPx(x + hw, y + bot)
    );
  },

  _tryMove(dx, dy) {
    const nx = this.x + dx, ny = this.y + dy;
    if (!this._hits(nx, ny)) { this.x = nx; this.y = ny; }
  },

  draw(ctx, t) {
    const x = this.x, y = this.y;
    const walk = this.moving ? Math.sin(t / 90) : 0;

    // ombre
    ctx.fillStyle = "rgba(0,0,0,.22)";
    ctx.beginPath();
    ctx.ellipse(x, y + 20, 16, 6, 0, 0, 7);
    ctx.fill();

    // jambes
    ctx.fillStyle = "#3b2f6b";
    ctx.fillRect(x - 9, y + 8 + walk * 2, 7, 12);
    ctx.fillRect(x + 2, y + 8 - walk * 2, 7, 12);

    // corps (salopette d'explorateur)
    ctx.fillStyle = "#3a86ff";
    roundRect(ctx, x - 13, y - 8, 26, 22, 8);
    ctx.fill();
    ctx.fillStyle = "#2f6fd6";
    roundRect(ctx, x - 13, y + 4, 26, 10, 6);
    ctx.fill();

    // tête
    ctx.fillStyle = "#f6c79b";
    ctx.beginPath();
    ctx.arc(x, y - 16, 12, 0, 7);
    ctx.fill();

    // chapeau de safari
    ctx.fillStyle = "#7a5b2e";
    ctx.beginPath();
    ctx.ellipse(x, y - 22, 17, 6, 0, 0, 7); // bord
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y - 25, 10, Math.PI, 2 * Math.PI); // calotte
    ctx.fill();

    // yeux selon la direction
    ctx.fillStyle = "#222";
    if (this.dir !== "up") {
      let ox = 0;
      if (this.dir === "left") ox = -4;
      if (this.dir === "right") ox = 4;
      ctx.beginPath(); ctx.arc(x - 4 + ox, y - 15, 2, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(x + 4 + ox, y - 15, 2, 0, 7); ctx.fill();
    }
  },
};
