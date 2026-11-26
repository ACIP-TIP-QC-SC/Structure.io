# Handover: Skyscraper.io

For the next Claude session working on this project. Read this file first, then `README.md`.

## What this is

A browser trivia game for civil-engineering students, built for the **ACI Technological Institute of the Philippines, Quezon City Student Chapter**. Each round has 8 prompts with 25 seconds per answer. Answers are scored by **rarity** across 6 tiers, and they build a skyscraper of up to 1,000 m. The mechanic is borrowed from Krillion.io's Daily Dive; its branding, art and sounds are not.

- **Repo:** https://github.com/ACIP-TIP-QC-SC/Structure.io (`main`). **Live:** https://acip-tip-qc-sc.github.io/Structure.io/
- Static site with **no build step and no dependencies**, using plain `<script>` tags. It must keep working from `file://` as well as GitHub Pages: no ES modules and no `fetch()`.
- Working style: make the change, take desktop (1440×900) and mobile (390×844) screenshots, send them, commit to `main`.

## Current state (v2, 2026-11-26)

The v2 engine rework from `HANDOFF_engine_rework.md` (written by the ACI Website project session) is implemented:

| Area | Where |
|---|---|
| Phases `intro → countdown → question → hoist → reveal → … → topping → end` on `body[data-phase]` | `js/game.js` |
| 3 s read-then-countdown (Enter skips) | `showCountdown()` |
| Hoist: the answer rides the crane hook past the tier lines, with time scaled by rarity (0.6–4.6 s) | `Fx.hoist()` in `js/fx.js`, times in `CFG.FX` |
| Full-screen reveal on every answer, with intensity from `TIERS[i].fx`; gold is reserved for the gem | `showReveal()`; `.reveal*` CSS |
| No "other answers" list and no gem spoiler on the end screen | removed |
| Flat 2D front-elevation gameplay: floors slam in, dust, sparks, crane climbs, altitude zones, milestone lines, YOU marker | `js/flat.js` |
| Isometric tower only on the end screen: lazy `Tower.init`, quick timelapse from 60% height, then `finish()` | `endRound()`, `js/tower.js` |
| WebAudio sound, no files, mute persisted in `localStorage.sky_mute` | `js/sfx.js` |
| Tier-coloured pips (gold for the gem), HEIGHT plus a Skyscraper+ count, mute button | `renderPips()`, `setHud()` |
| "Hook" mascot, kept minimal: the crane hook wears a yellow hard hat during the hoist | `drawHook()` in `js/fx.js` |

The end screen is unchanged: white blueprint grid, isometric tower on the right, a rotating multi-coloured 3D CAD model with a legend on the left (`js/cad.js`, untouched), plan sheets and the summary.

**Verified on 2026-11-26:** 3 full rounds with no console errors; works from `file://`; no errors without WebAudio; reduced motion gives a calm version; mute survives a reload; 60 fps in a Pixel 7 emulation during a gem hoist, reveal and build-up (measured on a server CPU, not a real phone). Hoist timings match the brief within about 250 ms.

## Data

- `data/questions.js` is the v2 bank: 52 prompts, including 15 tagged `NSCP 2015` with `source` citations. Every gem has a `facts` entry. Philippine dams and bridges are included, and footing and foundation count as structural elements.
- `data/expansions.js` holds about 850 long-tail answers for open-ended prompts: real bridges (about 395 total), real dams (about 236), failures, engineers, PH roads, CE software and formula names. It is merged by prompt id in `SkyMatcher.applyExpansions()`, and curated tiers win. **Add newly reported "this real X wasn't accepted" answers here**, choosing the tier by fame:
  - High-Rise: famous worldwide
  - Skyscraper: known to engineers
  - Supertall: a genuine deep cut
- `node tools/check-dataset.js` must report **0 errors**. It errors on gems without facts, facts keys that aren't display names, duplicate keys and unknown expansion ids. The warnings are typo-tolerance pairs, where an exact match still wins.
- Wikidata and Wikipedia rate-limit this cloud environment, so the long tail was curated by hand and spot-checked with web searches. Unbuilt or unconfirmed entries were dropped: the Bataan–Cavite bridge from "real bridge", plus Laiban, Chico River, Pasonanca and Upper Pulangi. Bataan–Cavite and Samal–Davao are still accepted in `ph-bridges` only, because both are well-known projects under way.
- Tier placement is editorial judgement. The chapter's members are the best reviewers of it.

## Open questions for Ellis (defaults in effect)

1. Remove the gem spoiler from the end-screen rows: **done** (each row now shows the tier's one-liner on hover or tap instead).
2. Gold accent for gems only: **yes**, using `#f5b400`. The Vanity tier line and stamp also use amber, so the trap reads as a warning.
3. More than one NSCP prompt per round: **no**, one per category in the first pass. To change it, allow `cats["NSCP 2015"] < 2` in `pickRound()`.
4. Full "Hook" mascot that follows the player and celebrates in the reveal: only the hook-with-hard-hat in the hoist is built.

## Testing recipe

```bash
python3 -m http.server 8766
```

Drive it with Playwright:
1. Click `#startBtn`. For each of the 8 prompts:
   - press Enter (skips the countdown)
   - fill `#answer` from `SkyGame.state.round[i].tiers[...]` and press Enter
   - wait for `SkyGame.state.phase === "reveal"`, then click `#nextBtn`
2. To force a timeout, set `SkyGame.state.deadline = performance.now() + 300`.
3. Set `SkyGame.skipFx = true` to make every animation instant, which is useful for fast multi-round tests.
4. Collect `pageerror` and console errors; there should be none.

## Possible next steps

- More open-ended long tails (PH flyovers, PH buildings) and a printable tier sheet for member review.
- The out-of-scope items from the brief (percentile curve, daily mode) need a server.
