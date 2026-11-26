/* Skyscraper.io — game controller */
(function () {
  "use strict";
  const CFG = window.SKY_CONFIG;
  const { TIERS, MILESTONES, ROUND_SIZE, TIME_LIMIT, MAX_HEIGHT } = CFG;
  const TIER = Object.fromEntries(TIERS.map(t => [t.key, t]));
  const QUESTIONS = (window.SKYSCRAPER_DATA && window.SKYSCRAPER_DATA.questions) || [];
  const M = window.SkyMatcher;

  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  };

  const state = { phase: "intro", round: [], idx: 0, results: [], height: 0, timer: 0, deadline: 0, locked: false };
  const mobile = () => window.innerWidth < 900;

  // ---------------- tier icon (a tiny tower whose height reflects the tier) ----------------
  function tierIcon(key, size = 22) {
    const i = key ? TIERS.findIndex(t => t.key === key) : -1;
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
    // prefer category variety
    const pick = [], cats = {};
    for (const q of pool) { if (pick.length >= ROUND_SIZE) break; if ((cats[q.category] || 0) < 1) { pick.push(q); cats[q.category] = 1; } }
    for (const q of pool) { if (pick.length >= ROUND_SIZE) break; if (!pick.includes(q)) pick.push(q); }
    const nextSeen = seen.concat(pick.map(q => q.id)).slice(-Math.max(0, QUESTIONS.length - ROUND_SIZE));
    store.set("sky_seen", nextSeen);
    return shuffle(pick);
  }

  // ---------------- layout for the canvas renderer ----------------
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
    if (mobile()) return { x0: 0, x1: W, y0: top, y1: r.top - 4, ruler: W - 66 };
    return { x0: r.right + 12, x1: W, y0: top + 6, y1: H - 16, ruler: W - 84 };
  }

  // ---------------- top bar ----------------
  function renderPips() {
    const el = $("#pips");
    let h = "";
    for (let i = 0; i < ROUND_SIZE; i++) {
      const r = state.results[i];
      const cls = r ? (r.tier ? "done t-" + r.tier : "done miss") : (i === state.idx && state.phase !== "intro" && state.phase !== "end" ? "now" : "");
      h += `<span class="pip ${cls}" title="${r ? esc(r.tier ? TIER[r.tier].name : "No floors") : "Prompt " + (i + 1)}"></span>`;
    }
    el.innerHTML = h;
    $("#hudHeight").textContent = state.height + " m";
  }

  // ---------------- question ----------------
  function showQuestion() {
    state.phase = "question"; state.locked = false;
    document.body.dataset.phase = "question";
    const q = state.round[state.idx];
    $("#card").innerHTML = `
      <div class="card-head">
        <span class="chip">${esc(q.category || "Civil Engineering")}</span>
        <span class="count mono">PROMPT ${state.idx + 1} / ${ROUND_SIZE}</span>
      </div>
      <h2 class="prompt">${esc(q.prompt)}</h2>
      <div class="timer" aria-hidden="true"><div class="timer-fill" id="timerFill"></div></div>
      <div class="timer-row mono"><span id="timerText">${TIME_LIMIT}s</span><span>rarer answer → taller tower</span></div>
      <form id="answerForm" autocomplete="off">
        <input id="answer" type="text" maxlength="80" placeholder="Type your answer…" aria-label="Your answer" autocapitalize="off" spellcheck="false" />
        <button type="submit" class="btn primary">Build <span aria-hidden="true">▲</span></button>
      </form>
      <p class="hint">One answer. Obvious ones barely leave the ground.</p>`;
    $("#answerForm").addEventListener("submit", e => { e.preventDefault(); submit(false); });
    const inp = $("#answer");
    setTimeout(() => inp.focus({ preventScroll: true }), 30);
    renderPips();
    state.deadline = performance.now() + TIME_LIMIT * 1000;
    cancelAnimationFrame(state.timer);
    const tick = () => {
      if (state.phase !== "question") return;
      const left = Math.max(0, state.deadline - performance.now());
      const f = left / (TIME_LIMIT * 1000);
      const fillEl = $("#timerFill"), txt = $("#timerText");
      if (fillEl) { fillEl.style.transform = `scaleX(${f})`; fillEl.classList.toggle("low", left < 5000); }
      if (txt) txt.textContent = Math.ceil(left / 1000) + "s";
      if (left <= 0) { submit(true); return; }
      state.timer = requestAnimationFrame(tick);
    };
    state.timer = requestAnimationFrame(tick);
  }

  function submit(timedOut) {
    if (state.locked) return;
    const q = state.round[state.idx];
    const raw = ($("#answer") && $("#answer").value || "").trim();
    if (!raw && !timedOut) { $("#answer").focus(); $("#answerForm").classList.remove("shake"); void $("#answerForm").offsetWidth; $("#answerForm").classList.add("shake"); return; }
    state.locked = true;
    cancelAnimationFrame(state.timer);
    const m = raw ? M.match(raw, q) : null;
    const tier = m ? m.entry.tier : null;
    const gain = tier ? TIER[tier].m : 0;
    const res = { q, input: raw, entry: m && m.entry, tier, gain, timedOut: timedOut && !raw };
    state.results[state.idx] = res;
    state.height += gain;
    Tower.setHeight(state.height);
    showReveal(res);
  }

  function samples(q, exclude) {
    if (!q._bank) q._bank = M.buildBank(q);
    const out = [];
    for (const t of TIERS) {
      const list = q._bank.bank.filter(e => e.tier === t.key && e !== exclude);
      if (!list.length) continue;
      out.push({ tier: t.key, names: list.slice().sort(() => Math.random() - 0.5).slice(0, t.key === "megatall" ? 1 : 2).map(e => e.display) });
    }
    return out.reverse();
  }

  function showReveal(res) {
    state.phase = "reveal";
    document.body.dataset.phase = "reveal";
    const last = state.idx === ROUND_SIZE - 1;
    const t = res.tier ? TIER[res.tier] : null;
    const head = t
      ? `<div class="result t-${t.key}">
           <div class="result-icon">${tierIcon(t.key, 44)}</div>
           <div class="result-main">
             <div class="result-tier">${esc(t.name)}${t.trap ? ' <span class="trap">TRAP</span>' : ""}</div>
             <div class="result-desc">${esc(t.desc)}</div>
           </div>
           <div class="result-gain mono">+${t.m}<small> m</small></div>
         </div>`
      : `<div class="result miss">
           <div class="result-icon">${tierIcon(null, 44)}</div>
           <div class="result-main">
             <div class="result-tier">${res.timedOut ? "Time's up" : "Not on the blueprints"}</div>
             <div class="result-desc">${res.timedOut ? "The site sat idle — no floors added." : "We couldn't match that answer, so no floors were added."}</div>
           </div>
           <div class="result-gain mono">+0<small> m</small></div>
         </div>`;
    const yours = res.input
      ? `<p class="yours">You said <b>${esc(res.input)}</b>${res.entry && M.norm(res.entry.display) !== M.norm(res.input) ? ` → matched <b>${esc(res.entry.display)}</b>` : ""}</p>`
      : "";
    const list = samples(res.q, res.entry).map(s => `
        <li class="t-${s.tier}"><span class="sw">${tierIcon(s.tier, 16)}</span><span class="tn">${esc(TIER[s.tier].name)}</span><span class="ta">${s.names.map(esc).join(" · ")}</span><span class="tm mono">${TIER[s.tier].m} m</span></li>`).join("");
    $("#card").innerHTML = `
      <div class="card-head">
        <span class="chip">${esc(res.q.category || "Civil Engineering")}</span>
        <span class="count mono">PROMPT ${state.idx + 1} / ${ROUND_SIZE}</span>
      </div>
      <h2 class="prompt small">${esc(res.q.prompt)}</h2>
      ${head}
      ${yours}
      <div class="others">
        <div class="others-title mono">OTHER ANSWERS ON THE BLUEPRINT</div>
        <ul>${list}</ul>
      </div>
      <button class="btn primary wide sticky" id="nextBtn">${last ? "Top out the tower" : "Next prompt"} <span aria-hidden="true">→</span></button>`;
    $("#nextBtn").addEventListener("click", next);
    setTimeout(() => { const b = $("#nextBtn"); if (b) b.focus({ preventScroll: true }); }, 60);
    renderPips();
  }

  function next() {
    if (state.phase !== "reveal") return;
    if (state.idx >= ROUND_SIZE - 1) return endRound();
    state.idx++;
    showQuestion();
  }

  // ---------------- end of round ----------------
  function endRound() {
    state.phase = "end";
    document.body.dataset.phase = "end";
    renderPips();
    const h = state.height;
    const cleared = MILESTONES.filter(m => h >= m.h);
    const nextM = MILESTONES.find(m => h < m.h);
    const best = cleared.filter(m => !m.threshold).slice(-1)[0];
    const cls = CFG.classify(h);
    const rows = state.results.map((r, i) => {
      const t = r.tier ? TIER[r.tier] : null;
      const gem = (r.q.tiers.megatall || [])[0];
      return `<li class="${t ? "t-" + t.key : "miss"}">
          <span class="n mono">${i + 1}</span>
          <span class="q"><span class="qp">${esc(r.q.prompt)}</span>
            <span class="qa">${r.input ? esc(r.input) : "<i>no answer</i>"}${gem && r.tier !== "megatall" ? ` <span class="gem">· gem: ${esc(gem.split("|")[0])}</span>` : ""}</span></span>
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
      <div class="sum-class">${esc(cls)} <span class="mono">· ${Math.round(h / MAX_HEIGHT * 100)}% of 1 km</span></div>
      <div class="sum-best">${best ? `Taller than <b>${esc(best.name)}</b> (${best.h} m)` : "Not taller than any landmark yet"}${nextM ? `<br><span>Next: ${esc(nextM.name)} — ${nextM.h - h} m higher</span>` : "<br><span>You built a full kilometre. One in a krillion — er, a kilometre.</span>"}</div>
      <div class="sum-actions">
        <button class="btn primary" id="againBtn">Build again</button>
        <button class="btn ghost" id="shareBtn">Share result</button>
      </div>
      <div class="sum-section mono">YOUR EIGHT FLOORS</div>
      <ol class="sum-rows">${rows}</ol>
      <div class="sum-section mono">MILESTONES</div>
      <ul class="sum-ms">${ms}</ul>`;
    $("#againBtn").addEventListener("click", startRound);
    $("#shareBtn").addEventListener("click", share);
    // count-up
    const t0 = performance.now();
    const count = now => {
      const k = Math.min(1, (now - t0) / 1600);
      const el = $("#sumNum"); if (!el) return;
      el.textContent = Math.round(h * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(count);
    };
    requestAnimationFrame(count);
    $("#summary").scrollTop = 0;

    Tower.finish();
    Tower.setTheme("white");
    PlanSheets.render($("#plans"), h);
    requestAnimationFrame(() => {
      const info = CadModel.start($("#cad"), h);
      $("#cadMeta").textContent = `${info.levels} LEVELS · BUNDLED TUBE · RC CORE`;
    });
    const bestScore = store.get("sky_best", 0);
    if (h > bestScore) store.set("sky_best", h);
  }

  function shareText() {
    const h = state.height;
    const cleared = MILESTONES.filter(m => h >= m.h && !m.threshold).slice(-1)[0];
    const squares = state.results.map(r => (r.tier ? TIER[r.tier].emoji : "⬛")).join("");
    return `SKYSCRAPER.io 🏗️\n${h} m · ${CFG.classify(h)}\n${squares}\n${cleared ? "Taller than " + cleared.name + " (" + cleared.h + " m)" : "Still breaking ground"}\n${location.origin + location.pathname}`;
  }
  async function share() {
    const text = shareText();
    const btn = $("#shareBtn");
    try {
      if (navigator.share && mobile()) { await navigator.share({ text }); return; }
      await navigator.clipboard.writeText(text);
      btn.textContent = "Copied!";
    } catch (e) {
      const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); btn.textContent = "Copied!"; } catch (e2) { btn.textContent = "Copy failed"; }
      ta.remove();
    }
    setTimeout(() => { if (btn) btn.textContent = "Share result"; }, 1800);
  }

  // ---------------- start ----------------
  function startRound() {
    CadModel.stop();
    state.round = pickRound();
    state.idx = 0; state.results = []; state.height = 0;
    Tower.reset();
    Tower.setTheme("cobalt");
    showQuestion();
  }

  function renderIntro() {
    const best = store.get("sky_best", 0);
    $("#tierLadder").innerHTML = TIERS.slice().reverse().map(t => `
      <li class="t-${t.key}"><span class="sw">${tierIcon(t.key, 18)}</span><span class="tn">${esc(t.name)}${t.trap ? ' <span class="trap">TRAP</span>' : ""}</span><span class="tm mono">+${t.m} m</span></li>`).join("");
    $("#introBest").textContent = best ? `Your tallest tower: ${best} m` : `${QUESTIONS.length} prompts in the blueprint library`;
  }

  document.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    if (state.phase === "intro") { e.preventDefault(); startRound(); }
    else if (state.phase === "reveal" && document.activeElement && document.activeElement.id !== "nextBtn") { e.preventDefault(); next(); }
  });

  window.addEventListener("DOMContentLoaded", () => {
    Tower.init($("#scene"), viewport);
    renderIntro();
    renderPips();
    $("#startBtn").addEventListener("click", startRound);
    $("#homeLink").addEventListener("click", e => {
      e.preventDefault();
      if (state.phase === "intro") return;
      if (state.phase !== "end" && !confirm("Abandon this tower and return to the start?")) return;
      cancelAnimationFrame(state.timer);
      CadModel.stop();
      state.phase = "intro"; document.body.dataset.phase = "intro";
      state.height = 0; state.results = []; state.idx = 0;
      Tower.reset(); Tower.setTheme("cobalt");
      renderIntro(); renderPips();
    });
  });

  // exposed for automated tests
  window.SkyGame = { state, startRound, submit, next, endRound };
})();
