/* Skyscraper.io — 2D isometric construction renderer (canvas) */
(function () {
  "use strict";
  const CFG = window.SKY_CONFIG;
  const C30 = Math.cos(Math.PI / 6), S30 = 0.5;
  const MODULES = CFG.MODULES;

  // ---------- helpers ----------
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  function hex(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function mix(a, b, t, alpha) {
    const A = hex(a), B = hex(b);
    const r = Math.round(lerp(A[0], B[0], t)), g = Math.round(lerp(A[1], B[1], t)), bl = Math.round(lerp(A[2], B[2], t));
    return alpha == null ? `rgb(${r},${g},${bl})` : `rgba(${r},${g},${bl},${alpha})`;
  }
  function rng(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }

  // ---------- context city (white massing models) ----------
  const CELL = 40;
  const NEIGHBOURS = [];
  (function () {
    const r = rng(11);
    for (let i = -7; i <= 7; i++) for (let j = -7; j <= 7; j++) {
      if (Math.abs(i) <= 1 && Math.abs(j) <= 1) continue; // tower plot + plaza
      if (r() < 0.14) continue; // parks / empty lots
      const d = Math.hypot(i, j);
      const w = 14 + r() * 13, dd = 14 + r() * 13;
      const h = 8 + Math.pow(r(), 2.4) * (d < 4 ? 78 : 55);
      const cx = i * CELL + (r() - 0.5) * 5, cy = j * CELL + (r() - 0.5) * 5;
      NEIGHBOURS.push({ x0: cx - w / 2, x1: cx + w / 2, y0: cy - dd / 2, y1: cy + dd / 2, h, key: cx + cy });
    }
    NEIGHBOURS.sort((a, b) => a.key - b.key);
  })();

  // ---------- state ----------
  let canvas, ctx, W = 0, H = 0, dpr = 1;
  let viewportFn = null;
  let milestones = CFG.MILESTONES;
  let target = 0, disp = 0, from = 0, tw0 = 0, twDur = 1;
  let finishing = false, finishStart = 0, fin = 0;
  let theme = 0, themeTarget = 0; // 0 = cobalt, 1 = white
  let V = 190, cx = null, gy = null, s = 1;
  let crane = 0.6, sun = 0.4, growth = 0, lastT = 0;
  let clouds = [];
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const P = (x, y, z) => [cx + (x - y) * C30 * s, gy + (x + y) * S30 * s - z * s];

  function path(pts) {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let k = 1; k < pts.length; k++) ctx.lineTo(pts[k][0], pts[k][1]);
    ctx.closePath();
  }
  function fill(pts, style) { path(pts); ctx.fillStyle = style; ctx.fill(); }
  const faceL = (x0, x1, y, z0, z1) => [P(x0, y, z0), P(x1, y, z0), P(x1, y, z1), P(x0, y, z1)];
  const faceR = (x, y0, y1, z0, z1) => [P(x, y1, z0), P(x, y0, z0), P(x, y0, z1), P(x, y1, z1)];
  const faceT = (x0, x1, y0, y1, z) => [P(x0, y0, z), P(x1, y0, z), P(x1, y1, z), P(x0, y1, z)];
  function line(a, b) { ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }

  // ---------- palette (interpolated between cobalt and white themes) ----------
  function pal() {
    const t = theme;
    return {
      ground: t < 0.5 ? mix("#0a3f98", "#7f9fd0", t * 2) : mix("#7f9fd0", "#e8f0fc", (t - 0.5) * 2, lerp(1, 0.35, (t - 0.5) * 2)),
      road: t < 0.5 ? `rgba(255,255,255,${0.07 * (1 - t * 2)})` : `rgba(0,71,171,${0.07 * (t - 0.5) * 2})`,
      plaza: mix("#1150ad", "#e6eefa", t),
      nTop: mix("#f4f7fd", "#ffffff", t),
      nL: mix("#d5e1f4", "#eef3fa", t),
      nR: mix("#a9bfe4", "#dbe4f1", t),
      nEdge: t < 0.5 ? "rgba(255,255,255,0.35)" : "rgba(0,71,171,0.16)",
      shadow: t < 0.5 ? "rgba(0,14,52,0.28)" : "rgba(0,47,130,0.07)",
      outline: t < 0.5 ? "rgba(255,255,255,0.65)" : "rgba(0,47,120,0.45)",
      crane: mix("#ffffff", "#0047ab", t),
      ink: t < 0.5 ? "#ffffff" : "#0047ab",
      inkSoft: t < 0.5 ? "rgba(255,255,255,0.55)" : "rgba(0,71,171,0.55)",
      inkFaint: t < 0.5 ? "rgba(255,255,255,0.22)" : "rgba(0,71,171,0.2)"
    };
  }

  // ---------- drawing primitives ----------
  function solid(x0, x1, y0, y1, z0, z1, top, left, right, edge) {
    if (z1 <= z0) return;
    fill(faceL(x0, x1, y1, z0, z1), left);
    fill(faceR(x1, y0, y1, z0, z1), right);
    if (top) fill(faceT(x0, x1, y0, y1, z1), top);
    if (edge) {
      ctx.strokeStyle = edge; ctx.lineWidth = 1;
      ctx.beginPath();
      line(P(x1, y1, z0), P(x1, y1, z1));
      line(P(x0, y1, z1), P(x1, y1, z1)); line(P(x1, y1, z1), P(x1, y0, z1));
      if (top) { line(P(x0, y1, z1), P(x0, y0, z1)); line(P(x0, y0, z1), P(x1, y0, z1)); }
      ctx.stroke();
    }
  }

  function levelStep() { let lv = 4; while (lv * s < 3.2) lv *= 2; return lv; }
  function panelStep() { let p = 4; while (p * s < 4.5 && p < 24) p *= 2; return Math.min(p, 24); }

  function glass(m, z0, z1, pl) {
    if (z1 - z0 < 0.05) return;
    const L = faceL(m.x0, m.x1, m.y1, z0, z1), R = faceR(m.x1, m.y0, m.y1, z0, z1);
    let g = ctx.createLinearGradient(L[3][0], L[3][1], L[1][0], L[1][1]);
    g.addColorStop(0, "#eaf2fe"); g.addColorStop(0.38, "#b4cff4"); g.addColorStop(0.5, "#d2e3fa");
    g.addColorStop(0.62, "#a2c0ec"); g.addColorStop(1, "#86a9de");
    fill(L, g);
    g = ctx.createLinearGradient(R[2][0], R[2][1], R[0][0], R[0][1]);
    g.addColorStop(0, "#8aaee6"); g.addColorStop(0.45, "#5c84c9"); g.addColorStop(0.55, "#7398d6"); g.addColorStop(1, "#40669f");
    fill(R, g);

    const lv = levelStep(), pn = panelStep();
    ctx.lineWidth = 1;
    // mullions
    ctx.strokeStyle = "rgba(18,46,104,0.22)";
    ctx.beginPath();
    for (let x = m.x0 + pn; x < m.x1 - 0.01; x += pn) line(P(x, m.y1, z0), P(x, m.y1, z1));
    for (let y = m.y0 + pn; y < m.y1 - 0.01; y += pn) line(P(m.x1, y, z0), P(m.x1, y, z1));
    ctx.stroke();
    // floor spandrels
    ctx.strokeStyle = "rgba(255,255,255,0.42)";
    ctx.beginPath();
    for (let z = Math.ceil((z0 + 0.01) / lv) * lv; z < z1 - 0.01; z += lv) {
      const a = P(m.x0, m.y1, z), b = P(m.x1, m.y1, z), c = P(m.x1, m.y0, z);
      ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]);
    }
    ctx.stroke();
    // corner edge
    ctx.strokeStyle = pl.outline;
    ctx.beginPath(); line(P(m.x1, m.y1, z0), P(m.x1, m.y1, z1)); ctx.stroke();
  }

  function roof(m, z, pl, withPlant) {
    fill(faceT(m.x0, m.x1, m.y0, m.y1, z), "#eef2f7");
    ctx.strokeStyle = pl.outline; ctx.lineWidth = 1;
    path(faceT(m.x0, m.x1, m.y0, m.y1, z)); ctx.stroke();
    if (s > 0.9) {
      ctx.strokeStyle = "rgba(30,60,110,0.18)";
      path(faceT(m.x0 + 1.4, m.x1 - 1.4, m.y0 + 1.4, m.y1 - 1.4, z)); ctx.stroke();
    }
    if (withPlant && s > 0.5) {
      solid(m.x0 + 4, m.x0 + 12, m.y0 + 4, m.y0 + 10, z, z + 4.5, "#f6f8fb", "#d9dfe8", "#b5bfcd", "rgba(30,60,110,0.25)");
      solid(m.x0 + 14, m.x0 + 19, m.y0 + 12, m.y0 + 19, z, z + 3, "#f6f8fb", "#d9dfe8", "#b5bfcd", "rgba(30,60,110,0.25)");
    }
  }

  // Exposed structure at the working face: dark interior, slab edges, steel columns.
  function frame(m, a, b) {
    if (b - a < 0.05) return;
    fill(faceL(m.x0, m.x1, m.y1, a, b), "rgba(6,20,56,0.82)");
    fill(faceR(m.x1, m.y0, m.y1, a, b), "rgba(4,14,42,0.86)");
    const half = (m.x1 - m.x0) / 2;
    // columns
    ctx.strokeStyle = "#a9bad3"; ctx.lineWidth = Math.max(1, 0.45 * s);
    ctx.beginPath();
    for (const x of [m.x0, m.x0 + half, m.x1]) line(P(x, m.y1, a), P(x, m.y1, b));
    for (const y of [m.y0, m.y0 + half]) line(P(m.x1, y, a), P(m.x1, y, b));
    ctx.stroke();
    // diagonal bracing in the middle bays (every other level)
    if (s > 0.8) {
      ctx.strokeStyle = "rgba(169,186,211,0.55)"; ctx.lineWidth = 1;
      ctx.beginPath();
      for (let z = Math.ceil(a / 8) * 8; z + 8 <= b + 0.01; z += 8) {
        line(P(m.x0 + half, m.y1, z), P(m.x1, m.y1, z + 8));
        line(P(m.x1, m.y0, z + 8), P(m.x1, m.y0 + half, z));
      }
      ctx.stroke();
    }
    // slab edges
    ctx.strokeStyle = "#e4e9f0"; ctx.lineWidth = Math.max(1, 0.55 * s);
    ctx.beginPath();
    const lv = Math.max(4, levelStep());
    for (let z = Math.ceil((a + 0.01) / lv) * lv; z <= b + 0.01; z += lv) {
      const p1 = P(m.x0, m.y1, z), p2 = P(m.x1, m.y1, z), p3 = P(m.x1, m.y0, z);
      ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.lineTo(p3[0], p3[1]);
    }
    ctx.stroke();
  }

  function slabTop(m, z) {
    fill(faceT(m.x0, m.x1, m.y0, m.y1, z), "#c9d2de");
    // starter bars poking out of the latest pour
    if (s > 1.1) {
      ctx.strokeStyle = "#5b6676"; ctx.lineWidth = 1;
      ctx.beginPath();
      const half = (m.x1 - m.x0) / 2;
      for (const x of [m.x0 + 0.6, m.x0 + half, m.x1 - 0.6]) for (const y of [m.y0 + 0.6, m.y0 + half, m.y1 - 0.6]) line(P(x, y, z), P(x, y, z + 3));
      ctx.stroke();
    }
  }

  function drawCrane(baseZ, topZ, alpha, pl, t) {
    if (alpha <= 0.01) return;
    ctx.save(); ctx.globalAlpha = alpha;
    const mx = 9, my = -9;
    const col = pl.crane;
    const b = P(mx, my, baseZ), tp = P(mx, my, topZ);
    const w = Math.max(1.4, 0.9 * s);
    ctx.strokeStyle = col; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(b[0] - w, b[1]); ctx.lineTo(tp[0] - w, tp[1]);
    ctx.moveTo(b[0] + w, b[1]); ctx.lineTo(tp[0] + w, tp[1]);
    const step = Math.max(2.5, 7 / s);
    let side = -1;
    for (let z = baseZ; z < topZ; z += step) {
      const p = P(mx, my, z), q = P(mx, my, Math.min(topZ, z + step));
      ctx.moveTo(p[0] + side * w, p[1]); ctx.lineTo(q[0] - side * w, q[1]);
      side = -side;
    }
    ctx.stroke();
    // slewing unit + jib
    const ca = Math.cos(crane), sa = Math.sin(crane);
    const jz = topZ;
    const tip = P(mx + ca * 52, my + sa * 52, jz), ctip = P(mx - ca * 17, my - sa * 17, jz);
    const peak = P(mx, my, jz + 9);
    ctx.lineWidth = Math.max(1.5, 0.7 * s);
    ctx.beginPath(); line(ctip, tip); ctx.stroke();
    ctx.lineWidth = 1;
    ctx.beginPath(); line(peak, tip); line(peak, ctip); line(tp, peak); ctx.stroke();
    // counterweight
    const cw = P(mx - ca * 15, my - sa * 15, jz - 2.5);
    ctx.fillStyle = mix("#c7d3e6", "#0a2f6e", theme);
    ctx.fillRect(cw[0] - Math.max(2, 1.6 * s), cw[1], Math.max(4, 3.2 * s), Math.max(3, 2.6 * s));
    // cab
    const cab = P(mx, my, jz - 2.5);
    ctx.fillStyle = col;
    ctx.fillRect(cab[0] - Math.max(2, 1.5 * s), cab[1], Math.max(3, 2.4 * s), Math.max(3, 2.4 * s));
    // trolley + hook + load
    const r = 26 + 16 * Math.sin(t * 0.00045);
    const tr = P(mx + ca * r, my + sa * r, jz);
    const hookZ = jz - 18 - 10 * Math.sin(t * 0.0007 + 1);
    const hk = P(mx + ca * r, my + sa * r, hookZ);
    ctx.strokeStyle = pl.inkSoft; ctx.beginPath(); line(tr, hk); ctx.stroke();
    ctx.fillStyle = "#e9eef5";
    const lw = Math.max(4, 5 * s), lh = Math.max(2, 1.4 * s);
    ctx.fillRect(hk[0] - lw / 2, hk[1], lw, lh);
    // aviation light
    if (Math.floor(t / 650) % 2 === 0) {
      ctx.fillStyle = "#ff3b3b";
      ctx.beginPath(); ctx.arc(peak[0], peak[1] - 2, Math.max(1.8, 0.8 * s), 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  function hull(points) {
    points.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for (const p of points) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (let i = points.length - 1; i >= 0; i--) { const p = points[i]; while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
    up.pop(); lo.pop();
    return lo.concat(up);
  }
  function shadow(x0, x1, y0, y1, h, dx, dy) {
    if (h <= 0.1) return;
    const pts = [];
    for (const [x, y] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]) {
      pts.push(P(x, y, 0)); pts.push(P(x + dx * h, y + dy * h, 0));
    }
    path(hull(pts)); ctx.fill();
  }

  // ---------- tower model state for a given height ----------
  function moduleState(m, Hh, f) {
    const h = Math.min(Hh, m.cap);
    const growing = m.cap > Hh - 0.001 && Hh > 0;
    const g = growing ? lerp(Math.max(0, h - 26), h, f) : h;
    const b = growing ? lerp(Math.max(0, h - 8), h, f) : h;
    return { h, growing, g, b };
  }

  // ---------- main render ----------
  function render(t) {
    const dt = Math.min(0.05, (t - (lastT || t)) / 1000); lastT = t;
    // height tween
    const prev = disp;
    if (disp !== target) {
      const k = clamp((t - tw0) / twDur, 0, 1);
      disp = lerp(from, target, reduced ? 1 : easeInOut(k));
      if (k >= 1) disp = target;
    }
    growth = dt > 0 ? (disp - prev) / dt : 0; // m/s
    if (finishing) fin = reduced ? 1 : clamp((t - finishStart) / 2600, 0, 1);
    theme = lerp(theme, themeTarget, Math.min(1, dt * 2.2));
    if (Math.abs(theme - themeTarget) < 0.002) theme = themeTarget;

    crane += dt * (0.12 + Math.min(1.4, Math.abs(growth) * 0.03));
    sun += dt * (0.015 + Math.min(1.2, Math.abs(growth) * 0.02));

    // viewport + camera
    const vp = viewportFn ? viewportFn() : { x0: 0, x1: W, y0: 0, y1: H, ruler: W - 80 };
    const fe = easeOut(fin);
    const spire = clamp(disp * 0.05, 6, 42);
    const Vt = Math.max(210, disp + lerp(64, spire + 26, fe)) * 1.06;
    V = lerp(V, Vt, Math.min(1, dt * 2.6));
    const regionW = Math.max(60, vp.ruler - vp.x0 - 10);
    const sH = (vp.y1 - vp.y0 - 30) / (V + 42);
    const sW = (regionW * 0.62) / ((72 + 72) * C30);
    const sT = Math.max(0.05, Math.min(sH, sW));
    const cxT = vp.x0 + regionW / 2;
    const gyT = vp.y1 - 42 * sT - 12;
    if (cx === null) { cx = cxT; gy = gyT; s = sT; }
    const k = Math.min(1, dt * 3.2);
    cx = lerp(cx, cxT, k); gy = lerp(gy, gyT, k); s = lerp(s, sT, k);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const pl = pal();

    // clip to the viewport in the end layout (tower on the right)
    ctx.save();
    if (theme > 0.01) {
      ctx.beginPath(); ctx.rect(lerp(0, vp.x0, theme), 0, W, H); ctx.clip();
    }

    // clouds (timelapse: they race when the tower grows)
    if (theme < 0.99) {
      ctx.save(); ctx.globalAlpha = 1 - theme;
      ctx.fillStyle = "rgba(255,255,255,0.055)";
      for (const c of clouds) {
        c.x -= dt * c.v * (1 + Math.min(14, Math.abs(growth) * 0.35));
        if (c.x < -c.w * 2) { c.x = W + c.w; c.y = Math.random() * H * 0.55; }
        for (let q = 0; q < 3; q++) {
          ctx.beginPath();
          ctx.ellipse(c.x + q * c.w * 0.45, c.y - (q === 1 ? c.h * 0.35 : 0), c.w * 0.5, c.h * (q === 1 ? 0.75 : 0.5), 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    // ground
    fill([P(-320, -320, 0), P(320, -320, 0), P(320, 320, 0), P(-320, 320, 0)], pl.ground);
    ctx.strokeStyle = pl.road; ctx.lineWidth = Math.max(1, 6 * s);
    ctx.beginPath();
    for (let q = -7; q <= 6; q++) {
      const v = q * CELL + CELL / 2;
      line(P(v, -320, 0), P(v, 320, 0)); line(P(-320, v, 0), P(320, v, 0));
    }
    ctx.stroke();
    fill([P(-58, -58, 0), P(58, -58, 0), P(58, 58, 0), P(-58, 58, 0)], pl.plaza);

    // shadows (sun sweeps across the sky like a timelapse)
    const ang = Math.PI * 0.72 + Math.sin(sun) * 0.75;
    const len = 0.55 + 0.2 * Math.cos(sun * 0.7);
    const sdx = Math.cos(ang) * len, sdy = Math.sin(ang) * len;
    ctx.fillStyle = pl.shadow;
    for (const n of NEIGHBOURS) shadow(n.x0, n.x1, n.y0, n.y1, n.h, sdx, sdy);
    for (const m of MODULES) { const st = moduleState(m, disp, fe); shadow(m.x0, m.x1, m.y0, m.y1, st.h, sdx, sdy); }

    // painter's pass: neighbours behind, tower, neighbours in front
    const nAlpha = lerp(1, 0.55, theme);
    let ni = 0;
    ctx.globalAlpha = nAlpha;
    for (; ni < NEIGHBOURS.length && NEIGHBOURS[ni].key < 0; ni++) {
      const n = NEIGHBOURS[ni];
      solid(n.x0, n.x1, n.y0, n.y1, 0, n.h, pl.nTop, pl.nL, pl.nR, pl.nEdge);
    }
    ctx.globalAlpha = 1;
    drawTower(pl, t, fe, spire);
    ctx.globalAlpha = nAlpha;
    for (; ni < NEIGHBOURS.length; ni++) {
      const n = NEIGHBOURS[ni];
      solid(n.x0, n.x1, n.y0, n.y1, 0, n.h, pl.nTop, pl.nL, pl.nR, pl.nEdge);
    }
    ctx.globalAlpha = 1;
    // end layout: feather the city into the white page on the left edge
    if (theme > 0.01) {
      const fx = lerp(0, vp.x0, theme);
      const fg = ctx.createLinearGradient(fx, 0, fx + 110, 0);
      fg.addColorStop(0, `rgba(0,0,0,${theme})`); fg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = fg; ctx.fillRect(fx, 0, 110, H);
      ctx.globalCompositeOperation = "source-over";
    }
    ctx.restore();

    drawRuler(vp, pl);
    requestAnimationFrame(render);
  }

  function drawTower(pl, t, fe, spire) {
    // raft foundation
    solid(-37, 37, -37, 37, -0.01, 0.6, "#c4ccd8", "#aeb8c6", "#8f9aab");
    let centerB = 0;
    for (const m of MODULES) {
      const st = moduleState(m, disp, fe);
      if (st.h < 0.05 && !m.center) continue;
      glass(m, 0, st.g, pl);
      if (st.growing) {
        frame(m, st.g, st.b);
        if (fe >= 0.999) roof(m, st.b, pl, !m.center);
        else slabTop(m, st.b);
      } else {
        roof(m, st.h, pl, true);
      }
      if (m.center) {
        centerB = st.b;
        // reinforced-concrete core + self-climbing formwork leading the floors
        const coreTop = st.h;
        if (coreTop - st.b > 0.05) {
          solid(-6, 6, -6, 6, st.b, coreTop, "#f2f3f5", "#dfe3e8", "#b2b9c3", "rgba(40,60,90,0.25)");
          if (fe < 1 && coreTop > 4) {
            ctx.save(); ctx.globalAlpha = 1 - fe;
            solid(-7.6, 7.6, -7.6, 7.6, Math.max(st.b, coreTop - 4.5), coreTop + 1, null, "#1e4a9a", "#143672", "rgba(255,255,255,0.35)");
            ctx.restore();
          }
        }
        // finished crown + spire (appear when the round concludes)
        if (fe > 0) {
          const crownH = 7 * fe;
          ctx.save(); ctx.globalAlpha = Math.min(1, fe * 1.5);
          glass({ x0: -9, x1: 9, y0: -9, y1: 9 }, st.h, st.h + crownH, pl);
          fill(faceT(-9, 9, -9, 9, st.h + crownH), "#f4f7fb");
          const base = P(0, 0, st.h + crownH), tip = P(0, 0, st.h + crownH + spire * fe);
          const bw = Math.max(1.5, 1.6 * s);
          ctx.fillStyle = "#e9eef6";
          ctx.beginPath(); ctx.moveTo(base[0] - bw, base[1]); ctx.lineTo(tip[0], tip[1]); ctx.lineTo(base[0] + bw, base[1]); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = pl.outline; ctx.lineWidth = 1; ctx.stroke();
          ctx.restore();
        }
      }
    }
    const top = disp;
    drawCrane(Math.max(0, centerB - 14), top + 30, 1 - fe, pl, t);
  }

  function niceStep(px) {
    const steps = [5, 10, 20, 25, 50, 100, 200, 250, 500];
    for (const st of steps) if (st * s >= px) return st;
    return 1000;
  }

  function drawRuler(vp, pl) {
    const rx = vp.ruler;
    const top = vp.y0 + 6;
    const yOf = z => gy - z * s;
    ctx.save();
    ctx.font = "500 10.5px 'IBM Plex Mono', ui-monospace, monospace";
    // milestone ghost lines — thresholds first, then landmarks, never closer than 17 px
    const towerRight = cx + 40 * C30 * s;
    const minX = Math.max(towerRight + 4, vp.x0 + 4);
    const used = [];
    const ordered = milestones.slice().sort((a, b) => (b.threshold ? 1 : 0) - (a.threshold ? 1 : 0) || b.h - a.h);
    const halo = theme < 0.5 ? "rgba(0,58,150,0.82)" : "rgba(255,255,255,0.88)";
    for (const ms of ordered) {
      const y = yOf(ms.h);
      if (y < top + 14 || y > gy - 8) continue;
      if (used.some(u => Math.abs(u - y) < 17)) continue;
      if (Math.abs(y - yOf(disp)) < 15) continue; // keep the live height marker readable
      used.push(y);
      const cleared = disp >= ms.h - 0.01;
      ctx.strokeStyle = cleared ? pl.inkSoft : pl.inkFaint;
      ctx.setLineDash(cleared ? [] : [4, 5]);
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(minX, y); ctx.lineTo(rx - 6, y); ctx.stroke();
      ctx.setLineDash([]);
      let label = (cleared ? "✓ " : "") + ms.name + " · " + ms.h + " m";
      let w = ctx.measureText(label).width;
      if (rx - 10 - w < minX) { label = (cleared ? "✓ " : "") + ms.h + " m"; w = ctx.measureText(label).width; }
      if (rx - 10 - w < minX) continue;
      ctx.fillStyle = halo;
      roundRect(rx - 14 - w, y - 16, w + 8, 14, 3); ctx.fill();
      ctx.fillStyle = cleared ? pl.ink : pl.inkSoft;
      ctx.textAlign = "right"; ctx.textBaseline = "bottom";
      ctx.fillText(label, rx - 10, y - 3);
    }
    // ruler spine + ticks
    ctx.strokeStyle = pl.ink; ctx.globalAlpha = 0.85; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(rx, gy); ctx.lineTo(rx, top); ctx.stroke();
    const major = niceStep(42), minor = major / 5;
    ctx.lineWidth = 1;
    ctx.textAlign = "left"; ctx.textBaseline = "middle";
    ctx.fillStyle = pl.ink;
    ctx.beginPath();
    for (let z = 0; yOf(z) >= top; z += minor) {
      const y = yOf(z);
      const isMajor = Math.abs(z / major - Math.round(z / major)) < 1e-6;
      ctx.moveTo(rx, y); ctx.lineTo(rx + (isMajor ? 10 : 5), y);
      if (isMajor) ctx.fillText(String(Math.round(z)), rx + 14, y);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillText("m", rx + 14, top - 2);
    // current height marker
    const y = yOf(disp);
    ctx.strokeStyle = pl.ink; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cx + 14 * C30 * s, y); ctx.lineTo(rx, y); ctx.stroke();
    const label = Math.round(disp) + " m";
    ctx.font = "700 14px 'Space Grotesk', system-ui, sans-serif";
    const tw = ctx.measureText(label).width + 18;
    const bx = Math.min(rx + 4, W - tw - 4);
    ctx.fillStyle = theme < 0.5 ? "#ffffff" : "#0047ab";
    roundRect(bx, y - 13, tw, 26, 13); ctx.fill();
    ctx.beginPath(); ctx.moveTo(bx + 1, y - 6); ctx.lineTo(bx - 6, y); ctx.lineTo(bx + 1, y + 6); ctx.fill();
    ctx.fillStyle = theme < 0.5 ? "#0047ab" : "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(label, bx + tw / 2, y + 1);
    ctx.restore();
  }
  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    clouds = [];
    for (let q = 0; q < 7; q++) clouds.push({ x: Math.random() * W, y: Math.random() * H * 0.55, w: 70 + Math.random() * 120, h: 18 + Math.random() * 20, v: 6 + Math.random() * 10 });
  }

  window.Tower = {
    // Lazily started on the end screen; safe to call more than once.
    init(cv, vpFn) {
      viewportFn = vpFn;
      if (canvas) return;
      canvas = cv; ctx = cv.getContext("2d");
      resize(); window.addEventListener("resize", resize);
      requestAnimationFrame(render);
    },
    setHeight(h, dur) {
      from = disp; target = h; tw0 = performance.now();
      twDur = dur != null ? Math.max(1, dur) : 1500 + Math.abs(h - from) / 125 * 1700;
    },
    jump(h) { from = target = disp = h; V = Math.max(210, h + 64) * 1.06; cx = null; },
    finish() { finishing = true; finishStart = performance.now() + 300; },
    reset() { finishing = false; fin = 0; from = disp; target = 0; disp = 0; },
    setTheme(name) { themeTarget = name === "white" ? 1 : 0; },
    setMilestones(list) { milestones = list; },
    get height() { return disp; }
  };
})();
