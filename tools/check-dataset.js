#!/usr/bin/env node
/*
 * Dataset sanity check for Skyscraper.io
 *   node tools/check-dataset.js
 *
 * Reports: prompt count, answers per tier, empty megatall tiers, and alias
 * collisions (two entries in one prompt that normalise to the same key, or
 * that sit within typo distance of each other — the matcher could confuse them).
 * Exits with code 1 when it finds a hard error.
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const M = require("../js/matcher.js");

const src = fs.readFileSync(path.join(__dirname, "..", "data", "questions.js"), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(src, sandbox);
const data = sandbox.window.SKYSCRAPER_DATA;

let errors = 0, warnings = 0, answers = 0;
const ids = new Set();
for (const q of data.questions) {
  if (!q.id || !q.prompt || !q.tiers) { console.log(`ERROR  prompt missing id/prompt/tiers: ${JSON.stringify(q).slice(0, 80)}`); errors++; continue; }
  if (ids.has(q.id)) { console.log(`ERROR  duplicate id ${q.id}`); errors++; }
  ids.add(q.id);
  for (const t of Object.keys(q.tiers)) if (!M.TIER_ORDER.includes(t)) { console.log(`ERROR  ${q.id}: unknown tier "${t}"`); errors++; }
  if (!(q.tiers.megatall || []).length) { console.log(`WARN   ${q.id}: no megatall (gem) answer`); warnings++; }
  const { bank } = M.buildBank(q);
  answers += bank.length;
  const seen = new Map();
  for (const e of bank) for (const k of e.keys) {
    if (seen.has(k) && seen.get(k) !== e) {
      console.log(`ERROR  ${q.id}: "${e.display}" (${e.tier}) collides with "${seen.get(k).display}" (${seen.get(k).tier}) on key "${k}"`);
      errors++;
    }
    seen.set(k, e);
  }
  // near collisions: an exact alias of A that is within typo tolerance of B
  const keys = [...seen.entries()];
  for (let a = 0; a < keys.length; a++) for (let b = a + 1; b < keys.length; b++) {
    const [ka, ea] = keys[a], [kb, eb] = keys[b];
    if (ea === eb || ea.tier === eb.tier) continue;
    const tol = Math.min(M.tolerance(ka.length), M.tolerance(kb.length));
    if (tol && M.lev(ka, kb, tol) <= tol) {
      console.log(`WARN   ${q.id}: "${ka}" (${ea.tier}) ≈ "${kb}" (${eb.tier}) — typo tolerance may confuse them`);
      warnings++;
    }
  }
}
console.log(`\n${data.questions.length} prompts · ${answers} answers · ${errors} errors · ${warnings} warnings`);
process.exit(errors ? 1 : 0);
