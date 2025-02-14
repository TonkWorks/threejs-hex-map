var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
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
define(["require", "exports", "three", "./MapMesh", "./interfaces", "./util", "./Grid", "./DefaultTileSelector", "./DefaultTileHoverSelector", "./Units", "./DefaultMapViewController", "./coords", "./ChunkedLazyMapMesh", "./ParticleSystemEffects", "./ParticleSystem", "./Units", "./GameState", "./CSS3DRenderer", "./AI", "./third/toastify", "./Nations", "./Research", "./Selector", "./third/postprocessing.esm", "./third/stats", "./hexagon", "./third/thickLine", "./Governments"], function (require, exports, three_1, MapMesh_1, interfaces_1, util_1, Grid_1, DefaultTileSelector_1, DefaultTileHoverSelector_1, Units_1, DefaultMapViewController_1, coords_1, ChunkedLazyMapMesh_1, ParticleSystemEffects_1, ParticleSystem_1, Units_2, GameState_1, CSS3DRenderer_1, AI_1, toastify_1, Nations_1, Research_1, Selector_1, postprocessing_esm_1, Stats, hexagon_1, thickLine_1, Governments_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MapMesh_1 = __importDefault(MapMesh_1);
    Grid_1 = __importDefault(Grid_1);
    DefaultTileSelector_1 = __importDefault(DefaultTileSelector_1);
    DefaultMapViewController_1 = __importDefault(DefaultMapViewController_1);
    ChunkedLazyMapMesh_1 = __importDefault(ChunkedLazyMapMesh_1);
    toastify_1 = __importDefault(toastify_1);
    Selector_1 = __importStar(Selector_1);
    Stats = __importStar(Stats);
    // declare const postProcessing: any;
    class MapView {
        get controller() {
            return this._controller;
        }
        get canvas() {
            return this._canvas;
        }
        get gameState() {
            return this._gameState;
        }
        get zoom() {
            return this._zoom;
        }
        getZoom() {
            return this._zoom;
        }
        set zoom(value) {
            this.setZoom(value);
        }
        get selectedTile() {
            return this._selectedTile;
        }
        getTileGrid() {
            return this._tileGrid;
        }
        getSaveGame() {
            const gc = (0, GameState_1.cloneGameState)(this._gameState);
            return {
                "gameState": gc,
                "grid": this._tileGrid.exportData(),
                "selectedTile": { q: this._selectedTile.q, r: this._selectedTile.r }
            };
        }
        get mapMesh() {
            return this._mapMesh;
        }
        /**
         * Sets up the camera with the given Z position (height) and so that the view center (the point the camera is pointed at) doesn't change.
         */
        setZoom(z) {
            this._camera.updateMatrixWorld(false);
            // position the camera is currently centered at
            const lookAt = this.getViewCenter();
            // move camera along the Z axis to adjust the view distance
            this._zoom = z;
            this._camera.position.z = z;
            this._camera.updateMatrixWorld(true);
            if (lookAt != null) {
                // reposition camera so that the view center stays the same
                this._camera.position.copy(this.getCameraFocusPositionWorld(lookAt));
            }
            return this;
        }
        get scrollDir() {
            return this._scrollDir;
        }
        set onTileSelected(callback) {
            this._onTileSelected = callback;
        }
        set onLoaded(callback) {
            this._onLoaded = callback;
        }
        set onAnimate(callback) {
            if (!callback) {
                throw new Error("Invalid onAnimate callback");
            }
            this._onAnimate = callback;
        }
        setOnAnimateCallback(callback) {
            this.onAnimate = callback;
        }
        constructor(canvasElementQuery = "canvas") {
            this._scrollDir = new three_1.Vector3(0, 0, 0);
            this._lastTimestamp = Date.now();
            this._zoom = 25;
            this._tileGrid = new Grid_1.default(0, 0);
            this._tileSelector = DefaultTileSelector_1.default;
            this._hoverSelector = DefaultTileHoverSelector_1.DefaultTileHoverSelector;
            this._arrow = null;
            this._controller = new DefaultMapViewController_1.default();
            this._pathIndicators = new three_1.Group();
            this._units = new Map();
            this._gameState = (0, GameState_1.InitGameState)();
            this._savedGame = null;
            this._onAnimate = (dtS) => { };
            this._minimap_aspect_width = 400;
            this._minimap_aspect_height = 275;
            this.borders = {};
            this.composer = null;
            this.stats = null;
            this._units_models = new three_1.Group();
            this._ui_map_expansion = new three_1.Group();
            this._ui_map_temp_models = new three_1.Group();
            this.unitInfoPanel = null;
            this.unitInfoCache = "";
            this.unitInfoIndex = "";
            this.buyingLand = "";
            this.gameStatePanel = null;
            this.menuPanel = null;
            this.actionPanel = null;
            this.resourcePanel = null;
            this.sectionHalo = null;
            this._lastMinimapUpdate = 0;
            this.scrollSpeed = 10;
            this.animate = (timestamp) => {
                this.stats.begin();
                const dtS = (timestamp - this._lastTimestamp) / 1000.0;
                const camera = this._camera;
                const zoomRelative = camera.position.z / MapView.DEFAULT_ZOOM;
                const scroll = this._scrollDir.clone().normalize().multiplyScalar(this.scrollSpeed * zoomRelative * dtS);
                camera.position.add(scroll);
                // if (this._chunkedMesh) {
                //     this._chunkedMesh.updateVisibility(camera)
                //     // this._chunkedMesh.updateVisibility(this._minimap_camera)
                // }
                // this._minimap_camera.position.y = 4;
                this._minimap_camera.position.z = this._tileGrid.width * 2;
                this._onAnimate(dtS);
                // if (this._mapMesh && (this._mapMesh as MapMesh).waterMaterial) {
                //     (this._mapMesh as MapMesh).waterMaterial.uniforms.sineTime.value = timestamp / 900;
                //     (this._mapMesh as MapMesh).waterMaterial.needsUpdate = true;
                // }
                // if (this._mapMesh && (this._mapMesh as MapMesh).landMaterial) {
                //     (this._mapMesh as MapMesh).landMaterial.uniforms.sineTime.value = timestamp / 10;
                //     (this._mapMesh as MapMesh).landMaterial.needsUpdate = true;
                // }
                for (const ps of ParticleSystem_1.ParticleSystems) {
                    ps.update(dtS);
                    if (!ps.isActive()) {
                        ps.dispose();
                    }
                }
                for (const ps of Selector_1.Selectors) {
                    ps.update(dtS);
                }
                // this._renderer.render(this._scene, camera);
                this.composer.render();
                if (timestamp - this._lastMinimapUpdate > 150) {
                    this._labelRenderer.render(this._scene, camera);
                }
                if (timestamp - this._lastMinimapUpdate > 500) {
                    this._minimap_renderer.render(this._scene, this._minimap_camera);
                }
                this.stats.end();
                requestAnimationFrame(this.animate);
                this._lastTimestamp = timestamp;
            };
            const canvas = this._canvas = document.querySelector(canvasElementQuery);
            const camera = this._camera = new three_1.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 2, 10000);
            const minimap_camera = this._minimap_camera = new three_1.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 2, 10000);
            const scene = this._scene = new three_1.Scene();
            const renderer = this._renderer = new three_1.WebGLRenderer({
                canvas: canvas,
                // devicePixelRatio: window.devicePixelRatio
            });
            renderer.setClearColor(0x6495ED);
            renderer.setSize(window.innerWidth, window.innerHeight);
            const minimapRenderer = this._minimap_renderer = new three_1.WebGLRenderer({
            // devicePixelRatio: window.devicePixelRatio
            });
            minimap_camera.layers.set(10);
            minimapRenderer.setSize(this._minimap_aspect_width, this._minimap_aspect_height); // Set the size of the minimap
            minimapRenderer.domElement.style.position = 'absolute';
            minimapRenderer.domElement.style.bottom = '0px';
            minimapRenderer.domElement.style.left = '0px';
            minimapRenderer.domElement.style.zIndex = '1000';
            minimapRenderer.domElement.style.border = '2px solid #d4af37';
            minimapRenderer.domElement.id = 'minimap';
            document.body.appendChild(minimapRenderer.domElement);
            const labelRenderer = new CSS3DRenderer_1.CSS3DRenderer();
            labelRenderer.setSize(window.innerWidth, window.innerHeight);
            labelRenderer.domElement.style.position = 'absolute';
            labelRenderer.domElement.style.top = '0px';
            labelRenderer.domElement.style.pointerEvents = 'none';
            this._labelRenderer = labelRenderer;
            document.body.appendChild(labelRenderer.domElement);
            // setup camera
            camera.rotation.x = Math.PI / 4.5;
            minimap_camera.rotation.x = 0;
            this.setZoom(MapView.DEFAULT_ZOOM);
            this.focus(0, 0);
            this._minimap_camera.aspect = this._minimap_aspect_width / this._minimap_aspect_height;
            this._minimap_camera.updateProjectionMatrix();
            // hover selector
            this._hoverSelector.position.setZ(0.0001);
            this._scene.add(this._hoverSelector);
            this._hoverSelector.visible = true;
            // tile selector
            this._tileSelector.position.setZ(0.02);
            this._scene.add(this._tileSelector);
            this._tileSelector.visible = true;
            this._scene.add(this._pathIndicators);
            // audtio
            this._listener = new three_1.AudioListener();
            this._camera.add(this._listener);
            // units
            this._scene.add(this._units_models);
            this._scene.add(this._ui_map_temp_models);
            this._scene.add(this._ui_map_expansion);
            this.stats = Stats.default();
            this.stats.dom.style.top = '35px';
            this.stats.showPanel(0);
            // document.body.appendChild(this.stats.dom);
            // Setup EffectComposer
            this.composer = new postprocessing_esm_1.EffectComposer(renderer);
            const renderPass = new postprocessing_esm_1.RenderPass(this._scene, this._camera);
            this.composer.addPass(renderPass);
            // Add Bloom effect
            const bloomEffect = new postprocessing_esm_1.BloomEffect({
                intensity: 2,
                luminanceThreshold: 0.85,
                luminanceSmoothing: 0.2,
            });
            const bloomPass = new postprocessing_esm_1.EffectPass(this._camera, bloomEffect);
            this.composer.addPass(bloomPass);
            const vg = new postprocessing_esm_1.VignetteEffect({ offset: 0.1, darkness: 0.7 });
            this.composer.addPass(new postprocessing_esm_1.EffectPass(this._camera, vg));
            // // Add SMAA anti-aliasing
            // const smaaEffect = new SMAAEffect();
            // const smaaPass = new EffectPass(this._camera, smaaEffect);
            // this.composer.addPass(smaaPass);
            window.addEventListener('resize', (e) => this.onWindowResize(e), false);
            // start rendering loop
            this.animate(0);
            this._controller.init(this, canvas);
        }
        load(tiles, options) {
            this._tileGrid = tiles;
            this._selectedTile = this._tileGrid.get(0, 0);
            if ((tiles.width * tiles.height) < Math.pow(512, 2)) {
                const mesh = this._mapMesh = new MapMesh_1.default(tiles.toArray(), options); //, tiles)
                this._scene.add(this._mapMesh);
                mesh.loaded.then(() => {
                    this._onLoaded();
                });
            }
            else {
                const mesh = this._mapMesh = this._chunkedMesh = new ChunkedLazyMapMesh_1.default(tiles, options);
                this._scene.add(this._mapMesh);
                mesh.loaded.then(() => {
                    if (this._onLoaded)
                        this._onLoaded();
                });
                console.info("using ChunkedLazyMapMesh with " + mesh.numChunks + " chunks for " + (tiles.width * tiles.height) + " tiles");
            }
        }
        // standard map options
        getMapOptions() {
            return __awaiter(this, void 0, void 0, function* () {
                const textureLoader = new three_1.TextureLoader();
                const loadTexture = (name) => {
                    const texture = textureLoader.load((0, util_1.asset)(name));
                    texture.name = name;
                    return texture;
                };
                const options = {
                    terrainAtlas: null,
                    terrainAtlasTexture: loadTexture("terrain.png"),
                    hillsNormalTexture: loadTexture("hills-normal.png"),
                    coastAtlasTexture: loadTexture("coast-diffuse.png"),
                    riverAtlasTexture: loadTexture("river-diffuse.png"),
                    undiscoveredTexture: loadTexture("paper.jpg"),
                    treeSpritesheet: loadTexture("trees.png"),
                    treeSpritesheetSubdivisions: 4,
                    transitionTexture: loadTexture("transitions.png"),
                    treesPerForest: 50,
                    gridWidth: 0.025,
                    gridColor: new three_1.Color(0x42322b),
                    gridOpacity: 0.25,
                    // options per tree index, varying the different kinds of trees a little
                    treeOptions: [
                        undefined, // leave default options for trees with index 0 (temperate zone forests)
                        {
                            treesPerForest: 25
                        },
                        {
                            treesPerForest: 10,
                            scale: 0.85
                        } // no options for tropical forests (index = 3)
                    ]
                };
                const atlas = yield (0, util_1.loadTextureAtlas)();
                options.terrainAtlas = atlas;
                return options;
            });
        }
        loadFromJSON(json) {
            return __awaiter(this, void 0, void 0, function* () {
                const options = yield this.getMapOptions();
                this._savedGame = json;
                const tiles = Grid_1.default.fromJSON(json);
                this.load(tiles, options);
            });
        }
        updateTiles(tiles) {
            this._mapMesh.updateTiles(tiles);
            for (const tile of tiles) {
                let t = this._tileGrid.get(tile.q, tile.r);
                if (t.improvement !== undefined && t.clouds === false) {
                    t.improvement.model.visible = true;
                }
                if (t.improvementOverlay !== undefined && t.clouds === false) {
                    t.improvementOverlay.visible = true;
                }
                if (t.territoryOverlay !== undefined && t.clouds === false) {
                    t.territoryOverlay.visible = true;
                }
                if (t.unit !== undefined && t.fog == false && t.clouds === false) {
                    t.unit.model.visible = true;
                }
                if (t.clouds === false && t.resource !== undefined) {
                    t.resource.model.visible = true;
                    t.resource.model.matrixWorldNeedsUpdate = true;
                }
            }
            for (let player of Object.values(this._gameState.players)) {
                this.updateBorderOverlay(player);
            }
        }
        // updateAllVisilibility() {
        //     this.getTileGrid().forEach((tile) => {
        //         if (tile.unit !== undefined) {
        //             tile.unit.model.visible = true;
        //         }
        //     }
        // }
        addUnitToMap(unit, tile, fromSaved = false) {
            // Bad Cases
            if (tile === undefined) {
                console.log("cannot add unit; no tile");
                return;
            }
            if (tile.unit !== undefined) {
                console.log("cannot add unit; already occupied");
                return;
            }
            if ((0, interfaces_1.isMountain)(tile.height)) {
                console.log("cannot place on mountain");
                return;
            }
            // if (isWater(tile.height)) {
            //     console.log("cannot place in water");
            //     return;
            // }
            const worldPos = (0, coords_1.qrToWorld)(tile.q, tile.r);
            if ((tile.fog || tile.clouds) && unit.owner !== this.gameState.currentPlayer) {
                unit.model.visible = false;
            }
            unit.model.position.set(worldPos.x, worldPos.y - .4, unit.offset + .2);
            let player = this.getPlayer(unit.owner);
            player.units[unit.id] = unit;
            tile.unit = unit;
            unit.tileInfo = { q: tile.q, r: tile.r };
            this._units_models.add(unit.model);
            if (fromSaved) {
                return;
            }
            this.updateResourcePanel();
            this.updateGameStatePanel();
        }
        addImprovementToMap(improvement, tile, fromSaved = false) {
            // Bad Cases
            if (tile.improvement !== undefined) {
                console.log("cannot add improvement; already occupied");
                return;
            }
            if ((0, interfaces_1.isMountain)(tile.height)) {
                console.log("cannot place on mountain");
                return;
            }
            if ((0, interfaces_1.isWater)(tile.height)) {
                console.log("cannot place in water");
                return;
            }
            let player = this.getPlayer(improvement.owner);
            player.improvements[improvement.id] = improvement;
            const worldPos = (0, coords_1.qrToWorld)(tile.q, tile.r);
            improvement.model.position.set(worldPos.x, worldPos.y, .4);
            improvement.tileInfo = { q: tile.q, r: tile.r };
            tile.improvement = improvement;
            let overlayCity = (0, Units_1.createCityOverlayModel)();
            this._units_models.add(overlayCity);
            overlayCity.layers.disable(0);
            overlayCity.position.set(worldPos.x, worldPos.y, 0.3);
            overlayCity.layers.enable(10);
            tile.improvementOverlay = overlayCity;
            tile.city = improvement.id;
            // update tile ownership of  this and surrounding
            const tiles = this.getTileGrid().neighbors(tile.q, tile.r, 1);
            tiles.push(tile);
            for (const t of tiles) {
                t.owner = improvement.owner;
                this.addTerritoryOverlay(t, improvement.id, player);
            }
            this.updateBorderOverlay(player);
            this._units_models.add(improvement.model);
            if (fromSaved) {
                return;
            }
            const mm = this;
            if (this.gameState.currentPlayer === improvement.owner) {
                this.toast({
                    icon: "../../assets/map/icons/star.png",
                    text: `${improvement.name} founded by ${player.name}`,
                    onClick: function () {
                        mm.selectTile(tile);
                        mm.focus(mm.selectedTile.q + 1, mm.selectedTile.r - 3);
                    }
                });
            }
            if (!improvement.nextTile) {
                let tiles = this.getEligibleTilesForExpansion(tile);
                if (tiles.length > 0) {
                    improvement.nextTile = this.getBestYield(tiles, tile);
                }
            }
            this.updateResourcePanel();
            this.updateGameStatePanel();
        }
        addTerritoryOverlay(t, city_id, player) {
            if (t.territoryOverlay) {
                if (t.territoryOverlay.parent) {
                    t.territoryOverlay.parent.remove(t.territoryOverlay);
                }
            }
            t.city = city_id;
            t.territoryOverlay = (0, Units_1.createTerritoryOverlayModel)(player);
            this._units_models.add(t.territoryOverlay);
            const tworldPos = (0, coords_1.qrToWorld)(t.q, t.r);
            t.territoryOverlay.position.set(tworldPos.x, tworldPos.y, 0.01);
            t.territoryOverlay.layers.enable(10);
            this.updateTiles([t]);
        }
        addTerritoryOverlayFilterById(t, city_id, player) {
            const tiles = this.getTileGrid().neighbors(t.q, t.r, 4);
            for (const t of tiles) {
                if (t.city && t.city == city_id) {
                    t.owner = player.name;
                    this.addTerritoryOverlay(t, city_id, player);
                }
            }
            this.updateBorderOverlay(player);
        }
        updateBorderOverlay(player) {
            const ownedTiles = this._tileGrid.toArray().filter(t => t.owner === player.name);
            this.updateTerritoryBorderOverlay(ownedTiles, player);
        }
        updateTerritoryBorderOverlay(ownedTiles, player) {
            // Remove any old border overlay
            if (this.borders[player.name]) {
                this._units_models.remove(this.borders[player.name]);
            }
            // Array to store separate border lines
            const borderLines = [];
            const neighborOffsets = [
                { dq: 1, dr: 0 },
                { dq: 0, dr: 1 },
                { dq: -1, dr: 1 },
                { dq: -1, dr: 0 },
                { dq: 0, dr: -1 },
                { dq: 1, dr: -1 },
            ];
            for (const tile of ownedTiles) {
                if (tile.clouds)
                    continue;
                const center = (0, coords_1.qrToWorld)(tile.q, tile.r);
                const hexPoints = (0, hexagon_1.getHexPoints)(center.x, center.y, 1);
                for (let i = 0; i < 6; i++) {
                    const offset = neighborOffsets[i];
                    const neighbor = this.getTile(tile.q + offset.dq, tile.r + offset.dr);
                    if (!neighbor || neighbor.owner !== player.name) {
                        const p1 = hexPoints[i];
                        const p2 = hexPoints[(i + 1) % 6];
                        // Create an individual line for each border segment
                        borderLines.push([new three_1.Vector3(p1.x, p1.y, 0.01), new three_1.Vector3(p2.x, p2.y, 0.01)]);
                    }
                }
            }
            // Create a separate ThickLine object for each discontinuous border segment
            const allBorders = new three_1.Group();
            borderLines.forEach(line => {
                const thickLine = new thickLine_1.ThickLine(line, {
                    linewidth: 4,
                    color: player.color,
                    // fill: true,
                    // fillColor: 'blue',
                    // fillOpacity: 0.5
                    resolution: new three_1.Vector2(window.innerWidth, window.innerHeight)
                });
                allBorders.add(thickLine);
            });
            allBorders.layers.enable(10);
            this.borders[player.name] = allBorders;
            this._units_models.add(allBorders);
        }
        addResourceToMap(resourceName, tile) {
            let resource = Units_1.ResourceMap[resourceName];
            // Bad Cases
            if (tile.resource !== undefined) {
                console.log("cannot add resource; already occupied");
                return;
            }
            if ((0, interfaces_1.isMountain)(tile.height)) {
                console.log("cannot place on mountain");
                return;
            }
            if ((0, interfaces_1.isWater)(tile.height)) {
                console.log("cannot place in water");
                return;
            }
            const worldPos = (0, coords_1.qrToWorld)(tile.q, tile.r);
            resource = (0, Units_1.CreateResourceModel)(resource);
            resource.model.visible = false;
            resource.model.position.set(worldPos.x, worldPos.y - .8, 0.3);
            this._units_models.add(resource.model);
            tile.resource = resource;
        }
        initGameSetup() {
            if (this._savedGame) {
                this._gameState = this._savedGame.gameState;
                for (const tile of this._tileGrid.toArray()) {
                    if (tile.resource === undefined) {
                        continue;
                    }
                    const n = tile.resource.name;
                    tile.resource = undefined;
                    this.addResourceToMap(n, tile);
                }
                for (const [key, player] of Object.entries(this._gameState.players)) {
                    for (const improvementData of Object.values(player.improvements)) {
                        const improvement = (0, Units_2.CreateCity)(player);
                        improvement.id = improvementData.id;
                        improvement.population = improvementData.population;
                        improvement.name = improvementData.name;
                        let t = this.getTile(improvementData.tileInfo.q, improvementData.tileInfo.r);
                        // t.improvement = undefined;
                        this.addImprovementToMap(improvement, t, true);
                    }
                    for (const unitData of Object.values(player.units)) {
                        const unit = (0, Units_1.LoadSavedUnit)(unitData, player);
                        let t = this.getTile(unitData.tileInfo.q, unitData.tileInfo.r);
                        // t.unit = undefined;
                        this.addUnitToMap(unit, t, true);
                    }
                }
                if (this._savedGame.selectedTile) {
                    const t = this.getTile(this._savedGame.selectedTile.q, this._savedGame.selectedTile.r);
                    this.selectTile(t);
                }
                return;
            }
            let new_game_settingsStr = localStorage.getItem("new_game_settings");
            let new_game_settings = {};
            if (new_game_settingsStr) {
                new_game_settings = JSON.parse(new_game_settingsStr);
                console.log(new_game_settings);
                localStorage.removeItem("new_game_settings");
            }
            // set up initial resources
            const resourceNames = Object.keys(Units_1.ResourceMap);
            let amount = 200;
            if (new_game_settings.resources) {
                amount = new_game_settings.resources;
            }
            for (let i = 0; i < amount; i++) {
                let tile = this.getRandomTile(false);
                if (tile && tile.resource === undefined && !(0, interfaces_1.isMountain)(tile.height) && !(0, interfaces_1.isWater)(tile.height)) {
                    // get random from resource map
                    const name = resourceNames[Math.floor(Math.random() * resourceNames.length)];
                    this.addResourceToMap(name, tile);
                }
            }
            // set initial yields
            for (let tile of this._tileGrid.toArray()) {
                tile.yields = { "gold": 0 };
                switch (tile.terrain) {
                    case 'grass':
                        tile.yields = { "food": 1, "production": 1, "gold": 1 };
                    case 'plains':
                        tile.yields = { "food": 1, "production": 1, "gold": 1 };
                    case 'ocean':
                        tile.yields = { "food": 1, "gold": 1 };
                    case 'tundra':
                        tile.yields = { "production": 1, "gold": 0 };
                        break;
                }
                if ((0, interfaces_1.isMountain)(tile.height)) {
                    tile.yields = {};
                }
                if ((0, interfaces_1.isHill)(tile.height)) {
                    tile.yields['gold'] += 1;
                }
                if (tile.resource) {
                    tile.yields['gold'] += tile.resource.gold;
                }
            }
            // set up players initial locations
            for (const [key, player] of Object.entries(this._gameState.players)) {
                const startTile = this.getRandomTile(true);
                const improvement = (0, Units_2.CreateCity)(player);
                this.addImprovementToMap(improvement, startTile);
                const unit = (0, Units_2.CreateRifleman)(player);
                this.addUnitToMap(unit, startTile);
                if (player.name === this._gameState.currentPlayer) {
                    this.selectTile(startTile);
                }
            }
        }
        toast({ text, icon, onClick }) {
            this.playSound((0, util_1.asset)("sounds/ui/notification.mp3"));
            new toastify_1.default({
                text: text,
                position: "left",
                avatar: icon,
                close: true,
                duration: 80000,
                offset: {
                    x: -10, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
                    y: 30 // vertical axis - can be a number or a string indicating unity. eg: '2em'
                },
                onClick: onClick,
                style: {
                    minWidth: '250px',
                    background: 'linear-gradient(to right,rgb(0, 8, 7),rgb(10, 12, 6))',
                },
            }).showToast();
        }
        getPlayer(name) {
            return this._gameState.players[name];
        }
        getTile(q, r) {
            // return this._mapMesh.getTile(q, r);
            return this._tileGrid.get(q, r);
        }
        onWindowResize(event) {
            console.log('resize');
            this._camera.aspect = window.innerWidth / window.innerHeight;
            this._camera.updateProjectionMatrix();
            this._renderer.setSize(window.innerWidth, window.innerHeight);
            this._minimap_camera.updateProjectionMatrix();
            this.composer.setSize(window.innerWidth, window.innerHeight);
            this._minimap_renderer.setSize(this._minimap_aspect_width, this._minimap_aspect_height);
            this._labelRenderer.setSize(window.innerWidth, window.innerHeight);
        }
        //----- MapViewControls -----
        setScrollDir(x, y) {
            this._scrollDir.setX(x);
            this._scrollDir.setY(y);
            this._scrollDir.normalize();
        }
        getCamera() {
            return this._camera;
        }
        getMiniMapCamera() {
            return this._minimap_camera;
        }
        /**
         * Returns the world space position on the Z plane (the plane with the tiles) at the center of the view.
         */
        getViewCenter() {
            return (0, coords_1.mouseToWorld)({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 }, this._camera);
        }
        getCameraFocusPosition(pos) {
            return this.getCameraFocusPositionWorld((0, coords_1.qrToWorld)(pos.q, pos.r));
        }
        getCameraFocusPositionWorld(pos) {
            const currentPos = this._camera.position.clone();
            const viewCenter = this.getViewCenter();
            const viewOffset = currentPos.sub(viewCenter);
            return pos.add(viewOffset);
        }
        focus(q, r) {
            this._camera.position.copy(this.getCameraFocusPosition({ q, r }));
        }
        focusWorldPos(v) {
            this._camera.position.copy(this.getCameraFocusPositionWorld(v));
        }
        hoverTile(tile, x, y) {
            this.updateToolTip(tile, x, y);
            if (this._hoveredTile === tile)
                return;
            this._hoveredTile = tile;
            // Clear previous arrows and path indicators
            if (this._arrow) {
                this._scene.remove(this._arrow);
                this._arrow = null;
            }
            this._pathIndicators.clear();
            this._pathIndicators.children.forEach(child => this._pathIndicators.remove(child));
            if (!tile)
                return;
            const worldPos = (0, coords_1.qrToWorld)(tile.q, tile.r);
            let enemyTargeted = false;
            if ((tile.unit && tile.unit.owner !== this.gameState.currentPlayer) ||
                (tile.improvement && tile.improvement.owner !== this.gameState.currentPlayer)) {
                enemyTargeted = true;
                DefaultTileHoverSelector_1.hoverSelectorMaterial.color.set(0xff0000);
                DefaultTileHoverSelector_1.hoverSelectorMaterial.opacity = 1;
            }
            else {
                DefaultTileHoverSelector_1.hoverSelectorMaterial.color.set(0xffff00);
                DefaultTileHoverSelector_1.hoverSelectorMaterial.opacity = 0.2;
            }
            // Show attack arrow if enemy is targeted
            if (enemyTargeted && this.selectedTile.unit && this.selectedTile.unit.owner === this.gameState.currentPlayer) {
                const distance = getHexDistance(this.selectedTile, tile);
                if (distance <= this.selectedTile.unit.attack_range) {
                    const arrow = new DefaultTileHoverSelector_1.AttackArrow((0, coords_1.qrToWorld)(this.selectedTile.q, this.selectedTile.r), 3.5, worldPos);
                    this._arrow = arrow.createCurveMesh();
                    this._scene.add(this._arrow);
                }
            }
            else if (this.selectedTile.unit && !this.selectedTile.unit.moving && this.selectedTile.unit.owner === this.gameState.currentPlayer && this.selectedTile.unit.movement > 0) {
                // Show movement path if a friendly unit is selected
                if (tile !== this.selectedTile) {
                    const path = [this.selectedTile, ...this.calculatePath(this.selectedTile, tile, this.selectedTile.unit.movement)];
                    this.showPath(path);
                }
            }
            this._hoverSelector.position.set(worldPos.x, worldPos.y, 0.01);
            // const startWorldPos = qrToWorld(this.selectedTile.q, this.selectedTile.r)
            // const arrow = new AttackArrow(
            //     startWorldPos,
            //     3.5,
            //     worldPos,
            // )
            // this._arrow = arrow.createCurveMesh()
            // this._scene.add(this._arrow)
        }
        selectTile(tile) {
            const worldPos = (0, coords_1.qrToWorld)(tile.q, tile.r);
            this._tileSelector.position.set(worldPos.x, worldPos.y, 0.1);
            this._selectedTile = tile;
            this.updateUnitInfoForTile(tile);
            console.log(tile);
            // hide menu; TODO do this better
            document.getElementById('menu').innerHTML = "";
            document.getElementById('menu').style.visibility = 'hidden';
            // Create light of god halo
            if (this.sectionHalo) {
                this.sectionHalo.dispose();
                this.sectionHalo = undefined;
            }
            if (tile.unit !== undefined && tile.unit.owner === this.gameState.currentPlayer) {
                this.sectionHalo = new Selector_1.LightOfGod();
                tile.unit.model.add(this.sectionHalo.group);
            }
            // let player = this.getPlayer(this.gameState.currentPlayer);
            if (this._onTileSelected) {
                this._onTileSelected(tile);
            }
        }
        actionTile(tile) {
            console.log("action point", (0, coords_1.qrToWorld)(tile.q, tile.r));
            // Bad Cases
            if (this.selectedTile.q === tile.q && this.selectedTile.r === tile.r) {
                return;
            }
            const worldPos = (0, coords_1.qrToWorld)(tile.q, tile.r);
            const from = (0, coords_1.qrToWorld)(this.selectedTile.q, this.selectedTile.r);
            // new Explosion(from, worldPos, this._scene);
            // new Rocket(from, worldPos, this._scene, false);
            // FireWithSmoke(worldPos, this._scene)
            // new FireWithSmoke(
            //     worldPos,
            //     this._scene,
            //     { 
            //         intensity: 5,
            //         duration: 0, // 0 = infinite duration
            //         particleSize: 2.5
            //     }
            // );
            // const nuke = new NuclearExplosion(worldPos, this._scene);
            // setTimeout(() => nuke.dispose(), 12000);
            // let selectedUnit = this.selectedTile.unit
            // if (selectedUnit === undefined) {
            //     console.log("no selected unit");
            //     return;
            // }
            // if (!tile.clouds && (isMountain(tile.height))) {
            //     console.log("cannot move to mountain");
            //     return;
            // }
            // const ps = SelectionParticles(this._scene, worldPos);
            // console.log(ps);
            if (this.selectedTile.unit !== undefined && this.selectedTile.unit.owner === this.gameState.currentPlayer) {
                this.moveUnit(this.selectedTile, tile, true);
            }
        }
        updateToolTip(tile, x, y) {
            const tooltip = document.getElementById("tooltip");
            if (tile === undefined) {
                tooltip.style.visibility = "hidden";
                return;
            }
            tooltip.innerHTML = "";
            tooltip.style.left = x + 30 + "px"; // Offset to avoid cursor overlap
            tooltip.style.top = y + "px";
            let data = [];
            if (tile.improvement) {
                data.push(this.generateImprovementInfo(tile.improvement));
            }
            if (tile.unit) {
                data.push(this.generateUnitInfo(tile.unit));
            }
            if (tile.resource) {
                data.push(this.generateResourceInfo(tile.resource));
            }
            data.push(this.generateTileInfo(tile));
            tooltip.innerHTML = data.join("</br>");
            tooltip.style.visibility = "visible";
        }
        generateTileInfo(tile) {
            let height = '';
            if (tile.height > 0) {
                let rounded = Math.round(tile.height * 100) / 100;
                height += `<tr><th>Height</th><td>${rounded}</td></tr>`;
            }
            let yields = '';
            for (const [key, value] of Object.entries(tile.yields)) {
                if (value > 0) {
                    yields += `<tr><th>${(0, util_1.capitalize)(key)}</th><td>${value}</td></tr>`;
                }
            }
            return `
            <div>
                Terrain
                <div style="display: flex; align-items: left;">
                    <table style="margin-right: 10px; text-align: left;">
                        <tr>
                            <th>Type</th>
                            <td>${(0, util_1.capitalize)(tile.terrain)}</td>
                        </tr>
                        ${yields}
                        </br>
                        ${tile.owner ? `<tr><th>Owner</th><td>${tile.owner}</td></tr>` : ''}
                        ${height}
                    </table>
                </div>
            </div>`;
        }
        generateUnitInfo(unit) {
            return `
            <div>
                ${unit.name}
                <div style="display: flex; align-items: left;">
                    <table style="margin-right: 10px; text-align: left;">
                        <tr>
                            <th>Owner</th>
                            <td>${unit.owner}</td>
                        </tr>
                        <tr>
                            <th>Move</th>
                            <td>${unit.movement}/${unit.movement_max}</td>
                        </tr>
                        <tr><th>Health</td><th>${unit.health}/${unit.health_max}</td></tr>
                    </table>
                </div>
            </div>`;
        }
        generateImprovementInfo(improvement) {
            return `<div>
        <div style="text-align: left;" class="bold">${improvement.name}</div>
        <div style="display: flex; align-items: left;">
                <table style="margin-right: 10px; text-align: left;">
                    <tr><th>Owner</th><td>${improvement.owner}</td></tr>
                    <tr><th>Population</th><td>${improvement.population} (+${improvement.population_rate})</td></tr>
                    <tr><th>Health</td><th>${improvement.health}/${improvement.health_max}</td></tr>
                    <tr><th>Defence</th><td>${improvement.defence}</td></tr>
                </table>
            </div>
        </div>`;
        }
        generateResourceInfo(resource) {
            let gold_icon = `<img src="../../assets/ui/resources/gold.png" style="height: 25px; padding-right: 10px;"/>`;
            return `
            <div>
                Resource
                <div style="display: flex; align-items: left;">
                    <table style="margin-right: 10px; text-align: left;">
                        <tr>
                            <th>Type</th>
                            <td>${(0, util_1.capitalize)(resource.name)}</td>
                        </tr>
                        <tr>
                            <th></th>
                            <td>+${resource.gold} </td><td>${gold_icon}</td>
                        </tr>
                    </table>
                </div>
            </div>`;
        }
        moveUnit(currentTile, targetTile, playerInitiated = false) {
            if (currentTile === targetTile) {
                return;
            }
            if (currentTile.locked || targetTile.locked) {
                return;
            }
            if (currentTile.unit === undefined) {
                return;
            }
            if (currentTile.unit.movement < 1) {
                return;
            }
            const nextMovementTile = this.getNextMovementTile(currentTile.unit, currentTile, targetTile);
            currentTile.unit.moving = true;
            // check for battling a unit
            if (nextMovementTile.unit !== undefined &&
                currentTile.unit !== undefined &&
                currentTile.unit.owner !== nextMovementTile.unit.owner) {
                console.log("battle");
                this.battle(currentTile, nextMovementTile);
                return;
            }
            // check for battling a city
            if (nextMovementTile.improvement !== undefined &&
                currentTile.unit.owner !== nextMovementTile.improvement.owner) {
                console.log("urban combat");
                this.battleCity(currentTile, nextMovementTile);
                return;
            }
            // check for ranged battle.
            if (currentTile.unit.attack_range > 1 &&
                targetTile.unit !== undefined &&
                targetTile.unit.owner !== currentTile.unit.owner) {
                const distance = getHexDistance(currentTile, targetTile);
                if (distance <= currentTile.unit.attack_range) {
                    console.log("artillary battle");
                    this.battle(currentTile, targetTile);
                    return;
                }
            }
            // check for ranged city battle.
            if (currentTile.unit.attack_range > 1 &&
                targetTile.improvement !== undefined &&
                targetTile.improvement.owner !== currentTile.unit.owner) {
                const distance = getHexDistance(currentTile, targetTile);
                if (distance <= currentTile.unit.attack_range) {
                    console.log("artillary battle city");
                    this.battleCity(currentTile, targetTile);
                    return;
                }
            }
            if (currentTile.unit === undefined) {
                return;
            }
            nextMovementTile.unit = currentTile.unit;
            currentTile.unit = undefined;
            if (nextMovementTile.unit === undefined) {
                "missing unit shouldn't happen!";
                return;
            }
            nextMovementTile.unit.tileInfo = { q: nextMovementTile.q, r: nextMovementTile.r };
            nextMovementTile.unit.movement -= 1;
            if (nextMovementTile.unit.movement === 0) {
                if (nextMovementTile.unit.selector !== undefined) {
                    nextMovementTile.unit.selector.dispose();
                    nextMovementTile.unit.selector = undefined;
                }
            }
            if (playerInitiated) {
                this.playSound((0, util_1.asset)("sounds/units/rifleman2.mp3"), nextMovementTile.unit.model.position);
            }
            // check visibility
            const t = nextMovementTile;
            if (t.clouds || t.fog) {
                t.unit.model.visible = false;
                for (const c of t.unit.model.children) {
                    c.visible = false;
                }
            }
            else {
                t.unit.model.visible = true;
                for (const c of t.unit.model.children) {
                    c.visible = true;
                }
            }
            // keep selected on this unit unless clicked away
            if (this.selectedTile == currentTile) {
                this.selectTile(nextMovementTile);
            }
            const worldPos = (0, coords_1.qrToWorld)(nextMovementTile.q, nextMovementTile.r);
            animateToPosition(nextMovementTile.unit.model, worldPos.x, worldPos.y, .2, easeOutQuad, () => {
                nextMovementTile.unit.moving = false;
                this.moveUnit(nextMovementTile, targetTile);
            });
        }
        battle(currentTile, targetTile) {
            const player = this.getPlayer(currentTile.unit.owner);
            const targetPlayer = this.getPlayer(targetTile.unit.owner);
            if (!this.checkForClearanceToAttack(player, targetPlayer)) {
                return;
            }
            currentTile.locked = true;
            targetTile.locked = true;
            if (this._arrow !== null) {
                this._scene.remove(this._arrow);
            }
            // have attacker move forward 2/3 of the way
            const worldPosCur = (0, coords_1.qrToWorld)(currentTile.q, currentTile.r);
            const worldPosTarget = (0, coords_1.qrToWorld)(targetTile.q, targetTile.r);
            const isRanged = currentTile.unit.attack_range !== 1;
            let animation_amount = 1 / 3;
            if (isRanged) {
                animation_amount = 1 / 9;
            }
            const twoThirdsX = worldPosCur.x + (worldPosTarget.x - worldPosCur.x) * animation_amount;
            const twoThirdsY = worldPosCur.y + (worldPosTarget.y - worldPosCur.y) * animation_amount;
            const defenderBackX = worldPosTarget.x + (worldPosTarget.x - worldPosCur.x) * (1 / 12);
            const defenderBackY = worldPosTarget.y + (worldPosTarget.y - worldPosCur.y) * (1 / 12);
            const battleDuration = .3;
            new ParticleSystemEffects_1.Rocket(worldPosCur, worldPosTarget, this._scene);
            this.playSound((0, util_1.asset)("sounds/units/rifleman_attack.mp3"), worldPosCur);
            // have attacker move foward and defender move back
            animateToPosition(targetTile.unit.model, defenderBackX, defenderBackY, battleDuration, easeOutQuad, () => { });
            animateToPosition(currentTile.unit.model, twoThirdsX, twoThirdsY, battleDuration, easeOutQuad, () => {
                const outcome = (0, util_1.getRandomInt)(1, 2);
                // fall back to original positions
                animateToPosition(currentTile.unit.model, worldPosCur.x, worldPosCur.y, battleDuration, easeOutQuad, () => { });
                if (outcome === 1) {
                    // defender dies
                    const defenderBackX = worldPosTarget.x + (worldPosTarget.x - worldPosCur.x) * (1 / 3);
                    const defenderBackY = worldPosTarget.y + (worldPosTarget.y - worldPosCur.y) * (1 / 3);
                    animateFall(targetTile.unit.model, defenderBackX, defenderBackY, .2, easeOutQuad, () => {
                        let player = this.getPlayer(targetTile.unit.owner);
                        delete player.units[targetTile.unit.id];
                        this.updateResourcePanel();
                        this.updateGameStatePanel();
                        this.playSound((0, util_1.asset)("sounds/units/cinematic_boom.mp3"), worldPosCur);
                        const mm = this;
                        if (this.gameState.currentPlayer === targetTile.unit.owner) {
                            this.toast({
                                icon: `../../assets/map/icons/rifleman.png`,
                                text: `${targetTile.unit.name} has fallen in battle.`,
                                onClick: function () {
                                    mm.selectTile(targetTile);
                                    mm.focus(mm.selectedTile.q + 1, mm.selectedTile.r - 3);
                                }
                            });
                        }
                        currentTile.unit.kills += 1;
                        while (targetTile.unit.model.children.length > 0) {
                            targetTile.unit.model.remove(targetTile.unit.model.children[0]);
                        }
                        targetTile.unit.model.parent.remove(targetTile.unit.model);
                        targetTile.unit = undefined;
                        currentTile.locked = false;
                        targetTile.locked = false;
                        if (currentTile.unit.attack_range === 1) {
                            this.moveUnit(currentTile, targetTile);
                        }
                    });
                }
                else {
                    // defender falls back
                    animateToPosition(targetTile.unit.model, worldPosTarget.x, worldPosTarget.y, battleDuration, easeOutQuad, () => { });
                    currentTile.locked = false;
                    targetTile.locked = false;
                    currentTile.unit.movement -= 1;
                }
            });
        }
        battleCity(currentTile, targetTile) {
            const player = this.getPlayer(currentTile.unit.owner);
            const targetPlayer = this.getPlayer(targetTile.improvement.owner);
            if (!this.checkForClearanceToAttack(player, targetPlayer)) {
                return;
            }
            // have attacker move forward 2/3 of the way
            const worldPosCur = (0, coords_1.qrToWorld)(currentTile.q, currentTile.r);
            const worldPosTarget = (0, coords_1.qrToWorld)(targetTile.q, targetTile.r);
            if (this._arrow !== null) {
                this._scene.remove(this._arrow);
            }
            const isRanged = currentTile.unit.attack_range !== 1;
            let animation_amount = 1 / 3;
            if (isRanged) {
                animation_amount = 1 / 200;
            }
            const twoThirdsX = worldPosCur.x + (worldPosTarget.x - worldPosCur.x) * animation_amount;
            const twoThirdsY = worldPosCur.y + (worldPosTarget.y - worldPosCur.y) * animation_amount;
            currentTile.locked = true;
            targetTile.locked = true;
            const battleDuration = .3;
            new ParticleSystemEffects_1.Rocket(worldPosCur, worldPosTarget, this._scene);
            this.playSound((0, util_1.asset)("sounds/units/rifleman_attack.mp3"), worldPosCur);
            // have attacker move foward
            animateToPosition(currentTile.unit.model, twoThirdsX, twoThirdsY, battleDuration, easeOutQuad, () => {
                const outcome = (0, util_1.getRandomInt)(1, 2);
                // fall back to original positions
                animateToPosition(currentTile.unit.model, worldPosCur.x, worldPosCur.y, battleDuration, easeOutQuad, () => { });
                animateToPosition(targetTile.improvement.model, worldPosTarget.x, worldPosTarget.y, battleDuration, easeOutQuad, () => {
                    if (isRanged) {
                        currentTile.locked = false;
                        targetTile.locked = false;
                        currentTile.unit.moving = false;
                        currentTile.unit.movement -= 1;
                        return;
                    }
                    if (outcome === 1) {
                        console.log("won city battle!");
                        let p = this.getPlayer(targetTile.improvement.owner);
                        delete p.improvements[targetTile.improvement.id];
                        let p2 = this.getPlayer(currentTile.unit.owner);
                        targetTile.improvement.owner = currentTile.unit.owner;
                        p2.improvements[targetTile.improvement.id] = targetTile.improvement;
                        this.playSound((0, util_1.asset)("sounds/units/cinematic_boom.mp3"), worldPosCur);
                        this.addTerritoryOverlayFilterById(targetTile, targetTile.improvement.id, p2);
                        const mm = this;
                        this.toast({
                            icon: "../../assets/map/icons/star.png",
                            text: `${targetTile.improvement.name} captured by ${player.name}`,
                            onClick: function () {
                                mm.selectTile(targetTile);
                                mm.focus(mm.selectedTile.q + 1, mm.selectedTile.r - 3);
                            }
                        });
                        // updateMaterialColor(targetTile.improvement.model.material, p2.color);
                        this.updateResourcePanel();
                        this.updateGameStatePanel();
                        const nation = Nations_1.Nations[p2.name];
                        const img = `<img src="${nation.flag_image}" style="padding-right:10px;" width="30px" height="25px"/>`;
                        const roundedPopulation = Math.floor(targetTile.improvement.population);
                        const label = `<span class="city-label" data-target="${targetTile.improvement.id}">${img} ${targetTile.improvement.name} (${roundedPopulation})</span>`;
                        (0, Units_1.updateLabel)(targetTile.improvement.id, label);
                        // update all tiles that belonged to that city to new owner.
                        currentTile.unit.kills += 1;
                        currentTile.locked = false;
                        targetTile.locked = false;
                        currentTile.unit.moving = false;
                        this.moveUnit(currentTile, targetTile);
                        this.checkVictoryConditions();
                        return;
                    }
                    console.log("lost city battle!");
                    currentTile.locked = false;
                    targetTile.locked = false;
                    currentTile.unit.movement -= 1;
                });
            });
        }
        pickResearch() {
            const currentPlayer = this.getPlayer(this.gameState.currentPlayer);
            (0, Research_1.RenderTechTree)(currentPlayer.research.current, currentPlayer.research.researched, (tech) => {
                currentPlayer.research.current = tech.id;
                currentPlayer.research.progress = 0;
                this.updateResourcePanel();
                this.menuPanel.innerHTML = "";
                this.menuPanel.style.visibility = "hidden";
            });
        }
        cityLabelClick(id) {
            const improvement = this.getImprovementById(id);
            console.log(id);
            if (this.gameState.currentPlayer !== improvement.owner) {
                this.playerNegotiation(improvement.owner);
            }
            else {
                this.showCityMenu(this.getTile(improvement.tileInfo.q, improvement.tileInfo.r));
            }
        }
        getImprovementById(id) {
            for (const [key, player] of Object.entries(this.gameState.players)) {
                if (player.improvements[id]) {
                    return player.improvements[id];
                }
            }
            return null;
        }
        updateTaxes() {
            const currentPlayer = this.getPlayer(this.gameState.currentPlayer);
            let government = Governments_1.GovernmentsMap[currentPlayer.government];
            let governments = Object.keys(Governments_1.GovernmentsMap);
            let option_info = "";
            for (const key of governments) {
                let government = Governments_1.GovernmentsMap[key];
                option_info += ` <button class="city-menu" data-name="change_government" data-target=${key}><img id="menu-unit-img" src="../../assets/ui/resources/taxes.png">${government.name}</button>`;
            }
            let info = `
            <button class="close-button" onclick="document.getElementById('menu').style.visibility='hidden'">&times;</button>
            <div style="text-align: center;">
                <img id="menu-leader-img" src="../../assets/ui/resources/taxes.png">
            </div>
            <div class="options">
                <button class="city-menu" data-name="increase_taxes"><img id="menu-unit-img" src="../../assets/ui/resources/taxes.png">Increase Taxes (nationwide)</button>
                <button class="city-menu" data-name="decrease_taxes"><img id="menu-unit-img" src="../../assets/ui/resources/taxes.png">Decrease Taxes (nationwide)</button>
            </div>
            <p class="text small">Government: ${government.name}</p>
            <div class="options">
                ${option_info}
            </div>

        `;
            this.menuPanel.innerHTML = info;
            this.menuPanel.style.visibility = "visible";
        }
        getTextInput(instructions, value = "", callback) {
            this._text_input_callback = callback;
            let info = `
            <button class="close-button" onclick="document.getElementById('menu').style.visibility='hidden'">&times;</button>
            <div class="text-input-group">
                ${instructions}
                <input type="text" id="text-input" name="text-input" value="${value}">
                <button class="general-menu" data-name="submit_text_input">Submit</button>
                <button class="general-menu" data-name="cancel_text_input">Cancel</button>
            </div>
        `;
            this.menuPanel.innerHTML = info;
            this.menuPanel.style.visibility = "visible";
        }
        generalMenuClicked(name) {
            if (name === "submit_text_input") {
                const text = document.getElementById("text-input").value;
                this.menuPanel.style.visibility = "hidden";
                this.menuPanel.innerHTML = "";
                this._text_input_callback(text);
            }
            if (name === "cancel_text_input") {
                this.menuPanel.style.visibility = "hidden";
            }
        }
        pickTile(worldPos) {
            var x = worldPos.x;
            var y = worldPos.y;
            // convert from world coordinates into fractal axial coordinates
            var q = (1.0 / 3 * Math.sqrt(3) * x - 1.0 / 3 * y);
            var r = 2.0 / 3 * y;
            // now need to round the fractal axial coords into integer axial coords for the grid lookup
            var cubePos = (0, coords_1.axialToCube)(q, r);
            var roundedCubePos = (0, coords_1.roundToHex)(cubePos);
            var roundedAxialPos = (0, coords_1.cubeToAxial)(roundedCubePos.x, roundedCubePos.y, roundedCubePos.z);
            // just look up the coords in our grid
            return this._tileGrid.get(roundedAxialPos.q, roundedAxialPos.r);
        }
        getRandomTile(cityEligibile) {
            if (cityEligibile) {
                while (true) {
                    const q = (0, util_1.getRandomInt)(-1 * (this._tileGrid.width / 2) + 4, this._tileGrid.width / 2 - 4);
                    const r = (0, util_1.getRandomInt)(-1 * (this._tileGrid.width / 2) + 4, this._tileGrid.height / 2 - 4);
                    const randomTile = this._tileGrid.get(q, r);
                    if (!this.isTileCityEligbile(randomTile)) {
                        continue;
                    }
                    return randomTile;
                }
            }
            const q = (0, util_1.getRandomInt)(-1 * (this._tileGrid.width / 2), this._tileGrid.width / 2);
            const r = (0, util_1.getRandomInt)(-1 * (this._tileGrid.width / 2), this._tileGrid.height / 2);
            const randomTile = this._tileGrid.get(q, r);
            return randomTile;
        }
        isTileCityEligbile(tile) {
            if (!tile) {
                return false;
            }
            if ((0, interfaces_1.isMountain)(tile.height) || (0, interfaces_1.isWater)(tile.height)) {
                return false;
            }
            if (tile.improvement !== undefined) {
                return false;
            }
            console.log(this._gameState.playersTurn);
            if (tile.owner && (tile.owner !== this._gameState.playersTurn)) {
                return false;
            }
            // check surrounding
            const tiles = this.getTileGrid().neighbors(tile.q, tile.r, 2);
            let surroundGood = true;
            for (const t of tiles) {
                if (t === undefined) {
                    surroundGood = false;
                    break;
                }
                if (t === undefined || t.improvement !== undefined) {
                    surroundGood = false;
                    break;
                }
            }
            if (!surroundGood) {
                return false;
            }
            return true;
        }
        getClosestUnoccupiedTile(tile, type) {
            var _a;
            const owner = ((_a = tile.improvement) === null || _a === void 0 ? void 0 : _a.owner) || "";
            // Initialize the BFS queue and a visited set.
            const queue = [tile];
            const visited = new Set();
            visited.add(`${tile.q},${tile.r}`);
            // Process the queue until it's empty.
            while (queue.length > 0) {
                const current = queue.shift();
                if (current.unit === undefined &&
                    !(0, interfaces_1.isMountain)(current.height) &&
                    (current.improvement === undefined || current.improvement.owner === owner) &&
                    ((type === "land" && !(0, interfaces_1.isWater)(current.height)) ||
                        (type === "water" && (0, interfaces_1.isWater)(current.height)))) {
                    return current;
                }
                const neighbors = this.getTileGrid().neighbors(current.q, current.r, 1);
                for (const neighbor of neighbors) {
                    const key = `${neighbor.q},${neighbor.r}`;
                    if (!visited.has(key)) {
                        visited.add(key);
                        queue.push(neighbor);
                    }
                }
            }
            return undefined;
        }
        getNextMovementTile(unit, current, target) {
            // Define all possible neighbors in axial coordinates
            const neighbors = [
                { q: current.q + 1, r: current.r }, // (+1, 0)
                { q: current.q - 1, r: current.r }, // (-1, 0)
                { q: current.q, r: current.r + 1 }, // ( 0, +1)
                { q: current.q, r: current.r - 1 }, // ( 0, -1)
                { q: current.q + 1, r: current.r - 1 }, // (+1, -1)
                { q: current.q - 1, r: current.r + 1 }, // (-1, +1)
            ];
            // Find the neighbor closest to the target
            let bestNeighbor = current;
            let shortestDistance = Infinity;
            for (const neighbor of neighbors) {
                let tt = this._tileGrid.get(neighbor.q, neighbor.r);
                if (tt === undefined) {
                    continue;
                }
                if ((0, interfaces_1.isMountain)(tt.height)) {
                    continue;
                }
                if (tt.unit !== undefined && unit !== undefined && tt.unit.owner === unit.owner) {
                    // cant occupy what we already have a unit on
                    continue;
                }
                if (!unit) {
                    continue;
                }
                if (unit.land == false && !((0, interfaces_1.isWater)(tt.height) || tt.rivers)) {
                    continue;
                }
                if (unit.water == false && (0, interfaces_1.isWater)(tt.height)) {
                    continue;
                }
                const distance = getHexDistance(tt, target);
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    bestNeighbor = tt;
                }
            }
            return bestNeighbor;
        }
        calculatePath(start, target, maxSteps) {
            let path = [];
            let current = start;
            for (let i = 0; i < maxSteps; i++) {
                let next = this.getNextMovementTile(start.unit, current, target);
                if (!next || next === current)
                    break; // No progress or invalid tile
                path.push(next);
                current = next;
                if (current === target)
                    break; // Reached target
            }
            return path;
        }
        showPath(path) {
            // Clear previous path indicators.
            this._pathIndicators.clear();
            this._pathIndicators.children.forEach(child => this._pathIndicators.remove(child));
            // Build an array of world positions from the path tiles.
            const positions = [];
            path.forEach(tile => {
                const worldPos = (0, coords_1.qrToWorld)(tile.q, tile.r);
                // Use a consistent Z (here 0.02) so the path appears above the terrain.
                positions.push(new three_1.Vector3(worldPos.x, worldPos.y, 0.02));
            });
            // Create and display a thick line if we have at least two points.
            if (positions.length > 1) {
                const thickLine = new thickLine_1.ThickLine(positions, {
                    linewidth: 7,
                    color: 0x006600, // Green color.
                    resolution: new three_1.Vector2(window.innerWidth, window.innerHeight)
                });
                this._pathIndicators.add(thickLine);
            }
            // Optionally, add a step count indicator as text on the final tile.
            if (path.length > 0) {
                const lastTile = path[path.length - 1];
                const worldPos = (0, coords_1.qrToWorld)(lastTile.q, lastTile.r);
                // Create a canvas to draw the text.
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = 100;
                canvas.height = 100;
                context.font = '64px bold Trojan';
                context.fillStyle = 'white';
                context.textAlign = 'center';
                // Adjust vertical placement as needed.
                context.fillText(path.length.toString(), canvas.width / 2, canvas.height / 2 + 20);
                // Create a texture from the canvas and use it in a sprite.
                const texture = new three_1.CanvasTexture(canvas);
                const spriteMaterial = new three_1.SpriteMaterial({ map: texture, transparent: true });
                const sprite = new three_1.Sprite(spriteMaterial);
                sprite.position.set(worldPos.x, worldPos.y, 0.3); // Render above the dashed line.
                sprite.scale.set(0.5, 0.5, 1);
                this._pathIndicators.add(sprite);
            }
        }
        getYieldIconPath(yieldType) {
            switch (yieldType) {
                case 'food':
                    return '../../assets/ui/resources/population.png';
                case 'gold':
                    return '../../assets/ui/resources/gold.png';
                case 'production':
                    return '../../assets/ui/resources/production.png';
                default:
                    return '../../assets/ui/resources/gold.png';
            }
        }
        showYields(tiles) {
            this._ui_map_temp_models.clear();
            tiles.forEach(tile => {
                if (tile.clouds) {
                    return;
                }
                const worldPos = (0, coords_1.qrToWorld)(tile.q, tile.r);
                const activeYields = Object.entries(tile.yields).filter(([, amount]) => amount > 0);
                activeYields.forEach(([yieldType, amount], rowIndex) => {
                    const count = Math.min(amount, 5);
                    const iconSpacing = 0.1;
                    const totalWidth = (count - 1) * iconSpacing;
                    const initialOffsetX = -totalWidth / 2;
                    const rowSpacing = 0.4;
                    const offsetY = -rowIndex * rowSpacing;
                    for (let i = 0; i < count; i++) {
                        const imagePath = this.getYieldIconPath(yieldType);
                        const yieldMesh = (0, Units_1.CreateYieldModel)(imagePath);
                        const offsetX = initialOffsetX + i * iconSpacing;
                        yieldMesh.position.set(worldPos.x + offsetX, worldPos.y + .4 + offsetY, worldPos.z + 0.3);
                        this._ui_map_temp_models.add(yieldMesh);
                    }
                });
            });
        }
        clearYields() {
            this._ui_map_temp_models.clear();
        }
        showNextExpansion(tile) {
            const geom = new three_1.RingBufferGeometry(0.001, 1, 6, 1);
            geom.rotateZ(Math.PI / 2);
            const model = new three_1.Mesh(geom, new three_1.MeshBasicMaterial({
                color: 'blue',
                opacity: .35,
                transparent: true,
                side: three_1.FrontSide,
            }));
            const worldPos = (0, coords_1.qrToWorld)(tile.q, tile.r);
            model.position.set(worldPos.x, worldPos.y, 0.01);
            console.log(tile.q, tile.r);
            this._ui_map_expansion.add(model);
        }
        clearNextExpansion() {
            this._ui_map_expansion.clear();
        }
        displayExpansionView(tile) {
            this._ui_map_expansion.clear();
            let nextTile = tile.improvement.nextTile;
            if (nextTile) {
                this.showNextExpansion(this.getTile(nextTile.q, nextTile.r));
            }
            let expTiles = this.getEligibleTilesForExpansion(tile);
            this.showExpansionBuyClicks(expTiles, tile);
        }
        showExpansionBuyClicks(tiles, origTile) {
            tiles.forEach(tile => {
                if (tile.clouds)
                    return;
                const worldPos = (0, coords_1.qrToWorld)(tile.q, tile.r);
                const buyCost = 40;
                const buyDiv = document.createElement('div');
                buyDiv.className = 'buy-click-label';
                buyDiv.style.width = '64px';
                buyDiv.style.height = '64px';
                buyDiv.style.background = 'rgba(0,0,0,0.8)';
                buyDiv.style.display = 'flex';
                buyDiv.style.alignItems = 'center';
                buyDiv.style.justifyContent = 'center';
                buyDiv.style.fontFamily = 'Arial, sans-serif';
                buyDiv.style.fontSize = '48px';
                buyDiv.style.color = 'white';
                buyDiv.style.border = '2px solid black';
                buyDiv.style.cursor = 'pointer';
                buyDiv.style.pointerEvents = 'auto';
                buyDiv.innerText = buyCost.toString();
                buyDiv.addEventListener('click', () => {
                    console.log("Buy tile clicked:", tile, buyCost, origTile);
                    const city = origTile.city;
                    const player = this.getPlayer(this.gameState.currentPlayer);
                    if (player.gold < buyCost) {
                        this.playSound((0, util_1.asset)("sounds/ui/ui_error.mp3"));
                        return;
                    }
                    player.gold -= buyCost;
                    tile.owner = this.gameState.currentPlayer;
                    if (tile.territoryOverlay) {
                        tile.territoryOverlay.parent.remove(tile.territoryOverlay);
                    }
                    this.addTerritoryOverlay(tile, city, player);
                    this.updateBorderOverlay(player);
                    tile.city = city;
                    // decide new tile for expansion.
                    let tiles = this.getEligibleTilesForExpansion(origTile);
                    if (tiles.length > 0) {
                        origTile.improvement.nextTile = this.getBestYield(tiles, origTile);
                    }
                    this.updateResourcePanel();
                    this.displayExpansionView(origTile);
                });
                const cssObject = new CSS3DRenderer_1.CSS3DObject(buyDiv);
                cssObject.position.set(worldPos.x + 0.4, worldPos.y + 0.4, worldPos.z + 0.3);
                cssObject.scale.set(0.005, 0.005, 0.005);
                cssObject.rotateX(Math.PI / 6);
                this._ui_map_expansion.add(cssObject);
            });
        }
        getEligibleTilesForExpansion(tile) {
            const grid = this.getTileGrid();
            const tiles = grid.neighbors(tile.q, tile.r, 4);
            const eligibleTiles = tiles.filter(newTile => (!newTile.city || newTile.city === "") &&
                (!newTile.owner || newTile.owner === "") &&
                grid.neighbors(newTile.q, newTile.r, 1).some(neighbor => neighbor.city === tile.city));
            const uniqueMap = new Map();
            eligibleTiles.forEach(t => {
                const key = `${t.q},${t.r}`;
                if (!uniqueMap.has(key)) {
                    uniqueMap.set(key, t);
                }
            });
            return Array.from(uniqueMap.values());
        }
        getBestYield(tiles, referenceTile) {
            return tiles.reduce((best, tile) => {
                const bestYield = Object.values(best.yields).reduce((sum, v) => sum + v, 0);
                const tileYield = Object.values(tile.yields).reduce((sum, v) => sum + v, 0);
                if (tileYield > bestYield)
                    return tile;
                if (tileYield < bestYield)
                    return best;
                const bestDistance = getHexDistance(best, referenceTile);
                const tileDistance = getHexDistance(tile, referenceTile);
                return tileDistance < bestDistance ? tile : best;
            });
        }
        showEndTurnInActionPanel() {
            this.setActionPanel(`<div class="action-menu action-button" data-name="end_turn">End Turn</div>`);
        }
        getResourcesForPlayer(player) {
            let resources = {};
            for (const tile of this._tileGrid.toArray()) {
                if (tile.owner == player.name && tile.resource !== undefined) {
                    if (resources[tile.resource.name] === undefined) {
                        resources[tile.resource.name] = 0;
                    }
                    resources[tile.resource.name] += 1;
                }
            }
            return resources;
        }
        endTurn() {
            // clear notifications
            const currentPlayerIndex = this._gameState.playerOrder.indexOf(this._gameState.playersTurn);
            if (this._gameState.playerOrder[currentPlayerIndex] === this._gameState.currentPlayer) {
                // end of players turn
                // clear notifications
                const allToasts = document.getElementsByClassName("toastify");
                while (allToasts.length > 0) {
                    allToasts[0].parentNode.removeChild(allToasts[0]);
                }
            }
            // determine next player
            const nextIndex = (currentPlayerIndex + 1) % (this._gameState.playerOrder.length);
            this._gameState.playersTurn = this._gameState.playerOrder[nextIndex];
            if (nextIndex === 0) {
                this._gameState.turn += 1;
            }
            const player = this._gameState.players[this._gameState.playersTurn];
            const nation = Nations_1.Nations[player.nation];
            if (this._gameState.playersTurn === this._gameState.currentPlayer) {
                this.showEndTurnInActionPanel();
            }
            else {
                this.setActionPanel(`<div class="action-button-disabled">Waiting for ${player.name}..<div>`);
            }
            // calculate new resources for player
            for (const [key, improvement] of Object.entries(player.improvements)) {
                // population
                (0, Units_1.updatePopulationAndProductionRates)(player, improvement);
                const previousPopulation = Math.floor(improvement.population);
                improvement.population += improvement.population_rate;
                const newPopulation = Math.floor(improvement.population);
                const img = `<img src="${nation.flag_image}" style="padding-right:10px;" width="30px" height="25px"/>`;
                const label = `<span class="city-label" data-target="${improvement.id}">${img} ${improvement.name} (${newPopulation})</span>`;
                (0, Units_1.updateLabel)(improvement.id, label);
                // if poplation increased; expand city borders;
                if (newPopulation > previousPopulation) {
                    let tiles = this.getTileGrid().neighbors(improvement.tileInfo.q, improvement.tileInfo.r, 2);
                    let cityTile = this.getTile(improvement.tileInfo.q, improvement.tileInfo.r);
                    if (improvement.nextTile) {
                        let tile = this.getTile(improvement.nextTile.q, improvement.nextTile.r);
                        tile.owner = improvement.owner;
                        if (tile.territoryOverlay) {
                            tile.territoryOverlay.parent.remove(tile.territoryOverlay);
                        }
                        this.addTerritoryOverlay(tile, key, player);
                        this.updateBorderOverlay(player);
                        tile.city = improvement.id;
                        if (this._gameState.playersTurn === this._gameState.currentPlayer) {
                            this.toast({
                                icon: "../../assets/map/icons/star.png",
                                text: `${improvement.name} has grown.`,
                                onClick: function () { }
                            });
                        }
                    }
                    // decide new tile for expansion.
                    tiles = this.getEligibleTilesForExpansion(cityTile);
                    if (tiles.length > 0) {
                        cityTile.improvement.nextTile = this.getBestYield(tiles, cityTile);
                    }
                }
                // gold
                player.gold += Math.round(improvement.population * player.taxRate * 10) * 100;
            }
            let resources = this.getResourcesForPlayer(player);
            for (const [key, number] of Object.entries(resources)) {
                player.gold += Units_1.ResourceMap[key].gold;
            }
            // calculate research for player 
            player.research.progress += 100;
            if (player.research.progress >= 100 && player.research.current !== "") {
                player.research.progress -= 100;
                player.research.researched[player.research.current] = true;
                if (this._gameState.playersTurn === this._gameState.currentPlayer) {
                    const tech = Research_1.Technologies.get(player.research.current);
                    const mm = this;
                    this.toast({
                        icon: "../../assets/map/icons/star.png",
                        text: `${tech.name} research complete!`,
                        onClick: function () {
                            mm.pickResearch();
                        }
                    });
                    (0, Research_1.DisplayResearchFinished)(tech);
                    if (tech.quote_audio) {
                        this.playSound((0, util_1.asset)(tech.quote_audio));
                    }
                    player.research.current = "";
                }
                else {
                    let tech = (0, Research_1.AIChooseResearch)();
                    if (tech !== undefined) {
                        player.research.current = tech.id;
                    }
                }
                // TODO AI pick next tech
            }
            // refresh units movement / health if in city/terittories (todo)
            for (const [key, unit] of Object.entries(player.units)) {
                unit.movement = unit.movement_max;
                // unit.health = unit.health_max;
            }
            // Add selectors for units that have movement
            if (this._gameState.playersTurn === this._gameState.currentPlayer) {
                for (const [key, unit] of Object.entries(player.units)) {
                    if (unit.movement > 0) {
                        const tile = this._tileGrid.get(unit.tileInfo.q, unit.tileInfo.r);
                        const worldPos = (0, coords_1.qrToWorld)(tile.q, tile.r);
                        const ps = new Selector_1.default();
                        ps.mesh.position.set(0, 0, 0.012);
                        unit.selector = ps;
                        unit.model.add(ps.mesh);
                    }
                }
            }
            this.updateResourcePanel();
            this.updateGameStatePanel();
            this.updateUnitInfoForTile(this.selectedTile);
            if (this._gameState.playersTurn !== this._gameState.currentPlayer) {
                (0, AI_1.takeTurn)(this, player);
            }
        }
        updateResourcePanel() {
            if (this.resourcePanel == null) {
                return;
            }
            const player = this._gameState.players[this._gameState.currentPlayer];
            // const units = Object.keys(player.units).length;
            // const cities = Object.keys(player.improvements).length;
            let population = 0;
            let populationPerTurn = 0;
            let goldPerTurn = 0;
            let resources = this.getResourcesForPlayer(player);
            let resourcesString = "";
            for (const [key, number] of Object.entries(resources)) {
                resourcesString += ` <img src="../../assets/map/resources/${key}.png" style="padding-left: 5px; padding-right: 5px; width: 25px; height: 25px;"/> ${number} `;
                goldPerTurn += Units_1.ResourceMap[key].gold;
            }
            for (const [key, improvement] of Object.entries(player.improvements)) {
                population += Math.floor(improvement.population);
                populationPerTurn += improvement.population_rate;
                goldPerTurn += improvement.population * player.taxRate * 10;
            }
            goldPerTurn = Math.round(goldPerTurn);
            let taxRate = (player.taxRate * 100).toFixed(0) + '%';
            let gold_icon = `<img src="../../assets/ui/resources/gold.png" style="padding-right: 5px; width: 25px; height: 25px;"/>`;
            let pop_icon = `<img src="../../assets/ui/resources/population.png" style="padding-left: 15px; padding-right: 5px; width: 25px; height: 25px;"/>`;
            let taxes_icon = `<img src="../../assets/ui/resources/taxes.png" style="padding-left: 15px; padding-right: 5px; width: 25px; height: 25px;"/>`;
            let research_icon = `<img src="../../assets/ui/resources/research.png" style="padding-left: 15px; padding-right: 5px; width: 25px; height: 25px;"/>`;
            let research_amount = `<div class="loading-bar"><div class="loading-text">0%</div></div>`;
            let research_percentage = `${player.research.progress}%`;
            let tech_name = '';
            if (Research_1.Technologies.has(player.research.current)) {
                let tech = Research_1.Technologies.get(player.research.current);
                tech_name = tech.name;
                research_amount = "(+5) (2 turns)";
                research_percentage = `${player.research.progress}%`;
            }
            else {
                tech_name = "Pick a technology to research";
                research_amount = "";
                research_percentage = '';
            }
            research_percentage = '25%';
            let research = `<span class="research highlight-hover">
          <div id="progressBarContainer">
            <div style="width: ${research_percentage};" class="progressBar research" id="progressBar"></div>
            <div class="progressText research" id="progressText">${tech_name}  ${research_percentage}</div>
        </div></span> `;
            let government = Governments_1.GovernmentsMap[player.government];
            let taxes = `${taxes_icon}<span class="taxes highlight-hover">${government.name}</span>`;
            let info = `${gold_icon} ${player.gold} (+${goldPerTurn}) ${pop_icon} ${population} (+${populationPerTurn}) ${research_icon} ${research}  ${taxes} ${resourcesString}`;
            this.resourcePanel.innerHTML = info;
        }
        updateUnitInfoForTile(tile) {
            this.clearYields();
            this.clearNextExpansion();
            if (this.unitInfoPanel == null) {
                return;
            }
            if (tile.unit === undefined && tile.improvement === undefined) {
                this.unitInfoPanel.innerHTML = "";
                this.unitInfoCache = "";
                this.unitInfoIndex = "0";
                return;
            }
            let shouldShowUnit = true;
            if (tile.improvement) {
                if (this.unitInfoIndex === "0") {
                    shouldShowUnit = false;
                }
            }
            if (tile.unit && shouldShowUnit) {
                let menu = ``;
                if (tile.unit.type === "settler") {
                    // validate placement location
                    if (!this.isTileCityEligbile(tile)) {
                        menu = `<tr><td><button disabled class="city-menu" data-name="settler_place_city">Start City</button></td><td></td></tr>`;
                    }
                    else {
                        // this.setActionPanel(`<div class="action-menu city-menu action-button" data-name="settler_place_city">Start City</div>`);
                        menu = `<tr><td><button class="city-menu" data-name="settler_place_city">Start City</button></td><td></td></tr>`;
                    }
                }
                let info = `<div>
                        <div style="text-align: left;" class="bold">${tile.unit.name}</div>
                        <div style="display: flex; align-items: left;">
                            <img src="${tile.unit.image}" alt="${tile.unit.type}" width="200px" height="200px">
                                <table style="margin-right: 10px; text-align: left;">
                                    <tr>${menu}</tr>
                                    <tr>
                                        <th>Health</th>
                                        <td>${tile.unit.health}/${tile.unit.health_max}</td>
                                    </tr>
                                    <tr>
                                        <th>Move</th>
                                        <td>${tile.unit.movement}/${tile.unit.movement_max}</td>
                                    </tr>
                                    <th>Attack</th>
                                        <td>${tile.unit.attack}</td>
                                    </tr>
                                    <th>Defence</th>
                                        <td>${tile.unit.defence}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>`;
                this.unitInfoIndex = "0";
                if (this.unitInfoCache != info) {
                    this.unitInfoCache = info;
                    this.unitInfoPanel.innerHTML = info;
                }
                return;
            }
            if (tile.improvement) {
                // friendly city
                let menu = ``;
                if (tile.improvement.owner === this.gameState.currentPlayer) {
                    let neighborhood = this.getTileGrid().neighbors(tile.q, tile.r, 5);
                    this.showYields(neighborhood);
                    this.displayExpansionView(tile);
                    // player owns city
                    menu = `<tr><td><button class="city-menu" data-name="show_city_menu">City Menu</button></td><td></td></tr>`;
                }
                let info = `<div>
                <div style="text-align: left;" class="bold">${tile.improvement.name}</div>
                <div style="display: flex; align-items: left;">
                    <img src="${tile.improvement.image}" alt="${tile.improvement.type}" width="200px" height="200px">
                        <table style="margin-right: 10px; text-align: left;">
                            ${menu}
                            <tr><td>Population</td><td>${tile.improvement.population} (+${tile.improvement.population_rate})</td></tr>
                            <tr><td>Production</td><td>${tile.improvement.production_rate}</td></tr>
                            <tr><td>Health</td><td>${tile.improvement.health}/${tile.improvement.health_max}</td></tr>
                            <tr><td>Defence</td><td>${tile.improvement.defence}</td></tr>
                        </table>
                    </div>
                </div>`;
                this.unitInfoIndex = "";
                if (this.unitInfoCache != info) {
                    this.unitInfoCache = info;
                    this.unitInfoPanel.innerHTML = info;
                }
                return;
            }
        }
        updateGameStatePanel() {
            if (this.gameStatePanel == null) {
                return;
            }
            let info = ``;
            for (const [key, player] of Object.entries(this._gameState.players)) {
                // const units = Object.keys(player.units).length;
                // const cities = Object.keys(player.improvements).length;
                const nation = Nations_1.Nations[player.nation];
                let style = "";
                if (player.name === this._gameState.playersTurn) {
                    style = `game-info-turn`;
                }
                info += `<img src="${nation.flag_image}" alt="${nation.leader}" style="padding-right:3px; padding-left:15px;" width="30px" height="25px">`;
                if (player.isDefeated) {
                    info += `<s>${player.name}</s>`;
                }
                else if (key === this._gameState.currentPlayer) {
                    info += `<span class="${style}" data-name="${player.name}"">${player.name}</span>`;
                }
                else {
                    info += `<span class="player-negotiation highlight-hover ${style}" data-name="${player.name}" style="${style}">${nation.leader}</span>`;
                }
            }
            info += `<span style="padding-left: 15px;"> TURN: ${this._gameState.turn}</span>`;
            info += `<span class="main-menu" style="padding-left: 15px;">MENU</span>`;
            this.gameStatePanel.innerHTML = info;
        }
        setActionPanel(action) {
            if (this.actionPanel == null) {
                return;
            }
            this.actionPanel.innerHTML = action;
        }
        actionPanelClicked(dataName) {
            if (this._gameState.playersTurn !== this._gameState.currentPlayer) {
                return;
            }
            if (dataName === "end_turn") {
                this.endTurn();
                // remove all selectors
                const player = this._gameState.players[this._gameState.currentPlayer];
                for (const [key, unit] of Object.entries(player.units)) {
                    unit.movement = 0;
                    if (unit.selector) {
                        unit.selector.dispose();
                        unit.selector = undefined;
                    }
                }
                return;
            }
            console.log("no interaction for action panel");
        }
        playerNegotiation(playerName) {
            const player1 = this._gameState.players[this._gameState.currentPlayer];
            const player2 = this._gameState.players[playerName];
            const player2nation = Nations_1.Nations[player2.nation];
            let info = `
            <button class="close-button" onclick="document.getElementById('menu').style.visibility='hidden'">&times;</button>
            <div style="text-align: center;">
                <img id="menu-leader-img" src="${player2nation.leader_images["default"][0]}" alt="${player2.name}">
            </div>
            <div class="leader-name" style="display: flex; text-align: center;">
                <img src="${player2nation.flag_image}">
                ${player2nation.leader}
            </div>

            <div id="leader-text">
                <p>"What do you want to discuss?"</p>
            </div>
            <div class="options">
        `;
            if (player1.diplomatic_actions[player2.name].hasOwnProperty("war")) {
                // at war
                info += `<button class="player-diplomatic-menu" data-name="declare_peace" data-target="${player2.name}">Ask for Peace</button>`;
            }
            else {
                // at peace
                info += `<button class="player-diplomatic-menu" data-name="trade" data-target="${player2.name}">Trade</button>`;
                info += `<button class="player-diplomatic-menu" data-name="form_aliance" data-target="${player2.name}">Form Alliance</button>`;
                info += `<button class="player-diplomatic-menu" data-name="declare_war" data-target="${player2.name}">Declare War</button>`;
            }
            info += `</div>`;
            this.showLeaderMenu(info);
        }
        showLeaderMenu(info) {
            if (this.menuPanel == null) {
                return;
            }
            this.menuPanel.innerHTML = info;
            this.menuPanel.style.visibility = "visible";
        }
        showCityMenu(tile) {
            // let info = `<div>
            // <div style="text-align: left;" class="bold">${tile.improvement.name}</div>
            // <div style="display: flex; align-items: left;">
            //     <img src="${tile.improvement.image}" alt="${tile.improvement.type}" width="200px" height="200px">
            //         <table style="margin-right: 10px; text-align: left;">
            //             <tr><td>Population</td><td>${tile.improvement.population} (+${tile.improvement.population_rate})</td></tr>
            //             <tr><td>Production</td><td>${tile.improvement.production_rate}</td></tr>
            //             <tr><td>Health</td><td>${tile.improvement.health}/${tile.improvement.health_max}</td></tr>
            //             <tr><td>Defence</td><td>${tile.improvement.defence}</td></tr>
            //         </table>
            //     </div>
            // </div>`;
            let options = [
                ["buy_land", "Buy Land", 40, "city.png"],
                ["buy_settler", "Settler", 100, "settler.png"],
                ["buy_rifleman", "Rifleman", 100, "rifleman.png"],
                ["buy_calvary", "Cavalry", 200, "cavalry.png"],
                ["buy_artillary", "Artillary", 300, "artillary.png"],
            ];
            let player = this.getPlayer(tile.improvement.owner);
            // console.log(player.research.researched);
            if ("infantry" in player.research.researched) {
                options.push(["buy_infantry", "Infantry", 400, "rifleman.png"]);
            }
            if ("warships" in player.research.researched) {
                options.push(["buy_warship", "Warship", 500, "warship.png"]);
            }
            if ("tank" in player.research.researched) {
                options.push(["buy_tank", "Tank", 500, "tank.png"]);
            }
            if ("destroyer" in player.research.researched) {
                options.push(["buy_destroyer", "Destroyer", 500, "destroyer.png"]);
            }
            if ("gunship" in player.research.researched) {
                options.push(["buy_gunshp", "Gunship", 500, "gunship.png"]);
            }
            if ("nukes" in player.research.researched) {
                options.push(["buy_nuke", "Nuke", 1000, "nuke.png"]);
            }
            let option_info = "";
            for (const [name, label, cost, image] of options) {
                option_info += `<button class="city-menu" data-name="${name}"><img id="menu-unit-img" src="../../assets/ui/units/${image}">${cost}<img id="menu-unit-cost" src="../../assets/ui/resources/gold.png">${label}</button>`;
            }
            let info = `
            <button class="close-button" onclick="document.getElementById('menu').style.visibility='hidden'">&times;</button>
            <div style="text-align: center;">
                ${tile.improvement.name}</br>
                <img id="menu-leader-img" src="${tile.improvement.image}" alt="${tile.improvement.name}">
            </div>
            <div class="options">
                ${option_info}
                </div>
        `;
            this.menuPanel.innerHTML = info;
            this.menuPanel.style.visibility = "visible";
        }
        mainMenu() {
            let options = [
                ["save_game", "Save Game"],
                ["load_game", "Load Latest Saved Game"],
            ];
            let options2 = [
                ["main_menu", "Exit to Main Menu"],
                ["exit_desktop", "Exit to Desktop"],
            ];
            let option_info = "";
            for (const [name, label] of options) {
                option_info += `<button class="main-menu-option" data-name="${name}">${label}</button>`;
            }
            for (const [name, label] of options2) {
                option_info += `<button class="main-menu-option" data-name="${name}">${label}</button>`;
            }
            let info = `
            <h3 class="title">Menu</h3>
            <button class="close-button" onclick="document.getElementById('menu').style.visibility='hidden'">&times;</button>
            <div class="options">
                ${option_info}
                </div>
        `;
            this.menuPanel.innerHTML = info;
            this.menuPanel.style.visibility = "visible";
        }
        mainMenuOption(name) {
            return __awaiter(this, void 0, void 0, function* () {
                if (name === "main_menu") {
                    window.location.href = './main_menu.html';
                }
                if (name === "exit_desktop") {
                    window.close();
                }
                if (name === "load_game") {
                    let savedGames = JSON.parse(localStorage.getItem('saved_games') || '[]');
                    let save_id = `saved_game_${savedGames[savedGames.length - 1].name}`;
                    localStorage.setItem('load_game', save_id);
                    location.reload(); // TODO (give choice of saved games)
                }
                if (name === "save_game") {
                    this.menuPanel.innerHTML = "Saving..";
                    const sg = this.getSaveGame();
                    const currentDate = new Date().toISOString(); // Get current date in ISO format
                    console.log('Game saved on:', currentDate);
                    // console.log(sg);
                    let savedGames = JSON.parse(localStorage.getItem('saved_games') || '[]');
                    let name = `${currentDate}`;
                    savedGames.push({
                        name: name,
                        id: `saved_game_${name}`
                    });
                    localStorage.setItem(`saved_game_${name}`, JSON.stringify(sg));
                    console.log(savedGames);
                    while (savedGames.length > 10) {
                        let sg_name = savedGames.shift();
                        localStorage.removeItem(sg_name.id);
                    }
                    localStorage.setItem('saved_games', JSON.stringify(savedGames));
                    this.toast({
                        icon: "../../assets/map/icons/star.png",
                        text: `Game saved!`,
                        onClick: function () { }
                    });
                    this.menuPanel.style.visibility = "hidden";
                }
            });
        }
        checkForClearanceToAttack(player1, player2) {
            const nation = Nations_1.Nations[player2.nation];
            if (player1.diplomatic_actions[player2.name].hasOwnProperty("war")) {
                return true;
            }
            if (player1.name !== this._gameState.currentPlayer) {
                return false;
            }
            let info = `
            <button class="close-button" onclick="document.getElementById('menu').style.visibility='hidden'">&times;</button>
            <div style="text-align: center;">
                <img id="menu-leader-img" src="${nation.leader_images["default"][0]}" alt="${player2.name}">
            </div>
            <div id="leader-text">
                <p>${player2.name} "Declare War on ${player2.name}?"</p>
            </div>
            <div class="options">
                <button class="player-diplomatic-menu" data-name="declare_war" data-target="${player2.name}">Declare War</button>
            </div>
        `;
            this.showLeaderMenu(info);
            return false;
        }
        cityMenuAction(name, target) {
            const tile = this.selectedTile;
            const player = this.getPlayer(this._gameState.currentPlayer);
            if (name === "show_city_menu") {
                this.showCityMenu(tile);
            }
            if (name === "increase_taxes") {
                if (player.taxRate + .1 > 1) {
                    return;
                }
                player.taxRate += 0.1;
                for (const [key, improvement] of Object.entries(player.improvements)) {
                    (0, Units_1.updatePopulationAndProductionRates)(player, improvement);
                }
            }
            if (name === "decrease_taxes") {
                if (player.taxRate - 0.1 < 0) {
                    return;
                }
                player.taxRate -= 0.1;
                for (const [key, improvement] of Object.entries(player.improvements)) {
                    (0, Units_1.updatePopulationAndProductionRates)(player, improvement);
                }
            }
            if (name === "change_government") {
                player.government = target;
                this.toast({
                    icon: "../../assets/map/icons/star.png",
                    text: `${player.name} government changed to ${Governments_1.GovernmentsMap[target].name}`,
                    onClick: function () { }
                });
                this.menuPanel.style.visibility = "hidden";
            }
            if (name === "settler_place_city") {
                let tile = this.selectedTile;
                // start city
                let defaultName = (0, Units_1.getNextCityName)(player);
                this.getTextInput(`<h3>City Name</h3>`, defaultName, (name) => {
                    let player = this.getPlayer(this.gameState.currentPlayer);
                    let city = (0, Units_2.CreateCity)(player, name);
                    this.addImprovementToMap(city, tile);
                    // remove settler
                    while (tile.unit.model.children.length > 0) {
                        tile.unit.model.remove(tile.unit.model.children[0]);
                    }
                    tile.unit.model.parent.remove(tile.unit.model);
                    tile.unit = undefined;
                    // update stats
                    this.showEndTurnInActionPanel();
                    this.updateUnitInfoForTile(tile);
                });
            }
            let unit_type = "";
            let unit_terrain = "land";
            if (name === "buy_settler") {
                unit_type = "settler";
            }
            if (name === "buy_rifleman") {
                unit_type = "rifleman";
            }
            if (name === "buy_infrantry") {
                unit_type = "infantry";
            }
            if (name === "buy_calvary") {
                unit_type = "cavalry";
            }
            if (name === "buy_tank") {
                unit_type = "tank";
            }
            if (name === "buy_artillary") {
                unit_type = "artillary";
            }
            if (name === "buy_gunship") {
                unit_type = "gunship";
            }
            if (name === "buy_warship") {
                unit_type = "boat";
                unit_terrain = "water";
            }
            if (name === "buy_destroyer") {
                unit_type = "destroyer";
                unit_terrain = "water";
            }
            if (name === "buy_nuke") {
                unit_type = "missile";
            }
            if (unit_type !== "") {
                const mm = Units_2.UnitMap[unit_type];
                let unit = mm.create(player);
                player.gold -= mm.cost;
                this.addUnitToMap(unit, this.getClosestUnoccupiedTile(tile, unit_terrain));
            }
            this.updateResourcePanel();
            this.updateGameStatePanel();
            this.updateUnitInfoForTile(tile);
            // 
        }
        playerDiplmaticAction(name, target) {
            const player = this._gameState.players[this._gameState.currentPlayer];
            console.log("target", target);
            const targetPlayer = this._gameState.players[target];
            if (name === "declare_war") {
                (0, GameState_1.DeclareWarBetweenPlayers)(this._gameState, player, targetPlayer);
                this.toast({
                    icon: "../../assets/map/icons/star.png",
                    text: `War between ${player.name} and ${targetPlayer.name} declared!`,
                    onClick: function () { }
                });
                this.menuPanel.style.visibility = "hidden";
                console.log(this._gameState);
                return;
            }
            if (name === "declare_peace") {
                (0, GameState_1.DeclarePeaceBetweenPlayers)(this._gameState, player, targetPlayer);
                this.menuPanel.style.visibility = "hidden";
                return;
            }
        }
        checkVictoryConditions() {
            // check if current player lost
            const currentPlayer = this._gameState.players[this._gameState.currentPlayer];
            console.log(currentPlayer.improvements);
            if (Object.keys(currentPlayer.improvements).length === 0) {
                console.log("Lost!");
                this.menuPanel.innerHTML = `<h1 class="text-info">Defeat!</h1>`;
                this.menuPanel.style.visibility = "visible";
                return;
            }
            for (const [key, player] of Object.entries(this._gameState.players)) {
                if (player.isDefeated === false && Object.keys(player.improvements).length === 0) {
                    player.isDefeated = true;
                    const index = this.gameState.playerOrder.indexOf(player.name);
                    if (index > -1) {
                        this.gameState.playerOrder.splice(index, 1);
                    }
                    // TODO remove all units
                    const mm = this;
                    this.toast({
                        icon: "../../assets/map/icons/star.png",
                        text: `${player.name} has been defeated!`,
                        onClick: function () { }
                    });
                    this.updateGameStatePanel();
                }
            }
            for (const [key, player] of Object.entries(this._gameState.players)) {
                if (player.isDefeated === false && player.name !== this._gameState.currentPlayer) {
                    return;
                }
            }
            console.log("Winner!");
            this.menuPanel.innerHTML = `<h1 class="text-info">Victory!</h1>`;
            this.menuPanel.style.visibility = "visible";
        }
        playSound(name, position) {
            const sound = new three_1.Audio(this._listener);
            const audioLoader = new three_1.AudioLoader();
            if (position !== undefined) {
                sound.position.copy(position);
            }
            audioLoader.load(name, function (buffer) {
                sound.setBuffer(buffer);
                // sound.setLoop(false); 
                sound.setVolume(0.5);
                sound.play();
            });
        }
    }
    MapView.DEFAULT_ZOOM = 25;
    exports.default = MapView;
    // Calculate the distance between two hexes (Manhattan distance in axial coordinates)
    function getHexDistance(a, b) {
        return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
    }
    // Tween Function
    function animateToPosition(object, targetX, targetY, duration, easing, onComplete) {
        const startX = object.position.x;
        const startY = object.position.y;
        const startTime = performance.now();
        function animate() {
            const currentTime = performance.now();
            const elapsed = (currentTime - startTime) / 1000; // Convert to seconds
            const t = Math.min(elapsed / duration, 1); // Normalize time to range [0, 1]
            const easedT = easing(t);
            // Interpolate x and y positions
            object.position.x = startX + (targetX - startX) * easedT;
            object.position.y = startY + (targetY - startY) * easedT;
            // Continue the animation if not complete
            if (t < 1) {
                requestAnimationFrame(animate);
            }
            else {
                if (onComplete) {
                    onComplete();
                }
            }
        }
        animate();
    }
    function animateFall(object, targetX, targetY, duration, easing, onComplete) {
        const peakZ = object.position.z + .3; // Peak height in Z-axis
        const startTime = performance.now();
        const startRotation = object.rotation.x;
        const startX = object.position.x;
        const startY = object.position.y;
        const startZ = object.position.z;
        function animate() {
            const currentTime = performance.now();
            const elapsed = (currentTime - startTime) / 1000; // Convert to seconds
            const t = Math.min(elapsed / duration, 1); // Normalize time to range [0, 1]
            const easedT = easing(t);
            // Parabolic motion for Z-axis
            const z = startZ + (peakZ - startZ) * (1 - Math.pow(2 * t - 1, 2));
            // object.rotation.x = startRotation + (Math.PI / 2) * easedT;
            object.position.x = startX + (targetX - startX) * easedT;
            object.position.y = startY + (targetY - startY) * easedT;
            object.position.z = z;
            if (t < 1) {
                requestAnimationFrame(animate);
            }
            else {
                if (onComplete) {
                    onComplete();
                }
            }
        }
        animate();
    }
    function easeOutQuad(t) {
        return t * (2 - t);
    }
});
//# sourceMappingURL=MapView.js.map