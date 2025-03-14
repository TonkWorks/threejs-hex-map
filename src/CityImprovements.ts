import { asset } from "./util";

const materialCache = new Map();

export interface CityImprovement {
    name: string;
    description: string;
    menu_image: string;
    tech_requirements: string[];
    yields: {
        food?: number;
        production?: number;
        gold?: number;
        research?: number;
    };
}

export const BuildingMap: {[key: string]: any } = {
    "granary": {
        name: "Granary",
        cost: 300,
        description: "Increases food +2",
        menu_image: "../../assets/ui/units/city.png",
        yields: {
            food: 2,
        },
    },
    "market": {
        name: "Market",
        cost: 300,
        description: "Increases gold +1",
        menu_image: "../../assets/ui/units/city.png",
        yields: {
            gold: 1,
        },
    },
    "watermill": {
        name: "Watermill",
        cost: 300,
        description: "Increases food +2 and production +1",
        menu_image: "../../assets/ui/units/city.png",
        yields: {
            food: 2,
            production: 1,
        },
    },
    "library": {
        name: "Library",
        cost: 300,
        description: "Increases research +2",
        menu_image: "../../assets/ui/units/city.png",
        yields: {
            research: 2,
        },
    },
}

export const WonderMap: {[key: string]: any } = {}