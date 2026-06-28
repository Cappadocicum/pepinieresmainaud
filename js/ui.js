// Interface : panneaux, enregistrement, réglages.
const UI = {
  cur: null,          // enclos courant
  recording: false,
  previewURL: null,
  timerRAF: 0,

  init() {
    this.el = {
      splash: document.getElementById("splash"),
      startBtn: document.getElementById("startBtn"),
      progress: document.getElementById("progress"),
      gearBtn: document.getElementById("gearBtn"),
      cacoBtn: document.getElementById("cacoBtn"),
      buildBtn: document.getElementById("buildBtn"),
      nearHint: document.getElementById("nearHint"),
      actionBtn: document.getElementById("actionBtn"),
      // construction
      palette: document.getElementById("palette"),
      paletteGrid: document.getElementById("paletteGrid"),
      paletteToggle: document.getElementById("paletteToggle"),
      buildDone: document.getElementById("buildDone"),
      placeBar: document.getElementById("placeBar"),
      placeEmoji: document.getElementById("placeEmoji"),
      placeName: document.getElementById("placeName"),
      placeConfirm: document.getElementById("placeConfirm"),
      placeCancel: document.getElementById("placeCancel"),
      placeDelete: document.getElementById("placeDelete"),
      sizeMinus: document.getElementById("sizeMinus"),
      sizePlus: document.getElementById("sizePlus"),
      sizeVal: document.getElementById("sizeVal"),
      countMinus: document.getElementById("countMinus"),
      countPlus: document.getElementById("countPlus"),
      countVal: document.getElementById("countVal"),
      recenterBtn: document.getElementById("recenterBtn"),
      // panneau animal
      animalPanel: document.getElementById("animalPanel"),
      apEmoji: document.getElementById("apEmoji"),
      apName: document.getElementById("apName"),
      apTier: document.getElementById("apTier"),
      apStatus: document.getElementById("apStatus"),
      recBtn: document.getElementById("recBtn"),
      playBtn: document.getElementById("playBtn"),
      delBtn: document.getElementById("delBtn"),
      recTimer: document.getElementById("recTimer"),
      // réglages
      settingsPanel: document.getElementById("settingsPanel"),
      setCaco: document.getElementById("setCaco"),
      setVol: document.getElementById("setVol"),
      volVal: document.getElementById("volVal"),
      setRad: document.getElementById("setRad"),
      radVal: document.getElementById("radVal"),
      resetBtn: document.getElementById("resetBtn"),
      preview: document.getElementById("previewAudio"),
      toast: document.getElementById("toast"),
    };
    this.bind();
    this.updateProgress();
    this.syncCacoBtn();
  },

  bind() {
    const e = this.el;
    e.gearBtn.onclick = () => this.openSettings();
    e.cacoBtn.onclick = () => { Settings.cacophony = !Settings.cacophony; Settings.save(); this.syncCacoBtn(); };
    e.actionBtn.onclick = () => { if (Game.near) this.openAnimal(Game.near); };
    e.buildBtn.onclick = () => Build.toggle();
    e.buildDone.onclick = () => Build.exit();
    e.paletteToggle.onclick = () => {
      const collapsed = e.palette.classList.toggle("collapsed");
      e.paletteToggle.textContent = collapsed ? "⬆️ Agrandir" : "⬇️ Réduire";
    };
    e.placeConfirm.onclick = () => Build.confirm();
    e.placeCancel.onclick = () => Build.cancelPlacing();
    e.placeDelete.onclick = () => Build.deletePlacing();
    e.sizeMinus.onclick = () => Build.changeSize(-1);
    e.sizePlus.onclick = () => Build.changeSize(1);
    e.countMinus.onclick = () => Build.changeCount(-1);
    e.countPlus.onclick = () => Build.changeCount(1);
    e.recenterBtn.onclick = () => Build.recenter();

    document.querySelectorAll("[data-close]").forEach((b) => (b.onclick = () => this.closeAll()));
    [e.animalPanel, e.settingsPanel].forEach((p) =>
      p.addEventListener("click", (ev) => { if (ev.target === p) this.closeAll(); })
    );

    e.recBtn.onclick = () => this.toggleRecord();
    e.playBtn.onclick = () => this.previewPlay();
    e.delBtn.onclick = () => this.deleteVoice();

    e.setCaco.onchange = () => { Settings.cacophony = e.setCaco.checked; Settings.save(); this.syncCacoBtn(); };
    e.setVol.oninput = () => {
      Settings.masterVolume = e.setVol.value / 100;
      e.volVal.textContent = e.setVol.value + "%";
      AudioEngine.setMaster(Settings.masterVolume);
    };
    e.setVol.onchange = () => Settings.save();
    e.setRad.oninput = () => {
      Settings.triggerRadius = parseFloat(e.setRad.value);
      e.radVal.textContent = Settings.triggerRadius + " cases";
    };
    e.setRad.onchange = () => Settings.save();
    e.resetBtn.onclick = () => this.resetAll();
  },

  syncCacoBtn() {
    this.el.cacoBtn.classList.toggle("on", Settings.cacophony);
    this.el.cacoBtn.textContent = Settings.cacophony ? "🔇" : "📢";
    this.el.cacoBtn.title = Settings.cacophony ? "Arrêter la cacophonie" : "Tout faire crier en même temps";
  },

  updateProgress() {
    const placed = World.enclosures.length;
    const voices = Object.keys(AudioEngine.buffers).length;
    this.el.progress.textContent = placed + "/" + ANIMALS.length + " placés · " + voices + " voix";
  },

  // ---------- Mode construction ----------
  enterBuild() {
    document.body.classList.add("building");
    this.el.buildBtn.classList.add("on");
    this.el.nearHint.classList.add("hidden");
    this.el.placeBar.classList.add("hidden");
    this.openPalette();
  },
  exitBuild() {
    document.body.classList.remove("building");
    this.el.buildBtn.classList.remove("on");
    this.el.palette.classList.add("hidden");
    this.el.placeBar.classList.add("hidden");
  },
  openPalette() {
    this.el.placeBar.classList.add("hidden");
    this.el.palette.classList.remove("hidden", "collapsed");
    this.el.paletteToggle.textContent = "⬇️ Réduire";
    this.refreshPalette();
  },
  refreshPalette() {
    const grid = this.el.paletteGrid;
    grid.innerHTML = "";
    for (const a of ANIMALS) {
      const placed = Zoo.has(a.id);
      const item = document.createElement("button");
      item.className = "pal-item" + (placed ? " placed" : "");
      const img = Images.animal(a.id);
      item.innerHTML = (img ? '<img src="' + img.src + '" alt="">' : '<span class="pal-emoji">' + a.emoji + "</span>") +
        '<span class="pal-name">' + a.name + "</span>";
      item.onclick = () => { if (!placed) Build.selectAnimal(a.id); else this.toast(a.name + " est déjà placé"); };
      grid.appendChild(item);
    }
  },
  showPlacingBar(animal, isMove) {
    this.el.palette.classList.add("hidden");
    this.el.placeBar.classList.remove("hidden");
    const img = Images.animal(animal.id);
    this.el.placeEmoji.innerHTML = img ? '<img src="' + img.src + '" style="width:26px;height:26px;vertical-align:middle;object-fit:contain">' : animal.emoji;
    this.el.placeName.textContent = animal.name;
    this.el.placeDelete.classList.toggle("hidden", !isMove);
    this.updatePlaceControls();
  },
  updatePlaceControls() {
    this.el.sizeVal.textContent = Build.SIZE_NAMES[Build.sizeIdx];
    this.el.countVal.textContent = "× " + Build.count;
  },

  // ---------- Panneau animal ----------
  openAnimal(enc) {
    this.cur = enc;
    const a = enc.animal;
    const img = Images.animal(a.id);
    if (img) this.el.apEmoji.innerHTML = '<img src="' + img.src + '" alt="" style="width:64px;height:64px;object-fit:contain">';
    else this.el.apEmoji.textContent = a.emoji;
    this.el.apName.textContent = a.name;
    this.el.apTier.textContent = TIERS[a.tier].label;
    this.refreshAnimal();
    this.el.animalPanel.classList.remove("hidden");
    Input.clear();
  },

  refreshAnimal() {
    const a = this.cur.animal;
    const has = AudioEngine.has(a.id);
    this.el.apStatus.textContent = has ? "Voix enregistrée ✓" : "Pas encore de voix 🎤";
    this.el.apStatus.classList.toggle("ok", has);
    this.el.recBtn.textContent = has ? "🎤 Réenregistrer" : "🎤 Enregistrer";
    this.el.playBtn.disabled = !has;
    this.el.delBtn.disabled = !has;
  },

  async toggleRecord() {
    if (!this.recording) {
      try {
        AudioEngine.resume();
        await Recorder.start();
        this.recording = true;
        this.el.recBtn.textContent = "⏹️ Stop";
        this.el.recBtn.classList.add("recording");
        this.el.recTimer.classList.remove("hidden");
        this.el.playBtn.disabled = true;
        this.el.delBtn.disabled = true;
        const tick = () => {
          if (!this.recording) return;
          this.el.recTimer.textContent = "● " + Recorder.elapsed().toFixed(1).replace(".", ",") + " s";
          this.timerRAF = requestAnimationFrame(tick);
        };
        tick();
      } catch (err) {
        this.toast("🎙️ Micro refusé ou indisponible");
        console.warn(err);
      }
    } else {
      this.recording = false;
      cancelAnimationFrame(this.timerRAF);
      this.el.recBtn.classList.remove("recording");
      this.el.recTimer.classList.add("hidden");
      const blob = await Recorder.stop();
      const id = this.cur.animal.id;
      await Store.saveVoice(id, blob);
      const ok = await AudioEngine.load(id, blob);
      if (!ok) this.toast("⚠️ Enregistrement illisible, réessaie");
      else this.toast("✅ Voix de « " + this.cur.animal.name + " » enregistrée !");
      this.refreshAnimal();
      this.updateProgress();
    }
  },

  async previewPlay() {
    const id = this.cur.animal.id;
    const blob = await Store.getVoice(id);
    if (!blob) return;
    if (this.previewURL) URL.revokeObjectURL(this.previewURL);
    this.previewURL = URL.createObjectURL(blob);
    this.el.preview.src = this.previewURL;
    this.el.preview.play().catch(() => {});
  },

  async deleteVoice() {
    const a = this.cur.animal;
    if (!confirm("Effacer la voix de « " + a.name + " » ?")) return;
    await Store.delVoice(a.id);
    AudioEngine.unload(a.id);
    this.refreshAnimal();
    this.updateProgress();
    this.toast("🗑️ Voix effacée");
  },

  // ---------- Réglages ----------
  openSettings() {
    const e = this.el;
    e.setCaco.checked = Settings.cacophony;
    e.setVol.value = Math.round(Settings.masterVolume * 100);
    e.volVal.textContent = e.setVol.value + "%";
    e.setRad.value = Settings.triggerRadius;
    e.radVal.textContent = Settings.triggerRadius + " cases";
    e.settingsPanel.classList.remove("hidden");
    Input.clear();
  },

  async resetAll() {
    if (!confirm("Effacer TOUTES les voix du zoo ? Cette action est définitive.")) return;
    await Store.clearVoices();
    for (const id of Object.keys(AudioEngine.buffers)) AudioEngine.unload(id);
    this.updateProgress();
    this.toast("🧹 Toutes les voix ont été effacées");
  },

  closeAll() {
    if (this.recording) return; // ne pas fermer pendant l'enregistrement
    this.el.animalPanel.classList.add("hidden");
    this.el.settingsPanel.classList.add("hidden");
    this.cur = null;
  },

  setNear(enc) {
    const e = this.el;
    if (enc && this.el.animalPanel.classList.contains("hidden") &&
        this.el.settingsPanel.classList.contains("hidden")) {
      const has = AudioEngine.has(enc.animal.id);
      e.nearHint.textContent = (has ? "🔊 " : "🎤 ") + enc.animal.name +
        (has ? " — touche pour réécouter/modifier" : " — touche pour enregistrer sa voix");
      e.nearHint.classList.remove("hidden");
      e.actionBtn.classList.toggle("glow", !has);
    } else {
      e.nearHint.classList.add("hidden");
      e.actionBtn.classList.remove("glow");
    }
  },

  _toastT: 0,
  toast(msg) {
    const t = this.el.toast;
    t.textContent = msg;
    t.classList.remove("hidden");
    clearTimeout(this._toastT);
    this._toastT = setTimeout(() => t.classList.add("hidden"), 2200);
  },
};
