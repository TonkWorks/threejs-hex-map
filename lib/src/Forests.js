var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "three", "./Grid", "./util", "./coords", "./shaders/trees.vertex", "./shaders/trees.fragment", "./map-generator"], function (require, exports, three_1, Grid_1, util_1, coords_1, trees_vertex_1, trees_fragment_1, map_generator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Grid_1 = __importDefault(Grid_1);
    class Forests extends three_1.Object3D {
        constructor(tiles, globalGrid, options) {
            super();
            this._forestTiles = tiles.filter(t => typeof t.treeIndex != "undefined")
                .map(t => (Object.assign({ bufferIndex: -1 }, t)));
            this._globalGrid = globalGrid;
            this._options = Object.assign({}, options);
            this._trees = new Trees(globalGrid, this._forestTiles, options);
            this.add(this._trees);
        }
        updateTiles(tiles) {
            this._trees.updateTiles(tiles.filter(t => typeof t.treeIndex != "undefined"));
        }
    }
    exports.default = Forests;
    class Trees extends three_1.Object3D {
        constructor(globalGrid, tiles, options) {
            super();
            this._globalGrid = globalGrid;
            this._grid = new Grid_1.default(0, 0).init(tiles);
            this._texture = options.spritesheet;
            this._tiles = tiles;
            this._options = options;
            this.create();
        }
        updateTiles(tiles) {
            const attr = this._alphaAttr;
            for (let updated of tiles) {
                const old = this._grid.get(updated.q, updated.r);
                const val = updated.clouds ? 0 : 1;
                if (updated.clouds == old.clouds)
                    continue;
                for (let i = 0; i < this._options.treesPerForest; i++) {
                    attr.setZ(old.bufferIndex + i, val);
                }
                old.clouds = updated.clouds;
            }
            attr.needsUpdate = true;
        }
        create() {
            this._points = new three_1.Points(this.createGeometry(), this.createMaterial());
            this.add(this._points);
        }
        treeSize(treeIndex) {
            if (this._options.treeOptions && typeof this._options.treeOptions[treeIndex] != "undefined") {
                return (this._options.treeOptions[treeIndex].scale || 1.0) * this._options.treeSize;
            }
            else {
                return this._options.treeSize;
            }
        }
        numTreesPerForest(treeIndex) {
            if (this._options.treeOptions && typeof this._options.treeOptions[treeIndex] != "undefined") {
                return this._options.treeOptions[treeIndex].treesPerForest;
            }
            else {
                return this._options.treesPerForest;
            }
        }
        createGeometry() {
            const geometry = new three_1.BufferGeometry();
            const { treeSize, mapScale } = this._options;
            // tree positions
            const positions = (0, util_1.flatMap)(this._tiles, (tile, j) => {
                const treesPerForest = this.numTreesPerForest(tile.treeIndex);
                tile.bufferIndex = j * treesPerForest;
                const vs = new Array(treesPerForest);
                for (let i = 0; i < treesPerForest; i++) {
                    const tilePos = (0, coords_1.qrToWorld)(tile.q, tile.r, mapScale);
                    const localPos = (0, map_generator_1.randomPointOnCoastTile)((0, map_generator_1.waterAdjacency)(this._globalGrid, tile), mapScale);
                    vs[i] = tilePos.add(localPos).setZ(0.12);
                }
                return vs;
            });
            const posAttr = new three_1.BufferAttribute(new Float32Array(positions.length * 3), 3).copyVector3sArray(positions);
            geometry.setAttribute("position", posAttr);
            // tree parameters
            const cols = this._options.spritesheetSubdivisions;
            const params = (0, util_1.flatMap)(this._tiles, tile => {
                const spriteIndex = () => tile.treeIndex * cols + Math.floor(Math.random() * cols);
                const treesPerForest = this.numTreesPerForest(tile.treeIndex);
                const treeSize = this.treeSize(tile.treeIndex);
                const ps = new Array(treesPerForest);
                for (let i = 0; i < treesPerForest; i++) {
                    ps[i] = new three_1.Vector3(spriteIndex(), treeSize, tile.clouds ? 0.0 : 1.0);
                }
                return ps;
            });
            this._alphaAttr = new three_1.BufferAttribute(new Float32Array(positions.length * 3), 3).copyVector3sArray(params);
            geometry.setAttribute("params", this._alphaAttr);
            return geometry;
        }
        createMaterial() {
            const { treeSize, mapScale, spritesheetSubdivisions } = this._options;
            const parameters = {
                uniforms: {
                    texture: {
                        type: "t",
                        value: this._texture
                    },
                    spritesheetSubdivisions: { type: "f", value: spritesheetSubdivisions },
                    size: {
                        type: "f",
                        value: (this._options.mapScale || 1.0) * this._options.treeSize
                    },
                    scale: { type: 'f', value: window.innerHeight / 2 },
                    alphaTest: { type: 'f', value: this._options.alphaTest }
                },
                transparent: true,
                vertexShader: trees_vertex_1.TREES_VERTEX_SHADER,
                fragmentShader: trees_fragment_1.TREES_FRAGMENT_SHADER
            };
            return new three_1.RawShaderMaterial(parameters);
        }
    }
});
//# sourceMappingURL=Forests.js.map