// Monde "open space" inspiré de Zelda: A Link to the Past.
// Le terrain (herbe, rivières, forêts) est généré une fois.
// Les enclos sont placés LIBREMENT par le joueur (mode construction) ;
// le sentier de terre se (re)dessine automatiquement entre les enclos posés.

const T_GRASS = 0, T_WATER = 2, T_TREE = 4, T_CLIFF = 5;

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
    this.fixedBridges = new Set();
    this._carveRiverV(Math.floor(this.TW * 0.30));
    this._carveRiverH(Math.floor(this.TH * 0.58));
    // Ponts permanents pour pouvoir toujours traverser les rivières
    this._addRiverBridges();

    // Falaises rocheuses (plateaux infranchissables) façon Zelda
    this._cliffFormations(5);

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
      const w = p.w || ENC_W, h = p.h || ENC_H, count = p.count || 1;
      for (let y = p.ey; y < p.ey + h; y++)
        for (let x = p.ex; x < p.ex + w; x++) this.encSolid.add(x + "," + y);
      const e = {
        animal: a, ex: p.ex, ey: p.ey, w, h, count,
        cx: (p.ex + w / 2) * TILE,
        cy: (p.ey + h / 2) * TILE,
        gate: { x: p.ex + Math.floor(w / 2), y: p.ey + h },
      };
      this._spawnAgents(e);
      this.enclosures.push(e);
    }
    this._recomputePaths();
  },

  // crée les individus qui se baladent dans l'enclos
  _spawnAgents(e) {
    const TILE = CFG.TILE;
    const n = Math.max(1, Math.min(e.count || 1, 8));
    const cols = Math.ceil(Math.sqrt(n));
    let s = n === 1 ? Math.min(e.w, e.h) * TILE * 0.62 : (Math.min(e.w, e.h) * TILE) / (cols + 0.3);
    s = clamp(s, TILE * 0.85, TILE * 2.3);
    let minx = e.ex * TILE + s / 2 + 9, maxx = (e.ex + e.w) * TILE - s / 2 - 9;
    let miny = e.ey * TILE + s / 2 + 9, maxy = (e.ey + e.h) * TILE - s / 2 - 9;
    if (maxx < minx) minx = maxx = e.cx;
    if (maxy < miny) miny = maxy = e.cy;
    e.bounds = { minx, maxx, miny, maxy, s };
    e.agents = [];
    for (let i = 0; i < n; i++) {
      const x = minx + Math.random() * (maxx - minx);
      const y = miny + Math.random() * (maxy - miny);
      e.agents.push({ x, y, tx: x, ty: y, state: "rest", tmr: Math.random() * 0.9, dur: 0.32, hop: 0, hx0: x, hy0: y, hx1: x, hy1: y, facing: 1 });
    }
  },

  // animation : petits sauts dans l'enclos (façon Zelda)
  updateAnimals(dt, camx, camy, vw, vh) {
    for (const e of this.enclosures) {
      if (e.cx < camx - 120 || e.cx > camx + vw + 120 || e.cy < camy - 120 || e.cy > camy + vh + 120) continue;
      const b = e.bounds; if (!b) continue;
      for (const ag of e.agents) {
        if (ag.state === "rest") {
          ag.tmr -= dt;
          if (ag.tmr <= 0) {
            if (Math.hypot(ag.tx - ag.x, ag.ty - ag.y) < 6) {
              ag.tx = b.minx + Math.random() * (b.maxx - b.minx);
              ag.ty = b.miny + Math.random() * (b.maxy - b.miny);
            }
            const dx = ag.tx - ag.x, dy = ag.ty - ag.y, d = Math.hypot(dx, dy) || 1;
            const L = Math.min(d, 9 + Math.random() * 13);
            ag.hx0 = ag.x; ag.hy0 = ag.y;
            ag.hx1 = ag.x + (dx / d) * L; ag.hy1 = ag.y + (dy / d) * L;
            if (Math.abs(dx) > 1) ag.facing = dx < 0 ? -1 : 1;
            ag.state = "hop"; ag.dur = 0.3; ag.tmr = 0.3;
          }
        } else {
          ag.tmr -= dt;
          const p = clamp(1 - ag.tmr / ag.dur, 0, 1);
          ag.x = ag.hx0 + (ag.hx1 - ag.hx0) * p;
          ag.y = ag.hy0 + (ag.hy1 - ag.hy0) * p;
          ag.hop = Math.sin(p * Math.PI);
          if (ag.tmr <= 0) { ag.x = ag.hx1; ag.y = ag.hy1; ag.hop = 0; ag.state = "rest"; ag.tmr = 0.12 + Math.random() * 0.6; }
        }
      }
    }
  },

  canPlace(ex, ey, w, h) {
    w = w || CFG.ENC_W; h = h || CFG.ENC_H;
    if (ex < 1 || ey < 1 || ex + w > this.TW - 1 || ey + h > this.TH - 1) return false;
    for (let y = ey; y < ey + h; y++)
      for (let x = ex; x < ex + w; x++) {
        const t = this.tiles[this.idx(x, y)];
        if (t === T_WATER || t === T_TREE || t === T_CLIFF) return false;
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
      if (t === T_TREE || t === T_CLIFF) return;
      if (t === T_WATER) this.bridgeSet.add(x + "," + y);
      else this.pathSet.add(x + "," + y);
    };
    // chemin de terre fin (1 case de large)
    let x = a.x; const sx = a.x <= b.x ? 1 : -1;
    while (x !== b.x) { lay(x, a.y); x += sx; }
    let y = a.y; const sy = a.y <= b.y ? 1 : -1;
    while (y !== b.y) { lay(b.x, y); y += sy; }
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
  // Ponts permanents : on cherche des traversées nettes (terre–eau–terre)
  // et on pose un tablier de pont en travers, espacés le long des rivières.
  _addRiverBridges() {
    const isW = (x, y) => this.get(x, y) === T_WATER;
    const setB = (x, y) => { if (this.inB(x, y)) this.fixedBridges.add(x + "," + y); };

    // Traversées horizontales (par-dessus une rivière verticale) : terre|eau..|terre
    const hCols = [];
    for (let y = 3; y < this.TH - 3; y++) {
      for (let x = 2; x < this.TW - 3; x++) {
        if (isW(x, y) && !isW(x - 1, y)) {
          let x2 = x; while (x2 < this.TW - 1 && isW(x2, y)) x2++;
          const len = x2 - x;
          if (len >= 1 && len <= 4 && !isW(x2, y)) { hCols.push({ y, x0: x, x1: x2 - 1 }); break; }
        }
      }
    }
    // Traversées verticales (par-dessus une rivière horizontale)
    const vRows = [];
    for (let x = 3; x < this.TW - 3; x++) {
      for (let y = 2; y < this.TH - 3; y++) {
        if (isW(x, y) && !isW(x, y - 1)) {
          let y2 = y; while (y2 < this.TH - 1 && isW(x, y2)) y2++;
          const len = y2 - y;
          if (len >= 1 && len <= 4 && !isW(x, y2)) { vRows.push({ x, y0: y, y1: y2 - 1 }); break; }
        }
      }
    }

    // garde ~1 traversée toutes les ~14 cases
    const pick = (arr, key) => {
      const out = []; let last = -999;
      for (const c of arr) { if (c[key] - last >= 14) { out.push(c); last = c[key]; } }
      return out;
    };
    // tablier de 2 cases de large, posé uniquement sur l'eau
    for (const c of pick(hCols, "y"))
      for (let dy = 0; dy <= 1; dy++)
        for (let x = c.x0 - 1; x <= c.x1 + 1; x++) if (isW(x, c.y + dy)) setB(x, c.y + dy);
    for (const c of pick(vRows, "x"))
      for (let dx = 0; dx <= 1; dx++)
        for (let y = c.y0 - 1; y <= c.y1 + 1; y++) if (isW(c.x + dx, y)) setB(c.x + dx, y);
  },

  // Garde-corps du pont du côté de l'eau ouverte
  _bridgeRails(ctx, tx, ty) {
    const TILE = CFG.TILE, x = tx * TILE, y = ty * TILE;
    ctx.strokeStyle = "#6f4420"; ctx.lineWidth = 3;
    ctx.beginPath();
    if (this._openWater(tx, ty - 1)) { ctx.moveTo(x, y + 2.5); ctx.lineTo(x + TILE, y + 2.5); }
    if (this._openWater(tx, ty + 1)) { ctx.moveTo(x, y + TILE - 2.5); ctx.lineTo(x + TILE, y + TILE - 2.5); }
    if (this._openWater(tx - 1, ty)) { ctx.moveTo(x + 2.5, y); ctx.lineTo(x + 2.5, y + TILE); }
    if (this._openWater(tx + 1, ty)) { ctx.moveTo(x + TILE - 2.5, y); ctx.lineTo(x + TILE - 2.5, y + TILE); }
    ctx.stroke();
  },

  _cliffFormations(n) {
    for (let i = 0; i < n; i++) {
      const w = 3 + this._ri(4), h = 2 + this._ri(3);
      const x0 = 3 + this._ri(this.TW - w - 6), y0 = 3 + this._ri(this.TH - h - 6);
      for (let y = y0; y < y0 + h; y++)
        for (let x = x0; x < x0 + w; x++) {
          // bords un peu irréguliers
          if ((x === x0 || x === x0 + w - 1) && this._rnd() < 0.3) continue;
          if (this.get(x, y) === T_GRASS) this.set(x, y, T_CLIFF);
        }
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
    return t === T_TREE || t === T_WATER || t === T_CLIFF;
  },
  _solidTile(x, y) {
    if (!this.inB(x, y)) return true;
    if (this.encSolid.has(x + "," + y)) return true;
    const t = this.tiles[this.idx(x, y)];
    if (t === T_TREE || t === T_CLIFF) return true;
    if (t === T_WATER) return !this._isBridge(x, y);
    return false;
  },
  isSolidPx(px, py) {
    const pad = 6;
    if (px < pad || py < pad || px > this.W - pad || py > this.H - pad) return true;
    return this._solidTile((px / CFG.TILE) | 0, (py / CFG.TILE) | 0);
  },
  enclosureAt(px, py) {
    const { TILE } = CFG;
    for (const e of this.enclosures) {
      const x0 = e.ex * TILE - 6, y0 = e.ey * TILE - 6;
      const x1 = (e.ex + e.w) * TILE + 6, y1 = (e.ey + e.h) * TILE + 6;
      if (px >= x0 && px <= x1 && py >= y0 && py <= y1) return e;
    }
    return null;
  },

  // ---------- Rendu ----------
  groundColors(type, dark) {
    switch (type) {
      case "sand":   return dark ? "#e0c87f" : "#ecd99a";
      case "water":  return dark ? "#4fa9df" : "#5bb6e8";
      case "snow":   return dark ? "#dfeaf5" : "#eef5fc";
      case "jungle": return dark ? "#2f7d3a" : "#368a42";
      default:       return dark ? "#3a9d3a" : "#46b446";
    }
  },
  _tileColor(name) {
    if (name === "path") return "#d9b382";
    if (name === "water") return "#2f86d8";
    if (name === "bridge") return "#b88a52";
    if (name === "cliff") return "#9a8f7d";
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
        let name, bridge = false;
        if (type === T_WATER) { bridge = this._isBridge(tx, ty); name = bridge ? "bridge" : "water"; }
        else if (type === T_CLIFF) name = "cliff";
        else name = (type !== T_TREE && this.pathSet.has(key)) ? "path" : "grass";
        const pat = Images.pattern(ctx, name);
        ctx.fillStyle = pat || this._tileColor(name);
        ctx.fillRect(tx * TILE, ty * TILE, TILE + 1, TILE + 1);
        if (bridge) this._bridgeRails(ctx, tx, ty);
      }
    }
    // 1b) Bords d'eau (côtes) + faces de falaise façon Zelda
    this._drawShores(ctx, x0, y0, x1, y1);
    this._drawCliffs(ctx, x0, y0, x1, y1);

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
        if (this.tiles[this.idx(tx, ty)] !== T_WATER || this._isBridge(tx, ty)) continue;
        const x = tx * TILE, y = ty * TILE;
        const N = !this._isWater(tx, ty - 1), S = !this._isWater(tx, ty + 1);
        const We = !this._isWater(tx - 1, ty), E = !this._isWater(tx + 1, ty);
        // écume claire au bord
        ctx.strokeStyle = "#bfe6ff"; ctx.lineWidth = 5;
        ctx.beginPath();
        if (N) { ctx.moveTo(x, y + 3); ctx.lineTo(x + TILE, y + 3); }
        if (S) { ctx.moveTo(x, y + TILE - 3); ctx.lineTo(x + TILE, y + TILE - 3); }
        if (We) { ctx.moveTo(x + 3, y); ctx.lineTo(x + 3, y + TILE); }
        if (E) { ctx.moveTo(x + TILE - 3, y); ctx.lineTo(x + TILE - 3, y + TILE); }
        ctx.stroke();
        // liseré foncé tout au bord
        ctx.strokeStyle = "#1c5fa6"; ctx.lineWidth = 2;
        ctx.beginPath();
        if (N) { ctx.moveTo(x, y + 1); ctx.lineTo(x + TILE, y + 1); }
        if (S) { ctx.moveTo(x, y + TILE - 1); ctx.lineTo(x + TILE, y + TILE - 1); }
        if (We) { ctx.moveTo(x + 1, y); ctx.lineTo(x + 1, y + TILE); }
        if (E) { ctx.moveTo(x + TILE - 1, y); ctx.lineTo(x + TILE - 1, y + TILE); }
        ctx.stroke();
      }
    }
    // coins arrondis (auto-tiling)
    for (let ty = y0; ty < y1; ty++)
      for (let tx = x0; tx < x1; tx++) {
        if (this.tiles[this.idx(tx, ty)] === T_WATER && !this._isBridge(tx, ty))
          this._roundCorners(ctx, tx, ty, (a, b2) => this._isWater(a, b2), TILE * 0.5, "#1c5fa6");
      }
  },
  _isWater(x, y) { return this.get(x, y) === T_WATER; },
  _isBridge(x, y) { const k = x + "," + y; return this.fixedBridges.has(k) || this.bridgeSet.has(k); },
  _openWater(x, y) { return this._isWater(x, y) && !this._isBridge(x, y); },
  _isCliff(x, y) { return this.get(x, y) === T_CLIFF; },
  _grassFill(ctx) { return Images.pattern(ctx, "grass") || "#46b446"; },

  // Coins convexes arrondis (auto-tiling) : on remplit le coin avec l'herbe
  _roundCorners(ctx, tx, ty, isType, R, outline, which) {
    const TILE = CFG.TILE, x = tx * TILE, y = ty * TILE;
    const grass = this._grassFill(ctx);
    const N = !isType(tx, ty - 1), S = !isType(tx, ty + 1), W = !isType(tx - 1, ty), E = !isType(tx + 1, ty);
    const sect = (cx, cy, a0, a1) => {
      ctx.fillStyle = grass;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, a0, a1); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = outline; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, cy, R, a0, a1); ctx.stroke();
    };
    if (N && W) sect(x, y, 0, Math.PI / 2);
    if (N && E) sect(x + TILE, y, Math.PI / 2, Math.PI);
    if (which !== "top") {
      if (S && W) sect(x, y + TILE, -Math.PI / 2, 0);
      if (S && E) sect(x + TILE, y + TILE, Math.PI, Math.PI * 1.5);
    }
  },

  // Falaises : contour foncé + face inférieure (effet de hauteur)
  _drawCliffs(ctx, x0, y0, x1, y1) {
    const { TILE } = CFG;
    for (let ty = y0; ty < y1; ty++) {
      for (let tx = x0; tx < x1; tx++) {
        if (this.tiles[this.idx(tx, ty)] !== T_CLIFF) continue;
        const x = tx * TILE, y = ty * TILE;
        // face inférieure (mur) si le sud n'est pas une falaise
        if (!this._isCliff(tx, ty + 1)) {
          ctx.fillStyle = "#5d5142";
          ctx.fillRect(x, y + TILE - 9, TILE, 9);
          ctx.fillStyle = "#71634f";
          ctx.fillRect(x, y + TILE - 9, TILE, 4);
        }
        ctx.strokeStyle = "#3c342a"; ctx.lineWidth = 3;
        ctx.beginPath();
        if (!this._isCliff(tx, ty - 1)) { ctx.moveTo(x, y + 1.5); ctx.lineTo(x + TILE, y + 1.5); }
        if (!this._isCliff(tx - 1, ty)) { ctx.moveTo(x + 1.5, y); ctx.lineTo(x + 1.5, y + TILE); }
        if (!this._isCliff(tx + 1, ty)) { ctx.moveTo(x + TILE - 1.5, y); ctx.lineTo(x + TILE - 1.5, y + TILE); }
        ctx.stroke();
      }
    }
    // coins supérieurs arrondis
    for (let ty = y0; ty < y1; ty++)
      for (let tx = x0; tx < x1; tx++) {
        if (this.tiles[this.idx(tx, ty)] === T_CLIFF)
          this._roundCorners(ctx, tx, ty, (a, b2) => this._isCliff(a, b2), TILE * 0.45, "#3c342a", "top");
      }
  },

  // Positions/tailles des individus selon le nombre dans l'enclos
  _animalSpots(e) {
    const TILE = CFG.TILE;
    const n = Math.max(1, Math.min(e.count || 1, 8));
    const w = e.w * TILE, h = e.h * TILE;
    if (n === 1) return [{ x: e.cx, y: e.cy, s: Math.min(Math.min(w, h) * 0.82, TILE * 2.6) }];
    const cols = Math.ceil(Math.sqrt(n)), rows = Math.ceil(n / cols);
    const cw = (w - 18) / cols, ch = (h - 18) / rows;
    const s = Math.min(cw, ch) * 1.05;
    const spots = [];
    for (let i = 0; i < n; i++) {
      const c = i % cols, r = Math.floor(i / cols);
      spots.push({ x: e.ex * TILE + 9 + cw * (c + 0.5), y: e.ey * TILE + 9 + ch * (r + 0.5), s });
    }
    return spots;
  },

  drawEnclosure(ctx, e, t) {
    const { TILE } = CFG;
    const x = e.ex * TILE, y = e.ey * TILE;
    const w = e.w * TILE, h = e.h * TILE;
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

    // Animaux mobiles : ils sautillent dans l'enclos (façon Zelda)
    const has = AudioEngine.has(a.id);
    const img = Images.animal(a.id);
    const s = (e.bounds && e.bounds.s) || TILE * 1.6;
    ctx.globalAlpha = has ? 1 : 0.5;
    // tri par y pour un léger effet de profondeur
    const agents = e.agents ? e.agents.slice().sort((p, q) => p.y - q.y) : [];
    for (const ag of agents) {
      const yo = ag.hop * Math.min(12, s * 0.28);
      // ombre
      ctx.globalAlpha = (has ? 1 : 0.5) * 0.18;
      ctx.fillStyle = "#000";
      ctx.beginPath(); ctx.ellipse(ag.x, ag.y + s * 0.32, s * 0.22, s * 0.09, 0, 0, 7); ctx.fill();
      ctx.globalAlpha = has ? 1 : 0.5;
      if (img) {
        if (ag.facing < 0) {
          ctx.save(); ctx.translate(ag.x, 0); ctx.scale(-1, 1);
          ctx.drawImage(img, -s / 2, ag.y - s / 2 - yo, s, s); ctx.restore();
        } else {
          ctx.drawImage(img, ag.x - s / 2, ag.y - s / 2 - yo, s, s);
        }
      } else {
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.font = Math.floor(s * 0.8) + 'px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
        ctx.fillText(a.emoji, ag.x, ag.y - yo);
      }
    }
    ctx.globalAlpha = 1;
    const playing = has && AudioEngine.isPlaying(a.id);

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
  drawGhost(ctx, ex, ey, gw, gh, count, ok, animal, t) {
    const { TILE } = CFG;
    const x = ex * TILE, y = ey * TILE, w = gw * TILE, h = gh * TILE;
    ctx.save();
    ctx.globalAlpha = 0.5;
    roundRect(ctx, x + 5, y + 5, w - 10, h - 10, 12);
    ctx.fillStyle = ok ? "#3a86ff" : "#e63946"; ctx.fill();
    ctx.globalAlpha = 0.9;
    ctx.lineWidth = 4; ctx.strokeStyle = ok ? "#fff" : "#ffd6d6"; ctx.stroke();
    const img = animal && Images.animal(animal.id);
    if (img) {
      const fake = { ex, ey, w: gw, h: gh, count, cx: x + w / 2, cy: y + h / 2 };
      ctx.globalAlpha = 0.85;
      for (const sp of this._animalSpots(fake)) ctx.drawImage(img, sp.x - sp.s / 2, sp.y - sp.s / 2, sp.s, sp.s);
    }
    ctx.restore();
  },
};
