// Construction et rendu du monde (carte vue de dessus).
const World = {
  enclosures: [],
  solid: new Set(),
  W: 0, H: 0,
  blockW: 0, blockH: 0,
  rows: 0,
  decos: [],   // arbres/fleurs décoratifs { x, y, e, s }

  build() {
    const { MARGIN, ENC_W, ENC_H, PATH_X, PATH_Y, COLS, TILE } = CFG;
    this.blockW = ENC_W + PATH_X;
    this.blockH = ENC_H + PATH_Y;
    this.rows = Math.ceil(ANIMALS.length / COLS);
    this.W = (MARGIN + COLS * this.blockW) * TILE;
    this.H = (MARGIN + this.rows * this.blockH) * TILE;

    ANIMALS.forEach((a, i) => {
      const c = i % COLS, r = Math.floor(i / COLS);
      const ex = MARGIN + c * this.blockW;
      const ey = MARGIN + r * this.blockH;
      for (let x = ex; x < ex + ENC_W; x++)
        for (let y = ey; y < ey + ENC_H; y++) this.solid.add(x + "," + y);
      this.enclosures.push({
        animal: a, ex, ey,
        cx: (ex + ENC_W / 2) * TILE,
        cy: (ey + ENC_H / 2) * TILE,
      });
    });

    // Décorations déterministes (arbres dans les allées, près des angles d'enclos).
    const choices = ["🌳", "🌲", "🌴", "🌷", "🌼", "🌻", "🪨"];
    let seed = 1234;
    const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    this.enclosures.forEach((e) => {
      if (rnd() < 0.55) {
        const corner = rnd();
        const ox = corner < 0.5 ? -1 : ENC_W + 0.4;
        const dx = (e.ex + ox) * TILE + TILE / 2;
        const dy = (e.ey - 0.4) * TILE;
        const ch = choices[Math.floor(rnd() * choices.length)];
        this.decos.push({ x: dx, y: dy, e: ch, s: ch.length > 2 || ["🌳","🌲","🌴"].includes(ch) ? 40 : 26 });
      }
    });
  },

  isSolidPx(px, py) {
    const pad = 6;
    if (px < pad || py < pad || px > this.W - pad || py > this.H - pad) return true;
    const tx = Math.floor(px / CFG.TILE), ty = Math.floor(py / CFG.TILE);
    return this.solid.has(tx + "," + ty);
  },

  enclosureAt(px, py) {
    const { TILE, ENC_W, ENC_H } = CFG;
    for (const e of this.enclosures) {
      const x0 = e.ex * TILE - 6, y0 = e.ey * TILE - 6;
      const x1 = (e.ex + ENC_W) * TILE + 6, y1 = (e.ey + ENC_H) * TILE + 6;
      if (px >= x0 && px <= x1 && py >= y0 && py <= y1) return e;
    }
    return null;
  },

  groundColors(type, dark) {
    switch (type) {
      case "sand":  return dark ? "#e0c87f" : "#ecd99a";
      case "water": return dark ? "#4fa9df" : "#5bb6e8";
      case "snow":  return dark ? "#dfeaf5" : "#eef5fc";
      default:      return dark ? "#79c34d" : "#86cf57"; // grass
    }
  },

  // cam, vw, vh en pixels "monde" (CSS)
  render(ctx, cam, vw, vh, t) {
    const { TILE } = CFG;
    const cw = vw, ch = vh;

    // Pelouse de base (damier)
    const x0 = Math.floor(cam.x / TILE) - 1;
    const y0 = Math.floor(cam.y / TILE) - 1;
    const x1 = Math.ceil((cam.x + cw) / TILE) + 1;
    const y1 = Math.ceil((cam.y + ch) / TILE) + 1;
    for (let ty = y0; ty < y1; ty++) {
      for (let tx = x0; tx < x1; tx++) {
        const dark = (tx + ty) % 2 === 0;
        ctx.fillStyle = dark ? "#79c34d" : "#86cf57";
        ctx.fillRect(tx * TILE, ty * TILE, TILE, TILE);
      }
    }

    // Décorations (sous les enclos)
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    for (const d of this.decos) {
      if (d.x < cam.x - 60 || d.x > cam.x + cw + 60 || d.y < cam.y - 60 || d.y > cam.y + ch + 60) continue;
      ctx.font = d.s + 'px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
      ctx.fillText(d.e, d.x, d.y);
    }

    // Enclos visibles
    for (const e of this.enclosures) {
      const ex = e.ex * TILE, ey = e.ey * TILE;
      const w = CFG.ENC_W * TILE, h = CFG.ENC_H * TILE;
      if (ex > cam.x + cw + 40 || ex + w < cam.x - 40 || ey > cam.y + ch + 40 || ey + h < cam.y - 40) continue;
      this.drawEnclosure(ctx, e, t);
    }
  },

  drawEnclosure(ctx, e, t) {
    const { TILE, ENC_W, ENC_H } = CFG;
    const x = e.ex * TILE, y = e.ey * TILE;
    const w = ENC_W * TILE, h = ENC_H * TILE;
    const a = e.animal;

    // Sol thématique
    roundRect(ctx, x + 5, y + 5, w - 10, h - 10, 12);
    ctx.fillStyle = this.groundColors(a.ground, false);
    ctx.fill();
    // petits motifs
    ctx.fillStyle = this.groundColors(a.ground, true);
    for (let i = 0; i < 6; i++) {
      const px = x + 16 + ((i * 53) % (w - 30));
      const py = y + 16 + ((i * 37) % (h - 30));
      ctx.globalAlpha = 0.5;
      ctx.beginPath(); ctx.arc(px, py, 4, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Clôture en bois
    roundRect(ctx, x + 5, y + 5, w - 10, h - 10, 12);
    ctx.lineWidth = 7;
    ctx.strokeStyle = "#8a5a2b";
    ctx.stroke();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#a9763f";
    ctx.stroke();
    // poteaux
    ctx.fillStyle = "#6f4420";
    const posts = [[x + 5, y + 5], [x + w - 5, y + 5], [x + 5, y + h - 5], [x + w - 5, y + h - 5]];
    for (const [px, py] of posts) { ctx.beginPath(); ctx.arc(px, py, 6, 0, 7); ctx.fill(); }

    // Animal
    const has = AudioEngine.has(a.id);
    const playing = has && AudioEngine.isPlaying(a.id);
    const bob = Math.sin(t / 420 + e.ex) * 3 + (playing ? Math.sin(t / 80) * 2 : 0);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.globalAlpha = has ? 1 : 0.45;
    ctx.font = Math.floor(TILE * 1.95) + 'px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
    ctx.fillText(a.emoji, e.cx, e.cy - bob);
    ctx.globalAlpha = 1;

    // Badge état
    if (!has) {
      ctx.font = '22px "Segoe UI Emoji",sans-serif';
      ctx.fillText("🎤", e.cx + w / 2 - 22, e.cy - h / 2 + 22);
    } else if (playing) {
      ctx.font = "22px sans-serif";
      ctx.fillStyle = "#1d6b1d";
      ctx.fillText("♪", e.cx + Math.sin(t / 120) * 18, e.cy - h / 2 - 6 - Math.abs(Math.sin(t / 200)) * 8);
    }

    // Panneau (nom)
    const sx = e.cx, sy = y + h + 6;
    ctx.fillStyle = "#6f4420";
    ctx.fillRect(sx - 3, sy, 6, 14);
    const label = a.name;
    ctx.font = '700 15px "Baloo 2","Comic Sans MS",sans-serif';
    const tw = Math.max(ctx.measureText(label).width + 18, 60);
    roundRect(ctx, sx - tw / 2, sy + 10, tw, 24, 7);
    ctx.fillStyle = "#caa472"; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = "#6f4420"; ctx.stroke();
    ctx.fillStyle = "#3a2a1a";
    ctx.textBaseline = "middle";
    ctx.fillText(label, sx, sy + 23);
  },
};
