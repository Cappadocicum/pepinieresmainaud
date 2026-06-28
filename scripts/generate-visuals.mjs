// Génération des visuels du zoo avec l'API Gemini (modèle image "Nano Banana").
//
// Usage :
//   GEMINI_API_KEY=xxxx node scripts/generate-visuals.mjs [--limit N] [--only animaux|textures|props] [--force]
//
// - Génère les portraits des 50 animaux (fond détouré -> transparent),
//   4 textures de sol et quelques décors, dans le dossier assets/.
// - Reprend là où il s'est arrêté (saute les fichiers déjà présents) sauf --force.
// - La clé n'est lue que depuis l'environnement, jamais écrite sur disque.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-image";
if (!KEY) { console.error("❌ GEMINI_API_KEY manquante."); process.exit(1); }

const args = process.argv.slice(2);
const LIMIT = args.includes("--limit") ? parseInt(args[args.indexOf("--limit") + 1], 10) : Infinity;
const ONLY = args.includes("--only") ? args[args.indexOf("--only") + 1] : "all";
const FORCE = args.includes("--force");
const CONCURRENCY = 3;

// ---- Liste des animaux : lue depuis js/animals.js ----
function parseAnimals() {
  const src = fs.readFileSync(path.join(ROOT, "js", "animals.js"), "utf8");
  const re = /\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*emoji:\s*"[^"]*",\s*tier:\s*"([^"]+)",\s*ground:\s*"([^"]+)"\s*\}/g;
  const out = [];
  let m;
  while ((m = re.exec(src))) out.push({ id: m[1], name: m[2], tier: m[3], ground: m[4] });
  return out;
}

const STYLE = "cute funny cartoon mascot, big friendly expressive eyes, thick bold black outline, " +
  "flat bright cel-shaded colors, playful children's comic / sticker style for a kids zoo game " +
  "(audience 9-10 years old), head-and-shoulders portrait, centered, facing forward.";
const BG = "The character is placed on a clean uniform near-white (#f2f2f2) background, " +
  "with a clear empty margin all around the edges, no scenery, no frame, no border, no drop shadow, no text, no letters. Square image.";

function animalPrompt(a) {
  return `A ${STYLE} The animal is a ${a.name.toLowerCase()}. Make it adorable and a little silly. ${BG}`;
}

const TEX_STYLE = "16-bit SNES pixel art, top-down overworld ground tile in the exact style of " +
  "The Legend of Zelda: A Link to the Past (SNES), crisp clean pixels, limited retro palette, " +
  "seamless tileable repeating texture, uniform, low contrast, no objects, no characters, no text. Square.";
const TEXTURES = {
  grass: `${TEX_STYLE} Lush bright green overworld grass with a few subtle darker grass blades.`,
  sand:  `${TEX_STYLE} Warm light desert sand / beach.`,
  water: `${TEX_STYLE} Bright blue water with small pixel ripples and sparkles, classic Zelda overworld water.`,
  snow:  `${TEX_STYLE} Clean white-blue snow.`,
  path:  `${TEX_STYLE} Light tan packed-earth dirt path with a few small pebbles.`,
  bridge:`${TEX_STYLE} Brown wooden plank bridge boards.`,
};

const PROP_STYLE = "16-bit SNES pixel art top-down game object in the exact style of " +
  "The Legend of Zelda: A Link to the Past (SNES), crisp clean pixels, limited retro palette, " +
  "NO face, NO eyes, not a character, not an animal.";
const PROPS = {
  arbre:    `${PROP_STYLE} A single round leafy overworld tree with a brown trunk. ${BG}`,
  buisson:  `${PROP_STYLE} A single small green leafy bush. ${BG}`,
  rocher:   `${PROP_STYLE} A single grey boulder rock. ${BG}`,
};

// ---- Appel Gemini avec retries ----
async function genImage(prompt, tries = 5) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`;
  const body = { contents: [{ parts: [{ text: prompt }] }] };
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (r.status === 429 || r.status >= 500) { await sleep(2000 * (i + 1)); continue; }
      const j = await r.json();
      if (!r.ok) throw new Error(JSON.stringify(j).slice(0, 300));
      const part = (j.candidates?.[0]?.content?.parts || []).find((p) => p.inlineData);
      if (!part) throw new Error("pas d'image dans la réponse");
      return Buffer.from(part.inlineData.data, "base64");
    } catch (e) {
      if (i === tries - 1) throw e;
      await sleep(1500 * (i + 1));
    }
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- Détourage : rend transparent le fond clair connecté aux bords ----
async function cutout(raw) {
  const { data, info } = await sharp(raw).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const isBg = (i) => {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    return mn >= 218 && mx - mn <= 18; // clair et peu saturé
  };
  const seen = new Uint8Array(W * H);
  const queue = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const p = y * W + x;
    if (seen[p]) return;
    if (!isBg(p * 4)) return;
    seen[p] = 1; queue.push(p);
  };
  for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
  for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
  while (queue.length) {
    const p = queue.pop();
    const x = p % W, y = (p / W) | 0;
    data[p * 4 + 3] = 0; // alpha = 0
    push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
  }
  return sharp(data, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
}

async function saveAnimal(a) {
  const out = path.join(ROOT, "assets", "animaux", a.id + ".png");
  if (!FORCE && fs.existsSync(out)) return "skip";
  const raw = await genImage(animalPrompt(a));
  const cut = await cutout(raw);
  await sharp(cut).resize(256, 256, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, palette: true, quality: 85 }).toFile(out);
  return "ok";
}

async function saveProp(id, prompt) {
  const out = path.join(ROOT, "assets", "decors", id + ".png");
  if (!FORCE && fs.existsSync(out)) return "skip";
  const raw = await genImage(prompt);
  const cut = await cutout(raw);
  await sharp(cut).resize(160, 160, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, palette: true }).toFile(out);
  return "ok";
}

async function saveTexture(id, prompt) {
  const out = path.join(ROOT, "assets", "textures", id + ".png");
  if (!FORCE && fs.existsSync(out)) return "skip";
  const raw = await genImage(prompt);
  await sharp(raw).resize(256, 256).png({ compressionLevel: 9, palette: true }).toFile(out);
  return "ok";
}

// ---- Pool de tâches ----
async function runPool(tasks) {
  let i = 0, done = 0;
  async function worker() {
    while (i < tasks.length) {
      const idx = i++;
      const t = tasks[idx];
      try {
        const res = await t.fn();
        done++;
        console.log(`[${done}/${tasks.length}] ${res === "skip" ? "⏭️ " : "✅"} ${t.label}`);
      } catch (e) {
        console.log(`[!] ❌ ${t.label} — ${e.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
}

(async () => {
  for (const d of ["animaux", "textures", "decors"]) fs.mkdirSync(path.join(ROOT, "assets", d), { recursive: true });
  const animals = parseAnimals();
  const tasks = [];

  if (ONLY === "all" || ONLY === "animaux")
    animals.slice(0, LIMIT).forEach((a) => tasks.push({ label: "animal " + a.id, fn: () => saveAnimal(a) }));
  if (ONLY === "all" || ONLY === "textures")
    Object.entries(TEXTURES).forEach(([id, p]) => tasks.push({ label: "texture " + id, fn: () => saveTexture(id, p) }));
  if (ONLY === "all" || ONLY === "props")
    Object.entries(PROPS).forEach(([id, p]) => tasks.push({ label: "decor " + id, fn: () => saveProp(id, p) }));

  console.log(`Génération de ${tasks.length} visuels (modèle ${MODEL})…`);
  await runPool(tasks);

  // Manifeste : ce qui existe réellement
  const exists = (dir, id) => fs.existsSync(path.join(ROOT, "assets", dir, id + ".png"));
  const manifest = {
    animals: animals.map((a) => a.id).filter((id) => exists("animaux", id)),
    textures: Object.keys(TEXTURES).filter((id) => exists("textures", id)),
    decors: Object.keys(PROPS).filter((id) => exists("decors", id)),
  };
  fs.writeFileSync(path.join(ROOT, "assets", "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`\n📦 manifest.json : ${manifest.animals.length} animaux, ${manifest.textures.length} textures, ${manifest.decors.length} décors.`);
})();
