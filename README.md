# Skyscraper.io

A civil-engineering trivia game. Answer **8 prompts** in **25 seconds** each. Every valid answer adds floors to your tower, and **rarer answers build higher**. Eight perfect answers top out at **1,000 m**.

The scoring is inspired by daily "rarity" trivia games: correctness only qualifies an answer, and rarity decides how much it scores.

## Rarity tiers

| Tier | Height | Meaning |
| --- | ---: | --- |
| Low-Rise | +15 m | The answer almost everyone blurts out |
| Vanity Height *(trap)* | +20 m | The "clever" answer everyone reaches for |
| High-Rise | +40 m | Past the first few obvious picks |
| Skyscraper | +75 m | Genuinely uncommon, still recognisable |
| Supertall | +105 m | A true deep cut |
| Megatall | +125 m | The designated gem of the prompt |

| Run | Height | Milestone cleared |
| --- | ---: | --- |
| 8 × Low-Rise | 120 m | Standard high-rise skyline |
| 8 × Vanity Height | 160 m | Skyscraper threshold (150 m) |
| 8 × High-Rise | 320 m | Supertall threshold (300 m) and Chrysler Building |
| 8 × Skyscraper | 600 m | Megatall threshold (600 m) |
| 8 × Supertall | 840 m | Burj Khalifa (828 m) |
| 8 × Megatall | 1,000 m | Jeddah Tower target (1 km) |

Each visit draws a fresh random set of 8 prompts. Prompts you have seen recently are held back, and the draw mixes categories.

## How it looks

- **While building:** a cobalt sky over a white "massing model" city. Your tower goes up as a construction timelapse: glass curtain wall, an exposed steel frame and slabs at the working face, a concrete core with climbing formwork, and a tower crane on top. Clouds and the building's shadow race across the scene while it grows. A ruler on the right shows the height, with ghost lines for real landmarks.
- **When it tops out:** the page turns white over a faint cobalt blueprint grid. The crane leaves, and the crown and spire complete. The tower slides to the right, a rotating 3D structural CAD model appears on the left (drag to spin), and structural plan sheets sit faintly in the background. The summary in the middle shows your eight answers and every milestone you cleared.

The tower is a **bundled tube**: a 3 × 3 grid of 24 m cells. Each outer cell tops out at its own height (150 m to 880 m), so taller towers step back like real megatalls. The CAD model shows belt trusses at each of those transfer levels.

## Run locally

No build step, no dependencies. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

## Deploy on GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to **Settings → Pages → Build and deployment**.
3. Set the source to **Deploy from a branch**, then choose `main` and `/ (root)`.
4. The site goes live at `https://<user>.github.io/<repo>/`.

## Editing the dataset

All prompts live in [`data/questions.js`](data/questions.js):

```js
{
  id: "truss-types",                 // unique
  category: "Structures",            // shown as a chip
  prompt: "Name a named type of truss.",
  strip: ["truss"],                  // filler words ignored when matching
  tiers: {
    lowrise:    ["Pratt", "Howe", "Warren"],
    vanity:     ["Vierendeel"],
    highrise:   ["King post|Kingpost", "Fink", "..."],
    skyscraper: ["Pennsylvania|Petit", "..."],
    supertall:  ["Burr|Burr arch", "..."],
    megatall:   ["Bollman"]          // the gem
  }
}
```

- Separate aliases with `|`. The first alias is what players see.
- Matching ignores case, accents, punctuation, spacing, "the", simple plurals and the prompt's `strip` words. It also tolerates 1–3 typos, depending on the answer's length.
- Answers that aren't in the bank score 0 m ("Not on the blueprints").

Check the dataset after editing:

```bash
node tools/check-dataset.js
```

It reports duplicate keys and answers that could be confused through typo tolerance.

**Sources:** the starter set was written for this game. Prompts and deep cuts for roofs, brick bonds, arches, windows, stairs, cranes, materials tests, hammers and walls were drawn from the headword families of *A Dictionary of Construction, Surveying and Civil Engineering* (Gorse, Johnston & Pritchard, Oxford, 2nd ed.), and the obscure terms were checked against its definitions.

## Customising

- **Chapter logo:** the header shows `assets/aci-chapter-logo.png` (the ACI TIP Quezon City Student Chapter logo, cropped from the transparent original). Replace the file to change it.
- **Tiers, milestones, round size, timer:** edit [`js/config.js`](js/config.js).

## Files

```
index.html            page shell
css/style.css         cobalt & white UI
js/config.js          tiers, milestones, tower geometry
js/matcher.js         answer matching (shared with the checker)
js/tower.js           isometric construction renderer (canvas)
js/cad.js             3D structural model + plan sheets
js/game.js            game flow
data/questions.js     prompt dataset
tools/check-dataset.js
```
