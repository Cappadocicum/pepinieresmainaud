// Chargeur d'images générées (portraits d'animaux + textures de sol).
// Tout est optionnel : si le dossier assets/ n'existe pas encore,
// le jeu retombe automatiquement sur les emoji et les couleurs unies.
const Images = {
  animals: {},   // id -> HTMLImageElement
  tex: {},       // type -> HTMLImageElement
  decors: {},    // id -> HTMLImageElement
  heroes: {},    // name -> HTMLImageElement
  patterns: {},  // type -> CanvasPattern (créé à la volée)
  ready: false,

  async load() {
    let manifest;
    try {
      const r = await fetch("assets/manifest.json", { cache: "no-cache" });
      if (!r.ok) return;
      manifest = await r.json();
    } catch (e) {
      return; // pas d'assets : on garde emoji + couleurs
    }

    const jobs = [];
    for (const id of manifest.animals || []) {
      jobs.push(this._loadImg("assets/animaux/" + id + ".png").then((img) => { if (img) this.animals[id] = img; }));
    }
    for (const t of manifest.textures || []) {
      jobs.push(this._loadImg("assets/textures/" + t + ".png").then((img) => { if (img) this.tex[t] = img; }));
    }
    for (const d of manifest.decors || []) {
      jobs.push(this._loadImg("assets/decors/" + d + ".png").then((img) => { if (img) this.decors[d] = img; }));
    }
    for (const hn of manifest.heroes || []) {
      jobs.push(this._loadImg("assets/perso/" + hn + ".png").then((img) => { if (img) this.heroes[hn] = img; }));
    }
    await Promise.all(jobs);
    this.ready = true;
  },

  decor(id) { return this.decors[id] || null; },
  hero(name) { return this.heroes[name] || null; },

  _loadImg(src) {
    return new Promise((res) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = () => res(null);
      img.src = src;
    });
  },

  animal(id) { return this.animals[id] || null; },

  // Motif répétable pour un type de sol (grass/sand/water/snow)
  pattern(ctx, type) {
    if (this.patterns[type]) return this.patterns[type];
    const img = this.tex[type];
    if (!img) return null;
    const p = ctx.createPattern(img, "repeat");
    this.patterns[type] = p;
    return p;
  },
};
