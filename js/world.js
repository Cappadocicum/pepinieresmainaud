// Monde "open space" inspiré de Zelda: A Link to the Past.
// Le terrain (herbe, rivières, forêts) est généré une fois.
// Les enclos sont placés LIBREMENT par le joueur (mode construction) ;
// le sentier de terre se (re)dessine automatiquement entre les enclos posés.

const T_GRASS = 0, T_WATER = 2, T_TREE = 4;

const World = {
  TW: 0, TH: 0, W: 0, H: 0,
  tiles: null,
  trees: [],
  decos: [],
  spawnPx: { x: 0, y: 0 },

  // enclos posés (dérivés de Zoo.placements)
  enclosures: [],
  encSolid: new Set(),
  pathSet: new Set(),
  bridgeSet: new Set(),

  _seed: 7919,
  _rnd() { this._seed = (this._seed * 1664525 + 1013904223) >>> 0; return this._seed / 4294967296; },
  _ri(n) { return Math.floor(this._rnd() * n); },

  idx(x, y) { return y * this.TW + x; },
  inB(x, y) { return x >= 0 && y >= 0 && x < this.TW && y < this.TH; },
  get(x, y) { return this.inB(x, y) ? this.tiles[this.idx(x, y)] : T_TREE; },
  set(x, y, v) { if (this.inB(x, y)) this.tiles[this.idx(x, y)] = v; },

  build() {
    const { TILE } = CFG;
    // Grande carte ouverte
    this.TW = 70; this.TH = 80;
    this.W = this.TW * TILE; this.H = this.TH * TILE;
    this.tiles = new Uint8Array(this.TW * this.TH);

    // Rivières qui serpentent (laissent un large open-space)
    this._carveRiverV(Math.floor(this.TW * 0.30));
    this._carveRiverH(Math.floor(this.TH * 0.58));

    // Forêts : bordure + quelques bosquets, mais beaucoup d'espace libre
    this._forestBorder();
    this._forestClusters(16);

    // Petites décos
    this._scatterDecor(110);

    // Spawn : zone dégagée en haut
    let sx = Math.floor(this.TW * 0.5), sy = 2;
    while (sy < this.TH - 2 && this._terrainSolid(sx, sy)) sy++;
    this.spawnPx = { x: (sx + 0.5) * TILE, y: (sy + 0.5) * TILE };
  },

  // ---------- Placement des enclos ----------
  applyPlacements(list) {
    const { ENC_W, ENC_H, TILE } = CFG;
    this.enclosures = [];
    this.encSolid = new Set();
    for (const p of list) {
      const a = ANIMALS.find((x) => x.id === p.id);
      if (!a) continue;
      for (let y = p.ey; y < p.ey + ENC_H; y++)
        for (let x = p.ex; x < p.ex + ENC_W; x++) this.encSolid.add(x + "," + y);
      this.enclosures.push({
        animal: a, ex: p.ex, ey: p.ey,
        cx: (p.ex + ENC_W / 2) * TILE,
        cy: (p.ey + ENC_H / 2) * TILE,
        gate: { x: p.ex + Math.floor(ENC_W / 2), y: p.ey + ENC_H },
      });
    }
    this._recomputePaths();
  },

  canPlace(ex, ey) {
    const { ENC_W, ENC_H } = CFG;
    if (ex < 1 || ey < 1 || ex + ENC_W > this.TW - 1 || ey + ENC_H > this.TH - 1) return false;
    for (let y = ey; y < ey + ENC_H; y++)
      for (let x = ex; x < ex + ENC_W; x++) {
        const t = this.tiles[this.idx(x, y)];
        if (t === T_WATER || t === T_TREE) return false;
        if (this.encSolid.has(x + "," + y)) return false;
      }
    return true;
  },

  // Sentier auto = arbre couvrant minimal (Prim) entre les portes des enclos
  _recomputePaths() {
    this.pathSet = new Set();
    this.bridgeSet = new Set();
    const N = this.enclosures.length;
    if (N < 2) return;
    const g = this.enclosures.map((e) => e.gate);
    const inT = new Array(N).fill(false);
    const dist = new Array(N).fill(Infinity);
    const par = new Array(N).fill(-1);
    dist[0] = 0;
    for (let it = 0; it < N; it++) {
      let u = -1, bd = Infinity;
      for (let i = 0; i < N; i++) if (!inT[i] && dist[i] < bd) { bd = dist[i]; u = i; }
      if (u < 0) break;
      inT[u] = true;
      if (par[u] >= 0) this._route(g[u], g[par[u]]);
      for (let v = 0; v < N; v++) if (!inT[v]) {
        const d = Math.abs(g[u].x - g[v].x) + Math.abs(g[u].y - g[v].y);
        if (d < dist[v]) { dist[v] = d; par[v] = u; }
      }
    }
  },

  _route(a, b) {
    const lay = (x, y) => {
      if (!this.inB(x, y) || this.encSolid.has(x + "," + y)) return;
      const t = this.tiles[this.idx(x, y)];
      if (t === T_TREE) return;
      if (t === T_WATER) this.bridgeSet.add(x + "," + y);
      else this.pathSet.add(x + "," + y);
    };
    let x = a.x; const sx = a.x <= b.x ? 1 : -1;
    while (x !== b.x) { lay(x, a.y); lay(x, a.y + 1); x += sx; }
    let y = a.y; const sy = a.y <= b.y ? 1 : -1;
    while (y !== b.y) { lay(b.x, y); lay(b.x + 1, y); y += sy; }
    lay(b.x, b.y);
  },

  // ---------- Génération du terrain ----------
  _carveRiverV(x0) {
    let x = x0;
    for (let y = 1; y < this.TH - 1; y++) {
      for (let w = 0; w < 2; w++) this.set(x + w, y, T_WATER);
      if (this._rnd() < 0.34) x += this._ri(3) - 1;
      x = clamp(x, 3, this.TW - 5);
    }
  },
  _carveRiverH(y0) {
    let y = y0;
    for (let x = 1; x < this.TW - 1; x++) {
      for (let w = 0; w < 2; w++) this.set(x, y + w, T_WATER);
      if (this._rnd() < 0.34) y += this._ri(3) - 1;
      y = clamp(y, 3, this.TH - 5);
    }
  },
  _plantTree(x, y) {
    if (this.get(x, y) === T_GRASS) this.set(x, y, T_TREE);
  },
  _forestBorder() {
    for (let x = 0; x < this.TW; x++) {
      this._plantTree(x, 0); this._plantTree(x, this.TH - 1);
      if (this._rnd() < 0.7) this._plantTree(x, 1);
      if (this._rnd() < 0.7) this._plantTree(x, this.TH - 2);
    }
    for (let y = 0; y < this.TH; y++) {
      this._plantTree(0, y); this._plantTree(this.TW - 1, y);
      if (this._rnd() < 0.7) this._plantTree(1, y);
      if (this._rnd() < 0.7) this._plantTree(this.TW - 2, y);
    }
  },
  _forestClusters(n) {
    for (let i = 0; i < n; i++) {
      const cx = 3 + this._ri(this.TW - 6), cy = 3 + this._ri(this.TH - 6);
      const size = 3 + this._ri(7);
      for (let k = 0; k < size; k++) this._plantTree(cx + this._ri(5) - 2, cy + this._ri(5) - 2);
    }
    this.trees = [];
    for (let y = 0; y < this.TH; y++)
      for (let x = 0; x < this.TW; x++)
        if (this.tiles[this.idx(x, y)] === T_TREE) this.trees.push({ tx: x, ty: y });
  },
  _scatterDecor(n) {
    const flowers = ["🌼", "🌷", "🌻", "🌸", "🍄"];
    for (let i = 0; i < n; i++) {
      const tx = 1 + this._ri(this.TW - 2), ty = 1 + this._ri(this.TH - 2);
      if (this.tiles[this.idx(tx, ty)] !== T_GRASS) continue;
      this.decos.push({ x: (tx + 0.5) * CFG.TILE, y: (ty + 0.7) * CFG.TILE, e: flowers[this._ri(flowers.length)] });
    }
  },

  // ---------- Collisions ----------
  _terrainSolid(x, y) {
    if (!this.inB(x, y)) return true;
    const t = this.tiles[this.idx(x, y)];
    return t === T_TREE || t === T_WATER;
  },
  _solidTile(x, y) {
    if (!this.inB(x, y)) return true;
    if (this.encSolid.has(x + "," + y)) return true;
    const t = this.tiles[this.idx(x, y)];
    if (t === T_TREE) return true;
    if (t === T_WATER) return !this.bridgeSet.has(x + "," + y);
    return false;
  },
  isSolidPx(px, py) {
    const pad = 6;
    if (px < pad || py < pad || px > this.W - pad || py > this.H - pad) return true;
    return this._solidTile((px / CFG.TILE) | 0, (py / CFG.TILE) | 0);
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

  // ---------- Rendu ----------
  groundColors(type, dark) {
    switch (type) {
      case "sand":  return dark ? "#e0c87f" : "#ecd99a";
      case "water": return dark ? "#4fa9df" : "#5bb6e8";
      case "snow":  return dark ? "#dfeaf5" : "#eef5fc";
      default:      return dark ? "#3a9d3a" : "#46b446";
    }
  },
  _tileColor(name) {
    if (name === "path") return "#d9b382";
    if (name === "water") return "#2f86d8";
    if (name === "bridge") return "#b88a52";
    return "#46b446";
  },

  render(ctx, cam, vw, vh, t) {
    const { TILE } = CFG;
    const x0 = Math.max(0, Math.floor(cam.x / TILE));
    const y0 = Math.max(0, Math.floor(cam.y / TILE));
    const x1 = Math.min(this.TW, Math.ceil((cam.x + vw) / TILE));
    const y1 = Math.min(this.TH, Math.ceil((cam.y + vh) / TILE));

    // 1) Terrain
    for (let ty = y0; ty < y1; ty++) {
      for (let tx = x0; tx < x1; tx++) {
        const key = tx + "," + ty;
        const type = this.tiles[this.idx(tx, ty)];
        let name;
        if (type === T_WATER) name = this.bridgeSet.has(key) ? "bridge" : "water";
        else name = (type !== T_TREE && this.pathSet.has(key)) ? "path" : "grass";
        const pat = Images.pattern(ctx, name);
        ctx.fillStyle = pat || this._tileColor(name);
        ctx.fillRect(tx * TILE, ty * TILE, TILE + 1, TILE + 1);
      }
    }
    // 1b) Bords d'eau (côtes) façon Zelda
    this._drawShores(ctx, x0, y0, x1, y1);

    // 2) Décos
    ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
    for (const d of this.decos) {
      if (d.x < cam.x - 40 || d.x > cam.x + vw + 40 || d.y < cam.y - 40 || d.y > cam.y + vh + 40) continue;
      ctx.font = '22px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
      ctx.fillText(d.e, d.x, d.y);
    }

    // 3) Arbres
    const treeImg = Images.decor("arbre");
    const size = TILE * 1.85;
    for (const tr of this.trees) {
      const px = (tr.tx + 0.5) * TILE, py = (tr.ty + 1) * TILE;
      if (px < cam.x - 60 || px > cam.x + vw + 60 || py < cam.y - 80 || py > cam.y + vh + 60) continue;
      if (treeImg) ctx.drawImage(treeImg, px - size / 2, py - size + 8, size, size);
      else {
        ctx.font = Math.floor(TILE * 1.3) + 'px "Segoe UI Emoji",sans-serif';
        ctx.textAlign = "center"; ctx.fillText("🌳", px, py + 4);
      }
    }

    // 4) Enclos
    for (const e of this.enclosures) {
      const ex = e.ex * TILE, ey = e.ey * TILE;
      const w = CFG.ENC_W * TILE, h = CFG.ENC_H * TILE;
      if (ex > cam.x + vw + 40 || ex + w < cam.x - 40 || ey > cam.y + vh + 60 || ey + h < cam.y - 40) continue;
      this.drawEnclosure(ctx, e, t);
    }
  },

  // Liseré sombre + clair sur les rives (effet Zelda)
  _drawShores(ctx, x0, y0, x1, y1) {
    const { TILE } = CFG;
    ctx.lineWidth = 3;
    for (let ty = y0; ty < y1; ty++) {
      for (let tx = x0; tx < x1; tx++) {
        const key = tx + "," + ty;
        if (this.tiles[this.idx(tx, ty)] !== T_WATER || this.bridgeSet.has(key)) continue;
        const x = tx * TILE, y = ty * TILE;
        ctx.strokeStyle = "#1c5fa6";
        ctx.beginPath();
        if (!this._isWater(tx, ty - 1)) { ctx.moveTo(x, y + 1.5); ctx.lineTo(x + TILE, y + 1.5); }
        if (!this._isWater(tx, ty + 1)) { ctx.moveTo(x, y + TILE - 1.5); ctx.lineTo(x + TILE, y + TILE - 1.5); }
        if (!this._isWater(tx - 1, ty)) { ctx.moveTo(x + 1.5, y); ctx.lineTo(x + 1.5, y + TILE); }
        if (!this._isWater(tx + 1, ty)) { ctx.moveTo(x + TILE - 1.5, y); ctx.lineTo(x + TILE - 1.5, y + TILE); }
        ctx.stroke();
      }
    }
  },
  _isWater(x, y) { return this.get(x, y) === T_WATER; },

  drawEnclosure(ctx, e, t) {
    const { TILE, ENC_W, ENC_H } = CFG;
    const x = e.ex * TILE, y = e.ey * TILE;
    const w = ENC_W * TILE, h = ENC_H * TILE;
    const a = e.animal;

    const pat = Images.pattern(ctx, a.ground);
    roundRect(ctx, x + 5, y + 5, w - 10, h - 10, 12);
    if (pat) { ctx.fillStyle = pat; ctx.fill(); }
    else {
      ctx.fillStyle = this.groundColors(a.ground, false); ctx.fill();
      ctx.fillStyle = this.groundColors(a.ground, true);
      for (let i = 0; i < 6; i++) {
        const px = x + 16 + ((i * 53) % (w - 30)), py = y + 16 + ((i * 37) % (h - 30));
        ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.arc(px, py, 4, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Clôture
    roundRect(ctx, x + 5, y + 5, w - 10, h - 10, 12);
    ctx.lineWidth = 7; ctx.strokeStyle = "#8a5a2b"; ctx.stroke();
    ctx.lineWidth = 3; ctx.strokeStyle = "#a9763f"; ctx.stroke();
    ctx.fillStyle = "#6f4420";
    for (const [px, py] of [[x + 5, y + 5], [x + w - 5, y + 5], [x + 5, y + h - 5], [x + w - 5, y + h - 5]]) {
      ctx.beginPath(); ctx.arc(px, py, 6, 0, 7); ctx.fill();
    }

    // Animal
    const has = AudioEngine.has(a.id);
    const playing = has && AudioEngine.isPlaying(a.id);
    const bob = Math.sin(t / 420 + e.ex) * 3 + (playing ? Math.sin(t / 80) * 2 : 0);
    const img = Images.animal(a.id);
    ctx.globalAlpha = has ? 1 : 0.5;
    if (img) {
      const s = TILE * 2.6;
      ctx.drawImage(img, e.cx - s / 2, e.cy - s / 2 - bob, s, s);
    } else {
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = Math.floor(TILE * 1.95) + 'px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
      ctx.fillText(a.emoji, e.cx, e.cy - bob);
    }
    ctx.globalAlpha = 1;

    // Badge
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    if (!has) {
      ctx.font = '22px "Segoe UI Emoji",sans-serif';
      ctx.fillText("🎤", e.cx + w / 2 - 22, e.cy - h / 2 + 22);
    } else if (playing) {
      ctx.font = "22px sans-serif"; ctx.fillStyle = "#1d6b1d";
      ctx.fillText("♪", e.cx + Math.sin(t / 120) * 18, e.cy - h / 2 - 6 - Math.abs(Math.sin(t / 200)) * 8);
    }

    // Panneau nom
    const sx = e.cx, sy = y + h + 6;
    ctx.fillStyle = "#6f4420"; ctx.fillRect(sx - 3, sy, 6, 14);
    ctx.font = '700 15px "Baloo 2","Comic Sans MS",sans-serif';
    const tw = Math.max(ctx.measureText(a.name).width + 18, 60);
    roundRect(ctx, sx - tw / 2, sy + 10, tw, 24, 7);
    ctx.fillStyle = "#caa472"; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = "#6f4420"; ctx.stroke();
    ctx.fillStyle = "#3a2a1a"; ctx.textBaseline = "middle";
    ctx.fillText(a.name, sx, sy + 23);
  },

  // Aperçu fantôme pendant le placement
  drawGhost(ctx, ex, ey, ok, animal, t) {
    const { TILE, ENC_W, ENC_H } = CFG;
    const x = ex * TILE, y = ey * TILE, w = ENC_W * TILE, h = ENC_H * TILE;
    ctx.save();
    ctx.globalAlpha = 0.5;
    roundRect(ctx, x + 5, y + 5, w - 10, h - 10, 12);
    ctx.fillStyle = ok ? "#3a86ff" : "#e63946"; ctx.fill();
    ctx.globalAlpha = 0.9;
    ctx.lineWidth = 4; ctx.strokeStyle = ok ? "#fff" : "#ffd6d6"; ctx.stroke();
    const img = animal && Images.animal(animal.id);
    if (img) { const s = TILE * 2.2; ctx.globalAlpha = 0.8; ctx.drawImage(img, (x + w / 2) - s / 2, (y + h / 2) - s / 2, s, s); }
    ctx.restore();
  },
};
