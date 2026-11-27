/*
 * Skyscraper.io — prompt dataset (v2 DRAFT, from the engine-rework handoff)
 * ------------------------------------------------------------------
 * Each prompt lists accepted answers grouped by rarity tier:
 *   lowrise (15 m) · vanity (20 m, the "too clever" trap) · highrise (40 m)
 *   skyscraper (75 m) · supertall (105 m) · megatall (125 m, the gem)
 *
 * An entry may carry aliases separated by "|" — the FIRST one is shown
 * to players, every one is accepted:  "Cable-stayed|Cable stayed"
 *
 * "strip" lists filler words ignored when matching, so "Golden Gate"
 * and "Golden Gate Bridge" both count.
 *
 * NEW optional fields (v2):
 *   source: citation shown nowhere yet; used by reviewers (e.g. "NSCP 2015 §402.3")
 *   facts:  { "<Display name>": "one-line fun fact" } — shown in the full-screen
 *           reveal. Every prompt MUST have a fact for its megatall gem.
 *
 * Matching ignores case, accents, punctuation, spacing, simple plurals
 * and small typos (1–3 letters, depending on answer length).
 */
window.SKYSCRAPER_DATA = {
  version: 2,
  questions: [
    /* =================== CORE CE PROMPTS (revised) =================== */
    {
      id: "structural-elements",
      category: "Structures",
      prompt: "Name a structural element of a building.",
      strip: [],
      tiers: {
        lowrise: ["Beam|Beams", "Column|Columns", "Slab|Floor slab", "Footing|Footings", "Foundation|Foundations"],
        vanity: ["Flying buttress"],
        highrise: ["Wall|Load-bearing wall|Bearing wall", "Truss", "Girder", "Joist", "Lintel", "Shear wall", "Bracing|Brace|Cross bracing", "Purlin", "Rafter", "Pile|Piles", "Roof|Roof slab|Roof deck", "Floor|Floor system", "Stairs|Staircase|Stair", "Arch", "Frame|Rigid frame", "Post|Pillar|Stud"],
        skyscraper: ["Pile cap", "Tie beam|Tie", "Grade beam", "Pedestal", "Corbel", "Cantilever", "Diaphragm", "Core wall|Elevator core|Core", "Outrigger", "Transfer beam|Transfer girder", "Ring beam|Bond beam", "Spandrel beam|Spandrel", "Pilaster", "Buttress", "Stringer", "Base plate", "Mat|Raft"],
        supertall: ["Drop panel", "Column capital|Capital", "Coupling beam", "Belt truss", "Gusset plate|Gusset", "Shear stud|Shear connector", "Haunch", "Boundary element", "Shear cap", "Stiffener", "Collar tie", "Sill plate|Sole plate|Sill", "Header"],
        megatall: ["Collector|Drag strut|Drag member"]
      },
      facts: {
        "Collector": "NSCP 2015 §202: a member that gathers lateral force from part of a floor and delivers it to the shear walls or frames.",
        "Footing": "Spreads a column's load over enough soil that the soil can carry it (NSCP 2015 §305)."
      }
    },
    {
      id: "concrete-types",
      category: "Materials",
      prompt: "Name a type of concrete.",
      strip: ["concrete"],
      tiers: {
        lowrise: ["Reinforced|Reinforced cement concrete|RCC", "Precast", "Prestressed"],
        vanity: ["Roman|Opus caementicium"],
        highrise: ["Ready-mix|Ready mix|Readymix|Ready-mixed", "Lightweight", "High-strength|High strength", "Shotcrete|Sprayed|Gunite", "Self-compacting|Self-consolidating|SCC", "Fiber-reinforced|Fibre-reinforced|FRC|Steel fiber-reinforced", "Post-tensioned", "Pretensioned", "Plain|PCC|Plain cement concrete|Unreinforced", "Cast-in-place|Cast in situ|In situ|Poured"],
        skyscraper: ["Normalweight|Normal-weight|Normal weight", "Pervious|Porous|Permeable", "Mass", "Polymer", "Glass-fiber reinforced|GFRC|GRC|Glass fibre reinforced", "Rapid-hardening|Rapid hardening|Rapid-set|Early strength", "Aerated|AAC|Autoclaved aerated|Cellular", "Roller-compacted|Roller compacted|RCC dam", "Stamped|Decorative", "Air-entrained|Air entrained", "Asphalt|Bitumen|Asphaltic", "Structural"],
        supertall: ["Ultra-high-performance|UHPC|UHPFRC|Ultra high performance", "Sand-lightweight|Sand lightweight", "All-lightweight|All lightweight", "Self-healing|Self healing", "Geopolymer", "Heavyweight|High-density|Radiation shielding", "Foamed|Foam", "Translucent|Light-transmitting|LiTraCon", "Tremie|Underwater"],
        megatall: ["Engineered cementitious composite|ECC|Bendable"]
      },
      source: "NSCP 2015 §402.3 (concrete types)",
      facts: { "Engineered cementitious composite": "ECC bends instead of snapping: fibres let it stretch about 3% before failing, hundreds of times more than ordinary concrete." }
    },
    {
      id: "foundation-types",
      category: "Geotechnical",
      prompt: "Name a type of building foundation.",
      strip: ["foundation", "footing"],
      tiers: {
        lowrise: ["Shallow|Footing|Spread", "Pile|Piled|Deep", "Slab-on-grade|Slab on grade|Slab"],
        vanity: ["Floating|Compensated"],
        highrise: ["Raft|Mat", "Isolated|Pad|Individual|Single", "Wall footing|Strip|Continuous", "Combined", "Caisson|Well", "Pier|Pier and beam", "Basement", "Bored pile|Drilled shaft|Drilled pier|Bored"],
        skyscraper: ["Strap|Cantilever footing|Strapped", "Pile cap", "Grade beam", "Stepped", "Driven pile|Driven", "Sheet pile", "Rubble trench", "Precast pile", "Steel pile|H-pile|Steel H-pile"],
        supertall: ["Micropile|Mini pile|Minipile", "Helical pile|Screw pile", "Under-reamed pile|Underreamed pile", "Franki pile", "Piled raft", "Inverted arch", "Suction caisson|Suction bucket", "Barrette|Barrette pile", "Timber pile|Wood pile|Round wood pile"],
        megatall: ["Grillage"]
      },
      source: "NSCP 2015 §305 (footings, incl. 305.8 grillage), §306–307 (piles)",
      facts: { "Grillage": "Layers of steel beams laid crosswise in concrete to spread a heavy column load; NSCP 2015 §305.8 covers grillage footings." }
    },
    {
      id: "famous-bridges",
      category: "Landmarks",
      prompt: "Name a real bridge — anywhere in the world.",
      strip: ["bridge", "viaduct"],
      tiers: {
        lowrise: ["Golden Gate", "Brooklyn", "Tower Bridge|Tower", "San Juanico"],
        vanity: ["Tacoma Narrows|Galloping Gertie"],
        highrise: ["London Bridge|London", "Sydney Harbour|Harbour Bridge|Sydney Harbor", "Cebu–Cordova Link|CCLEX|Cebu Cordova|Cebu-Cordova", "Marcelo Fernan|Fernan", "Mactan–Mandaue|Mactan Mandaue|Mactan|Sergio Osmeña|Sergio Osmena|Osmeña|Osmena", "Jones", "Ponte Vecchio", "Rialto", "Forth|Forth Rail", "Millau", "Akashi Kaikyō|Akashi Kaikyo|Akashi", "Hong Kong–Zhuhai–Macau|HZMB|Hong Kong Zhuhai Macau", "Binondo–Intramuros|Binondo Intramuros"],
        skyscraper: ["MacArthur", "Quezon", "Ayala", "Guadalupe", "Nagtahan|Mabini", "Lambingan", "Patapat", "Agas-Agas|Agas Agas", "Candaba", "Panguil Bay|Panguil", "Buntun", "Magapit", "Bay Bridge|San Francisco–Oakland Bay|Oakland Bay", "Charles", "Verrazzano-Narrows|Verrazano|Verrazzano", "George Washington", "Øresund|Oresund", "Humber", "Sunshine Skyway", "Pont du Gard", "Mackinac", "Stari Most|Mostar", "Rio–Antirrio|Rio Antirrio", "Vasco da Gama", "Hangzhou Bay", "Confederation"],
        supertall: ["Estrella–Pantaleon|Estrella Pantaleon", "BGC–Ortigas Link|BGC Ortigas|Kalayaan", "Delpan", "Danyang–Kunshan|Danyang Kunshan", "Çanakkale 1915|Canakkale", "Duge", "Russky", "Quebec", "Langkawi Sky|Langkawi", "Széchenyi Chain|Szechenyi", "Bixby Creek|Bixby", "Kintai|Kintaikyo"],
        megatall: ["The Iron Bridge|Iron Bridge|Ironbridge"]
      },
      facts: {
        "The Iron Bridge": "Opened 1781 in Shropshire, England: the world's first major bridge made of cast iron.",
        "San Juanico": "About 2.16 km long, joining Samar and Leyte: long called the longest bridge in the Philippines."
      }
    },
    {
      id: "ph-bridges",
      category: "Philippines",
      prompt: "Name a bridge in the Philippines.",
      strip: ["bridge", "viaduct", "flyover"],
      tiers: {
        lowrise: ["San Juanico", "Jones", "Guadalupe"],
        vanity: ["Cebu–Cordova Link|CCLEX|Cebu Cordova|Cebu-Cordova"],
        highrise: ["Marcelo Fernan|Fernan", "Mactan–Mandaue|Mactan Mandaue|Mactan|Sergio Osmeña|Sergio Osmena|Osmeña|Osmena", "MacArthur", "Quezon", "Ayala", "Nagtahan|Mabini", "Lambingan", "Binondo–Intramuros|Binondo Intramuros", "Delpan", "Estrella–Pantaleon|Estrella Pantaleon|Estrella|Rockwell"],
        skyscraper: ["Patapat", "Agas-Agas|Agas Agas", "Candaba", "Panguil Bay|Panguil", "Buntun", "Magapit", "BGC–Ortigas Link|BGC Ortigas|Kalayaan", "Bamban"],
        supertall: ["Bataan–Cavite Interlink|Bataan Cavite|Bataan-Cavite", "Samal Island–Davao|Davao–Samal|Samal|Davao Samal"],
        megatall: ["Puente Colgante|Colgante"]
      },
      facts: {
        "Puente Colgante": "A suspension bridge over the Pasig River opened in 1852, often cited as the first suspension bridge in Asia; Quezon Bridge replaced it in 1939."
      }
    },
    {
      id: "famous-dams",
      category: "Water",
      prompt: "Name a real dam.",
      strip: ["dam", "reservoir"],
      tiers: {
        lowrise: ["Hoover|Boulder", "Three Gorges", "Angat"],
        vanity: ["Vajont|Vaiont"],
        highrise: ["La Mesa|Lamesa", "Magat", "San Roque", "Pantabangan", "Ipo", "Kaliwa", "Aswan High|Aswan", "Itaipu", "Grand Coulee", "Glen Canyon", "Grand Ethiopian Renaissance|GERD|Renaissance", "Tarbela", "Oroville"],
        skyscraper: ["Ambuklao|Ambuclao", "Binga", "Caliraya", "Casecnan", "Pulangi|Pulangi IV|Pulangi 4", "Agus", "Kariba", "Hirakud", "Guri", "Bhakra|Bhakra Nangal", "Grande Dixence", "Kurobe", "Belo Monte", "Atatürk|Ataturk", "Shasta", "Tehri"],
        supertall: ["Lumot", "Masiway", "Botocan", "Bustos", "Jalaur", "Balog-Balog|Balog Balog", "Malinao", "Bayongan", "Buhisan", "Inguri|Enguri", "Jinping-I|Jinping", "Rogun", "Banqiao", "St. Francis|Saint Francis|St Francis", "Malpasset", "Daniel-Johnson|Daniel Johnson|Manic-5", "Contra|Verzasca"],
        megatall: ["Wawa"]
      },
      facts: {
        "Wawa": "Built in the gorge at Montalban (Rodriguez), Rizal and finished in 1909, it was one of Manila's early water-supply dams.",
        "Angat": "Supplies most of Metro Manila's water."
      }
    },
    {
      id: "bridge-types",
      category: "Bridges",
      prompt: "Name a structural type of bridge.",
      strip: ["bridge"],
      tiers: {
        lowrise: ["Suspension", "Arch", "Beam|Girder", "Truss"],
        vanity: ["Bascule"],
        highrise: ["Cable-stayed|Cable stayed", "Cantilever", "Pontoon|Floating", "Swing", "Drawbridge", "Covered", "Viaduct", "Footbridge|Pedestrian|Footbridge overpass|Overpass", "Slab"],
        skyscraper: ["Box girder", "Tied-arch|Tied arch|Bowstring arch|Bowstring", "Bailey", "Vertical-lift|Lift", "Movable|Moveable", "Trestle", "Plate girder", "Rope|Hanging|Hanging bridge", "Culvert|Box culvert", "Integral"],
        supertall: ["Extradosed", "Transporter", "Self-anchored suspension", "Vierendeel", "Segmental", "Through arch", "Deck arch", "Rigid frame|Portal frame"],
        megatall: ["Stress ribbon|Stressed ribbon"]
      },
      facts: { "Stress ribbon": "The deck is a thin concrete band hung like a sagging rope between two abutments, so you walk on the cables themselves." }
    },
    {
      id: "design-loads",
      category: "Structures",
      prompt: "Name a load or action considered in structural design.",
      strip: ["load", "loading", "action", "force"],
      tiers: {
        lowrise: ["Dead|Self-weight|Self weight|Permanent", "Live|Imposed", "Wind", "Earthquake|Seismic"],
        vanity: [],
        highrise: ["Roof live|Roof", "Rain", "Flood", "Thermal|Temperature", "Impact", "Point|Concentrated", "Distributed|Uniform|Uniformly distributed|UDL", "Dynamic", "Traffic|Moving|Vehicle", "Snow", "Axial", "Lateral"],
        skyscraper: ["Soil lateral|Earth pressure|Soil pressure|Lateral earth|Soil", "Hydrostatic|Water pressure|Fluid", "Settlement|Differential settlement", "Blast|Explosion", "Construction", "Uplift", "Fatigue|Cyclic", "Wave", "Factored", "Service", "Self-straining|Self straining", "Gravity"],
        supertall: ["Notional", "Vortex shedding", "Creep", "Shrinkage", "Crane", "Braking", "Centrifugal", "Prestress|Prestressing", "Collision", "Accidental", "Ice"],
        megatall: ["Ponding"]
      },
      source: "NSCP 2015 §202–211 (Chapter 2 load types), Ch5 glossary (ponding, notional load)",
      facts: { "Ponding": "Rainwater collecting on a flat roof makes it sag, which lets more water collect: NSCP 2015 Ch5 defines it as retention of water due solely to the deflection of flat roof framing." }
    },
    {
      id: "concrete-ingredients",
      category: "Materials",
      prompt: "Name an ingredient or admixture used in concrete.",
      strip: [],
      tiers: {
        lowrise: ["Cement|Portland cement", "Water", "Sand|Fine aggregate", "Gravel|Coarse aggregate|Crushed stone"],
        vanity: [],
        highrise: ["Aggregate", "Admixture", "Fly ash|Pulverized fuel ash|PFA", "Superplasticizer|Superplasticiser|Plasticizer|Plasticiser", "Accelerator", "Retarder", "Silica fume|Microsilica", "Slag|GGBS|GGBFS|Ground granulated blast-furnace slag", "Lime"],
        skyscraper: ["Air-entraining agent|Air entrainer|Air entraining admixture", "Water reducer|Water-reducing admixture", "Pozzolan|Pozzolana", "Steel fibers|Steel fibres|Fibers|Fibres", "Polypropylene fibers|Polypropylene fibres|PP fibers", "Waterproofing admixture|Integral waterproofing", "Recycled aggregate", "Lightweight aggregate", "Metakaolin"],
        supertall: ["Corrosion inhibitor", "Shrinkage reducer|Shrinkage-reducing admixture|SRA", "Viscosity modifier|VMA", "Calcium chloride", "Volcanic ash", "Expanded clay|LECA", "Pumice", "Pigment|Iron oxide|Color pigment"],
        megatall: ["Rice husk ash|RHA"]
      },
      facts: { "Rice husk ash": "Burnt rice husks are almost pure reactive silica, so a rice-growing country like the Philippines can use them in place of part of the cement." }
    },
    {
      id: "soil-tests",
      category: "Geotechnical",
      prompt: "Name a geotechnical (soil) test.",
      strip: ["test", "testing"],
      tiers: {
        lowrise: ["Proctor|Proctor compaction|Compaction", "Standard penetration|SPT", "California bearing ratio|CBR"],
        vanity: [],
        highrise: ["Cone penetration|CPT|CPTu|Dutch cone", "Triaxial", "Atterberg limits|Atterberg|Liquid limit|Plastic limit", "Sieve analysis|Sieve|Gradation|Particle size", "Direct shear|Shear box", "Plate load|Plate bearing", "Consolidation|Oedometer", "Moisture content|Water content", "Field density|In-place density|Field density test", "Soil boring|Boring|Borehole"],
        skyscraper: ["Vane shear|Field vane|Shear vane", "Hydrometer", "Unconfined compression|UCS|Unconfined compressive strength", "Permeability|Hydraulic conductivity", "Sand cone|Sand replacement", "Nuclear density|Nuclear gauge", "Specific gravity", "Shrinkage limit", "Pile load|Static load|Dynamic load"],
        supertall: ["Pocket penetrometer", "Constant head", "Falling head|Variable head", "Dynamic cone penetrometer|DCP", "Pressuremeter|Menard pressuremeter", "Free swell|Swell"],
        megatall: ["Flat dilatometer|DMT|Marchetti dilatometer|Dilatometer"]
      },
      source: "NSCP 2015 §303 (foundation investigation), §306.4–306.5 (pile load tests)",
      facts: { "Flat dilatometer": "A steel blade pushed into the ground inflates a thin steel membrane sideways to measure how stiff the soil is." }
    },
    {
      id: "heavy-equipment",
      category: "Construction",
      prompt: "Name a piece of heavy construction equipment.",
      strip: [],
      tiers: {
        lowrise: ["Crane", "Backhoe|Excavator|Digger|Backhoe loader", "Bulldozer|Dozer"],
        vanity: ["Bagger 288|Bucket-wheel excavator|Bucket wheel excavator"],
        highrise: ["Dump truck|Tipper", "Forklift", "Concrete mixer|Cement mixer|Mixer truck|Transit mixer", "Payloader|Loader|Front loader|Wheel loader", "Grader|Motor grader", "Road roller|Roller|Steamroller|Pison", "Paver|Asphalt paver", "Pile driver", "Tower crane", "Boom truck", "Cherry picker|Boom lift|Manlift"],
        skyscraper: ["Scraper", "Trencher", "Skid steer|Bobcat", "Telehandler", "Concrete pump|Boom pump", "Tunnel boring machine|TBM", "Dragline", "Compactor|Plate compactor|Jumping jack|Rammer", "Mobile crane|Crawler crane", "Low bed|Lowboy|Low-bed trailer", "Water truck", "Concrete vibrator|Vibrator"],
        supertall: ["Slipform paver", "Vibratory hammer|Vibro hammer", "Piling rig|Rotary rig|Bored pile rig", "Cold planer|Milling machine", "Clamshell|Grab", "Long-reach excavator|Long reach excavator", "Pipelayer|Sideboom", "Batching plant|Batch plant"],
        megatall: ["Sheepsfoot roller|Sheep's foot roller|Padfoot roller"]
      },
      facts: { "Sheepsfoot roller": "Its drum is covered in stubby feet that knead clay from the bottom up, so the feet 'walk out' of the soil once it is compacted." }
    },
    {
      id: "building-materials",
      category: "Materials",
      prompt: "Name a building material (other than concrete).",
      strip: [],
      tiers: {
        lowrise: ["Steel", "Wood|Timber|Lumber", "Hollow blocks|CHB|Concrete hollow blocks|Concrete hollow block", "Glass"],
        vanity: ["Bamboo"],
        highrise: ["Brick", "Stone", "Aluminum|Aluminium", "Plywood", "Rebar|Reinforcing bar|Steel bars|Deformed bars", "GI sheet|Galvanized iron|Yero|Corrugated iron|Roofing sheet", "Gypsum|Plaster", "Marble", "Granite", "Mortar", "Cement", "Tile|Tiles", "Asphalt", "Sand", "Gravel"],
        skyscraper: ["Nipa|Nipa palm", "Adobe|Mud brick", "Drywall|Gypsum board|Plasterboard|Sheetrock", "Fiber cement board|Fibre cement|Fiber cement", "Terracotta|Terra cotta", "Cross-laminated timber|CLT|Cross laminated timber", "Rammed earth", "Fiberglass|Fibreglass", "Copper", "Limestone", "Stucco", "OSB|Oriented strand board", "Particleboard|Chipboard", "Polycarbonate"],
        supertall: ["Coco lumber|Coconut lumber|Coconut wood", "Glulam|Glued laminated timber|Structural glued-laminated timber", "Weathering steel|Corten|COR-TEN", "FRP|Fiber-reinforced polymer|Fibre-reinforced polymer|CFRP", "Ferrocement", "LVL|Laminated veneer lumber", "Hempcrete", "ETFE|Ethylene tetrafluoroethylene", "Hardboard", "Fiberboard"],
        megatall: ["Capiz|Capiz shell"]
      },
      facts: { "Capiz": "Thin, translucent windowpane-oyster shells set in wooden grids as windows in Spanish-era Filipino houses (bahay na bato)." }
    },
    {
      id: "steel-sections",
      category: "Steel",
      prompt: "Name a steel section (profile) shape.",
      strip: ["section", "profile", "shape"],
      tiers: {
        lowrise: ["I-beam|I beam|I-section", "H-beam|H beam|H-section|H-pile", "Angle|Angle bar|L-section|L-shape"],
        vanity: [],
        highrise: ["Channel|C-section|C-channel|U-channel|C-purlin", "Tee|T-section|T-bar|WT", "Tube|Hollow section|HSS|Tubular", "Wide flange|W-shape|W-section", "Pipe|Circular hollow section|CHS", "Plate", "Flat bar|Flat", "Round bar|Rod"],
        skyscraper: ["Z-section|Zed|Z-purlin", "Rectangular hollow section|RHS", "Square hollow section|SHS", "Built-up|Built up|Built-up member", "Double angle", "Box section|Box", "Rail"],
        supertall: ["Cellular beam", "Hat section|Omega", "Sigma section|Sigma", "Unequal angle", "Taper flange beam|Tapered flange|Junior beam", "Bulb flat", "Cold-formed|Cold formed|Light gauge"],
        megatall: ["Castellated beam|Castellated"]
      },
      facts: { "Castellated beam": "An I-beam's web is cut in a zig-zag, the halves are shifted and welded back together: a deeper, stronger beam from the same steel, with hexagonal holes." }
    },
    {
      id: "road-components",
      category: "Transportation",
      prompt: "Name a component or feature of a road or highway.",
      strip: [],
      tiers: {
        lowrise: ["Lane", "Shoulder", "Curb|Kerb|Gutter and curb", "Median|Center island|Island"],
        vanity: ["Botts' dots|Botts dots"],
        highrise: ["Pavement|Asphalt|Wearing surface", "Base course|Base", "Subgrade", "Guardrail|Crash barrier|Barrier", "Ditch|Drain|Drainage|Canal", "Sidewalk|Footpath", "Gutter", "Pedestrian lane|Crosswalk|Zebra crossing|Pedestrian crossing", "Road markings|Lane markings|Pavement markings", "Speed hump|Speed bump|Rumble hump", "Rotunda|Roundabout", "Interchange|Overpass|Flyover", "Streetlight|Street light|Lamp post", "Traffic sign|Signage|Road sign", "Traffic light|Stoplight"],
        skyscraper: ["Subbase", "Surface course|Wearing course", "Rumble strip", "Camber|Crown|Cross slope", "Culvert", "Jersey barrier|New Jersey barrier", "Cat's eye|Cats eye|Raised pavement marker|Road stud", "Expansion joint", "Bike lane|Cycle lane", "Embankment", "Manhole", "Catch basin|Inlet|Storm drain"],
        supertall: ["Tack coat", "Prime coat", "Geotextile", "Dowel bar", "Tie bar", "Transition curve|Spiral|Easement curve", "Crash cushion|Impact attenuator", "Sight distance", "Vertical curve"],
        megatall: ["Superelevation|Banking|Cant"]
      },
      facts: { "Superelevation": "Tilting a curved road toward the inside so part of the car's weight pushes it around the bend instead of relying on tyre friction alone." }
    },
    {
      id: "structural-failures",
      category: "History",
      prompt: "Name a famous structural collapse or engineering failure.",
      strip: ["collapse", "disaster", "failure"],
      tiers: {
        lowrise: ["Tacoma Narrows Bridge|Tacoma Narrows|Galloping Gertie", "World Trade Center|Twin Towers|WTC|9/11"],
        vanity: ["Hyatt Regency walkway|Hyatt Regency|Kansas City Hyatt"],
        highrise: ["Manila Film Center|Film Center", "Hyatt Terraces|Hyatt Terraces Baguio|Baguio Hyatt", "Ruby Tower", "Quebec Bridge|Quebec", "Tay Bridge|Tay", "Silver Bridge|Point Pleasant", "I-35W bridge|I-35W|I35W|Minneapolis bridge", "Ronan Point", "Sampoong Department Store|Sampoong", "Ponte Morandi|Morandi|Genoa bridge", "Champlain Towers South|Surfside|Champlain Towers", "Rana Plaza", "Banqiao Dam|Banqiao", "Cabagan–Santa Maria Bridge|Cabagan-Santa Maria Bridge|Cabagan Santa Maria Bridge|Cabagan–Santa Maria|Cabagan Santa Maria|Cabagan bridge|Cabagan|Santa Maria bridge|Isabela bridge|Isabella bridge|Isabela|Isabella"],
        skyscraper: ["Chuzon Supermarket|Chuzon|Porac", "Hartford Civic Center|Hartford", "Teton Dam|Teton", "St. Francis Dam|St Francis Dam|Saint Francis Dam", "Malpasset Dam|Malpasset", "Citicorp Center|Citigroup Center|Citicorp", "FIU pedestrian bridge|FIU bridge|FIU", "Vajont Dam|Vajont", "Hotel New World", "L'Ambiance Plaza|Lambiance Plaza", "Millennium Bridge|Wobbly bridge", "Kemper Arena"],
        supertall: ["Highland Towers", "West Gate Bridge|West Gate", "South Fork Dam|Johnstown Flood", "Dee Bridge|Dee", "Kings Bridge|King Street Bridge"],
        megatall: ["Sleipner A|Sleipner"]
      },
      facts: {
        "Sleipner A": "In 1991 this North Sea platform's concrete base sank after a finite-element model underestimated shear stress by about 47%: a classic lesson in checking computer output.",
        "Cabagan–Santa Maria Bridge": "A ₱1.2-billion bridge in Isabela that collapsed on 27 Feb 2025, weeks after opening, when a dump truck several times over the load limit crossed; DPWH named overloading the main cause and also found design and construction defects.",
        "Ruby Tower": "A Binondo, Manila apartment building that collapsed in the 1968 Casiguran earthquake."
      }
    },
    {
      id: "hydraulic-structures",
      category: "Water",
      prompt: "Name a hydraulic structure — anything built to control or use water.",
      strip: [],
      tiers: {
        lowrise: ["Dam", "Canal", "Dike|Dyke|Levee"],
        vanity: ["Aqueduct"],
        highrise: ["Weir", "Spillway", "Lock|Canal lock", "Culvert", "Breakwater", "Reservoir", "Sluice|Sluice gate", "Seawall|Sea wall", "Pier|Wharf", "Water tank|Water tower|Elevated tank", "Well|Deep well", "Floodgate|Flood gate", "Pumping station|Pump station"],
        skyscraper: ["Groyne|Groin", "Penstock", "Stilling basin", "Fish ladder|Fish pass|Fishway", "Jetty", "Surge tank|Surge chamber", "Cofferdam", "Barrage", "Headrace|Tailrace", "Intake tower|Intake", "Flume", "Detention basin|Retention pond|Detention pond|Catchment basin", "Check dam|Sabo dam", "Parshall flume"],
        supertall: ["Labyrinth weir", "Tide gate|Flap gate", "Tetrapod", "Energy dissipator|Dissipator", "Siphon spillway", "Ship lift|Boat lift", "Inverted siphon", "Radial gate|Tainter gate", "Ogee spillway|Ogee"],
        megatall: ["Morning glory spillway|Bell-mouth spillway|Bellmouth spillway|Glory hole"]
      },
      facts: { "Morning glory spillway": "A giant funnel in the reservoir that swallows overflow straight down a vertical shaft: Monticello Dam's in California is the famous one." }
    },
    {
      id: "surveying-instruments",
      category: "Surveying",
      prompt: "Name a surveying instrument or tool.",
      strip: [],
      tiers: {
        lowrise: ["Total station", "GPS|GNSS", "Level|Spirit level"],
        vanity: ["Theodolite"],
        highrise: ["Tape measure|Measuring tape|Tape|Steel tape", "Compass|Brunton", "Laser level", "Plumb bob|Plumb line", "EDM|Electronic distance meter|Rangefinder", "Dumpy level", "Drone|UAV", "Leveling rod|Levelling staff|Staff|Rod|Stadia rod", "Tripod", "Range pole|Ranging rod|Ranging pole"],
        skyscraper: ["Automatic level|Auto level", "Prism|Reflector", "Chain|Gunter's chain|Surveyor's chain|Engineer's chain", "Plane table", "Transit", "Lidar|Laser scanner|3D laser scanner", "Clinometer", "Measuring wheel|Trundle wheel", "Hand level", "Marking pins|Chaining pins|Arrows"],
        supertall: ["Alidade", "Abney level", "Optical square", "Cross-staff", "Pantograph", "Stereoscope"],
        megatall: ["Planimeter"]
      },
      facts: { "Planimeter": "Trace the outline of any shape on a map and its wheel reads out the enclosed area: calculus (Green's theorem) built into a gadget." }
    },
    {
      id: "retaining-walls",
      category: "Geotechnical",
      prompt: "Name a type of retaining wall.",
      strip: ["wall", "retaining"],
      tiers: {
        lowrise: ["Gravity", "Cantilever", "Gabion"],
        vanity: [],
        highrise: ["Sheet pile|Sheet piling", "Counterfort", "Anchored|Tieback", "Mechanically stabilized earth|MSE|Mechanically stabilised earth|Reinforced earth", "Soil nail|Soil nailing|Soil nailed", "Diaphragm|Slurry", "Riprap|Rubble", "Masonry|CHB|Stone masonry"],
        skyscraper: ["Buttressed|Buttress", "Secant pile|Secant", "Contiguous pile|Contiguous", "Soldier pile and lagging|Soldier pile|Soldier and lagging", "Bin", "Dry stone|Drystone", "Segmental block|Segmental|Modular block"],
        supertall: ["Semi-gravity", "Tangent pile|Tangent", "Geocell|Cellular confinement", "Green wall|Vegetated", "King post"],
        megatall: ["Crib"]
      },
      facts: { "Crib": "Interlocking concrete or timber 'logs' stacked like a log cabin and filled with soil: the soil inside does the holding." }
    },
    {
      id: "seismic-design",
      category: "Earthquakes",
      prompt: "Name an earthquake-resistant design feature or device.",
      strip: [],
      tiers: {
        lowrise: ["Base isolation|Base isolator|Seismic isolation", "Shear wall", "Damper"],
        vanity: ["Tuned mass damper|TMD|Taipei 101 damper"],
        highrise: ["Cross bracing|X bracing|Bracing|Braced frame", "Moment frame|Moment-resisting frame|Special moment frame|SMRF|SMF", "Lead rubber bearing|LRB|Rubber bearing", "Viscous damper|Fluid viscous damper", "Friction pendulum|Friction pendulum bearing", "Seismic joint|Seismic gap|Expansion joint", "Dual system", "Ductile detailing|Ductility|Seismic hook|Hoops"],
        skyscraper: ["Buckling-restrained brace|BRB|Buckling restrained brace|BRBF", "Eccentrically braced frame|EBF", "Friction damper", "Rocking wall|Rocking frame", "Diaphragm", "Hold-down|Holdown", "Outrigger", "Strong column weak beam|Capacity design", "Boundary element", "Special plate shear wall|SPSW|Steel plate shear wall"],
        supertall: ["Tuned liquid damper|TLD|Sloshing damper", "Viscoelastic damper", "Active mass damper|AMD", "Yielding damper|ADAS|TADAS|Metallic yield damper", "Self-centering|Self-centring", "Shock transmission unit|STU|Lock-up device", "Diagrid", "Coupled shear wall|Coupled wall|Coupling beam"],
        megatall: ["Reduced beam section|RBS|Dogbone"]
      },
      source: "NSCP 2015 §418, §522 (SMF), Ch5 glossary (reduced beam section)",
      facts: { "Reduced beam section": "Trimming a beam's flanges into a 'dogbone' just beside the column forces the plastic hinge to form there, protecting the joint in a big earthquake." }
    },
    {
      id: "roof-types",
      category: "Building Construction",
      prompt: "Name a type of roof.",
      strip: ["roof", "roofing"],
      tiers: {
        lowrise: ["Gable", "Flat", "Hip|Hipped|Hip and valley"],
        vanity: ["Mansard|French"],
        highrise: ["Shed|Lean-to|Single-pitch|Mono-pitch", "Gambrel", "Butterfly", "Dome|Domed", "Barrel vault|Barrel", "Sawtooth|Northlight|North light", "Green|Living", "Thatched|Thatch|Nipa", "Pitched|Sloped"],
        skyscraper: ["Hyperbolic paraboloid|Hypar", "Folded plate", "Shell|Thin shell", "Saltbox", "Cross-gabled|Cross gable", "Skillion", "Pyramid|Pyramidal", "Bonnet", "Pavilion", "Clerestory"],
        supertall: ["Conical|Cone", "Onion dome|Onion", "Space frame", "Tensile|Membrane|Fabric", "Inverted|Upside-down|Protected membrane"],
        megatall: ["Jerkinhead|Jerkin head|Half-hipped|Clipped gable|Hipped gable"]
      },
      facts: { "Jerkinhead": "A gable roof with its peak clipped into a small hip, a compromise that sheds wind better than a pure gable." }
    },
    {
      id: "wall-types",
      category: "Building Construction",
      prompt: "Name a type of wall used in buildings or civil works.",
      strip: ["wall"],
      tiers: {
        lowrise: ["Load-bearing|Bearing|Loadbearing", "Retaining", "Partition"],
        vanity: ["Trombe"],
        highrise: ["Shear", "Curtain", "Cavity", "Parapet", "Fire|Firewall", "Nonbearing|Non-bearing|Non-load-bearing", "Exterior", "Hollow block|CHB|Masonry", "Gable", "Sea|Seawall", "Infill", "Diaphragm"],
        skyscraper: ["Party|Separating", "Veneer|Veneered", "Spandrel", "Dwarf", "Core", "Cross-wall|Cross wall", "Bonded", "Noise barrier|Sound", "Wing", "Knee"],
        supertall: ["Pier|Wall pier", "Dry-stone|Dry stone|Drystone", "Rubble", "Precast panel|Tilt-up|Tilt up", "Sandwich"],
        megatall: ["Cripple|Cripple stud"]
      },
      source: "NSCP 2015 §202 (wall definitions), §402.3, Ch7",
      facts: { "Cripple": "NSCP 2015 §202: a short stud wall from the top of the foundation up to the lowest floor. They often buckle in earthquakes unless sheathed." }
    },
    {
      id: "crane-types",
      category: "Construction",
      prompt: "Name a type of crane.",
      strip: ["crane"],
      tiers: {
        lowrise: ["Tower", "Mobile", "Overhead|Bridge"],
        vanity: ["Hammerhead"],
        highrise: ["Gantry", "Crawler", "Truck-mounted|Truck|Boom truck", "Rough terrain|Rough-terrain", "Floating", "Luffing|Luffing jib", "Telescopic", "Jib", "Derrick", "Self-erecting|Self erecting", "Ship-to-shore|Container|STS"],
        skyscraper: ["Semi-gantry", "Knuckle boom|Loader|Lorry loader|HIAB", "Carry deck", "Spider|Mini crawler", "Railroad|Rail|Locomotive", "Sky crane|Helicopter|Aerial", "Flat-top|Flat top|Topless"],
        supertall: ["Stiff-leg|Stiffleg|Scotch derrick", "Guy derrick", "Ringer|Ring", "Titan"],
        megatall: ["Self-climbing|Climbing|Jump"]
      },
      facts: { "Self-climbing": "It jacks itself up inside the building's core as floors rise: how cranes end up 800 m in the air on supertalls." }
    },
    {
      id: "materials-tests",
      category: "Materials Testing",
      prompt: "Name a test used on construction materials (concrete, steel, timber…).",
      strip: ["test", "testing"],
      tiers: {
        lowrise: ["Slump", "Compressive strength|Compression|Cube|Cylinder", "Tensile|Tension"],
        vanity: ["Schmidt hammer|Rebound hammer|Rebound"],
        highrise: ["Flexural|Bending|Modulus of rupture|Beam", "Charpy|Charpy impact|Charpy V-notch", "Brinell|Brinell hardness", "Rockwell|Rockwell hardness", "Core|Core sample|Coring", "Ultrasonic pulse velocity|UPV|Ultrasonic", "Fatigue", "Bend", "Abrasion|Los Angeles abrasion|LA abrasion", "Sieve analysis|Gradation"],
        skyscraper: ["Split cylinder|Splitting tensile|Brazilian|Splitting", "Vickers|Vickers hardness", "Izod", "Compaction factor", "Flow table|Slump flow", "Vebe|VB|VB consistometer", "Pull-out|Pullout", "Half-cell potential|Half cell", "Carbonation|Phenolphthalein", "Specific gravity|Absorption", "Load test|Static load"],
        supertall: ["J-ring", "L-box", "V-funnel", "Le Chatelier|Soundness", "Aggregate crushing value|ACV", "Aggregate impact value|AIV", "Rapid chloride permeability|RCPT", "Covermeter|Cover meter", "Fineness|Blaine"],
        megatall: ["Vicat|Vicat needle|Setting time"]
      },
      facts: { "Vicat": "A weighted needle is dropped into cement paste again and again; the time until it stops sinking in is the cement's setting time." }
    },
    {
      id: "pressure-units",
      category: "Mechanics",
      prompt: "Name a unit of pressure or stress.",
      strip: [],
      tiers: {
        lowrise: ["Pascal|Pa", "psi|Pounds per square inch", "Megapascal|MPa"],
        vanity: ["Torr"],
        highrise: ["Kilopascal|kPa", "Bar", "Atmosphere|atm", "Millimetre of mercury|mmHg|Millimeter of mercury", "Newton per square metre|N/m2|N/m²|Newton per square meter", "Gigapascal|GPa", "Kilonewton per square metre|kN/m2|kN/m²|Kilonewton per square meter", "ksi|Kip per square inch|Kips per square inch"],
        skyscraper: ["Newton per square millimetre|N/mm2|N/mm²|Newton per square millimeter", "psf|Pounds per square foot", "Kilogram-force per square centimetre|kgf/cm2|kg/cm2|ksc|Kilogram per square centimeter", "Hectopascal|hPa", "Millibar|mbar", "Inch of mercury|inHg", "Kilogram per square metre|kg/m2|kgf/m2|Kilogram per square meter", "Inch of water|inH2O", "Millimetre of water|mmH2O|Millimeter of water", "psig|psia|Gauge psi"],
        supertall: ["ksf|Kips per square foot", "Tons per square foot|tsf", "Tonne per square metre|t/m2|Ton per square meter", "Technical atmosphere|at", "Barye", "Pieze", "Kilobar|kbar", "Microbar", "Centimetre of water|cmH2O|Centimeter of water"],
        megatall: ["Metre of water|mH2O|Meter of water|Feet of head|Foot of water|Head"]
      },
      facts: { "Metre of water": "Pressure written as the height of a water column: 10 m of water is roughly one atmosphere. Hydraulics engineers still say 'head'." }
    },

    /* ---- units prompts (Ellis, 2026-11-26: "like name a unit of pressure or stress") ---- */
    {
      id: "temperature-units",
      category: "Units",
      prompt: "Name a unit or scale of temperature.",
      strip: ["degree", "scale"],
      tiers: {
        lowrise: ["Celsius|°C|C|Centigrade", "Fahrenheit|°F|F", "Kelvin|K"],
        vanity: [],
        highrise: ["Rankine|°R|R"],
        skyscraper: ["Réaumur|Reaumur|°Ré|Re", "Millikelvin|mK", "Gas mark|Regulo", "Microkelvin|Nanokelvin"],
        supertall: ["Delisle|°De|De", "Newton|°N|N", "Planck temperature|Planck", "Wedgwood", "Leiden", "Électronvolt temperature|Electronvolt temperature"],
        megatall: ["Rømer|Romer|Roemer|°Rø"]
      },
      facts: { "Rømer": "Danish astronomer Ole Rømer's 1701 scale put brine's freezing point at 0 and water's boiling point at 60; Fahrenheit visited him and built his own scale from it." }
    },
    {
      id: "length-units",
      category: "Units",
      prompt: "Name a unit of length or distance.",
      strip: [],
      tiers: {
        lowrise: ["Metre|Meter|m", "Centimetre|Centimeter|cm", "Millimetre|Millimeter|mm", "Kilometre|Kilometer|km", "Inch|Inches|in", "Foot|Feet|ft"],
        vanity: ["Light-year|Light year|ly", "Knot|Knots|kn|kt"],
        highrise: ["Yard|yd", "Mile|mi", "Micrometre|Micrometer|Micron|um", "Nanometre|Nanometer|nm", "Nautical mile|nmi", "Decimetre|Decimeter|dm", "Pace|Paces|Step|Steps", "Hectometre|Hectometer|hm", "Decametre|Decameter|Dekameter|Dekametre|dam", "Statute mile|Land mile|International mile"],
        skyscraper: ["Chain|Gunter's chain|Gunters chain|Surveyor's chain", "Rod|Pole|Perch", "Furlong", "Fathom", "Ångström|Angstrom|Å", "Mil|Thou", "Astronomical unit|AU", "League", "Hand", "Dangkal", "Palm", "Talampakan", "Pulgada", "Megametre|Megameter", "Femtometre|Femtometer|Fermi|fm", "Light-second|Light second|Light-minute|Light minute", "Klick|Click", "Point|pt", "Pica", "US survey foot|Survey foot"],
        supertall: ["Link|Gunter's link", "Cubit", "Parsec|pc", "Span", "Picometre|Picometer|pm", "Station", "Dipa", "Ell", "Barleycorn", "Digit|Finger", "Cable length|Cable", "Planck length", "Roman mile|Mille passus|Mille", "Stadion|Stadium|Stade", "Li|Chinese mile", "Shaku", "Ken", "Chi|Chinese foot", "Verst|Versta", "Arpent", "Braza", "Gigametre|Gigameter|Gm", "Smoot", "Mile (Scandinavian)|Scandinavian mile|Swedish mil|Norwegian mil"],
        megatall: ["Vara|Spanish vara"]
      },
      facts: { "Pace": "A Roman pace (passus) was two steps, about 1.48 m. A thousand of them, mille passus, gave us the word mile.", "Knot": "A knot is a speed, one nautical mile per hour. The length behind it is the nautical mile (1,852 m), so it scores only as a Vanity answer.",
        "Vara": "The Spanish vara (about 0.84 m) still turns up on old Philippine land titles and survey plans, so surveyors here have to convert it.",
        "Dangkal": "The Filipino hand-span, thumb tip to little-finger tip: a body measure still used informally on site."
      }
    },
    {
      id: "force-units",
      category: "Units",
      prompt: "Name a unit of force.",
      strip: [],
      tiers: {
        lowrise: ["Newton|N", "Kilonewton|kN", "Pound|Pound-force|lb|lbf"],
        vanity: ["Kilogram|kg|Kilo"],
        highrise: ["Kip|Kips|Kilopound", "Kilogram-force|kgf|Kilopond|kp", "Dyne|dyn", "Tonne-force|Ton-force|tf|Metric ton-force|Ton|Tonne", "Meganewton"],
        skyscraper: ["Poundal|pdl", "Gram-force|gf", "Millinewton", "Decanewton|daN", "Giganewton|GN", "Short ton-force|US ton-force", "Kip-force|klbf"],
        supertall: ["Ounce-force|ozf", "Micronewton", "Long ton-force", "Kilodyne"],
        megatall: ["Sthène|Sthene|sn"]
      },
      facts: { "Kilogram": "Strictly a kilogram is mass; the force is the kilogram-force (about 9.81 N). Everyone on site still says 'kilos' for loads, so it gets Vanity points.", "Sthène": "The force unit of France's old metre–tonne–second system: one sthène pushes one tonne to 1 m/s², which is exactly 1 kN." }
    },
    {
      id: "energy-units",
      category: "Units",
      prompt: "Name a unit of energy or work.",
      strip: [],
      tiers: {
        lowrise: ["Joule|J", "Calorie|cal", "Kilowatt-hour|kWh|Kilowatt hour"],
        vanity: [],
        highrise: ["Kilojoule|kJ", "Kilocalorie|kcal|Food calorie", "British thermal unit|BTU", "Electronvolt|Electron volt|eV", "Megajoule|MJ", "Watt-hour|Watt hour|Wh", "Erg", "Newton-metre|Newton meter|N·m|N-m", "Foot-pound|Foot pound|ft-lb|ft·lbf", "Kilonewton-metre|kN·m|kN-m|kNm|Kilonewton meter"],
        skyscraper: ["Therm", "Ton of TNT|TNT equivalent|Kiloton|Megaton", "Megawatt-hour|MWh", "Gigajoule|GJ", "Horsepower-hour|hp·h|hp-h", "Gigawatt-hour|GWh", "Inch-pound|in-lb", "Terajoule|TJ", "Millijoule", "Watt-second|Ws|Watt second", "Kilogram-metre|kgf·m|kg-m|Kilogram-force metre|Kilogram meter", "Litre-atmosphere|Liter-atmosphere|L·atm|L-atm", "Kip-foot|kip-ft|Kip-inch|kip-in"],
        supertall: ["Tonne of oil equivalent|toe", "Barrel of oil equivalent|BOE", "Quad", "Hartree", "Rydberg", "Petajoule|PJ", "Exajoule|EJ", "Microjoule", "Thermie", "Foot-poundal|ft-pdl"],
        megatall: ["Foe|Bethe"]
      },
      facts: { "Foe": "Short for 'ten to the fifty-one ergs' (10^44 J): astronomers use it to measure the energy of a supernova." }
    },
    {
      id: "volume-units",
      category: "Units",
      prompt: "Name a unit of volume.",
      strip: [],
      tiers: {
        lowrise: ["Litre|Liter|L", "Cubic metre|Cubic meter|m3|cu m|cu.m", "Millilitre|Milliliter|mL|cc|Cubic centimetre|Cubic centimeter|cm3"],
        vanity: [],
        highrise: ["Gallon|gal", "Cubic foot|Cubic feet|ft3|cu ft", "Board foot|Board feet|bd ft|BF", "Cubic yard|yd3|cu yd", "Cubic inch|in3|cu in", "Barrel|bbl", "Fluid ounce|fl oz", "Quart|qt", "Pint|pt", "Cup", "Cubic millimetre|Cubic millimeter|mm3", "Drum|Drums|Oil drum"],
        skyscraper: ["Hectolitre|Hectoliter|hL", "Kilolitre|Kiloliter|kL", "Cord", "Million gallons|MG", "Tablespoon|tbsp", "Teaspoon|tsp", "Bushel", "Cubic decimetre|Cubic decimeter|dm3", "Decilitre|Deciliter|dL", "Centilitre|Centiliter|cL", "Microlitre|Microliter", "Cubic kilometre|Cubic kilometer|km3", "US gallon|Imperial gallon"],
        supertall: ["Stere|Stère", "Gill", "Minim", "Hogshead", "Peck", "Cavan|Kaban", "Ganta|Salop|Gatang", "Chupa", "Acre-inch", "Register ton|Gross register ton|Gross ton"],
        megatall: ["Acre-foot|Acre-feet|Acre foot|ac-ft"]
      },
      facts: { "Acre-foot": "The water that covers one acre one foot deep, about 1,233 m³. Dam and irrigation engineers in the US still size reservoirs in acre-feet." }
    },
    {
      id: "mass-units",
      category: "Units",
      prompt: "Name a unit of mass.",
      strip: [],
      tiers: {
        lowrise: ["Kilogram|kg|Kilo", "Gram|g", "Pound|lb|lbs", "Tonne|Metric ton|t|Ton"],
        vanity: [],
        highrise: ["Milligram|mg", "Ounce|oz", "Slug", "Short ton|US ton", "Long ton|Imperial ton", "Microgram|mcg", "Carat|ct", "Stone|st"],
        skyscraper: ["Grain|gr", "Quintal", "Atomic mass unit|amu|Dalton|Da", "Hundredweight|cwt", "Troy ounce|ozt", "Megagram", "Pennyweight|dwt", "Kilotonne|Kiloton|kt", "Centigram|cg", "Decagram|Dekagram|dag", "Hectogram|hg", "Nanogram|ng", "Sack|Bag of cement|Cement bag"],
        supertall: ["Catty|Kati|Chin", "Tael", "Arroba", "Kip-mass", "Megatonne|Megaton|Mt", "Picogram|pg", "Solar mass", "Earth mass", "Planck mass", "Cavan|Kaban", "Libra|Spanish pound", "Onza"],
        megatall: ["Picul|Pikul|Pico"]
      },
      facts: { "Picul": "A 'shoulder load' of about 63 kg. Philippine sugar output was reported in piculs for generations, and Spanish records wrote it 'pico'." }
    },

    /* =================== NEW SIMPLE PROMPTS =================== */
    {
      id: "cement-types",
      category: "Materials",
      prompt: "Name a type of cement.",
      strip: ["cement"],
      tiers: {
        lowrise: ["Portland|Ordinary Portland|OPC", "White", "Masonry"],
        vanity: ["Rubber cement|Contact cement"],
        highrise: ["Blended|Type IP|Portland pozzolan|Pozzolanic|PPC", "Rapid-hardening|Rapid hardening|High early strength|Type III", "Sulfate-resisting|Sulphate resisting|Type V", "Low-heat|Low heat|Type IV", "Hydraulic", "Type I", "Type II|Moderate sulfate"],
        skyscraper: ["Portland slag|Slag|Type IS|Blast-furnace slag", "Colored|Coloured", "Oil-well|Oil well", "Expansive|Expanding|Shrinkage-compensating", "Quick-setting|Quick setting", "Air-entraining|Air entraining", "Calcium aluminate|High-alumina|High alumina", "Waterproof|Hydrophobic"],
        supertall: ["Geopolymer", "Limestone calcined clay|LC3", "Magnesium oxide|MgO|Sorel", "Natural|Roman"],
        megatall: ["Supersulfated|Supersulphated"]
      },
      source: "NSCP 2015 §402.3 'cementitious materials'; ASTM C150/C595 types",
      facts: { "Supersulfated": "Mostly slag with a pinch of gypsum and almost no clinker, made for concrete in sulfate-rich soils and seawater." }
    },
    {
      id: "soil-types",
      category: "Geotechnical",
      prompt: "Name a type of soil.",
      strip: ["soil"],
      tiers: {
        lowrise: ["Clay", "Sand", "Silt"],
        vanity: ["Quicksand"],
        highrise: ["Gravel", "Loam", "Peat", "Organic", "Topsoil", "Expansive clay|Expansive", "Silty sand|Clayey sand", "Cohesive", "Granular|Cohesionless|Non-cohesive", "Fill|Engineered fill", "Adobe"],
        skyscraper: ["Laterite|Lateritic", "Alluvial|Alluvium", "Residual", "Volcanic|Volcanic ash|Tuff|Ash", "Marl", "Lean clay|CL", "Fat clay|CH", "Well-graded|Well graded", "Poorly graded|Uniformly graded", "Collapsible", "Hardpan"],
        supertall: ["Loess", "Bentonite", "Varved clay|Varved", "Lahar|Lahar deposit", "Muck", "Caliche", "Glacial till|Till", "Dispersive", "Sensitive clay|Quick clay"],
        megatall: ["Guadalupe tuff|Guadalupe formation|Guadalupe"]
      },
      facts: { "Guadalupe tuff": "The volcanic rock under most of Metro Manila's business districts: firm enough that many high-rises sit on it." }
    },
    {
      id: "beam-types",
      category: "Structures",
      prompt: "Name a type of beam (by support or by shape).",
      strip: ["beam"],
      tiers: {
        lowrise: ["Simply supported|Simple", "Cantilever", "Continuous"],
        vanity: ["Hammer beam|Hammerbeam"],
        highrise: ["Fixed|Fixed-end|Fixed-fixed|Built-in", "Overhanging|Overhang", "Propped cantilever|Propped", "T-beam|Tee", "L-beam|Spandrel", "I-beam|Wide flange", "Composite", "Doubly reinforced", "Singly reinforced", "Lintel", "Tie beam|Tie", "Grade beam"],
        skyscraper: ["Box girder|Box", "Deep beam", "Transfer", "Ring|Bond beam|Ring beam", "Curved", "Haunched|Tapered", "Coupling", "Edge|Perimeter", "Plinth", "Flitch|Flitch plate"],
        supertall: ["Castellated", "Cellular", "Vierendeel", "Stub girder", "Spline"],
        megatall: ["Gerber|Gerber beam|Hinged cantilever"]
      },
      facts: { "Gerber": "A continuous beam with deliberate hinges placed near the points of zero moment, so it behaves like a chain of simple beams. Heinrich Gerber patented it in 1866." }
    },
    {
      id: "support-types",
      category: "Mechanics",
      prompt: "Name a type of support or connection used in structural analysis.",
      strip: ["support", "connection", "joint"],
      tiers: {
        lowrise: ["Pin|Pinned|Hinge|Hinged", "Roller", "Fixed"],
        vanity: [],
        highrise: ["Rocker", "Rigid|Moment|Moment connection", "Simple|Shear connection", "Link|Two-force member|Cable", "Internal hinge", "Elastic|Spring", "Smooth surface|Smooth"],
        skyscraper: ["Guided|Slider|Sliding", "Ball and socket|Ball-and-socket|Spherical", "Bearing|Elastomeric bearing|Pot bearing", "Partially restrained|Semi-rigid|PR", "Expansion rocker", "Expansion roller", "Collar|Collar on smooth shaft"],
        supertall: ["Journal bearing", "Thrust bearing", "Fixed-guided"],
        megatall: ["Rocker-roller|Pendulum"]
      },
      source: "Statics convention; NSCP 2015 Ch5 glossary (simple, moment, partially restrained connection; expansion rocker/roller)",
      facts: { "Rocker-roller": "Old steel bridges sit on curved rockers so the girder can grow and shrink with temperature without pushing on its piers." }
    },
    {
      id: "stress-types",
      category: "Mechanics",
      prompt: "Name a type of stress, strain or internal force.",
      strip: ["stress", "force"],
      tiers: {
        lowrise: ["Tensile|Tension", "Compressive|Compression", "Shear"],
        vanity: [],
        highrise: ["Bending|Flexural|Moment|Bending moment", "Torsional|Torsion|Torque", "Bearing", "Axial|Normal", "Thermal", "Principal", "Hoop|Circumferential", "Residual", "Allowable"],
        skyscraper: ["Longitudinal", "Radial", "Von Mises|Von Mises stress", "Yield", "Ultimate", "Proof", "Combined", "Punching|Punching shear", "Horizontal shear", "Prestress|Prestressing"],
        supertall: ["Octahedral", "Deviatoric", "Hydrostatic|Volumetric", "Effective stress|Terzaghi", "Fatigue", "Contact|Hertzian"],
        megatall: ["Warping"]
      },
      facts: { "Warping": "When an open section like a channel twists, its cross-section stops staying flat: restraining that warping creates extra normal stresses." }
    },
    {
      id: "material-properties",
      category: "Mechanics",
      prompt: "Name a mechanical property of a construction material.",
      strip: ["property"],
      tiers: {
        lowrise: ["Strength", "Elasticity|Elastic", "Ductility|Ductile"],
        vanity: [],
        highrise: ["Toughness", "Hardness", "Stiffness", "Brittleness|Brittle", "Plasticity|Plastic", "Malleability", "Modulus of elasticity|Young's modulus|Elastic modulus|E", "Yield strength|Yield point|Yield stress", "Tensile strength|Ultimate strength", "Density|Unit weight"],
        skyscraper: ["Resilience", "Creep", "Fatigue strength|Endurance limit|Fatigue", "Poisson's ratio|Poissons ratio", "Shear modulus|Modulus of rigidity|G", "Percent elongation|Elongation", "Notch toughness", "Durability", "Workability", "Modulus of rupture"],
        supertall: ["Bulk modulus", "Strain hardening", "Proof stress", "Damping", "Anisotropy|Anisotropic"],
        megatall: ["Bauschinger effect|Bauschinger"]
      },
      facts: { "Bauschinger effect": "Stretch steel past yield and it gets weaker in compression afterwards. It matters for earthquake-loaded braces that cycle back and forth." }
    },
    {
      id: "survey-types",
      category: "Surveying",
      prompt: "Name a type of survey.",
      strip: ["survey", "surveying"],
      tiers: {
        lowrise: ["Land", "Topographic|Topo", "Plane"],
        vanity: [],
        highrise: ["Geodetic", "Cadastral|Property|Boundary", "Route", "Hydrographic", "Construction|Layout|Stakeout", "Aerial|Photogrammetric|Drone", "Leveling|Levelling", "Traverse|Traversing", "As-built|As built", "Geological|Geotechnical"],
        skyscraper: ["Mine|Mining", "Engineering", "Control", "Reconnaissance", "Profile", "Cross-section|Cross section", "Stadia", "Triangulation", "Chain|Tape"],
        supertall: ["Trilateration", "Astronomical", "Deformation|Monitoring", "Bathymetric", "Gravimetric"],
        megatall: ["Plane table"]
      },
      facts: { "Plane table": "The map is drawn in the field on a board on a tripod, sighting each point and drawing it as you go." }
    },
    {
      id: "pavement-types",
      category: "Transportation",
      prompt: "Name a type of road pavement or surface.",
      strip: ["pavement", "road", "surface"],
      tiers: {
        lowrise: ["Asphalt|Bituminous|Blacktop", "Concrete|PCCP|Portland cement concrete", "Gravel"],
        vanity: [],
        highrise: ["Flexible", "Rigid", "Composite", "Cobblestone|Cobble", "Paver|Pavers|Paving blocks|Interlocking", "Earth|Dirt|Unpaved", "Hot mix asphalt|HMA", "Jointed plain concrete|JPCP|Jointed"],
        skyscraper: ["Continuously reinforced|CRCP", "Porous asphalt|Permeable|Pervious|Pervious concrete|Porous concrete|Permeable pavers", "Macadam|Water-bound macadam", "Chip seal|Surface treatment|Seal coat", "Brick", "Cold mix asphalt|Cold mix", "Overlay"],
        supertall: ["Tarmacadam|Tarmac", "Stone mastic asphalt|SMA", "Prestressed", "Roller-compacted|RCC", "Slurry seal"],
        megatall: ["Corduroy"]
      },
      facts: { "Corduroy": "A road of logs laid side by side across swampy ground, so named because it looks like corduroy cloth." }
    },
    {
      id: "ce-software",
      category: "Practice",
      prompt: "Name a software tool used by civil engineers.",
      strip: ["software"],
      tiers: {
        lowrise: ["AutoCAD", "Excel|Microsoft Excel", "SketchUp|Sketch Up"],
        vanity: [],
        highrise: ["ETABS", "STAAD|STAAD.Pro|STAAD Pro", "SAP2000|SAP", "Revit", "Civil 3D|AutoCAD Civil 3D", "MATLAB", "SAFE", "Primavera|P6", "MS Project|Microsoft Project", "Tekla|Tekla Structures"],
        skyscraper: ["MIDAS|MIDAS Civil|MIDAS Gen", "Robot|Robot Structural Analysis", "Navisworks", "HEC-RAS|HECRAS", "Plaxis", "ArcGIS|QGIS|GIS", "RISA", "SAP Bridge|CSiBridge", "GeoStudio|SLOPE/W", "Mathcad", "Python"],
        supertall: ["OpenSees", "ABAQUS", "ANSYS", "SWMM|EPA SWMM", "EPANET", "Synchro", "Prokon", "LUSAS", "SeismoStruct"],
        megatall: ["Grasshopper"]
      },
      facts: { "Grasshopper": "A visual scripting tool inside Rhino: engineers wire boxes together to generate whole structures parametrically." }
    },

    {
      id: "civil-engineers",
      category: "People",
      prompt: "Name a famous civil or structural engineer, or a well-known CE textbook author.",
      strip: [],
      tiers: {
        lowrise: ["Gustave Eiffel|Eiffel", "Isambard Kingdom Brunel|Brunel|IK Brunel|Isambard Brunel"],
        vanity: ["Emily Warren Roebling|Emily Roebling"],
        highrise: ["John Roebling|John A. Roebling|Roebling", "Washington Roebling", "Karl Terzaghi|Terzaghi", "Hardy Cross|Cross", "Fazlur Rahman Khan|Fazlur Khan|FR Khan", "Thomas Telford|Telford", "John Smeaton|Smeaton", "Joseph Strauss|Strauss", "R. C. Hibbeler|RC Hibbeler|Russell C. Hibbeler|Russell Hibbeler|Hibbeler", "DIT Gillesania|D.I.T. Gillesania|Diego Inocencio Tapang Gillesania|Gillesania", "Venancio Besavilla|Besavilla|Venancio I. Besavilla Jr.", "Stephen Timoshenko|Timoshenko"],
        skyscraper: ["Ove Arup|Arup", "Othmar Ammann|Ammann", "Santiago Calatrava|Calatrava", "Pier Luigi Nervi|Nervi", "Imhotep", "M. Visvesvaraya|Visvesvaraya", "Joseph Bazalgette|Bazalgette", "Leslie Robertson", "William Le Baron Jenney|Le Baron Jenney", "Benjamin Baker", "Arthur Casagrande|Casagrande", "Ralph Peck|Peck"],
        supertall: ["Eugène Freyssinet|Eugene Freyssinet|Freyssinet", "Félix Candela|Felix Candela|Candela", "Heinz Isler|Isler", "Fritz Leonhardt|Leonhardt", "Christian Menn|Menn", "Jörg Schlaich|Jorg Schlaich|Schlaich", "Peter Rice", "William Mulholland|Mulholland"],
        megatall: ["Robert Maillart|Maillart"]
      },
      facts: { "Robert Maillart": "The Swiss engineer whose thin reinforced-concrete arches, like the Salginatobel Bridge (1930), showed concrete could be light and elegant." }
    },
    {
      id: "named-formulas",
      category: "Mechanics",
      prompt: "Name a person whose name is on a CE formula, law, method or theory.",
      strip: ["formula", "law", "method", "theory", "equation", "principle"],
      tiers: {
        lowrise: ["Hooke|Hooke's", "Newton|Newton's", "Bernoulli|Bernoulli's", "Pascal|Pascal's"],
        vanity: ["Archimedes|Archimedes'"],
        highrise: ["Euler|Euler's", "Mohr|Mohr's|Mohr's circle", "Young|Young's|Young's modulus", "Poisson|Poisson's|Poisson's ratio", "Darcy|Darcy's|Darcy-Weisbach", "Manning|Manning's", "Hardy Cross|Cross", "Terzaghi|Terzaghi's", "Castigliano|Castigliano's", "Coulomb|Coulomb's", "Rankine|Rankine's", "Reynolds|Reynolds number", "Hazen-Williams|Hazen Williams|Hazen"],
        skyscraper: ["Macaulay|Macaulay's", "Clapeyron|Three-moment|Three moment", "Maxwell|Maxwell's|Maxwell-Betti|Betti", "Navier|Navier's", "Chezy|Chézy", "Froude|Froude number", "Torricelli|Torricelli's", "Boussinesq|Boussinesq's", "Proctor", "Atterberg", "Casagrande", "Stokes|Stokes'", "Simpson|Simpson's|Simpson's rule", "Lamé|Lame", "Saint-Venant|St Venant|Saint Venant", "Mononobe-Okabe|Mononobe Okabe"],
        supertall: ["Westergaard|Westergaard's", "Meyerhof|Meyerhof's", "Skempton|Skempton's", "Vesic|Vesić", "Thiessen|Thiessen polygon", "Francis|Francis formula", "Kutter|Ganguillet-Kutter", "Bazin|Bazin's", "Muller-Breslau|Müller-Breslau|Muller Breslau", "Hankinson|Hankinson's", "Kuichling|Rational formula"],
        megatall: ["Whitney|Whitney stress block|Whitney's"]
      },
      facts: { "Whitney": "Charles Whitney's 1937 rectangular stress block replaced the curved concrete stress diagram with a simple 0.85f'c rectangle. NSCP §422 still uses it." }
    },
    /* =================== PHILIPPINE PROMPTS =================== */
    {
      id: "ph-roads",
      category: "Philippines",
      prompt: "Name an expressway or major highway in the Philippines.",
      strip: ["expressway", "highway", "avenue", "road", "tollway"],
      tiers: {
        lowrise: ["EDSA|Epifanio de los Santos", "NLEX|North Luzon", "SLEX|South Luzon"],
        vanity: ["Maharlika|Pan-Philippine|Pan Philippine|Daang Maharlika"],
        highrise: ["Skyway|Metro Manila Skyway", "SCTEX|Subic–Clark–Tarlac|Subic Clark Tarlac", "TPLEX|Tarlac–Pangasinan–La Union|Tarlac Pangasinan La Union", "CAVITEX|Manila–Cavite|Coastal Road", "CALAX|Cavite–Laguna|Cavite Laguna", "STAR Tollway|STAR|Southern Tagalog Arterial", "NAIAX|NAIA Expressway", "C-5|Circumferential Road 5|C5", "Commonwealth", "Kennon", "Marcos Highway|Marcos"],
        skyscraper: ["MCX|Muntinlupa–Cavite|Muntinlupa Cavite", "CLLEX|Central Luzon Link", "NLEX Connector|Connector", "Roxas Boulevard|Roxas", "Ortigas", "Quirino|Quirino Highway", "MacArthur Highway|MacArthur", "Aguinaldo|Aguinaldo Highway", "Halsema|Halsema Highway|Mountain Province", "Cebu South Coastal|CSCR", "Diversion Road|Davao Diversion"],
        supertall: ["Laguna Lake Highway|C-6|Laguna Lakeshore", "Arterial Road Bypass|Plaridel Bypass", "SLEX TR4|Toll Road 4", "Sumulong", "Marilaque", "Asian Highway 26|AH26"],
        megatall: ["Zigzag Road|Bitukang Manok|Zigzag"]
      },
      facts: { "Zigzag Road": "Quezon province's hairpin-bend stretch of the Maharlika Highway, nicknamed 'Bitukang Manok' (chicken intestine)." }
    },

    /* ================== NSCP 2015 PROMPTS: see QUESTION_BANK_nscp_and_fixes.md ================== */
    {
      id: "nscp-structural-systems",
      category: "NSCP 2015",
      prompt: "Name a structural system for resisting earthquakes or wind, as the NSCP names them.",
      strip: ["system"],
      tiers: {
        lowrise: ["Moment-resisting frame|Moment frame|MRF|Moment resisting frame", "Shear wall|Shear walls", "Braced frame|Braced"],
        vanity: [],
        highrise: ["Dual|Dual system", "Bearing wall|Bearing wall system", "Building frame|Building frame system", "Special moment-resisting frame|SMRF|Special moment frame|SMF", "Ordinary moment-resisting frame|OMRF|Ordinary moment frame|OMF", "Intermediate moment-resisting frame|IMRF|Intermediate moment frame|IMF", "Concentrically braced frame|CBF|Concentrically-braced frame"],
        skyscraper: ["Eccentrically braced frame|EBF", "Special concentrically braced frame|SCBF", "Ordinary braced frame|OBF|Ordinary concentrically braced frame|OCBF", "Buckling-restrained braced frame|BRBF", "Cantilevered column|Cantilevered column system|Cantilever column", "Shear wall-frame interactive|Shear wall frame interaction|SWFI", "Space frame"],
        supertall: ["Special plate shear wall|SPSW|Steel plate shear wall", "Moment-resisting wall frame|MRWF", "Light-frame|Light frame|Light-framed walls", "Inverted pendulum"],
        megatall: ["Special truss moment frame|STMF"]
      },
      source: "NSCP 2015 §202 (Bearing Wall System, Building Frame System, Dual System, Moment-Resisting Frame, Space Frame, etc.); §208 structural system tables; §522–530 (steel SMF, IMF, OMF, STMF, SCBF, OCBF, EBF, BRBF, SPSW)",
      facts: { "Special truss moment frame": "NSCP 2015 §525: a steel frame whose trusses have a 'special segment' at mid-span designed to yield in an earthquake while the rest stays elastic." }
    },
    {
      id: "nscp-seismic-terms",
      category: "NSCP 2015",
      prompt: "Name a term or factor used in NSCP earthquake design.",
      strip: ["factor"],
      tiers: {
        lowrise: ["Base shear|V", "Storey drift|Drift|Story drift", "Seismic zone|Zone|Zone factor|Z"],
        vanity: [],
        highrise: ["Importance factor|I", "Response modification|R|R factor|Response modification coefficient", "Period|Fundamental period|Natural period|T", "Soil profile|Soil profile type|Site class", "Seismic dead load|Seismic weight|W", "Design response spectrum|Response spectrum|Spectrum", "Storey shear|Story shear", "Storey drift ratio|Drift ratio"],
        skyscraper: ["Overstrength|Omega|Ω|Overstrength factor", "Collector|Drag strut", "Seismic source type|Source type", "P-delta|P delta|PΔ", "Orthogonal effects|Orthogonal", "Redundancy|Reliability|Rho|ρ", "Seismic coefficient|Ca|Cv", "Design basis ground motion|Design earthquake", "Lateral-force-resisting system|Lateral force resisting system|LFRS"],
        supertall: ["Torsional amplification|Ax", "Whip|Ft|Top force", "Deflection amplification|Cd", "Accidental torsion|Accidental eccentricity", "Elastic response parameters"],
        megatall: ["Near-source factor|Near-source|Near source|Na|Nv"]
      },
      source: "NSCP 2015 §202 (Base Shear, Design Basis Ground Motion, Design Response Spectrum, Importance Factor, Orthogonal Effects, Overstrength, P∆ Effect, Storey Drift Ratio, Storey Shear); §208.3 symbols (Ca, Cv, Na, Nv, Ft, Ax); Tables 208-2 to 208-5",
      facts: { "Near-source factor": "NSCP 2015 §208: Na and Nv raise the design forces for sites in Seismic Zone 4 that are close to a known active fault, such as the West Valley Fault." }
    },
    {
      id: "nscp-reinforcement",
      category: "NSCP 2015",
      prompt: "Name a type of reinforcement used in concrete.",
      strip: ["reinforcement", "reinforcing", "bar", "bars", "rebar", "steel"],
      tiers: {
        lowrise: ["Deformed|Deformed bar", "Stirrup|Stirrups", "Tie|Ties|Lateral ties"],
        vanity: ["Bamboo"],
        highrise: ["Plain|Plain bar|Round bar", "Spiral|Spirals", "Hoop|Hoops", "Longitudinal|Main bars|Main", "Temperature|Shrinkage|Temperature and shrinkage", "Welded wire|Welded wire fabric|Wire mesh|WWF|Welded wire reinforcement", "Prestressing|Prestressing strand|Strand|Tendon", "Transverse|Shear"],
        skyscraper: ["Crosstie|Cross tie|Crossties", "Seismic hook", "Dowel|Dowels", "Headed deformed bar|Headed bar|Headed", "Bundled|Bundled bars", "Compression", "Supplementary", "Bonded tendon|Bonded", "Unbonded tendon|Unbonded", "Skin|Skin reinforcement"],
        supertall: ["Headed shear stud|Stud rail|Shear stud", "Steel bar mat|Bar mat", "Anchor reinforcement|Anchor", "External tendon|External", "Epoxy-coated|Epoxy coated|Galvanized", "GFRP|FRP|Fiber-reinforced polymer"],
        megatall: ["Shear cap|Shearhead|Shear head"]
      },
      source: "NSCP 2015 §402.3 (Reinforcement: deformed, plain, prestressed, supplementary, anchor; Hoop; Crosstie; Seismic Hook; Spiral Reinforcement; Stirrup; Steel Bar Mat; Headed Deformed Bars; Headed Shear Stud Reinforcement; Tendon bonded/unbonded/external; Shear Cap)",
      facts: { "Shear cap": "NSCP 2015 §402.3: a thickening of a flat slab around a column to resist punching shear. A cousin of the drop panel, but deeper and smaller." }
    },
    {
      id: "nscp-concrete-joints",
      category: "NSCP 2015",
      prompt: "Name a type of joint in concrete construction.",
      strip: ["joint"],
      tiers: {
        lowrise: ["Construction", "Expansion", "Control|Contraction"],
        vanity: ["Cold joint|Cold"],
        highrise: ["Isolation", "Beam-column|Beam column", "Slab-column|Slab column", "Dowelled|Doweled|Dowel", "Keyed|Key", "Sawcut|Saw cut|Sawed"],
        skyscraper: ["Hinge|Hinged", "Butt", "Tooled|Tooled joint", "Waterstop|Water stop", "Seismic|Seismic gap"],
        supertall: ["Lap splice|Splice", "Shear key"],
        megatall: ["Nodal zone|Node"]
      },
      source: "NSCP 2015 §402.3 (Contraction Joint, Isolation Joint, Joint, Nodal Zone, Node), §415 (beam-column and slab-column joints)",
      facts: { "Nodal zone": "NSCP 2015 §402.3: in a strut-and-tie model, the volume of concrete where struts and ties meet and swap forces. It is the 'joint' of an imaginary truss inside the concrete." }
    },
    {
      id: "nscp-steel-failure-modes",
      category: "NSCP 2015",
      prompt: "Name a way a steel member or connection can fail (a limit state).",
      strip: ["failure", "limit", "state"],
      tiers: {
        lowrise: ["Buckling", "Yielding|Yield", "Rupture|Fracture"],
        vanity: [],
        highrise: ["Local buckling", "Lateral-torsional buckling|LTB|Lateral torsional buckling", "Flexural buckling|Euler buckling|Column buckling", "Shear yielding", "Tensile yielding", "Tensile rupture", "Block shear|Block shear rupture", "Bearing|Bolt bearing", "Fatigue", "Bolt shear|Shear rupture"],
        skyscraper: ["Torsional buckling", "Flexural-torsional buckling|Flexural torsional buckling", "Web crippling", "Local yielding|Web local yielding", "Shear buckling|Web shear buckling", "Prying action|Prying", "Slip|Bolt slip", "Distortional buckling", "Brittle fracture"],
        supertall: ["Local crippling", "Web compression buckling", "Flange local bending|Local bending", "Plastification", "Punching shear|Shear yielding (punching)", "Sidewall crippling", "Concrete crushing"],
        megatall: ["Web sidesway buckling|Sidesway buckling|Sidesway web buckling"]
      },
      source: "NSCP 2015 Ch5 glossary (Block Shear Rupture, Buckling, Distortional Buckling, Flexural Buckling, Flexural-Torsional Buckling, Lateral-Torsional Buckling, Local Buckling, Local Crippling, Local Yielding, Prying Action, Shear Buckling, Shear Rupture, Tensile Rupture, Tensile Yielding, Torsional Buckling, Web Crippling, Web Sidesway Buckling), §504–510",
      facts: { "Web sidesway buckling": "NSCP 2015 Ch5: a point load squeezes a beam's web while the loaded flange slips sideways relative to the other one." }
    },
    {
      id: "nscp-steel-connections",
      category: "NSCP 2015",
      prompt: "Name a type of steel connection or bolted joint.",
      strip: ["connection", "joint"],
      tiers: {
        lowrise: ["Bolted|Bolt", "Welded|Weld", "Riveted|Rivet"],
        vanity: [],
        highrise: ["Simple|Shear|Shear tab|Pinned", "Moment|Rigid|Fixed", "Bearing-type|Bearing type|Bearing", "Slip-critical|Slip critical|Friction", "Splice|Column splice|Beam splice", "Gusset plate|Gusset", "Base plate|Column base", "Lap|Lap joint"],
        skyscraper: ["Snug-tightened|Snug tight|Snug-tight", "Pretensioned|Pre-tensioned|Fully tensioned", "Partially restrained|PR|Semi-rigid", "End plate|End-plate", "Seated|Seat angle", "Double angle|Clip angle", "Prequalified|Prequalified connection", "Reduced beam section|RBS|Dogbone"],
        supertall: ["K-connection|K", "T-connection|T", "Y-connection|Y", "Cross-connection|Cross|X-connection", "Gap connection|Gapped", "Overlap connection|Overlapped"],
        megatall: ["Turn-of-nut|Turn of nut"]
      },
      source: "NSCP 2015 Ch5 glossary (Bearing-type, Slip-critical, Snug-tightened Joint, Pretensioned Joint, Simple Connection, Moment Connection, Prequalified Connection, Reduced Beam Section, Lap Joint, Splice, K-/T-/Y-/Cross-Connection, Gap/Overlap Connection, Turn-of-Nut Method); §510, §511",
      facts: { "Turn-of-nut": "NSCP 2015 Ch5: tighten the bolt snug, mark it, then turn the nut a set fraction of a turn. The rotation, not a torque wrench, guarantees the bolt tension." }
    },
    {
      id: "nscp-design-methods",
      category: "NSCP 2015",
      prompt: "Name a structural design or analysis method.",
      strip: ["method", "design", "analysis"],
      tiers: {
        lowrise: ["LRFD|Load and resistance factor|Load and resistance factor design", "ASD|Allowable stress|Allowable strength", "Strength|Ultimate strength|USD"],
        vanity: [],
        highrise: ["Working stress|WSD|Working stress design", "Limit state|Limit states", "Static|Equivalent lateral force|Static force procedure", "Dynamic|Response spectrum|Modal", "Finite element|FEA|FEM", "Plastic|Plastic analysis|Plastic design", "Moment distribution|Hardy Cross"],
        skyscraper: ["Performance-based|Performance based|PBD", "Prescriptive", "Strut-and-tie|Strut and tie|STM", "Time history|Time-history|Response history", "Second-order|Second order|P-delta", "First-order|First order", "Elastic", "Inelastic|Nonlinear", "Pushover", "Slope-deflection|Slope deflection"],
        supertall: ["Effective length method", "Direct strength method|DSM", "Rational engineering analysis|Rational", "Wind tunnel|Wind tunnel procedure", "Alternate design method|Alternate design", "Strain compatibility|Strain compatibility method", "Plastic stress distribution|Plastic stress distribution method"],
        megatall: ["Direct analysis method|DAM|Direct analysis"]
      },
      source: "NSCP 2015 §202 (ASD, LRFD, Strength Design), §207F (wind tunnel procedure), §402.3 (Strut-and-Tie Model, Finite Element Analysis), §423, §429 (Alternate Design Method), Ch5 glossary + App. A-7 (Direct Analysis Method, Direct Strength Method, Effective Length, Performance-based Design, Prescriptive Design, Rational Engineering Analysis)",
      facts: { "Direct analysis method": "NSCP 2015 Ch5 App. A-7: model the frame's imperfections and reduced stiffness directly, and the K-factor tables are no longer needed." }
    },

    /* ---- simple "name a type of …" prompts added after member feedback ---- */
    {
      id: "slab-types",
      category: "Structures",
      prompt: "Name a type of slab.",
      strip: ["slab"],
      tiers: {
        lowrise: ["One-way|One way", "Two-way|Two way", "Flat|Flat slab"],
        vanity: [],
        highrise: ["Flat plate", "Ribbed|Joist|Ribbed slab", "Waffle|Grid", "Hollow core|Hollowcore|Hollow-core", "Slab on grade|Slab-on-grade|Ground|Ground-bearing", "Cantilever", "Composite|Composite deck|Metal deck", "Post-tensioned|PT", "Precast", "Solid", "Suspended|Elevated"],
        skyscraper: ["Drop panel|Flat slab with drop panels", "Beam and slab|Two-way with beams|Slab with beams", "Mat|Raft", "Transfer|Transfer slab", "Sunken", "Pan", "Beam and block|Block and beam|Hollow block", "Lift slab|Lift-slab", "Stepped", "Coffered"],
        supertall: ["Filigree", "Thickened edge|Thickened slab", "Two-way joist", "Slimfloor|Slim floor|Slimdek", "Voided|Voided slab"],
        megatall: ["BubbleDeck|Bubble deck|Bubble"]
      },
      facts: { "BubbleDeck": "Hollow plastic balls replace the concrete in the middle of the slab, where it carries little load, so the slab spans far while weighing much less." }
    },
    {
      id: "column-types",
      category: "Structures",
      prompt: "Name a type of column (by shape, material or behaviour).",
      strip: ["column"],
      tiers: {
        lowrise: ["Short", "Long|Slender", "Tied", "Spiral|Spirally reinforced"],
        vanity: ["Doric", "Ionic", "Corinthian"],
        highrise: ["Composite", "Rectangular|Square", "Circular|Round", "Intermediate", "Steel", "Timber|Wood|Wooden", "Reinforced concrete|RC|Concrete", "Axially loaded|Axial", "Eccentrically loaded|Eccentric", "Biaxial|Biaxially loaded", "Pedestal"],
        skyscraper: ["Encased|Concrete-encased|Encased composite", "Stub", "Braced|Non-sway", "Unbraced|Sway", "Precast", "L-shaped|L-column", "Built-up", "Laced", "Battened", "Tubular|Hollow"],
        supertall: ["Mushroom|Flared", "Tapered", "Cruciform", "Tree|Dendriform|Branching", "Lally|Pipe column", "Wind column|Wind post"],
        megatall: ["Concrete-filled steel tube|CFST|CFT|Concrete filled tube|Concrete-filled tube"]
      },
      facts: { "Concrete-filled steel tube": "The steel tube confines the concrete so it can take far more load, and the concrete stops the thin tube from buckling inward: each material covers the other's weakness." }
    },
    {
      id: "formwork-types",
      category: "Construction",
      prompt: "Name a type of formwork.",
      strip: ["formwork", "form", "forms", "shuttering", "system"],
      tiers: {
        lowrise: ["Timber|Wood|Wooden", "Plywood|Phenolic", "Steel"],
        vanity: ["Bamboo"],
        highrise: ["Aluminum|Aluminium", "Plastic", "Slipform|Slip form|Slip-form|Sliding", "Climbing|Jump|Jumpform|Self-climbing|Climbing formwork", "Table|Flying|Table form|Flying form", "Tunnel", "Column", "Beam", "Slab|Deck", "Wall", "Permanent|Stay-in-place|Lost|Sacrificial"],
        skyscraper: ["Insulated concrete form|ICF", "Fabric", "Waffle|Pan|Dome", "Precast", "Modular|System|Engineered", "Gang|Gang form", "Metal deck|Steel deck|Corrugated deck", "Cardboard tube|Sonotube|Tube"],
        supertall: ["Travelling|Traveling|Traveller|Form traveller", "Form liner|Formliner", "Stripping|Drop-head|Drophead", "Tie-less|Single-sided|One-sided"],
        megatall: ["Inflatable|Pneumatic|Balloon"]
      },
      facts: { "Inflatable": "A balloon is inflated into a dome shape and concrete is placed over it before it sets: Dante Bini's 'Binishell' domes were built this way." }
    },
    {
      id: "water-treatment",
      category: "Water",
      prompt: "Name a process used in water or wastewater treatment.",
      strip: ["process", "treatment"],
      tiers: {
        lowrise: ["Filtration", "Disinfection", "Chlorination", "Sedimentation|Settling"],
        vanity: ["Boiling"],
        highrise: ["Coagulation", "Flocculation", "Aeration", "Screening", "Softening", "UV disinfection|Ultraviolet|UV", "Ozonation|Ozone", "Reverse osmosis|RO", "Desalination", "Distillation", "Activated carbon|Adsorption|Carbon filtration", "Activated sludge"],
        skyscraper: ["Ion exchange", "Fluoridation", "Rapid sand filtration|Rapid sand", "Slow sand filtration|Slow sand", "Clarification", "Membrane filtration|Ultrafiltration|Microfiltration|Nanofiltration", "Neutralization|pH adjustment", "Grit removal|Degritting", "Trickling filter", "Anaerobic digestion|Digestion", "Sludge dewatering|Dewatering"],
        supertall: ["Chloramination", "Dissolved air flotation|DAF", "Electrodialysis", "Lime softening|Lime-soda", "Breakpoint chlorination", "Backwashing|Backwash", "Rapid mixing|Flash mixing|Rapid mix", "Recarbonation", "Oxidation pond|Stabilization pond|Lagoon"],
        megatall: ["Riverbank filtration|Bank filtration"]
      },
      facts: { "Riverbank filtration": "Wells sunk beside a river draw water through the riverbed and banks, so the soil itself filters out much of the dirt and germs before the plant does." }
    },

    /* ============ 2026-11-27 BATCH: careers, industry, codes, site practice ============ */
    {
      id: "ce-jobs",
      category: "Profession",
      prompt: "Name a job or position that a civil engineer can have.",
      strip: ["engineer", "engineering", "job", "position", "officer"],
      tiers: {
        lowrise: ["Structural Engineer|Structural designer", "Site Engineer|Site", "Project Manager|PM", "Project Engineer", "QA/QC Engineer|QA/QC|QAQC|QA QC|Quality control engineer|Quality assurance engineer|QC engineer|QA engineer|Quality engineer|Quality control|Quality assurance"],
        vanity: ["Foreman|Capataz"],
        highrise: ["Design Engineer", "Estimator|Cost estimator|Quantity Surveyor|QS|Quantity engineer", "Planning Engineer|Planner|Scheduler|Planning and scheduling engineer", "Safety Officer|Safety Engineer|Safety practitioner|HSE officer|HSE engineer|Safety and health officer|Safety manager|EHS officer", "Construction Manager", "Geotechnical Engineer|Geotech engineer|Soil engineer", "Transportation Engineer", "Traffic Engineer", "Highway Engineer|Road engineer", "Water Resources Engineer|Hydraulic engineer|Hydraulics engineer", "Environmental Engineer|Sanitary engineer", "Surveyor|Survey engineer|Land surveyor", "Materials Engineer|Material engineer", "Field Engineer", "Resident Engineer", "Professor|Instructor|Teacher|Educator|Lecturer|Faculty|CE instructor", "Contractor|General contractor", "Consultant|Consulting engineer", "CAD Operator|Draftsman|Drafter|CAD drafter|AutoCAD operator|Draftsperson", "Building Inspector|Inspector|Construction inspector", "Project In-Charge|Engineer in charge|PIC", "Office Engineer", "Bridge Engineer"],
        skyscraper: ["BIM Modeler|BIM engineer|BIM coordinator|BIM manager|BIM specialist|Revit modeler", "Building Official|City building official|OBO", "City Engineer|Municipal Engineer|Provincial Engineer|District Engineer|Barangay engineer|Town engineer", "DPWH Engineer|Government engineer|Public works engineer|Public servant", "Cost Engineer|Cost controller|Cost control engineer", "Contracts Engineer|Contracts manager|Contract administrator|Contract specialist", "Procurement Engineer|Purchasing engineer|Procurement officer", "Billing Engineer|Billing officer|Progress billing engineer", "Project Coordinator|Project controls engineer|Project controller|Document controller", "Researcher|Research engineer", "Sales Engineer|Technical sales|Technical sales engineer|Sales representative", "Pavement Engineer", "Railway Engineer|Rail engineer", "Port Engineer|Harbor engineer|Marine engineer|Coastal engineer", "Tunnel Engineer|Tunneling engineer", "Urban Planner|City planner|Environmental planner|Town planner", "Real Estate Developer|Developer|Property developer", "Facility Manager|Property manager|Building administrator|Building manager", "Site Supervisor|Construction supervisor|Supervisor", "Structural Inspector", "Quality Inspector", "Hydrologist", "Seismic Engineer|Earthquake engineer", "Estimating Manager|Chief estimator", "Construction Lawyer|Lawyer|Engineer-lawyer", "Entrepreneur|Business owner|Owner of a construction company|Construction company owner", "Military Engineer|Army engineer|Combat engineer|Engineer Brigade", "Fire Protection Engineer|Fire engineer"],
        supertall: ["Value Engineer|Value engineering manager", "Forensic Engineer|Failure investigator", "Claims Consultant|Claims engineer|Claims manager|Delay analyst", "Commissioning Engineer|Commissioning manager", "Expert Witness", "Peer Reviewer|Structural peer reviewer|Third-party reviewer|Design checker|Checking engineer", "Geomatics Engineer|GIS engineer|GIS specialist|Remote sensing engineer", "Asset Manager|Asset management engineer", "Risk Manager|Risk engineer", "Insurance Engineer|Loss adjuster|Insurance adjuster", "Dam Safety Engineer|Dam engineer", "Offshore Engineer", "Wind Engineer", "Building Envelope Engineer|Facade engineer|Façade engineer", "Sustainability Consultant|Green building consultant|LEED consultant|BERDE assessor", "Owner's Representative|Owners representative|Client representative|Owner's engineer"],
        megatall: ["Arbitrator|Construction arbitrator|CIAC arbitrator|Mediator"]
      },
      facts: {
        "Arbitrator": "Philippine construction disputes go to the Construction Industry Arbitration Commission (CIAC, created by EO 1008 in 1985), and many of its arbitrators are engineers, not lawyers.",
        "Structural Engineer": "In the Philippines, Structural Engineer is a specialty title a civil engineer earns through the PRC Board of Civil Engineering after years of experience."
      }
    },
    {
      id: "ph-construction-companies",
      category: "Industry",
      prompt: "Name a construction company in the Philippines.",
      strip: ["inc", "incorporated", "corporation", "corp", "co", "company", "ltd", "limited", "opc", "construction", "builders", "builder", "contractor", "contractors", "group", "holdings", "philippines", "ph", "and", "of", "development"],
      tiers: {
        lowrise: ["DMCI|D.M. Consunji|DM Consunji|D.M. Consunji Inc.|Consunji|DMCI Homes|DMCI Project Developers|DMCI Holdings", "SMDC|SM Development Corporation|SM Development|SM Development Corp", "EEI|EEI Corporation|EEI Corp", "Megawide|Megawide Construction|Megawide Construction Corporation", "Ayala Land|ALI|Ayala|Ayala Land Inc.", "Megaworld|Megaworld Corporation"],
        vanity: ["DPWH|Department of Public Works and Highways|Public Works"],
        highrise: ["Makati Development Corporation|MDC|Makati Development", "First Balfour|First Balfour Inc.", "F.F. Cruz|FF Cruz|F.F. Cruz & Co.|FF Cruz and Co", "Filinvest|Filinvest Land|FLI|Filinvest Land Inc.", "Robinsons Land|RLC|Robinsons Land Corporation|Robinsons", "Rockwell Land|Rockwell", "Federal Land|Federal Land Inc.", "Century Properties|Century Properties Group|Century", "Vista Land|Vista Land & Lifescapes|Vista Land and Lifescapes|Vistaland", "Camella|Camella Homes", "Alveo|Alveo Land", "Avida|Avida Land", "Amaia|Amaia Land", "SM Prime|SM Prime Holdings", "Sta. Lucia|Sta. Lucia Land|Santa Lucia|Sta Lucia Realty|Sta. Lucia Realty", "San Miguel Corporation|SMC|San Miguel|San Miguel Infrastructure|SMC Infrastructure|San Miguel Holdings", "New San Jose Builders|NSJBI|New San Jose", "Datem|Datem Inc.|DATEM Incorporated", "Monolith|Monolith Construction and Development", "Hilmarc's|Hilmarcs|Hilmarc's Construction", "Cebu Landmasters|CLI", "DoubleDragon|Double Dragon|DoubleDragon Properties", "Shang Properties|Shangri-La|Shang", "Holcim|Holcim Philippines", "Republic Cement|Republic Cement & Building Materials|Republic", "Eagle Cement|Eagle", "SteelAsia|Steel Asia|SteelAsia Manufacturing", "Wilcon|Wilcon Depot", "Aboitiz Construction|Aboitiz", "Arthaland|ArthaLand Corporation", "Empire East|Empire East Land", "Lumina Homes|Lumina", "Brittany|Brittany Corporation", "Crown Asia|Crown Asia Properties", "PHirst|PHirst Park Homes|Phirst Park", "Moldex|Moldex Realty", "Torre Lorenzo|Torre Lorenzo Development", "Cityland|Cityland Development", "Pro-Friends|Profriends|Property Company of Friends", "Ortigas Land|Ortigas & Company|Ortigas", "Alphaland|Alphaland Corporation", "Eton Properties|Eton", "Amberland|Amberland Corporation"],
        skyscraper: ["D.M. Wenceslao|DM Wenceslao|DMW|D.M. Wenceslao & Associates", "AG&P|Atlantic Gulf & Pacific|Atlantic Gulf and Pacific|AGP", "BF Corporation|BF Corp|BFC", "C.M. Pancho|CM Pancho|CM Pancho Construction", "Sta. Clara International|Sta. Clara|Santa Clara International|Sta Clara", "MIESCOR|MIESCOR Builders|Meralco Industrial Engineering Services", "JGC Philippines|JGC", "Shimizu|Shimizu Philippine Contractors|Shimizu Corporation", "Taisei|Taisei Philippine Construction|Taisei Corporation", "Obayashi|Obayashi Corporation", "Kajima|Kajima Philippines", "Takenaka|Takenaka Corporation", "Sumitomo Mitsui Construction|SMCC|Sumitomo Mitsui|Sumitomo", "Nishimatsu|Nishimatsu Construction", "Hyundai Engineering & Construction|Hyundai E&C|Hyundai Engineering and Construction|Hyundai", "Daewoo E&C|Daewoo Engineering & Construction|Daewoo", "Acciona|Acciona Construction", "China Harbour|China Harbour Engineering|CHEC|China Harbour Engineering Company", "CSCEC|China State Construction Engineering|China State Construction|CSCEC Philippines", "CRBC|China Road and Bridge Corporation|China Road and Bridge|China Road & Bridge", "Leighton|Leighton Contractors|Leighton Asia", "Fluor|Fluor Daniel|Fluor Daniel Philippines", "Bauer Foundations|Bauer|Bauer Foundations Philippines", "Keller|Keller Foundations", "R.D. Policarpio|RD Policarpio|R.D. Policarpio & Co.", "J.E. Manalo|JE Manalo|J.E. Manalo & Co.", "Primary Structures|Primary Structures Corporation|PSC", "DDT Konstract|DDT", "Monocrete|Monocrete Construction", "Sunwest|Sunwest Inc.|Sunwest Construction", "Ulticon|Ulticon Builders", "Phesco|Phesco Inc.|Phesco Incorporated", "New Kanlaon|New Kanlaon Construction", "Sta. Elena|Sta. Elena Construction|Santa Elena Construction|Sta Elena", "MGS Construction|MGS", "CE Construction|C-E Construction|C-E Construction Corporation", "Concreat|Concreat Holdings|CEMEX|Cemex Philippines|APO Cement|Apo Cement Corporation|Solid Cement", "Capitol Steel|Capitol Steel Corporation", "Pag-asa Steel|Pag-asa Steel Works|Pagasa Steel", "Union Galvasteel|Union Galvasteel Corporation", "Taiheiyo Cement|Taiheiyo", "Northern Cement|Northern Cement Corporation", "Goodfound Cement|Goodfound", "Philcement|Philcement Corporation", "Sika|Sika Philippines", "Hilti|Hilti Philippines", "Jackbilt|Jackbilt Industries", "Starken|Starken Philippines", "AboitizLand|Aboitiz Land Inc.", "Ayala Land Premier|ALP", "Landco Pacific|Landco", "Suntrust Properties|Suntrust", "Fiesta Communities", "PA Properties|P.A. Properties|P.A. Alvarez Properties", "Primary Homes|Primary Group of Builders|Primary Group", "Italpinas|Italpinas Development|IDC", "Federal Land NRE|Federal Land Nomura", "San Miguel Properties", "PHINMA Properties|PHINMA Property Holdings|PHINMA", "Global-Estate Resorts|GERI|Global Estate Resorts", "Anchor Land|Anchor Land Holdings", "Greenfield Development|Greenfield", "Cathay Land", "Pueblo de Oro|Pueblo de Oro Development", "State Properties|State Properties Corporation", "Vista Residences", "BellaVita Land|BellaVita|Bella Vita", "Data Land|Data Land Inc.", "Asian Land|Asian Land Strategies", "A Brown Company|ABCI|A Brown", "Grand Taipan|Grand Taipan Land Development", "AECOM|AECOM Philippines", "Arup|Arup Philippines|Ove Arup", "Meinhardt|Meinhardt Philippines", "Jacobs|Jacobs Engineering", "WSP|WSP Philippines", "Arcadis|Arcadis Philippines", "SMEC|SMEC Philippines", "Nippon Koei", "Systra|SYSTRA Philippines", "AtkinsRéalis|Atkins|AtkinsRealis|SNC-Lavalin", "GHD", "Oriental Consultants|Oriental Consultants Global", "Kokusai Kogyo", "TCGI Engineers|TCGI", "DCCD Engineering|DCCD", "Aromin & Sy|ASA|Aromin and Sy|Aromin & Sy + Associates", "Sy^2 + Associates|Sy2|Sy Squared|Sy^2", "Design Coordinates|Design Coordinates Inc.|DCI", "EDCOP|Engineering and Development Corporation of the Philippines", "Woodfields Consultants|Woodfields", "Urban Integrated Consultants|UICI", "Philippine Geoanalytics|PGI|Philippine Geoanalytics Inc.", "Pertconsult|Pertconsult International", "ESCA|ESCA Inc.|ESCA Engineering", "Planate Management Group|Planate", "Turner & Townsend|Turner and Townsend", "JLL|JLL Philippines|Jones Lang LaSalle", "8990 Holdings|Deca Homes|8990", "Cathay Pacific Steel|CAPASCO", "Puyat Steel|Puyat", "Citiglobal Realty|Citiglobal", "SOC Land|SOC Land Development", "Duraville|Duraville Realty"],
        supertall: ["Kimwa|Kimwa Construction|Kimwa Construction and Development", "Readycon|Readycon Trading and Construction|Readycon Trading & Construction", "Tokwing|Tokwing Construction", "M.E. Sicat|ME Sicat|M.E. Sicat Construction", "R.R. Encabo|RR Encabo|R.R. Encabo Constructors", "Vicente T. Lao|Vicente T. Lao Construction|VTL|VT Lao", "Equi-Parco|Equi-Parco Construction|Equiparco", "A.M. Oreta|AM Oreta|A.M. Oreta & Co.", "Amcon|Amcon and Company|Amcon & Company", "Taylormade|Taylormade Construction and Realty", "Scheirman|Scheirman Construction Consolidated|SCCI", "E.M. Cuerpo|EM Cuerpo|E.M. Cuerpo Inc.", "1722 Builders|1722 Builders & Trading", "Sagada Construction|Sagada Construction Development", "Homeworld|Homeworld Construction", "L.R. Tiqui|LR Tiqui|L.R. Tiqui Builders", "Petra Cement|Petra", "Borland Development|Borland", "D.A. Abcede & Associates|DA Abcede|D.A. Abcede", "Hausland|Hausland Development", "Wee Community Developers|Wee Community", "Nuvoland|Nuvoland Philippines", "Lhoopa", "Axeia|Axeia Development", "Goshen Land|Goshen Land Capital", "Pozzolanic Philippines|Pozzolanic", "JFE Techno Manila|JFE", "AMH Philippines|AMH"],
        megatall: ["PNCC|Philippine National Construction Corporation|CDCP"]
      },
      facts: {
        "PNCC": "The state-owned PNCC began in 1966 as CDCP, the contractor behind the original North and South Luzon Expressways.",
        "DMCI": "Founded in 1954 by engineer David M. Consunji, DMCI is one of the oldest Filipino-owned construction firms still run by its founding family."
      }
    },
    {
      id: "ce-organizations",
      category: "Profession",
      prompt: "Name an organization associated with civil engineering.",
      strip: ["organization", "organisation", "association", "society", "of", "the", "inc"],
      tiers: {
        lowrise: ["PICE|Philippine Institute of Civil Engineers", "ASCE|American Society of Civil Engineers", "DPWH|Department of Public Works and Highways"],
        vanity: ["UAP|United Architects of the Philippines"],
        highrise: ["ASEP|Association of Structural Engineers of the Philippines", "AISC|American Institute of Steel Construction", "ASTM|ASTM International|American Society for Testing and Materials", "AASHTO|American Association of State Highway and Transportation Officials", "PRC|Professional Regulation Commission", "ICE|Institution of Civil Engineers", "IStructE|Institution of Structural Engineers", "ICC|International Code Council", "ISO|International Organization for Standardization", "PHIVOLCS|Philippine Institute of Volcanology and Seismology", "PAGASA|Philippine Atmospheric Geophysical and Astronomical Services Administration", "NSPE|National Society of Professional Engineers", "DOTr|Department of Transportation|DOTC", "MMDA|Metropolitan Manila Development Authority", "Board of Civil Engineering|BoCE|BOCE|PRC Board of Civil Engineering"],
        skyscraper: ["PCA|Portland Cement Association", "PCI|Precast/Prestressed Concrete Institute|Prestressed Concrete Institute", "PTI|Post-Tensioning Institute", "AWS|American Welding Society", "EERI|Earthquake Engineering Research Institute", "SEAOC|Structural Engineers Association of California", "NCSEA|National Council of Structural Engineers Associations", "FIDIC|International Federation of Consulting Engineers", "CIAP|Construction Industry Authority of the Philippines", "PCAB|Philippine Contractors Accreditation Board", "PCA Philippines|Philippine Constructors Association|PCA Phil", "CIAC|Construction Industry Arbitration Commission", "NWRB|National Water Resources Board", "MWSS|Metropolitan Waterworks and Sewerage System", "LWUA|Local Water Utilities Administration", "NIA|National Irrigation Administration", "BCDA|Bases Conversion and Development Authority", "NHA|National Housing Authority", "DHSUD|Department of Human Settlements and Urban Development", "DOST|Department of Science and Technology", "BPS|Bureau of Philippine Standards", "NEDA|National Economic and Development Authority|DEPDev", "World Bank", "ADB|Asian Development Bank", "JICA|Japan International Cooperation Agency", "USACE|US Army Corps of Engineers|Army Corps of Engineers|Corps of Engineers", "IEEE|Institute of Electrical and Electronics Engineers", "ASME|American Society of Mechanical Engineers", "JSCE|Japan Society of Civil Engineers", "CSCE|Canadian Society for Civil Engineering", "Engineers Australia", "IES|Institution of Engineers Singapore", "PSME|Philippine Society of Mechanical Engineers", "IIEE|Institute of Integrated Electrical Engineers", "PIChE|Philippine Institute of Chemical Engineers", "GEP|Geodetic Engineers of the Philippines", "PSSE|Philippine Society of Sanitary Engineers", "ITE|Institute of Transportation Engineers", "TRB|Transportation Research Board", "PGBC|Philippine Green Building Council|BERDE", "USGBC|US Green Building Council|LEED", "CTBUH|Council on Tall Buildings and Urban Habitat", "AIA|American Institute of Architects", "Habitat for Humanity|Habitat", "Engineers Without Borders|EWB", "NAMRIA|National Mapping and Resource Information Authority", "MGB|Mines and Geosciences Bureau"],
        supertall: ["ISSMGE|International Society for Soil Mechanics and Geotechnical Engineering", "IABSE|International Association for Bridge and Structural Engineering", "fib|International Federation for Structural Concrete|Fédération internationale du béton", "RILEM", "ICOLD|International Commission on Large Dams", "PIANC|World Association for Waterborne Transport Infrastructure", "ITA|International Tunnelling Association|ITA-AITES", "IAEE|International Association for Earthquake Engineering", "ACEC|American Council of Engineering Companies", "WFEO|World Federation of Engineering Organizations", "AFEO|ASEAN Federation of Engineering Organisations", "ASEAN Engineer|ACPECC|ASEAN Chartered Professional Engineer Coordinating Committee", "PTC|Philippine Technological Council", "CEN|European Committee for Standardization", "BSI|British Standards Institution", "ANSI|American National Standards Institute", "NIST|National Institute of Standards and Technology", "FEMA|Federal Emergency Management Agency", "FHWA|Federal Highway Administration", "ARRB", "CRSI|Concrete Reinforcing Steel Institute", "NRMCA|National Ready Mixed Concrete Association", "ACPA|American Concrete Pavement Association", "Asphalt Institute", "AREMA|American Railway Engineering and Maintenance-of-Way Association", "AWWA|American Water Works Association", "WEF|Water Environment Federation", "Concrete Society", "SEI|Structural Engineering Institute", "GI|Geo-Institute", "ICRI|International Concrete Repair Institute", "PEO|Professional Engineers Ontario", "NCEES|National Council of Examiners for Engineering and Surveying", "ABET", "AIJ|Architectural Institute of Japan"],
        megatall: ["American Concrete Institute|ACI|ACIP|American Concrete Institute Philippines|ACI Philippines|ACI Philippine Chapter|ACI TIP|ACI TIP QC|ACI TIP-QC|ACI TIP QC Student Chapter|ACI Student Chapter|ACI-TIP"]
      },
      facts: {
        "American Concrete Institute": "Founded in 1904, ACI writes ACI 318, the concrete code that NSCP Chapter 4 is built on. Its Philippine chapter (ACIP) and student chapters like ACI TIP-QC carry it here.",
        "PICE": "PICE is the accredited professional organization of civil engineers in the Philippines, formed in 1973."
      }
    },
    {
      id: "rebar-sizes",
      category: "Materials",
      prompt: "Name a diameter of steel rebar used in construction.",
      numeric: true,
      strip: ["mm", "millimeter", "millimetre", "millimeters", "millimetres", "inch", "inches", "in", "diameter", "dia", "db", "rebar", "rebars", "bar", "bars", "size", "steel", "reinforcing", "deformed", "reinforcement", "of", "phi", "o", "x"],
      tiers: {
        lowrise: [
          "10 mm (3/8″)|10 mm|10|9.5 mm|9.5|3/8|3/8 in|#3|#10|0.375 in",
          "12 mm (1/2″)|12 mm|12|13 mm|13|12.7 mm|12.7|1/2|1/2 in|#4|#13|0.5 in|half inch",
          "16 mm (5/8″)|16 mm|16|15.9 mm|15.9|15 mm|15|5/8|5/8 in|#5|#16|0.625 in"
        ],
        vanity: [],
        highrise: [
          "20 mm (3/4″)|20 mm|20|19 mm|19|19.1 mm|3/4|3/4 in|#6|#19|#20|0.75 in",
          "25 mm (1″)|25 mm|25|25.4 mm|25.4|1|1 in|#8|#25|one inch"
        ],
        skyscraper: [
          "28 mm (1 1/8″)|28 mm|28|28.6 mm|29 mm|29|1 1/8|1 1/8 in|1.125 in|#9|#28|#29",
          "32 mm (1 1/4″)|32 mm|32|31.8 mm|1 1/4|1 1/4 in|1.25 in|#32",
          "22 mm (7/8″)|22 mm|22|22.2 mm|7/8|7/8 in|#7|#22|0.875 in",
          "8 mm (5/16″)|8 mm|8|7.9 mm|5/16|5/16 in",
          "6 mm (1/4″)|6 mm|6|6.35 mm|1/4|1/4 in|#2|0.25 in"
        ],
        supertall: [
          "36 mm (1 3/8″)|36 mm|36|35.8 mm|1 3/8|1 3/8 in|1.375 in|#11|#36",
          "40 mm (1 1/2″)|40 mm|40|38 mm|38|1 1/2|1 1/2 in|#40",
          "43 mm (1 3/4″)|43 mm|43|1 3/4|1 3/4 in|1.75 in|#14|#43",
          "50 mm (2″)|50 mm|50|51 mm|2|2 in|#50",
          "14 mm|14",
          "18 mm|18"
        ],
        megatall: ["57 mm (2 1/4″)|57 mm|57|57.3 mm|2 1/4|2 1/4 in|2.25 in|#18|#57"]
      },
      facts: {
        "57 mm (2 1/4″)": "The #18 bar is the largest standard size in ASTM A615 and weighs about 20 kg per metre. You will mostly meet it in huge transfer girders and mat foundations.",
        "10 mm (3/8″)": "10 mm, 12 mm and 16 mm bars do most of the work in Philippine houses: slabs, ties and stirrups, and small beams and columns."
      }
    },
    {
      id: "frc-fibers",
      category: "Materials",
      prompt: "Name a fiber used in fiber-reinforced concrete.",
      strip: ["fiber", "fibers", "fibre", "fibres", "reinforced", "concrete", "frc"],
      tiers: {
        lowrise: ["Steel|Steel fiber|Steel fibre", "Glass|Glass fiber|Fiberglass|Fibreglass|E-glass", "Polypropylene|PP|PP fiber"],
        vanity: ["Asbestos"],
        highrise: ["Synthetic|Synthetic fiber|Plastic|Plastic fiber", "Macrosynthetic|Macro synthetic|Macrosynthetic polypropylene|Macro polypropylene|Macro-synthetic", "Microsynthetic|Micro synthetic|Microsynthetic polypropylene|Micro polypropylene|Monofilament polypropylene|Fibrillated polypropylene|Fibrillated", "Alkali-resistant glass|AR glass|AR-glass|Alkali resistant glass|AR glass fiber|Zirconia glass", "Carbon|Carbon fiber|CFRP", "Nylon|Polyamide", "Natural|Natural fiber|Plant fiber", "Coconut|Coir|Coco coir|Coconut coir|Coconut fiber|Coconut husk|Bunot", "Bamboo|Bamboo fiber"],
        skyscraper: ["Polyester|PET|Recycled PET|PET bottle", "Polyethylene|HDPE|PE|UHMWPE|High-density polyethylene", "PVA|Polyvinyl alcohol", "Basalt|Basalt fiber", "Aramid|Kevlar", "Hooked-end steel|Hooked steel|Hooked end|Hooked|Dramix", "Crimped steel|Crimped|Wavy steel", "Straight steel|Straight", "Cellulose|Wood fiber|Wood pulp|Wood|Paper", "Sisal", "Jute", "Hemp", "Banana|Banana fiber|Banana stem", "Sugarcane bagasse|Bagasse", "Recycled steel|Recycled tire steel|Tire steel|Tyre steel", "Stainless steel", "Acrylic", "Rice straw|Straw", "Hair|Horsehair|Human hair|Animal hair|Horse hair"],
        supertall: ["Kenaf", "Pineapple|Piña|Pina|Pineapple leaf|PALF", "Water hyacinth", "Amorphous metal|Fibraflex|Amorphous steel|Metallic glass", "Wollastonite", "Carbon nanotube|CNT|Nanotubes", "Polyolefin", "Flax", "Kapok", "Oil palm|Palm|Empty fruit bunch", "Twisted steel|Twisted|Helix", "Double-hooked|5D|4D|Double hooked steel", "Ramie", "Rattan", "Recycled carpet|Carpet"],
        megatall: ["Abaca|Abacá|Manila hemp"]
      },
      facts: {
        "Abaca": "Abaca, or Manila hemp, comes from a banana relative native to the Philippines, and the country grows most of the world's supply. Its long, strong fibres are being tested in concrete.",
        "Asbestos": "Asbestos-cement sheets were common for a century, but the fibres cause lung disease, so they are banned or tightly restricted almost everywhere now."
      }
    },
    {
      id: "aggregate-types",
      category: "Materials",
      prompt: "Name an aggregate used in concrete.",
      strip: ["aggregate", "aggregates", "concrete", "agg"],
      tiers: {
        lowrise: ["Sand|Buhangin", "Gravel|Graba", "Crushed stone|Crushed rock|Crushed gravel|Crushed aggregate|Crushed", "Fine aggregate|Fine|FA", "Coarse aggregate|Coarse|CA"],
        vanity: ["Moon dust|Lunar regolith|Regolith|Mars soil"],
        highrise: ["River sand|Washed sand|Sharp sand|Natural sand", "Pea gravel|Pea", "Limestone", "Granite", "Basalt", "Recycled|Recycled aggregate|Recycled concrete|RCA|Recycled concrete aggregate", "Lightweight|Lightweight aggregate|LWA", "Manufactured sand|M-sand|Crushed sand|Stone dust|Quarry dust|Rock dust|Screenings", "3/4 gravel|3/4|G1|Three-fourths gravel|1/2 gravel|G2|3/8 gravel", "Normal-weight|Normalweight|Normal weight", "Pumice", "Slag|Blast-furnace slag|Air-cooled slag|Furnace slag", "Sea sand|Beach sand|Marine sand"],
        skyscraper: ["Expanded clay|LECA|Clay pellets|Light expanded clay aggregate", "Expanded shale|Expanded slate", "Scoria|Volcanic cinder|Cinder|Cinders", "Perlite|Expanded perlite", "Vermiculite|Exfoliated vermiculite", "Heavyweight|Heavyweight aggregate|High-density", "Steel slag|EAF slag", "Crushed brick|Brick|Brickbat|Broken brick", "Glass|Recycled glass|Crushed glass|Waste glass", "Rubber|Crumb rubber|Tire chips|Tyre chips|Waste tire", "Plastic|Recycled plastic|Plastic waste|Waste plastic", "Polystyrene|EPS|EPS beads|Styrofoam|Expanded polystyrene", "Coral|Coral sand|Coralline", "Seashell|Shell|Shells|Seashells|Oyster shell", "Coconut shell|Coco shell", "Quartzite|Quartz", "Dolomite", "Sandstone", "Andesite", "Marble|Marble chips|Marble dust", "Volcanic|Volcanic rock|Volcanic sand", "Lahar|Lahar sand|Pinatubo sand|Pampanga sand", "Mine tailings|Tailings", "Fly ash|Sintered fly ash|Fly ash aggregate|Lytag|Bottom ash", "Clinker|Furnace clinker"],
        supertall: ["Barite|Baryte|Barytes", "Magnetite", "Hematite|Haematite", "Limonite|Goethite", "Ilmenite", "Steel shot|Steel punchings|Iron shot", "Diorite", "Gabbro", "Chert|Flint", "Gneiss", "Diatomite|Diatomaceous earth", "Copper slag", "Ferronickel slag|Nickel slag", "Oil palm shell|Palm kernel shell", "Rice husk|Rice hull", "Sawdust|Wood chips", "Cork", "Hempcrete|Hemp shiv|Hemp hurd", "Ceramic waste|Ceramic|Broken tiles|Tile waste", "Granulated slag|Granulated blast-furnace slag", "Bauxite|Calcined bauxite", "Trap rock|Traprock|Diabase|Dolerite"],
        megatall: ["Boron frits|Colemanite|Boron aggregate"]
      },
      facts: {
        "Boron frits": "Boron-bearing aggregates such as colemanite go into radiation-shielding concrete because boron absorbs neutrons, and ordinary sand and gravel can't do that.",
        "Lahar": "The 1991 Mount Pinatubo eruption left Pampanga buried in lahar, and that volcanic sand is now quarried as concrete aggregate."
      }
    },
    {
      id: "codes-standards",
      category: "Codes & Standards",
      prompt: "Name a building code, standard, or manual used by civil engineers.",
      strip: ["code", "codes", "standard", "standards", "manual", "specification", "specifications", "spec", "specs", "the", "of", "edition", "ed", "volume", "vol", "provisions"],
      tiers: {
        lowrise: ["NSCP|NSCP 2015|NSCP 2010|NSCP 2001|NSCP 1992|NSCP 1987|NSCP 1981|NSCP 1972|NSCP 7th edition|NSCP 7th|NSCP Volume 1|NSCP Vol 1|National Structural Code of the Philippines|National Structural Code|Structural Code of the Philippines", "National Building Code|NBC|National Building Code of the Philippines|PD 1096|P.D. 1096|Presidential Decree 1096|Building Code", "ACI 318|ACI|ACI code|ACI 318-19|ACI 318-14|ACI 318-11|ACI 318-08|ACI 318M|Building Code Requirements for Structural Concrete", "ASTM|ASTM standards|ASTM International", "AASHTO|AASHTO standards"],
        vanity: ["Hammurabi's Code|Code of Hammurabi|Hammurabi"],
        highrise: ["ASCE 7|ASCE 7-16|ASCE 7-22|ASCE 7-10|ASCE 7-05|Minimum Design Loads|ASCE", "AISC 360|AISC|AISC Specification|AISC 360-16|AISC 360-22|AISC Steel Construction Manual|Steel Construction Manual|AISC manual", "Fire Code|Fire Code of the Philippines|RA 9514|R.A. 9514|Republic Act 9514|FCP", "Plumbing Code|National Plumbing Code|National Plumbing Code of the Philippines|NPCP|Revised National Plumbing Code", "Philippine Electrical Code|PEC|Electrical Code", "DPWH Blue Book|Blue Book|DPWH Standard Specifications|Standard Specifications for Highways Bridges and Airports|DPWH Standard Specs", "IBC|International Building Code", "UBC|Uniform Building Code|UBC 97|UBC 1997", "Eurocode|Eurocodes|EN 1990|EN 1992|EN 1993|EN 1998|Eurocode 2|Eurocode 3|Eurocode 8|EC2|EC3|EC8", "BP 344|B.P. 344|Accessibility Law|Batas Pambansa 344", "RA 544|R.A. 544|Civil Engineering Law|Republic Act 544", "RA 9184|R.A. 9184|Government Procurement Reform Act|Procurement Law|IRR of RA 9184", "LRFD Bridge Design Specifications|AASHTO LRFD|AASHTO LRFD Bridge Design|LRFD", "Green Book|AASHTO Green Book|A Policy on Geometric Design of Highways and Streets|Geometric Design", "Highway Capacity Manual|HCM", "ISO 9001|ISO", "OSHS|Occupational Safety and Health Standards|DOLE OSHS|RA 11058|R.A. 11058|OSH Law", "DOLE DO 13|Department Order 13|D.O. 13|DO 13|DO 13-98|Construction Safety Guidelines", "NSCP Volume 2|NSCP Vol 2|NSCP Bridges|NSCP 2015 Volume 2|Bridges and Horizontal Structures", "PNS 49|PNS|Philippine National Standard|Philippine National Standards|PNS 49:2020|PNS 49:2002", "Water Code|Water Code of the Philippines|PD 1067|P.D. 1067", "Sanitation Code|Code on Sanitation|PD 856|P.D. 856|Sanitation Code of the Philippines", "Clean Water Act|RA 9275|R.A. 9275", "Clean Air Act|RA 8749|R.A. 8749", "ASEP Steel Handbook|ASEP Handbook|ASEP Steel Manual|Steel Handbook"],
        skyscraper: ["ACI 211|ACI 211.1|ACI mix design", "ACI 301|ACI 301 Specifications", "ACI 347|ACI 347 formwork|Guide to Formwork", "ACI 315|ACI Detailing Manual|ACI SP-66|Detailing Manual", "ACI 350|ACI 350 environmental structures", "ACI 302|ACI 302 floors", "ACI 305|ACI 305 hot weather|Hot Weather Concreting", "ACI 306|ACI 306 cold weather", "ACI 117|ACI 117 tolerances", "ACI 224|ACI 224 cracking", "ACI 207|ACI 207 mass concrete", "ACI 214|ACI 214 strength evaluation", "ACI 440|ACI 440 FRP", "ACI 562|ACI 562 repair", "ACI 530|TMS 402|TMS 402/602|ACI 530 masonry|Masonry Standards Joint Committee", "ACI 349|ACI 349 nuclear", "AISC 341|AISC Seismic Provisions|Seismic Provisions for Structural Steel Buildings", "AISC 358|Prequalified Connections", "ASCE 41|ASCE 41-17|Seismic Evaluation and Retrofit", "ASCE 37|Design Loads on Structures During Construction", "ASCE 24|Flood Resistant Design", "AWS D1.1|AWS|Structural Welding Code|AWS D1.1 Steel|AWS D1.4", "ASTM A615|A615", "ASTM A706|A706", "ASTM C39|C39", "ASTM C150|C150", "ASTM C33|C33", "ASTM C143|C143|Slump test standard", "ASTM C31|C31", "ASTM C94|C94", "ASTM C494|C494", "ASTM C618|C618", "ASTM A36|A36", "ASTM A992|A992", "ASTM A325|A325|ASTM F3125|F3125", "ASTM A490|A490", "ASTM A416|A416", "ASTM D1557|D1557|Modified Proctor", "ASTM D698|D698|Standard Proctor", "ASTM D1586|D1586|SPT standard", "ASTM D2487|D2487|USCS standard", "ASTM D4318|D4318|Atterberg limits standard", "ASTM E8|E8", "AASHTO M145|M145|AASHTO classification|AASHTO soil classification", "AASHTO T99|T99", "AASHTO T180|T180", "AASHTO T193|T193|CBR standard", "MUTCD|Manual on Uniform Traffic Control Devices", "DPWH Design Guidelines Criteria and Standards|DGCS|DPWH DGCS|Design Guidelines Criteria and Standards", "DPWH Highway Safety Design Standards|Highway Safety Design Standards|HSDS", "DPWH Department Orders|DPWH DO|Department Order", "DPWH Bridge Design Specifications|BDS|DPWH BDS|DPWH LRFD Bridge Seismic Design Specifications|BSDS", "Philippine Green Building Code|Green Building Code|GB Code", "BERDE|BERDE rating", "LEED", "EDGE|IFC EDGE", "PD 957|P.D. 957|Subdivision and Condominium Buyers Protective Decree", "BP 220|B.P. 220|Batas Pambansa 220", "RA 4566|R.A. 4566|Contractors License Law", "RA 7718|R.A. 7718|BOT Law|Build-Operate-Transfer Law|RA 6957|PPP Code|RA 11966", "RA 9003|R.A. 9003|Ecological Solid Waste Management Act", "PD 1586|P.D. 1586|EIS System|Philippine Environmental Impact Statement System|ECC", "Labor Code|Labor Code of the Philippines", "CIAP Document 102|CIAP 102|CIAP Doc 102", "FIDIC|FIDIC Red Book|FIDIC Yellow Book|FIDIC Silver Book|FIDIC conditions", "BS 8110|BS8110", "BS 5950|BS5950", "BS 8004", "BS 1377|BS1377", "BS EN 206|EN 206|EN 197", "IS 456|IS456|Indian Standard 456", "IS 800|IS800", "IS 1893|IS1893", "IRC|International Residential Code", "IFC|International Fire Code", "IECC|International Energy Conservation Code", "NFPA|NFPA 101|NFPA 13|Life Safety Code", "AS 3600|AS3600|Australian Standard 3600", "AS 4100", "AS/NZS 1170|AS NZS 1170|NZS 1170", "NZS 3101", "CSA A23.3|CSA A23|CSA S16", "GB 50010|GB50010|Chinese code", "JIS|Japanese Industrial Standards|AIJ", "NEHRP|NEHRP Provisions|FEMA P-750|FEMA P-1050", "FEMA 356|FEMA P-58|FEMA 273|FEMA P-695|FEMA", "ATC-40|ATC 40|ATC", "PCI Design Handbook|PCI Handbook|PCI", "PTI Manual|Post-Tensioning Manual|PTI", "CRSI Manual|CRSI Design Handbook|CRSI", "AASHTO Standard Specifications for Highway Bridges|AASHTO Highway Bridges|Standard Specifications for Highway Bridges", "AREMA Manual|Manual for Railway Engineering|AREMA", "Ten States Standards|Recommended Standards for Water Works", "AWWA Standards|AWWA", "Steel Design Guide|AISC Design Guide"],
        supertall: ["ACI 318.2|ACI 318.2 shells", "ACI 376|ACI 376 LNG tanks", "ACI 543|ACI 543 piles", "ACI 336|ACI 336 footings|ACI 336 drilled piers", "ACI 351|ACI 351 equipment foundations", "ACI 360|ACI 360 slabs on ground", "ACI 352|ACI 352 joints|ACI 352 beam-column joints", "ACI 374|ACI 374 performance-based", "ACI 209|ACI 209 creep and shrinkage", "ACI 228|ACI 228 nondestructive", "ACI 309|ACI 309 consolidation", "ACI 308|ACI 308 curing", "ACI 304|ACI 304 placing", "ACI 201|ACI 201 durability", "ACI 222|ACI 222 corrosion", "ACI 237|ACI 237 SCC", "ACI 239|ACI 239 UHPC", "ACI 506|ACI 506 shotcrete", "ACI 544|ACI 544 fiber reinforced concrete", "ACI 550|ACI 550 precast", "ACI 423|ACI 423 post-tensioning", "ACI 421|ACI 421 punching shear", "ACI 435|ACI 435 deflection", "ACI 445|ACI 445 strut and tie", "ACI 446|ACI 446 fracture", "ACI 369|ACI 369 seismic repair", "ACI 364|ACI 364 rehabilitation", "ASCE 49|Wind Tunnel Testing", "ASCE 61|Piers and Wharves", "ASCE 10|ASCE 10 lattice towers", "ASCE 8|Cold-Formed Stainless Steel", "AISI S100|AISI|Cold-formed steel specification|North American Specification for Cold-Formed Steel", "NDS|National Design Specification for Wood Construction|NDS for Wood", "TMS 602", "ASTM C1611|C1611|Slump flow standard", "ASTM C1202|C1202|RCPT standard", "ASTM C1260|C1260|ASR test standard", "ASTM C138|C138", "ASTM C231|C231", "ASTM C192|C192", "ASTM C78|C78", "ASTM C496|C496", "ASTM C469|C469", "ASTM C1064|C1064", "ASTM D2166|D2166", "ASTM D3080|D3080", "ASTM D2435|D2435", "ASTM D1143|D1143|Pile load test standard", "ASTM D4945|D4945|PDA standard", "ASTM D5882|D5882|PIT standard", "ASTM E119|E119|Fire test standard", "ISO 19650|ISO 19650 BIM", "ISO 45001", "ISO 14001", "ISO 21500", "PMBOK|PMBOK Guide|Project Management Body of Knowledge", "NEC|NEC4|New Engineering Contract", "JCT|Joint Contracts Tribunal", "AIA A201|AIA contract|AIA documents", "ConsensusDocs", "Construction Specifications Institute MasterFormat|MasterFormat|CSI MasterFormat|UniFormat|CSI", "Uniclass", "CIRIA C660|CIRIA|CIRIA guides", "Model Code|fib Model Code|CEB-FIP Model Code|MC2010", "EN 1997|Eurocode 7|EC7", "EN 1991|Eurocode 1|EC1", "EN 1994|Eurocode 4|EC4", "EN 1995|Eurocode 5|EC5", "EN 1996|Eurocode 6|EC6", "EN 1999|Eurocode 9|EC9", "BS 6399", "BS 8500", "BS 4449", "BS 5400", "BS 6031", "BS 8002", "BS 5930", "CP 65|Singapore CP 65", "IS 875", "IS 13920", "IS 10262", "SNI|Indonesian National Standard", "TCVN|Vietnamese standard", "MS|Malaysian Standard|JKR", "KDS|Korean Design Standard", "NBCC|National Building Code of Canada", "NBR 6118|Brazilian code", "Caltrans Seismic Design Criteria|Caltrans SDC|Caltrans", "Japan Road Association Specifications|JRA", "TR 55|TR-55", "HEC-22|HEC 22", "HDS 5|HDS-5", "DPWH Standard Plans|Standard Plans|DPWH Standard Drawings", "ASEP Earthquake Design Manual|Earthquake Design Manual|ASEP Earthquake Manual", "PRC Code of Ethics|Code of Ethics for Civil Engineers|Code of Ethics"],
        megatall: ["De architectura|Vitruvius|Ten Books on Architecture|De Architectura Libri Decem|Vitruvius' De architectura"]
      },
      facts: {
        "De architectura": "Written by the Roman engineer Vitruvius around 25 BC, it is the oldest surviving building manual. It covers materials, aqueducts and machines, and asks that a building have firmness, commodity and delight.",
        "NSCP": "ASEP writes the NSCP. The 2015 7th edition's earthquake provisions trace back to the US Uniform Building Code of 1997."
      }
    },
    {
      id: "concrete-defects",
      category: "Materials Testing",
      prompt: "Name a concrete defect or sign of deterioration.",
      strip: ["concrete", "defect", "defects", "failure", "deterioration", "damage"],
      tiers: {
        lowrise: ["Cracking|Crack|Cracks", "Honeycombing|Honeycomb|Rock pockets|Rock pocket", "Segregation", "Spalling|Spall"],
        vanity: ["Concrete cancer|Cancer"],
        highrise: ["Cold joint", "Efflorescence|White stains|Salt deposits", "Scaling", "Bleeding", "Corrosion|Rebar corrosion|Rust|Rusting|Reinforcement corrosion|Steel corrosion", "Exposed rebar|Exposed reinforcement|Exposed steel|Exposed bars", "Shrinkage cracking|Shrinkage cracks|Drying shrinkage|Shrinkage", "Plastic shrinkage cracking|Plastic shrinkage|Plastic cracks", "Settlement cracking|Settlement cracks|Plastic settlement|Settlement", "Delamination", "Voids|Air voids|Bugholes|Bug holes|Blowholes|Blow holes|Surface voids|Pinholes", "Leaching|Lime leaching|Calcium leaching", "Deflection|Sagging|Excessive deflection|Sag", "Laitance", "Dusting|Chalking", "Rust stains|Rust staining|Staining", "Discoloration|Color variation|Discolouration", "Leakage|Water leakage|Seepage|Leaks|Dampness", "Map cracking|Craze cracking|Crazing|Pattern cracking", "Structural cracks|Flexural cracks|Shear cracks|Diagonal cracks"],
        skyscraper: ["Carbonation", "ASR|Alkali-silica reaction|Alkali silica reaction|Alkali-aggregate reaction|AAR|Alkali aggregate reaction", "Sulfate attack|Sulphate attack|Sulfate", "Chloride attack|Chloride contamination|Chloride-induced corrosion|Chloride ingress|Chloride", "Freeze-thaw damage|Freeze-thaw|Freeze thaw|Frost damage|Frost attack", "Popouts|Popout|Pop-out|Pop-outs", "Blistering|Blisters", "Curling|Warping", "Abrasion|Erosion|Wear|Surface wear", "Cavitation|Cavitation damage", "Sand streaking|Sand streaks|Streaking", "Form marks|Fins|Formwork marks|Grout loss|Grout leakage", "Plastic cracking", "Thermal cracking|Thermal cracks|Temperature cracks", "Creep", "Low strength|Strength deficiency|Under-strength|Failed cylinder", "Insufficient cover|Low cover|Inadequate cover", "Punching shear failure|Punching", "Pitting|Pitting corrosion", "Acid attack|Acid", "Microbial|Biodeterioration|Microbially induced corrosion|MIC|Sewer corrosion|Biogenic sulfide", "Mold|Mould|Algae|Moss|Biological growth|Fungus", "Stalactites|Calcite deposits", "Hairline cracks|Hairline cracking|Hairline", "Joint failure|Joint spalling|Failed joints", "Fire damage|Fire|Heat damage|Explosive spalling", "Impact damage", "Uneven surface|Unevenness|Surface irregularity|Waviness", "Rough surface|Surface roughness"],
        supertall: ["D-cracking|D cracking|Durability cracking", "Crusting", "Plastic settlement cracking", "Mud cracking|Mud cracks", "Re-entrant corner cracking|Re-entrant cracks", "Restraint cracking|Restraint", "Thaumasite sulfate attack|Thaumasite|TSA", "Salt crystallization|Salt weathering|Salt scaling", "Galvanic corrosion", "Stress corrosion cracking|Stress corrosion", "Hydrogen embrittlement", "Alkali-carbonate reaction|ACR", "Shear cone failure|Cone failure", "Corner breaks|Corner break", "Faulting|Joint faulting", "Pumping", "Blowup|Blow-up|Buckling", "Tenting", "Popping|Pop-up"],
        megatall: ["Delayed ettringite formation|DEF|Delayed ettringite|Ettringite"]
      },
      facts: {
        "Delayed ettringite formation": "If concrete gets hotter than about 70 °C while curing, as in steam-cured precast or a massive pour, ettringite crystals can form years later and slowly crack the concrete apart.",
        "Concrete cancer": "Slang for spalling caused by rusting rebar. Rust takes up several times the volume of the steel, so it pushes the concrete cover off."
      }
    },
    {
      id: "dam-types",
      category: "Water",
      prompt: "Name a type of dam.",
      strip: ["dam", "dams", "type"],
      tiers: {
        lowrise: ["Gravity|Concrete gravity", "Embankment|Earth|Earthfill|Earth-fill|Earthen|Earth fill", "Arch|Concrete arch", "Rockfill|Rock-fill|Rock fill"],
        vanity: ["Beaver|Beaver dam"],
        highrise: ["Buttress", "Arch-gravity|Arch gravity|Gravity-arch", "Concrete|Masonry", "Diversion|Diversion dam", "Check dam|Check|Sabo|Sabo dam", "Storage|Storage dam|Reservoir", "Hydroelectric|Hydropower|Hydro", "Cofferdam|Coffer|Coffer dam", "Overflow|Spillway|Overflow dam", "Weir|Barrage", "Roller-compacted concrete|RCC|Roller compacted|Roller-compacted|RCC dam", "Tailings|Tailings dam|Mine tailings", "Detention|Detention dam|Flood control|Retention", "Irrigation|Irrigation dam", "Multipurpose|Multi-purpose"],
        skyscraper: ["Concrete-face rockfill|CFRD|Concrete face rockfill|Concrete-faced rockfill|Face slab", "Double-curvature arch|Double curvature|Cupola|Dome|Double arch|Thin arch", "Multiple-arch|Multiple arch|Multi-arch", "Homogeneous earth|Homogeneous|Homogeneous embankment", "Zoned earth|Zoned|Zoned embankment|Zoned earthfill", "Central core|Clay core|Core|Earth core|Puddle clay core|Central clay core", "Hydraulic fill|Hydraulic-fill", "Saddle|Saddle dam", "Pumped storage|Pumped-storage", "Run-of-river|Run of river", "Debris|Debris dam|Debris basin", "Rubber|Rubber dam|Inflatable|Inflatable dam", "Timber|Wood|Wooden|Log", "Crib|Crib dam|Timber crib", "Hollow gravity|Hollow", "Composite|Composite dam", "Underground|Subsurface|Groundwater|Sand dam", "Non-overflow|Non overflow", "Natural|Landslide|Landslide dam|Glacial"],
        supertall: ["Asphalt core|Asphalt-concrete core|Asphaltic core|Bituminous core", "Arch-buttress|Arch buttress|Ambursen|Flat slab buttress", "Masonry gravity|Stone masonry|Rubble masonry|Cyclopean", "Gabion|Gabion dam", "Hardfill|Cemented material|CSG|Cemented sand and gravel|Trapezoidal CSG", "Steel|Steel dam", "Semi-hydraulic fill", "Diaphragm|Upstream membrane|Geomembrane|Membrane-faced", "Arched gravity|Curved gravity", "Constant-angle arch|Constant angle", "Variable-radius arch|Variable radius", "Constant-radius arch|Constant radius", "Conservation|Conservation dam", "Tidal barrage|Tidal|Tide", "Leaky|Leaky dam|Leaky barrier"],
        megatall: ["Needle dam|Needle|Poirée needle|Poiree"]
      },
      facts: {
        "Needle dam": "A 19th-century river weir made of wooden 'needles' stood side by side against a frame on the riverbed. In floods, keepers lifted them out one by one to let the water through.",
        "Gravity": "A gravity dam holds back water by its weight alone; Three Gorges, the world's largest power station, is one."
      }
    },
    {
      id: "contract-types",
      category: "Construction Mgmt",
      prompt: "Name a type of construction contract or project delivery method.",
      strip: ["contract", "contracts", "contracting", "method", "delivery", "project", "type", "procurement", "system"],
      tiers: {
        lowrise: ["Lump sum|Lump-sum|Fixed price|Fixed-price|Stipulated sum|Firm fixed price", "Unit price|Unit-price|Unit rate|Measure and value|Remeasurement|Admeasurement|Schedule of rates", "Cost plus|Cost-plus|Cost reimbursable|Cost-reimbursable|Cost plus fee", "Design-build|Design build|DB|Design and build|Design & build", "Design-bid-build|Design bid build|DBB|Design build bid|Design-build-bid|Traditional|Traditional method|Conventional"],
        vanity: ["Handshake|Verbal agreement|Verbal|Oral contract|Gentleman's agreement|Word of honor"],
        highrise: ["EPC|Engineering procurement construction|Engineering, procurement and construction|Turnkey|Turn-key|EPC turnkey", "BOT|Build-operate-transfer|Build operate transfer", "PPP|Public-private partnership|Public private partnership|P3", "CM at risk|CMAR|Construction manager at risk|CM-at-risk|CM/GC|Construction manager/general contractor", "Construction management|CM|CM agency|Agency CM|Construction manager as agent|Agency construction management", "Guaranteed maximum price|GMP|Cost plus GMP|Cost plus with GMP", "Time and materials|Time and material|T&M|T and M|Daywork|Day work", "Cost plus fixed fee|CPFF|Cost plus fixed", "Cost plus percentage|Cost plus percentage fee|Cost plus percent", "Labor only|Labour only|Pakyaw|Labor-only|Pakyawan", "By administration|Force account|Administration|In-house|Direct labor", "Joint venture|JV", "Subcontract|Subcontracting|Sub-contract", "Negotiated|Negotiated contract|Negotiated procurement", "Competitive bidding|Public bidding|Open bidding|Bidding|Competitive tender|Tender"],
        skyscraper: ["Integrated project delivery|IPD", "Target cost|Target price|Target cost contract", "Cost plus incentive fee|CPIF|Incentive|Incentive fee", "Cost plus award fee|CPAF|Award fee", "BOO|Build-own-operate|Build own operate", "BOOT|Build-own-operate-transfer", "BLT|Build-lease-transfer|Build lease transfer", "BTO|Build-transfer-operate", "ROT|Rehabilitate-operate-transfer", "ROO|Rehabilitate-own-operate", "BT|Build-transfer|Build and transfer", "DBFO|Design-build-finance-operate", "DBFOM|Design-build-finance-operate-maintain", "DBO|Design-build-operate", "DBOM|Design-build-operate-maintain", "Fast-track|Fast track|Phased construction|Phased", "Bridging|Bridging design-build|Bridging method", "Progressive design-build|Progressive DB|PDB", "Management contracting|Management contract", "Partnering", "Alliance|Alliancing|Project alliance", "Framework agreement|Framework|Term contract|IDIQ|Indefinite delivery indefinite quantity|Task order", "Multiple prime|Multi-prime|Separate contracts", "Concession|Concession agreement", "Design-construct|Design and construct|D&C", "Lease|Lease agreement|Build-lease|Lease-purchase", "Job order|Job order contracting|JOC", "Owner-builder|Owner builder", "Retainer|Retainer agreement", "Consultancy|Consultancy agreement|Professional services|Design contract", "Supply and install|Supply and installation|Furnish and install"],
        supertall: ["Cost plus with sliding fee|Sliding fee|Sliding scale fee", "Cost plus with fluctuating fee", "Two-envelope|Two envelope|Two-stage bidding|Two stage tender|Two-stage", "Early contractor involvement|ECI", "Value-based procurement|Best value|Best-value|Value based", "Performance-based|Performance-based contract|PBC|Output-based", "Shadow toll|Availability payment|Availability-based", "Lane rental", "A+B bidding|A plus B|Cost plus time", "Design-build-maintain|DBM", "Hybrid annuity|Annuity|Annuity model", "Reverse auction|E-reverse auction", "Unsolicited proposal|Unsolicited", "Construct-only|Construct only|Build-only", "Cost plus capped|Capped cost plus", "Novated design-build|Novation|Novated", "Lean project delivery|LPD|IFOA", "Single source|Sole source|Direct contracting|Direct contract", "Emergency procurement|Emergency contract", "Shopping|Small value procurement|SVP", "Limited source bidding|Limited source"],
        megatall: ["Swiss challenge|Swiss Challenge|Swiss-challenge"]
      },
      facts: {
        "Swiss challenge": "Under the Philippine BOT and PPP rules, an unsolicited proposal is put out to rival bidders, and the original proponent can then match any better offer. That right to match is what makes it a Swiss challenge.",
        "Unit price": "Most DPWH works are let as unit-price contracts. You get paid for the quantity actually built at the bid rate per cubic metre, tonne or square metre."
      }
    },
    {
      id: "ppe",
      category: "Construction",
      prompt: "Name a type of PPE or safety gear required on a construction site.",
      strip: ["safety", "protective", "personal", "ppe", "gear", "equipment", "protection", "pair", "of"],
      tiers: {
        lowrise: ["Hard hat|Helmet|Hardhat|Safety helmet|Construction helmet|Hard helmet", "Safety shoes|Safety boots|Steel-toe boots|Steel toe boots|Steel-toe shoes|Steel toe|Steel-toed boots|Work boots|Shoes|Boots|Steel cap boots", "Safety vest|Reflective vest|Hi-vis vest|High visibility vest|High-vis vest|Vest|Hi-vis|Reflectorized vest|Reflector vest", "Gloves|Work gloves|Hand gloves|Safety gloves|Leather gloves|Cotton gloves"],
        vanity: ["Sunscreen|Sunblock|Sun block"],
        highrise: ["Safety glasses|Goggles|Eye protection|Safety goggles|Glasses|Eyewear|Spectacles|Protective eyewear", "Earplugs|Ear plugs|Ear plug", "Earmuffs|Ear muffs|Ear muff|Ear defenders", "Respirator|N95|Dust mask|Mask|Face mask|Respiratory protection|Half-face respirator|Full-face respirator|P100|KN95", "Face shield|Faceshield", "Full body harness|Safety harness|Harness|Body harness|Fall arrest harness", "Lanyard|Shock-absorbing lanyard|Shock absorbing lanyard|Double lanyard", "Lifeline|Life line|Vertical lifeline|Horizontal lifeline|Static line", "Welding mask|Welding helmet|Welding shield|Welding visor|Welder's mask|Welding goggles", "Coveralls|Overalls|Coverall|Boiler suit|Uniform|Work clothes|Long sleeves", "Rubber boots|Gum boots|Wellington boots|Wellies|Bota", "Safety net|Net|Debris net|Catch net", "Hearing protection|Ear protection", "Fall protection|Fall arrest|Fall arrest system|PFAS"],
        skyscraper: ["Welding gloves|Leather welding gloves|Welder's gloves", "Welding apron|Leather apron|Apron|Welding jacket", "Raincoat|Rain coat|Rain gear|Rainwear|Rain suit|Poncho", "Knee pads|Kneepads|Knee guard", "Chin strap|Chinstrap", "Insulated gloves|Electrical gloves|Rubber gloves|Lineman gloves|Dielectric gloves", "Cut-resistant gloves|Cut resistant gloves|Kevlar gloves", "Chemical gloves|Nitrile gloves|Chemical-resistant gloves", "Chemical suit|Hazmat suit|Tyvek|Disposable coveralls|Protective suit", "SCBA|Self-contained breathing apparatus|Breathing apparatus|Air pack", "Arc flash suit|Arc flash|Arc-rated clothing|FR clothing|Flame-resistant clothing", "Reflective clothing|Reflective tape|Reflectorized clothing|Hi-vis shirt|High-visibility clothing", "Sunglasses|Tinted glasses", "Hard hat liner|Helmet liner|Cooling towel|Neck shade|Sun shade", "Fire extinguisher", "First aid kit|First-aid kit|First aid box", "Gas detector|Gas monitor|Multi-gas detector", "Anchor point|Anchorage|Anchor|Beam clamp|D-ring", "Guardrail|Guard rail|Handrail|Toe board", "Barricade|Safety barricade|Caution tape|Warning tape|Barrier tape|Safety cones|Traffic cones|Cones|Early warning device|EWD", "Safety signage|Safety signs|Signage|Warning signs", "Shin guards|Leg guards|Chaps|Chainsaw chaps", "Arm sleeves|Sleeves|Arm guards", "Back support|Back brace|Lifting belt", "Barrier cream", "Bump cap", "Head lamp|Headlamp|Cap lamp|Helmet light"],
        supertall: ["Self-retracting lifeline|SRL|Yo-yo|Retractable lifeline|Self retracting lifeline|Fall limiter", "Rope grab|Fall arrester|Rope adjuster", "Positioning belt|Work positioning belt|Lineman belt|Body belt|Safety belt", "Suspension trauma straps|Trauma straps|Relief straps", "Confined space tripod|Tripod|Rescue tripod|Davit", "Escape hood|Escape respirator|EEBA", "Cooling vest|Ice vest", "Metatarsal guards|Metatarsal|Met guards", "Puncture-resistant insoles|Anti-puncture midsole|Steel midsole", "Vibration gloves|Anti-vibration gloves", "Heat-resistant gloves|Aluminized suit|Heat suit|Aluminized", "Lead apron|Dosimeter|Radiation badge", "Personal flotation device|PFD|Life vest|Life jacket|Lifejacket|Buoyancy aid", "Ladder safety system|Ladder cage|Climbing system", "Spill kit", "Eyewash station|Eyewash|Emergency shower|Safety shower", "Noise dosimeter|Sound level meter", "Proximity warning|Proximity alarm|Back-up alarm|Reverse alarm|Spotter"],
        megatall: ["Tool lanyard|Tool tether|Tool tethering|Tethered tools"]
      },
      facts: {
        "Tool lanyard": "Tool tethers keep a dropped wrench from becoming a missile. Something as small as a spanner can hurt or kill someone after falling a few storeys.",
        "Hard hat": "Under the DOLE OSH standards (Rule 1080), employers must supply PPE such as hard hats to workers for free."
      }
    },
    {
      id: "ce-subdisciplines",
      category: "Profession",
      prompt: "Name a sub-discipline or specialization of civil engineering.",
      strip: ["engineering", "engineer", "specialization", "specialisation", "discipline", "subdiscipline", "sub", "field", "major", "track", "of", "and"],
      tiers: {
        lowrise: ["Structural|Structural engineering|Structures", "Geotechnical|Geotechnical engineering|Geotech|Soil mechanics|Foundation engineering|Soils", "Transportation|Transportation engineering|Transport", "Construction management|Construction|CEM|Construction engineering|Construction engineering and management|Construction and management", "Environmental|Environmental engineering"],
        vanity: ["Military|Military engineering"],
        highrise: ["Water resources|Water resources engineering|Water|Water engineering", "Hydraulic|Hydraulics|Hydraulic engineering", "Highway|Highway engineering|Road engineering|Roads", "Traffic|Traffic engineering", "Surveying|Survey|Geomatics|Geodetic|Geodesy|Land surveying", "Coastal|Coastal engineering|Ocean|Ocean engineering|Marine", "Earthquake|Earthquake engineering|Seismic|Seismic engineering", "Sanitary|Sanitary engineering|Public health engineering|Public health", "Municipal|Municipal engineering|Urban|Urban engineering|Urban infrastructure", "Materials|Materials engineering|Construction materials|Concrete technology", "Bridge|Bridge engineering|Bridges", "Hydrology", "Pavement|Pavement engineering", "Railway|Railway engineering|Railroad|Rail|Railroad engineering", "Infrastructure|Infrastructure engineering", "Quantity surveying|Cost engineering|Estimating", "Project management|Engineering management"],
        skyscraper: ["Tunnel|Tunnel engineering|Tunneling|Tunnelling|Underground construction", "Airport|Airport engineering|Airfield", "Port|Port and harbor|Ports and harbours|Harbor|Harbour|Port engineering", "Irrigation|Irrigation engineering|Irrigation and drainage", "Offshore|Offshore engineering", "Forensic|Forensic engineering", "Rock mechanics|Rock engineering|Engineering geology|Geological engineering|Rock", "Fire|Fire engineering|Fire protection|Structural fire engineering|Fire safety engineering", "Architectural|Architectural engineering|Building engineering|Building", "Urban planning|Town planning|City planning|Regional planning|Planning|Urban and regional planning", "Computational mechanics|Computational|Finite element|FEA|Structural analysis", "Steel structures|Steel design|Steel", "Concrete structures|Concrete design|Reinforced concrete|Concrete", "Timber|Timber engineering|Wood engineering", "Masonry", "Building services|MEP", "GIS|Geographic information systems|Remote sensing", "Disaster risk reduction|DRR|Disaster risk|Resilience engineering|Disaster engineering|Disaster", "Sustainable|Sustainability|Green engineering|Green building|Sustainable engineering", "Water supply|Water supply engineering|Waterworks", "Wastewater|Wastewater engineering|Sewerage", "Solid waste|Solid waste management", "Flood control|Flood management|Flood engineering|Drainage|Stormwater", "Dam|Dam engineering|Dams", "Construction safety|Safety engineering|Safety", "BIM|Building information modeling|Digital construction|Construction technology", "Mining|Mining engineering", "Agricultural|Agricultural engineering|Biosystems", "Engineering mechanics|Applied mechanics|Mechanics"],
        supertall: ["Wind|Wind engineering", "Structural health monitoring|SHM|Health monitoring", "Geosynthetics|Geosynthetic engineering", "Geoenvironmental|Geoenvironmental engineering|Environmental geotechnics", "Pipeline|Pipeline engineering|Pipelines", "Nuclear|Nuclear civil|Nuclear structures", "Space|Space architecture|Extraterrestrial construction|Lunar construction", "Glacier|Glaciology|Cold regions|Cold regions engineering|Arctic engineering", "Biomimicry|Biomimetic|Bio-inspired", "Smart cities|Smart infrastructure|Intelligent transportation|ITS|Intelligent transportation systems", "Probabilistic|Reliability|Reliability engineering|Structural reliability|Risk engineering", "Blast|Blast engineering|Protective structures|Protective design|Impact engineering", "Vibration|Structural dynamics|Dynamics", "Facade|Façade engineering|Facade engineering|Building envelope|Envelope", "Value engineering", "Lighting|Illumination engineering", "Acoustic|Acoustics|Acoustical", "Geophysical|Geophysics", "Sediment|Sediment transport|River engineering|Fluvial|Fluvial engineering", "Groundwater|Hydrogeology|Groundwater engineering", "Heritage|Heritage conservation|Historic preservation|Conservation engineering|Restoration", "Demolition|Demolition engineering", "Railway signaling|Signalling", "Logistics|Supply chain", "Coastal protection|Shore protection"],
        megatall: ["Terramechanics|Terra-mechanics"]
      },
      facts: {
        "Terramechanics": "The study of how wheels and tracks interact with soil. NASA used it to design lunar rover wheels, and soil mechanics is its starting point.",
        "Military": "Civil engineering got its name in the 1700s, when John Smeaton called himself a civil engineer to set his work apart from military engineering."
      }
    },
    {
      id: "cm-documents",
      category: "Construction Mgmt",
      prompt: "Name a document, drawing, or submittal used in construction management.",
      strip: ["document", "documents", "drawing", "drawings", "submittal", "submittals", "form", "sheet", "dwg", "of"],
      tiers: {
        lowrise: ["Floor plan|Plan|Plans|Blueprint|Blueprints|Blue print|Construction drawings|Construction plans|Architectural plans|Architectural|Working drawings|Building plans", "Bill of quantities|BOQ|BoQ|Bill of materials|BOM|Quantity takeoff|Takeoff|Quantity take-off", "Gantt chart|Gantt|Bar chart|Schedule|Construction schedule|Project schedule|Timeline", "Contract|Contract documents|Construction contract|Agreement", "Building permit|Permit"],
        vanity: ["Napkin sketch|Napkin|Back-of-the-napkin|Sketch on a napkin"],
        highrise: ["As-built|As-built drawings|As built|As-built plans|Record drawings|As builts", "RFI|Request for information", "Punch list|Punchlist|Snag list|Snagging list|Deficiency list", "Variation order|Change order|VO|CO|Change request|Variation|Change notice", "Bar bending schedule|BBS|Bar schedule|Rebar schedule|Bending schedule|Cutting list", "Notice to proceed|NTP", "Notice of award|NOA|Letter of award", "Specifications|Specs|Technical specifications|Spec|Project specifications|Specification", "Shop drawings|Shop drawing|Fabrication drawings", "Method statement|Work method statement|Method of statement|Construction methodology|Methodology", "Daily report|Site diary|Daily log|Daily accomplishment report|Daily site report|Logbook|Site logbook|DAR|Diary", "S-curve|S curve|Progress curve", "Progress report|Weekly report|Monthly report|Accomplishment report|Status report", "Progress billing|Billing|Payment application|Statement of work accomplished|SWA|Progress payment|Payment certificate|Interim payment certificate|IPC|Billing statement", "Material submittal|Material approval|Material approval request|MAR|Material inspection request", "Mix design|Concrete mix design|Design mix", "Test report|Test results|Laboratory report|Lab report|Material test report|Test certificate", "Mill certificate|Mill test certificate|MTC|Mill cert|Mill test report", "Request for inspection|Inspection request|RFIn|Inspection and test request|ITR", "Structural plans|Structural drawings|Structural", "Site plan|Lot plan|Plot plan|Location plan|Vicinity map", "Elevation|Elevations", "Section|Sections|Cross section|Cross-section", "Detail|Details|Detail drawings", "Foundation plan", "Framing plan|Beam layout|Roof framing plan", "Cost estimate|Estimate|Detailed estimate|Detailed cost estimate|Budget|Budgetary estimate", "Program of works|POW|Program of work", "Purchase order|PO", "Delivery receipt|DR|Delivery note", "Minutes of meeting|MOM|Meeting minutes|Minutes", "Safety plan|Construction safety and health program|CSHP|Safety program|HSE plan|Safety and health program", "Occupancy permit|Certificate of occupancy|Occupancy certificate", "Work breakdown structure|WBS", "CPM|Critical path method|CPM network|Network diagram|PERT|PERT chart|PERT/CPM|Arrow diagram|Precedence diagram", "Bid documents|Tender documents|Bidding documents|Invitation to bid|ITB|Bid form|Tender", "Electrical plans|Plumbing plans|Mechanical plans|MEP drawings|MEPF plans|Sanitary plans"],
        skyscraper: ["Transmittal|Transmittal letter|Document transmittal", "Look-ahead schedule|Lookahead|Three-week look-ahead|Look ahead|Short-term schedule", "Manpower schedule|Manpower loading|Manpower histogram|Labor schedule|Manpower plan", "Equipment schedule|Equipment list|Equipment utilization", "Cash flow|Cash flow projection|Cash flow forecast|Cashflow", "Non-conformance report|NCR|Nonconformance report", "Inspection and test plan|ITP|Quality control plan|QA/QC plan|Quality plan|Project quality plan|PQP|QCP", "Site instruction|SI|Field instruction|Engineer's instruction|Architect's instruction", "Structural calculations|Design calculations|Calculations|Calc|Structural analysis|Design analysis|Structural computations", "Soil investigation report|Geotechnical report|Soil report|Boring log|Borehole log|Soil boring|Geotech report|Soil test report", "Certificate of completion|Completion certificate|Certificate of substantial completion|Taking-over certificate", "Certificate of acceptance|Acceptance certificate|Final acceptance|Final acceptance certificate", "Turnover documents|Handover documents|Turnover|Handover|Close-out documents|Closeout|Project closeout", "Performance bond|Bond|Surety bond|Bid bond|Bid security|Performance security", "Warranty|Warranty certificate|Guarantee|Warranty bond", "Suspension order|Work suspension order|Stop work order|Stop-work order", "Resumption order|Work resumption order", "Extension of time|EOT|Time extension|Time extension request|Request for time extension", "Letter of intent|LOI", "Environmental Compliance Certificate|ECC|Certificate of Non-Coverage|CNC", "Fire safety evaluation clearance|FSEC|Fire safety inspection certificate|FSIC|Fire clearance", "Excavation permit|Excavation and ground preparation permit", "Demolition permit", "Fencing permit", "Barangay clearance|Barangay permit|Zoning clearance|Locational clearance", "Reflected ceiling plan|RCP|Ceiling plan", "Door and window schedule|Schedule of doors and windows|Door schedule|Window schedule|Finishes schedule|Schedule of finishes", "Beam schedule|Column schedule|Footing schedule|Slab schedule", "Concrete pouring report|Pour record|Concrete delivery ticket|Batch ticket|Delivery ticket", "Slump test record|Cylinder sampling record|Sampling record", "Accident report|Incident report|Near-miss report|Accident investigation report", "Toolbox meeting|Toolbox talk|TBT|Toolbox talk record", "Permit to work|PTW|Work permit|Hot work permit|Confined space permit|Height work permit", "Job hazard analysis|JHA|JSA|Job safety analysis|Risk assessment|HIRA|HIRAC", "Material request|Materials requisition|Requisition|Purchase request|PR", "Inventory|Stock card|Material inventory|Stock report", "Payroll|Time sheet|Timesheet|Daily time record|DTR", "Request for payment|Payment request", "Change proposal|Value engineering proposal|VE proposal", "Notice of delay|Delay notice", "Claims|Claim|Notice of claim", "Statement of account|SOA", "Liquidated damages notice|Liquidated damages", "Mobilization plan|Site layout|Site development plan|Temporary facilities plan|Site logistics plan", "Traffic management plan|TMP|Traffic plan", "Lift plan|Lifting plan|Rigging plan|Crane lift plan", "Formwork drawings|Scaffolding plan|Scaffold drawings|Shoring plan", "Survey plan|Topographic map|Topographic survey|Topo|Contour map|Stakeout|Survey report", "Profile|Plan and profile|Longitudinal profile", "Clash report|Clash detection report|Coordination drawings|Combined services drawing|CSD"],
        supertall: ["Retention release|Retention money|Retention certificate", "Final account|Final billing|Final payment certificate|Final statement", "Contractor's all-risk insurance|CAR|CARI|All-risk insurance|Insurance policy|Insurance certificate", "Advance payment|Advance payment bond|Advance payment security|Mobilization advance", "Joint measurement sheet|Joint survey|Joint inspection report|Joint measurement", "Daywork sheet|Day work sheet|Daywork record", "Concrete cylinder test report|Cube test report|Compressive strength report", "Pile driving record|Pile log|Pile installation record|Pile driving log", "Pile load test report|Load test report|PDA report|Dynamic load test report", "Compaction test report|Field density test|FDT|Field density report|Nuclear density test report", "Calibration certificate|Calibration report", "Welding procedure specification|WPS|PQR|Procedure qualification record|Welder qualification|WQT", "Torque test record|Bolt tension record|Torque record", "Mock-up approval|Mock-up|Mockup|Sample approval|Sample board", "Snag report", "Defects liability certificate|Defects liability|DLP|Certificate of final completion|Performance certificate", "O&M manual|Operation and maintenance manual|O and M manual|Operations manual", "Commissioning report|Testing and commissioning|T&C report", "Baseline schedule|Baseline|Baseline program", "Earned value report|EVM|Earned value|EVA", "Risk register|Risk log", "Issue log|Issues log", "Lessons learned|Lessons learned report", "Submittal register|Submittal log|Document register|Drawing register|Drawing list", "RFI log|RFI register", "Change order log|Variation register", "Stakeholder register", "Request for quotation|RFQ|Quotation|Canvass|Abstract of bids|Abstract of quotation", "Bid evaluation report|Post-qualification report|BAC resolution", "Notice of suspension|Notice of termination|Termination letter", "Pre-construction meeting minutes|Kick-off meeting", "Monthly cash requirements|Disbursement voucher|DV", "Sworn statement|Affidavit|Omnibus sworn statement", "Material sample|Sample", "Shop inspection report|Factory acceptance test|FAT", "Kardex|Equipment logbook|Equipment log", "Gate pass|Delivery pass|Material gate pass", "Work accomplishment report|Weekly accomplishment report|WAR", "Site memo|Memo|Memorandum", "Asset register|Fixed asset register"],
        megatall: ["Pour card|Pouring permit|Concrete pour card|Pour permit|Pouring card|Pre-pour checklist|Pour checklist"]
      },
      facts: {
        "Pour card": "Before a big pour, every trade (structural, electrical, plumbing, QA) signs the pour card to confirm its rebar, sleeves and conduits are in place, because after the pour it is too late.",
        "As-built": "As-built drawings record what was actually built, including every change from the original plans. Maintenance and renovation crews rely on them decades later."
      }
    },
    {
      id: "historic-structures",
      category: "Landmarks",
      prompt: "Name a famous ancient or historic civil engineering structure.",
      strip: ["the", "of", "ancient", "historic", "old"],
      tiers: {
        lowrise: ["Great Pyramid of Giza|Pyramids of Giza|Pyramid of Giza|Great Pyramid|Pyramids|Pyramid|Pyramid of Khufu|Giza|Egyptian pyramids", "Great Wall of China|Great Wall|Wall of China", "Colosseum|Coliseum|Roman Colosseum|Flavian Amphitheatre", "Leaning Tower of Pisa|Tower of Pisa|Pisa|Leaning Tower", "Eiffel Tower|Eiffel"],
        vanity: ["Hanging Gardens of Babylon|Hanging Gardens|Gardens of Babylon"],
        highrise: ["Roman aqueduct|Aqueduct|Aqueducts|Roman aqueducts", "Machu Picchu|Machu Pichu", "Pantheon", "Panama Canal", "Parthenon|Acropolis|Acropolis of Athens", "Stonehenge", "Taj Mahal", "Hagia Sophia|Aya Sofya|Ayasofya", "Petra", "Angkor Wat|Angkor", "Chichen Itza|Chichén Itzá|El Castillo", "Banaue Rice Terraces|Rice Terraces|Banaue|Ifugao Rice Terraces|Rice Terraces of the Philippine Cordilleras|Ifugao", "Intramuros|Walls of Intramuros|Fort Santiago", "San Juanico Bridge|San Juanico", "Suez Canal", "Brooklyn Bridge", "Golden Gate Bridge|Golden Gate", "Hoover Dam", "Empire State Building|Empire State", "Big Ben|Elizabeth Tower|Palace of Westminster", "Tower Bridge", "Sphinx|Great Sphinx|Great Sphinx of Giza", "Statue of Liberty", "Sydney Harbour Bridge|Sydney Harbor Bridge|Harbour Bridge", "Notre-Dame|Notre Dame|Notre-Dame de Paris|Notre Dame Cathedral", "St. Peter's Basilica|St Peters|Saint Peter's Basilica|St. Peter's", "Forbidden City", "Borobudur", "Sagrada Família|Sagrada Familia", "Lighthouse of Alexandria|Pharos|Pharos of Alexandria", "Pont du Gard", "Hadrian's Wall|Hadrians Wall", "San Agustin Church|San Agustin|Paoay Church|Paoay|Baroque Churches of the Philippines|Baroque churches", "Moai|Easter Island statues"],
        skyscraper: ["Florence Cathedral|Brunelleschi's Dome|Duomo|Florence Duomo|Brunelleschi Dome|Santa Maria del Fiore", "Appian Way|Via Appia|Roman roads|Roman road", "Aqueduct of Segovia|Segovia aqueduct|Segovia", "Alcántara Bridge|Alcantara Bridge|Puente de Alcántara", "Grand Canal|Beijing–Hangzhou Grand Canal|Grand Canal of China", "Teotihuacan|Pyramid of the Sun|Pyramid of the Moon", "Ziggurat of Ur|Ziggurat|Great Ziggurat", "Abu Simbel|Abu Simbel temples", "Erie Canal", "Forth Bridge|Forth Rail Bridge", "Ironbridge|Iron Bridge|The Iron Bridge", "Crystal Palace", "Washington Monument", "Mont-Saint-Michel|Mont Saint Michel", "Alhambra", "Neuschwanstein|Neuschwanstein Castle", "Kremlin|Moscow Kremlin", "Mohenjo-daro|Mohenjo daro|Great Bath|Great Bath of Mohenjo-daro", "Great Zimbabwe", "Persepolis", "Temple of Artemis|Artemision", "Mausoleum at Halicarnassus|Mausoleum of Halicarnassus", "Colossus of Rhodes|Colossus", "Baths of Caracalla|Roman baths|Roman Baths", "Karnak|Karnak Temple|Temple of Karnak", "Luxor Temple|Luxor", "Step Pyramid of Djoser|Pyramid of Djoser|Djoser|Step Pyramid|Saqqara", "Bent Pyramid|Red Pyramid|Dahshur", "Great Mosque of Córdoba|Mezquita|Great Mosque of Cordoba|Mosque-Cathedral of Córdoba", "Westminster Abbey", "Chartres Cathedral|Chartres", "Cologne Cathedral|Kölner Dom|Cologne", "Chrysler Building", "Manila Metropolitan Theater|Metropolitan Theater|Metropolitan Theatre", "Manila Central Post Office|Post Office Building|Manila Post Office", "Manila Cathedral", "Quiapo Church", "Barasoain Church|Barasoain", "Vigan|Calle Crisologo|Heritage Village", "Puente de España|Jones Bridge|Puente Colgante", "Malinta Tunnel|Corregidor", "Fort San Pedro", "Fort Pilar|Fort Pilar Zamboanga", "Pyramids of Meroë|Meroë|Nubian pyramids", "Lalibela|Rock-hewn churches", "Ellora|Kailasa Temple|Kailash Temple|Ellora Caves", "Ajanta Caves|Ajanta", "Qutub Minar|Qutb Minar", "Iron Pillar of Delhi|Iron Pillar", "Red Fort", "Shwedagon Pagoda|Shwedagon", "Bagan|Pagan", "Himeji Castle|Himeji", "Todaiji|Tōdai-ji", "Horyuji|Hōryū-ji|Horyu-ji", "Potala Palace|Potala", "Leshan Giant Buddha|Leshan Buddha", "Zhaozhou Bridge|Anji Bridge|Zhaozhou", "Temple of Heaven", "Terracotta Army", "Mesa Verde|Cliff Palace", "Tikal", "Nazca Lines", "Sacsayhuamán|Sacsayhuaman", "Ollantaytambo", "Inca roads|Qhapaq Ñan|Qhapaq Nan|Inca trail", "Thames Tunnel", "Clifton Suspension Bridge", "Menai Suspension Bridge|Menai Bridge", "Pontcysyllte Aqueduct|Pontcysyllte", "Caerphilly Castle", "Tower of London|White Tower", "Château de Chambord|Chambord", "Versailles|Palace of Versailles", "Pont Neuf", "Rialto Bridge|Rialto", "Ponte Vecchio", "Charles Bridge", "Stari Most|Mostar Bridge|Mostar", "Basilica Cistern|Yerebatan Cistern", "Walls of Constantinople|Theodosian Walls", "Masada", "Western Wall|Wailing Wall", "Dome of the Rock", "Jantar Mantar"],
        supertall: ["Cloaca Maxima", "Qanat|Qanats|Kariz", "Marib Dam|Great Dam of Marib|Ma'rib Dam", "Sadd el-Kafara|Sadd-el-Kafara|Sadd el Kafara", "Jawa Dam", "Eupalinos tunnel|Tunnel of Eupalinos|Eupalinian aqueduct", "Siloam tunnel|Hezekiah's Tunnel|Hezekiah tunnel", "Lighthouse of Eddystone|Eddystone|Eddystone Lighthouse|Smeaton's Tower", "Bell Rock Lighthouse|Bell Rock", "Bridgewater Canal", "Canal du Midi|Canal du Midi aqueducts", "Göbekli Tepe|Gobekli Tepe", "Newgrange", "Skara Brae", "Knossos|Palace of Knossos", "Mycenae|Lion Gate|Treasury of Atreus", "Tiryns", "Corinth Canal", "Diolkos", "Hadrian's Villa", "Pons Fabricius|Ponte Fabricio", "Pont Julien", "Ponte Sant'Angelo|Pons Aelius", "Trajan's Bridge|Bridge of Apollodorus", "Pont Saint-Bénézet|Pont d'Avignon|Avignon bridge", "Tower of Hercules", "Valens Aqueduct", "Aqueduct of Nîmes|Nîmes aqueduct", "Grand Anicut|Kallanai|Kallanai Dam", "Rani ki vav|Rani ki Vav|Stepwell|Stepwells|Chand Baori", "Sigiriya", "Anuradhapura|Abhayagiri", "Prambanan", "Ayutthaya", "Bayon", "My Son|Mỹ Sơn", "Nan Madol", "Ahu Tongariki", "Caral", "Chan Chan", "Moche|Huaca del Sol", "Monte Albán|Monte Alban", "Palenque", "Copán|Copan", "Uxmal", "Cahokia|Monks Mound", "Chaco Canyon|Pueblo Bonito", "Hohokam canals", "Nineveh|Sennacherib's aqueduct|Jerwan aqueduct", "Ishtar Gate", "Babylon walls", "Lothal|Lothal dockyard", "Dholavira", "Sanchi Stupa|Sanchi", "Hampi", "Brihadeeswarar Temple|Brihadisvara", "Konark Sun Temple|Konark", "Meenakshi Temple", "Golconda Fort|Golconda", "Kumbhalgarh|Kumbhalgarh Fort", "Kintaikyo Bridge|Kintai Bridge|Kintaikyo", "Lingqu Canal|Lingqu", "Zhengguo Canal", "Ming Tombs", "Hanging Temple", "Tulou|Fujian Tulou", "Hagar Qim|Ħaġar Qim|Megalithic temples of Malta", "Carnac stones|Carnac", "Silbury Hill", "Avebury", "Maeshowe", "UST Main Building|UST Main Bldg|University of Santo Tomas Main Building", "Manila–Dagupan Railway|Manila Dagupan Railway|Ferrocarril de Manila-Dagupan", "Kennon Road", "Wawa Dam", "Ayala Bridge", "Puente de Malagonlong|Malagonlong Bridge|Malagonlong", "Puente de Capricho|Capricho Bridge", "Isabel II Bridge|Puente de Isabel II|Imus Bridge", "Baluarte de San Diego|Baluarte de San Diego Intramuros"],
        megatall: ["Dujiangyan|Dujiangyan irrigation system|Dujiangyan Irrigation"]
      },
      facts: {
        "Dujiangyan": "Built around 256 BC in Sichuan, Dujiangyan splits the Min River with a fish-mouth levee instead of a dam, and it still irrigates more than 5,000 km² of farmland today.",
        "Banaue Rice Terraces": "Ifugao farmers carved the terraces into the Cordillera by hand centuries ago, with mud and stone retaining walls and their own irrigation system. They are a UNESCO World Heritage Site."
      }
    }

  ]
};
