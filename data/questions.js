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
        skyscraper: ["Newton per square millimetre|N/mm2|N/mm²|Newton per square millimeter", "psf|Pounds per square foot", "Kilogram-force per square centimetre|kgf/cm2|kg/cm2|ksc|Kilogram per square centimeter", "Hectopascal|hPa", "Millibar|mbar", "Inch of mercury|inHg"],
        supertall: ["ksf|Kips per square foot", "Tons per square foot|tsf", "Tonne per square metre|t/m2|Ton per square meter", "Technical atmosphere|at"],
        megatall: ["Metre of water|mH2O|Meter of water|Feet of head|Foot of water|Head"]
      },
      facts: { "Metre of water": "Pressure written as the height of a water column: 10 m of water is roughly one atmosphere. Hydraulics engineers still say 'head'." }
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
        skyscraper: ["Continuously reinforced|CRCP", "Porous asphalt|Permeable|Pervious", "Macadam|Water-bound macadam", "Chip seal|Surface treatment|Seal coat", "Brick", "Cold mix asphalt|Cold mix", "Overlay"],
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
      prompt: "Name a famous civil or structural engineer.",
      strip: [],
      tiers: {
        lowrise: ["Gustave Eiffel|Eiffel", "Isambard Kingdom Brunel|Brunel|IK Brunel|Isambard Brunel"],
        vanity: ["Emily Warren Roebling|Emily Roebling"],
        highrise: ["John Roebling|John A. Roebling|Roebling", "Washington Roebling", "Karl Terzaghi|Terzaghi", "Hardy Cross|Cross", "Fazlur Rahman Khan|Fazlur Khan|FR Khan", "Thomas Telford|Telford", "John Smeaton|Smeaton", "Joseph Strauss|Strauss"],
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
    }
  ]
};
