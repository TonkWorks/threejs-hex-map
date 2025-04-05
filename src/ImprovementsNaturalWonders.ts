import { BoxBufferGeometry, FrontSide, LinearFilter, Mesh, MeshBasicMaterial, NearestFilter, PlaneBufferGeometry, RepeatWrapping, RingBufferGeometry, TextureLoader } from 'three';

export interface NaturalWonder {
    type: string; 
    yields: { [key: string]: number }; // Yields provided by the improvement
    model?: Mesh; // Reference to the 3D model in the scene
    mapModel?: Mesh; // Reference to the 3D model in the scene
    tileInfo?: {q: number, r: number}; // Reference to the tile the unit is on
}

export const NaturalWonderMap: {[key: string]: any } = {
    "Grand Canyon": {
        name: "Grand Canyon",
        description: "Increases food +2",
        flatten: true,
        image: "../../assets/map/resources/gold.png",
        map: "../../assets/map/resources/map/gold.png",
        yields: {
            food: 2,
        },
    },
    "Mount Everest": {
        name: "Mount Everest",
        description: "Increases food +2",
        flatten: true,
        image: "../../assets/map/resources/gold.png",
        map: "../../assets/map/resources/map/gold.png",
        yields: {
            food: 2,
        },
    },
}


export function CreateNaturalWonder(type: string): NaturalWonder {
    const resource = NaturalWonderMap[type];

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
        type: type,
        model: iconModel,
        mapModel: mapModel,
        yields: resource.yields,
    }
}
