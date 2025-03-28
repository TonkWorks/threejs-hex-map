export function img(name: string): string {
  return `<img id="menu-unit-cost" src="../../assets/ui/resources/${name}.png">`;
};

export interface Bonus {
    name: string;
    description: string;
  }

export const BonusMap: { [key: string]: Bonus } = {
    manifest_destiny: {
      name: "Manifest Destiny",
      description: `Military land units have <b>+1 sight</b> <b>25% discount</b> on buying tiles (settling cities resets tile purchase cost), purchasing a tile gives <b>25 ${img("production")} production</b> (scaling with era), and can <b>purchase tiles owned by other civilizations</b> at increased cost.`,
    },
    one_thousand_and_one_nights: {
      name: "One Thousand and One Nights",
      description: `When you complete a historic event, gain <b>+1 ${img("culture")} culture</b> and <b>${img("science")} science</b> in the capital, and <b>15%</b> progress towards a random great person.`,
    },
    treasures_of_nineveh: {
      name: "Treasures of Nineveh",
      description: `When you conquer a City, gain either a Technology already known by the owner and not you or, if impossible, a large science boost. All great works give <b>+3 ${img("science")} science</b>.`,
    },
    hapsburg_diplomacy: {
      name: "Hapsburg Diplomacy",
      description: `<b>+50%</b> rewards from city state quests. Can use gold to arrange a marriage with an allied city state (causes influence to not decay, gain <b>1</b> additional delegate in the World Congress, and <b>+15%</b> great person rate in the capital while at peace).`,
    },
    sacrificial_captives: {
      name: "Sacrificial Captives",
      description: `Receive ${img("gold")} <b>gold</b> from each enemy killed. When you complete a favorable peace treaty (<b>25+</b> warscore) begin a golden age.`,
    },
    ingenuity: {
      name: "Ingenuity",
      description: `Receive a free great scientist when you discover Writing. Great Scientists are earned <b>50% faster</b>. Gold investments in buildings reduce their production cost by <b>an additional 15%</b>.`,
    },
    carnival: {
      name: "Carnival",
      description: `When a golden age begins, <b>30%</b> of your golden age points are converted into ${img("gold")} <b>gold</b>, and your cities gain 10 turns of carnival (<b>+25% ${img("culture")} culture</b> and <b>-50%</b> unhappiness from needs during carnival).`,
    },
    phoenician_heritage: {
      name: "Phoenician Heritage",
      description: `<b>+125 ${img("gold")} gold</b> when you found a city (scaling with era). All owned coastal cities receive a free lighthouse. The trade route diversity modifier is <b>either doubled if positive, or halved</b> if it is negative.`,
    },
    druidic_lore: {
      name: "Druidic Lore",
      description: `Has a unique set of pantheon beliefs that no one else can benefit from. Owned cities with your religion can neither generate nor receive religious pressure. <b>+3 ${img("faith")} faith</b> in owned cities where your pantheon or religion are the majority.`,
    },
    mandate_of_heaven: {
      name: "Mandate of Heaven",
      description: `Creating Great Works or gaining cities grants <b>+1 ${img("food")} food</b> and ${img("gold")} <b>gold</b> to all of your cities and starts We Love the Empress Day in all of your cities (provides <b>+10% ${img("food")} food</b>). These bonuses decline by <b>50%</b> every era.`,
    },
    viking_fury: {
      name: "Viking Fury",
      description: `Embarked Units have <b>+1 movement</b> and pay just one movement to disembark. All melee land units gain the Viking promotion (<b>no movement cost to pillage</b>, <b>+25% combat strength</b> on pillaged tiles, and heals <b>+5 HP</b> in neutral territory) and all melee naval units gain the longboat promotion (<b>no movement cost to pillage</b>, <b>+15% combat strength</b> on coastal tiles, and recovers HP <b>twice as fast</b> on coastal tiles).`,
    },
    monument_builders: {
      name: "Monument Builders",
      description: `<b>+20% production</b> towards building wonders, increasing to <b>+40%</b> during Golden Ages. Artifacts give <b>+5 ${img("science")} science</b> and <b>${img("culture")} culture</b>, and Landmarks give <b>+5 ${img("gold")} gold</b> and tourism.`,
    },
    perfidious_albion: {
      name: "Perfidious Albion",
      description: `<b>+1 movement</b> for naval and embarked units. Naval unit gold maintenance reduced by <b>25%</b>. Foreign Spies operate <b>25% slower</b> in your cities. Start the game with a spy, all spies are faster and operate at <b>one rank higher</b> than normal.`,
    },
    solomonic_wisdom: {
      name: "Solomonic Wisdom",
      description: `When you complete a policy branch, adopt new beliefs, or adopt your first ideology, receive a free technology. <b>+1 ${img("faith")} faith</b> from strategic resources.`,
    },
    esprit_de_corps: {
      name: "Esprit De Corps",
      description: `<b>+10%</b> for each subsequent attack against a single target during a turn. When you conquer a City, gain Great Artist, Writer, and Musician Points in your capital, and a temporary boost to production and culture in every city.`,
    },
    blood_and_iron: {
      name: "Blood and Iron",
      description: `<b>+3 ${img("culture")} culture</b> in the capital per city state ally, and <b>+3 ${img("science")} science</b> in the capital per friend, both scaling with era. Gain <b>+1 influence</b> per turn for each unit gifted to a city state (lost when killed or upgraded).`,
    },
    hellenic_league: {
      name: "Hellenic League",
      description: `City State Influence decays at <b>half</b> and recovers at <b>double</b> the normal rate. Each City State alliance gives <b>+5% combat strength</b> to each friendly and allied unit (up to a maximum of <b>25%</b>). City State territory considers your units as friendly.`,
    },
    scourge_of_god: {
      name: "Scourge of God",
      description: `Friendly and enemy War Weariness reduced by <b>50%</b>. Your mounted melee and armor units can capture defeated enemy units. Your Cities claim adjacent unowned land tiles when they earn a tile of the same type.`,
    },
    great_andean_road: {
      name: "Great Andean Road",
      description: `Units ignore terrain costs when on hills and may cross mountains. Cities, Roads and Railroads may be built on mountains. Mountains provide ${img("food")} <b>food</b>, ${img("science")} <b>science</b> and ${img("gold")} <b>gold</b> (scaling with era).`,
    },
    font_of_dharma: {
      name: "Font of Dharma",
      description: `Starts the game with a pantheon, and Great Prophets cost <b>35% less</b>. Each Follower of your primary Religion increases Religious Pressure and Growth. Cannot build missionaries.`,
    },
    sumpah_palapa: {
      name: "Sumpah Palapa",
      description: `When you found or conquer a city, one of 3 unique luxury resources spawn next to or underneath the city (cloves, peppers, and nutmeg). <b>+5%</b> to yield and golden age bonuses from global monopolies. <b>+2</b> to yield and happiness from global monopolies.`,
    },
    the_great_warpath: {
      name: "The Great Warpath",
      description: `Units move through forests and jungles as roads, and these tiles establish city connections. Land Units start with the Woodsman promotion (<b>+10% combat strength</b> when defending in rough terrain, move through forests and jungles twice as fast).`,
    },
    shogunate: {
      name: "Shogunate",
      description: `<b>+1 ${img("culture")} culture</b> and ${img("faith")} <b>faith</b> from defense and military training buildings. When a Great General or Admiral is born, gain Great Writer, Artist and Musician points in the capital.`,
    },
    scholars_of_the_jade_hall: {
      name: "Scholars of the Jade Hall",
      description: `<b>+1 ${img("science")} science</b> from all specialists, increasing by <b>1</b> in the Medieval, Industrial and Atomic Eras. <b>+30%</b> Great Person rate during Golden Ages. Gain <b>50</b> golden age points whenever a great person is born (scaling with era).`,
    },
    the_long_count: {
      name: "The Long Count",
      description: `After researching mathematics, receive a free great person at the end of every Mayan Long Count Calendar Cycle (every <b>394 years</b>). You may only choose each great person once.`,
    },
    mongol_terror: {
      name: "Mongol Terror",
      description: `Mounted ranged units get <b>+2 movement</b> and ignore zone of control. <b>+100% yields</b> from bullying city states.`,
    },
    gateway_to_africa: {
      name: "Gateway to Africa",
      description: `<b>+1 to all Yields</b> in your Capital per unique Trade Route partner (scaling with Era). Trade Route Yields to or from Moroccan Cities are not affected by distance. Can plunder Trade Units connected to unowned Cities without needing to declare war.`,
    },
    dutch_east_india_company: {
      name: "Dutch East India Company",
      description: `<b>+3 ${img("gold")} gold</b> and ${img("culture")} <b>culture</b> for every unique luxury resource you import or export to other Civilizations and City States (scaling with era). Can import duplicate resources, and major civilization imports count towards monopolies.`,
    },
    kanuni: {
      name: "Kanuni",
      description: `Completing a trade route grants <b>150 ${img("food")} food and ${img("science")} science</b> to the origin city if international, and <b>+150 ${img("gold")} gold and ${img("culture")} culture</b> if internal. Bonuses scale with era.`,
    },
    achaemenid_legacy: {
      name: "Achaemenid Legacy",
      description: `Golden Ages last <b>50% longer</b>, and <b>10%</b> of your gold income (after expenses) converts into golden age points every turn. During a Golden Age, your units get <b>+1 movement</b> and <b>+15% combat strength</b>.`,
    },
    solidarity: {
      name: "Solidarity",
      description: `Gain a free social policy in the classical era, and <b>one every other era</b> afterwards. Gain <b>2 additional tenets</b> whenever you adopt an ideology for the first time.`,
    },
    wayfinding: {
      name: "Wayfinding",
      description: `Your units can always embark and move over ocean. Embarked units have <b>+1 sight</b>. <b>+2 ${img("food")} food</b> from fishing boats and atolls. Melee naval units can construct fishing boats. <b>No unhappiness</b> from isolation.`,
    },
    mare_clausum: {
      name: "Mare Clausum",
      description: `When a trade unit moves, receive <b>+4 ${img("science")} science</b>, ${img("gold")} <b>gold</b> and great admiral points (for cargo ships) or great general points (for caravans) (scaling with era).`,
    },
    the_glory_of_rome: {
      name: "The Glory of Rome",
      description: `When you conquer a city, the city retains all buildings, and you immediately claim additional territory around the city. <b>+15% production</b> towards buildings already constructed in the capital.`,
    },
    siberian_riches: {
      name: "Siberian Riches",
      description: `All strategic resources provide <b>double</b> their normal quantity (This does not include paper). <b>25% faster</b> border growth. <b>+20 ${img("science")} science</b> whenever you expand your borders naturally (scaling with era).`,
    },
    great_expanse: {
      name: "Great Expanse",
      description: `Founded Cities start with additional territory, and your land units receive a <b>15% combat bonus</b> when fighting in friendly territory. All Recon units may choose rewards from ancient ruins.`,
    },
    father_governs_children: {
      name: "Father Governs Children",
      description: `Influence with city states starts at 40. Yields from friendly and allied city states increased by <b>100%</b>. <b>+25% combat strength</b> of allied City State capitals. <b>+10 XP</b> to units gifted by City States.`,
    },
    river_warlord: {
      name: "River Warlord",
      description: `<b>Triple ${img("gold")} gold</b> from pillaging barbarian encampments and cities. Land units gain the Amphibious promotion, and move along rivers as if they were roads. Rivers create city connections.`,
    },
    reconquista: {
      name: "Reconquista",
      description: `Gaining tiles generates ${img("gold")} <b>gold</b> and ${img("faith")} <b>faith</b> scaling with era. Inquisitors are stronger, unlock earlier, and you gain a <b>free inquisitor</b> when you conquer a city. May purchase naval units with faith.`,
    },
    lion_of_the_north: {
      name: "Lion of the North",
      description: `Land melee units have <b>+20% combat strength</b> when attacking. Siege units have <b>+1 movement</b>. Units gain <b>+15 XP</b> and are fully healed whenever a great general is born. The great general bonus is increased by <b>15%</b>.`,
    },
    serenissima: {
      name: "Serenissima",
      description: `Cannot found or annex cities. Trade route cap is doubled, and all target restrictions are removed. Receives a free Merchant of Venice after researching Trade. Puppet cities have <b>-30%</b> to their yield penalties, and you can spend gold in them. All puppet cities gain happiness like normal cities.`,
    },
    ilkwa: {
      name: "Ilkwa",
      description: `Melee and Gun units require <b>50% less</b> gold maintenance, and all units require <b>25% less XP</b> to get to their next promotion. Your military is <b>50% more effective</b> at intimidating City States. Ignores Alliance and Protection penalties when bullying.`,
    },
};