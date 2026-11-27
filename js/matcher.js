/* Skyscraper.io — answer matching (shared by the game and tools/check-dataset.js) */
(function (root) {
  "use strict";

  const TIER_ORDER = ["lowrise", "vanity", "highrise", "skyscraper", "supertall", "megatall"];

  function norm(s) {
    return String(s).toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/ø/g, "o").replace(/æ/g, "ae").replace(/ß/g, "ss").replace(/œ/g, "oe")
      .replace(/&/g, " and ")
      .replace(/['’`]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }
  function singular(w) {
    if (w.length > 4 && /ies$/.test(w)) return w.slice(0, -3) + "y";          // trolleys stay, gravities → gravity
    if (w.length > 4 && /(ss|sh|ch|x|z)es$/.test(w)) return w.slice(0, -2);    // trusses → truss, ditches → ditch
    return w.length > 3 && w.endsWith("s") && !/(ss|us|is)$/.test(w) ? w.slice(0, -1) : w;
  }
  // Compact comparison key: lowercase, no accents/punctuation/spaces, singular words,
  // articles and the prompt's filler words removed.
  function words(s, strip) {
    let ws = norm(s).split(" ").filter(Boolean).map(singular);
    ws = ws.filter((w, i) => w !== "the" && !(i === 0 && (w === "a" || w === "an")));
    if (strip && strip.size) {
      const kept = ws.filter(w => !strip.has(w));
      if (kept.length) ws = kept;
    }
    return ws;
  }
  function key(s, strip) { return words(s, strip).join(""); }
  function tolerance(len) {
    if (len <= 4) return 0;
    if (len <= 7) return 1;
    if (len <= 12) return 2;
    return 3;
  }
  function lev(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    let prev = new Array(b.length + 1), cur = new Array(b.length + 1);
    for (let j = 0; j <= b.length; j++) prev[j] = j;
    for (let i = 1; i <= a.length; i++) {
      cur[0] = i; let rowMin = i;
      for (let j = 1; j <= b.length; j++) {
        const c = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + c);
        if (cur[j] < rowMin) rowMin = cur[j];
      }
      if (rowMin > max) return max + 1;
      [prev, cur] = [cur, prev];
    }
    return prev[b.length];
  }

  // Turn a question's tiers into a flat answer bank.
  function buildBank(q) {
    const strip = new Set((q.strip || []).map(w => singular(norm(w))));
    const bank = [];
    for (const tier of TIER_ORDER) {
      for (const entry of (q.tiers && q.tiers[tier]) || []) {
        const aliases = String(entry).split("|").map(a => a.trim()).filter(Boolean);
        bank.push({ display: aliases[0], tier, aliases, keys: [...new Set(aliases.map(a => key(a, strip)).filter(Boolean))],
          toks: aliases.map(a => words(a, strip)).filter(t => t.length) });
      }
    }
    // "Generic" words: qualifiers that don't pick out one answer on their own. They may be
    // added freely ("pervious concrete" → Pervious) but can't be the whole answer ("concrete" ≠ Pervious).
    const generic = new Set(GENERIC);
    for (const w of words(q.prompt || "")) generic.add(w);
    strip.forEach(w => generic.add(w));
    const droppable = new Set(generic);  // may be left off an answer: prompt/strip/basic words only
    const df = new Map();
    for (const e of bank) new Set(e.toks.flat()).forEach(w => df.set(w, (df.get(w) || 0) + 1));
    df.forEach((n, w) => { if (n >= 3) generic.add(w); });
    return { strip, bank, generic, droppable, vocab: new Set(df.keys()) };
  }
  const GENERIC = ("a an of and in on for with to by or type kind sort form method system material materials structure structural " +
    "construction building design engineering engineer civil concrete steel thing name famous called style unit think maybe um uh " +
    "bridge dam tower").split(" ").map(singular);

  function tokTol(len) { return len < 6 ? 0 : len < 10 ? 1 : 2; }
  // Line up an alias's words with the player's words (each word may carry a small typo).
  function align(at, it) {
    const used = new Array(it.length).fill(false);
    let missing = [], dist = 0;
    for (const a of at) {
      let bi = -1, bd = Infinity;
      for (let j = 0; j < it.length; j++) {
        if (used[j]) continue;
        const tol = Math.min(tokTol(a.length), tokTol(it[j].length));
        const d = a === it[j] ? 0 : tol ? lev(a, it[j], tol) : 1;
        if (d <= tol && d < bd) { bi = j; bd = d; }
      }
      if (bi < 0) missing.push(a); else { used[bi] = true; dist += bd; }
    }
    return { missing, extra: it.filter((w, j) => !used[j]), dist };
  }

  /*
   * Match a typed answer against a prompt. Returns { entry, distance, how } or null.
   * Stages, best first:
   *   exact   — same compact key (case, accents, punctuation, spaces, plurals, articles ignored)
   *   typo    — whole key within a length-scaled edit distance
   *   extra   — every word of an answer is present, plus up to three generic extra words
   *             (words from the prompt, strip words, "concrete", "type", words shared by 3+ answers…)
   *   partial — only generic words of a longer answer were left off ("St. Francis" → St. Francis Dam);
   *             needs a specific word of 4+ letters and must point to exactly one answer
   * When stages tie between different answers the more specific/better-covered one wins;
   * a partial that fits several answers is reported as { ambiguous: [...] } by analyze().
   */
  function analyze(input, q) {
    if (!q._bank) q._bank = buildBank(q);
    const { strip, bank, generic, droppable, vocab } = q._bank;
    // fix typos in filler words first, so "rigid pavment" strips like "rigid pavement"
    input = norm(input || "").split(" ").map(w => {
      const s = singular(w);
      if (droppable.has(s) || s.length < 6 || vocab.has(s)) return w;
      for (const g of droppable) if (g.length >= 6 && lev(s, g, 1) <= 1) return g;
      return w;
    }).join(" ");
    const k = key(input, strip);
    if (!k) return null;
    let best = null, bestD = Infinity;
    for (const e of bank) {
      for (const ek of e.keys) {
        if (ek === k) return { entry: e, distance: 0, how: "exact" };
        const tol = tolerance(ek.length);
        if (!tol) continue;
        const d = lev(k, ek, tol);
        if (d <= tol && d < bestD) { best = e; bestD = d; }
      }
    }
    if (best) return { entry: best, distance: bestD, how: "typo" };

    const it = words(input, strip);
    if (!it.length || it.length > 6) return null;
    const isSpecific = w => !generic.has(w) && !/^\d+$/.test(w);
    let sup = [], part = [];
    for (const e of bank) {
      let eSup = null, ePart = null;
      for (const at of e.toks) {
        if (at.join("").length < 3) continue;
        const r = align(at, it);
        if (!r.missing.length && r.extra.length && r.extra.length <= 3) {
          // only generic qualifiers may be added: "pervious concrete" → Pervious, but "London bridge" ≠ Bridge crane
          if (r.extra.some(isSpecific)) continue;
          const score = r.extra.length * 0.5 + r.dist * 0.75 - at.length * 0.1;
          if (!eSup || score < eSup.score) eSup = { entry: e, score, dist: r.dist };
        } else if (r.missing.length && !r.extra.length && at.length > it.length) {
          // only generic words may be left off ("St. Francis" → St. Francis Dam), and what was typed must be specific
          if (r.missing.some(w => !droppable.has(w)) || !it.some(w => isSpecific(w) && w.length >= 4)) continue;
          const score = r.missing.length + r.dist;
          if (!ePart || score < ePart.score) ePart = { entry: e, score, dist: r.dist };
        }
      }
      if (eSup) sup.push(eSup);
      if (ePart) part.push(ePart);
    }
    if (sup.length) {
      sup.sort((a, b) => a.score - b.score || TIER_ORDER.indexOf(a.entry.tier) - TIER_ORDER.indexOf(b.entry.tier));
      return { entry: sup[0].entry, distance: sup[0].dist, how: "extra" };
    }
    if (part.length === 1) return { entry: part[0].entry, distance: part[0].dist, how: "partial" };
    if (part.length > 1) return { ambiguous: part.map(p => p.entry) };
    return null;
  }
  function match(input, q) {
    const r = analyze(input, q);
    return r && r.entry ? r : null;
  }

  // Merge long-tail answer lists (data/expansions.js) into prompts by id.
  // An expansion entry is skipped if any of its keys already belongs to an answer in that prompt,
  // so the curated tiers in questions.js always win. Returns {added, skipped}.
  function applyExpansions(data, exp) {
    let added = 0, skipped = 0;
    if (!data || !exp) return { added, skipped };
    for (const q of data.questions) {
      const ext = exp[q.id];
      if (!ext) continue;
      const strip = new Set((q.strip || []).map(w => singular(norm(w))));
      const taken = new Set();
      for (const t of TIER_ORDER) for (const e of (q.tiers[t] || [])) for (const a of String(e).split("|")) taken.add(key(a, strip));
      for (const t of TIER_ORDER) {
        for (const e of ext[t] || []) {
          const keys = String(e).split("|").map(a => key(a, strip)).filter(Boolean);
          if (!keys.length || keys.some(k => taken.has(k))) { skipped++; continue; }
          keys.forEach(k => taken.add(k));
          (q.tiers[t] = q.tiers[t] || []).push(e);
          added++;
        }
      }
      delete q._bank;
    }
    return { added, skipped };
  }

  const api = { TIER_ORDER, norm, key, words, buildBank, match, analyze, lev, tolerance, applyExpansions };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.SkyMatcher = api;
})(this);
