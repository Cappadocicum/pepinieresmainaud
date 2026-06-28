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
      if (map[e.code]) { this[map[e.code]] = true; e.preventDefault(); }
      if (e.code === "Space" || e.code === "Enter" || e.code === "KeyE") {
        if (Game.near) UI.openAnimal(Game.near);
      }
      if (e.code === "Escape") UI.closeAll();
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
    if (orig) { // reprend la taille/nombre existants
      this.sizeIdx = this._sizeIdxOf(orig.w, orig.h);
      this.count = orig.count || 1;
    }
    UI.showPlacingBar(ANIMALS.find((a) => a.id === id), isMove);
  },
  _sizeIdxOf(w, h) {
    for (let i = 0; i < this.SIZES.length; i++) if (this.SIZES[i][0] === w && this.SIZES[i][1] === h) return i;
    return 1;
  },
  changeSize(d) { this.sizeIdx = clamp(this.sizeIdx + d, 0, this.SIZES.length - 1); UI.updatePlaceControls(); },
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

    // Pointeur : en jeu = ouvrir un enclos ; en construction = glisser/sélectionner
    let down = null;
    canvas.addEventListener("pointerdown", (ev) => {
      AudioEngine.resume();
      down = { x: ev.clientX, y: ev.clientY, moved: false, camx: Build.cam.x, camy: Build.cam.y };
    });
    canvas.addEventListener("pointermove", (ev) => {
      if (!down) return;
      const dx = ev.clientX - down.x, dy = ev.clientY - down.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) down.moved = true;
      if (Build.active) { Build.cam.x = clamp(down.camx - dx, 0, Math.max(0, World.W - this.cssW)); Build.cam.y = clamp(down.camy - dy, 0, Math.max(0, World.H - this.cssH)); }
    });
    const endTap = (ev) => {
      if (!down) return;
      const tap = !down.moved;
      const r = canvas.getBoundingClientRect();
      if (tap) {
        if (Build.active) {
          const wx = ev.clientX - r.left + Build.cam.x, wy = ev.clientY - r.top + Build.cam.y;
          Build.pickAt(wx, wy);
        } else {
          const wx = ev.clientX - r.left + this.cam.x, wy = ev.clientY - r.top + this.cam.y;
          const enc = World.enclosureAt(wx, wy);
          if (enc) UI.openAnimal(enc);
        }
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
      // construction : caméra libre, joueur figé
      Build.updateGhost();
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
      if (Build.placing) {
        World.drawGhost(ctx, Build.ex, Build.ey, Build.w, Build.h, Build.count, Build.ok, ANIMALS.find((a) => a.id === Build.placing.id), t);
      }
      // viseur central
      ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 2;
      const cxp = this.cam.x + this.cssW / 2, cyp = this.cam.y + this.cssH / 2;
      ctx.beginPath(); ctx.moveTo(cxp - 12, cyp); ctx.lineTo(cxp + 12, cyp);
      ctx.moveTo(cxp, cyp - 12); ctx.lineTo(cxp, cyp + 12); ctx.stroke();
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
    roundRect(ctx, e.ex * CFG.TILE + 2, e.ey * CFG.TILE + 2, CFG.ENC_W * CFG.TILE - 4, CFG.ENC_H * CFG.TILE - 4, 14);
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
