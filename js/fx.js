/* Skyscraper.io — shared full-screen effects: particles, rings, flashes, shake and the hoist sequence */
(function () {
  "use strict";
  const CFG = window.SKY_CONFIG;
  const reduced = () => (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) || (window.SkyGame && window.SkyGame.skipFx);

  let cv, ctx, W = 0, H = 0, dpr = 1, raf = 0, last = 0;
  const MAX = 400;
  const parts = [];      // live particles
  const rings = [];
  const flashes = [];
  let hoistState = null; // active hoist animation
  let shakeEls = [];
  let shakeUntil = 0, shakeAmp = 0;

  const COBALT = ["#0047ab", "#3d7be0", "#ffffff", "#cfe0fa", "#1c5fc4"];
  const GOLD = ["#f5b400", "#ffd560", "#fff1c2", "#ffffff", "#e09b00"];
  const TIER_LINE = { lowrise: "#cfe0fa", vanity: "#f5b400", highrise: "#a9c8f5", skyscraper: "#7fb0ff", supertall: "#ffffff", megatall: "#ffffff" };

  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cv.style.width = W + "px"; cv.style.height = H + "px";
  }
  function wake() { if (!raf) { last = 0; raf = requestAnimationFrame(loop); } }

  function spawn(p) {
    if (parts.length >= MAX) parts.shift();
    parts.push(p);
  }

  function burst({ x, y, count = 20, kind = "spark", spread = Math.PI * 2, dir = -Math.PI / 2, speed = 1 }) {
    if (reduced() || !cv) return;
    for (let i = 0; i < count; i++) {
      const a = dir + (Math.random() - 0.5) * spread;
      const v = (kind === "dust" ? 40 + Math.random() * 70 : kind === "spark" ? 160 + Math.random() * 260 : 120 + Math.random() * 320) * speed;
      const p = { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, kind,
        max: kind === "dust" ? 0.7 + Math.random() * 0.5 : kind === "spark" ? 0.35 + Math.random() * 0.45 : 1.6 + Math.random() * 1.2,
        size: kind === "dust" ? 3 + Math.random() * 5 : kind === "spark" ? 1.2 + Math.random() * 1.6 : 4 + Math.random() * 5,
        rot: Math.random() * 6, vr: (Math.random() - 0.5) * 12 };
      if (kind === "confetti") p.color = COBALT[i % COBALT.length];
      else if (kind === "gold") p.color = GOLD[i % GOLD.length];
      else if (kind === "weld") { p.kind = "spark"; p.color = Math.random() < 0.5 ? "#ffb347" : "#fff4d6"; }
      else if (kind === "spark") p.color = Math.random() < 0.6 ? "#ffffff" : "#bcd6ff";
      else p.color = "rgba(225,232,242,";
      spawn(p);
    }
    wake();
  }
  function ring({ x, y, color = "#ffffff", maxR = 260, dur = 700, width = 3 }) {
    if (reduced() || !cv) return;
    rings.push({ x, y, color, maxR, dur, width, t0: performance.now() }); wake();
  }
  function flash({ color = "#ffffff", alpha = 0.25, dur = 150 }) {
    if (!cv) return;
    flashes.push({ color, alpha: reduced() ? alpha * 0.4 : alpha, dur, t0: performance.now() }); wake();
  }
  function shake(px, dur = 200) {
    if (reduced() || !px) return;
    shakeAmp = px; shakeUntil = performance.now() + dur; wake();
  }

  // ---------------- hoist: the answer hangs on the crane hook and rises past the tier lines ----------------
  function hoist({ tierIndex, label, trap }) {
    return new Promise(resolve => {
      const miss = tierIndex == null || tierIndex < 0;
      const fx = miss ? CFG.FX.miss : CFG.TIERS[tierIndex].fx;
      const dur = (window.SkyGame && window.SkyGame.skipFx) ? 0 : reduced() ? 300 : fx.hoistMs;
      if (dur === 0) { resolve(); return; }
      hoistState = { t0: performance.now(), dur, miss, tierIndex: miss ? -1 : tierIndex, label: String(label || "").toUpperCase(),
        trap: !!trap, passed: -1, resolve, done: false, settle: 0 };
      if (miss) shake(CFG.FX.miss.shake, 200);
      wake();
    });
  }

  const easeOutBack = (t, s = 1.2) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
  const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function drawHoist(now) {
    const h = hoistState;
    const k = Math.min(1, (now - h.t0) / h.dur);
    const spacing = Math.max(90, H * 0.18);
    const tagY = H * 0.4;
    const target = (h.tierIndex + 1) * spacing;
    // camera altitude (px): ease towards target, overshoot and settle in the final 350 ms
    let cam;
    if (h.miss) cam = 0;
    else {
      const mainDur = Math.max(0.01, 1 - 350 / h.dur);
      if (k < mainDur) {
        const p = k / mainDur;
        cam = (target + spacing * 0.08) * (h.tierIndex >= 5 ? 1 - Math.pow(1 - p, 2.2) : easeInOut(p));
      } else {
        const p = (k - mainDur) / (1 - mainDur);
        cam = target + spacing * 0.08 * (1 - easeOutBack(p, 1.6));
      }
      if (h.trap && k >= 1) cam = target;
    }
    // scrim
    ctx.fillStyle = "rgba(0,26,72,0.42)";
    ctx.fillRect(0, 0, W, H);
    // falling dust motes give a sense of upward travel
    const vel = h.miss ? 0 : spacing * 6 / Math.max(1, h.dur / 1000);
    if (!reduced() && !h.miss && Math.random() < 0.6) spawn({ x: Math.random() * W, y: -10, vx: 0, vy: vel * (0.6 + Math.random() * 0.6), life: 0, max: 1.4, size: 1 + Math.random() * 1.5, kind: "mote", color: "rgba(255,255,255," });

    // tier lines
    ctx.save();
    ctx.font = "600 12px 'IBM Plex Mono', ui-monospace, monospace";
    ctx.textAlign = "right"; ctx.textBaseline = "bottom";
    CFG.TIERS.forEach((t, i) => {
      const y = tagY + (cam - (i + 1) * spacing);
      if (y < -20 || y > H + 20) return;
      const reached = !h.miss && i === h.tierIndex && k >= 0.999;
      ctx.strokeStyle = TIER_LINE[t.key];
      ctx.globalAlpha = reached ? 1 : 0.55;
      ctx.lineWidth = reached ? 3 : 1.5;
      ctx.setLineDash(t.key === "vanity" ? [10, 6] : [6, 8]);
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = TIER_LINE[t.key];
      ctx.fillText(t.name.toUpperCase() + " · +" + t.m + " m", W - 18, y - 6);
    });
    ctx.restore();

    // pass blips
    if (!h.miss) {
      for (let i = h.passed + 1; i <= h.tierIndex; i++) {
        if (cam >= (i + 1) * spacing - 1) { h.passed = i; window.Sfx && Sfx.play("pass", { i }); }
      }
    }

    // the load: cable from the top, the hook (with its hard hat) and the answer tag
    const sway = reduced() ? 0 : Math.sin(now / 380) * (6 * Math.PI / 180) * (h.miss ? 0 : 1);
    let ty = tagY;
    if (h.miss) ty = tagY + Math.pow(k, 2) * (H * 0.8);
    if (h.trap && k >= 1) { h.settle = Math.min(1, h.settle + 0.05); ty += 20 * easeOutBack(h.settle, 0.8); }
    const hx = W / 2;
    ctx.strokeStyle = "rgba(255,255,255,0.85)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(hx, 0); ctx.lineTo(hx, h.miss ? Math.max(0, tagY - 60 - k * 200) : ty - 44); ctx.stroke();
    ctx.save();
    ctx.translate(hx, ty - 44); ctx.rotate(sway);
    drawHook(ctx);
    // tag
    ctx.font = "700 18px 'IBM Plex Mono', ui-monospace, monospace";
    const text = "“" + (h.label.length > 34 ? h.label.slice(0, 33) + "…" : h.label) + "”";
    const tw = ctx.measureText(text).width + 36;
    ctx.translate(0, 44);
    ctx.shadowColor = h.tierIndex === 5 && k > 0.6 ? "rgba(245,180,0,0.9)" : "rgba(160,200,255,0.8)";
    ctx.shadowBlur = 18;
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, -tw / 2, 0, tw, 40, 20); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 2.5; ctx.strokeStyle = h.tierIndex === 5 && k > 0.6 ? "#f5b400" : "#0047ab"; ctx.stroke();
    ctx.fillStyle = "#0047ab"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(text, 0, 21);
    ctx.restore();

    if (k >= 1 && !h.done) {
      h.done = true;
      if (!h.miss) {
        const t = CFG.TIERS[h.tierIndex];
        if (t.key === "vanity") window.Sfx && Sfx.play("trap");
        else if (t.key !== "megatall") window.Sfx && Sfx.play("stop", { i: h.tierIndex });
        burst({ x: hx, y: ty + 20, count: Math.round(t.fx.particles * 0.3), kind: t.fx.kind === "gold" ? "gold" : "spark" });
      } else window.Sfx && Sfx.play("miss");
      setTimeout(() => { const r = h.resolve; hoistState = null; r(); }, h.trap ? 380 : h.miss ? 40 : 220);
    }
  }

  function drawHook(c) {
    // hook block
    c.fillStyle = "#e8eef8"; c.strokeStyle = "#0047ab"; c.lineWidth = 2;
    roundRect(c, -11, -14, 22, 18, 4); c.fill(); c.stroke();
    // hard hat (the mascot's only warm colour)
    c.fillStyle = "#ffc629";
    c.beginPath(); c.arc(0, -14, 11, Math.PI, 0); c.closePath(); c.fill();
    c.fillRect(-14, -15, 28, 3);
    // eyes
    c.fillStyle = "#0a1f44"; c.fillRect(-5, -8, 2.5, 3); c.fillRect(3, -8, 2.5, 3);
    // the hook itself
    c.strokeStyle = "#ffffff"; c.lineWidth = 3;
    c.beginPath(); c.moveTo(0, 4); c.lineTo(0, 16); c.arc(-6, 16, 6, 0, Math.PI * 0.9); c.stroke();
    // slings to the tag
    c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, 18); c.lineTo(-30, 44); c.moveTo(0, 18); c.lineTo(30, 44); c.stroke();
  }
  function roundRect(c, x, y, w, h, r) {
    c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }

  function loop(now) {
    try { step(now); } catch (e) {
      if (hoistState) { const r = hoistState.resolve; hoistState = null; r(); }
      parts.length = 0; rings.length = 0; flashes.length = 0;
      raf = requestAnimationFrame(loop);
      if (window.console) console.warn('fx frame skipped:', e.message);
    }
  }
  function step(now) {
    const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (hoistState) drawHoist(now);
    // particles
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.life += dt;
      if (p.life >= p.max) { parts.splice(i, 1); continue; }
      const g = p.kind === "dust" ? -10 : p.kind === "spark" ? 420 : p.kind === "mote" ? 0 : 140;
      p.vy += g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.kind === "dust") { p.vx *= 0.94; p.vy *= 0.94; p.size += dt * 6; }
      if (p.kind === "confetti" || p.kind === "gold") { p.vx *= 0.985; p.rot += p.vr * dt; }
      const a = 1 - p.life / p.max;
      if (p.kind === "dust" || p.kind === "mote") {
        ctx.fillStyle = p.color + (p.kind === "dust" ? 0.45 * a : 0.5 * a) + ")";
        ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(0.1, p.size), 0, Math.PI * 2); ctx.fill();
      } else if (p.kind === "spark") {
        ctx.strokeStyle = p.color; ctx.globalAlpha = a; ctx.lineWidth = p.size;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 0.03, p.y - p.vy * 0.03); ctx.stroke();
        ctx.globalAlpha = 1;
      } else {
        ctx.save(); ctx.globalAlpha = Math.min(1, a * 1.5);
        ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }
    }
    // rings
    for (let i = rings.length - 1; i >= 0; i--) {
      const r = rings[i], k = (now - r.t0) / r.dur;
      if (k >= 1) { rings.splice(i, 1); continue; }
      ctx.strokeStyle = r.color; ctx.globalAlpha = 1 - k; ctx.lineWidth = r.width * (1 - k) + 0.5;
      ctx.beginPath(); ctx.arc(r.x, r.y, Math.max(0, r.maxR * (1 - Math.pow(1 - Math.max(0, k), 3))), 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 1;
    }
    // flashes
    for (let i = flashes.length - 1; i >= 0; i--) {
      const f = flashes[i], k = (now - f.t0) / f.dur;
      if (k >= 1) { flashes.splice(i, 1); continue; }
      ctx.fillStyle = f.color; ctx.globalAlpha = f.alpha * (1 - k);
      ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1;
    }
    // shake
    const sh = now < shakeUntil ? shakeAmp * (shakeUntil - now) / 250 : 0;
    const tx = sh ? (Math.random() * 2 - 1) * sh : 0, ty = sh ? (Math.random() * 2 - 1) * sh : 0;
    for (const el of shakeEls) el.style.transform = sh ? `translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px)` : "";

    if (hoistState || parts.length || rings.length || flashes.length || sh) raf = requestAnimationFrame(loop);
    else { raf = 0; ctx.clearRect(0, 0, W, H); }
  }

  window.Fx = {
    init(canvas, shakeTargets) {
      cv = canvas; ctx = cv.getContext("2d"); shakeEls = shakeTargets || [];
      resize(); window.addEventListener("resize", resize);
    },
    burst, ring, flash, shake, hoist,
    clear() { parts.length = 0; rings.length = 0; flashes.length = 0; if (hoistState) { const r = hoistState.resolve; hoistState = null; r(); } },
    get busy() { return !!hoistState; }
  };
})();
