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
define(["require", "exports", "three", "./map/MapMesh", "./interfaces", "./util", "./map/Grid", "./map/DefaultTileSelector", "./map/DefaultTileHoverSelector", "./Units", "./DefaultMapViewController", "./map/coords", "./ParticleSystemEffects", "./ParticleSystem", "./Units", "./GameState", "./CSS3DRenderer", "./AI", "./third/toastify", "./Nations", "./Research", "./Selector", "./third/postprocessing.esm", "./third/stats", "./map/hexagon", "./third/thickLine", "./Governments", "./PlayerNegotiations", "./CityImprovements", "./ImprovementsWorker"], function (require, exports, three_1, MapMesh_1, interfaces_1, util_1, Grid_1, DefaultTileSelector_1, DefaultTileHoverSelector_1, Units_1, DefaultMapViewController_1, coords_1, ParticleSystemEffects_1, ParticleSystem_1, Units_2, GameState_1, CSS3DRenderer_1, AI_1, toastify_1, Nations_1, Research_1, Selector_1, postprocessing_esm_1, Stats, hexagon_1, thickLine_1, Governments_1, PlayerNegotiations_1, CityImprovements_1, ImprovementsWorker_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CloseMenu = CloseMenu;
    MapMesh_1 = __importDefault(MapMesh_1);
    Grid_1 = __importDefault(Grid_1);
    DefaultTileSelector_1 = __importDefault(DefaultTileSelector_1);
    DefaultMapViewController_1 = __importDefault(DefaultMapViewController_1);
    toastify_1 = __importDefault(toastify_1);
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
            this.settings = {};
            this._units_models = new three_1.Group();
            this._movement_overlay = new three_1.Group();
            this._ui_map_expansion = new three_1.Group();
            this._ui_map_temp_models = new three_1.Group();
            this.in_city_menu = false;
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
            this._renderMinimap = true;
            this.scrollSpeed = 10;
            this.animate = (timestamp) => {
                this.stats.begin();
                const dtS = (timestamp - this._lastTimestamp) / 1000.0;
                const camera = this._camera;
                const zoomRelative = camera.position.z / MapView.DEFAULT_ZOOM;
                const scrollOffset = this._scrollDir.clone().normalize().multiplyScalar(this.scrollSpeed * zoomRelative * dtS);
                // if (this._chunkedMesh) {
                //     this._chunkedMesh.updateVisibility(camera)
                //     // this._chunkedMesh.updateVisibility(this._minimap_camera)
                // }
                // this._minimap_camera.position.y = 4;
                const targetPosition = camera.position.clone().add(scrollOffset);
                // Smoothly interpolate toward the target position.
                // Adjust the lerp factor (e.g. 0.1) to control how "smooth" or "snappy" the movement feels.
                camera.position.lerp(targetPosition, 0.3);
                this._minimap_camera.position.z = this._tileGrid.width * 2.05;
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
                this._labelRenderer.render(this._scene, camera);
                if (this._renderMinimap) {
                    // if (timestamp - this._lastMinimapUpdate > 250) {
                    this._minimap_renderer.render(this._scene, this._minimap_camera);
                    this._lastMinimapUpdate = timestamp;
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
            this._scene.add(this._movement_overlay);
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
                // const mesh = this._mapMesh = this._chunkedMesh = new ChunkedLazyMapMesh(tiles, options)
                // this._scene.add(this._mapMesh)
                // mesh.loaded.then(() => {
                //     if (this._onLoaded) this._onLoaded()
                // })
                // console.info("using ChunkedLazyMapMesh with " + mesh.numChunks + " chunks for " + (tiles.width * tiles.height) + " tiles")
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
            this.updateAllVisilibility();
            for (let player of Object.values(this._gameState.players)) {
                this.updateBorderOverlay(player);
            }
        }
        updateAllVisilibility() {
            let tiles = this.getTileGrid().toArray();
            for (const tile of tiles) {
                if (tile.clouds) {
                    continue;
                }
                ;
                if (tile.fog == true) {
                    if (tile.unit !== undefined) {
                        tile.unit.model.visible = false;
                    }
                }
                if (tile.fog == false) {
                    if (tile.unit !== undefined) {
                        tile.unit.model.visible = true;
                    }
                    if (tile.improvement !== undefined) {
                        tile.improvement.model.visible = true;
                    }
                    if (tile.worker_improvement !== undefined) {
                        tile.worker_improvement.model.visible = true;
                    }
                }
                if (tile.territoryOverlay !== undefined) {
                    tile.territoryOverlay.visible = true;
                }
                if (tile.improvementOverlay !== undefined) {
                    tile.improvementOverlay.visible = true;
                }
                if (tile.resource !== undefined && tile.resource.model !== undefined) {
                    tile.resource.model.visible = true;
                }
            }
            this._renderMinimap = true;
        }
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
            overlayCity.position.set(worldPos.x, worldPos.y - .4, 0.3);
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
                    let t = this.getBestYield(tiles, tile)[0];
                    improvement.nextTile = { q: t.q, r: t.r };
                }
            }
            this.updateCityLabel(tile);
            // check for cuttoff tiles
            this.checkForCutOffTiles(tile);
            this.updateResourcePanel();
            this.updateGameStatePanel();
        }
        addWorkerImprovementToMap(workerImprovement, tile, fromSaved = false) {
            const worldPos = (0, coords_1.qrToWorld)(tile.q, tile.r);
            workerImprovement.model.position.set(worldPos.x, worldPos.y, .3);
            workerImprovement.tileInfo = { q: tile.q, r: tile.r };
            tile.worker_improvement = workerImprovement;
            this._units_models.add(workerImprovement.model);
            if (!tile.clouds) {
                workerImprovement.model.visible = true;
            }
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
            t.territoryOverlay.position.set(tworldPos.x, tworldPos.y, 0.001);
            // this.updateTiles([t]);
        }
        addTerritoryOverlayFilterById(t, city_id, player) {
            const tiles = this.getTileGrid().neighbors(t.q, t.r, 4);
            const isCurrentPlayer = player.name === this._gameState.currentPlayer;
            for (const t of tiles) {
                if (t.city && t.city == city_id) {
                    t.owner = player.name;
                    this.addTerritoryOverlay(t, city_id, player);
                    if (t.clouds && isCurrentPlayer) {
                        t.clouds = false;
                    }
                }
            }
            this.updateBorderOverlay(player);
        }
        updateBorderOverlay(player) {
            const ownedTiles = this._tileGrid.toArray().filter(t => t.owner === player.name);
            this.updateTerritoryBorderOverlay(ownedTiles, player);
        }
        updateAllTerritoryOverlays() {
            for (const player of Object.values(this._gameState.players)) {
                const ownedTiles = this._tileGrid.toArray().filter(t => t.owner === player.name);
                for (const t of ownedTiles) {
                    if (!t.territoryOverlay) {
                        t.territoryOverlay = (0, Units_1.createTerritoryOverlayModel)(player);
                        this._units_models.add(t.territoryOverlay);
                        const tworldPos = (0, coords_1.qrToWorld)(t.q, t.r);
                        t.territoryOverlay.position.set(tworldPos.x, tworldPos.y, 0.001);
                    }
                }
            }
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
            // Scale factor to move border lines inward (e.g., 0.95 = 5% inward)
            const scaleFactor = 0.99;
            for (const tile of ownedTiles) {
                if (tile.clouds)
                    continue;
                const center = (0, coords_1.qrToWorld)(tile.q, tile.r);
                const hexPoints = (0, hexagon_1.getHexPoints)(center.x, center.y, 1);
                for (let i = 0; i < 6; i++) {
                    const offset = neighborOffsets[i];
                    const neighbor = this.getTile(tile.q + offset.dq, tile.r + offset.dr);
                    if (!neighbor || neighbor.owner !== player.name) {
                        const originalP1 = hexPoints[i];
                        const originalP2 = hexPoints[(i + 1) % 6];
                        // Calculate points scaled towards the center
                        const innerP1 = {
                            x: center.x + (originalP1.x - center.x) * scaleFactor,
                            y: center.y + (originalP1.y - center.y) * scaleFactor
                        };
                        const innerP2 = {
                            x: center.x + (originalP2.x - center.x) * scaleFactor,
                            y: center.y + (originalP2.y - center.y) * scaleFactor
                        };
                        // Create an individual line for each border segment using inner points
                        borderLines.push([
                            new three_1.Vector3(innerP1.x, innerP1.y, 0.01),
                            new three_1.Vector3(innerP2.x, innerP2.y, 0.01)
                        ]);
                    }
                }
            }
            // Merge adjacent border segments into continuous paths
            const mergedPaths = this.mergeBorderLines(borderLines);
            // Create a separate ThickLine object for each continuous border path
            const allBorders = new three_1.Group();
            mergedPaths.forEach(path => {
                const thickLine = new thickLine_1.ThickLine(path, {
                    linewidth: 3,
                    color: player.color,
                    resolution: new three_1.Vector2(window.innerWidth, window.innerHeight)
                });
                allBorders.add(thickLine);
            });
            allBorders.layers.enable(10);
            this.borders[player.name] = allBorders;
            this._units_models.add(allBorders);
        }
        addUnitMovementBorder(unit) {
            // array ot get tiles unit can move to.
            if (unit.movement === 0) {
                return;
            }
            this._movement_overlay.clear();
            const tiles = this._tileGrid.neighbors(unit.tileInfo.q, unit.tileInfo.r, unit.movement);
            for (const tt of tiles) {
                if ((0, interfaces_1.isMountain)(tt.height)) {
                    continue;
                }
                if (unit.land == false && !((0, interfaces_1.isWater)(tt.height) || tt.rivers)) {
                    continue;
                }
                if (unit.water == false && (0, interfaces_1.isWater)(tt.height)) {
                    let player = this.getPlayer(unit.owner);
                    if (!("fishing" in player.research.researched)) {
                        continue;
                    }
                }
                let m = (0, Units_1.createTileOverlayModel)();
                m.position.set((0, coords_1.qrToWorld)(tt.q, tt.r).x, (0, coords_1.qrToWorld)(tt.q, tt.r).y, 0.02);
                this._movement_overlay.add(m);
            }
        }
        mergeBorderLines(lines) {
            const mergedPaths = [];
            const processed = new Set();
            const epsilon = 0.001;
            const arePointsEqual = (a, b) => {
                return Math.abs(a.x - b.x) < epsilon &&
                    Math.abs(a.y - b.y) < epsilon &&
                    Math.abs(a.z - b.z) < epsilon;
            };
            for (let i = 0; i < lines.length; i++) {
                if (processed.has(i))
                    continue;
                let path = [...lines[i]];
                processed.add(i);
                // Extend path forward
                let currentEnd = path[path.length - 1];
                let found = true;
                while (found) {
                    found = false;
                    for (let j = 0; j < lines.length; j++) {
                        if (processed.has(j))
                            continue;
                        const segment = lines[j];
                        if (arePointsEqual(segment[0], currentEnd)) {
                            path.push(segment[1]);
                            processed.add(j);
                            currentEnd = segment[1];
                            found = true;
                            break;
                        }
                        else if (arePointsEqual(segment[1], currentEnd)) {
                            path.push(segment[0]);
                            processed.add(j);
                            currentEnd = segment[0];
                            found = true;
                            break;
                        }
                    }
                }
                // Extend path backward
                let currentStart = path[0];
                found = true;
                while (found) {
                    found = false;
                    for (let j = 0; j < lines.length; j++) {
                        if (processed.has(j))
                            continue;
                        const segment = lines[j];
                        if (arePointsEqual(segment[1], currentStart)) {
                            path.unshift(segment[0]);
                            processed.add(j);
                            currentStart = segment[0];
                            found = true;
                            break;
                        }
                        else if (arePointsEqual(segment[0], currentStart)) {
                            path.unshift(segment[1]);
                            processed.add(j);
                            currentStart = segment[1];
                            found = true;
                            break;
                        }
                    }
                }
                mergedPaths.push(path);
            }
            return mergedPaths;
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
                for (const tile of this._tileGrid.toArray()) {
                    if (tile.worker_improvement === undefined) {
                        continue;
                    }
                    const type = tile.worker_improvement.type;
                    const index = tile.worker_improvement.index;
                    this.addWorkerImprovementToMap((0, ImprovementsWorker_1.CreateWorkerImprovement)(type, index), tile);
                }
                for (const [key, player] of Object.entries(this._gameState.players)) {
                    for (const improvementData of Object.values(player.improvements)) {
                        const improvement = (0, Units_2.CreateCity)(player, improvementData.name, improvementData.id);
                        improvement.id = improvementData.id;
                        improvement.population = improvementData.population;
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
                this.updateAllTerritoryOverlays();
                this.updateGlobalFog();
                this.addUnitSelectors();
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
                        break;
                    case 'plains':
                        tile.yields = { "food": 1, "production": 1, "gold": 1 };
                        break;
                    case 'ocean':
                        tile.yields = { "food": 1, "gold": 1 };
                        break;
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
                this.updatePopulationAndProductionRates(player, improvement);
                this.updateCityLabel(startTile);
                const unit = (0, Units_1.createUnit)("rifleman", player);
                this.addUnitToMap(unit, startTile);
                if (player.name === this._gameState.currentPlayer) {
                    this.selectTile(startTile);
                }
            }
            this.updateGlobalFog();
            this.addUnitSelectors();
            this.showTurnBanner();
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
            if (enemyTargeted && this._selectedUnit && this.selectedTile.unit && this.selectedTile.unit.owner === this.gameState.currentPlayer && this.selectedTile.unit.movement > 0) {
                const distance = getHexDistance(this.selectedTile, tile);
                if (distance <= this.selectedTile.unit.attack_range) {
                    const arrow = new DefaultTileHoverSelector_1.AttackArrow((0, coords_1.qrToWorld)(this.selectedTile.q, this.selectedTile.r), 3.5, worldPos);
                    this._arrow = arrow.createCurveMesh();
                    this._scene.add(this._arrow);
                }
            }
            else if (this._selectedUnit && this.selectedTile.unit && !tile.unit && !this.selectedTile.unit.moving && this.selectedTile.unit.owner === this.gameState.currentPlayer && this.selectedTile.unit.movement > 0) {
                // Show movement path if a friendly unit is selected
                if (tile !== this.selectedTile) {
                    const path = [this.selectedTile, ...this.calculatePath(this.selectedTile, tile, this.selectedTile.unit.movement)];
                    const pathLength = path.length;
                    if (pathLength <= this.selectedTile.unit.movement + 2) {
                        this.showPath(path);
                    }
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
            console.log(tile);
            const worldPos = (0, coords_1.qrToWorld)(tile.q, tile.r);
            this._tileSelector.position.set(worldPos.x, worldPos.y, 0.01);
            this._selectedTile = tile;
            this.updateUnitInfoForTile(tile);
            // Create light of god halo
            if (this.sectionHalo) {
                this.sectionHalo.dispose();
                this.sectionHalo = undefined;
            }
            this._movement_overlay.clear();
            if (tile.unit !== undefined && tile.unit.owner === this.gameState.currentPlayer) {
                if (this._selectedUnit !== tile.unit) {
                    this._selectedUnit = tile.unit;
                    this.sectionHalo = new Selector_1.LightOfGod();
                    tile.unit.model.add(this.sectionHalo.group);
                    this.updateUnitInfoForTile(tile);
                    this.addUnitMovementBorder(tile.unit);
                }
                else if (this._selectedUnit === tile.unit) {
                    this._selectedUnit = undefined;
                }
            }
            // let player = this.getPlayer(this.gameState.currentPlayer);
            if (this._onTileSelected) {
                this._onTileSelected(tile);
            }
        }
        actionTile(tile) {
            // console.log("action point", qrToWorld(tile.q, tile.r));
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
            // const ps = SelectionParticlesFromGeometry(this._scene, this._tileSelector as Mesh, 0.15);
            if (this._selectedUnit !== undefined && this.selectedTile.unit !== undefined && this.selectedTile.unit.owner === this.gameState.currentPlayer) {
                this.moveUnit(this.selectedTile, tile, true);
            }
        }
        updateGlobalFog() {
            const tileGrid = this.getTileGrid();
            const noFogKeys = new Set();
            if (this.settings.dev_mode === true) {
                let changed = [];
                tileGrid.toArray().forEach((tile) => {
                    if (tile.clouds === true || tile.fog === true) {
                        tile.clouds = false;
                        tile.fog = false;
                        changed.push(tile);
                    }
                });
                this.updateTiles(changed);
                return;
            }
            // First pass: determine which tiles should have no fog.
            tileGrid.toArray().forEach((tile) => {
                // Skip tiles with clouds.
                if (tile.clouds === true)
                    return;
                // Helper to add a tile and ensure it's not processed if it has clouds.
                const markTile = (t) => {
                    if (!t.clouds) {
                        noFogKeys.add(`${t.q},${t.r}`);
                    }
                };
                // If the tile is owned by the current player, mark it and its neighbors (range 1) as no-fog.
                if (tile.owner && tile.owner === this.gameState.currentPlayer) {
                    markTile(tile);
                    tileGrid.neighbors(tile.q, tile.r, 1).forEach(markTile);
                }
                // If a unit on the tile belongs to the current player, mark it and its neighbors (range 2) as no-fog.
                if (tile.unit && tile.unit.owner === this.gameState.currentPlayer) {
                    markTile(tile);
                    tileGrid.neighbors(tile.q, tile.r, 2).forEach(markTile);
                }
            });
            // Second pass: update fog state based on the precomputed no-fog set.
            const changed = [];
            tileGrid.toArray().forEach((tile) => {
                // Skip tiles with clouds.
                if (tile.clouds === true)
                    return;
                // Fog should be off if the tile is marked, on otherwise.
                const shouldHaveFog = !noFogKeys.has(`${tile.q},${tile.r}`);
                if (tile.fog !== shouldHaveFog) {
                    tile.fog = shouldHaveFog;
                    changed.push(tile);
                }
            });
            this.updateTiles(changed);
        }
        setFogAround(tile, range, fog) {
            const tiles = this.getTileGrid().neighbors(tile.q, tile.r, range);
            const updated = tiles.map(t => {
                t.fog = fog;
                t.clouds = false;
                return t;
            });
            this.updateTiles(updated);
        }
        updateToolTip(tile, x, y) {
            const tooltip = document.getElementById("tooltip");
            if (tile === undefined) {
                tooltip.style.visibility = "hidden";
                return;
            }
            if (tile.clouds) {
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
            if (tile.unit && tile.fog === false) {
                data.push(this.generateUnitInfo(tile.unit));
            }
            if (tile.resource) {
                data.push(this.generateResourceInfo(tile.resource));
            }
            data.push(this.generateTileInfo(tile));
            tooltip.innerHTML = data.join("</br>");
            tooltip.style.visibility = "visible";
        }
        updateToolTipFromDiv(target, x, y) {
            const player = this.getPlayer(this.gameState.currentPlayer);
            const tooltip = document.getElementById("tooltip");
            tooltip.style.left = x + 30 + "px"; // Offset to avoid cursor overlap
            tooltip.style.top = y + "px";
            let cityYields = this.getPlayerCityYields(player);
            if (target === "sub-pop") {
                let [happiness, happinessInfo] = this.getHappiness(player, cityYields);
                tooltip.innerHTML = happinessInfo;
                tooltip.style.visibility = "visible";
                return;
            }
            if (target === "sub-gold") {
                let diplomaticSummary = (0, GameState_1.GetDiplomaticActionsSummary)(this._gameState, player);
                let [goldPerTurn, goldPerTurnInfo] = this.getGoldPerTurn(player, diplomaticSummary, cityYields);
                tooltip.innerHTML = goldPerTurnInfo;
                tooltip.style.visibility = "visible";
                return;
            }
            if (target === "sub-research") {
                let [rpt, rptInfo] = this.getResearch(player, cityYields);
                tooltip.innerHTML = rptInfo;
                tooltip.style.visibility = "visible";
                return;
            }
            tooltip.innerHTML = `HHHHEEYYY ${target}`;
            tooltip.style.visibility = "visible";
            return;
        }
        hideTooltip() {
            const tooltip = document.getElementById("tooltip");
            tooltip.style.visibility = "hidden";
            return;
        }
        generateTileInfo(tile) {
            let height = '';
            if (tile.height > 0) {
                let rounded = Math.round(tile.height * 100) / 100;
                height += `<tr><th>Height</th><td>${rounded}</td></tr>`;
            }
            let allYields = this.getTotalYieldsForTile(tile);
            let improvement_info = "";
            if (tile.worker_improvement) {
                improvement_info += "<tr><th>Improvement</th><td>" + (0, util_1.capitalize)(tile.worker_improvement.type) + "</td></tr>";
            }
            let yields = '';
            for (const [key, value] of Object.entries(allYields)) {
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
                        ${improvement_info}
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
                if (nextMovementTile.unit.selector) {
                    nextMovementTile.unit.selector.mesh.parent.remove(nextMovementTile.unit.selector.mesh);
                    nextMovementTile.unit.selector.dispose();
                    nextMovementTile.unit.selector = undefined;
                }
            }
            const worldPos = (0, coords_1.qrToWorld)(nextMovementTile.q, nextMovementTile.r);
            if (playerInitiated) {
                this.playSound((0, util_1.asset)("sounds/units/rifleman2.mp3"), nextMovementTile.unit.model.position);
            }
            if (nextMovementTile.unit.selector) {
                nextMovementTile.unit.selector.mesh.position.set(worldPos.x, worldPos.y, .02);
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
            animateToPosition(nextMovementTile.unit.model, worldPos.x, worldPos.y, .2, easeOutQuad, () => {
                if (nextMovementTile.unit) {
                    nextMovementTile.unit.moving = false;
                    if (playerInitiated) {
                        this.updateGlobalFog();
                    }
                    ;
                    this.moveUnit(nextMovementTile, targetTile);
                }
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
                // const outcome = getRandomInt(1, 2)
                targetTile.unit.health -= Math.max(currentTile.unit.attack - targetTile.unit.defence, 0);
                if (targetTile.unit.health >= 0 && currentTile.unit.attack_range === 1 && targetTile.unit.attack_range === 1) {
                    currentTile.unit.health -= Math.max(targetTile.unit.attack - currentTile.unit.defence, 0);
                    new ParticleSystemEffects_1.Rocket(worldPosTarget, worldPosCur, this._scene);
                }
                (0, Units_1.updateUnitHealthBar)(currentTile.unit);
                (0, Units_1.updateUnitHealthBar)(targetTile.unit);
                let outcome = 0;
                if (targetTile.unit.health <= 0 && currentTile.unit.health > 0) {
                    outcome = 1;
                }
                // fall back to original positions
                animateToPosition(currentTile.unit.model, worldPosCur.x, worldPosCur.y, battleDuration, easeOutQuad, () => { });
                if (outcome === 1) {
                    // defender dies / battle victorious
                    const defenderBackX = worldPosTarget.x + (worldPosTarget.x - worldPosCur.x) * (1 / 3);
                    const defenderBackY = worldPosTarget.y + (worldPosTarget.y - worldPosCur.y) * (1 / 3);
                    animateFall(targetTile.unit.model, defenderBackX, defenderBackY, .2, easeOutQuad, () => {
                        if (currentTile.unit) {
                            currentTile.unit.kills += 1;
                        }
                        this.killUnit(targetTile);
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
                    if (currentTile.unit.health <= 0) {
                        this.killUnit(currentTile);
                        if (targetTile.unit) {
                            targetTile.unit.kills += 1;
                        }
                    }
                    if (targetTile.unit.health <= 0) {
                        this.killUnit(targetTile);
                    }
                }
            });
        }
        killUnit(tile) {
            const worldPosCur = (0, coords_1.qrToWorld)(tile.q, tile.r);
            let player = this.getPlayer(tile.unit.owner);
            const mm = this;
            if (this.gameState.currentPlayer === tile.unit.owner) {
                this.toast({
                    icon: `../../assets/map/icons/rifleman.png`,
                    text: `${tile.unit.name} has fallen in battle.`,
                    onClick: function () {
                        mm.selectTile(tile);
                        mm.focus(mm.selectedTile.q + 1, mm.selectedTile.r - 3);
                    }
                });
            }
            tile.unit.model.clear();
            tile.unit.model.parent.remove(tile.unit.model);
            delete player.units[tile.unit.id];
            this.updateResourcePanel();
            this.updateGameStatePanel();
            this.playSound((0, util_1.asset)("sounds/units/cinematic_boom.mp3"), worldPosCur);
            tile.unit = undefined;
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
                        let p2 = this.getPlayer(currentTile.unit.owner);
                        this.updateCityOwner(targetTile.improvement, p2);
                        this.playSound((0, util_1.asset)("sounds/units/cinematic_boom.mp3"), worldPosCur);
                        // update all tiles that belonged to that city to new owner.
                        currentTile.unit.kills += 1;
                        currentTile.locked = false;
                        targetTile.locked = false;
                        currentTile.unit.moving = false;
                        // check for cuttoff tiles
                        this.checkForCutOffTiles(currentTile);
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
        updateCityOwner(improvement, newOwner) {
            let p = this.getPlayer(improvement.owner);
            delete p.improvements[improvement.id];
            let p2 = newOwner;
            improvement.owner = newOwner.name;
            p2.improvements[improvement.id] = improvement;
            let targetTile = this.getTile(improvement.tileInfo.q, improvement.tileInfo.r);
            targetTile.owner = newOwner.name;
            this.addTerritoryOverlayFilterById(targetTile, targetTile.improvement.id, p2);
            const mm = this;
            this.toast({
                icon: "../../assets/map/icons/star.png",
                text: `${targetTile.improvement.name} captured by ${p2.name}`,
                onClick: function () {
                    mm.selectTile(targetTile);
                    mm.focus(mm.selectedTile.q + 1, mm.selectedTile.r - 3);
                }
            });
            // updateMaterialColor(targetTile.improvement.model.material, p2.color);
            this.updateResourcePanel();
            this.updateGameStatePanel();
            this.updateCityLabel(targetTile);
        }
        pickResearch() {
            this.CloseMenu();
            this.showMenu("", "center");
            const currentPlayer = this.getPlayer(this.gameState.currentPlayer);
            let [rpt, rptInfo] = this.getResearch(currentPlayer, this.getPlayerCityYields(currentPlayer));
            (0, Research_1.RenderTechTree)(currentPlayer.research.current, currentPlayer.research.researched, rpt, (tech) => {
                currentPlayer.research.current = tech.id;
                currentPlayer.research.progress = 0;
                this.updateResourcePanel();
                this.showEndTurnInActionPanel();
                this.menuPanel.innerHTML = "";
                this.CloseMenu();
            });
        }
        cityLabelClick(id) {
            const improvement = this.getImprovementById(id);
            if (!improvement) {
                return;
            }
            console.log(`improvmenet id: ${id}`);
            if (this.gameState.currentPlayer !== improvement.owner) {
                this.playerNegotiation(improvement.owner);
            }
            else {
                let tile = this.getTile(improvement.tileInfo.q, improvement.tileInfo.r);
                this._selectedUnit = undefined;
                this._selectedTile = tile;
                this.in_city_menu = true;
                this.focus(tile.q, tile.r);
                this.showCityMenu(tile);
                let neighborhood = this.getTileGrid().neighbors(tile.q, tile.r, 5);
                this.showYields(neighborhood);
                this.displayWorkedTiles(tile);
                this.displayExpansionView(tile);
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
            <button class="close-button" onclick="CloseMenu();">&times;</button>
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
            this.showMenu(info);
        }
        getTextInput(instructions, value = "", callback) {
            this._text_input_callback = callback;
            let info = `
            <button class="close-button" onclick="CloseMenu();">&times;</button>
            <div class="text-input-group">
                ${instructions}
                <input type="text" id="text-input" name="text-input" value="${value}">
                <button class="general-menu" data-name="submit_text_input">Submit</button>
                <button class="general-menu" data-name="cancel_text_input">Cancel</button>
            </div>
        `;
            this.showMenu(info);
        }
        generalMenuClicked(name) {
            if (name === "submit_text_input") {
                const text = document.getElementById("text-input").value;
                this.CloseMenu();
                this.menuPanel.innerHTML = "";
                this._text_input_callback(text);
            }
            if (name === "cancel_text_input") {
                this.CloseMenu();
            }
        }
        tradeMenuClicked(target) {
            (0, PlayerNegotiations_1.TradeMenuButtonClicked)(this, target);
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
        isImprovementEligible(tile) {
            if (!tile) {
                return false;
            }
            if ((0, interfaces_1.isMountain)(tile.height)) {
                return false;
            }
            if (tile.improvement !== undefined) {
                return false;
            }
            if (tile.owner && (tile.owner !== this._gameState.playersTurn)) {
                return false;
            }
            if (tile.city === undefined) {
                return false;
            }
            if (tile.improvement !== undefined) {
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
                    let player = this.getPlayer(unit.owner);
                    if (!("fishing" in player.research.researched)) {
                        continue;
                    }
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
            // // Optionally, add a step count indicator as text on the final tile.
            // if (path.length > 0) {
            //     const firstTile = path[0];
            //     const unit = firstTile.unit;
            //     const lastTile = path[path.length - 1];
            //     const worldPos = qrToWorld(lastTile.q, lastTile.r);
            //     // Create a canvas to draw the text.
            //     const canvas = document.createElement('canvas');
            //     const context = canvas.getContext('2d');
            //     canvas.width = 200;
            //     canvas.height = 100;
            //     context.font = '64px bold Trojan';
            //     context.fillStyle = 'white';
            //     context.textAlign = 'center';
            //     // Adjust vertical placement as needed.
            //     context.fillText(`${path.length - 1} / ${unit.movement}`, canvas.width / 2, canvas.height / 2 + 20);
            //     // Create a texture from the canvas and use it in a sprite.
            //     const texture = new CanvasTexture(canvas);
            //     const spriteMaterial = new SpriteMaterial({ map: texture, transparent: true });
            //     const sprite = new Sprite(spriteMaterial);
            //     sprite.position.set(worldPos.x, worldPos.y, 0.3); // Render above the dashed line.
            //     sprite.scale.set(0.5, 0.5, 1);
            //     this._pathIndicators.add(sprite);
            // }
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
        getTotalYieldsForTile(tile) {
            let allYields = Object.assign({}, tile.yields);
            if (tile.worker_improvement) {
                for (const [key, value] of Object.entries(tile.worker_improvement.yields)) {
                    if (allYields[key] === undefined || Number.isNaN(allYields[key])) {
                        allYields[key] = 0;
                    }
                    allYields[key] += value;
                }
            }
            return allYields;
        }
        showYields(tiles) {
            this._ui_map_temp_models.clear();
            tiles.forEach(tile => {
                if (tile.clouds) {
                    return;
                }
                const worldPos = (0, coords_1.qrToWorld)(tile.q, tile.r);
                const allYields = this.getTotalYieldsForTile(tile);
                const activeYields = Object.entries(allYields).filter(([, amount]) => amount > 0);
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
        displayWorkedTiles(tile) {
            let max_count = Math.max(1, Math.floor(tile.improvement.population));
            let count = 0;
            let tiles = this.getTileGrid().neighbors(tile.q, tile.r, 6).filter(t => t.city === tile.city);
            let tt = this.getBestYield(tiles, tile);
            tt.forEach(t => {
                if (count >= max_count) {
                    return;
                }
                count += 1;
                const geom = new three_1.RingBufferGeometry(0.001, 1, 6, 1);
                geom.rotateZ(Math.PI / 2);
                const model = new three_1.Mesh(geom, new three_1.MeshBasicMaterial({
                    color: 'purple',
                    opacity: .40,
                    transparent: true,
                    side: three_1.FrontSide,
                }));
                const worldPos = (0, coords_1.qrToWorld)(t.q, t.r);
                model.position.set(worldPos.x, worldPos.y, 0.01);
                this._ui_map_temp_models.add(model);
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
                    this.playSound((0, util_1.asset)("sounds/ui/buy.mp3"));
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
                        let t = this.getBestYield(tiles, origTile)[0];
                        origTile.improvement.nextTile = { q: t.q, r: t.r };
                    }
                    this.updateGlobalFog();
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
        checkForCutOffTiles(tile) {
            const grid = this.getTileGrid();
            const tiles = grid.neighbors(tile.q, tile.r, 5);
            tiles.forEach(t => {
                if (t.city && !this.isTileConnectedToHomeCity(t)) {
                    t.owner = "";
                    t.city = "";
                }
            });
        }
        isTileConnectedToHomeCity(startTile) {
            const grid = this.getTileGrid();
            // If there is no city specified, we consider it disconnected.
            if (!startTile.city)
                return false;
            const visited = new Set();
            const queue = [startTile];
            while (queue.length) {
                const current = queue.shift();
                const key = `${current.q},${current.r}`;
                if (visited.has(key))
                    continue;
                visited.add(key);
                // Check if the current tile is the home city tile.
                // (Assuming the home city tile is marked with an improvement whose id matches startTile.city.)
                if (current.improvement && current.improvement.id === startTile.city) {
                    return true;
                }
                // Get immediate neighbors (radius 1).
                const neighbors = grid.neighbors(current.q, current.r, 1);
                neighbors.forEach(neighbor => {
                    // Only traverse neighbors that are part of the same city chain.
                    if (neighbor.city === startTile.city && !visited.has(`${neighbor.q},${neighbor.r}`)) {
                        queue.push(neighbor);
                    }
                });
            }
            // No connection found to the home city.
            return false;
        }
        getBestYield(tiles, referenceTile) {
            return tiles.slice().sort((a, b) => {
                const aYield = Object.values(this.getTotalYieldsForTile(a)).reduce((sum, v) => sum + v, 0);
                const bYield = Object.values(this.getTotalYieldsForTile(b)).reduce((sum, v) => sum + v, 0);
                // Sort descending: higher yield comes first.
                if (aYield !== bYield) {
                    return bYield - aYield;
                }
                // If yields are equal, sort by distance (closer is better)
                const aDistance = getHexDistance(a, referenceTile);
                const bDistance = getHexDistance(b, referenceTile);
                return aDistance - bDistance;
            });
        }
        showEndTurnInActionPanel() {
            // show research if needed.
            const player = this._gameState.players[this._gameState.currentPlayer];
            if (player.research.current === "") {
                const research = Object.keys(player.research.researched).length;
                const max_research = Research_1.Technologies.size;
                if (research < max_research) {
                    this.setActionPanel(`<div class="action-menu action-button research">Pick Research</div>`);
                    return;
                }
            }
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
                this.updateGlobalFog();
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
                this.showTurnBanner();
            }
            else {
                this.setActionPanel(`<div class="action-button-disabled">Waiting for ${player.name}..<div>`);
            }
            // end diplomaticActions in end date
            for (const [key, value] of Object.entries(player.diplomatic_actions)) {
                for (const [actionKey, action] of Object.entries(value)) {
                    let d = action;
                    if (d.endTurn && d.endTurn <= this._gameState.turn) {
                        delete player.diplomatic_actions[key][actionKey];
                        // TODO toast if affects player.
                    }
                }
            }
            let diplomaticSummary = (0, GameState_1.GetDiplomaticActionsSummary)(this._gameState, player);
            // console.log(summary);
            // calculate new resources for player
            for (const [key, improvement] of Object.entries(player.improvements)) {
                let t = this.getTile(improvement.tileInfo.q, improvement.tileInfo.r);
                // population
                this.updatePopulationAndProductionRates(player, improvement);
                const previousPopulation = Math.floor(improvement.population);
                improvement.population += improvement.population_rate;
                improvement.population = Math.round(improvement.population * 10) / 10;
                const newPopulation = Math.floor(improvement.population);
                this.updateCityLabel(t);
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
                        let t = this.getBestYield(tiles, cityTile)[0];
                        cityTile.improvement.nextTile = { q: t.q, r: t.r };
                    }
                }
                // gold
                let yields = this.getYieldsForCity(t);
                // advance production in cities
                if ("production" in yields) {
                    improvement.work_done += yields["production"];
                }
                // check for completion in cities
                if (improvement.production_queue.length > 0 && improvement.work_done >= improvement.work_total) {
                    improvement.work_done -= improvement.work_total;
                    let thing_to_build = improvement.production_queue[0];
                    let thing_name = "";
                    let isBuilding = false;
                    if (thing_to_build in CityImprovements_1.BuildingMap) {
                        isBuilding = true;
                    }
                    if (isBuilding === false) {
                        const mm = Units_2.UnitMap[thing_to_build];
                        let unit = (0, Units_1.createUnit)(thing_to_build, player);
                        thing_name = unit.name;
                        let unit_terrain = "land";
                        if (thing_to_build === "warship" || thing_to_build === "destroyer") {
                            unit_terrain = "water";
                        }
                        if (thing_to_build === "gunship") {
                            unit_terrain = "";
                        }
                        this.addUnitToMap(unit, this.getClosestUnoccupiedTile(t, unit_terrain));
                    }
                    if (isBuilding === true) {
                        thing_name = CityImprovements_1.BuildingMap[thing_to_build].name;
                        improvement.cityBuildings[thing_to_build] = true;
                    }
                    improvement.production_queue = [];
                    let mm = this;
                    if (this._gameState.playersTurn === this._gameState.currentPlayer) {
                        this.toast({
                            icon: "../../assets/map/icons/star.png",
                            text: `${thing_name} produced in ${improvement.name}`,
                            onClick: function () {
                                mm.selectTile(t);
                            }
                        });
                    }
                    this.updateCityLabel(t);
                }
            }
            let resources = this.getResourcesForPlayer(player);
            for (const [resource_name, amount] of Object.entries(diplomaticSummary.resources)) {
                if (!(resource_name in resources)) {
                    resources[resource_name] = 0;
                }
                resources[resource_name] += amount;
            }
            let cityYields = this.getPlayerCityYields(player);
            // let [happiness, happinessInfo] = this.getHappiness(player, cityYields);
            let [rpt, rptInfo] = this.getResearch(player, cityYields);
            let [goldPerTurn, goldPerTurnInfo] = this.getGoldPerTurn(player, diplomaticSummary, cityYields);
            player.gold += goldPerTurn;
            // calculate research for player 
            player.research.progress += rpt;
            if (player.research.current !== "") {
                let tech = Research_1.Technologies.get(player.research.current);
                if (tech.cost <= player.research.progress) {
                    player.research.progress -= tech.cost;
                    player.research.researched[player.research.current] = true;
                    player.research.current = "";
                    if (this._gameState.playersTurn === this._gameState.currentPlayer) {
                        const mm = this;
                        this.toast({
                            icon: "../../assets/map/icons/star.png",
                            text: `${tech.name} research complete!`,
                            onClick: function () {
                                mm.pickResearch();
                            }
                        });
                        let info = (0, Research_1.DisplayResearchFinished)(tech);
                        this.CloseMenu();
                        this.showMenu(info, "center");
                        if (tech.quote_audio) {
                            this.playSound((0, util_1.asset)(tech.quote_audio));
                        }
                    }
                    else {
                        let tech = (0, Research_1.AIChooseResearch)();
                        if (tech !== undefined) {
                            player.research.current = tech.id;
                        }
                    }
                }
            }
            // refresh units movement / health if in city/terittories (todo)
            for (const [key, unit] of Object.entries(player.units)) {
                unit.movement = unit.movement_max;
                // unit.health = unit.health_max;
            }
            if (this._gameState.playersTurn === this._gameState.currentPlayer) {
                this.addUnitSelectors();
            }
            this.updateResourcePanel();
            this.updateGameStatePanel();
            this.updateUnitInfoForTile(this.selectedTile);
            if (this._gameState.playersTurn !== this._gameState.currentPlayer) {
                (0, AI_1.takeTurn)(this, player);
            }
        }
        updateCityLabel(t) {
            let improvement = t.improvement;
            let nation = Nations_1.Nations[improvement.owner];
            const newPopulation = Math.floor(improvement.population);
            const img = `<img src="${nation.flag_image}" style="padding-right:10px;" width="30px" height="25px"/>`;
            let label = `<span class="city-label" data-target="${improvement.id}">${img} ${newPopulation} ${improvement.name}</span>`;
            if (t.owner !== this._gameState.currentPlayer) {
                (0, Units_1.updateLabel)(improvement.id, label);
                return;
            }
            // Add progress bars for human player
            let progress = this.getCityProgress(t);
            label = `<span class="city-label" data-target="${improvement.id}">`;
            label += ` ${img} `;
            let popBar = (0, Units_1.HeathBarDivHtml)(improvement.id, progress.pop_percent);
            label += popBar + `<span class="city-label-lower" style="padding-right:5px;"><sub>${progress.pop_turns}</sub> </span>`;
            label += ` ${newPopulation} ${improvement.name}`;
            if (improvement.production_queue.length > 0) {
                let prodBar = (0, Units_1.HeathBarDivHtml)(improvement.id, progress.prod_percent);
                label += prodBar + `<span class="city-label-lower" style="padding-left:5px;"> <sub>${progress.prod_turns}</sub></span>`;
                label += `<img src="${progress.prod_image}" style="padding-left:10px;" width="30px" height="25px"/>`;
                label == "</span>";
            }
            (0, Units_1.updateLabel)(improvement.id, label);
        }
        showTurnBanner() {
            const player = this._gameState.players[this._gameState.playersTurn];
            const nation = Nations_1.Nations[this._gameState.playersTurn];
            showBanner(`${nation.name} - ${(0, GameState_1.TurnToYear)(this._gameState.turn)} Turn: ${this._gameState.turn}`);
        }
        addUnitSelectors() {
            // Add selectors for units that have movement
            let player = this.gameState.players[this._gameState.currentPlayer];
            for (const [key, unit] of Object.entries(player.units)) {
                if (unit.movement > 0) {
                    const tile = this._tileGrid.get(unit.tileInfo.q, unit.tileInfo.r);
                    const worldPos = (0, coords_1.qrToWorld)(tile.q, tile.r);
                    const ps = new Selector_1.WhiteOutline();
                    ps.mesh.rotateZ(Math.PI / 2);
                    ps.mesh.position.set(worldPos.x, worldPos.y, worldPos.z + 0.02);
                    unit.selector = ps;
                    this._units_models.add(ps.mesh);
                }
            }
            this._selectedUnit = undefined;
        }
        getPlayerCityYields(player) {
            let yields = {
                building_maintance: 0,
                gold: 0,
                food: 0,
                happiness: 0,
                population: 0,
                research: 0,
            };
            for (const [key, improvement] of Object.entries(player.improvements)) {
                yields.population += improvement.population;
                let t = this.getTile(improvement.tileInfo.q, improvement.tileInfo.r);
                let cityYields = this.getYieldsForCity(t);
                if ("gold" in cityYields) {
                    yields.gold += cityYields["gold"];
                }
                if ("research" in cityYields) {
                    yields.research += cityYields["research"];
                }
                if ("happiness" in cityYields) {
                    yields.happiness += cityYields["happiness"];
                }
            }
            return yields;
        }
        getCityProgress(tile) {
            let result = {
                prod_percent: 0,
                prod_turns: 0,
                prod_image: "",
                pop_percent: 0,
                pop_turns: 0,
            };
            let cityYields = this.getYieldsForCity(tile);
            let avialable_prod = 0;
            if ("production" in cityYields) {
                avialable_prod = cityYields["production"];
            }
            if (tile.improvement.production_queue.length > 0) {
                let prod_item = tile.improvement.production_queue[0];
                if (prod_item in Units_2.UnitMap) {
                    let unit = Units_2.UnitMap[prod_item];
                    let cost = tile.improvement.work_total - tile.improvement.work_done;
                    let turns = Math.ceil(cost / avialable_prod);
                    result.prod_percent = Math.ceil(tile.improvement.work_done / tile.improvement.work_total * 100) / 100;
                    result.prod_turns = turns;
                    result.prod_image = unit.icon;
                }
                if (prod_item in CityImprovements_1.BuildingMap) {
                    let building = CityImprovements_1.BuildingMap[prod_item];
                    let cost = tile.improvement.work_total - tile.improvement.work_done;
                    let turns = Math.ceil(cost / avialable_prod);
                    result.prod_percent = Math.ceil(tile.improvement.work_done / tile.improvement.work_total * 100) / 100;
                    result.prod_turns = turns;
                    result.prod_image = building.menu_image;
                }
            }
            result.pop_percent = tile.improvement.population % 1;
            let needed = 1 - result.pop_percent;
            result.pop_turns = Math.ceil(needed / tile.improvement.population_rate);
            return result;
        }
        updatePopulationAndProductionRates(player, improvement) {
            let cityYields = this.getYieldsForCity(this.getTile(improvement.tileInfo.q, improvement.tileInfo.r));
            let excess_food = cityYields.food - improvement.population;
            excess_food += 1; // base food
            if (excess_food > 0) {
                improvement.population_rate = excess_food / 10;
            }
            if (excess_food < 0) {
                improvement.population_rate = 0;
            }
        }
        getHappiness(player, cityYields) {
            let info = "Happiness: </br><table>";
            let happiness = 0;
            let population = cityYields.population;
            population = Math.floor(population);
            happiness -= population;
            info += `<tr><td>-${population}</td><td>from population</td></tr>`;
            info += `<tr><td></td></tr>`;
            let improvements = cityYields.happiness;
            happiness += improvements;
            info += `<tr><td>+${improvements}</td><td>from buildings/improvements</td></tr>`;
            let resources = this.getResourcesForPlayer(player);
            for (const [resource_name, amount] of Object.entries(resources)) {
                let amount = 4;
                happiness += amount;
                info += `<tr><td>+${amount}</td><td>from resource: ${resource_name}</td></tr>`;
            }
            // bonuses;
            let difficulty = 3;
            happiness += difficulty;
            info += `<tr><td>+${difficulty}</td><td>from difficulty</td></tr>`;
            info += `</table>`;
            happiness = Math.round(happiness);
            return [happiness, info];
        }
        getGoldPerTurn(player, diplomaticSummary, cityYields) {
            let info = "Gold: </br><table>";
            let gpt = 0;
            // units
            let unitMainance = Object.keys(player.units).length;
            gpt -= unitMainance;
            info += `<tr><td>-${unitMainance}</td><td>from units maintaince</td></tr>`;
            // cities
            let building_maintance = cityYields.building_maintance;
            gpt -= building_maintance;
            info += `<tr><td>-${building_maintance}</td><td>from buildings maintaince</td></tr>`;
            // cities and population
            let yieldsGold = cityYields.gold;
            gpt += cityYields.gold;
            info += `<tr><td>+${yieldsGold}</td><td>from buildings/improvements</td></tr>`;
            info += `<tr><td></td></tr>`;
            gpt += diplomaticSummary.gold_per_turn;
            info += diplomaticSummary.gold_summary;
            let difficulty = 3;
            gpt += difficulty;
            info += `<tr><td>+${difficulty}</td><td>from difficulty</td></tr>`;
            info += `</table>`;
            gpt = Math.round(gpt);
            return [gpt, info];
        }
        getResearch(player, cityYields) {
            let info = "Research: </br><table>";
            let research = 0;
            // cities and population
            let yieldsResearch = cityYields.research;
            research += yieldsResearch;
            info += `<tr><td>+${yieldsResearch}</td><td>from buildings/improvements</td></tr>`;
            // bonuses;
            let difficulty = 1;
            research += difficulty;
            info += `<tr><td>+${difficulty}</td><td>from difficulty</td></tr>`;
            info += `</table>`;
            return [research, info];
        }
        updateResourcePanel() {
            if (this.resourcePanel == null) {
                return;
            }
            const player = this._gameState.players[this._gameState.currentPlayer];
            let diplomaticSummary = (0, GameState_1.GetDiplomaticActionsSummary)(this._gameState, player);
            // const units = Object.keys(player.units).length;
            // const cities = Object.keys(player.improvements).length;
            let resources = this.getResourcesForPlayer(player);
            for (const [resource_name, amount] of Object.entries(diplomaticSummary.resources)) {
                if (!(resource_name in resources)) {
                    resources[resource_name] = 0;
                }
                resources[resource_name] += amount;
            }
            let resourcesString = "";
            for (const [key, number] of Object.entries(resources)) {
                resourcesString += ` <img src="../../assets/map/resources/${key}.png" style="padding-left: 5px; padding-right: 5px; width: 25px; height: 25px;"/> ${number} `;
                // goldPerTurn += ResourceMap[key].gold;
            }
            let cityYields = this.getPlayerCityYields(player);
            let [happiness, happinessInfo] = this.getHappiness(player, cityYields);
            let [rpt, rptInfo] = this.getResearch(player, cityYields);
            let [goldPerTurn, goldPerTurnInfo] = this.getGoldPerTurn(player, diplomaticSummary, cityYields);
            let goldPerTurnStr = `${goldPerTurn}`;
            if (goldPerTurn >= 0) {
                goldPerTurnStr = `+${goldPerTurn}`;
            }
            let taxRate = (player.taxRate * 100).toFixed(0) + '%';
            let pop_icon = `<img src="../../assets/ui/resources/population.png" style="padding-right: 5px; width: 20px; height: 20px;"/>`;
            let gold_icon = `<img src="../../assets/ui/resources/gold.png" style="padding-left: 15px; padding-right: 5px; width: 20px; height: 20px;"/>`;
            let taxes_icon = `<img src="../../assets/ui/resources/taxes.png" style="padding-left: 15px; padding-right: 5px; width: 20px; height: 20px;"/>`;
            let research_icon = `<img src="../../assets/ui/resources/research.png" style="padding-left: 15px; padding-right: 5px; width: 20px; height: 20px;"/>`;
            let research_percentage = `0%`;
            let research_info = "";
            let tech_name = '';
            if (Research_1.Technologies.has(player.research.current)) {
                let tech = Research_1.Technologies.get(player.research.current);
                tech_name = tech.name;
                let percent = Math.round(player.research.progress / tech.cost * 100);
                let turns = Math.ceil((tech.cost - player.research.progress) / rpt);
                research_percentage = `${percent}%`;
                research_info = `${percent}% (${turns} turns left)`;
            }
            else {
                tech_name = "Pick a technology to research";
                research_percentage = '0%';
            }
            let research = `<span class="research highlight-hover">
          <div id="progressBarContainer">
            <div style="width: ${research_percentage};" class="progressBar research" id="progressBar"></div>
            <div class="progressText research" id="progressText">${tech_name} ${research_info}</div>
        </div></span> `;
            let government = Governments_1.GovernmentsMap[player.government];
            let taxes = `${taxes_icon}<span class="taxes highlight-hover">${government.name}</span>`;
            let info = `<span class="sub" id="sub-pop">${pop_icon} ${happiness}</span><span class="sub" id="sub-gold">${gold_icon} ${player.gold} (${goldPerTurnStr})</span><span class="sub" id="sub-research" style="padding-right: 10px;">${research_icon} (+${rpt})</span> ${research}  ${taxes} ${resourcesString}`;
            this.resourcePanel.innerHTML = info;
        }
        updateUnitInfoForTile(tile) {
            if (this.gameState.playersTurn !== this.gameState.currentPlayer) {
                return;
            }
            if (this.unitInfoPanel == null) {
                return;
            }
            if (this.in_city_menu) {
                this.CloseMenu();
            }
            this.clearYields();
            this.clearNextExpansion();
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
            if (tile.unit && shouldShowUnit && tile.unit === this._selectedUnit) {
                let menu = ``;
                if (tile.unit.type === "settler") {
                    // validate placement location
                    if (!this.isTileCityEligbile(tile)) {
                        menu = `<tr><td><button disabled class="city-menu" data-name="settler_place_city">Start City</button></td><td></td></tr>`;
                    }
                    else {
                        menu = `<tr><td><button class="city-menu" data-name="settler_place_city">Start City</button></td><td></td></tr>`;
                    }
                }
                if (tile.unit.type === "worker") {
                    // validate placement location
                    if (!this.isImprovementEligible(tile)) {
                        menu = `<tr><td><button disabled class="city-menu" data-name="worker_improvement">Add farm</button></td><td></td></tr>`;
                    }
                    else {
                        menu = `<tr><td><button class="city-menu" data-name="worker_improvement" data-target="farm">Build Farm</button></td><td></td></tr>`;
                        menu += `<tr><td><button class="city-menu" data-name="worker_improvement" data-target="mine">Build Mine</button></td><td></td></tr>`;
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
                    // let neighborhood = this.getTileGrid().neighbors(tile.q, tile.r, 5);
                    // this.showYields(neighborhood);
                    // this.displayExpansionView(tile);
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
                let style = "player-info-top";
                let nameColor = "";
                if (player.name === this._gameState.playersTurn) {
                    nameColor = `game-info-turn`;
                }
                if (key !== this._gameState.currentPlayer) {
                    nameColor += ` player-negotiation highlight-hover`;
                }
                info += `<span class="${style}" data-name="${player.name}">`;
                info += `<div class="${nameColor} player-info-name"  style="padding-right:3px; margin-top:-5px;" data-name="${player.name}">`;
                info += `<img src="${nation.flag_image}" alt="${nation.leader}" style="padding-right:3px; margin-top:-5px; padding-left:15px;" width="30px">`;
                if (player.isDefeated) {
                    info += `<s>${player.name}</s>`;
                    continue;
                }
                if (key === this._gameState.currentPlayer) {
                    info += `${player.name}`;
                }
                else {
                    info += `${nation.leader}`;
                }
                info += `</div>`;
                // const units = Object.keys(player.units).length;
                const cities = Object.keys(player.improvements).length;
                const research = Object.keys(player.research.researched).length;
                const government = Governments_1.GovernmentsMap[player.government].name;
                info += `<span style="">${government}</span>`;
                info += `</br><span style=""><img class="player-info-labels" src="../../assets/ui/resources/gold.png">${player.gold}</span>`;
                info += `</br><span style=""><img class="player-info-labels" src="../../assets/ui/resources/population.png">${cities}</span>`;
                info += `</br><span style=""><img class="player-info-labels" src="../../assets/ui/resources/research.png">${research}</span>`;
                info += `</span>`;
            }
            info += `<span style="padding-left: 15px;"> ${(0, GameState_1.TurnToYear)(this._gameState.turn)} (TURN: ${this._gameState.turn})</span>`;
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
                        unit.selector.mesh.parent.remove(unit.selector.mesh);
                        unit.selector.dispose();
                        unit.selector = undefined;
                    }
                }
                return;
            }
            // console.log("no interaction for action panel");
        }
        playerNegotiation(playerName) {
            const player1 = this._gameState.players[this._gameState.currentPlayer];
            const player2 = this._gameState.players[playerName];
            const player2nation = Nations_1.Nations[player2.nation];
            let info = `
            <button class="close-button" onclick="CloseMenu();">&times;</button>
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
                info += `<button class="player-diplomatic-menu" data-name="trade_for_peace" data-target="${player2.name}">Ask for Peace</button>`;
            }
            else {
                // at peace
                info += `<button class="player-diplomatic-menu" data-name="trade" data-target="${player2.name}">Trade</button>`;
                info += `<button class="player-diplomatic-menu" data-name="form_aliance" data-target="${player2.name}">Form Alliance</button>`;
                if (player1.diplomatic_actions[player2.name].hasOwnProperty("peace")) {
                    let v = player1.diplomatic_actions[player2.name]["peace"];
                    info += `<button disabled class="player-diplomatic-menu" data-name="break_alliance" data-target="${player2.name}"> Declare War Disabled (At peace until turn ${v.endTurn}) </button>`;
                }
                else {
                    info += `<button class="player-diplomatic-menu" data-name="declare_war" data-target="${player2.name}">Declare War</button>`;
                }
            }
            info += `</div>`;
            this.showMenu(info);
        }
        showMenu(info, layout = "center") {
            if (this.menuPanel == null) {
                return;
            }
            this.menuPanel.innerHTML = info;
            const menuModal = document.getElementById("menu-modal");
            if (layout === "center") {
                this.menuPanel.style.left = "15%";
                this.menuPanel.style.width = "70%";
                this.menuPanel.style.visibility = "visible";
                menuModal.style.visibility = "visible";
            }
            else if (layout === "city") {
                this.menuPanel.style.left = "0%";
                this.menuPanel.style.width = "30%";
                menuModal.style.visibility = "hidden";
                this.menuPanel.style.visibility = "visible";
            }
            else {
                this.menuPanel.style.visibility = "visible";
                menuModal.style.visibility = "visible";
            }
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
                ["scout", "Scout", 30, "../../map/icons/scout.png"],
                ["worker", "Worker", 50, "../../map/icons/worker.png"],
                ["settler", "Settler", 100, "../../map/icons/settler.png"],
                ["rifleman", "Rifleman", 100, "../../map/icons/rifleman.png"],
                ["cavalry", "Cavalry", 200, "../../map/icons/cavalry.png"],
                ["artillary", "Artillary", 300, "../../map/icons/artillary.png"],
            ];
            let player = this.getPlayer(tile.improvement.owner);
            // console.log(player.research.researched);
            if ("infantry" in player.research.researched) {
                options.push(["infantry", "Infantry", 400, "rifleman.png"]);
            }
            if ("warships" in player.research.researched) {
                options.push(["warship", "Warship", 500, "warship.png"]);
            }
            if ("tank" in player.research.researched) {
                options.push(["tank", "Tank", 500, "tank.png"]);
            }
            if ("destroyer" in player.research.researched) {
                options.push(["destroyer", "Destroyer", 500, "destroyer.png"]);
            }
            if ("gunship" in player.research.researched) {
                options.push(["gunshp", "Gunship", 500, "gunship.png"]);
            }
            if ("nukes" in player.research.researched) {
                options.push(["nuke", "Nuke", 1000, "nuke.png"]);
            }
            // get all the city tiles;
            let yield_info = `<table class="city_yields">`;
            yield_info += `<tr><td>Population:</td> <td>${tile.improvement.population} (+${tile.improvement.population_rate})</td></tr>`;
            let round = Math.floor(tile.improvement.population);
            yield_info += `<tr><td>Yields: (${round} tiles)</td> <td></td></tr>`;
            let tileYields = this.getYieldsForCity(tile);
            for (const [key, value] of Object.entries(tileYields)) {
                if (value > 0) {
                    yield_info += `<tr><td>${(0, util_1.capitalize)(key)}:</td> <td>${value}</td></tr>`;
                }
            }
            yield_info += "</table>";
            let building_info = `<table class="city_yields"><tr><td>Buildings:</td> <td></td></tr>`;
            for (const [key, _] of Object.entries(tile.improvement.cityBuildings)) {
                let b = CityImprovements_1.BuildingMap[key];
                building_info += `<tr><td>${b.name}</td></tr>`;
            }
            building_info += "</table>";
            let avialable_prod = 0;
            if ("production" in tileYields) {
                avialable_prod = tileYields["production"];
            }
            let production_info = `<table class="city_yields"><tr><td>Currently Making:</td></tr>`;
            if (tile.improvement.production_queue.length > 0) {
                let prod_item = tile.improvement.production_queue[0];
                if (prod_item in Units_2.UnitMap) {
                    let unit = Units_2.UnitMap[prod_item];
                    let cost = tile.improvement.work_total - tile.improvement.work_done;
                    let turns = Math.ceil(cost / avialable_prod);
                    let percent = Math.ceil(tile.improvement.work_done / tile.improvement.work_total * 100);
                    production_info += `<tr><td>${unit.name}</td><td>${turns} turns left (${percent}%)</td></tr>`;
                }
                if (prod_item in CityImprovements_1.BuildingMap) {
                    let building = CityImprovements_1.BuildingMap[prod_item];
                    let cost = tile.improvement.work_total - tile.improvement.work_done;
                    let turns = Math.ceil(cost / avialable_prod);
                    let percent = Math.ceil(tile.improvement.work_done / tile.improvement.work_total * 100);
                    production_info += `<tr><td>${building.name}</td><td>${turns} turns left (${percent}%)</td></tr>`;
                }
            }
            else {
                production_info += `<tr><td>Nothing</td></tr>`;
            }
            production_info += `</table>`;
            let option_info = "";
            for (const [name, label, cost, image] of options) {
                let turns = Math.ceil(cost / avialable_prod) / 10;
                option_info += `<tr>`;
                option_info += `<td><button class="city-menu" data-name="queue" data-target="${name}"><img id="menu-unit-img" src="../../assets/ui/units/${image}">${label} (${turns} turns)</button></td>`;
                option_info += `<td><button class="city-menu" data-name="buy" data-target="${name}">${cost} <img id="menu-unit-cost" src="../../assets/ui/resources/gold.png"></button></td>`;
                option_info += `</tr>`;
            }
            option_info += "</br>";
            for (const [key, building] of Object.entries(CityImprovements_1.BuildingMap)) {
                if (key in tile.improvement.cityBuildings) {
                    continue;
                }
                let turns = Math.ceil(building.cost / avialable_prod) / 10;
                option_info += `<tr><td><button class="city-menu" data-name="queue_building" data-target="${key}"><img id="menu-unit-img" src="${building.menu_image}">${building.name} (${turns} turns)</button></td>`;
                option_info += `<td><button class="city-menu" data-name="buy_building" data-target="${key}">${building.cost} <img id="menu-unit-cost" src="../../assets/ui/resources/gold.png"</button></td></tr>`;
            }
            let info = `
            <button class="close-button" onclick="CloseMenu();">&times;</button>
            <div style="text-align: center;">
                ${tile.improvement.name}</br>
            </div>
            <p class="small">
                ${yield_info}
            </p>
            <p class="small">
                ${building_info}
            </p>
            <p class="small">
                ${production_info}
            </p>
            <div class="options">
                <table>
                    ${option_info}
                </table>
            </div>
        `;
            this.showMenu(info, "city");
        }
        getYieldsForCity(tile) {
            // from worked tiles
            let tiles = this.getTileGrid().neighbors(tile.q, tile.r, 6).filter(t => t.city === tile.city);
            let tt = this.getBestYield(tiles, tile);
            let yields = {};
            let resources = {};
            let count = 0;
            let max_count = Math.max(1, Math.floor(tile.improvement.population));
            yields = Object.assign({}, tile.yields);
            for (let i = 0; i < tt.length; i++) {
                let t = tt[i];
                if (t === tile) {
                    continue;
                }
                if (count >= max_count) {
                    break;
                }
                count += 1;
                for (const [key, value] of Object.entries(t.yields)) {
                    if (yields[key] === undefined) {
                        yields[key] = 0;
                    }
                    yields[key] += value;
                }
                if (tile.resource !== undefined) {
                    resources[tile.resource.name] += 1;
                }
                if (tile.worker_improvement !== undefined) {
                    for (const [keyw, valuew] of Object.entries(tile.worker_improvement.yields)) {
                        if (yields[keyw] === undefined) {
                            yields[keyw] = 0;
                        }
                        yields[keyw] += valuew;
                    }
                }
            }
            ;
            // from buildings
            for (const [key, building] of Object.entries(tile.improvement.cityBuildings)) {
                let b = CityImprovements_1.BuildingMap[key];
                for (const [key, value] of Object.entries(b.yields)) {
                    if (yields[key] === undefined) {
                        yields[key] = 0;
                    }
                    yields[key] += value;
                }
            }
            return yields;
        }
        mainMenu() {
            let options = [
                ["save_game", "Save Game"],
                ["load_game", "Load Latest Saved Game"],
            ];
            let options2 = [
                ["main_menu", "Exit to Main Menu"],
                ["exit_desktop", "Exit to Desktop"],
                ["dev_mode", "Enable Dev Mode"],
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
            <button class="close-button" onclick="CloseMenu();">&times;</button>
            <div class="options">
                ${option_info}
                </div>
        `;
            this.showMenu(info);
        }
        mainMenuOption(name) {
            return __awaiter(this, void 0, void 0, function* () {
                if (name === "main_menu") {
                    window.location.href = './main_menu.html';
                }
                if (name === "exit_desktop") {
                    window.close();
                }
                if (name === "dev_mode") {
                    let settings = JSON.parse(localStorage.getItem('settings') || '{}');
                    if (settings.dev_mode && settings.dev_mode === true) {
                        settings.dev_mode = false;
                        localStorage.setItem('settings', JSON.stringify(settings));
                        this.settings = settings;
                        this.updateGlobalFog();
                        return;
                    }
                    settings.dev_mode = true;
                    localStorage.setItem('settings', JSON.stringify(settings));
                    this.settings = settings;
                    this.updateGlobalFog();
                    console.log("Dev mode enabled");
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
                    console.log(sg);
                    const sgs = JSON.stringify(sg);
                    console.log(sgs);
                    let savedGames = JSON.parse(localStorage.getItem('saved_games') || '[]');
                    let name = `${currentDate}`;
                    savedGames.push({
                        name: name,
                        id: `saved_game_${name}`
                    });
                    localStorage.setItem(`saved_game_${name}`, sgs);
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
                    this.CloseMenu();
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
            <button class="close-button" onclick="CloseMenu();">&times;</button>
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
            this.showMenu(info);
            return false;
        }
        cityMenuAction(name, target) {
            console.log(name, target);
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
                    this.updatePopulationAndProductionRates(player, improvement);
                }
                this.playSound((0, util_1.asset)("sounds/ui/buy.mp3"));
            }
            if (name === "decrease_taxes") {
                if (player.taxRate - 0.1 < 0) {
                    return;
                }
                player.taxRate -= 0.1;
                for (const [key, improvement] of Object.entries(player.improvements)) {
                    this.updatePopulationAndProductionRates(player, improvement);
                }
                this.playSound((0, util_1.asset)("sounds/ui/buy.mp3"));
            }
            if (name === "change_government") {
                player.government = target;
                this.toast({
                    icon: "../../assets/map/icons/star.png",
                    text: `${player.name} government changed to ${Governments_1.GovernmentsMap[target].name}`,
                    onClick: function () { }
                });
                this.CloseMenu();
            }
            if (name === "settler_place_city") {
                let tile = this.selectedTile;
                // start city
                let defaultName = (0, Units_1.getNextCityName)(player);
                this.getTextInput(`<h3>City Name</h3>`, defaultName, (name) => {
                    let player = this.getPlayer(this.gameState.currentPlayer);
                    let city = (0, Units_2.CreateCity)(player, name);
                    this.addImprovementToMap(city, tile);
                    this.updatePopulationAndProductionRates(player, city);
                    this.updateCityLabel(tile);
                    // remove settler
                    while (tile.unit.model.children.length > 0) {
                        tile.unit.model.remove(tile.unit.model.children[0]);
                    }
                    tile.unit.model.geometry.dispose();
                    tile.unit.model.parent.remove(tile.unit.model);
                    tile.unit = undefined;
                    // update stats
                    this.updateGlobalFog();
                    this.showEndTurnInActionPanel();
                    this.updateUnitInfoForTile(tile);
                });
            }
            if (name === "worker_improvement") {
                let type = target;
                let tile = this.selectedTile;
                const workerImprovement = (0, ImprovementsWorker_1.CreateWorkerImprovement)(type);
                this.addWorkerImprovementToMap(workerImprovement, tile);
            }
            if (name === "buy_building") {
                let building = target;
                tile.improvement.cityBuildings[building] = true;
                player.gold -= CityImprovements_1.BuildingMap[building].cost;
                this.showCityMenu(tile);
            }
            let unit_type = "";
            let unit_terrain = "land";
            if (name === "buy") {
                unit_type = target;
                if (unit_type === "warship" || unit_type === "destroyer") {
                    unit_terrain = "water";
                }
                if (unit_type === "gunship") {
                    unit_terrain = "";
                }
                if (unit_type !== "") {
                    const mm = Units_2.UnitMap[unit_type];
                    let unit = (0, Units_1.createUnit)(unit_type, player);
                    player.gold -= mm.cost;
                    this.addUnitToMap(unit, this.getClosestUnoccupiedTile(tile, unit_terrain));
                }
                this.playSound((0, util_1.asset)("sounds/ui/buy.mp3"));
            }
            if (name === "queue") {
                tile.improvement.work_done = 0;
                tile.improvement.production_queue = [target];
                tile.improvement.work_total = Units_2.UnitMap[target].cost / 10;
                tile.improvement.work_building = false;
                this.playSound((0, util_1.asset)("sounds/ui/notification.mp3"));
                this.updateCityLabel(tile);
                this.showCityMenu(tile);
            }
            if (name === "queue_building") {
                tile.improvement.work_done = 0;
                tile.improvement.production_queue = [target];
                tile.improvement.work_total = CityImprovements_1.BuildingMap[target].cost / 10;
                tile.improvement.work_building = true;
                this.playSound((0, util_1.asset)("sounds/ui/notification.mp3"));
                this.updateCityLabel(tile);
                this.showCityMenu(tile);
            }
            this.updateResourcePanel();
            this.updateGameStatePanel();
            // this.updateUnitInfoForTile(tile);
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
                this.CloseMenu();
                console.log(this._gameState);
                return;
            }
            if (name === "trade" || name === "trade_for_peace") {
                const targetNation = Nations_1.Nations[targetPlayer.nation];
                let info = `
                <button class="close-button" onclick="CloseMenu();">&times;</button>
                <div style="text-align: center;">
                    <img id="menu-leader-img" src="${targetNation.leader_images["default"][0]}" alt="${targetPlayer.name}">
                </div>
                <div class="leader-name" style="display: flex; text-align: center;">
                    <img src="${targetNation.flag_image}">
                    ${targetNation.leader}
                </div>

                <div id="leader-text">
                    <p>"What do you want to discuss?"</p>
                </div>
            `;
                (0, PlayerNegotiations_1.ResetNegotiations)(this, player, targetPlayer);
                info += (0, PlayerNegotiations_1.TradeMenuHtml)();
                this.showMenu(info);
                return;
            }
        }
        checkVictoryConditions() {
            // check if current player lost
            const currentPlayer = this._gameState.players[this._gameState.currentPlayer];
            if (Object.keys(currentPlayer.improvements).length === 0) {
                console.log("Lost!");
                let info = `<h1 class="text-info">Defeat!</h1>`;
                this.showMenu(info);
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
            let info = `<h1 class="text-info">Victory!</h1>`;
            this.showMenu(info);
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
        CloseMenu() {
            document.getElementById('menu').innerHTML = '';
            document.getElementById('menu-modal').style.visibility = 'hidden';
            document.getElementById('menu').style.visibility = 'hidden';
            this.in_city_menu = false;
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
    function showBanner(text) {
        let a = document.getElementById('achievement');
        a.innerText = text;
        a.classList.add('show');
        setTimeout(() => { document.getElementById('achievement').classList.add('remove'); }, 2000);
        setTimeout(() => { document.getElementById('achievement').classList.remove('remove', 'show'); }, 3000);
    }
    function easeOutQuad(t) {
        return t * (2 - t);
    }
    function CloseMenu() {
        document.getElementById('menu').innerHTML = '';
        document.getElementById('menu-modal').style.visibility = 'hidden';
        document.getElementById('menu').style.visibility = 'hidden';
    }
});
//# sourceMappingURL=MapView.js.map