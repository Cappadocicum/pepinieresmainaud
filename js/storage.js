// Sauvegarde locale : les voix (blobs audio) dans IndexedDB,
// les réglages et la position du joueur dans localStorage.
const Store = {
  db: null,

  open() {
    return new Promise((res, rej) => {
      const r = indexedDB.open("zoo-lucas-logan", 1);
      r.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("voices")) db.createObjectStore("voices");
      };
      r.onsuccess = (e) => { this.db = e.target.result; res(); };
      r.onerror = () => rej(r.error);
    });
  },

  saveVoice(id, blob) { return this._tx("readwrite", (s) => s.put(blob, id)); },
  delVoice(id)        { return this._tx("readwrite", (s) => s.delete(id)); },
  getVoice(id)        { return this._get((s) => s.get(id)); },
  allVoiceIds()       { return this._get((s) => s.getAllKeys()); },
  clearVoices()       { return this._tx("readwrite", (s) => s.clear()); },

  _tx(mode, fn) {
    return new Promise((res, rej) => {
      const t = this.db.transaction("voices", mode);
      fn(t.objectStore("voices"));
      t.oncomplete = () => res();
      t.onerror = () => rej(t.error);
    });
  },
  _get(fn) {
    return new Promise((res, rej) => {
      const t = this.db.transaction("voices", "readonly");
      const req = fn(t.objectStore("voices"));
      req.onsuccess = () => res(req.result);
      req.onerror = () => rej(req.error);
    });
  },
};

// Réglages persistants
const Settings = {
  cacophony: false,
  masterVolume: 0.9,
  triggerRadius: CFG.DEFAULT_TRIGGER_RADIUS,

  load() {
    try {
      const s = JSON.parse(localStorage.getItem("zoo-settings") || "{}");
      if (typeof s.cacophony === "boolean") this.cacophony = s.cacophony;
      if (typeof s.masterVolume === "number") this.masterVolume = s.masterVolume;
      if (typeof s.triggerRadius === "number") this.triggerRadius = s.triggerRadius;
    } catch (e) {}
  },
  save() {
    localStorage.setItem("zoo-settings", JSON.stringify({
      cacophony: this.cacophony,
      masterVolume: this.masterVolume,
      triggerRadius: this.triggerRadius,
    }));
  },
};

// Enclos posés par le joueur : [{ id, ex, ey }]
const Zoo = {
  placements: [],
  load() {
    try { this.placements = JSON.parse(localStorage.getItem("zoo-placements") || "[]"); }
    catch (e) { this.placements = []; }
  },
  save() { localStorage.setItem("zoo-placements", JSON.stringify(this.placements)); },
  place(id, ex, ey) {
    this.placements = this.placements.filter((p) => p.id !== id);
    this.placements.push({ id, ex, ey });
    this.save();
  },
  remove(id) { this.placements = this.placements.filter((p) => p.id !== id); this.save(); },
  has(id) { return this.placements.some((p) => p.id === id); },
};

// Position du joueur
const SaveState = {
  loadPlayer() {
    try { return JSON.parse(localStorage.getItem("zoo-player") || "null"); }
    catch (e) { return null; }
  },
  savePlayer(x, y) {
    localStorage.setItem("zoo-player", JSON.stringify({ x, y }));
  },
};
