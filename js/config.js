/* Skyscraper.io — shared game configuration */
(function () {
  "use strict";

  // Six rarity tiers. 8 × Megatall (125 m) = 1,000 m maximum.
  const TIERS = [
    { key: "lowrise",    name: "Low-Rise",      m: 15,  emoji: "⬜", desc: "The answer almost everyone blurts out first." },
    { key: "vanity",     name: "Vanity Height", m: 20,  emoji: "🟨", desc: "Feels clever — but it's the 'clever' answer everyone reaches for.", trap: true },
    { key: "highrise",   name: "High-Rise",     m: 40,  emoji: "🟩", desc: "Solid. You got past the first few obvious picks." },
    { key: "skyscraper", name: "Skyscraper",    m: 75,  emoji: "🟦", desc: "Genuinely uncommon, still recognisable." },
    { key: "supertall",  name: "Supertall",     m: 105, emoji: "🟪", desc: "A true deep cut — specialist knowledge." },
    { key: "megatall",   name: "Megatall",      m: 125, emoji: "💎", desc: "The designated gem of this prompt." }
  ];

  // Effect intensity per tier (index matches TIERS). Tune the whole feel here.
  //   hoistMs: time the answer tag travels up past the tier lines
  //   scrim: reveal overlay darkness · particles/kind: burst size · shake px · flash {alpha, ms} · rings
  const FX = {
    miss:       { hoistMs: 600,  scrim: 0.35, particles: 0,   kind: null,       shake: 4,  flash: null,                 rings: 0 },
    lowrise:    { hoistMs: 1000, scrim: 0.40, particles: 12,  kind: "dust",     shake: 0,  flash: null,                 rings: 0 },
    vanity:     { hoistMs: 1400, scrim: 0.45, particles: 16,  kind: "dust",     shake: 2,  flash: null,                 rings: 0 },
    highrise:   { hoistMs: 2000, scrim: 0.50, particles: 30,  kind: "spark",    shake: 3,  flash: { alpha: 0.15, ms: 120 }, rings: 0 },
    skyscraper: { hoistMs: 2800, scrim: 0.55, particles: 60,  kind: "spark",    shake: 5,  flash: { alpha: 0.25, ms: 150 }, rings: 2 },
    supertall:  { hoistMs: 3600, scrim: 0.60, particles: 110, kind: "confetti", shake: 7,  flash: { alpha: 0.35, ms: 180 }, rings: 3 },
    megatall:   { hoistMs: 4600, scrim: 0.70, particles: 200, kind: "gold",     shake: 10, flash: { alpha: 0.35, ms: 400, color: "#f5b400" }, rings: 4 }
  };
  TIERS.forEach(t => { t.fx = FX[t.key]; });

  // Altitude zones: caption + ambience while the flat tower grows.
  const ZONES = [
    { h: 0,    name: "Street level" },
    { h: 50,   name: "Above the rooftops" },
    { h: 150,  name: "Skyline" },
    { h: 300,  name: "Supertall airspace" },
    { h: 450,  name: "Cloud base" },
    { h: 600,  name: "Above the clouds" },
    { h: 828,  name: "Burj territory" },
    { h: 1000, name: "One Kilometre Club" }
  ];

  // Real-world height milestones (metres). Shown as ghost lines while building
  // and as "cleared" achievements at the end of a round.
  const MILESTONES = [
    { h: 56,   name: "Leaning Tower of Pisa" },
    { h: 93,   name: "Statue of Liberty (with pedestal)" },
    { h: 96,   name: "Elizabeth Tower (Big Ben)" },
    { h: 120,  name: "Standard high-rise skyline" },
    { h: 146,  name: "Great Pyramid of Giza (original)" },
    { h: 150,  name: "Skyscraper threshold", threshold: true },
    { h: 169,  name: "Washington Monument" },
    { h: 300,  name: "Supertall threshold", threshold: true },
    { h: 319,  name: "Chrysler Building" },
    { h: 330,  name: "Eiffel Tower" },
    { h: 381,  name: "Empire State Building (roof)" },
    { h: 452,  name: "Petronas Towers" },
    { h: 508,  name: "Taipei 101" },
    { h: 541,  name: "One World Trade Center" },
    { h: 600,  name: "Megatall threshold", threshold: true },
    { h: 632,  name: "Shanghai Tower" },
    { h: 679,  name: "Merdeka 118" },
    { h: 828,  name: "Burj Khalifa" },
    { h: 1000, name: "Jeddah Tower target (1 km)" }
  ];

  // CTBUH-style height classification of the finished tower.
  function classify(h) {
    if (h <= 0) return "Vacant Lot";
    if (h < 50) return "Low-Rise";
    if (h < 150) return "High-Rise";
    if (h < 300) return "Skyscraper";
    if (h < 600) return "Supertall";
    return "Megatall";
  }

  // Bundled-tube tower: a 3×3 grid of 24 m cells. Each cell "tops out" at its
  // cap height, so taller towers step back like a real bundled-tube megatall.
  const MODULE = 24;
  const CAPS = {
    "2,2": 150, "2,0": 240, "0,2": 330, "0,0": 450,
    "2,1": 540, "1,2": 660, "1,0": 780, "0,1": 880, "1,1": Infinity
  };
  const MODULES = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      MODULES.push({
        i, j,
        x0: (i - 1.5) * MODULE, x1: (i - 0.5) * MODULE,
        y0: (j - 1.5) * MODULE, y1: (j - 0.5) * MODULE,
        cap: CAPS[i + "," + j],
        center: i === 1 && j === 1
      });
    }
  }
  // Painter's order for the isometric view (far → near).
  MODULES.sort((a, b) => (a.i + a.j) - (b.i + b.j));

  window.SKY_CONFIG = {
    TIERS, MILESTONES, classify, MODULE, MODULES, FX, ZONES,
    COUNTDOWN: 3,
    FLOOR_M: 4,
    GEM_GOLD: "#f5b400",
    ROUND_SIZE: 8,
    TIME_LIMIT: 25,
    MAX_HEIGHT: 1000
  };
})();
