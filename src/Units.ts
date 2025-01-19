import { PerspectiveCamera, Scene, WebGLRenderer, Vector3, Group, Camera, Mesh, BoxBufferGeometry, MeshBasicMaterial, Object3D, RingBufferGeometry, CanvasTexture, Sprite, SpriteMaterial, LinearFilter } from 'three';
import { CSS2DRenderer, CSS2DObject } from './CSS2DRenderer';

import MapView from './MapView';
import { Player } from './GameState'; // Adjust the import path as necessary
import { TileData } from './interfaces';


      
export interface Unit {
    id: string; // Unique identifier
    type: string; // Unit type (e.g., "warrior", "archer", "settler")
    health: number; // Health points
    health_max: number; // Max Health points
    name: string; // Name of the unit
    image: string; // Image URL
    movement_max: number; // Max movement points
    attack_range: number; // Attack range
    cost: number; // Production cost
    attack: number; // Attack points
    defence: number; // Defence points

    movement: number; // Remaining movement points
    movementOrders?: {
        q: number;
        r: number;
    };
    kills: number; // Number of kills
    owner: string; // Player or faction ID
    model?: Mesh; // Reference to the 3D model in the scene
    tile?: TileData; // Reference to the tile the unit is on
}


export function CreateSettler(player: Player): Unit {
    const unitType = "settler"
    const unitModel = new Mesh(
        new BoxBufferGeometry(.8, 1, 1),
        new MeshBasicMaterial({ 
            color: player.color,
            opacity: .85,
            transparent: true,
            side: THREE.DoubleSide,
        })
    );
    const name = "Settler " + toRoman(1);
    let unit = {
        id: `${player.name}_${unitType}_${unitModel.uuid}`,
        type: unitType,
        name: name,
        health: 1,
        health_max: 10,
        cost: 300,
        movement: 4,
        movement_max: 4,
        attack_range: 0,
        attack: 0,
        defence: 0,
        kills: 0,
        image: "/assets/rifleman.webp",
        owner: player.name,
        model: unitModel,
    };
    return unit;
}

export function AddUnitLabel(unitModel:Mesh, unitID: string, icon:string, color:string) {
    const labelDiv = document.createElement('div');
    labelDiv.className = 'unit-label';
    labelDiv.id = unitID;
    labelDiv.innerHTML = `
    <div style="position: relative; display: inline-block;">
        <img src="${icon}" style="width: 90px; height: 100px; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);">
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: ${color}; mix-blend-mode: color; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);"></div>
    </div>
    `;

    labelDiv.style.fontFamily = 'Arial, sans-serif';

    const unitLabel = new CSS2DObject(labelDiv);
    unitLabel.position.set(0, 0, 0);
    unitModel.add(unitLabel);

}
export function CreateRifleman(player: Player): Unit {
    const unitType = "rifleman"
    const unitModel = new Mesh(
        new BoxBufferGeometry(.4, .4, .4),
        new MeshBasicMaterial({ 
            color: player.color,
            opacity: .85,
            transparent: true,
            side: THREE.DoubleSide,
        })
    );


    const unitID =  `${player.name}_${unitType}_${unitModel.uuid}`;
    const name = "Rifleman Company " + toRoman(1);

    this.AddUnitLabel(unitModel, unitID, "/assets/map_icons/rifleman.png", player.color);

    let unit = {
        id:unitID,
        type: unitType,
        name: name,
        health: 10,
        health_max: 10,
        movement: 3,
        movement_max: 3,
        attack_range: 1,
        cost: 100,
        attack: 3,
        defence: 0,
        kills: 0,
        image: "/assets/rifleman.webp",
        owner: player.name,
        model: unitModel,
    };
    return unit;
}

export function CreateCavalry(player: Player): Unit {
    const unitType = "cavalry"
    const unitModel = new Mesh(
        new BoxBufferGeometry(.4, .4, .4),
        new MeshBasicMaterial({ 
            color: player.color,
            opacity: .85,
            transparent: true,
            side: THREE.DoubleSide,
        })
    );

    const unitID =  `${player.name}_${unitType}_${unitModel.uuid}`;
    this.AddUnitLabel(unitModel, unitID, "/assets/map_icons/horse.png", player.color);

    const name = "Cavalry " + toRoman(1);
    let unit = {
        id: unitID,
        type: unitType,
        name: name,
        health: 10,
        health_max: 10,
        movement: 6,
        movement_max: 6,
        attack_range: 1,
        cost: 200,
        attack: 3,
        defence: 0,
        kills: 0,
        image: "/assets/rifleman.webp",
        owner: player.name,
        model: unitModel,
    };
    return unit;
}

export function CreateArtillary(player: Player): Unit {
    const unitType = "artillary"
    const unitModel = new Mesh(
        new BoxBufferGeometry(.4, .4, .4),
        new MeshBasicMaterial({ 
            color: player.color,
            opacity: .85,
            transparent: true,
            side: THREE.DoubleSide,
        })
    );

    const unitID =  `${player.name}_${unitType}_${unitModel.uuid}`;
    this.AddUnitLabel(unitModel, unitID, "/assets/map_icons/artillary.png", player.color);

    const name = "Artillary Company " + toRoman(1);
    let unit = {
        id: `${player.name}_${unitType}_${unitModel.uuid}`,
        type: unitType,
        name: name,
        health: 10,
        health_max: 10,
        cost: 300,
        movement: 2,
        movement_max: 2,
        attack_range: 3,
        attack: 3,
        defence: 0,
        kills: 0,
        image: "/assets/rifleman.webp",
        owner: player.name,
        model: unitModel,
    };
    return unit;
}

// const loader = new THREE.GLTFLoader();
// loader.load('/models/warrior.glb', (gltf) => {
//     const model = gltf.scene;
//     model.position.set(0, 0, 0); // Initial position
//     scene.add(model);

//     // Link the model to the unit
//     warrior.model = model;
// });


const americanCities = [
    "Washington",
    "New York",
    "Boston",
    "Philadelphia",
    "Atlanta",
    "Chicago",
    "San Francisco",
    "Los Angeles",
    "Houston",
    "Miami",
    "Seattle",
    "Dallas",
    "Denver",
    "Detroit",
    "Phoenix",
    "San Diego",
    "San Antonio",
    "Las Vegas",
    "St. Louis",
    "Baltimore",
    "Cleveland",
    "Pittsburgh",
    "Minneapolis",
    "Kansas City",
    "New Orleans",
    "Austin",
    "Nashville",
    "Charlotte",
    "Salt Lake City",
    "Portland",
    "Indianapolis",
    "Cincinnati",
    "Buffalo",
    "Oklahoma City",
    "Albuquerque",
    "Tucson",
    "Memphis",
    "Milwaukee",
    "Orlando",
    "Tampa",
    "Sacramento",
    "Columbus",
    "Raleigh",
    "Richmond",
    "San Jose",
    "Birmingham",
    "Providence",
    "Anchorage",
    "Honolulu"
];
function getRandomCity(cities: string[]): string {
    const randomIndex = Math.floor(Math.random() * cities.length);
    return cities[randomIndex];
}

export interface Improvement {
    id: string; // Unique identifier
    type: string; // Unit type (e.g., "city", "farm", "mine")
    health: number; // Health points
    health_max: number;
    population: number; // Population points

    name: string;
    defence: number; // Defence points

    population_rate: number; // Population growth rate
    production_rate: number; // Production rate

    image: string; // Image URL
    owner: string; // Player or faction ID
    model?: Mesh; // Reference to the 3D model in the scene
    tile?: TileData; // Reference to the tile the unit is on
}

export function CreateCity(player: Player): Improvement {
    const placeType = "city"
    const cityName = getRandomCity(americanCities)


    const geom = new RingBufferGeometry(0.001, 1, 6, 1)
    geom.rotateZ(Math.PI/2)

    const model = new Mesh(
        geom,
        new MeshBasicMaterial({ 
            color: player.color,
            opacity: .65,
            transparent: true,
            side: THREE.DoubleSide,
        })
    );

    const unitID = `${player.name}_${placeType}_${model.uuid}`;
    const population = 1;
    const labelDiv = document.createElement('div');
    labelDiv.className = 'city-label';
    labelDiv.id = unitID;
    labelDiv.textContent = `${cityName} (${population})`;
    labelDiv.style.backgroundColor = 'rgba(84, 18, 138, 0.75)';
    labelDiv.style.color = 'white';
    labelDiv.style.padding = '5px 20px';
    labelDiv.style.borderRadius = '5px';
    labelDiv.style.fontFamily = 'Arial, sans-serif';
    const cityLabel = new CSS2DObject(labelDiv);
    cityLabel.position.set(0, -.82, 0);
    model.add(cityLabel);

    // TODO get user input for city name
    let city = {
        id: `${player.name}_${placeType}_${model.uuid}`,
        type: placeType,
        image: "/assets/city.webp",
        health: 100,
        name: cityName,
        population: population,
        health_max: 100,

        population_rate: 0,
        production_rate: 0,
        defence: 0,
        owner: player.name,
        model: model,
    }
    updatePopulationAndProductionRates(player, city);
    return city;
}

export function updateLabel(domID: string, content: string) {
    const label = document.getElementById(domID);
    if (label) {
        label.textContent = content;
    }
}

export function updatePopulationAndProductionRates(player: Player, improvement: Improvement) {
    const maxPopulation = 25;
    const taxRateEffect = 1 - (player.taxRate / 1); // 0 makes it go fast, 100 makes it decrease slightly

    // Calculate the new population rate with logarithmic slowdown
    const growthFactor = 4; // Adjust this factor to control the growth rate
    improvement.population_rate = parseFloat((Math.log(maxPopulation - improvement.population + 1) / growthFactor).toFixed(2));
    improvement.population_rate *= taxRateEffect;

    if (player.taxRate === 1) {
        improvement.population_rate = 0;
    }
    improvement.population_rate = Math.round(improvement.population_rate * 100) / 100;

    // unused
    improvement.production_rate = improvement.population;
}

// utilities

function toRoman(num: number): string {
    const romanNumerals: { [key: number]: string } = {
        1000: 'M', 900: 'CM', 500: 'D', 400: 'CD',
        100: 'C', 90: 'XC', 50: 'L', 40: 'XL',
        10: 'X', 9: 'IX', 5: 'V', 4: 'IV', 1: 'I'
    };

    let result = '';
    for (const value of Object.keys(romanNumerals).map(Number).sort((a, b) => b - a)) {
        while (num >= value) {
            result += romanNumerals[value];
            num -= value;
        }
    }
    return result;
}


export default Unit;
