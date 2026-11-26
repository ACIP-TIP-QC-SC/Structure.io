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
    return w.length > 3 && w.endsWith("s") && !/(ss|us|is)$/.test(w) ? w.slice(0, -1) : w;
  }
  // Compact comparison key: lowercase, no accents/punctuation/spaces, singular words,
  // articles and the prompt's filler words removed.
  function key(s, strip) {
    let words = norm(s).split(" ").filter(Boolean).map(singular);
    words = words.filter((w, i) => w !== "the" && !(i === 0 && (w === "a" || w === "an")));
    if (strip && strip.size) {
      const kept = words.filter(w => !strip.has(w));
      if (kept.length) words = kept;
    }
    return words.join("");
  }
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
        bank.push({ display: aliases[0], tier, aliases, keys: [...new Set(aliases.map(a => key(a, strip)).filter(Boolean))] });
      }
    }
    return { strip, bank };
  }

  function match(input, q) {
    if (!q._bank) q._bank = buildBank(q);
    const { strip, bank } = q._bank;
    const k = key(input || "", strip);
    if (!k) return null;
    let best = null, bestD = Infinity;
    for (const e of bank) {
      for (const ek of e.keys) {
        if (ek === k) return { entry: e, distance: 0 };
        const tol = tolerance(ek.length);
        if (!tol) continue;
        const d = lev(k, ek, tol);
        if (d <= tol && d < bestD) { best = e; bestD = d; }
      }
    }
    return best ? { entry: best, distance: bestD } : null;
  }

  const api = { TIER_ORDER, norm, key, buildBank, match, lev, tolerance };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.SkyMatcher = api;
})(this);
