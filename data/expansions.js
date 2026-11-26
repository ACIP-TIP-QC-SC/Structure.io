/*
 * Skyscraper.io — long-tail answer lists for open-ended "name a real …" prompts.
 * ------------------------------------------------------------------
 * Merged into data/questions.js by prompt id at load time (SkyMatcher.applyExpansions).
 * Anything that duplicates a curated answer is skipped, so tiers set in questions.js win.
 * Same entry format: "Display|alias|alias". Tiers: highrise / skyscraper / supertall only —
 * the long tail never adds Low-Rise, Vanity or Megatall answers (those stay hand-curated).
 *
 * Tiering rule: famous worldwide (most students would recognise it) → highrise;
 * known to engineers / regionally famous → skyscraper; genuine deep cut → supertall.
 * Philippine entries are tiered for a Filipino student audience.
 */
window.SKYSCRAPER_EXPANSIONS = {

  /* ===================== REAL BRIDGES (world + Philippines) ===================== */
  "famous-bridges": {
    highrise: [
      "Manhattan", "Williamsburg", "Queensboro|59th Street|Ed Koch Queensboro", "Millennium|London Millennium|Millennium Footbridge",
      "Westminster", "Pont Neuf", "Bridge of Sighs|Ponte dei Sospiri", "Bosphorus|15 July Martyrs|Bogazici|Boğaziçi",
      "Chesapeake Bay|Chesapeake Bay Bridge-Tunnel", "Lake Pontchartrain Causeway|Pontchartrain|Lake Pontchartrain",
      "Seven Mile", "Rainbow", "Tsing Ma", "Erasmus|Erasmusbrug", "Clifton Suspension|Clifton", "Severn",
      "Howrah|Rabindra Setu", "Bandra–Worli Sea Link|Bandra Worli|Rajiv Gandhi Sea Link|Bandra-Worli",
      "Penang", "Helix|The Helix|Double Helix", "Victoria Falls", "Rio–Niterói|Rio Niteroi|Rio-Niteroi|Costa e Silva",
      "Golden Bridge|Cau Vang|Ba Na Hills|Hands Bridge", "Bridge on the River Kwai|River Kwai|Kwai|Death Railway",
      "Marco Polo|Lugou", "Glenfinnan Viaduct|Glenfinnan", "Chapel Bridge|Kapellbrücke|Kapellbrucke|Kapell",
      "Zhangjiajie Glass|Zhangjiajie", "Great Belt|Storebaelt|Storebælt|Great Belt Fixed Link", "25 de Abril|Ponte 25 de Abril|April 25th",
      "Johor–Singapore Causeway|Causeway|Woodlands Causeway|Johor Causeway", "Pont Alexandre III|Alexandre III",
      "Atal Setu|Mumbai Trans Harbour Link|MTHL", "Puente de la Mujer|Woman's Bridge|Womens Bridge"
    ],
    skyscraper: [
      // Americas
      "Hell Gate", "Bayonne", "Goethals", "Outerbridge Crossing|Outerbridge", "Throgs Neck", "Bronx–Whitestone|Whitestone|Bronx Whitestone",
      "Tappan Zee|Mario Cuomo|Governor Mario M. Cuomo", "Benjamin Franklin|Ben Franklin", "Walt Whitman", "Commodore Barry", "Delaware Memorial",
      "Richmond–San Rafael|Richmond San Rafael", "Carquinez|Alfred Zampa", "San Mateo–Hayward|San Mateo", "Dumbarton",
      "San Diego–Coronado|Coronado", "Vincent Thomas", "Evergreen Point Floating|Evergreen Point|SR 520", "Astoria–Megler|Astoria Megler",
      "St. Johns|St Johns", "Fremont", "Tilikum Crossing|Tilikum", "Sundial", "Eads", "Stan Musial Veterans Memorial|Stan Musial",
      "Chain of Rocks", "John A. Roebling Suspension|Roebling Suspension|Cincinnati–Covington", "Ambassador", "Zakim|Leonard P. Zakim|Bunker Hill",
      "Arthur Ravenel Jr.|Ravenel|Cooper River", "Hernando de Soto|De Soto", "Crescent City Connection|Greater New Orleans", "Huey P. Long",
      "Fred Hartman", "Mike O'Callaghan–Pat Tillman Memorial|Hoover Dam Bypass|O'Callaghan-Tillman", "New River Gorge", "Royal Gorge",
      "Natchez Trace Parkway", "Penobscot Narrows", "Smithfield Street", "Roberto Clemente", "Sidney Lanier", "Talmadge Memorial",
      "Dames Point|Napoleon Bonaparte Broward", "Gordie Howe International|Gordie Howe", "Jacques Cartier", "Samuel De Champlain|Champlain",
      "Lions Gate", "Port Mann", "Alex Fraser", "Angus L. Macdonald|Macdonald", "Peace Bridge|Peace",
      "Ponte Juscelino Kubitschek|JK Bridge|Juscelino Kubitschek", "Octávio Frias de Oliveira|Octavio Frias", "Hercílio Luz|Hercilio Luz",
      "Zárate–Brazo Largo|Zarate Brazo Largo", "General Rafael Urdaneta|Rafael Urdaneta|Maracaibo", "Centennial|Puente Centenario|Centenario",
      "Bridge of the Americas|Puente de las Americas|Americas", "Atlantic|Puente Atlántico|Atlantico", "Baluarte", "Chacao",
      "Q'eswachaka|Keshwa Chaca|Queshuachaca|Inca rope bridge",
      // Europe
      "Waterloo", "Blackfriars", "Albert", "Chelsea", "Hammersmith", "Battersea", "Southwark", "Vauxhall", "Lambeth", "Putney",
      "Second Severn Crossing|Prince of Wales", "Menai Suspension|Menai", "Britannia", "Pontcysyllte Aqueduct|Pontcysyllte",
      "Forth Road", "Queensferry Crossing|Queensferry", "Skye", "Kessock", "Tees Transporter|Middlesbrough Transporter", "Tyne",
      "Gateshead Millennium|Blinking Eye|Winking Eye", "Royal Border", "Ribblehead Viaduct|Ribblehead", "Samuel Beckett",
      "Ha'penny|Halfpenny|Liffey", "Pont des Arts", "Pont Saint-Bénézet|Pont d'Avignon|Avignon|Saint-Benezet", "Pont Valentré|Valentre",
      "Garabit Viaduct|Garabit", "Pont de Normandie|Normandie", "Pont de Tancarville|Tancarville", "Saint-Nazaire|Pont de Saint-Nazaire",
      "Île de Ré|Ile de Re", "Bir-Hakeim|Pont de Bir-Hakeim", "Pont Mirabeau|Mirabeau", "Köhlbrand|Kohlbrand", "Fehmarnsund|Fehmarn Sound",
      "Müngsten|Mungsten", "Göltzsch Viaduct|Goltzsch|Göltzschtalbrücke", "Oberbaum|Oberbaumbrücke", "Glienicke|Bridge of Spies",
      "Hohenzollern", "Krämerbrücke|Kramerbrucke|Merchants' Bridge", "Stone Bridge Regensburg|Steinerne Brücke|Regensburg",
      "Rakotzbrücke|Rakotz", "Magere Brug|Skinny Bridge", "Zeeland|Zeelandbrug", "Willemsbrug|Willems", "Van Brienenoord|Brienenoord",
      "Salginatobel", "Sunniberg", "Ganter", "Landwasser Viaduct|Landwasser", "Charles Kuonen Suspension|Charles Kuonen", "Europabrücke|Europa",
      "Ponte della Costituzione|Constitution Bridge Venice", "Ponte Sant'Angelo|Sant'Angelo|Aelian", "Ponte Milvio|Milvian",
      "Ponte Fabricio|Fabricius", "Genoa San Giorgio|Ponte San Giorgio|San Giorgio", "Ponte della Libertà|Liberta",
      "Puente de Alcántara|Alcantara", "Puente Nuevo|Ronda", "Puente de Triana|Triana|Isabel II", "Alamillo|Puente del Alamillo",
      "Vizcaya|Bizkaia|Biscay|Puente de Vizcaya", "Constitution of 1812|La Pepa|Cadiz", "Roman bridge of Córdoba|Cordoba Roman bridge|Puente Romano",
      "Zubizuri", "Rande|Puente de Rande", "Dom Luís I|Dom Luis|Luiz I", "Maria Pia", "Arrábida|Arrabida", "516 Arouca|Arouca",
      "Elisabeth|Erzsébet|Erzsebet", "Liberty Bridge Budapest|Szabadság|Szabadsag", "Margaret|Margit", "Most SNP|UFO Bridge|SNP",
      "Mehmed Paša Sokolović|Mehmed Pasa Sokolovic|Visegrad|Bridge on the Drina|Drina", "Ada|Ada Bridge", "Crimean|Kerch|Kerch Strait",
      "Golden Horn|Zolotoy", "Palace Bridge|Dvortsovy", "Galata", "Fatih Sultan Mehmet|Second Bosphorus", "Yavuz Sultan Selim|Third Bosphorus",
      "Osman Gazi|Izmit Bay", "Little Belt|Lillebaelt|Lillebælt", "Storstrøm|Storstrom", "Svinesund", "Hardanger", "Tjeldsund",
      "Storseisundet|Atlantic Ocean Road", "Högakustenbron|High Coast|Hoga Kusten",
      // Middle East & Africa
      "Khaju", "Si-o-se-pol|Si-o-se pol|Allahverdi Khan|33 Arches", "Chords Bridge|Bridge of Strings|Jerusalem Chords",
      "Sheikh Zayed", "Al Maqta|Maqta", "King Fahd Causeway|King Fahd", "Sheikh Jaber Al-Ahmad Al-Sabah Causeway|Jaber Causeway|Sheikh Jaber",
      "Suez Canal Bridge|Al Salam|Mubarak Peace|Egyptian-Japanese Friendship", "6th October|October 6", "Qasr El Nil|Kasr al-Nil",
      "Nelson Mandela|Mandela", "Third Mainland", "Eko", "Matadi", "Maputo–Katembe|Maputo Katembe|Katembe", "Nyerere|Kigamboni",
      "Kazungula",
      // Asia & Oceania
      "Stonecutters", "Ting Kau", "Kap Shui Mun", "Shenzhen Bay", "Jiangyin", "Sutong", "Runyang", "Xihoumen", "Lupu", "Nanpu", "Yangpu",
      "Chaotianmen", "Nanjing Yangtze River|Nanjing Yangtze", "Wuhan Yangtze River|Wuhan Yangtze", "Jiaozhou Bay|Qingdao Haiwan",
      "Donghai|East Sea Bridge", "Zhaozhou|Anji", "Sidu River|Siduhe|Si Du River", "Beipanjiang", "Pingtang", "Qiantang River|Qiantang",
      "Tianjin Grand", "Weinan Weihe Grand|Weinan Weihe", "Cangde Grand|Cangde", "Langfang–Qingxian|Beijing Grand",
      "Seto Ohashi|Seto-Ohashi|Great Seto", "Tatara", "Kurushima-Kaikyō|Kurushima Kaikyo|Kurushima", "Meiko Triton|Meiko", "Yokohama Bay",
      "Kanmon", "Nihonbashi", "Shinkyo|Shin-kyo|Sacred Bridge", "Tsunoshima", "Eshima Ohashi|Eshima", "Megane|Meganebashi|Spectacles Bridge",
      "Togetsukyō|Togetsukyo|Togetsu-kyo", "Kachidoki", "Ōnaruto|Onaruto|Great Naruto", "Hakuchō|Hakucho",
      "Incheon", "Gwangan|Diamond Bridge", "Banpo|Moonlight Rainbow Fountain", "Seohae", "Yi Sun-sin",
      "Second Penang|Sultan Abdul Halim Muadzam Shah", "Seri Wawasan", "Putra", "Henderson Waves", "Cavenagh", "Anderson", "Elgin",
      "Suramadu", "Ampera", "Barelang", "Kutai Kartanegara|Mahakam", "Dragon Bridge|Cau Rong|Dragon", "Long Biên|Long Bien", "Cần Thơ|Can Tho",
      "Mỹ Thuận|My Thuan", "Nhật Tân|Nhat Tan|Vietnam–Japan Friendship", "Bãi Cháy|Bai Chay", "Japanese Covered Bridge|Chua Cau|Hoi An",
      "Rama VIII", "Bhumibol|Industrial Ring Road", "Rama IX", "Memorial Bridge|Phra Phutthayotfa", "Thai–Lao Friendship|Friendship Bridge",
      "U Bein", "Gokteik Viaduct|Gokteik|Goteik", "Tsubasa|Neak Loeung", "Chroy Changvar|Cambodia–Japan Friendship",
      "Mahatma Gandhi Setu|Gandhi Setu", "Vidyasagar Setu|Second Hooghly", "Pamban|Annai Indira Gandhi", "Chenab", "Anji Khad",
      "Bogibeel", "Bhupen Hazarika Setu|Dhola–Sadiya|Dhola Sadiya", "Lakshman Jhula", "Ram Jhula", "Godavari Arch|Godavari",
      "Signature Bridge|Delhi Signature", "Padma", "Jamuna|Bangabandhu", "Attock", "Hussaini Hanging|Hussaini", "Lansdowne",
      "Story", "Anzac", "Gladesville", "Bolte", "Tasman", "Auckland Harbour", "West Gate|Westgate", "Hornibrook", "Iron Cove"
    ],
    supertall: [
      // Philippines (long tail not already curated)
      "Puente Colgante|Clavería Bridge", "Puente de España|Puente Grande", "Pandacan", "Quirino Bridge|Banaoang", "Biliran",
      "Diosdado Macapagal|Macapagal Bridge Butuan", "Ysalina", "Samal Island–Davao City Connector|Samal–Davao|SIDC",
      "Bamban", "Kalayaan Bridge", "Mabini Bridge",
      // more of the world
      "Tower Bridge Sacramento", "Gerald Desmond", "Golden Ears",
      "Kinzua", "Hintze Ribeiro", "Morbi|Jhulto Pul|Machchhu", "Majerhat", "Vivekananda Flyover",
      "Seongsu", "Puente Pumarejo|Pumarejo", "Rosario–Victoria|Rosario Victoria", "Orinoquia|Orinoco", "Angostura", "Puente de Occidente|Occidente",
      "Ponte di Tiberio|Tiberius", "Ponte del Diavolo|Devil's Bridge", "Puente de Segovia|Segovia", "Pont Royal", "Pont du Diable",
      "Passerelle Simone-de-Beauvoir|Simone de Beauvoir", "Hochmoselbrücke|High Moselle", "Waalbrug|Waal", "Moerdijk",
    ]
  },

  /* ===================== BRIDGES IN THE PHILIPPINES ===================== */
  "ph-bridges": {
    skyscraper: ["Pandacan", "Quirino Bridge|Banaoang", "Biliran", "Diosdado Macapagal|Macapagal Bridge Butuan", "Puente de España|Puente Grande"],
    supertall: ["Ysalina", "Kalayaan Bridge", "Mabini Bridge"]
  },

  /* ===================== REAL DAMS (world + Philippines) ===================== */
  "famous-dams": {
    highrise: [
      "Gatun", "Akosombo", "Sayano-Shushenskaya|Sayano Shushenskaya", "Gezhouba", "Xiaolangdi", "Tucuruí|Tucurui",
      "Bonneville", "Fontana", "Norris", "Nagarjuna Sagar", "Idukki", "Mettur"
    ],
    skyscraper: [
      // Africa & Middle East
      "Cahora Bassa", "Inga|Inga Falls", "Gibe III|Gilgel Gibe III", "Merowe", "Roseires", "Owen Falls|Nalubaale", "Kainji", "Katse",
      "Gariep", "Kafue Gorge", "Tekezé|Tekeze", "Aswan Low|Old Aswan", "Keban", "Karakaya", "Ilısu|Ilisu", "Deriner", "Birecik", "Mosul",
      "Haditha", "Tabqa|Euphrates Dam|Tabqa Dam", "Karun-3|Karun III", "Dez", "Karkheh", "Gotvand",
      // Asia
      "Xiluodu", "Baihetan", "Wudongde", "Xiangjiaba", "Longtan", "Ertan", "Danjiangkou", "Sanmenxia", "Liujiaxia", "Shuibuya", "Nuozhadu", "Laxiwa",
      "Nam Theun 2", "Xayaburi", "Bakun", "Kenyir", "Batang Ai", "Jatiluhur", "Cirata", "Saguling", "Krishna Raja Sagara|KRS", "Tungabhadra",
      "Koyna", "Srisailam", "Indira Sagar", "Mullaperiyar", "Warsak", "Diamer-Bhasha|Diamer Bhasha", "Okutadami", "Sakuma", "Miboro",
      "Tokuyama", "Yagisawa", "Hoa Binh|Hòa Bình", "Son La|Sơn La", "Bhumibol Dam", "Srinagarind",
      // Former USSR
      "Krasnoyarsk", "Bratsk", "Ust-Ilimsk", "Boguchany", "Zeya", "Bureya", "Volzhskaya|Volga Hydroelectric", "Zhiguli|Zhigulyovsk",
      "Dnieper|DniproHES|Dnieprostroi", "Kakhovka", "Toktogul", "Charvak",
      // Europe
      "Kölnbrein|Kolnbrein", "Emosson", "Luzzone", "Edersee|Eder", "Sorpe", "Rappbode", "Alqueva", "Aldeadávila|Aldeadavila", "Almendra",
      "Mequinenza", "Iron Gates|Djerdap|Đerdap", "Vidraru", "Gabčíkovo|Gabcikovo", "Claerwen", "Kielder", "Ladybower", "Derwent",
      "Serre-Ponçon|Serre-Poncon", "Tignes|Chevril", "Roselend", "Vouglans",
      // Oceania
      "Gordon", "Warragamba", "Talbingo", "Eucumbene", "Hume", "Burdekin Falls", "Wivenhoe", "Ord River|Lake Argyle|Ord", "Clyde", "Benmore", "Aviemore",
      // Americas
      "Hungry Horse", "Dworshak", "The Dalles|Dalles", "John Day", "Chief Joseph", "Libby", "Flaming Gorge", "Monticello", "Wilson", "Gavins Point",
      "Oahe", "Garrison", "Fort Randall", "New Melones", "Folsom", "O'Shaughnessy|Hetch Hetchy", "Parker", "Davis", "Elephant Butte",
      "Roosevelt|Theodore Roosevelt", "Kensico", "New Croton|Croton", "W. A. C. Bennett|WAC Bennett|Bennett", "Mica", "Robert-Bourassa|LG-2|Robert Bourassa",
      "Revelstoke", "Churchill Falls", "Site C", "Ilha Solteira", "Sobradinho", "Xingó|Xingo", "Itumbiara", "Furnas", "Yacyretá|Yacyreta",
      "Salto Grande", "El Chocón|Chocon|El Chocon", "Chicoasén|Chicoasen", "Malpaso", "La Yesca", "El Cajón|El Cajon", "Hidroituango|Ituango",
      "Guavio", "Coca Codo Sinclair", "Mazar"
    ],
    supertall: [
      // Philippines long tail
      "Kalayaan Pumped Storage|Kalayaan", "Agus VI",
      // ancient & fun deep cuts
      "Marib|Great Dam of Marib", "Jawa", "Sadd-el-Kafara|Sadd el-Kafara", "Proserpina", "Cornalbo", "Kallanai|Grand Anicut", "Dujiangyan",
      "Lake Homs|Homs", "Shushtar|Band-e Kaisar|Band-e Qaisar",
      // failures and other real dams
      "Teton", "Baldwin Hills", "Kelly Barnes|Toccoa", "Machchhu-II|Machchhu|Morvi", "Brumadinho|Corrego do Feijao|Córrego do Feijão",
      "Fundão|Fundao|Mariana", "Xe-Pian Xe-Namnoy|Xe Pian", "Derna|Wadi Derna|Abu Mansour", "Edenville", "Gleno", "Bouzey",
      "Dale Dyke|Great Sheffield Flood", "Tous", "South Fork|Johnstown",
    ]
  },

  /* ===================== STRUCTURAL FAILURES ===================== */
  "structural-failures": {
    skyscraper: [
      "Morbi Bridge|Jhulto Pul|Machchhu bridge", "Grenfell Tower|Grenfell", "Lotus Riverside|Shanghai toppled building", "Seongsu Bridge|Seongsu",
      "Plasco Building|Plasco", "Edenville Dam|Edenville", "Oroville spillway|Oroville", "Brumadinho dam|Brumadinho", "Derna dams|Derna",
      "Big Dig ceiling|Big Dig", "Sunshine Skyway 1980|Sunshine Skyway", "Kinzua Bridge|Kinzua", "Mianus River Bridge|Mianus",
      "Schoharie Creek Bridge|Schoharie", "Royal Plaza Hotel|Royal Plaza", "Terminal 2E|CDG Terminal 2E|Charles de Gaulle Terminal 2E",
      "Christian College of the Philippines|Cabanatuan school", "Nevada Hotel|Baguio Nevada Hotel", "Magsaysay Bridge Dagupan|Magsaysay Bridge",
      "Cherry Hills|Cherry Hills Subdivision", "Loon Church|Loboc Church", "Baldwin Hills Dam|Baldwin Hills", "Kelly Barnes Dam|Toccoa Falls"
    ],
    supertall: [
      "Great Molasses Flood|Boston Molasses|Molasses", "Knickerbocker Theatre|Knickerbocker", "Ynys-y-Gwas", "Ashtabula River Railroad|Ashtabula",
      "Pemberton Mill", "Skyline Plaza", "Cleddau Bridge|Cleddau", "Hintze Ribeiro|Entre-os-Rios", "Vivekananda Flyover|Vivekananda Road flyover",
      "Majerhat Bridge|Majerhat", "Katowice Trade Hall|Katowice", "Bad Reichenhall ice rink|Bad Reichenhall", "Transvaal Park|Transvaal water park",
      "Basmanny Market|Basmanny", "Machchhu-II Dam|Machchhu dam|Morvi dam", "Mariana dam|Fundão|Fundao|Bento Rodrigues",
      "Xe-Pian Xe-Namnoy|Xe Pian", "Gleno Dam|Gleno", "Bouzey Dam|Bouzey", "Dale Dyke|Great Sheffield Flood|Sheffield Flood", "Tous Dam|Tous",
      "Buffalo Creek|Buffalo Creek flood", "Rosemont Horizon", "Sgt Aubrey Cosens|Aubrey Cosens",
    ]
  },

  /* ===================== CIVIL & STRUCTURAL ENGINEERS ===================== */
  "civil-engineers": {
    highrise: ["Leonardo da Vinci|Da Vinci|Leonardo", "Ferdinand de Lesseps|de Lesseps|Lesseps", "George Washington Goethals|Goethals", "James Eads|Eads", "Vitruvius"],
    skyscraper: [
      "Marc Isambard Brunel|Marc Brunel", "Robert Stephenson", "George Stephenson", "John Rennie", "James Brindley", "William Jessop",
      "John Frank Stevens", "Ellis Chesbrough|Chesbrough", "Charles Ellet|Ellet", "Gustav Lindenthal|Lindenthal", "Leon Moisseiff|Moisseiff",
      "David Steinman|Steinman", "Ralph Modjeski|Modjeski", "Theodore Cooper", "John Fowler", "William LeMessurier|LeMessurier",
      "T. Y. Lin|Tung-Yen Lin|TY Lin", "William F. Baker|Bill Baker", "Eduardo Torroja|Torroja", "Riccardo Morandi|Morandi",
      "Michel Virlogeux|Virlogeux", "Frei Otto", "Buckminster Fuller|Fuller", "Cecil Balmond|Balmond", "Ted Happold|Happold",
      "Filippo Brunelleschi|Brunelleschi", "Mimar Sinan|Sinan", "Sextus Julius Frontinus|Frontinus", "Apollodorus of Damascus|Apollodorus",
      "E. Sreedharan|Sreedharan", "Nathan Newmark|Newmark", "Alec Skempton|Skempton", "Laurits Bjerrum|Bjerrum", "Ray Clough|Clough",
      "Anil Chopra|Chopra", "Thomas Paulay|Paulay", "Robert Park", "Mete Sozen|Sozen", "Karl Culmann|Culmann", "Henry Darcy|Darcy",
      "Robert Manning|Manning", "Benjamin Latrobe|Latrobe", "John B. Jervis|Jervis", "Loammi Baldwin", "Charles Ellis", "Conde McCullough|McCullough",
      "John A. L. Waddell|Waddell", "Squire Whipple|Whipple", "Arthur Vierendeel|Vierendeel", "Hal Iyengar|Iyengar", "Alfredo Juinio|Juinio"
    ],
    supertall: [
      "Li Bing", "Li Chun", "Anton Tedesko|Tedesko", "Mamoru Kawaguchi|Kawaguchi", "Mutsuro Sasaki", "Sir John Wolfe Barry|Wolfe Barry",
      "Benjamin Wright", "Henri Pitot|Pitot", "Wilhelm Ritter", "Emil Mörsch|Morsch", "François Hennebique|Hennebique", "Joseph Monier|Monier",
    ]
  },

  /* ===================== PHILIPPINE ROADS ===================== */
  "ph-roads": {
    highrise: ["Taft Avenue|Taft", "España Boulevard|Espana|España", "Quezon Avenue|Quezon Ave", "Shaw Boulevard|Shaw", "Katipunan", "C-3|Circumferential Road 3",
               "C-4|Circumferential Road 4", "Ayala Avenue|Ayala", "Gil Puyat|Buendia|Sen. Gil Puyat", "Alabang–Zapote|Alabang Zapote", "Sucat"],
    skyscraper: ["NLEX Harbor Link|Harbor Link", "Skyway Stage 3", "C-6|Circumferential Road 6", "R-10|Radial Road 10", "Rizal Avenue",
                 "Mindanao Avenue", "Daang Hari", "Governor's Drive|Governors Drive", "Tagaytay–Nasugbu|Tagaytay Nasugbu", "Manila South Road",
                 "Plaridel Bypass", "Mactan Circumferential Road", "Cebu Transcentral Highway|Transcentral", "Cebu North Coastal|North Coastal",
                 "Davao City Coastal Road|Davao Coastal Road", "Sayre Highway|Sayre", "Butuan–Cagayan de Oro–Iligan Road|BCIR",
                 "Aspiras–Palispis Highway|Aspiras Palispis", "Naguilian Road|Naguilian", "Jose Abad Santos Avenue|JASA",
                 "Olongapo–Gapan Road|Olongapo Gapan|Gapan–San Fernando–Olongapo|GSO", "Ninoy Aquino Avenue", "Macapagal Boulevard|Diosdado Macapagal Boulevard",
                 "Kalayaan Avenue", "Pasig Boulevard", "Ortigas Avenue Extension|Ortigas Extension", "Tandang Sora", "Visayas Avenue",
                 "Congressional Avenue", "Quirino Highway", "Regalado Avenue", "A. Bonifacio Avenue|Bonifacio Avenue"],
    supertall: ["Andaya Highway|Andaya", "Asin Road", "Iloilo Circumferential Road", "NAIA Road", "Batasan Road"]
  },

  /* ===================== CE SOFTWARE ===================== */
  "ce-software": {
    highrise: ["MicroStation|Bentley MicroStation", "Google Earth", "QGIS", "Rhino|Rhinoceros", "ArchiCAD", "Lumion", "BIM 360|Autodesk Construction Cloud|ACC",
               "Bluebeam|Bluebeam Revu", "Procore", "Dynamo", "3ds Max|3D Studio Max", "Blender", ],
    skyscraper: ["CSiBridge|CSI Bridge", "RAM Structural System|RAM", "SCIA Engineer|SCIA", "RFEM|Dlubal RFEM", "RSTAB", "Advance Steel", "IDEA StatiCa|IDEA",
                 "spColumn", "spSlab", "S-FRAME", "Tekla Tedds|Tedds", "OpenRoads Designer|OpenRoads", "InRoads", "InfraWorks", "Allplan", "BricsCAD",
                 "Carlson Civil|Carlson", "Trimble Business Center|TBC", "Leica Infinity", "Pix4D", "Agisoft Metashape|Metashape|PhotoScan", "DJI Terra",
                 "Global Mapper", "HEC-HMS", "HEC-GeoRAS", "MIKE 11|MIKE+|MIKE", "FLO-2D", "InfoWorks ICM|InfoWorks", "WaterGEMS", "WaterCAD", "SewerGEMS",
                 "StormCAD", "FLAC", "Slide|Slide2|Rocscience Slide", "RS2|Phase2", "Settle3", "LPILE", "AllPile", "DEEPSOIL", "SHAKE|SHAKE2000",
                 "PTV Vissim|Vissim", "PTV Visum|Visum", "SIDRA Intersection|SIDRA", "Aimsun", "TransCAD", "Highway Capacity Software|HCS", "AutoTURN",
                 "Aconex|Oracle Aconex", "PlanSwift", "CostX", "Mathematica", "Maple", "GNU Octave|Octave", "Scilab", "LabVIEW", "COMSOL",
                 "LS-DYNA", "Strand7", "PERFORM-3D|Perform 3D", "SeismoSignal", "Enscape", "Midas Civil", "Midas Gen",],
    supertall: ["DIANA|DIANA FEA", "ATENA", "Response-2000|Response 2000", "Candy", "Struds", "CSiCol", "GROUP", "SAP90", "OpenSTAAD"]
  },

  /* ===================== NAMES ON FORMULAS & METHODS ===================== */
  "named-formulas": {
    highrise: ["Fourier", "Laplace", "Gauss", "Lagrange", "Timoshenko", "von Mises|Von Mises|Mises", "Tresca", "Kirchhoff", "Rayleigh", "Prandtl",
               "Darcy-Weisbach|Weisbach", "Colebrook|Colebrook-White", "Moody", "Theis", "Dupuit", "Hazen", "Bishop", "Fellenius",],
    skyscraper: ["Ritz|Rayleigh-Ritz", "Galerkin", "Newmark", "Duhamel", "Griffith", "Miner|Palmgren-Miner", "Goodman", "Gerber", "Wöhler|Wohler",
                 "Johnson", "Rankine-Gordon|Gordon", "Perry-Robertson|Perry", "Hognestad", "Mander", "Kent-Park", "Thornthwaite", "Penman", "Horton",
                 "Green-Ampt", "Snyder", "Gumbel", "Weibull", "Thiem", "Cooper-Jacob|Jacob", "Forchheimer", "Kozeny-Carman|Kozeny", "Swamee-Jain|Swamee",
                 "Blasius", "Kármán|von Karman|Karman", "Hagen-Poiseuille|Poiseuille", "Bélanger|Belanger", "Lacey", "Kennedy", "Bligh", "Khosla",
                 "Janbu", "Spencer", "Morgenstern-Price|Morgenstern", "Culmann", "Taylor", "Brinch Hansen|Hansen", "Schmertmann", "Burland", "Hiley",
                 "Janssen", "Marston|Marston-Spangler|Spangler", "Burmister", "Fadum", "Strickler|Manning-Strickler", "Greenshields", "Webster",
                 "Wardrop", "Little|Little's law", "Erlang", "Bresler", "Kirsch", "Reissner", "Hvorslev", "Lane", "Cipolletti", "Rehbock", "Bresse"],
    supertall: ["Steinbrenner", "Nordlund", "Tomlinson", "Philip", "Paris", "Pearson|Log-Pearson"]
  }
};
