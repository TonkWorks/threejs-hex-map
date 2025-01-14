import { PerspectiveCamera, Scene, WebGLRenderer, Vector3, Group, Camera, Mesh, BoxBufferGeometry, MeshBasicMaterial, Object3D, RingBufferGeometry, CanvasTexture, Sprite, SpriteMaterial, LinearFilter } from 'three';
import { CSS2DRenderer, CSS2DObject } from './CSS2DRenderer';

import MapView from './MapView';
import { Player } from './GameState'; // Adjust the import path as necessary


      
export interface Unit {
    id: string; // Unique identifier
    type: string; // Unit type (e.g., "warrior", "archer", "settler")
    health: number; // Health points
    health_max: number; // Max Health points
    name: string; // Name of the unit
    image: string; // Image URL
    movement_max: number; // Max movement points
    attack: number; // Attack points
    defence: number; // Defence points

    movement: number; // Remaining movement points
    movementOrders?: {
        q: number;
        r: number;
    };
    owner: string; // Player or faction ID
    model?: Mesh; // Reference to the 3D model in the scene
}



export function CreateUnit(player: Player): Unit {
    const unitType = "rifleman"

    const unitModel = new Mesh(
        new BoxBufferGeometry(.8, 1, 1),
        new MeshBasicMaterial({ 
            color: player.color,
            opacity: .85,
            transparent: true,
            side: THREE.DoubleSide,
        })
    );

    const name = "Rifleman Company I"
    let unit = {
        id: `${player.name}_${unitType}_${unitModel.uuid}`,
        type: unitType,
        name: name,
        health: 10,
        health_max: 10,
        movement: 2,
        movement_max: 2,
        attack: 3,
        defence: 0,
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
    cityLabel.position.set(0, 1.5, 0);
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
    updatePopulationAndProductionRates(city);
    return city;
}

export function updateLabel(domID: string, content: string) {
    const label = document.getElementById(domID);
    if (label) {
        label.textContent = content;
    }
}

export function updatePopulationAndProductionRates(improvement: Improvement) {
    improvement.population_rate = parseFloat((0.5 / improvement.population).toFixed(2));
    improvement.production_rate = improvement.population;
}


export default Unit;
