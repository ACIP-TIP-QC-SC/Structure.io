/*
 * Skyscraper.io — prompt dataset
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
 * Matching ignores case, accents, punctuation, spacing, simple plurals
 * and small typos (1–3 letters, depending on answer length).
 */
window.SKYSCRAPER_DATA = {
  version: 1,
  questions: [
    {
      id: "bridge-types",
      category: "Bridges",
      prompt: "Name a structural type of bridge.",
      strip: ["bridge"],
      tiers: {
        lowrise: ["Suspension", "Arch", "Beam", "Truss"],
        vanity: ["Bascule"],
        highrise: ["Cable-stayed|Cable stayed", "Cantilever", "Pontoon|Floating", "Swing", "Drawbridge", "Covered", "Viaduct", "Footbridge|Pedestrian"],
        skyscraper: ["Box girder", "Tied-arch|Tied arch|Bowstring arch", "Bailey", "Vertical-lift|Lift", "Movable|Moveable", "Trestle", "Plate girder", "Rope"],
        supertall: ["Extradosed", "Clapper", "Transporter", "Self-anchored suspension", "Vierendeel", "Living root|Root", "Zig-zag|Zigzag"],
        megatall: ["Stress ribbon|Stressed ribbon"]
      }
    },
    {
      id: "concrete-types",
      category: "Materials",
      prompt: "Name a type of concrete.",
      strip: ["concrete"],
      tiers: {
        lowrise: ["Reinforced|Reinforced cement concrete", "Precast", "Prestressed"],
        vanity: ["Roman|Opus caementicium"],
        highrise: ["Ready-mix|Ready mix|Readymix", "Lightweight", "High-strength|High strength", "Shotcrete|Sprayed|Gunite", "Self-compacting|Self-consolidating|SCC", "Fibre-reinforced|Fiber-reinforced|FRC", "Post-tensioned", "Plain|PCC|Plain cement concrete"],
        skyscraper: ["Pervious|Porous|Permeable", "Mass", "Polymer", "Glass-fibre reinforced|GFRC|GRC|Glass fiber reinforced", "Rapid-hardening|Rapid hardening|Rapid-set", "Aerated|AAC|Autoclaved aerated", "Roller-compacted|Roller compacted", "Stamped", "Air-entrained|Air entrained"],
        supertall: ["Ultra-high-performance|UHPC|UHPFRC|Ultra high performance", "Self-healing|Self healing", "Hempcrete", "Asphalt|Bitumen", "Foamed|Foam", "Sulfur|Sulphur", "Geopolymer", "Heavyweight|High-density|Radiation shielding", "Translucent|Light-transmitting|LiTraCon"],
        megatall: ["Engineered cementitious composite|ECC|Bendable"]
      }
    },
    {
      id: "foundation-types",
      category: "Geotechnical",
      prompt: "Name a type of building foundation.",
      strip: ["foundation", "footing"],
      tiers: {
        lowrise: ["Slab|Slab-on-grade|Slab on grade", "Pile", "Strip|Wall footing"],
        vanity: ["Floating|Compensated"],
        highrise: ["Raft|Mat", "Pad|Isolated|Spread", "Caisson|Well", "Basement", "Crawlspace|Crawl space", "Pier|Pier and beam"],
        skyscraper: ["Pile cap", "Drilled shaft|Bored pile|Drilled pier", "Combined", "Strap|Cantilever footing", "Grade beam", "Stepped", "Driven pile", "Rubble trench"],
        supertall: ["Micropile|Mini pile|Minipile", "Helical pile|Screw pile", "Under-reamed pile|Underreamed pile", "Franki pile", "Piled raft", "Inverted arch", "Suction caisson|Suction bucket", "Frost-protected shallow|FPSF"],
        megatall: ["Barrette|Barrette pile"]
      }
    },
    {
      id: "famous-bridges",
      category: "Landmarks",
      prompt: "Name a real bridge — anywhere in the world.",
      strip: ["bridge"],
      tiers: {
        lowrise: ["Golden Gate", "Brooklyn", "Tower Bridge|Tower", "London Bridge|London"],
        vanity: ["Tacoma Narrows|Galloping Gertie"],
        highrise: ["Sydney Harbour|Harbour Bridge|Sydney Harbor", "Ponte Vecchio", "Rialto", "Forth|Forth Rail", "Bay Bridge|San Francisco–Oakland Bay|Oakland Bay", "Charles", "Verrazzano-Narrows|Verrazano|Verrazzano", "George Washington", "Millau Viaduct|Millau"],
        skyscraper: ["Akashi Kaikyō|Akashi Kaikyo|Akashi", "Øresund|Oresund", "Humber", "Sunshine Skyway", "Pont du Gard", "Mackinac", "Széchenyi Chain|Szechenyi", "Stari Most|Mostar", "Rio–Antirrio|Rio Antirrio", "Vasco da Gama", "Hangzhou Bay", "Confederation"],
        supertall: ["Danyang–Kunshan|Danyang Kunshan", "Çanakkale 1915|Canakkale", "Duge", "Russky", "Quebec", "Langkawi Sky|Langkawi", "Ikitsuki", "Hong Kong–Zhuhai–Macau|HZMB|Hong Kong Zhuhai Macau", "Kintai|Kintaikyo", "Bixby Creek|Bixby"],
        megatall: ["The Iron Bridge|Iron Bridge|Ironbridge"]
      }
    },
    {
      id: "supertall-buildings",
      category: "Landmarks",
      prompt: "Name a completed building at least 300 m tall.",
      strip: ["tower", "building", "centre", "center"],
      tiers: {
        lowrise: ["Burj Khalifa|Burj Dubai", "Empire State Building|Empire State"],
        vanity: ["Merdeka 118|Merdeka|PNB 118"],
        highrise: ["Shanghai Tower", "One World Trade Center|One WTC|1 WTC|Freedom Tower|World Trade Center", "Petronas Towers|Petronas|Petronas Twin Towers", "Willis Tower|Sears Tower", "Taipei 101", "Chrysler Building|Chrysler", "Abraj Al-Bait|Makkah Royal Clock Tower|Mecca Clock Tower|Abraj Al Bait", "The Shard|Shard"],
        skyscraper: ["Lotte World Tower|Lotte", "Ping An Finance Centre|Ping An Finance Center|Ping An", "Central Park Tower", "Lakhta Center|Lakhta", "Landmark 81|Vincom Landmark 81", "432 Park Avenue|432 Park", "Shanghai World Financial Center|SWFC|Bottle opener", "International Commerce Centre|ICC", "Jin Mao Tower|Jin Mao", "Princess Tower", "Two International Finance Centre|2IFC|IFC", "Trump International Hotel and Tower Chicago|Trump Tower Chicago", "One Vanderbilt", "Steinway Tower|111 West 57th", "Kingdom Centre|Kingdom Tower Riyadh"],
        supertall: ["Guangzhou CTF Finance Centre|Guangzhou CTF|Chow Tai Fook", "Tianjin CTF Finance Centre|Tianjin CTF", "CITIC Tower|China Zun", "Gevora Hotel|Gevora", "Federation Tower|Vostok", "Q1|Q1 Tower", "Kingkey 100|KK100", "Marina 101", "Emirates Office Tower|Emirates Towers", "Almas Tower", "Guangzhou International Finance Center|Guangzhou IFC", "Al Hamra Tower", "Exchange 106", "Rose Tower|Rose Rayhaan"],
        megatall: ["Burj Al Arab"]
      }
    },
    {
      id: "pressure-units",
      category: "Mechanics",
      prompt: "Name a unit of pressure or stress.",
      strip: [],
      tiers: {
        lowrise: ["Pascal|Pa", "psi|Pounds per square inch", "Bar"],
        vanity: ["Torr"],
        highrise: ["Kilopascal|kPa", "Megapascal|MPa", "Atmosphere|atm", "Millimetre of mercury|mmHg|Millimeter of mercury", "Newton per square metre|N/m2|N/m²|Newton per square meter", "Gigapascal|GPa", "Kilonewton per square metre|kN/m2|kN/m²|Kilonewton per square meter"],
        skyscraper: ["ksi|Kip per square inch|Kips per square inch", "Inch of mercury|inHg", "Millibar|mbar", "Hectopascal|hPa", "Newton per square millimetre|N/mm2|N/mm²|Newton per square millimeter", "psf|Pounds per square foot", "Inch of water|inH2O"],
        supertall: ["Barye", "Kilogram-force per square centimetre|kgf/cm2|kgf/cm²|Kilogram force per square centimeter", "Technical atmosphere", "ksf|Kips per square foot", "Tons per square foot|tsf", "Metre of water|Meter of water|mH2O|Foot of water|Feet of head"],
        megatall: ["Pieze"]
      }
    },
    {
      id: "structural-elements",
      category: "Structures",
      prompt: "Name a structural element of a building.",
      strip: [],
      tiers: {
        lowrise: ["Beam", "Column", "Slab", "Wall"],
        vanity: ["Flying buttress"],
        highrise: ["Truss", "Footing", "Lintel", "Girder", "Joist", "Arch", "Shear wall", "Brace|Bracing", "Purlin", "Rafter", "Pillar|Post", "Staircase|Stair", "Buttress"],
        skyscraper: ["Corbel", "Stringer", "Transfer beam|Transfer girder", "Diaphragm", "Outrigger", "Spandrel", "Cantilever", "Ring beam|Bond beam", "Plinth beam|Plinth", "Pilaster", "Tie beam|Tie"],
        supertall: ["Haunch", "Drop panel", "Coupling beam", "Belt truss", "Bracket", "Sole plate", "Collar tie", "Ledger", "Column capital|Mushroom head", "Header", "Shear stud|Shear connector", "Gusset plate|Gusset", "Base plate"],
        megatall: ["Hammer beam|Hammerbeam"]
      }
    },
    {
      id: "soil-tests",
      category: "Geotechnical",
      prompt: "Name a geotechnical (soil) test.",
      strip: ["test", "testing"],
      tiers: {
        lowrise: ["Proctor|Proctor compaction|Compaction", "Standard penetration|SPT", "California bearing ratio|CBR"],
        vanity: [],
        highrise: ["Cone penetration|CPT|CPTu|Dutch cone", "Triaxial", "Atterberg limits|Atterberg|Liquid limit|Plastic limit", "Sieve analysis|Sieve|Gradation|Particle size", "Direct shear|Shear box", "Plate load|Plate bearing", "Consolidation|Oedometer", "Moisture content|Water content"],
        skyscraper: ["Vane shear|Field vane|Shear vane", "Hydrometer", "Unconfined compression|UCS|Unconfined compressive strength", "Permeability|Hydraulic conductivity", "Sand cone|Sand replacement", "Nuclear density|Nuclear gauge", "Pressuremeter|Menard pressuremeter", "Specific gravity", "Shrinkage limit"],
        supertall: ["Pocket penetrometer", "Constant head", "Falling head|Variable head", "Dynamic cone penetrometer|DCP", "Cross-hole seismic|Crosshole", "Ring shear", "Pinhole|Pinhole dispersion", "Free swell|Swell", "Lugeon|Packer", "Torvane"],
        megatall: ["Flat dilatometer|DMT|Marchetti dilatometer|Dilatometer"]
      }
    },
    {
      id: "heavy-equipment",
      category: "Construction",
      prompt: "Name a piece of heavy construction equipment.",
      strip: [],
      tiers: {
        lowrise: ["Crane", "Excavator|Digger", "Bulldozer|Dozer"],
        vanity: ["Bagger 288|Bucket-wheel excavator|Bucket wheel excavator"],
        highrise: ["Backhoe|Backhoe loader|JCB", "Dump truck|Tipper", "Forklift", "Concrete mixer|Cement mixer|Mixer truck|Transit mixer", "Loader|Front loader|Wheel loader", "Grader|Motor grader", "Road roller|Roller|Steamroller", "Paver|Asphalt paver", "Pile driver", "Tower crane", "Cherry picker|Boom lift"],
        skyscraper: ["Scraper", "Trencher", "Skid steer|Bobcat", "Telehandler", "Concrete pump|Boom pump", "Tunnel boring machine|TBM", "Dragline", "Compactor|Plate compactor", "Mobile crane|Crawler crane", "Articulated hauler|ADT"],
        supertall: ["Slipform paver", "Vibratory hammer|Vibro hammer", "Pugmill", "Piling rig|Rotary rig|Auger", "Cold planer|Milling machine", "Road reclaimer|Reclaimer", "Clamshell|Grab", "Long-reach excavator|Long reach excavator", "Pipelayer|Sideboom"],
        megatall: ["Sheepsfoot roller|Sheep's foot roller|Padfoot roller"]
      }
    },
    {
      id: "famous-dams",
      category: "Water",
      prompt: "Name a real dam.",
      strip: ["dam"],
      tiers: {
        lowrise: ["Hoover|Boulder", "Three Gorges"],
        vanity: ["Vajont|Vaiont"],
        highrise: ["Aswan High|Aswan", "Itaipu", "Grand Coulee", "Glen Canyon", "Kariba", "Hirakud", "Grand Ethiopian Renaissance|GERD|Renaissance", "Tarbela", "Oroville"],
        skyscraper: ["Guri", "Bhakra|Bhakra Nangal", "Grande Dixence", "Kurobe", "Mangla", "Sardar Sarovar", "Belo Monte", "Atatürk|Ataturk", "Fort Peck", "Shasta", "Tehri"],
        supertall: ["Inguri|Enguri", "Nurek", "Jinping-I|Jinping", "Rogun", "Mauvoisin", "Xiaowan", "Banqiao", "St. Francis|Saint Francis|St Francis", "Malpasset", "Daniel-Johnson|Daniel Johnson|Manic-5", "Möhne|Mohne"],
        megatall: ["Contra|Verzasca|Contra Verzasca"]
      }
    },
    {
      id: "building-materials",
      category: "Materials",
      prompt: "Name a building material (other than concrete).",
      strip: [],
      tiers: {
        lowrise: ["Brick", "Wood", "Steel", "Glass"],
        vanity: ["Adobe|Mud brick"],
        highrise: ["Stone", "Timber", "Aluminium|Aluminum", "Plywood", "Asphalt", "Gypsum|Plaster", "Marble", "Granite", "Mortar", "Cement", "Clay", "Bamboo", "Tile", "Iron"],
        skyscraper: ["Rammed earth", "Cross-laminated timber|CLT|Cross laminated timber", "Terracotta|Terra cotta", "Slate", "Drywall|Plasterboard|Sheetrock|Gypsum board", "Fibreglass|Fiberglass", "Cob", "Thatch", "Copper", "Limestone", "Sandstone", "OSB|Oriented strand board", "Stucco"],
        supertall: ["Glulam|Glued laminated timber", "Mycelium", "Weathering steel|Corten|COR-TEN", "FRP|Fibre-reinforced polymer|Fiber reinforced polymer|CFRP", "Wattle and daub", "Polycarbonate", "Aerogel", "Ferrocement", "Laterite", "LVL|Laminated veneer lumber", "Hempcrete"],
        megatall: ["ETFE|Ethylene tetrafluoroethylene"]
      }
    },
    {
      id: "design-loads",
      category: "Structures",
      prompt: "Name a load or action considered in structural design.",
      strip: ["load", "loading", "action", "force"],
      tiers: {
        lowrise: ["Dead|Self-weight|Self weight|Permanent", "Live|Imposed", "Wind"],
        vanity: [],
        highrise: ["Snow", "Seismic|Earthquake", "Thermal|Temperature", "Impact", "Point|Concentrated", "Dynamic", "Traffic|Moving|Vehicle"],
        skyscraper: ["Hydrostatic|Water pressure", "Earth pressure|Soil pressure|Lateral earth", "Settlement|Differential settlement", "Blast|Explosion", "Construction", "Ice", "Uplift", "Fatigue|Cyclic", "Wave", "Rain"],
        supertall: ["Vortex shedding", "Creep", "Shrinkage", "Crane", "Braking", "Centrifugal", "Prestress|Prestressing", "Collision", "Accidental", "Crowd"],
        megatall: ["Ponding"]
      }
    },
    {
      id: "famous-tunnels",
      category: "Landmarks",
      prompt: "Name a real tunnel.",
      strip: ["tunnel"],
      tiers: {
        lowrise: ["Channel|Eurotunnel|Chunnel", "Holland"],
        vanity: ["Gotthard Base|Gotthard"],
        highrise: ["Seikan", "Lincoln", "Mont Blanc", "Lærdal|Laerdal", "Simplon", "Eisenhower", "Big Dig|Ted Williams", "Brooklyn–Battery|Hugh L. Carey|Brooklyn Battery", "Queens–Midtown|Queens Midtown", "Blackwall", "Detroit–Windsor|Detroit Windsor"],
        skyscraper: ["Fréjus|Frejus", "Brenner Base|Brenner", "Lötschberg|Lotschberg", "Marmaray", "Eurasia", "Hudson Tubes|Hudson", "Arlberg", "Mersey|Queensway", "Box", "Rotherhithe", "Kanmon", "Moffat"],
        supertall: ["Guoliang", "Zhongnanshan", "Rogfast", "Yamate", "Hoosac", "Tunnel of Eupalinos|Eupalinos", "Severn", "Gran Sasso", "Qinling", "Ryfast", "Kilsby", "Rove"],
        megatall: ["Thames|Brunel's Thames"]
      }
    },
    {
      id: "civil-engineers",
      category: "People",
      prompt: "Name a famous civil or structural engineer.",
      strip: [],
      tiers: {
        lowrise: ["Isambard Kingdom Brunel|Brunel|IK Brunel|Isambard Brunel", "Gustave Eiffel|Eiffel"],
        vanity: ["Emily Warren Roebling|Emily Roebling"],
        highrise: ["John Roebling|John A. Roebling|Roebling", "Washington Roebling", "Thomas Telford|Telford", "John Smeaton|Smeaton", "Joseph Strauss|Strauss", "Fazlur Rahman Khan|Fazlur Khan|FR Khan", "George Stephenson|Stephenson", "Robert Stephenson"],
        skyscraper: ["Ove Arup|Arup", "Benjamin Baker", "Joseph Bazalgette|Bazalgette", "Othmar Ammann|Ammann", "Karl Terzaghi|Terzaghi", "Santiago Calatrava|Calatrava", "Pier Luigi Nervi|Nervi", "Imhotep", "M. Visvesvaraya|Visvesvaraya", "Leslie Robertson", "William Le Baron Jenney|Le Baron Jenney", "John Fowler"],
        supertall: ["Christian Menn|Menn", "Eduardo Torroja|Torroja", "Fritz Leonhardt|Leonhardt", "Ralph Modjeski|Modjeski", "Squire Whipple|Whipple", "Arthur Vierendeel|Vierendeel", "John Frank Stevens", "Ellis Chesbrough|Chesbrough", "Félix Candela|Felix Candela|Candela", "Heinz Isler|Isler", "Eugène Freyssinet|Eugene Freyssinet|Freyssinet", "Jörg Schlaich|Jorg Schlaich|Schlaich", "Peter Rice", "William Mulholland|Mulholland", "Hardy Cross"],
        megatall: ["Robert Maillart|Maillart"]
      }
    },
    {
      id: "steel-sections",
      category: "Steel",
      prompt: "Name a steel section (profile) shape.",
      strip: ["section", "profile", "shape"],
      tiers: {
        lowrise: ["I-beam|I beam|I-section", "H-beam|H beam|H-section", "Angle|L-section|L-shape"],
        vanity: [],
        highrise: ["Channel|C-section|C-channel|U-channel", "Tee|T-section|T-bar", "Hollow section|HSS|Tube", "Wide flange|W-shape", "Pipe|Circular hollow section|CHS", "Plate", "Flat bar|Flat", "Round bar|Rod"],
        skyscraper: ["Z-section|Zed", "Universal beam|UB", "Universal column|UC", "Rectangular hollow section|RHS", "Square hollow section|SHS", "Bulb flat", "Rail"],
        supertall: ["Cellular beam", "Hat section|Omega", "Sigma section|Sigma", "Box section", "Parallel flange channel|PFC", "Unequal angle", "Taper flange beam|Tapered flange|Junior beam"],
        megatall: ["Castellated beam|Castellated"]
      }
    },
    {
      id: "road-components",
      category: "Transportation",
      prompt: "Name a component or feature of a road or highway.",
      strip: [],
      tiers: {
        lowrise: ["Lane", "Shoulder|Hard shoulder", "Curb|Kerb", "Median|Central reservation"],
        vanity: ["Botts' dots|Botts dots"],
        highrise: ["Asphalt|Tarmac|Pavement", "Base course|Base", "Subgrade", "Guardrail|Crash barrier|Barrier", "Ditch|Drain", "Sidewalk|Footpath", "Gutter", "Crosswalk|Zebra crossing|Pedestrian crossing", "Road markings|Lane markings", "Speed bump|Speed hump|Sleeping policeman", "Roundabout", "Interchange|Overpass", "Streetlight|Street light"],
        skyscraper: ["Subbase", "Surface course|Wearing course", "Binder course", "Rumble strip", "Camber|Crown", "Culvert", "Jersey barrier", "Cat's eye|Cats eye|Raised pavement marker", "Expansion joint", "Bike lane|Cycle lane", "Chicane", "Embankment"],
        supertall: ["Tack coat", "Prime coat", "Geotextile", "Verge", "Dowel bar", "Gore|Gore area", "Frontage road", "Transition curve|Spiral|Easement curve", "Crash cushion|Impact attenuator"],
        megatall: ["Superelevation|Banking|Cant"]
      }
    },
    {
      id: "truss-types",
      category: "Structures",
      prompt: "Name a named type of truss.",
      strip: ["truss"],
      tiers: {
        lowrise: ["Pratt", "Howe", "Warren"],
        vanity: ["Vierendeel"],
        highrise: ["King post|Kingpost", "Queen post|Queenpost", "Fink", "Scissor", "Bowstring", "K-truss|K", "Baltimore", "Parker", "Lattice"],
        skyscraper: ["Pennsylvania|Petit", "Camelback", "Town lattice|Town", "Whipple", "Bailey", "Fan", "Gambrel", "Attic|Room-in-roof", "Mono-pitch|Monopitch|Mono", "Raised tie"],
        supertall: ["Burr|Burr arch", "Long", "Lenticular|Pauli", "Waddell|Waddell A", "Allan", "Brown", "Haupt", "Post", "Smith", "Kellogg", "Wichert", "Linville"],
        megatall: ["Bollman"]
      }
    },
    {
      id: "structural-failures",
      category: "History",
      prompt: "Name a famous structural collapse or engineering failure.",
      strip: ["collapse", "disaster", "failure"],
      tiers: {
        lowrise: ["Tacoma Narrows Bridge|Tacoma Narrows|Galloping Gertie", "World Trade Center|Twin Towers|WTC|9/11"],
        vanity: ["Hyatt Regency walkway|Hyatt Regency|Hyatt|Kansas City Hyatt"],
        highrise: ["Quebec Bridge|Quebec", "Tay Bridge|Tay", "Silver Bridge|Point Pleasant", "I-35W bridge|I-35W|I35W|Minneapolis bridge", "Ronan Point", "Sampoong Department Store|Sampoong", "Ponte Morandi|Morandi|Genoa bridge", "Champlain Towers South|Surfside|Champlain Towers", "Rana Plaza", "Banqiao Dam|Banqiao"],
        skyscraper: ["Hartford Civic Center|Hartford", "Teton Dam|Teton", "St. Francis Dam|St Francis Dam|Saint Francis Dam", "Dee Bridge|Dee", "Malpasset Dam|Malpasset", "Citicorp Center|Citigroup Center|Citicorp", "FIU pedestrian bridge|FIU bridge|FIU", "Vajont Dam|Vajont", "Hotel New World", "L'Ambiance Plaza|Lambiance Plaza", "Millennium Bridge|Wobbly bridge", "Kemper Arena"],
        supertall: ["Ynys-y-Gwas", "Kings Bridge|King Street Bridge", "Highland Towers", "West Gate Bridge|West Gate", "Cleddau Bridge|Cleddau", "Pemberton Mill", "Knickerbocker Theatre|Knickerbocker", "Skyline Plaza", "Ashtabula River Railroad|Ashtabula", "South Fork Dam|Johnstown Flood", "Great Molasses Flood|Boston Molasses", "Big Dig ceiling"],
        megatall: ["Sleipner A|Sleipner"]
      }
    },
    {
      id: "hydraulic-structures",
      category: "Water",
      prompt: "Name a hydraulic structure — anything built to control or use water.",
      strip: [],
      tiers: {
        lowrise: ["Dam", "Canal", "Levee"],
        vanity: ["Aqueduct"],
        highrise: ["Weir", "Spillway", "Lock|Canal lock", "Dike|Dyke", "Culvert", "Breakwater", "Reservoir", "Sluice|Sluice gate", "Seawall|Sea wall", "Pier", "Water tower", "Well"],
        skyscraper: ["Groyne|Groin", "Penstock", "Stilling basin", "Fish ladder|Fish pass|Fishway", "Jetty", "Surge tank|Surge chamber", "Cofferdam", "Barrage", "Headrace|Tailrace", "Intake tower|Intake", "Flume", "Qanat", "Detention basin|Retention pond|Detention pond"],
        supertall: ["Labyrinth weir", "Parshall flume", "Tide gate|Flap gate", "Tetrapod", "Energy dissipator|Dissipator", "Siphon spillway", "Floodgate|Flood gate", "Stepwell", "Ship lift|Boat lift", "Inverted siphon", "Check dam|Sabo dam", "Radial gate|Tainter gate"],
        megatall: ["Morning glory spillway|Bell-mouth spillway|Bellmouth spillway|Glory hole"]
      }
    },
    {
      id: "surveying-instruments",
      category: "Surveying",
      prompt: "Name a surveying instrument or tool.",
      strip: [],
      tiers: {
        lowrise: ["Theodolite", "GPS|GNSS", "Level|Spirit level"],
        vanity: [],
        highrise: ["Total station", "Tape measure|Measuring tape|Tape", "Compass", "Laser level", "Plumb bob|Plumb line", "Rangefinder|EDM|Electronic distance meter", "Dumpy level", "Drone|UAV"],
        skyscraper: ["Automatic level|Auto level", "Prism|Reflector", "Levelling staff|Leveling rod|Staff|Rod", "Gunter's chain|Chain|Surveyor's chain", "Plane table", "Transit", "Lidar|Laser scanner|3D laser scanner", "Tripod", "Ranging rod|Ranging pole", "Clinometer", "Measuring wheel|Trundle wheel"],
        supertall: ["Alidade", "Planimeter", "Abney level", "Optical square", "Cross-staff", "Dioptra", "Gyrotheodolite", "Sextant", "Tellurometer", "Chorobates"],
        megatall: ["Groma"]
      }
    },
    {
      id: "famous-canals",
      category: "Water",
      prompt: "Name a real canal.",
      strip: ["canal"],
      tiers: {
        lowrise: ["Panama", "Suez"],
        vanity: ["Erie"],
        highrise: ["Grand Canal|Beijing–Hangzhou", "Corinth", "Kiel", "Manchester Ship", "Rideau", "Welland", "Canal du Midi|Midi", "Chicago Sanitary and Ship"],
        skyscraper: ["Göta|Gota", "Caledonian", "Chesapeake and Ohio|C&O", "Illinois and Michigan", "Main–Danube|Rhine–Main–Danube|Main Danube", "Grand Union", "Kennet and Avon", "Leeds and Liverpool", "Volga–Don|Volga Don", "Trollhätte|Trollhatte", "North Sea|Noordzeekanaal"],
        supertall: ["White Sea–Baltic|Belomorkanal|White Sea Baltic", "Llangollen", "Augustów|Augustow", "Indira Gandhi", "Karakum", "Lingqu|Ling Qu", "Briare", "Forth and Clyde", "Dortmund–Ems|Dortmund Ems", "Canal of the Pharaohs|Pharaohs", "Lachine"],
        megatall: ["Bridgewater"]
      }
    },
    {
      id: "concrete-ingredients",
      category: "Materials",
      prompt: "Name an ingredient or admixture used in concrete.",
      strip: [],
      tiers: {
        lowrise: ["Cement|Portland cement", "Water", "Sand|Fine aggregate", "Gravel|Coarse aggregate|Crushed stone"],
        vanity: [],
        highrise: ["Aggregate", "Fly ash|Pulverised fuel ash|PFA", "Superplasticizer|Superplasticiser|Plasticizer|Plasticiser", "Accelerator", "Retarder", "Silica fume|Microsilica", "Slag|GGBS|GGBFS|Ground granulated blast-furnace slag", "Lime"],
        skyscraper: ["Air-entraining agent|Air entrainer|Air entraining admixture", "Water reducer|Water-reducing admixture", "Metakaolin", "Pozzolan|Pozzolana", "Limestone filler|Limestone powder", "Steel fibres|Steel fibers|Fibres|Fibers", "Polypropylene fibres|Polypropylene fibers|PP fibres", "Waterproofing admixture|Integral waterproofing", "Recycled aggregate"],
        supertall: ["Corrosion inhibitor", "Shrinkage reducer|Shrinkage-reducing admixture|SRA", "Viscosity modifier|VMA", "Calcium nitrite", "Calcium chloride", "Volcanic ash", "Expanded clay|LECA", "Pumice", "Pigment|Iron oxide|Colour pigment", "Crystalline admixture", "Glass powder", "Calcined clay"],
        megatall: ["Rice husk ash|RHA"]
      }
    },
    {
      id: "retaining-walls",
      category: "Geotechnical",
      prompt: "Name a type of retaining wall.",
      strip: ["wall", "retaining"],
      tiers: {
        lowrise: ["Gravity", "Cantilever", "Gabion"],
        vanity: [],
        highrise: ["Sheet pile|Sheet piling", "Crib", "Counterfort", "Anchored|Tieback", "Mechanically stabilized earth|MSE|Mechanically stabilised earth|Reinforced earth", "Soil nail|Soil nailing|Soil nailed", "Diaphragm|Slurry"],
        skyscraper: ["Buttressed|Buttress", "Secant pile|Secant", "Contiguous pile|Contiguous", "Soldier pile and lagging|Soldier pile|Soldier and lagging", "Bin", "Dry stone|Drystone", "Timber sleeper|Sleeper", "Segmental block|Segmental|Modular block", "Masonry"],
        supertall: ["King post", "Semi-gravity", "Tangent pile|Tangent", "Geocell|Cellular confinement", "Green wall|Vegetated", "Ha-ha"],
        megatall: ["Berliner|Berlin-type|Berlin"]
      }
    },
    {
      id: "seismic-design",
      category: "Earthquakes",
      prompt: "Name an earthquake-resistant design feature or device.",
      strip: [],
      tiers: {
        lowrise: ["Base isolation|Base isolator|Seismic isolation", "Shear wall", "Damper"],
        vanity: ["Tuned mass damper|TMD|Taipei 101 damper"],
        highrise: ["Cross bracing|X bracing|Bracing|Braced frame", "Moment frame|Moment-resisting frame|Special moment frame", "Lead rubber bearing|LRB|Rubber bearing", "Viscous damper|Fluid viscous damper", "Friction pendulum|Friction pendulum bearing", "Seismic joint|Seismic gap|Expansion joint"],
        skyscraper: ["Buckling-restrained brace|BRB|Buckling restrained brace|Unbonded brace", "Eccentrically braced frame|EBF", "Friction damper", "Rocking wall|Rocking frame", "Ductile detailing|Ductility", "Diaphragm", "Hold-down|Holdown", "Outrigger", "Strong column weak beam|Capacity design"],
        supertall: ["Tuned liquid damper|TLD|Sloshing damper", "Viscoelastic damper", "Active mass damper|AMD", "Metallic yield damper|ADAS|TADAS|Yielding damper", "Self-centering|Self-centring", "Seismic restrainer|Cable restrainer", "Shock transmission unit|STU|Lock-up device", "Diagrid", "Coupled shear wall|Coupled wall"],
        megatall: ["Shape memory alloy|SMA|Nitinol"]
      }
    },

    /* ---- Prompts built from the Dictionary of Construction, Surveying & Civil Engineering headword families ---- */
    {
      id: "roof-types",
      category: "Building Construction",
      prompt: "Name a type of roof.",
      strip: ["roof", "roofing"],
      tiers: {
        lowrise: ["Flat", "Pitched|Sloped", "Gable"],
        vanity: ["Mansard|French"],
        highrise: ["Hipped|Hip", "Gambrel", "Lean-to|Shed|Single-pitch|Mono-pitch", "Butterfly", "Dome|Domed", "Barrel vault|Barrel", "Sawtooth|Northlight|North light", "Green|Living", "Thatched|Thatch"],
        skyscraper: ["Hammerbeam|Hammer beam", "Bonnet", "Pavilion", "Warm", "Cold", "Inverted|Upside-down|Protected membrane", "Hyperbolic paraboloid|Hypar", "Saltbox", "Cross-gabled|Cross gable", "Skillion", "Duo-pitched|Duo pitch"],
        supertall: ["Crown-post|Crown post", "Collar", "Close couple|Couple", "Turret", "Folded plate", "Bitumen felt|Felt", "Single-ply|Single ply", "Purlin", "Polygonal", "Conical|Cone", "Onion dome|Onion", "Trafficable"],
        megatall: ["Jerkinhead|Jerkin head|Half-hipped|Clipped gable|Hipped gable"]
      }
    },
    {
      id: "brick-bonds",
      category: "Masonry",
      prompt: "Name a brickwork bond (pattern).",
      strip: ["bond", "brick", "brickwork"],
      tiers: {
        lowrise: ["Stretcher|Running", "English", "Flemish"],
        vanity: ["Herringbone"],
        highrise: ["Header|Heading", "Stack|Stacked", "Common|American", "Basket weave|Basketweave", "English garden wall", "Flemish garden wall", "Garden wall"],
        skyscraper: ["Dutch|English cross", "Monk", "Honeycomb", "Raking", "Diagonal", "Half"],
        supertall: ["Flying Flemish", "Sussex|Sussex garden wall", "Yorkshire", "Quetta", "Heart"],
        megatall: ["Rat-trap|Rat trap|Rowlock cavity"]
      }
    },
    {
      id: "arch-types",
      category: "Masonry",
      prompt: "Name a type of arch.",
      strip: ["arch"],
      tiers: {
        lowrise: ["Round|Semicircular|Roman", "Pointed|Gothic", "Flat|Straight"],
        vanity: ["Catenary"],
        highrise: ["Segmental", "Horseshoe|Moorish", "Parabolic", "Tudor|Four-centred|Four-centered", "Lancet", "Ogee", "Triumphal", "Jack", "Relieving|Discharging|Safety"],
        skyscraper: ["Elliptical|Elliptic", "Three-hinged|Three hinged", "Two-hinged|Two hinged", "Fixed|Hingeless", "Corbel|Corbelled|Corbeled", "Trefoil", "Soldier", "Equilateral", "Voussoir", "Gauged"],
        supertall: ["Welsh", "Crossetted", "Rubbed", "Inflexed", "Basket-handle|Three-centred|Three-centered", "Stilted", "Shouldered", "Rough"],
        megatall: ["Rampant"]
      }
    },
    {
      id: "window-types",
      category: "Building Construction",
      prompt: "Name a type of window.",
      strip: ["window"],
      tiers: {
        lowrise: ["Sash", "Casement", "Bay"],
        vanity: ["Oriel"],
        highrise: ["Sliding", "Bow", "Skylight|Rooflight|Roof light", "Picture", "Awning|Top-hung|Top hung", "Hopper|Bottom-hung|Bottom hung", "Dormer", "Double-hung|Double-hung sash", "French|French casement", "Stained-glass|Stained glass", "Tilt-and-turn|Tilt and turn", "Pivot"],
        skyscraper: ["Clerestory|Clearstory", "Transom|Fanlight", "Single-hung", "Jalousie|Louvre|Louvred|Louvered", "Rose", "Storm", "Side-hung", "Lattice", "Venetian|Palladian|Serliana", "Oculus|Bullseye|Oeil-de-boeuf"],
        supertall: ["Thermal|Diocletian", "Lunette", "Flanking", "Lucarne", "Ribbon", "Storm-proof|Stormproof", "Double"],
        megatall: ["Hospital"]
      }
    },
    {
      id: "stair-types",
      category: "Building Construction",
      prompt: "Name a type of staircase.",
      strip: ["stair", "staircase", "stairway", "stairs"],
      tiers: {
        lowrise: ["Spiral", "Straight", "L-shaped|Quarter-turn|Quarter turn"],
        vanity: ["Floating"],
        highrise: ["Helical", "U-shaped|Half-turn|Half turn|Switchback", "Dogleg|Dog-leg", "Winder", "Curved", "Fire escape|Escape|Fire", "Open-riser|Open riser", "Cantilever|Cantilevered", "Bifurcated|Split|Imperial"],
        skyscraper: ["Open newel|Open-newel", "Open-well|Open well", "Geometric|Flying", "Skeleton", "Protected", "Enclosed", "Elliptical", "Grand"],
        supertall: ["Alternating tread|Paddle", "Double helix|Double-helical|Double helical", "Ship's ladder|Ships ladder", "Companionway", "Space-saver|Space saver"],
        megatall: ["Scissor|Scissors"]
      }
    },
    {
      id: "crane-types",
      category: "Construction",
      prompt: "Name a type of crane.",
      strip: ["crane"],
      tiers: {
        lowrise: ["Tower", "Mobile", "Overhead|Bridge"],
        vanity: ["Hammerhead"],
        highrise: ["Gantry", "Crawler", "Truck-mounted|Truck", "Rough terrain|Rough-terrain", "Floating", "Luffing|Luffing jib", "Telescopic", "Jib", "Derrick", "Self-erecting|Self erecting", "Ship-to-shore|Container|STS"],
        skyscraper: ["Self-climbing|Climbing", "Semi-gantry", "Knuckle boom|Loader|Lorry loader|HIAB", "Carry deck", "Spider|Mini crawler", "Railroad|Rail|Locomotive", "Sky crane|Helicopter|Aerial"],
        supertall: ["Titan", "Whirley", "Saddle-jib|Saddle jib", "Ringer|Ring", "Guy derrick", "Stiff-leg|Stiffleg|Scotch derrick"],
        megatall: ["Treadwheel|Treadmill|Tread-wheel"]
      }
    },
    {
      id: "materials-tests",
      category: "Materials Testing",
      prompt: "Name a test used on construction materials (concrete, steel, timber…).",
      strip: ["test", "testing"],
      tiers: {
        lowrise: ["Slump", "Compressive strength|Compression|Cube|Cylinder", "Tensile|Tension"],
        vanity: ["Schmidt hammer|Rebound hammer|Rebound"],
        highrise: ["Flexural|Bending|Modulus of rupture", "Charpy|Charpy impact", "Brinell|Brinell hardness", "Rockwell|Rockwell hardness", "Vickers|Vickers hardness", "Core|Core sample", "Ultrasonic pulse velocity|UPV|Ultrasonic", "Fatigue", "Bend"],
        skyscraper: ["Split cylinder|Splitting tensile|Brazilian|Splitting", "Izod", "Compaction factor", "Flow table|Slump flow", "Vebe|VB|VB consistometer", "Pull-out|Pullout", "Half-cell potential|Half cell", "Carbonation|Phenolphthalein", "Los Angeles abrasion|LA abrasion", "Knoop"],
        supertall: ["Initial surface absorption|ISAT", "J-ring", "L-box", "V-funnel", "Vicat|Vicat needle", "Le Chatelier|Soundness", "Aggregate crushing value|ACV", "Aggregate impact value|AIV", "Rapid chloride permeability|RCPT", "Covermeter|Cover meter", "Jominy|End quench"],
        megatall: ["Kelly ball|Ball penetration"]
      }
    },
    {
      id: "hammer-types",
      category: "Tools",
      prompt: "Name a type of hammer.",
      strip: ["hammer"],
      tiers: {
        lowrise: ["Claw", "Sledgehammer|Sledge", "Ball-peen|Ball peen|Ball pein"],
        vanity: ["Jackhammer|Pneumatic drill|Breaker"],
        highrise: ["Mallet|Rubber mallet", "Club|Lump", "Framing", "Tack", "Drywall", "Rock|Geologist's|Rock pick", "Brick|Bricklayer's", "Cross-peen|Cross peen|Straight-peen|Straight peen", "Dead blow|Dead-blow", "Hydraulic", "Pile|Drop"],
        skyscraper: ["Bush", "Chipping", "Mash", "Joiner's|Joiners", "Upholstery", "Engineer's|Engineers", "Scutch", "Lath|Lathing", "Soft-face|Soft face", "Rebound|Schmidt"],
        supertall: ["Spalling", "Comb", "Facing", "Pick", "Slater's|Slaters|Slate", "Steam", "Diesel"],
        megatall: ["Knapping"]
      }
    },
    {
      id: "wall-types",
      category: "Building Construction",
      prompt: "Name a type of wall used in buildings or civil works.",
      strip: ["wall"],
      tiers: {
        lowrise: ["Load-bearing|Bearing|Loadbearing", "Retaining", "Partition"],
        vanity: ["Trombe"],
        highrise: ["Cavity", "Curtain", "Shear", "Party|Separating", "Parapet", "Gable", "Sea|Seawall", "Dry-stone|Dry stone|Drystone", "Fire|Firewall", "Infill", "Diaphragm", "Masonry"],
        skyscraper: ["Spine", "Sleeper", "Dwarf", "Cross-wall|Cross wall", "Fin", "Return", "Rubble", "Flint", "Veneer|Veneered", "Knee", "Wing", "Noise barrier|Sound"],
        supertall: ["Pigeonhole|Honeycomb", "Training", "Blind", "Rowlock cavity|Rowlock", "Embedded"],
        megatall: ["Crinkle-crankle|Crinkum-crankum|Serpentine|Ribbon"]
      }
    }
  ]
};
