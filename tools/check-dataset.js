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
let expErrors = 0;
const expPath = path.join(__dirname, "..", "data", "expansions.js");
if (fs.existsSync(expPath)) {
  vm.runInNewContext(fs.readFileSync(expPath, "utf8"), sandbox);
  const r = M.applyExpansions(data, sandbox.window.SKYSCRAPER_EXPANSIONS);
  console.log(`expansions.js: ${r.added} answers merged, ${r.skipped} skipped as duplicates of curated answers`);
  for (const id of Object.keys(sandbox.window.SKYSCRAPER_EXPANSIONS || {})) {
    if (!data.questions.some(q => q.id === id)) { console.log(`ERROR  expansions.js: unknown prompt id "${id}"`); expErrors++; }
  }
}

let errors = 0, warnings = 0, answers = 0;
const cats = {};
const quiet = process.argv.includes("--quiet");
const ids = new Set();
for (const q of data.questions) {
  if (!q.id || !q.prompt || !q.tiers) { console.log(`ERROR  prompt missing id/prompt/tiers: ${JSON.stringify(q).slice(0, 80)}`); errors++; continue; }
  if (ids.has(q.id)) { console.log(`ERROR  duplicate id ${q.id}`); errors++; }
  ids.add(q.id);
  for (const t of Object.keys(q.tiers)) if (!M.TIER_ORDER.includes(t)) { console.log(`ERROR  ${q.id}: unknown tier "${t}"`); errors++; }
  if (!(q.tiers.megatall || []).length) { console.log(`WARN   ${q.id}: no megatall (gem) answer`); warnings++; }
  const { bank } = M.buildBank(q);
  // facts: every gem needs one, and every key must be a display name in this prompt
  const facts = q.facts || {};
  const displays = new Set(bank.map(e => e.display));
  for (const e of bank.filter(e => e.tier === "megatall")) {
    if (!facts[e.display]) { console.log(`ERROR  ${q.id}: gem "${e.display}" has no facts entry`); errors++; }
  }
  for (const k of Object.keys(facts)) {
    if (!displays.has(k)) { console.log(`ERROR  ${q.id}: facts key "${k}" is not a display name in this prompt`); errors++; }
  }
  cats[q.category || "(none)"] = (cats[q.category || "(none)"] || 0) + 1;
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
      if (!quiet) console.log(`WARN   ${q.id}: "${ka}" (${ea.tier}) ≈ "${kb}" (${eb.tier}) — typo tolerance may confuse them`);
      warnings++;
    }
  }
}
errors += expErrors;
console.log("\nPrompts per category:");
for (const [c, n] of Object.entries(cats).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(3)}  ${c}`);
console.log(`\n${data.questions.length} prompts · ${answers} answers · ${errors} errors · ${warnings} warnings`);
process.exit(errors ? 1 : 0);
