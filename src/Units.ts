import { PerspectiveCamera, Scene, WebGLRenderer, Vector3, Group, Camera, Mesh, BoxBufferGeometry, MeshBasicMaterial, Object3D, RingBufferGeometry, CanvasTexture, Sprite, SpriteMaterial, LinearFilter, TextureLoader, FrontSide, NearestFilter, PlaneBufferGeometry, Plane } from 'three';
import { CSS2DRenderer, CSS2DObject } from './CSS2DRenderer';
import { CSS3DRenderer, CSS3DObject } from './CSS3DRenderer';

import MapView from './MapView';
import { Player } from './GameState'; // Adjust the import path as necessary
import { TileData } from './interfaces';
import { Nations } from './Nations';
import { asset } from './util';
import AnimatedSelector from './Selector';

const materialCache = new Map();

export interface Unit {
    id: string; // Unique identifier
    type: string; // Unit type (e.g., "warrior", "archer", "settler")
    health: number; // Health points
    health_max: number; // Max Health points
    name: string; // Name of the unit
    image: string; // Image URL
    movement_max: number; // Max movement points
    attack_range: number; // Attack range
    attack: number; // Attack points
    defence: number; // Defence points
    offset: number;
    land: boolean;
    water: boolean;
    orders: string; // Orders for the unit,
    movement: number; // Remaining movement points
    movementOrders?: {
        q: number;
        r: number;
    };
    kills: number; // Number of kills
    owner: string; // Player or faction ID
    model?: Mesh; // Reference to the 3D model in the scene
    selector?: AnimatedSelector;
    moving?: boolean;
    tileInfo?: {q: number, r: number}; // Reference to the tile the unit is on
}

interface UnitConfig {
    name: string;
    cost: number;
    moveSounds: string[];
    attackSounds: string[];
    texture: string;
    icon: string;
    image: string;
    tech_required?: string;
    geometry: { width: number; height: number };
    textureFilter?: 'nearest' | 'linear';
    stats: {
        health_max: number;
        movement_max: number;
        attack: number;
        defence: number;
        attack_range: number;
        land: boolean;
        water: boolean;
        offset: number;
    };
}

export const UnitMap: { [key: string]: UnitConfig } = {
    "settler": {
        name: "Settler",
        cost: 100,
        moveSounds: [asset("sounds/units/rifelman.mp3")],
        attackSounds: [],
        texture: "../../assets/map/units/settler.png",
        icon: "../../assets/map/icons/settler.png",
        image: "../../assets/rifleman.webp",
        geometry: { width: 1, height: 1 },
        stats: {
            health_max: 1,
            movement_max: 3,
            attack: 0,
            defence: 0,
            attack_range: 0,
            land: true,
            water: false,
            offset:  0.2,
        }
    },
    "worker": {
        name: "worker",
        cost: 30,
        moveSounds: [asset("sounds/units/rifelman.mp3")],
        attackSounds: [],
        texture: "../../assets/map/units/worker.png",
        icon: "../../assets/map/icons/worker.png",
        image: "../../assets/rifleman.webp",
        geometry: { width: 3/5, height: 3/5 },
        stats: {
            health_max: 1,
            movement_max: 2,
            attack: 0,
            defence: 0,
            attack_range: 0,
            land: true,
            water: false,
            offset: 0,
        }
    },
    "scout": {
        name: "scout",
        cost: 30,
        moveSounds: [asset("sounds/units/rifelman.mp3")],
        attackSounds: [],
        texture: "../../assets/map/units/scout.png",
        icon: "../../assets/map/icons/scout.png",
        image: "../../assets/rifleman.webp",
        geometry: { width: 3/5, height: 3/5 },
        stats: {
            health_max: 5,
            movement_max: 4,
            attack: 3,
            defence: 0,
            attack_range: 0,
            land: true,
            water: false,
            offset:  0.1,
        }
    },
    "rifleman": {
        name: "Rifleman",
        cost: 50,
        moveSounds: [asset("sounds/units/rifelman.mp3")],
        attackSounds: [asset("sounds/units/rifelman_attack.mp3")],
        texture: "../../assets/map/units/rifleman.png",
        icon: "../../assets/map/icons/rifleman.png",
        image: "../../assets/rifleman.webp",
        geometry: { width: 4/3, height: 2/3 },
        stats: {
            health_max: 10,
            movement_max: 2,
            attack: 5,
            defence: 0,
            attack_range: 1,
            land: true,
            water: false,
            offset: 0,
        }
    },
    "infantry": {
        name: "Infantry",
        cost: 200,
        tech_required: "infantry",
        moveSounds: [asset("sounds/units/rifelman.mp3")],
        attackSounds: [asset("sounds/units/rifelman_attack.mp3")],
        texture: "../../assets/map/units/infantry.png",
        icon: "../../assets/map/icons/infantry.png",
        image: "../../assets/rifleman.webp",
        geometry: { width: 4/3, height: 2/3 },
        stats: {
            health_max: 20,
            movement_max: 4,
            attack: 10,
            defence: 0,
            attack_range: 1,
            land: true,
            water: false,
            offset: 0,
        }
    },
    "cavalry": {
        name: "Cavalry",
        cost: 200,
        moveSounds: [asset("sounds/units/rifelman.mp3")],
        attackSounds: [asset("sounds/units/rifelman_attack.mp3")],
        texture: "../../assets/map/units/cavalry.png",
        icon: "../../assets/map/icons/horse.png",
        image: "../../assets/map/icons/horse.png",
        geometry: { width: 2.6*2/3, height: 1.3*2/3 },
        textureFilter: 'nearest',
        stats: {
            health_max: 10,
            movement_max: 6,
            attack: 9,
            defence: 0,
            attack_range: 1,
            land: true,
            water: false,
            offset: 0.29,
        }
    },
    "tank": {
        name: "Tank",
        cost: 200,
        tech_required: "tank",
        moveSounds: [asset("sounds/units/tank.mp3")],
        attackSounds: [asset("sounds/units/cinematic_boom.mp3")],
        texture: "../../assets/map/units/tank.png",
        icon: "../../assets/map/icons/tank.png",
        image: "../../assets/map/icons/tank.png",
        geometry: { width: 1, height: 1 },
        textureFilter: 'nearest',
        stats: {
            health_max: 10,
            movement_max: 6,
            attack: 3,
            defence: 0,
            attack_range: 1,
            land: true,
            water: false,
            offset: 0.2,
        }
    },
    "artillary": {
        name: "Artillary",
        cost: 300,
        moveSounds: [asset("sounds/units/artillary.mp3")],
        attackSounds: [asset("sounds/units/cinematic_boom.mp3")],
        texture: "../../assets/map/units/artillary.png",
        icon: "../../assets/map/icons/artillary.png",
        image: "../../assets/map/icons/artillary.png",
        geometry: { width: 1.1*2/3, height: 1.1*2/3 },
        textureFilter: 'nearest',
        stats: {
            health_max: 10,
            movement_max: 2,
            attack: 3,
            defence: 0,
            attack_range: 3,
            land: true,
            water: false,
            offset: 0.29,
        }
    },
    "boat": {
        name: "Boat",
        cost: 500,
        tech_required: "warships",
        moveSounds: [asset("sounds/units/boat.mp3")],
        attackSounds: [asset("sounds/units/cinematic_boom.mp3")],
        texture: "../../assets/map/units/boat.png",
        icon: "../../assets/map/icons/boat.png",
        image: "../../assets/map/units/boat.png",
        geometry: { width: 1.5, height: 1.5 },
        textureFilter: 'nearest',
        stats: {
            health_max: 10,
            movement_max: 10,
            attack: 10,
            defence: 0,
            attack_range: 6,
            land: false,
            water: true,
            offset: 0.5,
        }
    },
    "destroyer": {
        name: "Destroyer",
        cost: 1000,
        tech_required: "destroyer",
        moveSounds: [asset("sounds/units/destroyer.mp3")],
        attackSounds: [asset("sounds/units/cinematic_boom.mp3")],
        texture: "../../assets/map/units/destroyer.png",
        icon: "../../assets/map/icons/destroyer.png",
        image: "../../assets/map/units/destroyer.png",
        geometry: { width: 1.5, height: 1.5 },
        textureFilter: 'nearest',
        stats: {
            health_max: 20,
            movement_max: 18,
            attack: 20,
            defence: 0,
            attack_range: 10,
            land: false,
            water: true,
            offset: 0,
        }
    },
    "gunship": {
        name: "Gunship",
        cost: 1000,
        // tech_required: "gunship",
        moveSounds: [asset("sounds/units/gunship.mp3")],
        attackSounds: [asset("sounds/units/cinematic_boom.mp3")],
        texture: "../../assets/map/units/gunship.png",
        icon: "../../assets/map/icons/gunship.png",
        image: "../../assets/map/units/gunship.png",
        geometry: { width: 1.5, height: 1.5 },
        textureFilter: 'nearest',
        stats: {
            health_max: 10,
            movement_max: 18,
            attack: 20,
            defence: 0,
            attack_range: 2,
            land: true,
            water: true,
            offset: 0.5,
        }
    },
    "nuke": {
        name: "Missile",
        cost: 1000,
        tech_required: "nukes",
        moveSounds: [asset("sounds/units/missile.mp3")],
        attackSounds: [asset("sounds/units/cinematic_boom.mp3")],
        texture: "../../assets/map/units/missile.png",
        icon: "../../assets/map/icons/missile.png",
        image: "../../assets/map/units/missile.png",
        geometry: { width: 1.5, height: 1.5 },
        textureFilter: 'nearest',
        stats: {
            health_max: 1,
            movement_max: 5,
            attack: 100,
            defence: 0,
            attack_range: 20,
            land: true,
            water: false,
            offset: 0.5,
        }
    },
};

export function createUnit(type: string, player: Player, unitID: string = ""): Unit {
    const config = UnitMap[type];
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load(config.texture);

    if (config.textureFilter === 'nearest') {
        texture.magFilter = NearestFilter;
    }

    const geometry = new PlaneBufferGeometry(config.geometry.width, config.geometry.height);
    const material = new MeshBasicMaterial({ 
        map: texture,
        transparent: true,
        side: FrontSide,
        alphaTest: 0.1,
    });

    const unitModel = new Mesh(geometry, material);
    unitModel.castShadow = true;
    unitModel.receiveShadow = true;
    unitModel.rotateX(Math.PI / 4.5);

    if (unitID === "") {
        unitID = `${player.name}_${type}_${unitModel.uuid}`;
    }
    const name = type === 'boat' || type === 'destroyer' || type === 'gunship' || type === 'nuke' 
        ? config.name 
        : `${config.name} ${toRoman(1)}`;

    if (type !== 'goodie_hut') {
        AddUnitLabel(unitModel, unitID, config.icon, player.color);
    }

    return {
        id: unitID,
        type: type,
        name: name,
        orders: "",
        health: config.stats.health_max,
        health_max: config.stats.health_max,
        movement: config.stats.movement_max,
        movement_max: config.stats.movement_max,
        attack_range: config.stats.attack_range,
        attack: config.stats.attack,
        defence: config.stats.defence,
        offset: config.stats.offset,
        land: config.stats.land,
        water: config.stats.water,
        image: config.image,
        owner: player.name,
        model: unitModel,
        kills: 0,
        movementOrders: undefined,
        tileInfo: undefined,
    };
}

export function createUnitModel(image:string) {
    const labelDiv = document.createElement('div');
    labelDiv.className = 'unit-model';
    labelDiv.innerHTML = `
        <img src="${image}" style="width: 100px; height: 100px;">
    `;

    const model = new CSS3DObject(labelDiv);
    model.position.set(0, 0, 0);
    model.rotateX(Math.PI / 6);
    model.scale.set(.01, .01, .01);

    return model;
}


export function HeathBarDivHtml(id: string, percentage: number = 1) {
    // Health bar configuration with defaults
    const healthConfig = {
        width: 10,
        height: 100,
        offsetX: 100,
        offsetY: 0,
        healthyColor:'#00ff00',
        damagedColor: '#ff0000',
        background: 'rgba(0,0,0,0.5)'
    };

    return `
        <div id="${id}-health" style="
            display: inline-block;
            position: relative;
            width: ${healthConfig.width}px;
            height: 100%;
            background: ${healthConfig.background};
            border-radius: 3px;
            overflow: hidden;">
            <div id="${id}-health-bar" style="
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 100%;
                background: ${healthConfig.healthyColor};
                transform: scaleY(${percentage});
                transform-origin: bottom;
                transition: transform 0.2s ease-in-out;">
            </div>
        </div>
    `;
}
export function AddUnitLabel(
    unitModel: Mesh, 
    unitID: string, 
    icon: string, 
    color: string, 
    text: string = "",
    healthBarOptions: {
        width?: number,
        height?: number,
        offsetX?: number,
        offsetY?: number,
        healthyColor?: string,
        damagedColor?: string,
        background?: string
    } = {}
) {
    // Health bar configuration with defaults
    const healthConfig = {
        width: healthBarOptions.width || 10,
        height: healthBarOptions.height || 100,
        offsetX: healthBarOptions.offsetX || 100,
        offsetY: healthBarOptions.offsetY || 0,
        healthyColor: healthBarOptions.healthyColor || '#00ff00',
        damagedColor: healthBarOptions.damagedColor || '#ff0000',
        background: healthBarOptions.background || 'rgba(0,0,0,0.5)'
    };

    const labelDiv = document.createElement('div');
    labelDiv.className = 'unit-label';
    labelDiv.id = `${unitID}-label`;
    labelDiv.innerHTML = `
        <img src="${icon}" style="
            width: 90px; 
            height: 100px; 
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);">
        
        
        <div id="${unitID}-health" style="
            position: absolute;
            left: ${healthConfig.offsetX}px;
            top: ${healthConfig.offsetY}px;
            width: ${healthConfig.width}px;
            height: ${healthConfig.height}px;
            background: ${healthConfig.background};
            border-radius: 3px;
            overflow: hidden;">
            <div id="${unitID}-health-bar" style="
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 100%;
                background: ${healthConfig.healthyColor};
                transform: scaleY(1);
                transform-origin: bottom;
                transition: transform 0.2s ease-in-out;">
            </div>
        </div>
    `;

    labelDiv.style.fontFamily = 'Arial, sans-serif';
    labelDiv.style.position = 'relative';

    const unitLabel = new CSS3DObject(labelDiv);
    unitLabel.position.set(0, .5, 0);
    unitLabel.scale.set(.004, .004, .004);
    labelDiv.style.pointerEvents = 'none';
    unitModel.add(unitLabel);

    // Return methods to control health
    return {
        updateHealth: (percentage: number) => {
            const healthBar = document.getElementById(`${unitID}-health-bar`);
            if (healthBar) {
                healthBar.style.transform = `scaleY(${Math.max(0, Math.min(1, percentage))})`;
            }
        }
    };
}

export function updateUnitHealthBar(unit: Unit) {
    const percentage = unit.health / unit.health_max;
    let d = document.getElementById(`${unit.id}-health-bar`);
    if (!d) {
        return;
    }
    if (percentage === 1) {
        document.getElementById(`${unit.id}-health`).style.visibility = 'hidden';
        return;
    }
    document.getElementById(`${unit.id}-health`).style.visibility = 'visible';
    const healthBar = document.getElementById(`${unit.id}-health-bar`);
    healthBar.style.transform = `scaleY(${Math.max(0, Math.min(1, percentage))})`;
}


export function LoadSavedUnit(unit: Unit, player: Player): Unit {
    let newUnit = createUnit(unit.type, player, unit.id);
    unit.model = newUnit.model;
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

function getRandomCity(cities: string[]): string {
    const randomIndex = Math.floor(Math.random() * cities.length);
    return cities[randomIndex];
}

export function getNextCityName(player: Player): string {
    const nation = Nations[player.nation];
    if (player.cityIndex >= nation.cities.length) {
        player.cityIndex = 0;
    }
    return nation.cities[player.cityIndex];
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

    nextTile?: {q: number, r: number}; // Next tile to expand to

    work_done: number; // Work done on the improvement
    work_total: number; // Total work required to complete the improvement
    work_building: boolean;
    production_queue: string[];
    cityBuildings: { [key: string]: boolean };

    image: string; // Image URL
    owner: string; // Player or faction ID
    model?: Mesh; // Reference to the 3D model in the scene
    tileInfo?: {q: number, r: number}; // Reference to the tile the unit is on
}

export function CreateCity(player: Player, name: string = "", id: string = ""): Improvement {
    const placeType = "city"
    const nation = Nations[player.nation];

    let cityName = name;
    if (cityName === "") {
        cityName = getNextCityName(player);
    }
    player.cityIndex += 1;

    // const geom = new RingBufferGeometry(0.001, 1, 6, 1)
    // geom.rotateZ(Math.PI/2)

    // const model = new Mesh(
    //     geom,
    //     new MeshBasicMaterial({ 
    //         color: player.color,
    //         opacity: .65,
    //         transparent: true,
    //         side: FrontSide,
    //     })
    // );

    const textureLoader = new TextureLoader()
    const texture = textureLoader.load("../../assets/map/units/city2.png")
    texture.magFilter = NearestFilter;
    const unitModel = new Mesh(
        new PlaneBufferGeometry(1.5, 1.5),
        new MeshBasicMaterial({ 
            // color: player.color,
            map: texture,
            transparent: true,
            side: FrontSide,
            alphaTest: .5,
        })
    );
    // unitModel.castShadow = false;
    // unitModel.receiveShadow = false;
    unitModel.rotateX(Math.PI / 4.5);

    let unitID = `${player.name}_${placeType}_${unitModel.uuid}`;
    if (id !== "") {
        unitID = id;
    }
    const population = 1;
    const labelDiv = document.createElement('div');
    labelDiv.className = 'city-label';
    labelDiv.id = unitID;

    const img = `<img src="${nation.flag_image}" style="padding-right:10px;" height="25px"/>`
    labelDiv.innerHTML = `<span class="city-label" data-target="${unitID}">${img} ${cityName} (${population}) </span>`;
    labelDiv.style.pointerEvents = 'none';
    const cityLabel = new CSS3DObject(labelDiv);
    cityLabel.position.set(0, -.82, .3);
    // cityLabel.rotateX(Math.PI / 6);
    cityLabel.scale.set(.01, .01, .01);
    unitModel.add(cityLabel);
    unitModel.visible = false;
    // TODO get user input for city name
    let city = {
        id: unitID,
        type: placeType,
        image: "../../assets/city.webp",
        health: 15,
        health_max: 15,
        name: cityName,
        population: population,

        work_done: 0,
        work_total: 0,
        work_building: false,
        production_queue: [] as string[],
        population_rate: 0,
        production_rate: 0,
        defence: 0,
        owner: player.name,
        model: unitModel,
        cityBuildings: {},
    }
    return city;
}

const territoryOverlayGeometry = new RingBufferGeometry(0.001, 1, 6, 1);
territoryOverlayGeometry.rotateZ(Math.PI/2);
export function createTerritoryOverlayModel(player: Player) {
    const key = `territory_overlay_${player.name}`;
    if (!materialCache.has(key)) {
        materialCache.set(key, new MeshBasicMaterial({ 
            color: player.color,
            opacity: .15,
            transparent: true,
            side: FrontSide,
        }));
    }
    const model = new Mesh(
        territoryOverlayGeometry,
        materialCache.get(key)
    );


    const key2 = `territory_overlay_mini_${player.name}`;
    if (!materialCache.has(key2)) {
        materialCache.set(key2, new MeshBasicMaterial({ 
            color: player.color,
            opacity: .6,
            transparent: true,
            side: FrontSide,
        }));
    }
    const model2 = new Mesh(
        territoryOverlayGeometry,
        materialCache.get(key2)
    );
    model2.layers.disable(0);
    model2.layers.disable(11);
    model2.layers.enable(10);
    model.add(model2);
    model.visible = false;
    return model;
}

export function createTileOverlayModel(color: string = "white", opacity: number = 0.2) {
    const key = `tile_overlay_${color}_${opacity}`;
    if (!materialCache.has(key)) {
        materialCache.set(key, new MeshBasicMaterial({ 
            color: color,
            opacity: opacity,
            transparent: true,
            side: FrontSide,
        }));
    }
    const model = new Mesh(
        territoryOverlayGeometry,
        materialCache.get(key)
    );
    return model;
}

const modelOverlayGeometry = new RingBufferGeometry(0.001, .4, 6, 1);
modelOverlayGeometry.rotateZ(Math.PI/2);
export function createCityOverlayModel() {
    const model = new Mesh(
        modelOverlayGeometry,
        new MeshBasicMaterial({ 
            color: "white",
            opacity: 1,
            transparent: true,
            side: FrontSide,
        })
    );
    model.visible = false;
    return model;
}

export function updateLabel(domID: string, content: string) {
    const label = document.getElementById(domID);
    if (label) {
        label.innerHTML = content;
    }
    // weird bug in case of initial load
    else {
        setTimeout(() => {
            const label = document.getElementById(domID);
            if (label) {
                label.innerHTML = content;
            }
         }, 1);
    }
}

// export function updatePopulationAndProductionRates(player: Player, improvement: Improvement) {
//     const maxPopulation = 25;
//     const taxRateEffect = 1 - (player.taxRate / 1); // 0 makes it go fast, 100 makes it decrease slightly

//     // Calculate the new population rate with logarithmic slowdown
//     const growthFactor = 4; // Adjust this factor to control the growth rate
//     improvement.population_rate = parseFloat((Math.log(maxPopulation - improvement.population + 1) / growthFactor).toFixed(2));
//     improvement.population_rate *= taxRateEffect;

//     if (player.taxRate === 1) {
//         improvement.population_rate = 0;
//     }
//     improvement.population_rate = Math.round(improvement.population_rate * 100) / 100;

//     // unused
//     improvement.production_rate = improvement.population;
// }


// resources
export interface Resource {
    name: string;
    image: string; // Image URL
    map?: string;
    gold: number;
    model?: Mesh;
    mapModel?: Mesh;
}

export const ResourceMap: { [key: string]: Resource } = {
    "marble": {   
        name:  "marble",
        image: "../../assets/map/resources/box.png",
        map: "../../assets/map/resources/map/marble.png",
        gold: 5,
    },
    "coal": {   
        name: "coal",
        image: "../../assets/map/resources/coal.png",
        map: "../../assets/map/resources/map/coal.png",
        gold: 5,
    },
    "corn": {   
        name: "corn",
        image: "../../assets/map/resources/corn.png",
        map: "../../assets/map/resources/map/corn.png",
        gold: 5,
    },
    "gold": {   
        name: "gold",
        image: "../../assets/map/resources/gold.png",
        map: "../../assets/map/resources/map/gold.png",
        gold: 5,
    },
    "cows": {   
        name: "cows",
        image: "../../assets/map/resources/cows.png",
        map: "../../assets/map/resources/map/cows.png",
        gold: 5,
    },
    "sheep": {   
        name: "sheep",
        image: "../../assets/map/resources/sheep.png",
        map: "../../assets/map/resources/map/sheep.png",
        gold: 5,
    },
    "wheat": {   
        name: "wheat",
        image: "../../assets/map/resources/wheat.png",
        map: "../../assets/map/resources/map/wheat.png",
        gold: 5,
    },
    "wood": {   
        name: "wood",
        image: "../../assets/map/resources/wood.png",
        map: "../../assets/map/resources/map/wood.png",
        gold: 5,
    }
}

export function CreateResourceModel(resource: Resource): Resource {
    const textureLoader = new TextureLoader()
    const texture = textureLoader.load(`${resource.image}`)
    texture.magFilter = NearestFilter;
    const iconModel = new Mesh(
        new BoxBufferGeometry(.4, .4, .001),
        new MeshBasicMaterial({ 
            // color: player.color,
            map: texture,
            transparent: true,
            side: FrontSide,
            alphaTest: .5,
        })
    );
    iconModel.castShadow = false;
    iconModel.receiveShadow = false;
    iconModel.rotateX(Math.PI / 6);


    // map
    let mapModel = null;
    if (resource.map) {
        const mapTexture = textureLoader.load(`${resource.map}`)
        mapTexture.magFilter = NearestFilter;
        mapModel = new Mesh(
            new PlaneBufferGeometry(1, 1),
            new MeshBasicMaterial({ 
                map: mapTexture,
                transparent: true,
                side: FrontSide,
                alphaTest: .5,
            })
        );
        mapModel.rotateX(Math.PI / 6);
        mapModel.castShadow = true;
        mapModel.receiveShadow = false;
    }

    return {
        name: resource.name,
        image: resource.image,
        map: resource.map,
        gold: resource.gold,
        model: iconModel,
        mapModel: mapModel,
    }
}

export function CreateResourceMapModel(resource: Resource): Mesh {
    const textureLoader = new TextureLoader()
    // map
    if (!resource.map) {
        return null;
    }

    const mapTexture = textureLoader.load(`${resource.map}`)
    mapTexture.magFilter = NearestFilter;
    const mapModel = new Mesh(
        new PlaneBufferGeometry(2, 2),
        new MeshBasicMaterial({ 
            // color: player.color,
            map: mapTexture,
            transparent: true,
            side: FrontSide,
            alphaTest: .5,
        })
    );
    mapModel.castShadow = false;
    mapModel.receiveShadow = false;
    return mapModel
}


export function CreateYieldModel(image: string): Mesh {
    const textureLoader = new TextureLoader()
    const texture = textureLoader.load(image)
    const unitModel = new Mesh(
        new BoxBufferGeometry(.3, .3, .001),
        new MeshBasicMaterial({ 
            // color: player.color,
            map: texture,
            transparent: true,
            side: FrontSide,
            alphaTest: .5,
        })
    );
    unitModel.castShadow = false;
    unitModel.receiveShadow = false;
    unitModel.rotateX(Math.PI / 6);
    return unitModel;
}

export function RisingText(scene: Scene,  position: Vector3, text: string, color = "yellow", size = 1, duration = 1, riseDistance = 1) {
    // Create a canvas texture for the text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const fontSize = 36;
    canvas.width = 256;
    canvas.height = 128;
    
    // Set text style
    context.font = `bold ${fontSize}px Arial`;
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    // Create a texture from the canvas
    const texture = new CanvasTexture(canvas);
    texture.minFilter = LinearFilter;
    
    // Create a sprite material using the texture
    const material = new SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 1.0,
      alphaTest: 0.5,
    });

    position = new Vector3().copy(position);
    position.y -= 0.2;
    position.x += 0.45;
    position.z += 1;
    // Create a sprite and position it
    const sprite = new Sprite(material);
    sprite.position.copy(position);
    sprite.scale.set(size * 2, size, 1);
    sprite.rotateX(Math.PI / 4.5);

    scene.add(sprite);
    
    // Track animation
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;
    
    // Animation function
    function animate() {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1.0);
      
      // Move upward
      sprite.position.y = position.y + (riseDistance * progress);
      
      // Fade out in the second half of the animation
      if (progress > 0.5) {
        sprite.material.opacity = 2 * (1 - progress);
      }
      
      // Continue animation or remove when done
      if (now < endTime) {
        requestAnimationFrame(animate);
      } else {
        scene.remove(sprite);
        sprite.material.dispose();
        sprite.material.map.dispose();
      }
    }
    
    // Start animation
    requestAnimationFrame(animate);
    
    // Return function to cancel animation early if needed
    return function cancelAnimation() {
      scene.remove(sprite);
      sprite.material.dispose();
      sprite.material.map.dispose();
    };
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
