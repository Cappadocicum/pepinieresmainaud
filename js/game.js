// Entrées clavier + tactiles
const Input = {
  up: false, down: false, left: false, right: false,
  clear() { this.up = this.down = this.left = this.right = false; },
  bind() {
    const map = {
      ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
      KeyW: "up", KeyZ: "up", KeyS: "down", KeyA: "left", KeyQ: "left", KeyD: "right",
    };
    addEventListener("keydown", (e) => {
      // En mode placement : flèches = bouger l'aperçu, Entrée/Espace = poser
      if (Build.active && Build.placing) {
        if (e.code === "ArrowUp" || e.code === "KeyW" || e.code === "KeyZ") { Build.nudge(0, -1); e.preventDefault(); return; }
        if (e.code === "ArrowDown" || e.code === "KeyS") { Build.nudge(0, 1); e.preventDefault(); return; }
        if (e.code === "ArrowLeft" || e.code === "KeyA" || e.code === "KeyQ") { Build.nudge(-1, 0); e.preventDefault(); return; }
        if (e.code === "ArrowRight" || e.code === "KeyD") { Build.nudge(1, 0); e.preventDefault(); return; }
        if (e.code === "Space" || e.code === "Enter") { Build.confirm(); e.preventDefault(); return; }
        if (e.code === "Escape") { Build.cancelPlacing(); return; }
        return;
      }
      if (map[e.code]) { this[map[e.code]] = true; e.preventDefault(); }
      if (e.code === "Space" || e.code === "Enter" || e.code === "KeyE") {
        if (Game.near) UI.openAnimal(Game.near);
      }
      if (e.code === "Escape") { if (Build.active) Build.exit(); else UI.closeAll(); }
    });
    addEventListener("keyup", (e) => { if (map[e.code]) this[map[e.code]] = false; });
    addEventListener("blur", () => this.clear());

    // D-pad tactile
    document.querySelectorAll(".dbtn").forEach((b) => {
      const dir = b.dataset.dir;
      const on = (ev) => { ev.preventDefault(); this[dir] = true; b.classList.add("pressed"); AudioEngine.resume(); };
      const off = (ev) => { ev.preventDefault(); this[dir] = false; b.classList.remove("pressed"); };
      b.addEventListener("touchstart", on, { passive: false });
      b.addEventListener("touchend", off, { passive: false });
      b.addEventListener("touchcancel", off, { passive: false });
      b.addEventListener("mousedown", on);
      addEventListener("mouseup", off);
    });
  },
};

// Mode construction : placement libre des enclos
const Build = {
  active: false,
  placing: null,      // { id, isMove, orig }
  cam: { x: 0, y: 0 },
  ex: 0, ey: 0, ok: false,
  SIZES: [[4, 3], [5, 4], [6, 5], [8, 6]],
  SIZE_NAMES: ["Petit", "Moyen", "Grand", "Géant"],
  sizeIdx: 1,
  count: 1,
  MAX_COUNT: 8,

  get w() { return this.SIZES[this.sizeIdx][0]; },
  get h() { return this.SIZES[this.sizeIdx][1]; },

  toggle() { this.active ? this.exit() : this.enter(); },
  enter() {
    this.active = true;
    this.placing = null;
    this.cam.x = Game.cam.x; this.cam.y = Game.cam.y;
    Input.clear();
    UI.enterBuild();
  },
  exit() {
    if (this.placing && this.placing.isMove) this._restore();
    this.active = false; this.placing = null;
    Player.ensureFree();
    UI.exitBuild();
  },
  selectAnimal(id, isMove = false, orig = null) {
    this.placing = { id, isMove, orig };
    if (orig) { // reprend la taille/nombre/position existants
      this.sizeIdx = this._sizeIdxOf(orig.w, orig.h);
      this.count = orig.count || 1;
      this.ex = orig.ex; this.ey = orig.ey;
    } else {
      // l'aperçu démarre au centre de la vue
      this.ex = Math.round((this.cam.x + Game.cssW / 2) / CFG.TILE - this.w / 2);
      this.ey = Math.round((this.cam.y + Game.cssH / 2) / CFG.TILE - this.h / 2);
    }
    this._clampGhost();
    UI.showPlacingBar(ANIMALS.find((a) => a.id === id), isMove);
  },
  _sizeIdxOf(w, h) {
    for (let i = 0; i < this.SIZES.length; i++) if (this.SIZES[i][0] === w && this.SIZES[i][1] === h) return i;
    return 1;
  },
  _clampGhost() {
    this.ex = clamp(this.ex, 1, World.TW - 1 - this.w);
    this.ey = clamp(this.ey, 1, World.TH - 1 - this.h);
    this.ok = World.canPlace(this.ex, this.ey, this.w, this.h);
  },
  // place l'aperçu sous le pointeur (souris/doigt)
  setCursorWorld(wx, wy) {
    if (!this.placing) return;
    this.ex = Math.round(wx / CFG.TILE - this.w / 2);
    this.ey = Math.round(wy / CFG.TILE - this.h / 2);
    this._clampGhost();
  },
  // déplace l'aperçu au clavier + suit avec la caméra
  nudge(dx, dy) {
    if (!this.placing) return;
    this.ex += dx; this.ey += dy;
    this._clampGhost();
    this._followCam();
  },
  _followCam() {
    const TILE = CFG.TILE, m = TILE * 2;
    const gx = (this.ex + this.w / 2) * TILE, gy = (this.ey + this.h / 2) * TILE;
    if (gx < this.cam.x + m) this.cam.x = gx - m;
    if (gx > this.cam.x + Game.cssW - m) this.cam.x = gx - Game.cssW + m;
    if (gy < this.cam.y + m) this.cam.y = gy - m;
    if (gy > this.cam.y + Game.cssH - m) this.cam.y = gy - Game.cssH + m;
    this.cam.x = clamp(this.cam.x, 0, Math.max(0, World.W - Game.cssW));
    this.cam.y = clamp(this.cam.y, 0, Math.max(0, World.H - Game.cssH));
  },
  changeSize(d) { this.sizeIdx = clamp(this.sizeIdx + d, 0, this.SIZES.length - 1); this._clampGhost(); UI.updatePlaceControls(); },
  changeCount(d) { this.count = clamp(this.count + d, 1, this.MAX_COUNT); UI.updatePlaceControls(); },
  recenter() {
    this.cam.x = clamp(Player.x - Game.cssW / 2, 0, Math.max(0, World.W - Game.cssW));
    this.cam.y = clamp(Player.y - Game.cssH / 2, 0, Math.max(0, World.H - Game.cssH));
  },
  cancelPlacing() {
    if (this.placing && this.placing.isMove) this._restore();
    this.placing = null;
    UI.openPalette();
  },
  _restore() {
    const p = this.placing.orig;
    Zoo.place(p.id, p.ex, p.ey);
    World.applyPlacements(Zoo.placements);
    UI.updateProgress();
  },
  deletePlacing() {
    if (!this.placing) return;
    const a = ANIMALS.find((x) => x.id === this.placing.id);
    if (!confirm("Retirer l'enclos de « " + a.name + " » ?")) return;
    this.placing = null;        // l'enclos déplacé a déjà été retiré
    UI.openPalette();
    UI.updateProgress();
  },
  confirm() {
    if (!this.placing || !this.ok) { UI.toast("⛔ Emplacement impossible ici"); return; }
    Zoo.place(this.placing.id, this.ex, this.ey, this.w, this.h, this.count);
    World.applyPlacements(Zoo.placements);
    this.placing = null;
    UI.updateProgress();
    UI.openPalette();
  },
  // l'aperçu suit le centre de l'écran
  updateGhost() {
    if (!this.placing) return;
    const wx = this.cam.x + Game.cssW / 2, wy = this.cam.y + Game.cssH / 2;
    this.ex = Math.round(wx / CFG.TILE - this.w / 2);
    this.ey = Math.round(wy / CFG.TILE - this.h / 2);
    this.ok = World.canPlace(this.ex, this.ey, this.w, this.h);
  },
  pan(dx, dy) {
    this.cam.x = clamp(this.cam.x - dx, 0, Math.max(0, World.W - Game.cssW));
    this.cam.y = clamp(this.cam.y - dy, 0, Math.max(0, World.H - Game.cssH));
  },
  // toucher un enclos posé -> le prendre pour le déplacer
  pickAt(wx, wy) {
    if (this.placing) return;
    const e = World.enclosureAt(wx, wy);
    if (!e) return;
    const orig = { id: e.animal.id, ex: e.ex, ey: e.ey };
    Zoo.remove(e.animal.id);
    World.applyPlacements(Zoo.placements);
    UI.updateProgress();
    this.selectAnimal(orig.id, true, orig);
  },
};

const Game = {
  ctx: null,
  cam: { x: 0, y: 0 },
  near: null,
  last: 0,
  running: false,

  async init() {
    const canvas = document.getElementById("game");
    this.ctx = canvas.getContext("2d");
    this.resize();
    addEventListener("resize", () => this.resize());

    await Store.open();
    Settings.load();
    Zoo.load();
    await Images.load();   // portraits + textures générés (sinon repli emoji)
    World.build();
    World.applyPlacements(Zoo.placements);
    Player.spawn();
    Input.bind();
    UI.init();

    // Charger les voix déjà enregistrées
    AudioEngine.init();
    const ids = await Store.allVoiceIds();
    for (const id of ids) {
      const blob = await Store.getVoice(id);
      if (blob) await AudioEngine.load(id, blob);
    }
    UI.updateProgress();

    // Coordonnées monde sous le pointeur
    const worldAt = (ev) => {
      const r = canvas.getBoundingClientRect();
      return { wx: ev.clientX - r.left + this.cam.x, wy: ev.clientY - r.top + this.cam.y };
    };
    // Pointeur :
    //  - en jeu : toucher un enclos l'ouvre
    //  - construction + placement : l'aperçu suit le pointeur, le relâcher pose
    //  - construction + palette : glisser = déplacer la carte, toucher un enclos = le saisir
    let down = null;
    canvas.addEventListener("pointerdown", (ev) => {
      AudioEngine.resume();
      down = { x: ev.clientX, y: ev.clientY, moved: false, camx: Build.cam.x, camy: Build.cam.y };
      if (Build.active && Build.placing) { const { wx, wy } = worldAt(ev); Build.setCursorWorld(wx, wy); }
    });
    canvas.addEventListener("pointermove", (ev) => {
      // souris : l'aperçu suit même sans bouton pressé
      if (Build.active && Build.placing && (down || ev.pointerType === "mouse")) {
        const { wx, wy } = worldAt(ev); Build.setCursorWorld(wx, wy);
      }
      if (!down) return;
      const dx = ev.clientX - down.x, dy = ev.clientY - down.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) down.moved = true;
      // pan uniquement quand on n'est PAS en train de placer
      if (Build.active && !Build.placing) {
        Build.cam.x = clamp(down.camx - dx, 0, Math.max(0, World.W - this.cssW));
        Build.cam.y = clamp(down.camy - dy, 0, Math.max(0, World.H - this.cssH));
      }
    });
    const endTap = (ev) => {
      if (!down) return;
      const tap = !down.moved;
      const { wx, wy } = worldAt(ev);
      if (Build.active && Build.placing) {
        // poser l'enclos là où on a relâché (tap ou glisser-déposer)
        Build.setCursorWorld(wx, wy);
        Build.confirm();
      } else if (Build.active) {
        if (tap) Build.pickAt(wx, wy);   // saisir un enclos existant
      } else if (tap) {
        const enc = World.enclosureAt(wx, wy);
        if (enc) UI.openAnimal(enc);
      }
      down = null;
    };
    canvas.addEventListener("pointerup", endTap);
    canvas.addEventListener("pointercancel", () => { down = null; });

    // Démarrage
    document.getElementById("startBtn").onclick = () => {
      AudioEngine.resume();
      UI.el.splash.classList.add("hidden");
      if (!this.running) { this.running = true; this.last = performance.now(); requestAnimationFrame((t) => this.loop(t)); }
    };
  },

  resize() {
    const c = this.ctx.canvas;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.cssW = innerWidth;
    this.cssH = innerHeight;
    c.width = Math.floor(this.cssW * dpr);
    c.height = Math.floor(this.cssH * dpr);
    c.style.width = this.cssW + "px";
    c.style.height = this.cssH + "px";
    this.dpr = dpr;
  },

  loop(t) {
    const dt = Math.min((t - this.last) / 1000, 0.05);
    this.last = t;

    if (Build.active) {
      // construction : caméra libre, joueur figé ; l'aperçu suit le pointeur/clavier
      this.cam.x = Build.cam.x; this.cam.y = Build.cam.y;
      this.near = null;
    } else {
      Player.update(dt, Input);
      AudioEngine.update(Player, World.enclosures);
      this.cam.x = clamp(Player.x - this.cssW / 2, 0, Math.max(0, World.W - this.cssW));
      this.cam.y = clamp(Player.y - this.cssH / 2, 0, Math.max(0, World.H - this.cssH));
      this.near = this._nearest();
      UI.setNear(this.near);
    }

    World.updateAnimals(dt, this.cam.x, this.cam.y, this.cssW, this.cssH);

    this.render(t);
    requestAnimationFrame((tt) => this.loop(tt));
  },

  _nearest() {
    const R = CFG.INTERACT_RADIUS * CFG.TILE;
    let best = null, bd = R;
    for (const e of World.enclosures) {
      const d = Math.hypot(e.cx - Player.x, e.cy - Player.y);
      if (d < bd) { bd = d; best = e; }
    }
    return best;
  },

  render(t) {
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.cssW, this.cssH);

    // tout dessiner en coordonnées monde
    ctx.save();
    ctx.translate(-this.cam.x, -this.cam.y);
    World.render(ctx, this.cam, this.cssW, this.cssH, t);
    if (Build.active) {
      Player.draw(ctx, t); // visible (figé) pour se repérer / "centrer sur moi"
      if (Build.placing) {
        World.drawGhost(ctx, Build.ex, Build.ey, Build.w, Build.h, Build.count, Build.ok, ANIMALS.find((a) => a.id === Build.placing.id), t);
      }
    } else {
      this._highlightNear(ctx, t);
      Player.draw(ctx, t);
    }
    ctx.restore();
  },

  _highlightNear(ctx, t) {
    if (!this.near) return;
    const e = this.near;
    ctx.save();
    ctx.strokeStyle = "rgba(255,215,80," + (0.55 + 0.35 * Math.sin(t / 200)) + ")";
    ctx.lineWidth = 4;
    roundRect(ctx, e.ex * CFG.TILE + 2, e.ey * CFG.TILE + 2, e.w * CFG.TILE - 4, e.h * CFG.TILE - 4, 14);
    ctx.stroke();
    ctx.restore();
  },
};

window.addEventListener("load", () => {
  Game.init();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
});
