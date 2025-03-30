define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WonderMap = exports.BuildingMap = void 0;
    const materialCache = new Map();
    exports.BuildingMap = {
        "granary": {
            name: "Granary",
            cost: 75,
            tech_required: "",
            building_required: "",
            description: "Increases food +2, +1 Food from Wheat, Bananas, and Deer",
            yields: {
                food: 2
            }
        },
        "library": {
            name: "Library",
            cost: 75,
            tech_required: "Writing",
            building_required: "",
            description: "+1 Science for every 2 Citizens in the City, required to build the National College",
            yields: {
                research: 1
            }
        },
        "water_mill": {
            name: "Water Mill",
            cost: 75,
            tech_required: "The Wheel",
            building_required: "",
            description: "+2 Food, +1 Production, requires a River",
            yields: {
                food: 2,
                production: 1
            }
        },
        "workshop": {
            name: "Workshop",
            cost: 100,
            tech_required: "Metal Casting",
            building_required: "",
            description: "+2 Production, +10% Production in the City, required to build the Ironworks",
            yields: {
                production: 2
            }
        },
        "university": {
            name: "University",
            cost: 200,
            tech_required: "Education",
            building_required: "Library",
            description: "+33% Science in the City, +2 Science from Jungle tiles",
            yields: {
                research: 2
            }
        },
        "market": {
            name: "Market",
            cost: 100,
            tech_required: "Currency",
            building_required: "",
            description: "+25% Gold in the City, +2 Gold, required to build the Bank",
            yields: {
                gold: 2
            }
        },
        "bank": {
            name: "Bank",
            cost: 200,
            tech_required: "Banking",
            building_required: "Market",
            description: "+25% Gold in the City, +2 Gold, required to build the Stock Exchange",
            yields: {
                gold: 2
            }
        },
        "stock_exchange": {
            name: "Stock Exchange",
            cost: 300,
            tech_required: "Economics",
            building_required: "Bank",
            description: "+33% Gold in the City, +3 Gold",
            yields: {
                gold: 3
            }
        },
        "hospital": {
            name: "Hospital",
            cost: 400,
            tech_required: "Biology",
            building_required: "",
            description: "+5 Food",
            yields: {
                food: 5
            }
        },
        "factory": {
            name: "Factory",
            cost: 300,
            tech_required: "Industrialization",
            building_required: "",
            description: "+4 Production, +25% Production in the City, requires Coal",
            yields: {
                production: 4
            }
        },
        "research_lab": {
            name: "Research Lab",
            cost: 500,
            tech_required: "Plastics",
            building_required: "University",
            description: "+50% Science in the City, +4 Science, requires Aluminum",
            yields: {
                research: 4
            }
        },
        "circus": {
            name: "Circus",
            cost: 75,
            tech_required: "Trapping",
            building_required: "",
            description: "+2 Happiness, requires Horses or Ivory nearby",
            yields: {
                happiness: 2
            }
        },
        "colosseum": {
            name: "Colosseum",
            cost: 100,
            tech_required: "Construction",
            building_required: "",
            description: "+2 Happiness, required to build the Stadium",
            yields: {
                happiness: 2
            }
        },
        "theater": {
            name: "Theater",
            cost: 200,
            tech_required: "Printing Press",
            building_required: "Colosseum",
            description: "+3 Happiness",
            yields: {
                happiness: 3
            }
        },
        "stadium": {
            name: "Stadium",
            cost: 500,
            tech_required: "Telecommunications",
            building_required: "Colosseum",
            description: "+4 Happiness",
            yields: {
                happiness: 4
            }
        },
    };
    exports.WonderMap = {
        "great_library": {
            name: "Great Library",
            cost: 185,
            tech_required: "Writing",
            building_required: "",
            description: "Free Technology, +3 Science, free Library in the city",
            yields: {
                research: 3
            }
        },
        "hanging_gardens": {
            name: "Hanging Gardens",
            cost: 250,
            tech_required: "Mathematics",
            building_required: "",
            description: "+6 Food, Free Garden in the city",
            yields: {
                food: 6
            }
        },
        "pyramids": {
            name: "Pyramids",
            cost: 185,
            tech_required: "Masonry",
            building_required: "",
            description: "+2 Culture, 2 free Workers",
            yields: {
                culture: 2
            }
        },
        "oracle": {
            name: "Oracle",
            cost: 250,
            tech_required: "Philosophy",
            building_required: "",
            description: "+3 Culture, Free Social Policy",
            yields: {
                culture: 3
            }
        },
        "notre_dame": {
            name: "Notre Dame",
            cost: 500,
            tech_required: "Physics",
            building_required: "",
            description: "+10 Happiness",
            yields: {
                happiness: 10,
            }
        },
        "machu_picchu": {
            name: "Machu Picchu",
            cost: 500,
            tech_required: "Engineering",
            building_required: "",
            description: "+25% Gold from City Connections, +5 Gold, must be built on a Mountain",
            yields: {
                gold: 5
            }
        },
        "petra": {
            name: "Petra",
            cost: 500,
            tech_required: "Currency",
            building_required: "",
            description: "+1 Production and +1 Food on Desert tiles, +6 Gold",
            yields: {
                gold: 6
            }
        },
        "chichen_itza": {
            name: "Chichen Itza",
            cost: 500,
            tech_required: "Civil Service",
            building_required: "",
            description: "+4 Happiness, Golden Ages last 50% longer",
            yields: {
                happiness: 4
            }
        },
        "taj_mahal": {
            name: "Taj Mahal",
            cost: 625,
            tech_required: "Architecture",
            building_required: "",
            description: "Triggers a Golden Age, +3 Culture",
            yields: {
                culture: 3
            }
        },
        "big_ben": {
            name: "Big Ben",
            cost: 625,
            tech_required: "Industrialization",
            building_required: "",
            description: "+2 Gold, -15% purchase cost of units/buildings with Gold",
            yields: {
                gold: 2
            }
        },
        "statue_of_liberty": {
            name: "Statue of Liberty",
            cost: 1060,
            tech_required: "Plastics",
            building_required: "",
            description: "+1 Production per Specialist"
        },
        "eiffel_tower": {
            name: "Eiffel Tower",
            cost: 1060,
            tech_required: "Radio",
            building_required: "",
            description: "+12 Happiness",
            yields: {
                happiness: 12
            }
        },
    };
});
//# sourceMappingURL=CityImprovements.js.map