import {Object3D, Texture, Points, PointsMaterial, BufferAttribute, BufferGeometry, Vector3, Color,
    ShaderMaterial, RawShaderMaterial} from "three"

export default class Unit extends Object3D {
    constructor() {
        super()
    }
    // constructor(tiles: TileData[], globalGrid: Grid<TileData>, options: Options) {
    //     super()

    //     this._forestTiles = tiles.filter(t => typeof t.treeIndex != "undefined")
    //         .map(t => ({bufferIndex: -1, ...t}))
    //     this._globalGrid = globalGrid
    //     this._options = {...options}

    //     this._trees = new Trees(globalGrid, this._forestTiles, options)
    //     this.add(this._trees)
    // }
}
