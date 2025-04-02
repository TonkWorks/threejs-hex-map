define("threejs-hex-map", ["three"], function(__WEBPACK_EXTERNAL_MODULE_4__) { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __importDefault = (this && this.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(17), __webpack_require__(6), __webpack_require__(18)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, MapMesh_1, DefaultMapViewController_1, Grid_1, Nations_1) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.DefaultMapViewController = exports.Grid = exports.MapMesh = exports.Nations = void 0;
	    MapMesh_1 = __importDefault(MapMesh_1);
	    DefaultMapViewController_1 = __importDefault(DefaultMapViewController_1);
	    Grid_1 = __importDefault(Grid_1);
	    exports.MapMesh = MapMesh_1.default;
	    exports.DefaultMapViewController = DefaultMapViewController_1.default;
	    exports.Grid = Grid_1.default;
	    Object.defineProperty(exports, "Nations", { enumerable: true, get: function () { return Nations_1.Nations; } });
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=index.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __importDefault = (this && this.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2), __webpack_require__(3), __webpack_require__(4), __webpack_require__(5), __webpack_require__(6), __webpack_require__(8), __webpack_require__(9), __webpack_require__(10), __webpack_require__(11), __webpack_require__(12)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, interfaces_1, hexagon_1, three_1, coords_1, Grid_1, land_fragment_1, land_vertex_1, mountains_fragment_1, mountains_vertex_1, Forests_1) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    Grid_1 = __importDefault(Grid_1);
	    Forests_1 = __importDefault(Forests_1);
	    class MapMesh extends three_1.Group {
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
	            this.tiles = tiles.map(t => (Object.assign({ bufferIndex: -1, isMountain: (0, interfaces_1.isMountain)(t.height) }, t)));
	            this.localGrid = new Grid_1.default(0, 0).init(this.tiles);
	            this.globalGrid = globalGrid || this.localGrid;
	            options.hillsNormalTexture.wrapS = options.hillsNormalTexture.wrapT = three_1.RepeatWrapping;
	            options.terrainAtlasTexture.wrapS = options.terrainAtlasTexture.wrapT = three_1.RepeatWrapping;
	            options.undiscoveredTexture.wrapS = options.undiscoveredTexture.wrapT = three_1.RepeatWrapping;
	            //options.transitionTexture.flipY = true
	            // ── Create the meshes: separate land, mountains, water, and trees ──
	            // NOTE: We now filter water tiles out of the land mesh and create a new water mesh.
	            this.loaded = Promise.all([
	                this.createMountainMesh(this.tiles.filter(t => t.isMountain)),
	                this.createLandMesh(this.tiles.filter(t => !t.isMountain)),
	                // this.createLandMesh(this.tiles.filter(t => !isWater(t.height) && !t.isMountain)),
	                // this.createWaterMesh(this.tiles.filter(t => isWater(t.height))),
	                this.createTrees()
	            ]).then(() => {
	                // All promises resolved; return nothing to make this a Promise<void>
	            }).catch((err) => {
	                console.error("Could not create MapMesh", err);
	            });
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
	            // const waterGeometry = this.water.geometry as InstancedBufferGeometry;
	            // const waterStyleAttr = waterGeometry.getAttribute("style") as InstancedBufferAttribute;
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
	                    else {
	                        attribute = landStyleAttr;
	                    }
	                    this.updateFogStyle(attribute, old.bufferIndex, updated.fog, updated.clouds);
	                }
	            });
	            landStyleAttr.needsUpdate = true;
	            mountainsStyleAttr.needsUpdate = true;
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
	                this.landMaterial = material;
	                this.land.frustumCulled = false;
	                this.land.layers.enable(10);
	                this.land.layers.enable(11);
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
	                this.mountains.layers.enable(11);
	                this.add(this.mountains);
	            });
	        }
	    }
	    exports.default = MapMesh;
	    function createHexagonTilesGeometry(tiles, grid, numSubdivisions, options) {
	        const scale = options.scale || 1.0;
	        const hexagon = (0, hexagon_1.createHexagon)(scale, numSubdivisions);
	        const geometry = new three_1.InstancedBufferGeometry();
	        const textureAtlas = options.terrainAtlas;
	        // geometry.maxInstancedCount = tiles.length
	        geometry.setAttribute("position", hexagon.attributes.position);
	        geometry.setAttribute("uv", hexagon.attributes.uv);
	        geometry.setAttribute("border", hexagon.attributes.border);
	        // positions for each hexagon tile
	        const tilePositions = tiles.map((tile) => (0, coords_1.qrToWorld)(tile.q, tile.r, scale));
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
	            const hills = (0, interfaces_1.isHill)(tile.height) ? 1 : 0;
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
	            return (0, interfaces_1.isWater)(t.height);
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
	            if (neighbor && (0, interfaces_1.isWater)(neighbor.height) && coastCount.count == 0) {
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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=MapMesh.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.isLand = isLand;
	    exports.isWater = isWater;
	    exports.isHill = isHill;
	    exports.isForest = isForest;
	    exports.isMountain = isMountain;
	    function isLand(height) {
	        return height >= 0.0 && height < 0.75;
	    }
	    function isWater(height) {
	        return height < 0.0;
	    }
	    function isHill(height) {
	        return height >= 0.375 && height < 0.75;
	    }
	    function isForest(t) {
	        if (t.treeIndex !== undefined) {
	            return true;
	        }
	    }
	    function isMountain(height) {
	        return height >= 0.75;
	    }
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=interfaces.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, three_1) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.NW = exports.W = exports.SW = exports.SE = exports.E = exports.NE = void 0;
	    exports.subdivideTriangle = subdivideTriangle;
	    exports.createHexagon = createHexagon;
	    exports.randomPointInHexagon = randomPointInHexagon;
	    exports.randomPointInHexagonEx = randomPointInHexagonEx;
	    exports.getHexPoints = getHexPoints;
	    exports.NE = 0b100000;
	    exports.E = 0b010000;
	    exports.SE = 0b001000;
	    exports.SW = 0b000100;
	    exports.W = 0b000010;
	    exports.NW = 0b000001;
	    function subdivideTriangle(a, b, c, numSubdivisions) {
	        if ((numSubdivisions || 0) <= 0)
	            return [a, b, c];
	        var ba = b.clone().sub(a);
	        var ah = a.clone().add(ba.setLength(ba.length() / 2));
	        var cb = c.clone().sub(b);
	        var bh = b.clone().add(cb.setLength(cb.length() / 2));
	        var ac = a.clone().sub(c);
	        var ch = c.clone().add(ac.setLength(ac.length() / 2));
	        return [].concat(subdivideTriangle(ah, bh, ch, numSubdivisions - 1), subdivideTriangle(ch, bh, c, numSubdivisions - 1), subdivideTriangle(ah, ch, a, numSubdivisions - 1), subdivideTriangle(bh, ah, b, numSubdivisions - 1));
	    }
	    function createHexagon(radius, numSubdivisions) {
	        var numFaces = 6 * Math.pow(4, numSubdivisions);
	        var positions = new Float32Array(numFaces * 3 * 3), p = 0;
	        var texcoords = new Float32Array(numFaces * 3 * 2), t = 0;
	        var border = new Float32Array(numFaces * 3 * 1), e = 0;
	        var points = [0, 1, 2, 3, 4, 5].map((i) => {
	            return new three_1.Vector3(radius * Math.sin(Math.PI * 2 * (i / 6.0)), radius * Math.cos(Math.PI * 2 * (i / 6.0)), 0);
	        }).concat([new three_1.Vector3(0, 0, 0)]);
	        var faces = [0, 6, 1, 1, 6, 2, 2, 6, 3, 3, 6, 4, 4, 6, 5, 5, 6, 0];
	        var vertices = []; // every three vertices constitute one face
	        for (var i = 0; i < faces.length; i += 3) {
	            var a = points[faces[i]], b = points[faces[i + 1]], c = points[faces[i + 2]];
	            vertices = vertices.concat(subdivideTriangle(a, b, c, numSubdivisions));
	        }
	        for (i = 0; i < vertices.length; i++) {
	            positions[p++] = vertices[i].x;
	            positions[p++] = vertices[i].y;
	            positions[p++] = vertices[i].z;
	            texcoords[t++] = 0.02 + 0.96 * ((vertices[i].x + radius) / (radius * 2));
	            texcoords[t++] = 0.02 + 0.96 * ((vertices[i].y + radius) / (radius * 2));
	            var inradius = (Math.sqrt(3) / 2) * radius;
	            border[e++] = vertices[i].length() >= inradius - 0.1 ? 1.0 : 0.0;
	        }
	        var geometry = new three_1.BufferGeometry();
	        geometry.setAttribute("position", new three_1.BufferAttribute(positions, 3));
	        geometry.setAttribute("uv", new three_1.BufferAttribute(texcoords, 2));
	        // 1.0 = border vertex, 0.0 otherwise
	        geometry.setAttribute("border", new three_1.BufferAttribute(border, 1));
	        return geometry;
	    }
	    /**
	     * Returns a random point in the regular hexagon at (0,0) with given hex radius on the Z=0 plane.
	     */
	    function randomPointInHexagon(hexRadius) {
	        // the hexagon consists of 6 triangles, construct one of them randomly
	        var startCornerIndex = Math.floor(Math.random() * 6);
	        var A = computeHexagonCorner(hexRadius, ((startCornerIndex + 0) % 6) / 6.0);
	        var B = new three_1.Vector3(0, 0, 0);
	        var C = computeHexagonCorner(hexRadius, ((startCornerIndex + 1) % 6) / 6.0);
	        // random point in the triangle based on AB and AC
	        var r = Math.random(), s = Math.random();
	        var rSqrt = Math.sqrt(r), sSqrt = Math.sqrt(s);
	        return A.clone().multiplyScalar((1 - rSqrt))
	            .add(B.clone().multiplyScalar(rSqrt * (1 - sSqrt)))
	            .add(C.clone().multiplyScalar(s * rSqrt));
	    }
	    /**
	     * Returns a random point in the regular hexagon at (0,0) with given hex radius on the Z=0 plane.
	     */
	    function randomPointInHexagonEx(hexRadius, modifier) {
	        // the hexagon consists of 6 triangles, construct one of them randomly
	        var startCornerIndex = Math.floor(Math.random() * 6);
	        const A = hexagonCorners1[startCornerIndex].clone();
	        const B = new three_1.Vector3(0, 0, 0);
	        const C = hexagonCorners1[(startCornerIndex + 1) % 6].clone();
	        // random point in the triangle based on AB and AC
	        var r = Math.random(), s = Math.random();
	        var rSqrt = Math.sqrt(r), sSqrt = Math.sqrt(s);
	        const point = A.multiplyScalar((1 - rSqrt))
	            .add(B.multiplyScalar(rSqrt * (1 - sSqrt)))
	            .add(C.multiplyScalar(s * rSqrt));
	        return point.multiplyScalar(modifier(startCornerIndex) * hexRadius);
	    }
	    function getHexPoints(cx, cy, radius = 1) {
	        const points = [];
	        // Using an angle offset to orient the hexagon as desired.
	        for (let i = 0; i < 6; i++) {
	            // Adjust the angle offset (here –30°) so that one edge is horizontal.
	            const angle = Math.PI / 180 * (60 * i - 30);
	            const x = cx + radius * Math.cos(angle);
	            const y = cy + radius * Math.sin(angle);
	            points.push(new three_1.Vector2(x, y));
	        }
	        return points;
	    }
	    function computeHexagonCorner(radius, angle) {
	        return new three_1.Vector3(radius * Math.sin(Math.PI * 2 * angle), radius * Math.cos(Math.PI * 2 * angle), 0);
	    }
	    function computeHexagonCorner1(angle) {
	        const radius = 1.0;
	        return new three_1.Vector3(radius * Math.sin(Math.PI * 2 * angle), radius * Math.cos(Math.PI * 2 * angle), 0);
	    }
	    const hexagonCorners1 = [
	        computeHexagonCorner1(0),
	        computeHexagonCorner1(1 / 6.0),
	        computeHexagonCorner1(2 / 6.0),
	        computeHexagonCorner1(3 / 6.0),
	        computeHexagonCorner1(4 / 6.0),
	        computeHexagonCorner1(5 / 6.0)
	    ];
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=hexagon.js.map

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, three_1) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.qrToWorld = qrToWorld;
	    exports.qrToWorldX = qrToWorldX;
	    exports.qrToWorldY = qrToWorldY;
	    exports.qrDistance = qrDistance;
	    exports.pickingRay = pickingRay;
	    exports.mouseToWorld = mouseToWorld;
	    exports.screenToWorld = screenToWorld;
	    exports.screenToWorldMiniMap = screenToWorldMiniMap;
	    exports.worldToScreen = worldToScreen;
	    exports.axialToCube = axialToCube;
	    exports.cubeToAxial = cubeToAxial;
	    exports.roundToHex = roundToHex;
	    const Z_PLANE = new three_1.Plane(new three_1.Vector3(0, 0, 1), 0);
	    function qrToWorld(q, r, scale = 1.0) {
	        return new three_1.Vector3(Math.sqrt(3) * (q + r / 2) * scale, (3 / 2) * r * scale, 0);
	    }
	    function qrToWorldX(q, r, scale = 1.0) {
	        return Math.sqrt(3) * (q + r / 2) * scale;
	    }
	    function qrToWorldY(q, r, scale = 1.0) {
	        return (3 / 2) * r * scale;
	    }
	    function qrDistance(a, b) {
	        return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
	    }
	    function pickingRay(vector, camera) {
	        // set two vectors with opposing z values
	        vector.z = -1.0;
	        var end = new three_1.Vector3(vector.x, vector.y, 1.0);
	        vector.unproject(camera);
	        end.unproject(camera);
	        // find direction from vector to end
	        end.sub(vector).normalize();
	        return new three_1.Raycaster(vector, end);
	    }
	    /**
	     * Transforms mouse coordinates into world space, assuming that the game view spans the entire window.
	     */
	    function mouseToWorld(e, camera) {
	        const mv = new three_1.Vector3((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1, 0.5);
	        const raycaster = new three_1.Raycaster();
	        raycaster.setFromCamera(mv, camera);
	        const target = new three_1.Vector3();
	        const intersection = raycaster.ray.intersectPlane(Z_PLANE, target);
	        return intersection ? intersection : null;
	    }
	    /**
	     * Transforms screen coordinates into world space, assuming that the game view spans the entire window.
	     */
	    function screenToWorld(x, y, camera) {
	        const mv = new three_1.Vector3((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1, 0.5);
	        const raycaster = new three_1.Raycaster();
	        raycaster.setFromCamera(mv, camera);
	        const target = new three_1.Vector3();
	        const intersection = raycaster.ray.intersectPlane(Z_PLANE, target);
	        return intersection ? intersection : null;
	    }
	    /**
	     * Transforms screen coordinates into world space, assuming that the game view spans the entire window.
	     */
	    function screenToWorldMiniMap(x, y, camera) {
	        // Convert screen coordinates to minimap-local coordinates
	        const box = document.getElementById("minimap").getBoundingClientRect();
	        const localY = y - box.top;
	        const localX = x - box.left;
	        // Convert to Normalized Device Coordinates (NDC)
	        const ndcX = (localX / box.width) * 2 - 1;
	        const ndcY = -(localY / box.height) * 2 + 1;
	        const mv = new three_1.Vector3(ndcX, ndcY, 0.5);
	        const raycaster = new three_1.Raycaster();
	        raycaster.setFromCamera(mv, camera);
	        const intersection = raycaster.ray.intersectPlane(Z_PLANE, new three_1.Vector3());
	        return intersection ? intersection : null;
	    }
	    /**
	     * Transforms world coordinates into screen space.
	     */
	    function worldToScreen(pos, camera) {
	        var v = pos.clone();
	        v.project(camera);
	        v.x = window.innerWidth / 2 + v.x * (window.innerWidth / 2);
	        v.y = window.innerHeight / 2 - v.y * (window.innerHeight / 2);
	        return v;
	    }
	    function axialToCube(q, r) {
	        return { x: q, y: -q - r, z: r };
	    }
	    function cubeToAxial(x, y, z) {
	        return { q: x, r: z };
	    }
	    /**
	     * Rounds fractal cube coordinates to the nearest full cube coordinates.
	     * @param cubeCoord
	     * @returns {{x: number, y: number, z: number}}
	     */
	    function roundToHex(cubeCoord) {
	        var x = cubeCoord.x, y = cubeCoord.y, z = cubeCoord.z;
	        var rx = Math.round(x);
	        var ry = Math.round(y);
	        var rz = Math.round(z);
	        var x_diff = Math.abs(rx - x);
	        var y_diff = Math.abs(ry - y);
	        var z_diff = Math.abs(rz - z);
	        if (x_diff > y_diff && x_diff > z_diff)
	            rx = -ry - rz;
	        else if (y_diff > z_diff)
	            ry = -rx - rz;
	        else
	            rz = -rx - ry;
	        return { x: rx, y: ry, z: rz };
	    }
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=coords.js.map

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(7)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    class Grid {
	        get length() {
	            return this._width * this._height;
	        }
	        get width() {
	            return this._width;
	        }
	        get height() {
	            return this._height;
	        }
	        constructor(_width, _height) {
	            this._width = _width;
	            this._height = _height;
	            this.data = [];
	            this.halfWidth = this._width / 2;
	            this.halfHeight = this._height / 2;
	            if (_width % 2 != 0 || _height % 2 != 0) {
	                throw new Error("With and height of grid must be divisible by 2");
	            }
	            this.data = [];
	        }
	        forEachQR(f) {
	            const { _width, _height } = this;
	            for (var i = -this.halfWidth; i < this.halfWidth; i++) {
	                for (var j = -this.halfHeight; j < this.halfHeight; j++) {
	                    const q = i - j / 2 + ((-_height / 2 + j) % 2) / 2;
	                    const r = j;
	                    f(q, r, this.get(q, r));
	                }
	            }
	            return this;
	        }
	        /**
	         * Iterates over the grid using the indices (i,j), where i = [0..width-1] and j = [0..height-1].
	         * (0, 0) corresponds to the upper left corner, (width-1, height-1) to the bottom right corner.
	         */
	        forEachIJ(f) {
	            const { _width, _height } = this;
	            for (var i = -this.halfWidth; i < this.halfWidth; i++) {
	                for (var j = -this.halfHeight; j < this.halfHeight; j++) {
	                    const q = i - j / 2 + ((-_height / 2 + j) % 2) / 2;
	                    const r = j;
	                    f(i + this.halfWidth, j + this.halfHeight, q, r, this.get(q, r));
	                }
	            }
	            return this;
	        }
	        init(items) {
	            items.forEach(item => {
	                this.add(item.q, item.r, item);
	            });
	            return this;
	        }
	        initQR(f) {
	            return this.forEachQR((q, r, item) => this.add(q, r, f(q, r, item)));
	        }
	        mapQR(f) {
	            const mapped = new Grid(this._width, this._height);
	            this.forEachQR((q, r, item) => mapped.add(q, r, f(q, r, item)));
	            return mapped;
	        }
	        toArray() {
	            const arr = new Array(this._width * this._height);
	            var i = 0;
	            for (let q in this.data) {
	                for (let r in this.data[q]) {
	                    arr[i++] = this.data[q][r];
	                }
	            }
	            return arr;
	        }
	        get(q, r) {
	            const col = this.data[q];
	            if (col) {
	                return col[r];
	            }
	            else {
	                return undefined;
	            }
	        }
	        getOrCreate(q, r, defaultValue) {
	            const col = this.data[q];
	            if (!col) {
	                this.data[q] = [];
	                this.data[q][r] = defaultValue;
	                return defaultValue;
	            }
	            const cell = col[r];
	            if (!cell) {
	                this.data[q][r] = defaultValue;
	                return defaultValue;
	            }
	            return cell;
	        }
	        add(q, r, item) {
	            if (q in this.data) {
	                this.data[q][r] = item;
	            }
	            else {
	                const col = this.data[q] = [];
	                col[r] = item;
	            }
	        }
	        neighbors(q, r, range = 1) {
	            return (range == 1 ? Grid.NEIGHBOR_QRS : (0, util_1.qrRange)(range)).map(qr => {
	                return this.get(q + qr.q, r + qr.r);
	            }).filter(x => x !== undefined);
	        }
	        /**
	         * Returns a list of exactly 6 items for each of the surrounding tiles at (q,r).
	         * Non-existing neighbors will occur as "undefined". The list is always returned
	         * in the same order of NE [0], E [1], SE [2], SW [3], W [4], NW [5].
	         * @param q
	         * @param r
	         * @returns {{q: number, r: number}[]}
	         */
	        surrounding(q, r) {
	            return Grid.NEIGHBOR_QRS.map(qr => {
	                return this.get(q + qr.q, r + qr.r);
	            });
	        }
	        // Add this method to your TileGrid class
	        line(fromQ, fromR, toQ, toR) {
	            const result = [];
	            // Calculate the distance between the points
	            const distance = this.distance(fromQ, fromR, toQ, toR);
	            // If the points are the same, return just that tile
	            if (distance === 0) {
	                const tile = this.get(fromQ, fromR);
	                return tile ? [tile] : [];
	            }
	            // For each step along the line
	            for (let i = 0; i <= distance; i++) {
	                // Calculate the interpolated position
	                const t = distance === 0 ? 0.0 : i / distance;
	                // Linear interpolation between the two points
	                const q = Math.round(fromQ + (toQ - fromQ) * t);
	                const r = Math.round(fromR + (toR - fromR) * t);
	                // Get the cube coordinates (q, r, s where q + r + s = 0)
	                // In cube coordinates, s = -q - r
	                const s = -q - r;
	                // Get the tile at this position
	                const tile = this.get(q, r);
	                if (tile) {
	                    result.push(tile);
	                }
	            }
	            return result;
	        }
	        // Helper method to calculate distance between two hex coordinates
	        // Add this if you don't already have it
	        distance(q1, r1, q2, r2) {
	            // In cube coordinates, s1 = -q1 - r1 and s2 = -q2 - r2
	            const s1 = -q1 - r1;
	            const s2 = -q2 - r2;
	            // The distance is the maximum of the absolute differences
	            return Math.max(Math.abs(q1 - q2), Math.abs(r1 - r2), Math.abs(s1 - s2));
	        }
	        //
	        exportData(excludedProperties = ["improvement", "improvementOverlay", "territoryOverlay", "unit", "civilian_unit", "locked"]) {
	            const items = this.toArray()
	                .filter((item) => item !== undefined)
	                .map(item => {
	                const copy = {};
	                Object.keys(item).forEach((key) => {
	                    // Skip excluded properties.
	                    if (excludedProperties.includes(key)) {
	                        return;
	                    }
	                    if (key === "resource") {
	                        // Create a shallow copy of resource so modifications do not affect the original.
	                        copy[key] = Object.assign({}, item[key]);
	                        delete copy[key].model;
	                        delete copy[key].mapModel;
	                        delete copy[key].map;
	                        delete copy[key].image;
	                    }
	                    else if (key === "worker_improvement") {
	                        // Create a shallow copy of resource so modifications do not affect the original.
	                        copy[key] = Object.assign({}, item[key]);
	                        delete copy[key].model;
	                        delete copy[key].images;
	                        delete copy[key].yields;
	                    }
	                    else if (key === "clouds" && item[key] === false) {
	                        // Omit this property.
	                    }
	                    else if (key === "fog" && item[key] === false) {
	                        // Omit this property.
	                    }
	                    else if (key === "rivers" && item[key] === null) {
	                        // Omit this property.
	                    }
	                    else {
	                        copy[key] = item[key];
	                    }
	                });
	                return copy;
	            });
	            return {
	                width: this.width,
	                height: this.height,
	                items: items
	            };
	        }
	        static fromJSON(json) {
	            const parsed = json;
	            const grid = new Grid(parsed.grid.width, parsed.grid.height);
	            grid.init(parsed.grid.items);
	            return grid;
	        }
	    }
	    Grid.NEIGHBOR_QRS = [
	        { q: 1, r: -1 }, // NE
	        { q: 1, r: 0 }, // E
	        { q: 0, r: 1 }, // SE
	        { q: -1, r: 1 }, // SW
	        { q: -1, r: 0 }, // W
	        { q: 0, r: -1 } // NW
	    ];
	    exports.default = Grid;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=Grid.js.map

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, three_1) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.loadTexture = loadTexture;
	    exports.loadFile = loadFile;
	    exports.loadJSON = loadJSON;
	    exports.qrRange = qrRange;
	    exports.forEachRange = forEachRange;
	    exports.capitalize = capitalize;
	    exports.shuffle = shuffle;
	    exports.range = range;
	    exports.getRandomInt = getRandomInt;
	    exports.flatMap = flatMap;
	    exports.sum = sum;
	    exports.qrEquals = qrEquals;
	    exports.minBy = minBy;
	    exports.isInteger = isInteger;
	    exports.flatten = flatten;
	    exports.deepCopy = deepCopy;
	    exports.deepCopyIgnoring = deepCopyIgnoring;
	    exports.loadTextureAtlas = loadTextureAtlas;
	    exports.asset = asset;
	    exports.updateMaterialColor = updateMaterialColor;
	    const fileLoader = new three_1.FileLoader();
	    const textureLoader = new three_1.TextureLoader();
	    function loadTexture(url, onProgress) {
	        return new Promise((resolve, reject) => {
	            const onLoad = (texture) => {
	                resolve(texture);
	            };
	            const onProgressWrapper = (progress) => {
	                if (onProgress) {
	                    onProgress(100 * (progress.loaded / progress.total), progress.total, progress.loaded);
	                }
	            };
	            const onError = (error) => {
	                reject(error);
	            };
	            textureLoader.load(url, onLoad, onProgressWrapper, onError);
	        });
	    }
	    function loadFile(url) {
	        return __awaiter(this, void 0, void 0, function* () {
	            return new Promise((resolve, reject) => {
	                fileLoader.load(url, (result) => resolve(result), undefined, (error) => reject(error));
	            });
	        });
	    }
	    function loadJSON(path) {
	        return __awaiter(this, void 0, void 0, function* () {
	            return loadFile(path).then(str => JSON.parse(str));
	        });
	    }
	    function qrRange(qrRadius) {
	        const coords = [];
	        forEachRange(-qrRadius, qrRadius + 1, (dx) => {
	            forEachRange(Math.max(-qrRadius, -dx - qrRadius), Math.min(qrRadius, -dx + qrRadius) + 1, (dy) => {
	                var dz = -dx - dy;
	                coords.push({ q: dx, r: dz });
	            });
	        });
	        return coords;
	    }
	    function forEachRange(min, max, f) {
	        if (!max) {
	            return range(0, min);
	        }
	        else {
	            for (var i = min; i < max; i++) {
	                f(i);
	            }
	        }
	    }
	    function capitalize(str) {
	        if (!str)
	            return str; // Handle empty string case
	        return str.charAt(0).toUpperCase() + str.slice(1);
	    }
	    function shuffle(a) {
	        var j, x, i;
	        for (i = a.length; i; i--) {
	            j = Math.floor(Math.random() * i);
	            x = a[i - 1];
	            a[i - 1] = a[j];
	            a[j] = x;
	        }
	        return a;
	    }
	    function range(minOrMax, max) {
	        if (!max) {
	            return this.range(0, minOrMax);
	        }
	        else {
	            var values = [];
	            for (var i = minOrMax; i < max; i++) {
	                values.push(i);
	            }
	            return values;
	        }
	    }
	    function getRandomInt(min, max) {
	        min = Math.ceil(min);
	        max = Math.floor(max);
	        return Math.floor(Math.random() * (max - min + 1)) + min;
	    }
	    function flatMap(items, map) {
	        return [].concat.apply([], items.map(map));
	    }
	    function sum(numbers) {
	        return numbers.reduce((sum, item) => sum + item, 0);
	    }
	    function qrEquals(a, b) {
	        return a.q == b.q && a.r == b.r;
	    }
	    function minBy(items, by) {
	        if (items.length == 0) {
	            return null;
	        }
	        else if (items.length == 1) {
	            return items[0];
	        }
	        else {
	            return items.reduce((min, cur) => by(cur) < by(min) ? cur : min, items[0]);
	        }
	    }
	    function isInteger(value) {
	        return Math.floor(value) == value;
	    }
	    function flatten(items) {
	        return [].concat.apply([], items);
	    }
	    function deepCopy(obj) {
	        return JSON.parse(JSON.stringify(obj));
	    }
	    function deepCopyIgnoring(obj, keysToIgnore) {
	        return JSON.parse(JSON.stringify(obj, (key, value) => {
	            // Skip keys that are in the keysToIgnore list.
	            if (keysToIgnore.includes(key)) {
	                return {};
	            }
	            return value;
	        }));
	    }
	    function loadTextureAtlas() {
	        return __awaiter(this, void 0, void 0, function* () {
	            return loadJSON("../../assets/land-atlas.json");
	        });
	    }
	    function asset(relativePath) {
	        return "../../assets/" + relativePath;
	    }
	    /// three.js and animations
	    function updateMaterialColor(material, color) {
	        if (material instanceof three_1.MeshBasicMaterial ||
	            material instanceof three_1.MeshStandardMaterial) {
	            material.color.set(color);
	        }
	        else {
	            console.warn('Material does not support color property:', material);
	        }
	    }
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=util.js.map

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.LAND_FRAGMENT_SHADER = void 0;
	    exports.LAND_FRAGMENT_SHADER = `
	//
	// Fragment Shader for Land
	//

	precision mediump float;

	uniform float sineTime;
	uniform float showGrid;
	uniform float zoom;
	uniform sampler2D texture;
	uniform sampler2D hillsNormal;
	uniform sampler2D coastAtlas;
	uniform sampler2D riverAtlas;
	uniform sampler2D mapTexture;
	uniform sampler2D transitionTexture;
	uniform mat3 normalMatrix;

	uniform vec3 gridColor;
	uniform float gridWidth;
	uniform float gridOpacity;

	// (width, height, cellSize, cellSpacing)
	uniform vec4 textureAtlasMeta;

	varying vec2 vUV;
	varying vec2 vTexCoord;
	varying vec3 vPosition;
	varying float vExtra;
	varying float vTerrain;
	varying float vFogOfWar;
	varying float vHill;
	varying float vHidden;
	varying vec2 vOffset;
	varying vec2 vCoastTextureCell;
	varying vec2 vRiverTextureCell;
	varying vec3 vLightDirT;
	varying vec3 vNeighborsEast;
	varying vec3 vNeighborsWest;

	const vec3 cameraPos = vec3(0, -25.0, 25.0);
	const vec3 lightDir = vec3(0.0, -1.0, -1.0);
	const vec3 lightAmbient = vec3(0.3, 0.3, 0.3);
	const vec3 lightDiffuse = vec3(1.3, 1.3, 1.3);

	const float hillsNormalMapScale = 0.3; //0.1;

	vec2 cellIndexToUV(float idx) {
	    float atlasWidth = textureAtlasMeta.x;
	    float atlasHeight = textureAtlasMeta.y;
	    float cellSize = textureAtlasMeta.z;
	    float cols = atlasWidth / cellSize - 1e-6; // subtract small epsilon to avoid edge cases that cause flickering
	    float rows = atlasHeight / cellSize;
	    float x = mod(idx, cols);
	    float y = floor(idx / cols);

	    //return vec2(uv.x * w + u, 1.0 - (uv.y * h + v));
	    return vec2(x / cols + vUV.x / cols, 1.0 - (y / rows + (1.0 - vUV.y) / rows));
	}

	/**
	 * Uses the texture of a neighboring terrain to blend the given color.
	 * @parma color to blend with
	 * @param terrain texture atlas index
	 * @param sector 0 - 5 (NE - NW) 
	 */
	vec4 terrainTransition(vec4 inputColor, float terrain, float sector) {
	    if (vTerrain <= 1.0 && terrain > 1.0) return inputColor;
	    vec2 otherUV = cellIndexToUV(terrain);
	    vec2 blendMaskUV = vec2(sector/6.0 + vUV.x / 6.0, 1.0 - vUV.y / 6.0);
	    vec4 color = texture2D(texture, otherUV);
	    vec4 blend = texture2D(transitionTexture, blendMaskUV);
	    float a = min(blend.r, clamp(terrain - vTerrain, 0.0, 1.0));
	    
	    return mix(inputColor, color, a);
	}

	/**
	 * Blends river textures between neighboring hexagons
	 * @param baseRiverColor The current river color
	 * @param neighborCell The neighbor's river texture cell coordinates
	 * @param sector Which neighbor (0-5, matching the terrain sectors)
	 * @return The blended river color
	 */
	vec4 blendRivers(vec4 baseRiverColor, vec2 neighborCell, float sector) {
	    // Skip if no river in the neighbor
	    if (neighborCell.x < 0.0 || neighborCell.y < 0.0) return baseRiverColor;
	    
	    // Sample the neighbor's river texture
	    vec2 neighborRiverUv = vec2(neighborCell.x / 8.0 + vUV.x / 8.0, 
	                              1.0 - (neighborCell.y / 8.0 + vUV.y / 8.0));
	    
	    // Apply similar flow effect as main river
	    float distortionStrength = 0.0002;
	    vec2 flowOffset = vec2(
	        sin(vUV.y * 10.0 + sineTime * 1.5) * distortionStrength,
	        sin(vUV.x * 8.0 + sineTime * 1.0) * distortionStrength
	    );
	    vec4 neighborRiverColor = texture2D(riverAtlas, neighborRiverUv + flowOffset);
	    
	    // Create a blend mask at the edge corresponding to this sector
	    vec2 blendMaskUV = vec2(sector/6.0 + vUV.x / 6.0, 1.0 - vUV.y / 6.0);
	    vec4 blendMask = texture2D(transitionTexture, blendMaskUV);
	    
	    // Only blend at the edges (using the same transition mask that terrain uses)
	    float blendFactor = blendMask.r * neighborRiverColor.a;
	    
	    // Combine base river with neighbor river at boundary
	    return vec4(
	        mix(baseRiverColor.rgb, neighborRiverColor.rgb, blendFactor),
	        max(baseRiverColor.a, blendFactor)
	    );
	}

	void main() {
	    // LAND
	    vec4 texColor = texture2D(texture, vTexCoord);
	    vec3 normal = vec3(0.0, 1.0, 0.0);
	    vec2 normalMapUV = vPosition.xy * hillsNormalMapScale;

	    /// Transitions to neighboring tiles
	    texColor = terrainTransition(texColor, vNeighborsEast.x, 0.0);
	    texColor = terrainTransition(texColor, vNeighborsEast.y, 1.0);
	    texColor = terrainTransition(texColor, vNeighborsEast.z, 2.0);
	    texColor = terrainTransition(texColor, vNeighborsWest.x, 3.0);
	    texColor = terrainTransition(texColor, vNeighborsWest.y, 4.0);
	    texColor = terrainTransition(texColor, vNeighborsWest.z, 5.0);

	    // HILL
	    if (vHill > 0.0) {
	        normal = normalize((texture2D(hillsNormal, normalMapUV).xyz * 2.0) - 1.0);
	        normal = mix(normal, vec3(0.0, 1.0, 0.0), vExtra * vExtra * vExtra); // fade out towards tile edges
	    }

	    vec3 lightDir = vLightDirT;
	    float lambertian = max(dot(lightDir, normal), 0.0);
	    //lambertian = sqrt(lambertian);

	    vec3 color = lightAmbient * texColor.xyz + lambertian * texColor.xyz * lightDiffuse;
	    gl_FragColor = vec4(color, 1.0);    
	    
	    // comment out following line to show normal vector visualization
	    //gl_FragColor = vec4((normal.x + 1.0 / 2.0, 0.0, 1.0), (normal.y + 1.0 / 2.0, 0.0, 1.0), (normal.z + 1.0 / 2.0, 0.0, 1.0), 1.0);
	    
	    // comment out following line to show normal map texture (UV) coordinates
	    //gl_FragColor = vec4(mod(normalMapUV.x, 1.0), mod(normalMapUV.y, 1.0), 0.0, 1.0);

	    // Coast
	    vec2 coastUv = vec2(vCoastTextureCell.x / 8.0 + vUV.x / 8.0, 1.0 - (vCoastTextureCell.y / 8.0 + vUV.y / 8.0));
	    vec4 coastColor = texture2D(coastAtlas, coastUv);

	    if (coastColor.w > 0.0) {
	        vec3 coast = lightAmbient * coastColor.xyz + lambertian * coastColor.xyz * lightDiffuse;
	        gl_FragColor = mix(gl_FragColor, vec4(coast, 1.0), coastColor.w);
	    }
	    
	    // River
	    vec2 riverUv = vec2(vRiverTextureCell.x / 8.0 + vUV.x / 8.0, 1.0 - (vRiverTextureCell.y / 8.0 + vUV.y / 8.0));
	    
	    // Create flowing water effect with subtle texture distortion
	    float distortionStrength = 0.0002;
	    vec2 flowOffset = vec2(
	        sin(vUV.y * 10.0 + sineTime * 1.5) * distortionStrength,
	        sin(vUV.x * 8.0 + sineTime * 1.0) * distortionStrength
	    );
	    vec4 riverColor = texture2D(riverAtlas, riverUv + flowOffset);

	    if (riverColor.w > 0.0) {
	        // Add brightness variation to simulate flowing water
	        float flowBrightness = sin(vUV.x * 8.0 + vUV.y * 12.0 + sineTime * 2.0) * 0.05 + 0.05;
	        vec3 river = lightAmbient * riverColor.xyz + lambertian * riverColor.xyz * lightDiffuse;
	        river += flowBrightness; // Add highlights that move over time
	        gl_FragColor = mix(gl_FragColor, vec4(river, 1.0), riverColor.w);
	    }

	    if (showGrid > 0.0 && vExtra > 1.0 - gridWidth) { // hex border
	        gl_FragColor = mix(vec4(gridColor, 1.0), gl_FragColor, 1.0 - gridOpacity);
	    }

	    // FOW
	    gl_FragColor = gl_FragColor * (vFogOfWar > 0.0 && vHidden == 0.0 ? 0.5 : 0.95);

	    // Map Texture for hidden tiles
	    if (vHidden > 0.0) {
	        gl_FragColor = texture2D(mapTexture, vec2(vPosition.x * 0.05, vPosition.y * 0.05));
	    }    
	}
	`;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=land.fragment.js.map

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.LAND_VERTEX_SHADER = void 0;
	    exports.LAND_VERTEX_SHADER = `
	//
	// Vertex Shader for Land
	//
	precision mediump float;

	uniform float sineTime; // oscillating time [-1.0, 1.0]
	uniform float zoom; // camera zoom factor
	uniform float size; // quadratic map size (i.e. size=10 means 10x10 hexagons)
	uniform mat4 modelViewMatrix;
	uniform mat4 projectionMatrix;
	uniform mat3 normalMatrix;
	uniform mat4 modelMatrix;
	uniform vec3 camera; // camera position in world space

	// (width, height, cellSize, cellSpacing)
	uniform vec4 textureAtlasMeta;

	uniform vec3 lightDir;

	attribute vec3 position; // position of one of the hexagon's vertices
	attribute vec2 offset; // world position offset for the entire hexagon (tile)
	attribute vec2 uv; // texture coordinates
	attribute float border; // border = distance from hexagon center (0.0 = center, 1.0 = border)

	// style.x = texture atlas cell index
	// style.y = "decimal bitmask" (fog=1xx, hills=x1x, clouds=xx1)
	// style.z = coast texture index (0 - 64)
	// style.w = river texture index (0 - 64)
	attribute vec4 style;

	// type of terrain on surrounding tiles as texture atlas cell index (like style.x)
	// is -1 if there is no neighbor (e.g. at the border of the map)
	attribute vec3 neighborsEast; // x = NE, y = E, z = SE
	attribute vec3 neighborsWest; // x = SW, y = W, z = NW 

	varying vec3 vPosition;
	varying vec2 vTexCoord;
	varying vec2 vUV;
	varying float vExtra;
	varying float vTerrain; // texture cell
	varying float vFogOfWar; // 1.0 = shadow, 0.0 = visible
	varying float vHidden; // 1.0 = hidden, 0.0 = visible
	varying float vHill;
	varying vec2 vOffset;
	varying vec2 vCoastTextureCell;
	varying vec2 vRiverTextureCell;
	varying vec3 vLightDirT;

	varying vec3 vNeighborsEast;
	varying vec3 vNeighborsWest;

	vec2 cellIndexToUV(float idx) {
	    float atlasWidth = textureAtlasMeta.x;
	    float atlasHeight = textureAtlasMeta.y;
	    float cellSize = textureAtlasMeta.z;
	    float cols = atlasWidth / cellSize;
	    float rows = atlasHeight / cellSize;
	    float x = mod(idx, cols);
	    float y = floor(idx / cols);

	    //return vec2(uv.x * w + u, 1.0 - (uv.y * h + v));
	    return vec2(x / cols + uv.x / cols, 1.0 - (y / rows + (1.0 - uv.y) / rows));
	}

	mat3 tangentSpace(vec3 normal_ws, vec3 tangent, mat4 worldMatrix) {
	    vec3 binormal = cross(tangent, normal_ws);
	    mat3 M;
	    M[0] = normalize(binormal);
	    M[1] = normalize(tangent);
	    M[2] = normalize(normal_ws);
	    
	    return mat3(modelMatrix) * M;
	}

	void main() {
	    vec3 pos = vec3(offset.x + position.x, offset.y + position.y, 0);

	    // its a hill if style's 2nd decimal is 1, i.e. any number matching x1x, e.g. 10, 11, 110
	    float hill = floor(mod(style.y / 10.0, 10.0)); // 0 = no, 1 = yes

	    if (hill > 0.0 && border < 0.75) { // hill
	        //pos.z = 0.1 + (0.5 + sin(uv.s + pos.s * 2.0) * 0.5) * 0.25;
	        vHill = 1.0;
	    } else {
	        vHill = 0.0;
	    }

	    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
	    vPosition = pos;
	    vOffset = offset;

	    vUV = uv;
	    vTexCoord = cellIndexToUV(style.x);
	    vCoastTextureCell = vec2(mod(style.z, 8.0), floor(style.z / 8.0));
	    vRiverTextureCell = vec2(mod(style.w, 8.0), floor(style.w / 8.0));

	    vExtra = border;
	    vFogOfWar = mod(style.y, 10.0) == 1.0 ? 1.0 : 0.0;   // style.y < 100.0 ? 10.0 : (style.y == 1.0 || style.y == 11.0 ? 1.0 : 0.0);
	    vHidden = style.y >= 100.0 ? 1.0 : 0.0;
	    
	    mat3 T = tangentSpace(vec3(0.0, -1.0, 0.0), vec3(0.0, 0.0, 1.0), modelMatrix);
	    vLightDirT = normalize(T * lightDir);
	    
	    vNeighborsEast = neighborsEast;
	    vNeighborsWest = neighborsWest;
	    
	    vTerrain = style.x;
	}
	`;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=land.vertex.js.map

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.MOUNTAINS_FRAGMENT_SHADER = void 0;
	    exports.MOUNTAINS_FRAGMENT_SHADER = `
	//
	// Fragment Shader for Land
	//

	precision highp float;
	uniform float sineTime;
	uniform float showGrid;
	uniform float zoom;
	uniform sampler2D texture;
	uniform sampler2D hillsNormal;
	uniform sampler2D mapTexture;

	uniform vec3 gridColor;
	uniform float gridWidth;
	uniform float gridOpacity;

	varying vec2 vTexCoord;
	varying vec3 vPosition;
	varying float vExtra;
	varying float vFogOfWar;
	varying float vHill;
	varying float vHidden;
	varying vec2 vOffset;
	varying vec3 vLightDirT;
	varying vec3 vNeighborsEast;
	varying vec3 vNeighborsWest;

	const vec3 cameraPos = vec3(0, -25.0, 25.0);
	const vec3 lightPos = vec3(1000.0, 1000.0, 1000.0);
	const vec3 lightAmbient = vec3(0.08, 0.08, 0.08);
	const vec3 lightDiffuse = vec3(1.3, 1.3, 1.3);

	void main() {
	    // LAND
	    vec4 texColor = texture2D(texture, vTexCoord);
	    vec3 normal = vec3(0.0, 1.0, 0.0);

	    normal = normalize((texture2D(hillsNormal, vTexCoord * 1.5 + vOffset * 0.5).xyz * 2.0) - 1.0);

	    //vec3 lightDir = normalize(lightPos - vPosition);
	    vec3 lightDir = vLightDirT;
	    float lambertian = max(dot(lightDir, normal), 0.0);

	    vec3 color = lightAmbient + lambertian * texColor.xyz * lightDiffuse;
	    gl_FragColor = vec4(color, 1.0);

	    if (showGrid > 0.0 && vExtra > 1.0 - gridWidth) { // hex border
	        gl_FragColor = mix(vec4(gridColor, 1.0), gl_FragColor, 1.0 - gridOpacity);
	    }

	    // FOW
	    gl_FragColor = gl_FragColor * (vFogOfWar > 0.0 ? 0.66 : 1.0);

	    // Map Texture for hidden tiles
	    if (vHidden > 0.0) {
	        gl_FragColor = texture2D(mapTexture, vec2(vPosition.x * 0.05, vPosition.y * 0.05));
	    } 
	}
	`;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=mountains.fragment.js.map

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.MOUNTAINS_VERTEX_SHADER = void 0;
	    exports.MOUNTAINS_VERTEX_SHADER = `
	//
	// Vertex Shader for Land
	//


	precision highp float;

	uniform float sineTime; // oscillating time [-1.0, 1.0]
	uniform float zoom; // camera zoom factor
	uniform float size; // quadratic map size (i.e. size=10 means 10x10 hexagons)
	uniform mat4 modelViewMatrix;
	uniform mat4 projectionMatrix;
	uniform mat3 normalMatrix;
	uniform mat4 modelMatrix;
	uniform vec3 camera; // camera position in world space

	uniform vec3 lightDir;

	// (width, height, cellSize, cellSpacing)
	uniform vec4 textureAtlasMeta;

	attribute vec3 position; // position of one of the hexagon's vertices
	attribute vec2 offset; // world position offset for the entire hexagon (tile)
	attribute vec2 uv; // texture coordinates
	attribute float border; // border = distance from hexagon center (0.0 = center, 1.0 = border)

	// style.x = texture atlas cell index
	// style.y = "decimal bitmask" (fog=1xx, hills=x1x, clouds=xx1)
	// style.z = coast texture index (0 - 64)
	// style.w = river texture index (0 - 64)
	attribute vec2 style;

	// type of terrain on surrounding tiles as texture atlas cell index (like style.x)
	// is -1 if there is no neighbor (e.g. at the border of the map)
	attribute vec3 neighborsEast; // x = NE, y = E, z = SE
	attribute vec3 neighborsWest; // x = SW, y = W, z = NW 

	varying vec3 vPosition;
	varying vec2 vTexCoord;
	varying float vExtra;
	varying float vFogOfWar; // 1.0 = shadow, 0.0 = no shadow
	varying float vHill;
	varying float vHidden; // 1.0 = hidden, 0.0 = visible
	varying vec2 vOffset;
	varying vec3 vLightDirT;
	varying vec3 vNeighborsEast;
	varying vec3 vNeighborsWest;

	vec2 cellIndexToUV(float idx) {
	    float atlasWidth = textureAtlasMeta.x;
	    float atlasHeight = textureAtlasMeta.y;
	    float cellSize = textureAtlasMeta.z;
	    float cols = atlasWidth / cellSize;
	    float rows = atlasHeight / cellSize;
	    float x = mod(idx, cols);
	    float y = floor(idx / cols);

	    return vec2(x / cols + uv.x / cols, 1.0 - (y / rows + uv.y / rows));
	}

	mat3 tangentSpace(vec3 normal_ws, vec3 tangent, mat4 worldMatrix) {
	    vec3 binormal = cross(tangent, normal_ws);
	    mat3 M;
	    M[0] = normalize(binormal);
	    M[1] = normalize(tangent);
	    M[2] = normalize(normal_ws);
	    
	    return mat3(modelMatrix) * M;
	}

	void main() {
	    vec3 pos = vec3(offset.x + position.x, offset.y + position.y, 0);

	    if (border < 0.95 && style.y < 100.0) {
	        pos.z = 0.2 + (0.5 + sin(uv.s + pos.s * 2.0) * 0.5) * 0.5;
	    }

	    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
	    vPosition = pos;
	    vOffset = offset;

	    vTexCoord = cellIndexToUV(style.x);

	    vExtra = border;
	    vFogOfWar = mod(style.y, 10.0) == 1.0 ? 1.0 : 0.0;   // style.y < 100.0 ? 10.0 : (style.y == 1.0 || style.y == 11.0 ? 1.0 : 0.0);
	    vHidden = style.y >= 100.0 ? 1.0 : 0.0;
	    
	    vNeighborsEast = neighborsEast;
	    vNeighborsWest = neighborsWest;
	    
	    mat3 T = tangentSpace(vec3(0.0, 1.0, 0.0), vec3(0.0, 0.0, 1.0), modelMatrix);
	    vLightDirT = normalize(T * lightDir);
	}
	`;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=mountains.vertex.js.map

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __importDefault = (this && this.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(4), __webpack_require__(6), __webpack_require__(7), __webpack_require__(5), __webpack_require__(13), __webpack_require__(14), __webpack_require__(15)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, three_1, Grid_1, util_1, coords_1, trees_vertex_1, trees_fragment_1, map_generator_1) {
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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=Forests.js.map

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.TREES_VERTEX_SHADER = void 0;
	    exports.TREES_VERTEX_SHADER = `
	precision mediump float;

	uniform mat4 modelViewMatrix;
	uniform mat4 projectionMatrix;
	uniform float size;
	uniform float scale;

	attribute vec3 position;
	attribute vec3 params; // x = spritesheet x, y = spritesheet y, z = alpha
	attribute vec3 color;

	varying vec3 vParams; // x = sprite index, y = size, z = visible?
	varying vec3 vColor;

	void main() {
	    vParams = params;

	    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
	    gl_Position = projectionMatrix * mvPosition;
	    gl_PointSize = params.y * ( scale / - mvPosition.z );
	    
	    vColor = color;
	}
	`;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=trees.vertex.js.map

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.TREES_FRAGMENT_SHADER = void 0;
	    exports.TREES_FRAGMENT_SHADER = `
	precision mediump float;

	uniform sampler2D texture;
	uniform float alphaTest;
	uniform float spritesheetSubdivisions;

	varying vec3 vParams;
	varying vec3 vColor;

	vec2 spriteIndexToUV(float idx, vec2 uv) {
	    float cols = spritesheetSubdivisions - 1e-6; // subtract small epsilon to avoid edge cases that cause flickering
	    float rows = spritesheetSubdivisions;
	    
	    float x = mod(idx, cols);
	    float y = floor(idx / cols);

	    return vec2(x / cols + uv.x / cols, 1.0 - (y / rows + (uv.y) / rows));
	}

	void main() {
	    vec2 uv = spriteIndexToUV(vParams.x, gl_PointCoord);
	    vec4 diffuse = texture2D(texture, uv);
	    
	    float alpha = diffuse.w * vParams.z;
	    
	    if (alpha < alphaTest) discard;
	    
	    gl_FragColor = vec4(diffuse.xyz, alpha);
	}
	`;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=trees.fragment.js.map

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __importDefault = (this && this.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(16), __webpack_require__(2), __webpack_require__(7), __webpack_require__(6), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, perlin_1, interfaces_1, util_1, Grid_1, hexagon_1) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.MapType = void 0;
	    exports.generateMap = generateMap;
	    exports.generateRandomMap = generateRandomMap;
	    exports.waterAdjacency = waterAdjacency;
	    exports.randomPointOnCoastTile = randomPointOnCoastTile;
	    Grid_1 = __importDefault(Grid_1);
	    // Define map types for better type checking
	    var MapType;
	    (function (MapType) {
	        MapType["RANDOM"] = "random";
	        MapType["NO_WATER"] = "no_water";
	        MapType["ONE_BIG_ISLAND"] = "one_big_island";
	        MapType["CENTRAL_LAKE"] = "central_lake";
	        MapType["TWO_CONTINENTS"] = "two_continents";
	    })(MapType || (exports.MapType = MapType = {}));
	    function randomHeight(q, r) {
	        var noise1 = (0, perlin_1.simplex2)(q / 10, r / 10);
	        var noise2 = (0, perlin_1.perlin2)(q / 5, r / 5);
	        var noise3 = (0, perlin_1.perlin2)(q / 30, r / 30);
	        var noise = noise1 + noise2 + noise3;
	        return noise / 3.0 * 2.0;
	    }
	    /**
	     * Generates a height value based on the map type and coordinates
	     * @param q q coordinate
	     * @param r r coordinate
	     * @param mapType type of map to generate
	     * @param size map size for scaling
	     */
	    function generateHeightByMapType(q, r, mapType, size) {
	        // Base noise for all map types
	        const baseNoise = randomHeight(q, r);
	        // Distance from center for radial calculations (normalized to 0-1)
	        const centerQ = 0;
	        const centerR = 0;
	        const distanceFromCenter = Math.sqrt((q - centerQ) * (q - centerQ) + (r - centerR) * (r - centerR));
	        const normalizedDistance = distanceFromCenter / (size * 0.75);
	        switch (mapType) {
	            case MapType.NO_WATER:
	                // Ensure all heights are positive (land)
	                return Math.max(0.1, baseNoise);
	            case MapType.ONE_BIG_ISLAND:
	                // Create one large island with randomized shape
	                // Basic threshold for island boundary
	                const islandThreshold = 0.65;
	                // Use noise to distort the island shape
	                // This creates irregular coastlines and varying island width in different directions
	                const shapeNoise1 = (0, perlin_1.simplex2)((q + 100) / 15, (r + 100) / 15);
	                const shapeNoise2 = (0, perlin_1.perlin2)((q - 50) / 10, (r - 50) / 10);
	                // Combine noise patterns to create shape distortion
	                // This shifts the island boundary in/out based on angle and noise
	                const shapeDistortion = (shapeNoise1 * 0.7 + shapeNoise2 * 0.3) * 0.25;
	                // Apply distortion to distance calculation
	                // This creates peninsulas and bays along the coast
	                const distortedDistance = normalizedDistance * (1 - shapeDistortion);
	                // Apply some subtle rotation to the overall shape
	                const rotationAngle = Math.PI / 4; // 45 degrees rotation
	                const rotatedQ = q * Math.cos(rotationAngle) - r * Math.sin(rotationAngle);
	                const rotatedR = q * Math.sin(rotationAngle) + r * Math.cos(rotationAngle);
	                // Add some directional stretching for more variety
	                // This creates elongated shapes rather than perfect circles
	                const stretchFactor = 1.2 + ((0, perlin_1.simplex2)(size, size) * 0.4); // Random stretch between 0.8 and 1.6
	                const stretchAngle = Math.PI * (0, perlin_1.simplex2)(size + 50, size + 50); // Random angle
	                // Apply stretch transformation
	                const stretchedQ = rotatedQ * (1 + Math.cos(stretchAngle) * (stretchFactor - 1));
	                const stretchedR = rotatedR * (1 + Math.sin(stretchAngle) * (stretchFactor - 1));
	                // Recalculate distance with all transformations applied
	                const transformedDistance = Math.sqrt(stretchedQ * stretchedQ + stretchedR * stretchedR) / (size * 0.75);
	                // Final distance calculation with all distortions applied
	                const finalDistance = transformedDistance * (1 - shapeDistortion);
	                // Generate small lakes
	                const lakeNoise = (0, perlin_1.perlin2)((q + 50) / 3, (r - 30) / 3);
	                const secondaryLakeNoise = (0, perlin_1.simplex2)((q - 20) / 4, (r + 40) / 4);
	                const lakeThreshold = 0.85;
	                // Check if point is inside main island
	                if (finalDistance < islandThreshold) {
	                    // Lake generation inside the island
	                    const lakeProbability = (finalDistance / islandThreshold) * 0.5 + 0.2;
	                    if (lakeNoise > lakeThreshold && secondaryLakeNoise > lakeThreshold * 0.8 &&
	                        Math.random() < lakeProbability && finalDistance > 0.2) {
	                        // Calculate lake depth based on noise values
	                        const lakeDepth = Math.min(-0.1, -0.3 * (lakeNoise * secondaryLakeNoise));
	                        return lakeDepth;
	                    }
	                    // Terrain height varies based on distance from shore and noise
	                    // This creates more varied terrain within the island
	                    const terrainFactor = 1 - (finalDistance / islandThreshold) * 0.4;
	                    return baseNoise * terrainFactor + 0.2;
	                }
	                else {
	                    // Ocean depth increases with distance from shore
	                    const waterFactor = (finalDistance - islandThreshold) / (1 - islandThreshold);
	                    return baseNoise * 0.4 - waterFactor * 1.5;
	                }
	            case MapType.CENTRAL_LAKE:
	                // Create land with a lake in the middle
	                const lakeSize = 0.3; // Size of the lake relative to map
	                return normalizedDistance < lakeSize
	                    ? -0.5 - (baseNoise * 0.5) // Lake in center
	                    : baseNoise * (1 - Math.max(0, lakeSize * 1.2 - normalizedDistance)); // Land around
	            case MapType.TWO_CONTINENTS:
	                // Create two separate landmasses
	                // Modified to ensure more land coverage
	                const divider = Math.sin(q / (size * 0.2)) * (size * 0.3);
	                const continentOffset = r - divider;
	                // Reduce the continent factor to create wider continents
	                const continentFactor = 1.2; // Reduced from 1.5
	                // Add some noise to the continent boundaries for more interesting shapes
	                const continentNoise = (0, perlin_1.simplex2)((q + 30) / 10, (r + 30) / 10) * 0.2;
	                // Create a bias towards land by adding a small positive value
	                const landBias = 0.1;
	                return baseNoise - (Math.abs(continentOffset) / (size * 0.6) * continentFactor) + continentNoise + landBias;
	            case MapType.RANDOM:
	            default:
	                // Default random terrain
	                return baseNoise;
	        }
	    }
	    /**
	     * Generates are square map of the given size centered at (0,0).
	     * @param size
	     * @param heightAt
	     * @param terrainAt
	     */
	    function generateMap(size, tile) {
	        return __awaiter(this, void 0, void 0, function* () {
	            const grid = new Grid_1.default(size * 1.3, size).mapQR((q, r) => tile(q, r));
	            const withRivers = generateRivers(grid);
	            return withRivers;
	        });
	    }
	    /**
	     * Generates a random map with the specified size and map type
	     * @param size Size of the map
	     * @param tile Function to create tile data
	     * @param mapType Type of map to generate
	     */
	    function generateRandomMap(size_1, tile_1) {
	        return __awaiter(this, arguments, void 0, function* (size, tile, mapType = MapType.RANDOM) {
	            (0, perlin_1.seed)(Date.now() + Math.random());
	            const grid = yield generateMap(size, (q, r) => tile(q, r, generateHeightByMapType(q, r, mapType, size)));
	            // Post-processing to ensure land percentage requirements are met
	            const allTiles = grid.toArray();
	            const landTiles = new Set(allTiles.filter(t => (0, interfaces_1.isLand)(t.height)).map(t => `${t.q},${t.r}`));
	            const waterTiles = allTiles.filter(t => (0, interfaces_1.isWater)(t.height));
	            // Target land percentage varies by map type
	            let targetLandPercentage = 0.35; // Default minimum land percentage
	            if (mapType === MapType.ONE_BIG_ISLAND) {
	                targetLandPercentage = 0.45; // 45% land for ONE_BIG_ISLAND
	                // Fill in any internal lakes (water tiles surrounded by mostly land)
	                for (const waterTile of waterTiles) {
	                    const neighbors = grid.neighbors(waterTile.q, waterTile.r);
	                    const landNeighbors = neighbors.filter(n => (0, interfaces_1.isLand)(n.height));
	                    // If this water tile is mostly surrounded by land (likely an internal lake)
	                    if (landNeighbors.length >= neighbors.length * 0.5) {
	                        // Convert it to land
	                        waterTile.height = 0.2 + Math.random() * 0.3;
	                        landTiles.add(`${waterTile.q},${waterTile.r}`);
	                    }
	                }
	            }
	            else if (mapType === MapType.TWO_CONTINENTS) {
	                targetLandPercentage = 0.35; // 35% land for TWO_CONTINENTS
	            }
	            // Check land percentage and adjust if needed
	            const landPercentage = landTiles.size / allTiles.length;
	            if (landPercentage < targetLandPercentage) {
	                console.log(`Adjusting land percentage from ${landPercentage * 100}% to at least ${targetLandPercentage * 100}%`);
	                // Sort remaining water tiles by distance from center
	                const remainingWaterTiles = allTiles
	                    .filter(t => (0, interfaces_1.isWater)(t.height))
	                    .map(t => ({
	                    tile: t,
	                    distance: Math.sqrt(t.q * t.q + t.r * t.r)
	                }))
	                    .sort((a, b) => a.distance - b.distance);
	                // Calculate how many tiles we need to convert to land
	                const targetLandTiles = Math.ceil(allTiles.length * targetLandPercentage);
	                const tilesToConvert = targetLandTiles - landTiles.size;
	                // Convert the closest water tiles to land
	                for (let i = 0; i < tilesToConvert && i < remainingWaterTiles.length; i++) {
	                    const tileToConvert = remainingWaterTiles[i].tile;
	                    // Set height to slightly above water level
	                    tileToConvert.height = 0.2 + Math.random() * 0.3;
	                    landTiles.add(`${tileToConvert.q},${tileToConvert.r}`);
	                }
	                // Recalculate land percentage
	                const newLandPercentage = landTiles.size / allTiles.length;
	                console.log(`Adjusted land percentage to ${newLandPercentage * 100}%`);
	            }
	            // // Update terrain types for tiles that were converted from water to land in post-processing
	            // grid.forEachQR((q, r, tile) => {
	            //     if (tile.terrain === "ocean" && tile.height >= 0.0) {
	            //         // Retrieve the original tile generator function to update terrain
	            //         const updatedTile = tile(q, r, tile.height);
	            //         // Copy over the updated terrain property
	            //         tile.terrain = updatedTile.terrain;
	            //         // Update tree indexes if needed
	            //         if (updatedTile.treeIndex !== undefined) {
	            //             tile.treeIndex = updatedTile.treeIndex;
	            //         }
	            //     }
	            // });
	            return grid;
	        });
	    }
	    // Rest of the code remains unchanged
	    function generateRivers(grid) {
	        // find a few river spawn points, preferably in mountains
	        const tiles = grid.toArray();
	        const numRivers = Math.max(1, Math.round(Math.sqrt(grid.length) / 4));
	        const spawns = (0, util_1.shuffle)(tiles.filter(t => isAccessibleMountain(t, grid))).slice(0, numRivers);
	        // grow the river towards the water by following the height gradient
	        const rivers = spawns.map(growRiver);
	        // assign sequential indices to rivers and their tiles
	        rivers.forEach((river, riverIndex) => {
	            river.forEach((tile, riverTileIndex) => {
	                if (riverTileIndex < river.length - 1) {
	                    tile.rivers = [{ riverIndex, riverTileIndex }];
	                }
	            });
	        });
	        return grid;
	        function growRiver(spawn) {
	            const river = [spawn];
	            let tile = spawn;
	            if (tile === undefined || !tile) {
	                return [];
	            }
	            while (!(0, interfaces_1.isWater)(tile.height) && river.length < 20) {
	                const neighbors = sortByHeight(grid.neighbors(tile.q, tile.r)).filter(t => !contains(t, river));
	                if (neighbors.length == 0) {
	                    console.info("Aborted river generation", river, tile);
	                    return river;
	                }
	                const next = neighbors[Math.max(neighbors.length - 1, Math.floor(Math.random() * 1.2))];
	                river.push(next);
	                tile = next;
	            }
	            return river;
	        }
	        function sortByHeight(tiles) {
	            return tiles.sort((a, b) => b.height - a.height);
	        }
	        function contains(t, ts) {
	            for (let other of ts) {
	                if (other.q == t.q && other.r == t.r) {
	                    return true;
	                }
	            }
	            return false;
	        }
	    }
	    function isAccessibleMountain(tile, grid) {
	        let ns = grid.neighbors(tile.q, tile.r);
	        let spring = (0, interfaces_1.isMountain)(tile.height);
	        return spring && ns.filter(t => (0, interfaces_1.isLand)(t.height)).length > 3;
	    }
	    /**
	     * Computes the water adjecency for the given tile.
	     * @param grid grid with all tiles to be searched
	     * @param tile tile to look at
	     */
	    function waterAdjacency(grid, tile) {
	        function isWaterTile(q, r) {
	            const t = grid.get(q, r);
	            if (!t)
	                return false;
	            return (0, interfaces_1.isWater)(t.height);
	        }
	        return {
	            NE: isWaterTile(tile.q + 1, tile.r - 1),
	            E: isWaterTile(tile.q + 1, tile.r),
	            SE: isWaterTile(tile.q, tile.r + 1),
	            SW: isWaterTile(tile.q - 1, tile.r + 1),
	            W: isWaterTile(tile.q - 1, tile.r),
	            NW: isWaterTile(tile.q, tile.r - 1)
	        };
	    }
	    /**
	     * Returns a random point on a hex tile considering adjacent water, i.e. avoiding points on the beach.
	     * @param water water adjacency of the tile
	     * @param scale coordinate scale
	     * @returns {THREE.Vector3} local position
	     */
	    function randomPointOnCoastTile(water, scale = 1.0) {
	        return (0, hexagon_1.randomPointInHexagonEx)(scale, corner => {
	            corner = (2 + (6 - corner)) % 6;
	            if (corner == 0 && water.NE)
	                return 0.5;
	            if (corner == 1 && water.E)
	                return 0.5;
	            if (corner == 2 && water.SE)
	                return 0.5;
	            if (corner == 3 && water.SW)
	                return 0.5;
	            if (corner == 4 && water.W)
	                return 0.5;
	            if (corner == 5 && water.NW)
	                return 0.5;
	            return 1;
	        });
	    }
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=map-generator.js.map

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * A speed-improved perlin and simplex noise algorithms for 2D.
	 *
	 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
	 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
	 * Better rank ordering method by Stefan Gustavson in 2012.
	 * Converted to Javascript by Joseph Gentle.
	 * Conveted to TypeScript by Mathias Kahl (mathias.kahl@gmail.com)
	 *
	 * Version 2016-08-18
	 *
	 * This code was placed in the public domain by its original author,
	 * Stefan Gustavson. You may use it as you see fit, but
	 * attribution is appreciated.
	 *
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.seed = seed;
	    exports.simplex2 = simplex2;
	    exports.simplex3 = simplex3;
	    exports.perlin2 = perlin2;
	    exports.perlin3 = perlin3;
	    class Grad {
	        constructor(x, y, z) {
	            this.x = x;
	            this.y = y;
	            this.z = z;
	        }
	        dot2(x, y) {
	            return this.x * x + this.y * y;
	        }
	        dot3(x, y, z) {
	            return this.x * x + this.y * y + this.z * z;
	        }
	    }
	    var grad3 = [new Grad(1, 1, 0), new Grad(-1, 1, 0), new Grad(1, -1, 0), new Grad(-1, -1, 0),
	        new Grad(1, 0, 1), new Grad(-1, 0, 1), new Grad(1, 0, -1), new Grad(-1, 0, -1),
	        new Grad(0, 1, 1), new Grad(0, -1, 1), new Grad(0, 1, -1), new Grad(0, -1, -1)];
	    var p = [151, 160, 137, 91, 90, 15,
	        131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
	        190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
	        88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
	        77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
	        102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
	        135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
	        5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
	        223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
	        129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
	        251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
	        49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
	        138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
	    // To remove the need for index wrapping, double the permutation table length
	    var perm = new Array(512);
	    var gradP = new Array(512);
	    // This isn't a very good seeding function, but it works ok. It supports 2^16
	    // different seed values. Write something better if you need more seeds.
	    function seed(seed) {
	        if (seed > 0 && seed < 1) {
	            // Scale the seed out
	            seed *= 65536;
	        }
	        seed = Math.floor(seed);
	        if (seed < 256) {
	            seed |= seed << 8;
	        }
	        for (var i = 0; i < 256; i++) {
	            var v;
	            if (i & 1) {
	                v = p[i] ^ (seed & 255);
	            }
	            else {
	                v = p[i] ^ ((seed >> 8) & 255);
	            }
	            perm[i] = perm[i + 256] = v;
	            gradP[i] = gradP[i + 256] = grad3[v % 12];
	        }
	    }
	    seed(0);
	    /*
	     for(var i=0; i<256; i++) {
	     perm[i] = perm[i + 256] = p[i];
	     gradP[i] = gradP[i + 256] = grad3[perm[i] % 12];
	     }*/
	    // Skewing and unskewing factors for 2, 3, and 4 dimensions
	    var F2 = 0.5 * (Math.sqrt(3) - 1);
	    var G2 = (3 - Math.sqrt(3)) / 6;
	    var F3 = 1 / 3;
	    var G3 = 1 / 6;
	    // 2D simplex noise
	    function simplex2(xin, yin) {
	        var n0, n1, n2; // Noise contributions from the three corners
	        // Skew the input space to determine which simplex cell we're in
	        var s = (xin + yin) * F2; // Hairy factor for 2D
	        var i = Math.floor(xin + s);
	        var j = Math.floor(yin + s);
	        var t = (i + j) * G2;
	        var x0 = xin - i + t; // The x,y distances from the cell origin, unskewed.
	        var y0 = yin - j + t;
	        // For the 2D case, the simplex shape is an equilateral triangle.
	        // Determine which simplex we are in.
	        var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
	        if (x0 > y0) { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
	            i1 = 1;
	            j1 = 0;
	        }
	        else { // upper triangle, YX order: (0,0)->(0,1)->(1,1)
	            i1 = 0;
	            j1 = 1;
	        }
	        // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
	        // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
	        // c = (3-sqrt(3))/6
	        var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
	        var y1 = y0 - j1 + G2;
	        var x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
	        var y2 = y0 - 1 + 2 * G2;
	        // Work out the hashed gradient indices of the three simplex corners
	        i &= 255;
	        j &= 255;
	        var gi0 = gradP[i + perm[j]];
	        var gi1 = gradP[i + i1 + perm[j + j1]];
	        var gi2 = gradP[i + 1 + perm[j + 1]];
	        // Calculate the contribution from the three corners
	        var t0 = 0.5 - x0 * x0 - y0 * y0;
	        if (t0 < 0) {
	            n0 = 0;
	        }
	        else {
	            t0 *= t0;
	            n0 = t0 * t0 * gi0.dot2(x0, y0); // (x,y) of grad3 used for 2D gradient
	        }
	        var t1 = 0.5 - x1 * x1 - y1 * y1;
	        if (t1 < 0) {
	            n1 = 0;
	        }
	        else {
	            t1 *= t1;
	            n1 = t1 * t1 * gi1.dot2(x1, y1);
	        }
	        var t2 = 0.5 - x2 * x2 - y2 * y2;
	        if (t2 < 0) {
	            n2 = 0;
	        }
	        else {
	            t2 *= t2;
	            n2 = t2 * t2 * gi2.dot2(x2, y2);
	        }
	        // Add contributions from each corner to get the final noise value.
	        // The result is scaled to return values in the interval [-1,1].
	        return 70 * (n0 + n1 + n2);
	    }
	    // 3D simplex noise
	    function simplex3(xin, yin, zin) {
	        var n0, n1, n2, n3; // Noise contributions from the four corners
	        // Skew the input space to determine which simplex cell we're in
	        var s = (xin + yin + zin) * F3; // Hairy factor for 2D
	        var i = Math.floor(xin + s);
	        var j = Math.floor(yin + s);
	        var k = Math.floor(zin + s);
	        var t = (i + j + k) * G3;
	        var x0 = xin - i + t; // The x,y distances from the cell origin, unskewed.
	        var y0 = yin - j + t;
	        var z0 = zin - k + t;
	        // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
	        // Determine which simplex we are in.
	        var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
	        var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
	        if (x0 >= y0) {
	            if (y0 >= z0) {
	                i1 = 1;
	                j1 = 0;
	                k1 = 0;
	                i2 = 1;
	                j2 = 1;
	                k2 = 0;
	            }
	            else if (x0 >= z0) {
	                i1 = 1;
	                j1 = 0;
	                k1 = 0;
	                i2 = 1;
	                j2 = 0;
	                k2 = 1;
	            }
	            else {
	                i1 = 0;
	                j1 = 0;
	                k1 = 1;
	                i2 = 1;
	                j2 = 0;
	                k2 = 1;
	            }
	        }
	        else {
	            if (y0 < z0) {
	                i1 = 0;
	                j1 = 0;
	                k1 = 1;
	                i2 = 0;
	                j2 = 1;
	                k2 = 1;
	            }
	            else if (x0 < z0) {
	                i1 = 0;
	                j1 = 1;
	                k1 = 0;
	                i2 = 0;
	                j2 = 1;
	                k2 = 1;
	            }
	            else {
	                i1 = 0;
	                j1 = 1;
	                k1 = 0;
	                i2 = 1;
	                j2 = 1;
	                k2 = 0;
	            }
	        }
	        // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
	        // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
	        // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
	        // c = 1/6.
	        var x1 = x0 - i1 + G3; // Offsets for second corner
	        var y1 = y0 - j1 + G3;
	        var z1 = z0 - k1 + G3;
	        var x2 = x0 - i2 + 2 * G3; // Offsets for third corner
	        var y2 = y0 - j2 + 2 * G3;
	        var z2 = z0 - k2 + 2 * G3;
	        var x3 = x0 - 1 + 3 * G3; // Offsets for fourth corner
	        var y3 = y0 - 1 + 3 * G3;
	        var z3 = z0 - 1 + 3 * G3;
	        // Work out the hashed gradient indices of the four simplex corners
	        i &= 255;
	        j &= 255;
	        k &= 255;
	        var gi0 = gradP[i + perm[j + perm[k]]];
	        var gi1 = gradP[i + i1 + perm[j + j1 + perm[k + k1]]];
	        var gi2 = gradP[i + i2 + perm[j + j2 + perm[k + k2]]];
	        var gi3 = gradP[i + 1 + perm[j + 1 + perm[k + 1]]];
	        // Calculate the contribution from the four corners
	        var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
	        if (t0 < 0) {
	            n0 = 0;
	        }
	        else {
	            t0 *= t0;
	            n0 = t0 * t0 * gi0.dot3(x0, y0, z0); // (x,y) of grad3 used for 2D gradient
	        }
	        var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
	        if (t1 < 0) {
	            n1 = 0;
	        }
	        else {
	            t1 *= t1;
	            n1 = t1 * t1 * gi1.dot3(x1, y1, z1);
	        }
	        var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
	        if (t2 < 0) {
	            n2 = 0;
	        }
	        else {
	            t2 *= t2;
	            n2 = t2 * t2 * gi2.dot3(x2, y2, z2);
	        }
	        var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
	        if (t3 < 0) {
	            n3 = 0;
	        }
	        else {
	            t3 *= t3;
	            n3 = t3 * t3 * gi3.dot3(x3, y3, z3);
	        }
	        // Add contributions from each corner to get the final noise value.
	        // The result is scaled to return values in the interval [-1,1].
	        return 32 * (n0 + n1 + n2 + n3);
	    }
	    // ##### Perlin noise stuff
	    function fade(t) {
	        return t * t * t * (t * (t * 6 - 15) + 10);
	    }
	    function lerp(a, b, t) {
	        return (1 - t) * a + t * b;
	    }
	    // 2D Perlin Noise
	    function perlin2(x, y) {
	        // Find unit grid cell containing point
	        var X = Math.floor(x), Y = Math.floor(y);
	        // Get relative xy coordinates of point within that cell
	        x = x - X;
	        y = y - Y;
	        // Wrap the integer cells at 255 (smaller integer period can be introduced here)
	        X = X & 255;
	        Y = Y & 255;
	        // Calculate noise contributions from each of the four corners
	        var n00 = gradP[X + perm[Y]].dot2(x, y);
	        var n01 = gradP[X + perm[Y + 1]].dot2(x, y - 1);
	        var n10 = gradP[X + 1 + perm[Y]].dot2(x - 1, y);
	        var n11 = gradP[X + 1 + perm[Y + 1]].dot2(x - 1, y - 1);
	        // Compute the fade curve value for x
	        var u = fade(x);
	        // Interpolate the four results
	        return lerp(lerp(n00, n10, u), lerp(n01, n11, u), fade(y));
	    }
	    // 3D Perlin Noise
	    function perlin3(x, y, z) {
	        // Find unit grid cell containing point
	        var X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
	        // Get relative xyz coordinates of point within that cell
	        x = x - X;
	        y = y - Y;
	        z = z - Z;
	        // Wrap the integer cells at 255 (smaller integer period can be introduced here)
	        X = X & 255;
	        Y = Y & 255;
	        Z = Z & 255;
	        // Calculate noise contributions from each of the eight corners
	        var n000 = gradP[X + perm[Y + perm[Z]]].dot3(x, y, z);
	        var n001 = gradP[X + perm[Y + perm[Z + 1]]].dot3(x, y, z - 1);
	        var n010 = gradP[X + perm[Y + 1 + perm[Z]]].dot3(x, y - 1, z);
	        var n011 = gradP[X + perm[Y + 1 + perm[Z + 1]]].dot3(x, y - 1, z - 1);
	        var n100 = gradP[X + 1 + perm[Y + perm[Z]]].dot3(x - 1, y, z);
	        var n101 = gradP[X + 1 + perm[Y + perm[Z + 1]]].dot3(x - 1, y, z - 1);
	        var n110 = gradP[X + 1 + perm[Y + 1 + perm[Z]]].dot3(x - 1, y - 1, z);
	        var n111 = gradP[X + 1 + perm[Y + 1 + perm[Z + 1]]].dot3(x - 1, y - 1, z - 1);
	        // Compute the fade curve value for x, y, z
	        var u = fade(x);
	        var v = fade(y);
	        var w = fade(z);
	        // Interpolate
	        return lerp(lerp(lerp(n000, n100, u), lerp(n001, n101, u), w), lerp(lerp(n010, n110, u), lerp(n011, n111, u), w), v);
	    }
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=perlin.js.map

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(5), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, coords_1, three_1) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    class Animation {
	        /**
	         * Simple animation helper
	         * @param durationMs duration of the animation in milliseconds
	         * @param update animation function which will receive values between 0.0 and 1.0 over the duration of the animation
	         * @param easingFunction function that determines the progression of the animation over time
	         */
	        constructor(durationMs, update, easingFunction = Animation.easeInOutQuad) {
	            this.durationMs = durationMs;
	            this.update = update;
	            this.easingFunction = easingFunction;
	            /**
	             * Progress of the animation between 0.0 (start) and 1.0 (end).
	             */
	            this.progress = 0.0;
	        }
	        /**
	         * Advances the animation by the given amount of time in seconds.
	         * Returns true if the animation is finished.
	         */
	        animate(dtS) {
	            this.progress = this.progress + dtS * 1000 / this.durationMs;
	            this.update(this.easingFunction(this.progress));
	            return this.progress >= 1.0;
	        }
	    }
	    Animation.easeInOutQuad = (t) => {
	        if ((t /= 0.5) < 1)
	            return 0.5 * t * t;
	        return -0.5 * ((--t) * (t - 2) - 1);
	    };
	    Animation.easeLinear = (t) => t;
	    class Controller {
	        constructor() {
	            this.mouseDownNumber = 0;
	            this.lastDrag = null;
	            this.debugText = null;
	            this.selectedQR = { q: 0, r: 0 };
	            this.animations = [];
	            this.onAnimate = (dtS) => {
	                const animations = this.animations;
	                for (let i = 0; i < animations.length; i++) {
	                    // advance the animation
	                    const animation = animations[i];
	                    const finished = animation.animate(dtS);
	                    // if the animation is finished (returned true) remove it
	                    if (finished) {
	                        // remove the animation
	                        animations[i] = animations[animations.length - 1];
	                        animations[animations.length - 1] = animation;
	                        animations.pop();
	                    }
	                }
	            };
	            this.onKeyDown = (e) => {
	                if (e.keyCode == 32) { // SPACE BAR
	                    console.log(`center view on QR(${this.selectedQR.q},${this.selectedQR.r})`);
	                    //this.controls.focus(this.selectedQR.q, this.selectedQR.r)
	                    this.PanCameraTo(this.selectedQR, 600 /*ms*/);
	                }
	            };
	            this.onMouseEnter = (e) => {
	                if (e.buttons === 1) {
	                    this.onMouseDown(e);
	                }
	            };
	            this.onMouseDown = (e) => {
	                // Only start dragging with left mouse button
	                if (e.button === 0) {
	                    this.pickingCamera = this.controls.getCamera().clone();
	                    this.mouseDownPos = (0, coords_1.screenToWorld)(e.clientX, e.clientY, this.pickingCamera);
	                    this.dragStartCameraPos = this.controls.getCamera().position.clone();
	                }
	                else if (e.button === 2) {
	                    this.pickingCamera = this.controls.getCamera().clone();
	                    this.mouseDownPos = (0, coords_1.screenToWorld)(e.clientX, e.clientY, this.pickingCamera);
	                    const tile = this.controls.pickTile(this.mouseDownPos);
	                    if (tile) {
	                        this.controls.showUnitPath(tile);
	                    }
	                }
	            };
	            this.onMouseMove = (e) => {
	                // scrolling via mouse drag - only with left button (button code 0)
	                if (this.mouseDownPos && e.buttons === 1) {
	                    const mousePos = (0, coords_1.screenToWorld)(e.clientX, e.clientY, this.pickingCamera);
	                    const dv = this.lastDrag = mousePos.sub(this.mouseDownPos).multiplyScalar(-1);
	                    const newCameraPos = dv.clone().add(this.dragStartCameraPos);
	                    this.controls.getCamera().position.copy(newCameraPos);
	                }
	                if (this.mouseDownPos && e.buttons === 2) {
	                    // Right mouse button - show unit path
	                    const mousePos = (0, coords_1.screenToWorld)(e.clientX, e.clientY, this.controls.getCamera());
	                    const tile = this.controls.pickTile(mousePos);
	                    if (tile) {
	                        this.controls.showUnitPath(tile);
	                    }
	                }
	                // scrolling via screen edge only in fullscreen mode
	                if (window.innerHeight == screen.height && !this.mouseDownPos) {
	                    const scrollZoneSize = 20;
	                    const mousePos2D = new three_1.Vector2(e.clientX, e.clientY);
	                    const screenCenter2D = new three_1.Vector2(window.innerWidth / 2, window.innerHeight / 2);
	                    const diff = mousePos2D.clone().sub(screenCenter2D);
	                    if (Math.abs(diff.x) > screenCenter2D.x - scrollZoneSize || Math.abs(diff.y) > screenCenter2D.y - scrollZoneSize) {
	                        this.controls.setScrollDir(diff.x, -diff.y);
	                    }
	                    else {
	                        this.controls.setScrollDir(0, 0);
	                    }
	                }
	                //
	                const mousePos = (0, coords_1.screenToWorld)(e.clientX, e.clientY, this.controls.getCamera());
	                const tile = this.controls.pickTile(mousePos);
	                this.controls.hoverTile(tile, e.clientX, e.clientY);
	            };
	            this.onMouseUp = (e) => {
	                this.controls.mouseUp();
	                if (!this.lastDrag || this.lastDrag.length() < 0.1) {
	                    const mousePos = (0, coords_1.screenToWorld)(e.clientX, e.clientY, this.controls.getCamera());
	                    const tile = this.controls.pickTile(mousePos);
	                    if (tile) {
	                        if (e.button === 0) {
	                            this.controls.selectTile(tile);
	                            this.selectedQR = tile;
	                        }
	                        if (e.button === 2) {
	                            // Handle right-click logic here
	                            this.controls.actionTile(tile);
	                            // console.log(`Right-click detected on tile ${tile.q}:${tile.r}`);
	                        }
	                    }
	                }
	                this.mouseDownPos = null; // end drag
	                this.lastDrag = null;
	            };
	            this.onMouseOut = (e) => {
	                // this.mouseDownPos = null // end drag
	                this.controls.hoverTile(undefined, e.clientX, e.clientY);
	                this.controls.setScrollDir(0, 0);
	            };
	            this.onMouseUpMini = (e) => {
	                if (!this.lastDrag || this.lastDrag.length() < 0.1) {
	                    const mousePos = (0, coords_1.screenToWorldMiniMap)(e.clientX, e.clientY, this.controls.getMiniMapCamera());
	                    const tile = this.controls.pickTile(mousePos);
	                    this.PanCameraTo(tile, 600 /*ms*/);
	                }
	                this.mouseDownPos = null; // end drag
	                this.lastDrag = null;
	            };
	        }
	        set debugOutput(elem) {
	            this.debugText = elem;
	        }
	        init(controls, canvas) {
	            this.controls = controls;
	            document.addEventListener("keydown", this.onKeyDown, false);
	            canvas.addEventListener("mousedown", this.onMouseDown, false);
	            canvas.addEventListener("mousemove", this.onMouseMove, false);
	            canvas.addEventListener("mouseup", this.onMouseUp, false);
	            canvas.addEventListener("mouseout", this.onMouseOut, false);
	            canvas.addEventListener("mouseenter", this.onMouseEnter, false);
	            canvas.addEventListener("touchstart", (e) => {
	                this.onMouseDown(e.touches[0]);
	                e.preventDefault();
	            }, false);
	            canvas.addEventListener("touchmove", (e) => {
	                this.onMouseMove(e.touches[0]);
	                e.preventDefault();
	            }, false);
	            canvas.addEventListener("touchend", (e) => this.onMouseUp(e.touches[0] || e.changedTouches[0]), false);
	            // setInterval(() => this.showDebugInfo(), 200)
	            document.getElementById("minimap").addEventListener("mouseup", this.onMouseUpMini, false);
	            this.controls.setOnAnimateCallback(this.onAnimate);
	        }
	        addAnimation(animation) {
	            this.animations.push(animation);
	        }
	        PanCameraTo(qr, durationMs) {
	            const from = this.controls.getCamera().position.clone();
	            const to = this.controls.getCameraFocusPosition(qr);
	            if (this.animations.length > 0) {
	                return;
	            }
	            this.addAnimation(new Animation(durationMs, (a) => {
	                this.controls.getCamera().position.copy(from.clone().lerp(to, a));
	            }));
	        }
	    }
	    exports.default = Controller;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=DefaultMapViewController.js.map

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.Nations = void 0;
	    exports.Nations = {
	        "USA": {
	            "name": "USA",
	            "leader": "President Trump",
	            "flag_image": "../../assets/ui/flags/icons8-usa-100.png",
	            "description": "A modern powerhouse, championing liberty and opportunity, ever striving for greatness on the world stage.",
	            "cities": [
	                "Washington",
	                "New York",
	                "Boston",
	                "Philadelphia",
	                "Atlanta",
	                "Chicago",
	                "San Francisco",
	                "Los Angeles",
	                "Houston",
	                "Miami",
	                "Seattle",
	                "Dallas",
	                "Denver",
	                "Detroit",
	                "Phoenix",
	                "San Diego",
	                "San Antonio",
	                "Las Vegas",
	                "St. Louis",
	                "Baltimore",
	                "Cleveland",
	                "Pittsburgh",
	                "Minneapolis",
	                "Kansas City",
	                "New Orleans",
	                "Austin",
	                "Nashville",
	                "Charlotte",
	                "Salt Lake City"
	            ],
	            "bonuses": [
	                "manifest_destiny"
	            ],
	            "leader_images": {
	                "default": ["../../assets/leaders/default.png"],
	                "angry": ["../../assets/leaders/default.png"]
	            },
	            "quotes": {
	                "greeting": ["Welcome to the land of liberty and opportunity."],
	                "farewell": ["Keep striving for greatness."],
	                "victory": ["Democracy has triumphed once again!"],
	                "angry": [
	                    "You underestimate the strength of our nation? Think again.",
	                    "We will make America strong again. We will make America proud again. We will make America safe again. And we will make America great again!",
	                    "Sometimes by losing a battle you find a new way to win the war."
	                ],
	                "defeat": ["Even in loss, our ideals endure."]
	            }
	        },
	        "Soviet Union": {
	            "name": "Soviet Union",
	            "leader": "Premier Volkov",
	            "flag_image": "../../assets/ui/flags/icons8-ussr-100.png",
	            "description": "A formidable collective under the Red Banner, forging an industrial and ideological empire of workers.",
	            "cities": [
	                "Moscow",
	                "Leningrad",
	                "Stalingrad",
	                "Novosibirsk",
	                "Kiev",
	                "Minsk",
	                "Tashkent",
	                "Riga",
	                "Vilnius",
	                "Murmansk"
	            ],
	            "bonuses": [
	                "resilient_unity"
	            ],
	            "leader_images": {
	                "default": ["../../assets/leaders/h.png"],
	                "angry": ["../../assets/leaders/h.png"]
	            },
	            "quotes": {
	                "greeting": ["Comrade, let us discuss the future of the proletariat."],
	                "farewell": ["The revolution continues.", "Do svidaniya."],
	                "victory": ["The workers of the world have united in triumph!"],
	                "angry": ["Foolish to challenge the might of the Union."],
	                "defeat": ["The struggle persists, even in defeat."]
	            }
	        },
	        "China": {
	            "name": "China",
	            "leader": "Chairman Wei",
	            "flag_image": "../../assets/ui/flags/icons8-china-100.png",
	            "description": "An enduring civilization blending ancient heritage with modern ambitions, led by the steady hand of Chairman Wei.",
	            "cities": [
	                "Beijing",
	                "Shanghai",
	                "Guangzhou",
	                "Shenzhen",
	                "Chengdu",
	                "Xi'an",
	                "Wuhan",
	                "Hangzhou",
	                "Nanjing",
	                "Tianjin"
	            ],
	            "bonuses": [
	                "scientific_breakthrough"
	            ],
	            "leader_images": {
	                "default": ["../../assets/leaders/default.png"],
	                "angry": ["../../assets/leaders/default.png"]
	            },
	            "quotes": {
	                "greeting": ["Greetings from the Middle Kingdom."],
	                "farewell": ["May your endeavors bring prosperity."],
	                "victory": ["China rises above all challenges!"],
	                "angry": ["Your actions disrupt the harmony of our relations."],
	                "defeat": ["The dragon endures, even when wounded."]
	            }
	        },
	        "Rome": {
	            "name": "Rome",
	            "leader": "Emperor Augustus",
	            "flag_image": "../../assets/ui/flags/icons8-italy-100.png",
	            "description": "The Eternal City stands at the center of civilization, expanding its influence with legions and grand roads.",
	            "cities": [
	                "Rome",
	                "Mediolanum",
	                "Neapolis",
	                "Syracusae",
	                "Ravenna",
	                "Carthago Nova",
	                "Lugdunum",
	                "Massilia",
	                "Brundisium",
	                "Capua"
	            ],
	            "bonuses": [
	                "imperial_ambition"
	            ],
	            "leader_images": {
	                "default": ["../../assets/leaders/default.png"],
	                "angry": ["../../assets/leaders/default.png"]
	            },
	            "quotes": {
	                "greeting": ["Salve! Rome welcomes you with open arms."],
	                "farewell": ["Fare thee well, friend of Rome."],
	                "victory": ["All roads lead to our triumph!"],
	                "angry": ["You dare defy the might of the Eternal City?"],
	                "defeat": ["Even mighty Rome must bend to fate..."]
	            }
	        },
	        "Egypt": {
	            "name": "Egypt",
	            "leader": "Pharaoh Cleopatra",
	            "flag_image": "../../assets/ui/flags/icons8-egypt-100.png",
	            "description": "A land of timeless marvels along the Nile, guided by the wisdom and allure of its legendary Pharaoh.",
	            "cities": [
	                "Memphis",
	                "Thebes",
	                "Alexandria",
	                "Giza",
	                "Heliopolis",
	                "Avaris",
	                "Pi-Ramesses",
	                "Tanis",
	                "Hermopolis",
	                "Bubastis"
	            ],
	            "bonuses": [
	                "divine_providence"
	            ],
	            "leader_images": {
	                "default": ["../../assets/leaders/default.png"],
	                "angry": ["../../assets/leaders/default.png"]
	            },
	            "quotes": {
	                "greeting": ["We greet you under the ever-watchful eyes of the gods."],
	                "farewell": ["The Nile's blessings go with you."],
	                "victory": ["The gods favor our reign this day!"],
	                "angry": ["Beware: you anger a power older than the sands."],
	                "defeat": ["Even Pharaoh must bow before destiny..."]
	            }
	        },
	        "Greece": {
	            "name": "Greece",
	            "leader": "King Alexander",
	            "flag_image": "../../assets/ui/flags/icons8-greece-100.png",
	            "description": "Birthplace of philosophy and strategy, unified under Alexander’s ambition to spread Hellenic culture across the world.",
	            "cities": [
	                "Athens",
	                "Sparta",
	                "Corinth",
	                "Thebes",
	                "Rhodes",
	                "Ephesus",
	                "Knossos",
	                "Delphi",
	                "Argos",
	                "Pergamon"
	            ],
	            "bonuses": [
	                "artistic_flourish"
	            ],
	            "leader_images": {
	                "default": ["../../assets/leaders/default.png"],
	                "angry": ["../../assets/leaders/default.png"]
	            },
	            "quotes": {
	                "greeting": ["Hail, traveler! Greece extends its wisdom to you."],
	                "farewell": ["Farewell, friend. May Athena guide your path."],
	                "victory": ["The glory of Hellas stands supreme!"],
	                "angry": ["You provoke the wrath of the Olympians!"],
	                "defeat": ["Our brilliance is dimmed, but not extinguished..."]
	            }
	        },
	        "Britain": {
	            "name": "Britain",
	            "leader": "Queen Victoria",
	            "flag_image": "../../assets/ui/flags/icons8-great-britain-100.png",
	            "description": "A seafaring empire wielding industrial might and colonial ambitions, led by the steadfast Queen Victoria.",
	            "cities": [
	                "London",
	                "Birmingham",
	                "Manchester",
	                "Liverpool",
	                "Leeds",
	                "Glasgow",
	                "Edinburgh",
	                "Cardiff",
	                "Belfast",
	                "Bristol"
	            ],
	            "bonuses": [
	                "maritime_dominance"
	            ],
	            "leader_images": {
	                "default": ["../../assets/leaders/default.png"],
	                "angry": ["../../assets/leaders/default.png"]
	            },
	            "quotes": {
	                "greeting": ["Welcome, from across the seas, to the British Isles."],
	                "farewell": ["A fond farewell, until we next meet."],
	                "victory": ["Rule Britannia! Our empire stands victorious!"],
	                "angry": ["You dare challenge the Crown?"],
	                "defeat": ["Even the greatest empire must weather storms..."]
	            }
	        },
	        "France": {
	            "name": "France",
	            "leader": "Napoleon Bonaparte",
	            "flag_image": "../../assets/ui/flags/icons8-france-100.png",
	            "description": "A nation of art, revolution, and military prowess, led by a charismatic visionary.",
	            "cities": [
	                "Paris",
	                "Marseille",
	                "Lyon",
	                "Toulouse",
	                "Nice",
	                "Nantes",
	                "Strasbourg",
	                "Montpellier",
	                "Bordeaux",
	                "Lille"
	            ],
	            "bonuses": [
	                "age_of_enlightenment"
	            ],
	            "leader_images": {
	                "default": ["../../assets/leaders/default.png"],
	                "angry": ["../../assets/leaders/angry.png"]
	            },
	            "quotes": {
	                "greeting": ["Bonjour, welcome to the heart of innovation and revolution."],
	                "farewell": ["Au revoir, until our paths cross again in glory."],
	                "victory": ["Vive la victoire! Our spirit is unyielding!"],
	                "angry": ["Do not test the resolve of France!"],
	                "defeat": ["Even in defeat, our legacy shines eternal."]
	            }
	        },
	        "Ottoman": {
	            "name": "Ottoman",
	            "leader": "Suleiman the Magnificent",
	            "flag_image": "../../assets/ui/flags/icons8-turkey-100.png",
	            "description": "A majestic empire bridging continents, renowned for its cultural and military might.",
	            "cities": [
	                "Istanbul",
	                "Ankara",
	                "Izmir",
	                "Bursa",
	                "Adana",
	                "Gaziantep",
	                "Konya",
	                "Antalya",
	                "Kayseri",
	                "Mersin"
	            ],
	            "bonuses": [
	                "diplomatic_eminence"
	            ],
	            "leader_images": {
	                "default": ["../../assets/leaders/default.png"],
	                "angry": ["../../assets/leaders/angry.png"]
	            },
	            "quotes": {
	                "greeting": ["Welcome to the crossroads of East and West."],
	                "farewell": ["Farewell, may fortune guide your journey."],
	                "victory": ["Our empire stands mighty and unyielding!"],
	                "angry": ["Tread carefully, for our wrath is legendary!"],
	                "defeat": ["Even in loss, our legacy endures."]
	            }
	        },
	        "Japan": {
	            "name": "Japan",
	            "leader": "Tokugawa Ieyasu",
	            "flag_image": "../../assets/ui/flags/icons8-japan-100.png",
	            "description": "An island nation blending tradition and innovation, guided by honor and resilience.",
	            "cities": [
	                "Tokyo",
	                "Osaka",
	                "Kyoto",
	                "Yokohama",
	                "Nagoya",
	                "Sapporo",
	                "Fukuoka",
	                "Kobe",
	                "Hiroshima",
	                "Sendai"
	            ],
	            "bonuses": [
	                "unyielding_valor"
	            ],
	            "leader_images": {
	                "default": ["../../assets/leaders/default.png"],
	                "angry": ["../../assets/leaders/angry.png"]
	            },
	            "quotes": {
	                "greeting": ["Konnichiwa, welcome to the land of the rising sun."],
	                "farewell": ["Sayonara, until our spirits meet again."],
	                "victory": ["Our honor shines in every victory!"],
	                "angry": ["Challenge our legacy and face our fury!"],
	                "defeat": ["Even in defeat, our spirit remains unbroken."]
	            }
	        },
	        "Germany": {
	            "name": "Germany",
	            "leader": "Otto von Bismarck",
	            "flag_image": "../../assets/ui/flags/icons8-germany-100.png",
	            "description": "A nation forged by unity and modern industry, with a legacy of innovation and power.",
	            "cities": [
	                "Berlin",
	                "Munich",
	                "Frankfurt",
	                "Hamburg",
	                "Cologne",
	                "Stuttgart",
	                "Düsseldorf",
	                "Dresden",
	                "Leipzig",
	                "Hanover"
	            ],
	            "bonuses": [
	                "industrial_ascendance"
	            ],
	            "leader_images": {
	                "default": ["../../assets/leaders/default.png"],
	                "angry": ["../../assets/leaders/angry.png"]
	            },
	            "quotes": {
	                "greeting": ["Willkommen, to a land of precision and progress."],
	                "farewell": ["Auf Wiedersehen, until our unity prevails again."],
	                "victory": ["Our resolve and unity forge our destiny!"],
	                "angry": ["Challenge our might at your own peril!"],
	                "defeat": ["In every setback, we find a spark for resurgence."]
	            }
	        },
	        "Russia": {
	            "name": "Russia",
	            "leader": "Peter the Great",
	            "flag_image": "../../assets/ui/flags/icons8-russia-100.png",
	            "description": "A vast empire of rich culture and ambition, spanning across continents with enduring strength.",
	            "cities": [
	                "Moscow",
	                "Saint Petersburg",
	                "Novosibirsk",
	                "Yekaterinburg",
	                "Kazan",
	                "Nizhny Novgorod",
	                "Chelyabinsk",
	                "Samara",
	                "Omsk",
	                "Rostov-on-Don"
	            ],
	            "bonuses": [
	                "religious_fervor"
	            ],
	            "leader_images": {
	                "default": ["../../assets/leaders/default.png"],
	                "angry": ["../../assets/leaders/angry.png"]
	            },
	            "quotes": {
	                "greeting": ["Добро пожаловать, welcome to the vast expanse of Russia."],
	                "farewell": ["До свидания, until destiny brings us together again."],
	                "victory": ["Victory is our destiny, forged in ambition!"],
	                "angry": ["Do not provoke the might of the Russian bear!"],
	                "defeat": ["Even in defeat, our spirit will rise."]
	            }
	        },
	        "India": {
	            "name": "India",
	            "leader": "Ashoka the Great",
	            "flag_image": "../../assets/ui/flags/icons8-india-100.png",
	            "description": "A land of ancient wisdom, vibrant traditions, and epic cultural heritage.",
	            "cities": [
	                "Delhi",
	                "Mumbai",
	                "Kolkata",
	                "Chennai",
	                "Bangalore",
	                "Hyderabad",
	                "Ahmedabad",
	                "Pune",
	                "Jaipur",
	                "Surat"
	            ],
	            "bonuses": [
	                "cultural_renaissance"
	            ],
	            "leader_images": {
	                "default": ["../../assets/leaders/default.png"],
	                "angry": ["../../assets/leaders/angry.png"]
	            },
	            "quotes": {
	                "greeting": ["Namaste, welcome to a tapestry of culture and history."],
	                "farewell": ["Farewell, may wisdom guide your steps."],
	                "victory": ["Our spirit triumphs as brightly as our heritage!"],
	                "angry": ["Defy our legacy and face our unwavering resolve!"],
	                "defeat": ["Every defeat sows the seeds for future triumphs."]
	            }
	        },
	        "Mongolia": {
	            "name": "Mongolia",
	            "leader": "Genghis Khan",
	            "flag_image": "../../assets/ui/flags/icons8-mongolia-100.png",
	            "description": "A fierce nomadic empire that once conquered vast lands under the great Khan.",
	            "cities": [
	                "Ulaanbaatar",
	                "Erdenet",
	                "Darkhan",
	                "Choibalsan",
	                "Öndörkhaan",
	                "Khovd",
	                "Arvaikheer",
	                "Sükhbaatar",
	                "Darhan",
	                "Ulaangom"
	            ],
	            "bonuses": [
	                "martial_legacy"
	            ],
	            "leader_images": {
	                "default": ["../../assets/leaders/default.png"],
	                "angry": ["../../assets/leaders/angry.png"]
	            },
	            "quotes": {
	                "greeting": ["Welcome to the boundless steppes of Mongolia."],
	                "farewell": ["Farewell, may the spirit of the steppe guide you."],
	                "victory": ["Our conquests echo through the ages!"],
	                "angry": ["Do not provoke the wrath of the great Khan!"],
	                "defeat": ["Even in defeat, our legacy roams free."]
	            }
	        },
	        "Spain": {
	            "name": "Spain",
	            "leader": "Isabella I",
	            "flag_image": "../../assets/ui/flags/icons8-spain-100.png",
	            "description": "A nation of passionate exploration and conquest, where Renaissance spirit thrives.",
	            "cities": [
	                "Madrid",
	                "Barcelona",
	                "Valencia",
	                "Seville",
	                "Bilbao",
	                "Granada",
	                "Zaragoza",
	                "Malaga",
	                "Murcia",
	                "Palma"
	            ],
	            "bonuses": [
	                "pioneering_spirit"
	            ],
	            "leader_images": {
	                "default": ["../../assets/leaders/default.png"],
	                "angry": ["../../assets/leaders/angry.png"]
	            },
	            "quotes": {
	                "greeting": ["Bienvenido, step into a world of passion and discovery."],
	                "farewell": ["Adiós, until our adventures intertwine again."],
	                "victory": ["Our conquests burn with the fire of passion!"],
	                "angry": ["Defy us and face the fury of Spanish might!"],
	                "defeat": ["In every loss, the seed of future triumph is sown."]
	            }
	        },
	        "Netherlands": {
	            "name": "Netherlands",
	            "leader": "William of Orange",
	            "flag_image": "../../assets/ui/flags/icons8-netherlands-100.png",
	            "description": "A small yet influential nation renowned for its trade, innovation, and maritime mastery.",
	            "cities": [
	                "Amsterdam",
	                "Rotterdam",
	                "The Hague",
	                "Utrecht",
	                "Eindhoven",
	                "Maastricht",
	                "Groningen",
	                "Leiden",
	                "Nijmegen",
	                "Delft"
	            ],
	            "bonuses": [
	                "economic_supremacy"
	            ],
	            "leader_images": {
	                "default": ["../../assets/leaders/default.png"],
	                "angry": ["../../assets/leaders/angry.png"]
	            },
	            "quotes": {
	                "greeting": ["Welkom, step into a realm of commerce and creativity."],
	                "farewell": ["Tot ziens, until we sail the tides of fortune again."],
	                "victory": ["Our spirit sails victorious against all odds!"],
	                "angry": ["Challenge our trade and incur our wrath!"],
	                "defeat": ["Even in defeat, we chart a course for renewal."]
	            }
	        },
	        "The Luminari": {
	            "name": "The Luminari",
	            "leader": "Queen Lyara",
	            "flag_image": "../../assets/ui/flags/icons8-canada-100.png",
	            "description": "A radiant realm guided by celestial wisdom, shining as a beacon of hope and enlightenment.",
	            "cities": [
	                "Auroralith",
	                "Starlight Haven",
	                "Radiant Spire",
	                "Luminark",
	                "Celestara",
	                "Gleaming Cove",
	                "Solstice Keep",
	                "Astral Crown",
	                "Beacon's Rest",
	                "Illumindor"
	            ],
	            "bonuses": [
	                "celestial_radiance"
	            ],
	            "leader_images": {
	                "default": ["../../assets/leaders/default.png"],
	                "insulted": ["../../assets/leaders/default.png"]
	            },
	            "quotes": {
	                "greeting": ["Welcome, traveler. Do you seek the wisdom of the stars?"],
	                "farewell": ["May your path shine ever brighter."],
	                "victory": ["The light of the Luminari outshines all!"],
	                "insulted": ["You dare to challenge the brilliance of the Luminari?"],
	                "defeat": ["Even in defeat, the stars remain constant."]
	            }
	        }
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=Nations.js.map

/***/ })
/******/ ])});;