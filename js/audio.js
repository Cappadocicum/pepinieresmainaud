// Moteur audio : décodage des voix, lecture par proximité et mode cacophonie.
const AudioEngine = {
  ctx: null,
  master: null,
  buffers: {},   // id -> AudioBuffer
  inside: {},    // id -> bool (le joueur est dans la zone)
  lastPlay: {},  // id -> timestamp
  loops: {},     // id -> { src, gain } (mode cacophonie)

  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = Settings.masterVolume;
    this.master.connect(this.ctx.destination);
  },

  resume() {
    this.init();
    if (this.ctx.state === "suspended") this.ctx.resume();
  },

  setMaster(v) { if (this.master) this.master.gain.value = v; },

  async load(id, blob) {
    this.init();
    try {
      const buf = await this.ctx.decodeAudioData(await blob.arrayBuffer());
      this.buffers[id] = buf;
      return true;
    } catch (e) {
      console.warn("Décodage impossible pour", id, e);
      return false;
    }
  },

  unload(id) {
    delete this.buffers[id];
    this.stopLoop(id);
    delete this.inside[id];
    delete this.lastPlay[id];
  },

  has(id) { return !!this.buffers[id]; },

  isPlaying(id, withinMs = 700) {
    return !!this.loops[id] || (performance.now() - (this.lastPlay[id] || -9999) < withinMs);
  },

  playOnce(id, volume = 1, pan = 0) {
    const buf = this.buffers[id];
    if (!buf) return;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const g = this.ctx.createGain();
    g.gain.value = volume;
    src.connect(g);
    if (this.ctx.createStereoPanner) {
      const p = this.ctx.createStereoPanner();
      p.pan.value = clamp(pan, -1, 1);
      g.connect(p); p.connect(this.master);
    } else {
      g.connect(this.master);
    }
    src.start();
    this.lastPlay[id] = performance.now();
  },

  startLoop(id, volume = 0.7) {
    if (this.loops[id] || !this.buffers[id]) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.buffers[id];
    src.loop = true;
    const g = this.ctx.createGain();
    g.gain.value = volume;
    src.connect(g); g.connect(this.master);
    src.start();
    this.loops[id] = { src, g };
  },

  stopLoop(id) {
    const l = this.loops[id];
    if (l) { try { l.src.stop(); } catch (e) {} delete this.loops[id]; }
  },

  stopAllLoops() { for (const id in this.loops) this.stopLoop(id); },

  // Appelée à chaque frame.
  update(player, enclosures) {
    if (!this.ctx) return;

    if (Settings.cacophony) {
      for (const e of enclosures) {
        if (this.buffers[e.animal.id]) this.startLoop(e.animal.id, 0.6);
      }
      return;
    }
    if (Object.keys(this.loops).length) this.stopAllLoops();

    const R = Settings.triggerRadius * CFG.TILE;
    const now = performance.now();
    for (const e of enclosures) {
      const id = e.animal.id;
      if (!this.buffers[id]) continue;
      const dx = e.cx - player.x;
      const dy = e.cy - player.y;
      const d = Math.hypot(dx, dy);
      if (d <= R) {
        if (!this.inside[id] && now - (this.lastPlay[id] || 0) > 700) {
          const vol = Math.max(0.15, 1 - d / R);
          this.playOnce(id, vol, dx / R);
        }
        this.inside[id] = true;
      } else if (d > R * 1.18) {
        this.inside[id] = false;
      }
    }
  },
};

// Enregistreur (micro)
function pickMime() {
  const list = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
  if (typeof MediaRecorder === "undefined" || !MediaRecorder.isTypeSupported) return "";
  for (const m of list) if (MediaRecorder.isTypeSupported(m)) return m;
  return "";
}

const Recorder = {
  mr: null, chunks: [], stream: null, startTime: 0,

  async start() {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mime = pickMime();
    this.mr = new MediaRecorder(this.stream, mime ? { mimeType: mime } : undefined);
    this.chunks = [];
    this.mr.ondataavailable = (e) => { if (e.data && e.data.size) this.chunks.push(e.data); };
    this.mr.start();
    this.startTime = performance.now();
  },

  elapsed() { return (performance.now() - this.startTime) / 1000; },

  stop() {
    return new Promise((res) => {
      this.mr.onstop = () => {
        const blob = new Blob(this.chunks, { type: this.mr.mimeType || "audio/webm" });
        this._cleanup();
        res(blob);
      };
      this.mr.stop();
    });
  },

  _cleanup() {
    if (this.stream) this.stream.getTracks().forEach((t) => t.stop());
    this.stream = null; this.mr = null;
  },
};
