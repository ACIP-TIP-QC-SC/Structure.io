/* Skyscraper.io — flat 2D gameplay renderer (front elevation) with build-up effects */
(function () {
  "use strict";
  const CFG = window.SKY_CONFIG;
  const FLOOR = CFG.FLOOR_M;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOutBack = t => { const s = 1.7; return 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2); };
  const reduced = () => (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const skip = () => window.SkyGame && window.SkyGame.skipFx;
  function rng(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }

  // ---- static scenery (seeded, identical every visit) ----
  const R = rng(23);
  const NEIGH = [];
  for (let i = 0; i < 10; i++) NEIGH.push({ fx: (i / 9) * 2 - 1 + (R() - 0.5) * 0.12, w: 0.05 + R() * 0.06, h: 10 + Math.pow(R(), 2) * 55, rows: R() });
  const SKYLINE = [];
  for (let i = 0; i < 26; i++) SKYLINE.push({ fx: i / 25 * 2.2 - 1.1, w: 0.04 + R() * 0.05, h: 30 + R() * 120 });
  const CLOUDS = [];
  for (let i = 0; i < 9; i++) CLOUDS.push({ z: 450 + R() * 190, fx: R() * 2 - 1, w: 90 + R() * 140, v: 6 + R() * 10, front: R() < 0.4 });
  const BIRDS = [];
  for (let i = 0; i < 4; i++) BIRDS.push({ z: 60 + R() * 90, fx: R() * 2 - 1, v: 18 + R() * 14, ph: R() * 6 });
  const STARS = [];
  for (let i = 0; i < 70; i++) STARS.push({ x: R(), y: R() * 0.6, r: 0.5 + R() * 1.2, tw: R() * 6 });

  // ---- state ----
  let cv, ctx, W = 0, H = 0, dpr = 1, vpFn, active = true, lastT = 0;
  let built = 0, queuedTop = 0, landing = [], schedule = [], crane = 0, craneFrom = 0, craneT0 = 0, craneDur = 0;
  let V = 230, s = 2, cx = null, gy = 0, towerW = 80;
  let sweep = null, goldRim = null, crown = null, goldTint = 0;
  let crossed = new Set(), zoneIdx = 0, zoneCaption = null, msFlash = {};
  let pendingDone = null, pendingTier = null, pendingFrom = 0;
  let traffic = [];

  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cv.style.width = W + "px"; cv.style.height = H + "px";
    traffic = [];
    for (let i = 0; i < 9; i++) traffic.push({ x: Math.random() * W, v: (Math.random() < 0.5 ? -1 : 1) * (30 + Math.random() * 50), lane: i % 2 });
  }

  const zOf = z => gy - z * s;               // metres → screen y
  const topNow = () => {                     // visual top including floors mid-landing
    let t = built;
    for (const f of landing) t = Math.max(t, f.z + FLOOR);
    return t;
  };

  // ---------------- public: build floors from the current top to h ----------------
  function setHeight(h, opts = {}) {
    return new Promise(resolve => {
      const from = queuedTop;
      if (h <= from + 0.01) { resolve(); return; }
      queuedTop = h;
      if (skip()) { built = h; crane = h; schedule = []; landing = []; checkCrossings(); resolve(); return; }
      const floors = Math.max(1, Math.round((h - from) / FLOOR));
      const steps = reduced() ? 3 : floors;
      const interval = reduced() ? 220 : Math.max(40, 900 / floors);
      const now = performance.now();
      for (let i = 0; i < steps; i++) {
        const z0 = from + (h - from) * (i / steps), z1 = from + (h - from) * ((i + 1) / steps);
        schedule.push({ t: now + i * interval, z: z0, top: z1, n: i });
      }
      pendingDone = resolve; pendingTier = opts.tier || null; pendingFrom = from;
    });
  }

  function onAllLanded() {
    const gain = built - pendingFrom;
    // crane climbs after a big gain
    if (gain > 20 && !reduced()) {
      craneFrom = crane; craneT0 = performance.now(); craneDur = 520;
      window.Sfx && Sfx.play("whir");
    } else crane = built;
    if (pendingTier === "supertall" || pendingTier === "megatall") sweep = { t0: performance.now() + 120, z0: 0, z1: built };
    if (pendingTier === "megatall") goldRim = { t0: performance.now(), z0: pendingFrom, z1: built };
    if (built >= 999.9) goldTint = performance.now();
    const r = pendingDone; pendingDone = null;
    r && r();
  }

  function checkCrossings() {
    for (const ms of CFG.MILESTONES) {
      if (built >= ms.h && !crossed.has(ms.h)) {
        crossed.add(ms.h); msFlash[ms.h] = performance.now();
        if (!skip()) window.Sfx && Sfx.play("ding");
      }
    }
    let zi = 0;
    CFG.ZONES.forEach((z, i) => { if (built >= z.h) zi = i; });
    if (zi !== zoneIdx) { zoneIdx = zi; zoneCaption = { t0: performance.now(), z: CFG.ZONES[zi] }; }
  }

  // ---------------- render loop ----------------
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - (lastT || now)) / 1000); lastT = now;
    if (!active) return;

    // launch scheduled floors
    while (schedule.length && schedule[0].t <= now) {
      const f = schedule.shift();
      landing.push({ z: f.z, top: f.top, n: f.n, t0: now });
    }
    for (let i = landing.length - 1; i >= 0; i--) {
      const f = landing[i];
      if (now - f.t0 >= 160) {
        landing.splice(i, 1);
        built = Math.max(built, f.top);
        floorLanded(f);
        if (!landing.length && !schedule.length && pendingDone) onAllLanded();
      }
    }
    if (craneDur && now - craneT0 < craneDur) crane = lerp(craneFrom, built, easeOutBack(clamp((now - craneT0) / craneDur, 0, 1)));
    else if (craneDur) { crane = built; craneDur = 0; }

    // camera
    const vp = vpFn ? vpFn() : { x0: 0, x1: W, y0: 0, y1: H, ruler: W - 80 };
    const top = topNow();
    const regionW = Math.max(80, vp.ruler - vp.x0 - 12);
    const Vt = Math.max(220, top + 70);
    V = lerp(V, Vt, Math.min(1, dt * 2.4));
    const sT = (vp.y1 - vp.y0 - 46) / (V + 30);
    s = cx === null ? sT : lerp(s, sT, Math.min(1, dt * 4));
    const cxT = vp.x0 + regionW / 2;
    cx = cx === null ? cxT : lerp(cx, cxT, Math.min(1, dt * 4));
    gy = vp.y1 - 30;
    towerW = clamp(regionW * 0.14, 64, 90);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    drawSky(now, vp, top);
    drawStreet(now, vp, dt);
    drawTower(now, vp);
    drawCrane(now);
    drawFrontClouds(now, vp, dt);
    drawRuler(now, vp, top);
    drawZoneCaption(now, vp);
  }

  function floorLanded(f) {
    if (skip()) { checkCrossings(); return; }
    const y = zOf(f.top);
    const xl = cx - towerW / 2, xr = cx + towerW / 2;
    if (window.Fx && !reduced()) {
      Fx.burst({ x: xl, y, count: 4, kind: "dust", dir: Math.PI, spread: 1.2, speed: 0.8 });
      Fx.burst({ x: xr, y, count: 4, kind: "dust", dir: 0, spread: 1.2, speed: 0.8 });
      if (f.n % 2 === 0) {
        for (let k = 0; k < 2; k++) Fx.burst({ x: xl + Math.random() * towerW, y: y + 2, count: 6, kind: "weld", dir: -Math.PI / 2, spread: 2.4, speed: 0.55 });
      }
      if (f.n % 5 === 4) Fx.shake(1.5, 120);
    }
    window.Sfx && Sfx.play("clank");
    checkCrossings();
  }

  // ---------------- scenery ----------------
  function drawSky(now, vp, top) {
    // altitude tint: the sky deepens a step per zone
    const a = Math.min(0.42, zoneIdx * 0.055);
    if (a > 0) { ctx.fillStyle = `rgba(0,22,74,${a})`; ctx.fillRect(0, 0, W, H); }
    if (goldTint && now - goldTint < 2200) {
      ctx.fillStyle = `rgba(245,180,0,${0.18 * (1 - (now - goldTint) / 2200)})`; ctx.fillRect(0, 0, W, H);
    }
    // stars above Burj territory
    if (top >= 828) {
      const k = clamp((top - 828) / 120, 0, 1);
      for (const st of STARS) {
        ctx.fillStyle = `rgba(255,255,255,${(0.35 + 0.35 * Math.sin(now / 600 + st.tw)) * k})`;
        ctx.beginPath(); ctx.arc(st.x * W, st.y * H, st.r, 0, Math.PI * 2); ctx.fill();
      }
    }
    // distant skyline silhouette
    ctx.fillStyle = "rgba(160,195,245,0.16)";
    for (const b of SKYLINE) {
      const x = cx + b.fx * (vp.ruler - vp.x0) * 0.55, w = b.w * (vp.ruler - vp.x0);
      ctx.fillRect(x - w / 2, zOf(b.h), w, b.h * s);
    }
    // cloud wisps (supertall airspace) and back clouds (cloud base)
    for (let i = 0; i < 6; i++) {
      const z = 310 + i * 24, y = zOf(z);
      if (y < vp.y0 || y > gy) continue;
      const x = ((now / 40 * (1 + i * 0.2) + i * 230) % (W + 300)) - 150;
      ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(W - x, y); ctx.lineTo(W - x + 90 + i * 12, y); ctx.stroke();
    }
    for (const c of CLOUDS) if (!c.front) cloud(now, c, vp, 0.35);
    // sea of clouds once above 600 m
    if (top >= 600) {
      const y = zOf(600);
      if (y > vp.y0 && y < gy) {
        const g = ctx.createLinearGradient(0, y - 30, 0, y + 40);
        g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(0.5, "rgba(255,255,255,0.28)"); g.addColorStop(1, "rgba(255,255,255,0.08)");
        ctx.fillStyle = g; ctx.fillRect(0, y - 30, W, 70);
      }
    }
    // birds above the rooftops
    ctx.strokeStyle = "rgba(255,255,255,0.7)"; ctx.lineWidth = 1.5;
    for (const b of BIRDS) {
      const y = zOf(b.z); if (y < vp.y0 || y > gy - 10) continue;
      const span = vp.ruler - vp.x0;
      const x = vp.x0 + ((b.fx + 1) / 2 * span + now / 1000 * b.v) % span;
      const f = Math.sin(now / 160 + b.ph) * 3;
      ctx.beginPath(); ctx.moveTo(x - 6, y - f); ctx.lineTo(x, y); ctx.lineTo(x + 6, y - f); ctx.stroke();
    }
  }
  function cloud(now, c, vp, alpha) {
    const y = zOf(c.z); if (y < vp.y0 - 40 || y > gy) return;
    const span = W + c.w * 2;
    const x = ((c.fx + 1) / 2 * span + now / 1000 * c.v) % span - c.w;
    const sc = clamp(s * 1.4, 0.35, 1.2);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    for (let q = 0; q < 4; q++) {
      ctx.beginPath();
      ctx.ellipse(x + q * c.w * 0.28 * sc, y - (q % 2) * 9 * sc, c.w * 0.3 * sc, (14 + (q % 2) * 8) * sc, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  function drawFrontClouds(now, vp) { for (const c of CLOUDS) if (c.front) cloud(now, c, vp, 0.5); }

  function drawStreet(now, vp, dt) {
    // neighbours (pale cobalt, flat)
    const span = (vp.ruler - vp.x0) * 0.5;
    for (const n of NEIGH) {
      const w = n.w * (vp.ruler - vp.x0), x = cx + n.fx * span - w / 2, h = n.h * s;
      ctx.fillStyle = "rgba(170,200,245,0.38)";
      ctx.fillRect(x, gy - h, w, h);
      ctx.fillStyle = "rgba(255,255,255,0.10)";
      const fh = Math.max(3, 4 * s);
      for (let y = gy - h + fh; y < gy - 4; y += fh * 1.6) ctx.fillRect(x + 3, y, w - 6, Math.max(1, fh * 0.45));
      ctx.fillStyle = "rgba(255,255,255,0.45)"; ctx.fillRect(x, gy - h, w, 1.5);
    }
    // ground + street
    ctx.fillStyle = "#003580"; ctx.fillRect(0, gy, W, H - gy);
    ctx.fillStyle = "#cdd9ec"; ctx.fillRect(0, gy, W, 3);
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    for (let x = -((now / 30) % 40); x < W; x += 40) ctx.fillRect(x, gy + 12, 18, 2);
    // traffic
    for (const c of traffic) {
      c.x += c.v * dt; if (c.x > W + 20) c.x = -20; if (c.x < -20) c.x = W + 20;
      ctx.fillStyle = c.lane ? "rgba(255,255,255,0.85)" : "rgba(255,214,120,0.85)";
      ctx.fillRect(c.x, gy + (c.lane ? 16 : 6), 10, 3);
    }
    // lamp posts
    ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 1.2;
    for (let x = (vp.x0 % 70) + 20; x < W; x += 70) {
      ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x, gy - 16); ctx.lineTo(x + 5, gy - 16); ctx.stroke();
    }
  }

  // ---------------- the tower ----------------
  function drawTower(now, vp) {
    const x0 = cx - towerW / 2;
    const glassTop = Math.max(0, built - 2 * FLOOR);
    // glass curtain wall
    if (glassTop > 0) {
      const y1 = zOf(glassTop), h = gy - y1;
      const g = ctx.createLinearGradient(x0, 0, x0 + towerW, 0);
      g.addColorStop(0, "#9cc2f7"); g.addColorStop(0.35, "#cfe2fc"); g.addColorStop(0.42, "#e9f2ff"); g.addColorStop(0.55, "#8db6f0"); g.addColorStop(1, "#5d8fd9");
      ctx.fillStyle = g; ctx.fillRect(x0, y1, towerW, h);
      // mechanical floors every 60 m
      ctx.fillStyle = "rgba(0,48,122,0.45)";
      for (let z = 60; z < glassTop; z += 60) ctx.fillRect(x0, zOf(z + FLOOR), towerW, Math.max(2, FLOOR * s));
      // slab lines
      let step = FLOOR; while (step * s < 3) step *= 2;
      ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 1;
      ctx.beginPath();
      for (let z = step; z < glassTop; z += step) { const y = Math.round(zOf(z)) + 0.5; ctx.moveTo(x0, y); ctx.lineTo(x0 + towerW, y); }
      ctx.stroke();
      // white mullions
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.beginPath();
      for (let k = 1; k < 6; k++) { const x = Math.round(x0 + towerW * k / 6) + 0.5; ctx.moveTo(x, y1); ctx.lineTo(x, gy); }
      ctx.stroke();
      ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1.5; ctx.strokeRect(x0 + 0.5, y1 + 0.5, towerW - 1, h - 1);
      // light sweep after a Supertall / Megatall gain
      if (sweep) {
        const k = (now - sweep.t0) / 650;
        if (k > 1) sweep = null;
        else if (k > 0) {
          const yb = zOf(sweep.z0 + (sweep.z1 - sweep.z0) * k);
          const sg = ctx.createLinearGradient(0, yb + 40, 0, yb - 40);
          sg.addColorStop(0, "rgba(255,255,255,0)"); sg.addColorStop(0.5, "rgba(255,255,255,0.75)"); sg.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = sg; ctx.fillRect(x0, Math.max(y1, yb - 40), towerW, 80);
        }
      }
      // gold rim-light on a gem's new floors
      if (goldRim) {
        const k = (now - goldRim.t0) / 2000;
        if (k > 1) goldRim = null;
        else {
          ctx.strokeStyle = `rgba(245,180,0,${1 - k})`; ctx.lineWidth = 3;
          const ya = zOf(Math.min(goldRim.z1, glassTop)), yb = zOf(goldRim.z0);
          ctx.beginPath(); ctx.moveTo(x0 - 1, ya); ctx.lineTo(x0 - 1, yb); ctx.moveTo(x0 + towerW + 1, ya); ctx.lineTo(x0 + towerW + 1, yb); ctx.stroke();
        }
      }
    }
    // working face: open frame + scaffolding on the top two floors
    if (built > glassTop) frameBlock(x0, glassTop, built, 0);
    // floors mid-landing drop in from above
    for (const f of landing) {
      const k = clamp((now - f.t0) / 160, 0, 1);
      frameBlock(x0, f.z, f.top, (1 - easeOutBack(k)) * -12);
    }
    // concrete core leading the floors
    const top = topNow();
    if (top > 0) {
      const cw = towerW * 0.34, coreH = Math.max(6, 3 * FLOOR) * s;
      ctx.fillStyle = "#e3e7ee"; ctx.fillRect(cx - cw / 2, zOf(top) - coreH, cw, coreH);
      ctx.fillStyle = "#1e4a9a"; ctx.fillRect(cx - cw / 2 - 3, zOf(top) - coreH, cw + 6, Math.max(3, coreH * 0.35));
      ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 1; ctx.strokeRect(cx - cw / 2 - 3, zOf(top) - coreH, cw + 6, Math.max(3, coreH * 0.35));
    }
    // crown lifted into place when topping out
    if (crown) {
      const k = clamp((now - crown.t0) / 1100, 0, 1);
      const yTop = zOf(built);
      const y = lerp(gy - 40, yTop, 1 - Math.pow(1 - k, 3));
      ctx.fillStyle = "#e9f2ff"; ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(cx - towerW * 0.3, y); ctx.lineTo(cx + towerW * 0.3, y); ctx.lineTo(cx + 3, y - 34); ctx.lineTo(cx - 3, y - 34); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, y - 34); ctx.lineTo(cx, y - 60); ctx.stroke();
    }
  }
  function frameBlock(x0, za, zb, dy) {
    const ya = zOf(za) + dy, yb = zOf(zb) + dy;
    ctx.fillStyle = "rgba(4,18,52,0.85)"; ctx.fillRect(x0, yb, towerW, ya - yb);
    ctx.strokeStyle = "#dfe6f1"; ctx.lineWidth = Math.max(1, Math.min(3, 0.6 * s));
    ctx.beginPath();
    for (let z = za; z <= zb + 0.01; z += FLOOR) { const y = zOf(z) + dy; ctx.moveTo(x0, y); ctx.lineTo(x0 + towerW, y); }
    for (const fx of [0, 0.5, 1]) { const x = x0 + towerW * fx; ctx.moveTo(x, ya); ctx.lineTo(x, yb); }
    ctx.stroke();
    // scaffold bracing
    ctx.strokeStyle = "rgba(255,198,41,0.55)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x0 - 4, ya); ctx.lineTo(x0 - 4, yb); ctx.moveTo(x0 + towerW + 4, ya); ctx.lineTo(x0 + towerW + 4, yb);
    ctx.moveTo(x0 - 4, ya); ctx.lineTo(x0, yb); ctx.moveTo(x0 + towerW + 4, ya); ctx.lineTo(x0 + towerW, yb); ctx.stroke();
  }

  // ---------------- tower crane (external climbing, beside the tower) ----------------
  function drawCrane(now) {
    if (crown && now - crown.t0 > 1400) return; // dismantled after topping out
    const mx = cx + towerW / 2 + 10;
    const topZ = crane + 34;
    const yb = gy, yt = zOf(topZ);
    const w = 3;
    ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(mx - w, yb); ctx.lineTo(mx - w, yt); ctx.moveTo(mx + w, yb); ctx.lineTo(mx + w, yt);
    const step = 8; let side = -1;
    for (let y = yb; y > yt; y -= step) { ctx.moveTo(mx + side * w, y); ctx.lineTo(mx - side * w, Math.max(yt, y - step)); side = -side; }
    ctx.stroke();
    // jib over the tower, counter-jib behind
    const jib = Math.max(90, towerW * 1.8), cj = jib * 0.32;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(mx + cj, yt); ctx.lineTo(mx - jib, yt); ctx.stroke();
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(mx, yt - 16); ctx.lineTo(mx - jib, yt); ctx.moveTo(mx, yt - 16); ctx.lineTo(mx + cj, yt); ctx.moveTo(mx, yt); ctx.lineTo(mx, yt - 16); ctx.stroke();
    ctx.fillStyle = "#c7d3e6"; ctx.fillRect(mx + cj - 12, yt, 12, 8);
    ctx.fillStyle = "#ffffff"; ctx.fillRect(mx - 9, yt + 1, 7, 6);
    // trolley, cable and load (lifts the crown when topping out)
    const r = crown ? (cx - mx) * -1 : jib * (0.45 + 0.3 * Math.sin(now / 1800));
    const tx = mx - Math.abs(r);
    const hookY = crown ? lerp(gy - 40, zOf(built), 1 - Math.pow(1 - clamp((now - crown.t0) / 1100, 0, 1), 3)) - 62 : yt + 26 + 10 * Math.sin(now / 900);
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.beginPath(); ctx.moveTo(tx, yt); ctx.lineTo(tx, hookY); ctx.stroke();
    ctx.fillStyle = "#ffc629"; ctx.beginPath(); ctx.arc(tx, hookY, 3, Math.PI, 0); ctx.fill();
    if (!crown) { ctx.fillStyle = "#e9eef5"; ctx.fillRect(tx - 7, hookY + 3, 14, 4); }
    // aviation light
    if (Math.floor(now / 650) % 2 === 0) { ctx.fillStyle = "#ff3b3b"; ctx.beginPath(); ctx.arc(mx, yt - 18, 2.2, 0, Math.PI * 2); ctx.fill(); }
  }

  // ---------------- ruler, milestones, YOU marker, zone caption ----------------
  function drawRuler(now, vp, top) {
    const rx = vp.ruler, ytop = vp.y0 + 8;
    ctx.save();
    ctx.font = "500 10.5px 'IBM Plex Mono', ui-monospace, monospace";
    // milestone ghost lines with flavour labels
    const used = [];
    const xa = cx + towerW / 2 + 22;
    const list = CFG.MILESTONES.slice().sort((a, b) => (b.threshold ? 1 : 0) - (a.threshold ? 1 : 0) || b.h - a.h);
    for (const ms of list) {
      const y = zOf(ms.h);
      if (y < ytop + 14 || y > gy - 8 || used.some(u => Math.abs(u - y) < 17) || Math.abs(y - zOf(top)) < 14) continue;
      used.push(y);
      const ok = top >= ms.h;
      const fl = msFlash[ms.h] ? clamp(1 - (now - msFlash[ms.h]) / 900, 0, 1) : 0;
      ctx.strokeStyle = fl ? `rgba(255,255,255,${0.5 + fl * 0.5})` : ok ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.22)";
      ctx.lineWidth = 1 + fl * 2;
      ctx.setLineDash(ok ? [] : [4, 5]);
      ctx.beginPath(); ctx.moveTo(xa, y); ctx.lineTo(rx - 6, y); ctx.stroke(); ctx.setLineDash([]);
      let label = (ok ? "✓ " : "") + ms.name + " · " + ms.h + " m";
      let w = ctx.measureText(label).width;
      if (rx - 10 - w < xa) { label = (ok ? "✓ " : "") + ms.h + " m"; w = ctx.measureText(label).width; }
      if (rx - 10 - w < xa) continue;
      ctx.fillStyle = "rgba(0,52,140,0.8)"; roundRect(rx - 14 - w, y - 16, w + 8, 14, 3); ctx.fill();
      ctx.fillStyle = ok ? "#ffffff" : "rgba(255,255,255,0.6)";
      ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText(label, rx - 10, y - 3);
    }
    // ruler
    ctx.strokeStyle = "rgba(255,255,255,0.85)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(rx, gy); ctx.lineTo(rx, ytop); ctx.stroke();
    let major = 10; for (const st of [10, 20, 25, 50, 100, 200, 250, 500]) { major = st; if (st * s >= 42) break; }
    const minor = major / 5;
    ctx.fillStyle = "#ffffff"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let z = 0; zOf(z) >= ytop; z += minor) {
      const y = zOf(z), isMajor = Math.abs(z / major - Math.round(z / major)) < 1e-6;
      ctx.moveTo(rx, y); ctx.lineTo(rx + (isMajor ? 10 : 5), y);
      if (isMajor) ctx.fillText(String(Math.round(z)), rx + 14, y);
    }
    ctx.stroke();
    ctx.fillText("m", rx + 14, ytop - 2);
    // YOU marker
    const y = zOf(top);
    ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cx + towerW / 2 + 4, y); ctx.lineTo(rx, y); ctx.stroke();
    ctx.font = "700 13px 'Space Grotesk', system-ui, sans-serif";
    const label = "YOU · " + Math.round(top) + " m";
    const tw = ctx.measureText(label).width + 18;
    const bx = Math.min(rx + 4, W - tw - 4);
    ctx.fillStyle = "#ffffff"; roundRect(bx, y - 13, tw, 26, 13); ctx.fill();
    ctx.beginPath(); ctx.moveTo(bx + 1, y - 6); ctx.lineTo(bx - 7, y); ctx.lineTo(bx + 1, y + 6); ctx.fill();
    ctx.fillStyle = "#0047ab"; ctx.textAlign = "center"; ctx.fillText(label, bx + tw / 2, y + 1);
    ctx.restore();
  }
  function drawZoneCaption(now, vp) {
    const z = CFG.ZONES[zoneIdx];
    const k = zoneCaption ? (now - zoneCaption.t0) / 3200 : 2;
    const big = k < 1;
    const a = big ? Math.min(1, k * 5, (1 - k) * 4 + 0.35) : 0.45;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left"; ctx.textBaseline = "top";
    ctx.font = (big ? "700 15px" : "600 11px") + " 'IBM Plex Mono', ui-monospace, monospace";
    const text = z.name.toUpperCase().split("").join(big ? " " : "");
    ctx.fillText(text, vp.x0 + 14, vp.y0 + 10);
    if (big) { ctx.font = "500 11px 'IBM Plex Mono', ui-monospace, monospace"; ctx.fillText("ALTITUDE ZONE · " + z.h + " m", vp.x0 + 14, vp.y0 + 30); }
    ctx.restore();
  }
  function roundRect(x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  window.Flat = {
    init(canvas, viewportFn) {
      cv = canvas; ctx = cv.getContext("2d"); vpFn = viewportFn;
      resize(); window.addEventListener("resize", resize);
      requestAnimationFrame(frame);
    },
    setHeight,
    topOut() {
      return new Promise(res => {
        if (skip()) { res(); return; }
        crown = { t0: performance.now() };
        setTimeout(res, reduced() ? 300 : 1200);
      });
    },
    reset() {
      built = 0; queuedTop = 0; landing = []; schedule = []; crane = 0; craneDur = 0;
      sweep = goldRim = crown = null; goldTint = 0; crossed = new Set(); zoneIdx = 0; zoneCaption = null; msFlash = {};
      if (pendingDone) { const r = pendingDone; pendingDone = null; r(); }
    },
    setActive(a) { active = a; if (!a && ctx) ctx.clearRect(0, 0, W, H); },
    get height() { return built; },
    get busy() { return !!(schedule.length || landing.length); }
  };
})();
