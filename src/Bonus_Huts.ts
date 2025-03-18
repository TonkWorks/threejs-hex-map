// import { TileData } from "./interfaces";
// import { asset } from "./util";
// import { FrontSide, Mesh, MeshBasicMaterial, NearestFilter, PlaneBufferGeometry, TextureLoader } from 'three';

// export interface BonusHut {
//     id: string; // Unique identifier
//     model?: Mesh; // Reference to the 3D model in the scene
//     tileInfo?: {q: number, r: number}; // Reference to the tile the unit is on
// }

// export function CreateBonusHut(): BonusHut {
//     const textureLoader = new TextureLoader()

//     const image = "../../assets/map/improvements/hut1.png";
//     const texture = textureLoader.load(image);
//     texture.magFilter = NearestFilter;
//     const unitModel = new Mesh(
//         new PlaneBufferGeometry(1.5, 1.5),
//         new MeshBasicMaterial({ 
//             map: texture,
//             transparent: true,
//             side: FrontSide,
//             alphaTest: .5,

//         })
//     );
//     unitModel.castShadow = false;
//     unitModel.receiveShadow = false;
//     unitModel.visible = false;
//     unitModel.rotateX(Math.PI / 9);

//     let unitID = `${type}_${unitModel.uuid}`;
//     return {
//         id: unitID,
//         type: type,
//         model: unitModel,
//         index: index,
//         yields: improvement.yields,
//     }
// }
