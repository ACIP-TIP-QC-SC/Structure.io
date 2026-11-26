/* Skyscraper.io — rotating 3D structural CAD model + 2D structural plan sheets */
(function () {
  "use strict";
  const CFG = window.SKY_CONFIG;

  // ================= 3D wireframe structural model =================
  let canvas, ctx, raf = 0, last = 0, ang = 0.7, H = 0, geo = null, dpr = 1, W = 0, Hc = 0;
  let dragging = false, dragX = 0, idle = 0;
  const EL = 0.36; // camera elevation (rad)

  function buildGeometry(height) {
    const beams = [], cols = [], slabs = [], core = [], coreLines = [], braces = [], grid = [];
    let lv = 4; while (height / lv > 64) lv += 4;
    const half = CFG.MODULE / 2;
    for (const m of CFG.MODULES) {
      const h = Math.min(height, m.cap);
      if (h < 1) continue;
      // columns on a 12 m grid
      for (const x of [m.x0, m.x0 + half, m.x1]) for (const y of [m.y0, m.y0 + half, m.y1]) {
        if (m.center && x === m.x0 + half && y === m.y0 + half) continue;
        cols.push([x, y, 0, x, y, h]);
      }
      // floor framing + slabs
      const levels = [];
      for (let z = lv; z < h - 0.01; z += lv) levels.push(z);
      levels.push(h);
      for (const z of levels) {
        beams.push([m.x0, m.y0, z, m.x1, m.y0, z], [m.x1, m.y0, z, m.x1, m.y1, z], [m.x1, m.y1, z, m.x0, m.y1, z], [m.x0, m.y1, z, m.x0, m.y0, z]);
        beams.push([m.x0 + half, m.y0, z, m.x0 + half, m.y1, z], [m.x0, m.y0 + half, z, m.x1, m.y0 + half, z]);
        slabs.push([[m.x0, m.y0, z], [m.x1, m.y0, z], [m.x1, m.y1, z], [m.x0, m.y1, z]]);
      }
      // belt truss where an outer tube terminates (load transfers into the bundle)
      if (!m.center && m.cap <= height) {
        const z1 = m.cap, z0 = Math.max(0, m.cap - lv * 2);
        const c = [[m.x0, m.y0], [m.x1, m.y0], [m.x1, m.y1], [m.x0, m.y1], [m.x0, m.y0]];
        for (let q = 0; q < 4; q++) {
          const [ax, ay] = c[q], [bx, by] = c[q + 1];
          braces.push([ax, ay, z0, bx, by, z1], [bx, by, z0, ax, ay, z1]);
        }
      }
    }
    // reinforced-concrete core (shown red, like a shear-wall core in an analysis model)
    const cz = height, c = 6;
    core.push(
      [[-c, -c, 0], [c, -c, 0], [c, -c, cz], [-c, -c, cz]],
      [[c, -c, 0], [c, c, 0], [c, c, cz], [c, -c, cz]],
      [[c, c, 0], [-c, c, 0], [-c, c, cz], [c, c, cz]],
      [[-c, c, 0], [-c, -c, 0], [-c, -c, cz], [-c, c, cz]]
    );
    for (let z = 0; z <= cz + 0.01; z += lv * 2) {
      coreLines.push([-c, -c, z, c, -c, z], [c, -c, z, c, c, z], [c, c, z, -c, c, z], [-c, c, z, -c, -c, z]);
    }
    for (const [x, y] of [[-c, -c], [c, -c], [c, c], [-c, c]]) coreLines.push([x, y, 0, x, y, cz]);
    // foundation grid
    for (let v = -84; v <= 84; v += 12) { grid.push([v, -84, 0, v, 84, 0], [-84, v, 0, 84, v, 0]); }
    return { beams, cols, slabs, core, coreLines, braces, grid, lv };
  }

  function frame(t) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (t - (last || t)) / 1000); last = t;
    if (!dragging) { idle += dt; ang += dt * 0.32 * Math.min(1, idle / 1.2); }
    draw();
  }

  function draw() {
    if (!geo) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, Hc);
    const cosE = Math.cos(EL), sinE = Math.sin(EL);
    const extent = 84 * Math.SQRT2;
    const k = Math.max(0.05, Math.min((Hc - 40) / (H * cosE + extent * 2 * sinE + 10), (W - 24) / (extent * 2)));
    const ox = W / 2, oy = Hc - 18 - extent * sinE * k;
    const ca = Math.cos(ang), sa = Math.sin(ang);
    const pr = (x, y, z) => {
      const xr = x * ca - y * sa, yr = x * sa + y * ca;
      return [ox + xr * k, oy - (z * cosE - yr * sinE) * k];
    };
    const lines = (list, style, width) => {
      ctx.strokeStyle = style; ctx.lineWidth = width; ctx.beginPath();
      for (const l of list) { const a = pr(l[0], l[1], l[2]), b = pr(l[3], l[4], l[5]); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
      ctx.stroke();
    };
    const quads = (list, style) => {
      ctx.fillStyle = style;
      for (const q of list) {
        ctx.beginPath();
        q.forEach((p, i) => { const s = pr(p[0], p[1], p[2]); i ? ctx.lineTo(s[0], s[1]) : ctx.moveTo(s[0], s[1]); });
        ctx.closePath(); ctx.fill();
      }
    };
    // Multi-coloured by element type, like an analysis model (see legend in index.html)
    const C = window.CadModel.COLORS;
    lines(geo.grid, "rgba(120,130,150,0.22)", 1);
    quads(geo.slabs, C.slab);
    lines(geo.beams, C.beam, 0.85);
    lines(geo.cols, C.column, 1);
    quads(geo.core, C.coreFill);
    lines(geo.coreLines, C.core, 1);
    lines(geo.braces, C.brace, 1.4);
    // support markers (green pins as in an analysis model)
    ctx.fillStyle = C.support;
    for (const m of CFG.MODULES) {
      if (Math.min(H, m.cap) < 1) continue;
      for (const [x, y] of [[m.x0, m.y0], [m.x1, m.y0], [m.x1, m.y1], [m.x0, m.y1]]) {
        const p = pr(x, y, 0); ctx.fillRect(p[0] - 1.5, p[1] - 1.5, 3, 3);
      }
    }
  }

  function resize() {
    if (!canvas) return;
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = r.width; Hc = r.height;
    canvas.width = Math.max(1, Math.round(W * dpr)); canvas.height = Math.max(1, Math.round(Hc * dpr));
  }

  window.CadModel = {
    COLORS: {
      column: "rgba(0,71,171,0.7)",     // steel columns — cobalt
      beam: "rgba(0,165,175,0.9)",        // floor beams — teal
      slab: "rgba(245,180,0,0.14)",       // slabs — amber tint
      core: "rgba(214,40,46,0.8)",        // RC core walls — red
      coreFill: "rgba(214,40,46,0.16)",
      brace: "rgba(242,120,20,0.95)",     // belt trusses — orange
      support: "#1a9e5a"                  // fixed supports — green
    },
    start(cv, height) {
      canvas = cv; ctx = cv.getContext("2d"); H = Math.max(4, height);
      geo = buildGeometry(H);
      resize();
      if (!this._bound) {
        this._bound = true;
        window.addEventListener("resize", resize);
        cv.addEventListener("pointerdown", e => { dragging = true; dragX = e.clientX; cv.setPointerCapture(e.pointerId); });
        cv.addEventListener("pointermove", e => { if (!dragging) return; ang += (e.clientX - dragX) * 0.012; dragX = e.clientX; });
        const up = () => { dragging = false; idle = 0; };
        cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
      }
      cancelAnimationFrame(raf); last = 0; idle = 0;
      raf = requestAnimationFrame(frame);
      return { levels: Math.round(H / 4), lv: geo.lv };
    },
    stop() { cancelAnimationFrame(raf); raf = 0; },
    resize
  };

  // ================= 2D structural plan sheets (SVG) =================
  const LETTERS = "ABCDEFG";
  function planSVG(level, z, height) {
    const grid = [-36, -24, -12, 0, 12, 24, 36];
    const act = CFG.MODULES.filter(m => Math.min(height, m.cap) > z);
    const ink = "#0047ab";
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-62 -64 124 142" aria-hidden="true">`;
    s += `<defs><pattern id="h${level}" width="2.4" height="2.4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="2.4" stroke="${ink}" stroke-width="0.35"/></pattern></defs>`;
    s += `<g fill="none" stroke="${ink}" font-family="IBM Plex Mono, monospace">`;
    // grid lines + bubbles
    grid.forEach((g, i) => {
      s += `<line x1="${g}" y1="-50" x2="${g}" y2="46" stroke-width="0.25" stroke-dasharray="3 1.2 0.6 1.2"/>`;
      s += `<line x1="-46" y1="${g}" x2="50" y2="${g}" stroke-width="0.25" stroke-dasharray="3 1.2 0.6 1.2"/>`;
      s += `<circle cx="${g}" cy="-54" r="3.4" stroke-width="0.4"/><text x="${g}" y="-52.8" font-size="3.4" text-anchor="middle" fill="${ink}" stroke="none">${LETTERS[i]}</text>`;
      s += `<circle cx="-50" cy="${g}" r="3.4" stroke-width="0.4"/><text x="-50" y="${g + 1.2}" font-size="3.4" text-anchor="middle" fill="${ink}" stroke="none">${i + 1}</text>`;
    });
    // module outlines (slab edges)
    for (const m of act) s += `<rect x="${m.x0}" y="${m.y0}" width="24" height="24" stroke-width="0.9"/>`;
    // columns
    const pts = new Set();
    for (const m of act) for (const x of [m.x0, m.x0 + 12, m.x1]) for (const y of [m.y0, m.y0 + 12, m.y1]) {
      if (x === 0 && y === 0) continue; pts.add(x + "," + y);
    }
    for (const p of pts) { const [x, y] = p.split(",").map(Number); s += `<rect x="${x - 1.1}" y="${y - 1.1}" width="2.2" height="2.2" fill="${ink}" stroke="none"/>`; }
    // core
    s += `<rect x="-6" y="-6" width="12" height="12" fill="url(#h${level})" stroke-width="1"/>`;
    s += `<rect x="-3.5" y="-3.5" width="7" height="7" fill="#fff" stroke-width="0.4"/><text x="0" y="1" font-size="2.6" text-anchor="middle" fill="${ink}" stroke="none">CORE</text>`;
    // dimension chain
    const xs = [...new Set(act.map(m => m.x0).concat(act.map(m => m.x1)))].sort((a, b) => a - b);
    if (xs.length > 1) {
      s += `<line x1="${xs[0]}" y1="-44" x2="${xs[xs.length - 1]}" y2="-44" stroke-width="0.3"/>`;
      for (let i = 0; i < xs.length; i++) {
        s += `<line x1="${xs[i] - 1}" y1="-43" x2="${xs[i] + 1}" y2="-45" stroke-width="0.4"/>`;
        if (i < xs.length - 1) s += `<text x="${(xs[i] + xs[i + 1]) / 2}" y="-45.6" font-size="2.6" text-anchor="middle" fill="${ink}" stroke="none">${(xs[i + 1] - xs[i]) * 1000}</text>`;
      }
    }
    // title block
    s += `<line x1="-46" y1="56" x2="50" y2="56" stroke-width="0.5"/>`;
    s += `<text x="-46" y="62.5" font-size="4.2" fill="${ink}" stroke="none" font-weight="600">LEVEL ${level} — STRUCTURAL PLAN</text>`;
    s += `<text x="-46" y="68.5" font-size="3" fill="${ink}" stroke="none">FFL +${z.toFixed(3)} · ${act.length} TUBE${act.length > 1 ? "S" : ""} · SCALE 1:500</text>`;
    s += `<text x="50" y="68.5" font-size="3" text-anchor="end" fill="${ink}" stroke="none">S-${String(100 + level).slice(-3)}</text>`;
    s += `</g></svg>`;
    return s;
  }

  window.PlanSheets = {
    render(container, height) {
      container.innerHTML = "";
      const zs = [8];
      const caps = CFG.MODULES.map(m => m.cap).filter(c => c < height).sort((a, b) => a - b);
      if (caps.length) zs.push(caps[Math.floor(caps.length / 2)] + 8);
      if (caps.length > 2) zs.push(caps[caps.length - 1] + 8);
      while (zs.length < 4) zs.push(Math.max(8, Math.round(height * (0.25 + zs.length * 0.18) / 4) * 4));
      const spots = ["p1", "p2", "p3", "p4"];
      zs.slice(0, 4).forEach((z, i) => {
        const zz = Math.min(z, Math.max(4, height - 4));
        const el = document.createElement("div");
        el.className = "plan " + spots[i];
        el.innerHTML = planSVG(Math.round(zz / 4), Math.round(zz / 4) * 4, Math.max(height, 4));
        container.appendChild(el);
      });
    }
  };
})();
