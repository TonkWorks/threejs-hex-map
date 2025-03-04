import { asset } from "./util";

const materialCache = new Map();

export interface CityImprovement {
    name: string;
    description: string;
    menu_image: string;
    tech_requirements: string[];
}

export const BuildingMap: {[key: string]: any } = {
    "granary": {
        name: "Granary",
        cost: 300,
        description: "Increases food production by 10%",
        menu_image: "../../assets/ui/units/city.png",
    },
    "market": {
        name: "Market",
        cost: 300,
        description: "Increases gold production by 10%",
        menu_image: "../../assets/ui/units/city.png",
    },
    "watermill": {
        name: "Watermill",
        cost: 300,
        description: "Increases production by 20%",
        menu_image: "../../assets/ui/units/city.png",
    },
}

export const WonderMap: {[key: string]: any } = {}