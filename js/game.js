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
    World.build();
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

    // Toucher la carte pour ouvrir un enclos
    canvas.addEventListener("pointerdown", (ev) => {
      AudioEngine.resume();
      const r = canvas.getBoundingClientRect();
      const wx = ev.clientX - r.left + this.cam.x;
      const wy = ev.clientY - r.top + this.cam.y;
      const enc = World.enclosureAt(wx, wy);
      if (enc) UI.openAnimal(enc);
    });

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

    Player.update(dt, Input);
    AudioEngine.update(Player, World.enclosures);

    // caméra centrée + clamp (en pixels "monde")
    this.cam.x = clamp(Player.x - this.cssW / 2, 0, Math.max(0, World.W - this.cssW));
    this.cam.y = clamp(Player.y - this.cssH / 2, 0, Math.max(0, World.H - this.cssH));

    // enclos le plus proche (pour l'interaction)
    this.near = this._nearest();
    UI.setNear(this.near);

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
    this._highlightNear(ctx, t);
    Player.draw(ctx, t);
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
