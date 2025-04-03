import { TileData } from "./interfaces";
import { asset } from "./util";
import { FrontSide, LinearFilter, Mesh, MeshBasicMaterial, NearestFilter, PlaneBufferGeometry, RepeatWrapping, RingBufferGeometry, TextureLoader } from 'three';

export interface WorkerImprovement {
    id: string; // Unique identifier
    type: string; // Unit type (e.g., "city", "farm", "mine")
    yields: { [key: string]: number }; // Yields provided by the improvement
    index: number; // Variation of the unit model
    completion: number; // Completion percentage (0-1)
    barbarian?: boolean;
    research_needed?: string;
    flatten?: boolean; // Whether it should map the land (eg. a farm)
    model?: Mesh; // Reference to the 3D model in the scene
    tileInfo?: {q: number, r: number}; // Reference to the tile the unit is on
}


export const WorkerImprovementMap: {[key: string]: any } = {
    "farm": {
        type: "farm",
        description: "Increases food +2",
        flatten: true,
        images: ["../../assets/map/improvements/farm8.png"],

        // images: ["../../assets/map/improvements/farm1.png", "../../assets/map/improvements/farm2.png","../../assets/map/improvements/farm3.png", "../../assets/map/improvements/farm4.png","../../assets/map/improvements/farm5.png"],
        research_needed: "agriculture",
        yields: {
            food: 2,
        },
    },
    "ranch": {
        type: "ranch",
        description: "Increases food +2; develops resource",
        flatten: true,
        research_needed: "animal_husbandry",
        images: ["../../assets/map/improvements/farm8.png"],
        yields: {
            food: 2,
        },
    },
    "mine": {
        type: "mine",
        description: "Increases production +2",
        research_needed: "mining",
        images: ["../../assets/map/improvements/mine.png"],
        yields: {
            production: 2,
        },
    },
    "quarry": {
        type: "quarry",
        description: "Increases production +2; develops resource",
        research_needed: "advanced_mining",
        images: ["../../assets/map/improvements/mine.png"],
        yields: {
            production: 2,
        },
    },
    // barbarian
    "encampent": {
        type: "encampent",
        barbarian: true,
        description: "",
        images: ["../../assets/map/improvements/mine.png"],
        yields: {},
    },
    "goodie_hut": {
        type: "goodie_hut",
        barbarian: true,
        description: "",
        images: ["../../assets/map/units/goodie_hut.png"],
        yields: {},
    },
}


export function CreateWorkerImprovement(type: string, index: number = -1): WorkerImprovement {
    const textureLoader = new TextureLoader()
    let improvement = WorkerImprovementMap[type];
    if (!improvement) {
        console.error(`Improvement type "${type}" not found.`);
        return null;
    }
    if (index === -1) {
        index = Math.floor(Math.random() * improvement.images.length);
    }
    const texture = textureLoader.load(improvement.images[index])
    texture.magFilter = NearestFilter;
    let geom = null;
    if (improvement.flatten) {
        texture.magFilter = LinearFilter;
        geom = new RingBufferGeometry(0.001, .95, 6, 1);
        texture.wrapS = texture.wrapT = RepeatWrapping;
        const randomRotationAngle = Math.floor(Math.random() * 6) * (Math.PI / 3);
        texture.rotation = randomRotationAngle;
        texture.offset.set(Math.random(), Math.random());
        texture.repeat.set(2, 2);
    } else {
        geom = new PlaneBufferGeometry(1, 1);
    }
    const unitModel = new Mesh(
        geom,
        new MeshBasicMaterial({ 
            map: texture,
            transparent: true,
            side: FrontSide,
            alphaTest: .5,

        })
    );
    unitModel.castShadow = false;
    unitModel.receiveShadow = false;
    unitModel.visible = false;
    if (improvement.flatten) {
        unitModel.rotateZ(Math.PI / 2);
    } else {
        unitModel.rotateX(Math.PI / 9);
    }
    let unitID = `${type}_${unitModel.uuid}`;
    return {
        id: unitID,
        type: type,
        completion: 1,
        flatten: improvement.flatten,
        model: unitModel,
        index: index,
        yields: improvement.yields,
    }
}
