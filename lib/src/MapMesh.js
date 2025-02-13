var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./interfaces", "./hexagon", "three", "./coords", "./Grid", "./shaders/land.fragment", "./shaders/land.vertex", "./shaders/mountains.fragment", "./shaders/mountains.vertex", "./Forests"], function (require, exports, interfaces_1, hexagon_1, three_1, coords_1, Grid_1, land_fragment_1, land_vertex_1, mountains_fragment_1, mountains_vertex_1, Forests_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Grid_1 = __importDefault(Grid_1);
    Forests_1 = __importDefault(Forests_1);
    class MapMesh extends three_1.Group {
        /**
         * @param tiles the tiles to actually render in this mesh
         * @param globalGrid the grid with all tiles, including the ones that are not rendered in this mesh
         * @param options map mesh configuration options
         */
        constructor(tiles, options, globalGrid) {
            super();
            this.options = options;
            this._showGrid = true;
            // use default shaders if none are provided
            if (!options.landFragmentShader) {
                options.landFragmentShader = land_fragment_1.LAND_FRAGMENT_SHADER;
            }
            if (!options.landVertexShader) {
                options.landVertexShader = land_vertex_1.LAND_VERTEX_SHADER;
            }
            if (!options.mountainsFragmentShader) {
                options.mountainsFragmentShader = mountains_fragment_1.MOUNTAINS_FRAGMENT_SHADER;
            }
            if (!options.mountainsVertexShader) {
                options.mountainsVertexShader = mountains_vertex_1.MOUNTAINS_VERTEX_SHADER;
            }
            // local, extended copy of tile data
            this.tiles = tiles.map(t => (Object.assign({ bufferIndex: -1, isMountain: interfaces_1.isMountain(t.height) }, t)));
            this.localGrid = new Grid_1.default(0, 0).init(this.tiles);
            this.globalGrid = globalGrid || this.localGrid;
            options.hillsNormalTexture.wrapS = options.hillsNormalTexture.wrapT = three_1.RepeatWrapping;
            options.terrainAtlasTexture.wrapS = options.terrainAtlasTexture.wrapT = three_1.RepeatWrapping;
            options.undiscoveredTexture.wrapS = options.undiscoveredTexture.wrapT = three_1.RepeatWrapping;
            //options.transitionTexture.flipY = true
            // ── Create the meshes: separate land, mountains, water, and trees ──
            // NOTE: We now filter water tiles out of the land mesh and create a new water mesh.
            this.loaded = Promise.all([
                this.createLandMesh(this.tiles.filter(t => !interfaces_1.isWater(t.height) && !t.isMountain)),
                this.createMountainMesh(this.tiles.filter(t => t.isMountain)),
                this.createWaterMesh(this.tiles.filter(t => interfaces_1.isWater(t.height))),
                this.createTrees()
            ]).then(() => {
                // All promises resolved; return nothing to make this a Promise<void>
            }).catch((err) => {
                console.error("Could not create MapMesh", err);
            });
        }
        get showGrid() {
            return this._showGrid;
        }
        set showGrid(value) {
            this._showGrid = value;
            const landMaterial = this.land.material;
            landMaterial.uniforms.showGrid.value = value ? 1.0 : 0.0;
            const mountainMaterial = this.mountains.material;
            mountainMaterial.uniforms.showGrid.value = value ? 1.0 : 0.0;
        }
        /**
         * "Hot-swaps" the given textures.
         * @param textures
         */
        replaceTextures(textures) {
            for (let name in textures) {
                const replacement = textures[name];
                if (replacement) {
                    const old = this.options[name];
                    const { wrapT, wrapS } = old;
                    old.copy(replacement);
                    old.wrapT = wrapT;
                    old.wrapS = wrapS;
                    old.needsUpdate = true;
                }
            }
        }
        updateTiles(tiles) {
            this.updateFogAndClouds(tiles);
            this.trees.updateTiles(tiles);
        }
        getTile(q, r) {
            return this.localGrid.get(q, r);
        }
        /**
         * Updates only fog and clouds visualization of existing tiles.
         * @param tiles changed tiles
         */
        updateFogAndClouds(tiles) {
            const landGeometry = this.land.geometry;
            const landStyleAttr = landGeometry.getAttribute("style");
            const waterGeometry = this.water.geometry;
            const waterStyleAttr = waterGeometry.getAttribute("style");
            const mountainsGeometry = this.mountains.geometry;
            const mountainsStyleAttr = mountainsGeometry.getAttribute("style");
            tiles.forEach(updated => {
                const old = this.localGrid.get(updated.q, updated.r);
                if (!old)
                    return;
                if (updated.fog !== old.fog || updated.clouds !== old.clouds) {
                    old.fog = updated.fog;
                    old.clouds = updated.clouds;
                    let attribute;
                    if (old.isMountain) {
                        attribute = mountainsStyleAttr;
                    }
                    else if (interfaces_1.isWater(old.height)) {
                        attribute = waterStyleAttr;
                    }
                    else {
                        attribute = landStyleAttr;
                    }
                    this.updateFogStyle(attribute, old.bufferIndex, updated.fog, updated.clouds);
                }
            });
            landStyleAttr.needsUpdate = true;
            mountainsStyleAttr.needsUpdate = true;
            waterStyleAttr.needsUpdate = true;
        }
        updateFogStyle(attr, index, fog, clouds) {
            const style = attr.getY(index);
            const fogMask = 0b1;
            const newStyle = fog ? (style | fogMask) : (style & ~fogMask);
            const withClouds = !clouds ? newStyle % 100 : 100 + newStyle;
            attr.setY(index, withClouds);
        }
        createTrees() {
            return __awaiter(this, void 0, void 0, function* () {
                const trees = this.trees = new Forests_1.default(this.tiles, this.globalGrid, {
                    treeSize: this.options.treeSize || 1.44,
                    spritesheet: this.options.treeSpritesheet,
                    spritesheetSubdivisions: this.options.treeSpritesheetSubdivisions,
                    treesPerForest: this.options.treesPerForest || 50,
                    mapScale: this.options.scale || 1.0,
                    alphaTest: this.options.treeAlphaTest || 0.2,
                    treeOptions: this.options.treeOptions
                });
                this.add(trees);
            });
        }
        // ── NEW: Create a water mesh using the same hexagon geometry but with water shaders ──
        createWaterMesh(tiles) {
            return __awaiter(this, void 0, void 0, function* () {
                const atlas = this.options.terrainAtlas;
                const geometry = createHexagonTilesGeometry(tiles, this.globalGrid, 0, this.options);
                const material = new three_1.RawShaderMaterial({
                    uniforms: {
                        sineTime: { value: 1.0 },
                        showGrid: { value: this._showGrid ? 1.0 : 0.0 },
                        camera: { value: new three_1.Vector3(0, 0, 0) },
                        texture: { value: this.options.terrainAtlasTexture },
                        textureAtlasMeta: {
                            value: new three_1.Vector4(atlas.width, atlas.height, atlas.cellSize, atlas.cellSpacing)
                        },
                        hillsNormal: {
                            value: this.options.hillsNormalTexture
                        },
                        coastAtlas: {
                            value: this.options.coastAtlasTexture
                        },
                        riverAtlas: {
                            value: this.options.riverAtlasTexture
                        },
                        mapTexture: {
                            value: this.options.undiscoveredTexture
                        },
                        transitionTexture: {
                            value: this.options.transitionTexture
                        },
                        lightDir: {
                            value: new three_1.Vector3(0.5, 0.6, -0.5).normalize()
                        },
                        gridColor: {
                            value: typeof this.options.gridColor != "undefined" ? this.options.gridColor : new three_1.Color(0xffffff)
                        },
                        gridWidth: {
                            value: typeof this.options.gridWidth != "undefined" ? this.options.gridWidth : 0.02
                        },
                        gridOpacity: {
                            value: typeof this.options.gridOpacity != "undefined" ? this.options.gridOpacity : 0.33
                        }
                    },
                    vertexShader: land_vertex_1.LAND_VERTEX_SHADER,
                    fragmentShader: land_fragment_1.LAND_FRAGMENT_SHADER,
                    side: three_1.FrontSide,
                    wireframe: false,
                    opacity: .2,
                    transparent: true,
                    depthWrite: false
                });
                this.waterMaterial = material;
                this.water = new three_1.Mesh(geometry, material);
                this.water.frustumCulled = false;
                this.water.layers.enable(10);
                this.add(this.water);
            });
        }
        createLandMesh(tiles) {
            return __awaiter(this, void 0, void 0, function* () {
                const atlas = this.options.terrainAtlas;
                const geometry = createHexagonTilesGeometry(tiles, this.globalGrid, 0, this.options);
                const material = new three_1.RawShaderMaterial({
                    uniforms: {
                        sineTime: { value: 0.0 },
                        showGrid: { value: this._showGrid ? 1.0 : 0.0 },
                        camera: { value: new three_1.Vector3(0, 0, 0) },
                        texture: { value: this.options.terrainAtlasTexture },
                        textureAtlasMeta: {
                            value: new three_1.Vector4(atlas.width, atlas.height, atlas.cellSize, atlas.cellSpacing)
                        },
                        hillsNormal: {
                            value: this.options.hillsNormalTexture
                        },
                        coastAtlas: {
                            value: this.options.coastAtlasTexture
                        },
                        riverAtlas: {
                            value: this.options.riverAtlasTexture
                        },
                        mapTexture: {
                            value: this.options.undiscoveredTexture
                        },
                        transitionTexture: {
                            value: this.options.transitionTexture
                        },
                        lightDir: {
                            value: new three_1.Vector3(0.5, 0.6, -0.5).normalize()
                        },
                        gridColor: {
                            value: typeof this.options.gridColor != "undefined" ? this.options.gridColor : new three_1.Color(0xffffff)
                        },
                        gridWidth: {
                            value: typeof this.options.gridWidth != "undefined" ? this.options.gridWidth : 0.02
                        },
                        gridOpacity: {
                            value: typeof this.options.gridOpacity != "undefined" ? this.options.gridOpacity : 0.33
                        }
                    },
                    vertexShader: this.options.landVertexShader,
                    fragmentShader: this.options.landFragmentShader,
                    side: three_1.FrontSide,
                    wireframe: false,
                    transparent: false
                });
                this.land = new three_1.Mesh(geometry, material);
                this.land.frustumCulled = false;
                this.land.layers.enable(10);
                this.add(this.land);
            });
        }
        createMountainMesh(tiles) {
            return __awaiter(this, void 0, void 0, function* () {
                const atlas = this.options.terrainAtlas;
                const geometry = createHexagonTilesGeometry(tiles, this.globalGrid, 1, this.options);
                const material = new three_1.RawShaderMaterial({
                    uniforms: {
                        sineTime: { value: 0.0 },
                        showGrid: { value: this._showGrid ? 1.0 : 0.0 },
                        camera: { value: new three_1.Vector3(0, 0, 0) },
                        texture: { value: this.options.terrainAtlasTexture },
                        textureAtlasMeta: {
                            value: new three_1.Vector4(atlas.width, atlas.height, atlas.cellSize, atlas.cellSpacing)
                        },
                        hillsNormal: {
                            value: this.options.hillsNormalTexture
                        },
                        mapTexture: {
                            value: this.options.undiscoveredTexture
                        },
                        lightDir: {
                            value: new three_1.Vector3(0.5, 0.6, -0.5).normalize()
                        },
                        gridColor: {
                            value: typeof this.options.gridColor != "undefined" ? this.options.gridColor : new three_1.Color(0xffffff)
                        },
                        gridWidth: {
                            value: typeof this.options.gridWidth != "undefined" ? this.options.gridWidth : 0.02
                        },
                        gridOpacity: {
                            value: typeof this.options.gridOpacity != "undefined" ? this.options.gridOpacity : 0.33
                        }
                    },
                    vertexShader: this.options.mountainsVertexShader,
                    fragmentShader: this.options.mountainsFragmentShader,
                    side: three_1.FrontSide,
                    wireframe: false,
                    transparent: false
                });
                this.mountains = new three_1.Mesh(geometry, material);
                this.mountains.frustumCulled = false;
                this.mountains.layers.enable(10);
                this.add(this.mountains);
            });
        }
    }
    exports.default = MapMesh;
    function createHexagonTilesGeometry(tiles, grid, numSubdivisions, options) {
        const scale = options.scale || 1.0;
        const hexagon = hexagon_1.createHexagon(scale, numSubdivisions);
        const geometry = new three_1.InstancedBufferGeometry();
        const textureAtlas = options.terrainAtlas;
        // geometry.maxInstancedCount = tiles.length
        geometry.setAttribute("position", hexagon.attributes.position);
        geometry.setAttribute("uv", hexagon.attributes.uv);
        geometry.setAttribute("border", hexagon.attributes.border);
        // positions for each hexagon tile
        const tilePositions = tiles.map((tile) => coords_1.qrToWorld(tile.q, tile.r, scale));
        const posAttr = new three_1.InstancedBufferAttribute(new Float32Array(tilePositions.length * 2), 2, false);
        posAttr.copyVector2sArray(tilePositions);
        geometry.setAttribute("offset", posAttr);
        //----------------
        const cellSize = textureAtlas.cellSize;
        const cellSpacing = textureAtlas.cellSpacing;
        const numColumns = textureAtlas.width / cellSize;
        function terrainCellIndex(terrain) {
            const cell = textureAtlas.textures[terrain];
            return cell.cellY * numColumns + cell.cellX;
        }
        const styles = tiles.map(function (tile, index) {
            const cell = textureAtlas.textures[tile.terrain];
            if (!cell) {
                throw new Error(`Terrain '${tile.terrain}' not in texture atlas\r\n` + JSON.stringify(textureAtlas));
            }
            const cellIndex = terrainCellIndex(tile.terrain);
            const shadow = tile.fog ? 1 : 0;
            const clouds = tile.clouds ? 1 : 0;
            const hills = interfaces_1.isHill(tile.height) ? 1 : 0;
            const style = shadow * 1 + hills * 10 + clouds * 100;
            // Coast and River texture index
            const coastIdx = computeCoastTextureIndex(grid, tile);
            const riverIdx = computeRiverTextureIndex(grid, tile);
            tile.bufferIndex = index;
            return new three_1.Vector4(cellIndex, style, coastIdx, riverIdx);
        });
        const styleAttr = new three_1.InstancedBufferAttribute(new Float32Array(tilePositions.length * 4), 4, false);
        styleAttr.copyVector4sArray(styles);
        geometry.setAttribute("style", styleAttr);
        // surrounding tile terrain represented as two consecutive Vector3s
        // 1. [tileIndex + 0] = NE, [tileIndex + 1] = E, [tileIndex + 2] = SE
        // 2. [tileIndex + 0] = SW, [tileIndex + 1] = W, [tileIndex + 2] = NW
        const neighborsEast = new three_1.InstancedBufferAttribute(new Float32Array(tiles.length * 3), 3, false);
        const neighborsWest = new three_1.InstancedBufferAttribute(new Float32Array(tiles.length * 3), 3, false);
        for (let i = 0; i < tiles.length; i++) {
            const neighbors = grid.surrounding(tiles[i].q, tiles[i].r);
            for (let j = 0; j < neighbors.length; j++) {
                const neighbor = neighbors[j];
                const attr = j > 2 ? neighborsWest : neighborsEast;
                const array = attr.array;
                // terrain cell index indicates the type of terrain for lookup in the shader
                array[3 * i + j % 3] = neighbor ? terrainCellIndex(neighbor.terrain) : -1;
            }
        }
        geometry.setAttribute("neighborsEast", neighborsEast);
        geometry.setAttribute("neighborsWest", neighborsWest);
        return geometry;
    }
    function computeCoastTextureIndex(grid, tile) {
        function isWaterTile(q, r) {
            const t = grid.get(q, r);
            if (!t)
                return false;
            return interfaces_1.isWater(t.height);
        }
        function bit(x) {
            return x ? "1" : "0";
        }
        if (isWaterTile(tile.q, tile.r)) {
            // only land tiles have a coast
            return 0;
        }
        const NE = bit(isWaterTile(tile.q + 1, tile.r - 1));
        const E = bit(isWaterTile(tile.q + 1, tile.r));
        const SE = bit(isWaterTile(tile.q, tile.r + 1));
        const SW = bit(isWaterTile(tile.q - 1, tile.r + 1));
        const W = bit(isWaterTile(tile.q - 1, tile.r));
        const NW = bit(isWaterTile(tile.q, tile.r - 1));
        return parseInt(NE + E + SE + SW + W + NW, 2);
    }
    function isNextOrPrevRiverTile(grid, tile, q, r, coastCount) {
        const neighbor = grid.get(q, r);
        if (neighbor && neighbor.rivers && tile && tile.rivers) {
            for (let self of tile.rivers) {
                for (let other of neighbor.rivers) {
                    const sameRiver = self.riverIndex == other.riverIndex &&
                        Math.abs(self.riverTileIndex - other.riverTileIndex) == 1;
                    const otherRiver = self.riverIndex != other.riverIndex && sameRiver;
                    if (sameRiver || otherRiver) {
                        return true;
                    }
                }
            }
            return false;
        }
        else {
            // let the river run into the first ocean / lake
            if (neighbor && interfaces_1.isWater(neighbor.height) && coastCount.count == 0) {
                coastCount.count++;
                return true;
            }
            else {
                return false;
            }
        }
    }
    function computeRiverTextureIndex(grid, tile) {
        if (!tile.rivers)
            return 0;
        const coastCount = { count: 0 };
        const NE = bitStr(isNextOrPrevRiverTile(grid, tile, tile.q + 1, tile.r - 1, coastCount));
        const E = bitStr(isNextOrPrevRiverTile(grid, tile, tile.q + 1, tile.r, coastCount));
        const SE = bitStr(isNextOrPrevRiverTile(grid, tile, tile.q, tile.r + 1, coastCount));
        const SW = bitStr(isNextOrPrevRiverTile(grid, tile, tile.q - 1, tile.r + 1, coastCount));
        const W = bitStr(isNextOrPrevRiverTile(grid, tile, tile.q - 1, tile.r, coastCount));
        const NW = bitStr(isNextOrPrevRiverTile(grid, tile, tile.q, tile.r - 1, coastCount));
        const combination = NE + E + SE + SW + W + NW;
        return parseInt(combination, 2);
    }
    function bitStr(x) {
        return x ? "1" : "0";
    }
});
//# sourceMappingURL=MapMesh.js.map