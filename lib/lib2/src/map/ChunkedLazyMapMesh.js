var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "three", "../QuadTree", "../coords", "../MapMesh", "./BoundingBox", "../util"], function (require, exports, three_1, QuadTree_1, coords_1, MapMesh_1, BoundingBox_1, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    QuadTree_1 = __importDefault(QuadTree_1);
    MapMesh_1 = __importDefault(MapMesh_1);
    class ChunkedLazyMapMesh extends three_1.Object3D {
        get numChunks() {
            return this.thunks.length;
        }
        constructor(tileGrid, options) {
            super();
            this.tileGrid = tileGrid;
            this.options = options;
            this.thunks = [];
            // we're gonna handle frustrum culling ourselves
            this.frustumCulled = false;
            // calculate size of map chunks so that there are at least 4 or each chunk contains 32^2 tiles
            const chunkSize = Math.min((tileGrid.width * tileGrid.height) / 4, Math.pow(32, 2));
            const chunkWidth = Math.ceil(Math.sqrt(chunkSize));
            const numChunksX = Math.ceil(tileGrid.width / chunkWidth);
            const numChunksY = Math.ceil(tileGrid.height / chunkWidth);
            const chunks = (0, util_1.range)(numChunksX).map(x => (0, util_1.range)(numChunksY).map(() => []));
            // assign tiles to cells in the coarser chunk grid
            tileGrid.forEachIJ((i, j, q, r, tile) => {
                const bx = Math.floor((i / tileGrid.width) * numChunksX);
                const by = Math.floor((j / tileGrid.height) * numChunksY);
                chunks[bx][by].push(tile);
            });
            const promises = [];
            // create a thunk for each chunk
            chunks.forEach((row, x) => {
                row.forEach((tiles, y) => {
                    const thunk = new MapThunk(tiles, tileGrid, options);
                    this.thunks.push(thunk);
                    promises.push(thunk.loaded);
                    thunk.load(); // preload
                    this.add(thunk);
                });
            });
            this.loaded = Promise.all(promises).then(() => null);
            this.quadtree = new QuadTree_1.default(this.thunks, 1, (thunk) => thunk.computeCenter());
        }
        /**
         * Adjusts visibility of chunks so that only map parts that can actually be seen by the camera are rendered.
         * @param camera the camera to use for visibility checks
         */
        updateVisibility(camera) {
            const min = (0, coords_1.screenToWorld)(0, 0, camera);
            const max = (0, coords_1.screenToWorld)(window.innerWidth, window.innerHeight, camera);
            const center = new three_1.Vector3().addVectors(min, max).multiplyScalar(0.5);
            const size = Math.max(max.x - min.x, max.y - min.y);
            const boundingBox = new BoundingBox_1.BoundingBox(new three_1.Vector2(center.x, center.y), size * 2);
            this.thunks.forEach(thunk => thunk.updateVisibility(false));
            this.quadtree.queryRange(boundingBox).forEach(thunk => thunk.updateVisibility(true));
        }
        updateTiles(tiles) {
            this.thunks.forEach(thunk => thunk.updateTiles(tiles));
        }
        getTile(q, r) {
            const xy = (0, coords_1.qrToWorld)(q, r);
            const queryBounds = new BoundingBox_1.BoundingBox(xy, 1);
            const thunks = this.quadtree.queryRange(queryBounds);
            for (let thunk of thunks) {
                const tile = thunk.getTile(q, r);
                if (tile) {
                    return tile;
                }
            }
            return null;
        }
    }
    exports.default = ChunkedLazyMapMesh;
    class MapThunk extends three_1.Object3D {
        getTiles() {
            return this.tiles;
        }
        getTile(q, r) {
            return this.mesh.getTile(q, r);
        }
        computeCenter() {
            const sphere = new three_1.Sphere();
            sphere.setFromPoints(this.tiles.map(tile => new three_1.Vector3((0, coords_1.qrToWorldX)(tile.q, tile.r), (0, coords_1.qrToWorldY)(tile.q, tile.r))));
            return new three_1.Vector2(sphere.center.x, sphere.center.y);
        }
        constructor(tiles, grid, options) {
            super();
            this.tiles = tiles;
            this.grid = grid;
            this.options = options;
            this._loaded = false;
            this.loaded = new Promise((resolve, reject) => {
                this.resolve = resolve;
            });
            this.frustumCulled = false;
        }
        updateTiles(tiles) {
            if (!this.mesh) {
                this.load();
            }
            this.mesh.updateTiles(tiles);
        }
        load() {
            if (!this._loaded) {
                this._loaded = true;
                const mesh = this.mesh = new MapMesh_1.default(this.tiles, this.options, this.grid);
                mesh.frustumCulled = false;
                this.add(mesh);
                this.resolve();
            }
        }
        updateVisibility(value) {
            if (value && !this._loaded) {
                this.load();
            }
            this.visible = value;
        }
    }
});
//# sourceMappingURL=ChunkedLazyMapMesh.js.map
//# sourceMappingURL=ChunkedLazyMapMesh.js.map