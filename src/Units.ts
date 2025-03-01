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

export const UnitMap: {[key: string]: any } = {
    "settler": {
        create: CreateSettler,
        cost: 100,
        moveSounds: [asset("sounds/units/rifelman.mp3")],
        attackSounds: [],
    },
    "rifleman": {
        create: CreateRifleman,
        cost: 50,
        moveSounds: [asset("sounds/units/rifelman.mp3")],
        attackSounds: [asset("sounds/units/rifelman_attack.mp3")],
    },
    "infantry": {
        create: CreateInfantry,
        cost: 200,
        moveSounds: [asset("sounds/units/rifelman.mp3")],
        attackSounds: [asset("sounds/units/rifelman_attack.mp3")],
    },
    "cavalry": {
        create: CreateCavalry,
        cost: 200,
        moveSounds: [asset("sounds/units/rifelman.mp3")],
        attackSounds: [asset("sounds/units/rifelman_attack.mp3")],
    },
    "tank": {
        create: CreateTank,
        cost: 200,
        moveSounds: [asset("sounds/units/tank.mp3")],
        attackSounds: [asset("sounds/units/cinematic_boom.mp3")],
    },
    "artillary": {
        create: CreateArtillary,
        cost: 300,
        moveSounds: [asset("sounds/units/artillary.mp3")],
        attackSounds: [asset("sounds/units/cinematic_boom.mp3")],
    },
    "boat": {
        create: CreateBoat,
        cost: 500,
        moveSounds: [asset("sounds/units/boat.mp3")],
        attackSounds: [asset("sounds/units/cinematic_boom.mp3")],
    },
    "destroyer": {
        create: CreateDestroyer,
        cost: 1000,
        moveSounds: [asset("sounds/units/destroyer.mp3")],
        attackSounds: [asset("sounds/units/cinematic_boom.mp3")],
    },
    "gunship": {
        create: CreateGunshp,
        cost: 1000,
        moveSounds: [asset("sounds/units/gunship.mp3")],
        attackSounds: [asset("sounds/units/cinematic_boom.mp3")],
    },
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

// export function AddUnitLabel(unitModel:Mesh, unitID: string, icon:string, color:string, text:string = "") {
//     const labelDiv = document.createElement('div');
//     labelDiv.className = 'unit-label';
//     labelDiv.id = `${unitID}-label`;
//     labelDiv.innerHTML = `
//         <img src="${icon}" style="width: 90px; height: 100px; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);">
//         <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: ${color}; mix-blend-mode: color; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);">
//     `;
//     labelDiv.style.fontFamily = 'Arial, sans-serif';

//     const unitLabel = new CSS3DObject(labelDiv);
//     unitLabel.position.set(0, .5, 0);
//     unitLabel.scale.set(.004, .004, .004);
//     labelDiv.style.pointerEvents = 'none';
//     unitModel.add(unitLabel);
// }

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

export function CreateSettler(player: Player): Unit {
    const unitType = "settler"

    const textureLoader = new TextureLoader()
    const texture = textureLoader.load("../../assets/map/units/rifleman.png")
    // texture.magFilter = NearestFilter;
    const unitModel = new Mesh(
        new PlaneBufferGeometry(4/3, 2/3),
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

    unitModel.rotateX(Math.PI / 4.5);
    
    // const unitModel = createUnitModel("../../assets/ui/units/rifleman.png");
    const unitID =  `${player.name}_${unitType}_${unitModel.uuid}`;
    const name = "Settler " + toRoman(1);
    AddUnitLabel(unitModel, unitID, "../../assets/map/icons/rifleman.png", player.color);

    document.getElementById(`${unitID}-health-bar`).style.transform = `scaleY(${Math.max(0, Math.min(1, 100))})`;

    let unit = {
        id:unitID,
        type: unitType,
        name: name,
        health: 1,
        health_max: 1,
        movement: 3,
        movement_max: 3,
        attack_range: 0,
        attack: 0,
        defence: 0,
        kills: 0,
        land: true,
        water: false,
        offset: 0,
        image: "../../assets/rifleman.webp",
        owner: player.name,
        model: unitModel,
    };
    return unit;
}

export function CreateRifleman(player: Player): Unit {
    const unitType = "rifleman"

    const textureLoader = new TextureLoader()
    const texture = textureLoader.load("../../assets/map/units/rifleman.png")
    // texture.magFilter = NearestFilter;
    const unitModel = new Mesh(
        new PlaneBufferGeometry(4/3, 2/3),
        new MeshBasicMaterial({ 
            // color: player.color,
            map: texture,
            // opacity: .95,
            transparent: true,
            side: FrontSide,
            alphaTest: .5,
        })
    );
    unitModel.castShadow = false;
    unitModel.receiveShadow = false;

    unitModel.rotateX(Math.PI / 4.5);
    
    // const unitModel = createUnitModel("../../assets/ui/units/rifleman.png");
    const unitID =  `${player.name}_${unitType}_${unitModel.uuid}`;
    const name = "Rifleman Company " + toRoman(1);
    AddUnitLabel(unitModel, unitID, "../../assets/map/icons/rifleman.png", player.color);

    let unit = {
        id:unitID,
        type: unitType,
        name: name,
        health: 10,
        health_max: 10,
        movement: 3,
        movement_max: 3,
        attack_range: 1,
        attack: 5,
        defence: 0,
        kills: 0,
        land: true,
        water: false,
        offset: 0,
        image: "../../assets/rifleman.webp",
        owner: player.name,
        model: unitModel,
    };
    return unit;
}

export function CreateInfantry(player: Player): Unit {
    const unitType = "infantry"

    const textureLoader = new TextureLoader()
    const texture = textureLoader.load("../../assets/map/units/infantry.png")
    // texture.magFilter = NearestFilter;
    const unitModel = new Mesh(
        new PlaneBufferGeometry(4/3, 2/3),
        new MeshBasicMaterial({ 
            // color: player.color,
            map: texture,
            // opacity: .95,
            transparent: true,
            side: FrontSide,
            alphaTest: .5,
        })
    );
    unitModel.castShadow = false;
    unitModel.receiveShadow = false;

    unitModel.rotateX(Math.PI / 4.5);
    
    // const unitModel = createUnitModel("../../assets/ui/units/rifleman.png");
    const unitID =  `${player.name}_${unitType}_${unitModel.uuid}`;
    const name = "Infantry Company " + toRoman(1);
    AddUnitLabel(unitModel, unitID, "../../assets/map/icons/infantry.png", player.color);

    let unit = {
        id:unitID,
        type: unitType,
        name: name,
        health: 20,
        health_max: 20,
        movement: 4,
        movement_max: 4,
        attack_range: 1,
        attack: 10,
        defence: 0,
        kills: 0,
        land: true,
        water: false,
        offset: 0,
        image: "../../assets/rifleman.webp",
        owner: player.name,
        model: unitModel,
    };
    return unit;
}


export function CreateCavalry(player: Player): Unit {
    const unitType = "cavalry"
    const textureLoader = new TextureLoader()
    const texture = textureLoader.load("../../assets/map/units/cavalry.png")
    texture.magFilter = NearestFilter;
    const unitModel = new Mesh(
        new PlaneBufferGeometry(2.6*2/3, 1.3*2/3),
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
    unitModel.rotateX(Math.PI / 4.5);

    const unitID =  `${player.name}_${unitType}_${unitModel.uuid}`;
    AddUnitLabel(unitModel, unitID, "../../assets/map/icons/horse.png", player.color);

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
        attack: 9,
        defence: 0,
        kills: 0,
        land: true,
        water: false,
        offset: .29,
        image: "../../assets/map/icons/horse.png",
        owner: player.name,
        model: unitModel,
    };
    return unit;
}

export function CreateTank(player: Player): Unit {
    const unitType = "tank"
    const textureLoader = new TextureLoader()
    const texture = textureLoader.load("../../assets/map/units/tank.png")
    texture.magFilter = NearestFilter;
    const unitModel = new Mesh(
        new PlaneBufferGeometry(1, 1),
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
    unitModel.rotateX(Math.PI / 4.5);

    const unitID =  `${player.name}_${unitType}_${unitModel.uuid}`;
    AddUnitLabel(unitModel, unitID, "../../assets/map/icons/tank.png", player.color);

    const name = "Column " + toRoman(1);
    let unit = {
        id: unitID,
        type: unitType,
        name: name,
        health: 10,
        health_max: 10,
        movement: 6,
        movement_max: 6,
        attack_range: 1,
        attack: 3,
        defence: 0,
        kills: 0,
        land: true,
        water: false,
        offset: .2,
        image: "../../assets/map/icons/tank.png",
        owner: player.name,
        model: unitModel,
    };
    return unit;
}

export function CreateArtillary(player: Player): Unit {
    const unitType = "artillary"

    const textureLoader = new TextureLoader()
    const texture = textureLoader.load("../../assets/map/units/artillary.png")
    texture.magFilter = NearestFilter;
    const unitModel = new Mesh(
        new PlaneBufferGeometry(1.1*2/3, 1.1*2/3),
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
    unitModel.rotateX(Math.PI / 4.5);

    const unitID =  `${player.name}_${unitType}_${unitModel.uuid}`;
    AddUnitLabel(unitModel, unitID, "../../assets/map/icons/artillary.png", player.color);

    const name = "Artillary Company " + toRoman(1);
    let unit = {
        id: `${player.name}_${unitType}_${unitModel.uuid}`,
        type: unitType,
        name: name,
        health: 10,
        health_max: 10,
        movement: 2,
        movement_max: 2,
        attack_range: 3,
        attack: 3,
        defence: 0,
        kills: 0,
        land: true,
        water: false,
        offset: .29,
        image: "../../assets/map/icons/artillary.png",
        owner: player.name,
        model: unitModel,
    };
    return unit;
}

export function CreateBoat(player: Player): Unit {
    const unitType = "boat"

    const textureLoader = new TextureLoader()
    const texture = textureLoader.load("../../assets/map/units/boat.png")
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
    unitModel.castShadow = false;
    unitModel.receiveShadow = false;
    unitModel.rotateX(Math.PI / 4.5);

    const unitID =  `${player.name}_${unitType}_${unitModel.uuid}`;
    AddUnitLabel(unitModel, unitID, "../../assets/map/icons/boat.png", player.color);

    const name = "SS FAFO";
    let unit = {
        id: `${player.name}_${unitType}_${unitModel.uuid}`,
        type: unitType,
        name: name,
        health: 10,
        health_max: 10,
        movement: 10,
        movement_max: 10,
        attack_range: 6,
        attack: 10,
        defence: 0,
        kills: 0,
        land: false,
        water: true,
        offset: .5,
        image: "../../assets/map/units/boat.png",
        owner: player.name,
        model: unitModel,
    };
    return unit;
}

export function CreateDestroyer(player: Player): Unit {
    const unitType = "destroyer"

    const textureLoader = new TextureLoader()
    const texture = textureLoader.load("../../assets/map/units/destroyer.png")
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
    unitModel.castShadow = false;
    unitModel.receiveShadow = false;
    unitModel.rotateX(Math.PI / 4.5);
    unitModel

    const unitID =  `${player.name}_${unitType}_${unitModel.uuid}`;
    const name = "SS FAFO";
    AddUnitLabel(unitModel, unitID, "../../assets/map/icons/destroyer.png", player.color);

    let unit = {
        id: `${player.name}_${unitType}_${unitModel.uuid}`,
        type: unitType,
        name: name,
        health: 20,
        health_max: 20,
        movement: 18,
        movement_max: 18,
        attack_range: 10,
        attack: 20,
        defence: 0,
        kills: 0,
        land: false,
        water: true,
        offset: 0,
        image: "../../assets/map/units/destroyer.png",
        owner: player.name,
        model: unitModel,
    };
    return unit;
}

export function CreateGunshp(player: Player): Unit {
    const unitType = "gunship"

    const textureLoader = new TextureLoader()
    const texture = textureLoader.load("../../assets/map/units/gunship.png")
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
    unitModel.castShadow = false;
    unitModel.receiveShadow = false;
    unitModel.rotateX(Math.PI / 4.5);
    unitModel

    const unitID =  `${player.name}_${unitType}_${unitModel.uuid}`;
    AddUnitLabel(unitModel, unitID, "../../assets/map/icons/gunship.png", player.color);

    const name = "Gunship";
    let unit = {
        id: `${player.name}_${unitType}_${unitModel.uuid}`,
        type: unitType,
        name: name,
        health: 10,
        health_max: 10,
        movement: 18,
        movement_max: 18,
        attack_range: 2,
        attack: 20,
        defence: 0,
        kills: 0,
        land: true,
        water: true,
        offset: .5,
        image: "../../assets/map/units/gunship.png",
        owner: player.name,
        model: unitModel,
    };
    return unit;
}


export function CreateMissile(player: Player): Unit {
    const unitType = "missile"

    const textureLoader = new TextureLoader()
    const texture = textureLoader.load("../../assets/map/units/missile.png")
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
    unitModel.castShadow = false;
    unitModel.receiveShadow = false;
    unitModel.rotateX(Math.PI / 4.5);
    unitModel

    const unitID =  `${player.name}_${unitType}_${unitModel.uuid}`;
    AddUnitLabel(unitModel, unitID, "../../assets/map/icons/missile.png", player.color);

    const name = "Missile";
    let unit = {
        id: `${player.name}_${unitType}_${unitModel.uuid}`,
        type: unitType,
        name: name,
        health: 1,
        health_max: 1,
        movement: 5,
        movement_max: 5,
        attack_range: 20,
        attack: 100,
        defence: 0,
        kills: 0,
        land: true,
        water: false,
        offset: .5,
        image: "../../assets/map/units/missile.png",
        owner: player.name,
        model: unitModel,
    };
    return unit;
}


export function LoadSavedUnit(unit: Unit, player: Player): Unit {
    let newUnit = UnitMap[unit.type].create(player);
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
        health: 100,
        name: cityName,
        population: population,
        health_max: 100,

        population_rate: 0,
        production_rate: 0,
        defence: 0,
        owner: player.name,
        model: unitModel,
    }
    updatePopulationAndProductionRates(player, city);
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
    model2.layers.enable(10);
    model.add(model2);
    model.visible = false;
    return model;
}

export function createTileOverlayModel() {
    const key = `tile_overlay`;
    if (!materialCache.has(key)) {
        materialCache.set(key, new MeshBasicMaterial({ 
            color: "white",
            opacity: .5,
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


// resources
export interface Resource {
    name: string;
    image: string; // Image URL
    gold: number;
    model?: Mesh;
}

export const ResourceMap: { [key: string]: Resource } = {
    "box": {   
        name:  "box",
        image: "../../assets/map/resources/box.png",
        gold: 5,
    },
    "coal": {   
        name: "coal",
        image: "../../assets/map/resources/coal.png",
        gold: 5,
    },
    "corn": {   
        name: "corn",
        image: "../../assets/map/resources/corn.png",
        gold: 5,
    },
    "gold": {   
        name: "gold",
        image: "../../assets/map/resources/gold.png",
        gold: 5,
    },
    "meat": {   
        name: "meat",
        image: "../../assets/map/resources/meat.png",
        gold: 5,
    },
    "sheep": {   
        name: "sheep",
        image: "../../assets/map/resources/sheep.png",
        gold: 5,
    },
    "wheat": {   
        name: "wheat",
        image: "../../assets/map/resources/wheat.png",
        gold: 5,
    },
    "wood": {   
        name: "wood",
        image: "../../assets/map/resources/wood.png",
        gold: 5,
    }
}

export function CreateResourceModel(resource: Resource): Resource {
    const textureLoader = new TextureLoader()
    const texture = textureLoader.load(`${resource.image}`)
    texture.magFilter = NearestFilter;
    const unitModel = new Mesh(
        new BoxBufferGeometry(.4, .4, .001),
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
    return {
        name: resource.name,
        image: resource.image,
        gold: resource.gold,
        model: unitModel,
    }
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
