/* Skyscraper.io — game controller
 * Phases (body[data-phase]): intro → countdown → question → hoist → reveal → (countdown → …) → topping → end
 */
(function () {
  "use strict";
  const CFG = window.SKY_CONFIG;
  const { TIERS, MILESTONES, ROUND_SIZE, TIME_LIMIT, MAX_HEIGHT } = CFG;
  const TIER = Object.fromEntries(TIERS.map(t => [t.key, t]));
  const TIER_INDEX = Object.fromEntries(TIERS.map((t, i) => [t.key, i]));
  const QUESTIONS = (window.SKYSCRAPER_DATA && window.SKYSCRAPER_DATA.questions) || [];
  const M = window.SkyMatcher;

  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  };
  const sfx = (n, o) => window.Sfx && Sfx.play(n, o);
  const reduced = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = ms => new Promise(r => setTimeout(r, SkyGame.skipFx ? 0 : ms));

  const state = { phase: "intro", round: [], idx: 0, results: [], height: 0, shown: 0, timer: 0, deadline: 0, locked: false, cdTimer: 0, revealReady: 0 };
  const mobile = () => window.innerWidth < 900;
  function setPhase(p) { state.phase = p; document.body.dataset.phase = p; }

  // ---------------- tier icon (a tiny tower whose height reflects the tier) ----------------
  function tierIcon(key, size = 22) {
    const i = key ? TIER_INDEX[key] : -1;
    const h = i < 0 ? 2 : 4 + i * 3.2;
    return `<svg class="ticon" viewBox="0 0 16 24" width="${size * 0.67}" height="${size}" aria-hidden="true">
      <rect x="1" y="22.5" width="14" height="1.5" rx=".5" fill="currentColor" opacity=".35"/>
      <rect x="4" y="${22.5 - h}" width="8" height="${h}" rx="1" fill="currentColor"/>
      ${i === 5 ? '<rect x="7.4" y="1" width="1.2" height="4" fill="currentColor"/>' : ""}</svg>`;
  }

  // ---------------- round selection ----------------
  function pickRound() {
    const seen = store.get("sky_seen", []);
    const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const fresh = shuffle(QUESTIONS.filter(q => !seen.includes(q.id)));
    const old = shuffle(QUESTIONS.filter(q => seen.includes(q.id)));
    const pool = fresh.concat(old);
    const pick = [], cats = {};
    for (const q of pool) { if (pick.length >= ROUND_SIZE) break; if ((cats[q.category] || 0) < 1) { pick.push(q); cats[q.category] = 1; } }
    for (const q of pool) { if (pick.length >= ROUND_SIZE) break; if (!pick.includes(q)) pick.push(q); }
    store.set("sky_seen", seen.concat(pick.map(q => q.id)).slice(-Math.max(0, QUESTIONS.length - ROUND_SIZE)));
    return shuffle(pick);
  }

  // ---------------- layout for the canvas renderers ----------------
  function viewport() {
    const W = window.innerWidth, H = window.innerHeight;
    const top = ($("#topbar").getBoundingClientRect().bottom || 60) + 8;
    if (state.phase === "end") {
      if (mobile()) {
        const r = $("#endTop").getBoundingClientRect();
        return { x0: W * 0.5, x1: W, y0: r.top + 26, y1: r.bottom - 6, ruler: W - 62 };
      }
      const r = $("#summary").getBoundingClientRect();
      return { x0: r.right + 8, x1: W, y0: top + 10, y1: H - 54, ruler: W - 76 };
    }
    const panel = state.phase === "intro" ? $("#intro") : $("#card");
    const r = panel.getBoundingClientRect();
    if (mobile()) return { x0: 0, x1: W, y0: top, y1: (r.top || H * 0.45) - 4, ruler: W - 78 };
    return { x0: (r.right || 440) + 12, x1: W, y0: top + 6, y1: H - 16, ruler: W - 96 };
  }

  // ---------------- HUD ----------------
  function renderPips() {
    let h = "";
    for (let i = 0; i < ROUND_SIZE; i++) {
      const r = state.results[i];
      const live = ["countdown", "question", "hoist", "reveal"].includes(state.phase);
      const cls = r ? (r.tier ? "done t-" + r.tier : "done miss") : (i === state.idx && live ? "now" : "");
      h += `<span class="pip ${cls}" title="${r ? esc(r.tier ? TIER[r.tier].name : "No floors") : "Prompt " + (i + 1)}"></span>`;
    }
    $("#pips").innerHTML = h;
    setHud(state.shown);
  }
  function setHud(m) {
    state.shown = m;
    $("#hudHeight").textContent = Math.round(m) + " m";
    const deep = state.results.filter(r => r && TIER_INDEX[r.tier] >= 3).length;
    $("#hudTier").textContent = deep ? `${deep} × ◆ Skyscraper+` : "";
  }
  function countUp(from, to, ms) {
    return new Promise(res => {
      if (SkyGame.skipFx || reduced() || to === from) { setHud(to); res(); return; }
      const t0 = performance.now(); let lastTick = from;
      const step = now => {
        const k = Math.min(1, (now - t0) / ms);
        const v = from + (to - from) * (1 - Math.pow(1 - k, 3));
        setHud(v);
        if (v - lastTick >= 50 || (k === 1 && to !== from)) { sfx("tick"); lastTick = v; }
        if (k < 1) requestAnimationFrame(step); else res();
      };
      requestAnimationFrame(step);
    });
  }

  // ---------------- countdown ----------------
  function cardHead(q) {
    return `<div class="card-head"><span class="chip">${esc(q.category || "Civil Engineering")}</span><span class="count mono">PROMPT ${state.idx + 1} / ${ROUND_SIZE}</span></div>
      <h2 class="prompt">${esc(q.prompt)}</h2>`;
  }
  function showCountdown() {
    setPhase("countdown"); state.locked = false;
    const q = state.round[state.idx];
    $("#card").classList.remove("dim");
    $("#card").innerHTML = `${cardHead(q)}
      <div class="countdown mono" id="countdown"><span>Read it… the clock starts in</span> <b id="cdNum">${CFG.COUNTDOWN}</b></div>
      <p class="hint">Press <kbd>Enter</kbd> to skip ahead.</p>`;
    renderPips();
    if (SkyGame.skipFx) { showQuestion(); return; }
    let n = CFG.COUNTDOWN;
    sfx("count");
    clearInterval(state.cdTimer);
    state.cdTimer = setInterval(() => {
      n--;
      if (n <= 0) { clearInterval(state.cdTimer); showQuestion(); return; }
      const el = $("#cdNum"); if (el) { el.textContent = n; el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
      sfx("count", { last: n === 1 });
    }, 1000);
  }

  // ---------------- question ----------------
  function showQuestion() {
    clearInterval(state.cdTimer);
    if (state.phase !== "countdown") return;
    setPhase("question"); state.locked = false;
    const q = state.round[state.idx];
    $("#card").innerHTML = `${cardHead(q)}
      <div class="answer-area slide-up">
        <div class="timer" aria-hidden="true"><div class="timer-fill" id="timerFill"></div></div>
        <div class="timer-row mono"><span id="timerText">${TIME_LIMIT}s</span><span>rarer answer → taller tower</span></div>
        <form id="answerForm" autocomplete="off">
          <input id="answer" type="text" maxlength="80" placeholder="Type your answer…" aria-label="Your answer" autocapitalize="off" spellcheck="false" />
          <button type="submit" class="btn primary">Build <span aria-hidden="true">▲</span></button>
        </form>
        <p class="hint">One answer. Obvious ones barely leave the ground.</p>
      </div>`;
    $("#answerForm").addEventListener("submit", e => { e.preventDefault(); submit(false); });
    setTimeout(() => { const i = $("#answer"); i && i.focus({ preventScroll: true }); }, 30);
    state.deadline = performance.now() + TIME_LIMIT * 1000;
    cancelAnimationFrame(state.timer);
    const tick = () => {
      if (state.phase !== "question") return;
      const left = Math.max(0, state.deadline - performance.now());
      const fillEl = $("#timerFill"), txt = $("#timerText");
      if (fillEl) { fillEl.style.transform = `scaleX(${left / (TIME_LIMIT * 1000)})`; fillEl.classList.toggle("low", left < 5000); }
      if (txt) txt.textContent = Math.ceil(left / 1000) + "s";
      if (left <= 0) { submit(true); return; }
      state.timer = requestAnimationFrame(tick);
    };
    state.timer = requestAnimationFrame(tick);
  }

  async function submit(timedOut) {
    if (state.locked || state.phase !== "question") return;
    const q = state.round[state.idx];
    const raw = (($("#answer") && $("#answer").value) || "").trim();
    if (!raw && !timedOut) {
      const f = $("#answerForm"); $("#answer").focus(); f.classList.remove("shake"); void f.offsetWidth; f.classList.add("shake"); return;
    }
    state.locked = true;
    cancelAnimationFrame(state.timer);
    const m = raw ? M.match(raw, q) : null;
    const tier = m ? m.entry.tier : null;
    const res = { q, input: raw, entry: m && m.entry, tier, gain: tier ? TIER[tier].m : 0, timedOut: timedOut && !raw };
    state.results[state.idx] = res;
    const before = state.height;
    state.height += res.gain;

    // hoist: the answer rides the crane hook up past the tier lines
    setPhase("hoist");
    $("#card").classList.add("dim");
    sfx("submit");
    await Fx.hoist({ tierIndex: tier ? TIER_INDEX[tier] : null, label: raw || "— —", trap: tier === "vanity" });
    showReveal(res, before);
  }

  // ---------------- full-screen reveal ----------------
  function showReveal(res, before) {
    setPhase("reveal");
    renderPips();
    const last = state.idx === ROUND_SIZE - 1;
    const t = res.tier ? TIER[res.tier] : null;
    const fx = t ? t.fx : CFG.FX.miss;
    const fact = res.entry && res.q.facts && res.q.facts[res.entry.display];
    const typo = res.entry && M.norm(res.entry.display) !== M.norm(res.input) && !res.entry.aliases.some(a => M.norm(a) === M.norm(res.input));
    const title = t ? t.name : (res.timedOut ? "Time's up" : "Not on the blueprints");
    const el = $("#reveal");
    el.className = "reveal " + (t ? "t-" + t.key : "miss");
    el.style.setProperty("--scrim", fx.scrim);
    el.innerHTML = `
      <div class="rv-rays" aria-hidden="true"></div>
      <div class="rv-stack">
        <div class="rv-icon">${t && t.key === "megatall" ? '<span class="rv-gem" aria-hidden="true">◆</span>' : tierIcon(res.tier, 64)}</div>
        ${t && t.key === "megatall" ? '<div class="rv-badge mono">GEM</div>' : ""}
        <h2 class="rv-title">${esc(title).toUpperCase()}</h2>
        ${t && t.trap ? '<div class="rv-stamp mono" aria-hidden="true">TOO CLEVER</div>' : ""}
        <div class="rv-answer">${res.entry ? "“" + esc(res.entry.display) + "”" : res.input ? "“" + esc(res.input) + "”" : "No answer"}</div>
        <div class="rv-gain mono">+${res.gain} m <span>·</span> tower ${state.height} m</div>
        <p class="rv-fact mono ${fact ? "has-fact" : ""}">${esc(fact || (t ? t.desc : res.timedOut ? "The site sat idle: no floors added." : "We couldn't match that answer, so no floors were added."))}</p>
        ${typo ? `<p class="rv-typed mono">You typed: ${esc(res.input)}</p>` : ""}
        <button class="btn primary rv-next" id="nextBtn">${last ? "Top out ▲" : "Next floor ▲"}</button>
      </div>`;
    el.hidden = false;
    $("#card").innerHTML = `<div class="card-mini mono">Prompt ${state.idx + 1} · ${esc(t ? t.name : "No floors")} · +${res.gain} m</div>`;
    $("#card").classList.remove("dim");
    requestAnimationFrame(() => el.classList.add("in"));

    // effects scaled by tier
    const cx = window.innerWidth / 2, cy = window.innerHeight * 0.42;
    if (t) {
      if (t.key === "megatall") sfx("gem");
      if (fx.flash) Fx.flash({ color: fx.flash.color || "#ffffff", alpha: fx.flash.alpha, dur: fx.flash.ms });
      if (fx.particles) {
        Fx.burst({ x: cx, y: cy, count: fx.particles, kind: fx.kind, speed: t.key === "lowrise" || t.key === "vanity" ? 1.4 : 1 });
        if (t.key === "megatall") setTimeout(() => { Fx.burst({ x: cx * 0.5, y: cy * 0.8, count: 60, kind: "gold" }); Fx.burst({ x: cx * 1.5, y: cy * 0.8, count: 60, kind: "gold" }); }, 350);
      }
      for (let i = 0; i < fx.rings; i++) setTimeout(() => Fx.ring({ x: cx, y: cy, color: t.key === "megatall" ? "#f5b400" : "#ffffff", maxR: 220 + i * 90, dur: 800 }), i * 140);
      if (fx.shake) Fx.shake(fx.shake, t.key === "megatall" ? 450 : 220);
    } else Fx.shake(CFG.FX.miss.shake, 200);

    state.revealReady = performance.now() + (SkyGame.skipFx ? 0 : 600);
    $("#nextBtn").addEventListener("click", next);
    setTimeout(() => { const b = $("#nextBtn"); b && b.focus({ preventScroll: true }); }, SkyGame.skipFx ? 0 : 650);
    setTimeout(() => countUp(before, state.height, 900), SkyGame.skipFx ? 0 : 300);
  }

  function closeReveal() {
    const el = $("#reveal");
    el.classList.remove("in");
    setTimeout(() => { if (!el.classList.contains("in")) el.hidden = true; }, SkyGame.skipFx ? 0 : 350);
  }

  function next() {
    if (state.phase !== "reveal" || performance.now() < state.revealReady) return;
    sfx("click");
    const res = state.results[state.idx];
    setHud(state.height);
    closeReveal();
    // floors slam in behind the next countdown
    Flat.setHeight(state.height, { gain: res.gain, tier: res.tier });
    if (state.idx >= ROUND_SIZE - 1) { topOut(); return; }
    state.idx++;
    showCountdown();
  }

  // ---------------- topping out → end ----------------
  async function topOut() {
    setPhase("topping");
    renderPips();
    $("#card").innerHTML = `<div class="card-mini mono">Topping out at ${state.height} m…</div>`;
    // let the last floors land first
    const t0 = performance.now();
    while (Flat.busy && performance.now() - t0 < 4000) await wait(100);
    $("#topping").hidden = false;
    sfx("topout");
    await Flat.topOut();
    await wait(300);
    $("#topping").hidden = true;
    endRound();
  }

  function endRound() {
    setPhase("end");
    Flat.setActive(false);
    renderPips();
    const h = state.height;
    const nextM = MILESTONES.find(m => h < m.h);
    const best = MILESTONES.filter(m => h >= m.h && !m.threshold).slice(-1)[0];
    const rows = state.results.map((r, i) => {
      const t = r.tier ? TIER[r.tier] : null;
      return `<li class="${t ? "t-" + t.key : "miss"}" tabindex="0">
          <span class="n mono">${i + 1}</span>
          <span class="q"><span class="qp">${esc(r.q.prompt)}</span>
            <span class="qa">${r.input ? esc(r.entry ? r.entry.display : r.input) : "<i>no answer</i>"}</span>
            <span class="qd">${esc(t ? t.desc : r.timedOut ? "Time ran out on this one." : "Not on the blueprints.")}</span></span>
          <span class="b">${tierIcon(r.tier, 18)}<span>${t ? esc(t.name) : "—"}</span></span>
          <span class="m mono">+${r.gain}</span>
        </li>`;
    }).join("");
    const ms = MILESTONES.slice().reverse().map(m => {
      const ok = h >= m.h;
      return `<li class="${ok ? "ok" : ""}${m.threshold ? " th" : ""}"><span class="ck">${ok ? "✓" : ""}</span><span class="mn">${esc(m.name)}</span><span class="mh mono">${m.h} m</span></li>`;
    }).join("");
    $("#summary").innerHTML = `
      <div class="sum-eyebrow mono">TOPPED OUT · ${new Date().toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</div>
      <div class="sum-height"><span id="sumNum">0</span><small>m</small></div>
      <div class="sum-class">${esc(CFG.classify(h))} <span class="mono">· ${Math.round(h / MAX_HEIGHT * 100)}% of 1 km</span></div>
      <div class="sum-best">${best ? `Taller than <b>${esc(best.name)}</b> (${best.h} m)` : "Not taller than any landmark yet"}${nextM ? `<br><span>Next: ${esc(nextM.name)}, ${nextM.h - h} m higher</span>` : "<br><span>A full kilometre. Welcome to the One Kilometre Club.</span>"}</div>
      <div class="sum-actions">
        <button class="btn primary" id="againBtn">Build again</button>
        <button class="btn ghost" id="shareBtn">Share result</button>
      </div>
      <div class="sum-section mono">YOUR EIGHT FLOORS</div>
      <ol class="sum-rows">${rows}</ol>
      <div class="sum-section mono">MILESTONES</div>
      <ul class="sum-ms">${ms}</ul>`;
    $("#againBtn").addEventListener("click", () => { sfx("click"); startRound(); });
    $("#shareBtn").addEventListener("click", share);
    const t0 = performance.now();
    const count = now => {
      const k = Math.min(1, (now - t0) / 1600), el = $("#sumNum"); if (!el) return;
      el.textContent = Math.round(h * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(count);
    };
    requestAnimationFrame(count);
    $("#summary").scrollTop = 0;

    // the isometric tower starts only now: quick timelapse from ~60% to the final height, then finish
    Tower.init($("#scene"), viewport);
    Tower.reset();
    Tower.setTheme("white");
    Tower.jump(Math.round(h * 0.6));
    Tower.setHeight(h, SkyGame.skipFx ? 1 : 2500);
    setTimeout(() => Tower.finish(), SkyGame.skipFx ? 0 : 2300);
    PlanSheets.render($("#plans"), h);
    requestAnimationFrame(() => {
      const info = CadModel.start($("#cad"), h);
      $("#cadMeta").textContent = `${info.levels} LEVELS · BUNDLED TUBE · RC CORE`;
    });
    if (h > store.get("sky_best", 0)) store.set("sky_best", h);
  }

  function shareText() {
    const h = state.height;
    const cleared = MILESTONES.filter(m => h >= m.h && !m.threshold).slice(-1)[0];
    const squares = state.results.map(r => (r.tier ? TIER[r.tier].emoji : "⬛")).join("");
    return `SKYSCRAPER.io 🏗️\n${h} m · ${CFG.classify(h)}\n${squares}\n${cleared ? "Taller than " + cleared.name + " (" + cleared.h + " m)" : "Still breaking ground"}\n${location.origin + location.pathname}`;
  }
  async function share() {
    sfx("click");
    const text = shareText(), btn = $("#shareBtn");
    try {
      if (navigator.share && mobile()) { await navigator.share({ text }); return; }
      await navigator.clipboard.writeText(text); btn.textContent = "Copied!";
    } catch (e) {
      const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); btn.textContent = "Copied!"; } catch (e2) { btn.textContent = "Copy failed"; }
      ta.remove();
    }
    setTimeout(() => { if (btn) btn.textContent = "Share result"; }, 1800);
  }

  // ---------------- start / reset ----------------
  function resetAll() {
    cancelAnimationFrame(state.timer); clearInterval(state.cdTimer);
    CadModel.stop(); Fx.clear();
    $("#reveal").hidden = true; $("#reveal").classList.remove("in"); $("#topping").hidden = true;
    state.idx = 0; state.results = []; state.height = 0; state.shown = 0;
    Flat.reset(); Flat.setActive(true);
    if (window.Tower) { Tower.reset(); Tower.setTheme("cobalt"); }
  }
  function startRound() {
    if (window.Sfx) { Sfx.unlock(); sfx("start"); }
    resetAll();
    state.round = pickRound();
    showCountdown();
  }

  function renderIntro() {
    const best = store.get("sky_best", 0);
    $("#tierLadder").innerHTML = TIERS.slice().reverse().map(t => `
      <li class="t-${t.key}"><span class="sw">${tierIcon(t.key, 18)}</span><span class="tn">${esc(t.name)}${t.trap ? ' <span class="trap">TRAP</span>' : ""}</span><span class="tm mono">+${t.m} m</span></li>`).join("");
    $("#introBest").textContent = best ? `Your tallest tower: ${best} m` : `${QUESTIONS.length} prompts in the blueprint library`;
  }

  function syncMute() {
    const m = window.Sfx ? Sfx.muted : true;
    const b = $("#muteBtn");
    b.setAttribute("aria-pressed", String(m));
    b.setAttribute("aria-label", m ? "Unmute sound" : "Mute sound");
    b.classList.toggle("muted", m);
  }

  document.addEventListener("keydown", e => {
    const k = e.key;
    if (k !== "Enter" && k !== " ") return;
    const inInput = document.activeElement && document.activeElement.tagName === "INPUT";
    if (state.phase === "intro" && k === "Enter") { e.preventDefault(); startRound(); }
    else if (state.phase === "countdown" && !inInput) { e.preventDefault(); showQuestion(); }
    else if (state.phase === "reveal" && document.activeElement && document.activeElement.id !== "nextBtn") { e.preventDefault(); next(); }
  });

  window.addEventListener("DOMContentLoaded", () => {
    Fx.init($("#fx"), [$("#flat"), $("#fx")]);
    Flat.init($("#flat"), viewport);
    renderIntro(); renderPips(); syncMute();
    $("#startBtn").addEventListener("click", startRound);
    $("#muteBtn").addEventListener("click", () => {
      if (!window.Sfx) return;
      Sfx.unlock(); Sfx.setMuted(!Sfx.muted); syncMute(); sfx("click");
    });
    $("#homeLink").addEventListener("click", e => {
      e.preventDefault();
      if (state.phase === "intro") return;
      if (state.phase !== "end" && !confirm("Abandon this tower and return to the start?")) return;
      resetAll();
      setPhase("intro");
      renderIntro(); renderPips();
    });
  });

  // exposed for automated tests; set skipFx = true to make every animation instant
  window.SkyGame = { state, startRound, submit, next, endRound, skipFx: false };
})();
