/* Skyscraper.io — synthesised sound effects (WebAudio) + looping background music */
(function () {
  "use strict";
  let ac = null, master = null, muted = false;
  try { muted = JSON.parse(localStorage.getItem("sky_mute") || "false"); } catch (e) { /* private mode */ }

  // ---- background music: "Feeling on Top", looped, sits under the sfx ----
  const MUSIC_SRC = "assets/audio/feeling-on-top.mp3";
  const MUSIC_VOL = 0.22;          // sfx master is 0.6, so music stays well underneath
  let musicGain = null, musicState = "idle", musicEl = null; // idle | loading | playing | failed

  function startMusic() {
    if (muted || !ac || musicState !== "idle") return;
    musicState = "loading";
    fetch(MUSIC_SRC)
      .then(r => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
      .then(buf => new Promise((res, rej) => ac.decodeAudioData(buf, res, rej)))
      .then(audio => {
        // AudioBufferSourceNode loops sample-accurately (no gap like <audio loop>)
        const src = ac.createBufferSource();
        src.buffer = audio; src.loop = true;
        src.connect(musicGain); src.start();
        musicState = "playing";
      })
      .catch(() => {
        // fetch is blocked on file:// — fall back to a plain looping <audio>
        try {
          musicEl = new Audio(MUSIC_SRC);
          musicEl.loop = true; musicEl.volume = MUSIC_VOL;
          musicEl.muted = muted;
          musicEl.play().then(() => { musicState = "playing"; }, () => { musicState = "idle"; musicEl = null; });
        } catch (e) { musicState = "failed"; }
      });
  }

  function unlock() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      if (!ac) {
        ac = new AC();
        const comp = ac.createDynamicsCompressor();
        master = ac.createGain();
        master.gain.value = muted ? 0 : 0.6;
        master.connect(comp); comp.connect(ac.destination);
        musicGain = ac.createGain();
        musicGain.gain.value = muted ? 0 : MUSIC_VOL;
        musicGain.connect(ac.destination);
      }
      if (ac.state === "suspended" && !document.hidden) ac.resume();
      startMusic();
    } catch (e) { ac = null; }
  }

  // Browsers only allow audio after a user gesture: start on the first tap/key anywhere.
  ["pointerdown", "keydown", "touchend"].forEach(ev =>
    window.addEventListener(ev, unlock, { capture: true, passive: true }));
  // Pause everything while the tab is in the background.
  document.addEventListener("visibilitychange", () => {
    if (!ac) return;
    if (document.hidden) { ac.suspend(); if (musicEl) musicEl.pause(); }
    else { ac.resume(); if (musicEl && !muted) musicEl.play().catch(() => {}); }
  });

  // ---- building blocks ----
  function env(g, t, a, peak, d) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }
  function tone({ type = "sine", f0, f1, t = 0, a = 0.005, d = 0.2, peak = 0.3, filter }) {
    const now = ac.currentTime + t;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, now);
    if (f1) o.frequency.exponentialRampToValueAtTime(f1, now + a + d);
    let node = o;
    if (filter) {
      const bq = ac.createBiquadFilter();
      bq.type = filter.type; bq.frequency.setValueAtTime(filter.f0, now);
      if (filter.f1) bq.frequency.exponentialRampToValueAtTime(filter.f1, now + a + d);
      node.connect(bq); node = bq;
    }
    node.connect(g); g.connect(master);
    env(g, now, a, peak, d);
    o.start(now); o.stop(now + a + d + 0.05);
  }
  let noiseBuf = null;
  function noise({ t = 0, d = 0.1, peak = 0.3, type = "bandpass", f = 800, q = 1, f1 }) {
    if (!noiseBuf) {
      noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
      const ch = noiseBuf.getChannelData(0);
      for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
    }
    const now = ac.currentTime + t;
    const s = ac.createBufferSource(), bq = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = noiseBuf;
    bq.type = type; bq.frequency.setValueAtTime(f, now); bq.Q.value = q;
    if (f1) bq.frequency.exponentialRampToValueAtTime(f1, now + d);
    s.connect(bq); bq.connect(g); g.connect(master);
    env(g, now, 0.005, peak, d);
    s.start(now); s.stop(now + d + 0.05);
  }
  const jit = (f, p) => f * (1 + (Math.random() * 2 - 1) * p);
  const PASS = [520, 620, 740, 880, 1040, 1240];

  const SOUNDS = {
    click() { tone({ f0: 1000, d: 0.025, peak: 0.12 }); },
    start() { tone({ f0: 70, f1: 45, d: 0.25, peak: 0.6 }); noise({ d: 0.12, f: 800, peak: 0.25 }); },
    count(o) { tone({ type: "square", f0: o && o.last ? 1320 : 880, d: 0.06, peak: 0.08 }); },
    key() { tone({ f0: 2000, d: 0.015, peak: 0.03 }); },
    submit() { tone({ f0: 110, f1: 80, d: 0.12, peak: 0.5 }); tone({ type: "triangle", f0: 785, d: 0.03, peak: 0.2 }); },
    pass(o) { tone({ type: "triangle", f0: PASS[(o && o.i) || 0], d: 0.07, peak: 0.22 }); },
    stop(o) {
      const i = (o && o.i) || 0;
      const base = 440 * Math.pow(2, i / 6);
      [1, 1.26, 1.5].forEach((m, k) => tone({ type: "triangle", f0: base * m, t: k * 0.06, d: 0.18, peak: 0.18 }));
      if (i >= 3) {
        tone({ f0: 45, d: 0.4, peak: 0.6 });
        tone({ f0: 1500, f1: 2100, d: 0.6, peak: 0.06 }); tone({ f0: 1512, f1: 2125, d: 0.6, peak: 0.06 });
      }
    },
    gem() {
      tone({ f0: 45, d: 1.5, peak: 0.7 });
      tone({ f0: 1500, f1: 2100, a: 0.05, d: 1.4, peak: 0.07 }); tone({ f0: 1515, f1: 2120, a: 0.05, d: 1.4, peak: 0.07 });
      [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, k) => tone({ type: "triangle", f0: f, t: 0.1 + k * 0.09, d: 0.45, peak: 0.2 }));
      noise({ t: 0.15, d: 1.0, f: 1200, q: 0.4, peak: 0.08, type: "bandpass" });
    },
    trap() { tone({ type: "sawtooth", f0: 440, f1: 400, d: 0.14, peak: 0.12, filter: { type: "lowpass", f0: 2400, f1: 700 } }); tone({ type: "sawtooth", f0: 340, f1: 300, t: 0.16, d: 0.28, peak: 0.12, filter: { type: "lowpass", f0: 1800, f1: 400 } }); },
    miss() { noise({ d: 0.04, type: "highpass", f: 3000, peak: 0.35 }); tone({ f0: 300, f1: 80, t: 0.03, d: 0.5, peak: 0.3 }); },
    nope() { tone({ type: "square", f0: 220, f1: 180, d: 0.09, peak: 0.1, filter: { type: "lowpass", f0: 1400 } }); tone({ type: "square", f0: 165, t: 0.1, d: 0.12, peak: 0.1, filter: { type: "lowpass", f0: 1200 } }); },
    tick() { tone({ f0: 1600, d: 0.02, peak: 0.05 }); },
    clank() { [310, 523, 1170].forEach(f => tone({ f0: jit(f, 0.08), a: 0.002, d: 0.12, peak: 0.07 })); noise({ d: 0.05, f: 2500, q: 2, peak: 0.05 }); },
    whir() { tone({ type: "sawtooth", f0: 90, f1: 140, d: 0.5, peak: 0.08, filter: { type: "lowpass", f0: 600 } }); },
    ding() { tone({ f0: 1568, d: 1.2, peak: 0.12 }); tone({ f0: 3136, d: 0.9, peak: 0.05 }); },
    topout() {
      [261.6, 329.6, 392, 523.25, 659.25].forEach((f, k) => tone({ type: "triangle", f0: f, t: k * 0.11, d: 0.5, peak: 0.2 }));
      [0, 0.18, 0.36].forEach(t => setTimeout(() => SOUNDS.clank(), t * 1000));
    }
  };

  window.Sfx = {
    unlock,
    play(name, opts) {
      if (muted || !ac || !master || !SOUNDS[name]) return;
      try { SOUNDS[name](opts); } catch (e) { /* never break the game for audio */ }
    },
    setMuted(m) {
      muted = !!m;
      try { localStorage.setItem("sky_mute", JSON.stringify(muted)); } catch (e) { /* ignore */ }
      if (ac && master) master.gain.setTargetAtTime(muted ? 0 : 0.6, ac.currentTime, 0.02);
      if (ac && musicGain) musicGain.gain.setTargetAtTime(muted ? 0 : MUSIC_VOL, ac.currentTime, 0.08);
      if (musicEl) musicEl.muted = muted;
      if (!muted) startMusic();
    },
    get muted() { return muted; },
    get musicState() { return musicState; }
  };
})();
