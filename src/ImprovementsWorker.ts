import { TileData } from "./interfaces";
import { asset } from "./util";
import { FrontSide, Mesh, MeshBasicMaterial, NearestFilter, PlaneBufferGeometry, TextureLoader } from 'three';

export interface WorkerImprovement {
    id: string; // Unique identifier
    type: string; // Unit type (e.g., "city", "farm", "mine")
    yields: { [key: string]: number }; // Yields provided by the improvement
    index: number; // Variation of the unit model
    barbarian?: boolean;
    model?: Mesh; // Reference to the 3D model in the scene
    tileInfo?: {q: number, r: number}; // Reference to the tile the unit is on
}


export const WorkerImprovementMap: {[key: string]: any } = {
    "farm": {
        type: "farm",
        description: "Increases food +2",
        images: ["../../assets/map/improvements/farm1.png", "../../assets/map/improvements/farm2.png"],
        yields: {
            food: 2,
        },
    },
    "mine": {
        type: "mine",
        description: "Increases production +2",
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
    if (index === -1) {
        index = Math.floor(Math.random() * improvement.images.length);
    }
    const texture = textureLoader.load(improvement.images[index])
    texture.magFilter = NearestFilter;
    const unitModel = new Mesh(
        new PlaneBufferGeometry(1.5, 1.5),
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
    unitModel.rotateX(Math.PI / 9);

    let unitID = `${type}_${unitModel.uuid}`;
    return {
        id: unitID,
        type: type,
        model: unitModel,
        index: index,
        yields: improvement.yields,
    }
}
