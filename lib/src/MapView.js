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
define(["require", "exports", "three", "./MapMesh", "./interfaces", "./util", "./Grid", "./DefaultTileSelector", "./DefaultTileHoverSelector", "./Units", "./DefaultMapViewController", "./coords", "./ChunkedLazyMapMesh", "./ParticleSystemEffects", "./ParticleSystem", "./Units", "./GameState", "./CSS3DRenderer", "./AI", "./toastify", "./Nations", "./Research"], function (require, exports, three_1, MapMesh_1, interfaces_1, util_1, Grid_1, DefaultTileSelector_1, DefaultTileHoverSelector_1, Units_1, DefaultMapViewController_1, coords_1, ChunkedLazyMapMesh_1, ParticleSystemEffects_1, ParticleSystem_1, Units_2, GameState_1, CSS3DRenderer_1, AI_1, toastify_1, Nations_1, Research_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MapMesh_1 = __importDefault(MapMesh_1);
    Grid_1 = __importDefault(Grid_1);
    DefaultTileSelector_1 = __importDefault(DefaultTileSelector_1);
    DefaultMapViewController_1 = __importDefault(DefaultMapViewController_1);
    ChunkedLazyMapMesh_1 = __importDefault(ChunkedLazyMapMesh_1);
    toastify_1 = __importDefault(toastify_1);
    class MapView {
        constructor(canvasElementQuery = "canvas") {
            this._scrollDir = new three_1.Vector3(0, 0, 0);
            this._lastTimestamp = Date.now();
            this._zoom = 25;
            this._tileGrid = new Grid_1.default(0, 0);
            this._tileSelector = DefaultTileSelector_1.default;
            this._hoverSelector = DefaultTileHoverSelector_1.DefaultTileHoverSelector;
            this._arrow = null;
            this._controller = new DefaultMapViewController_1.default();
            this._units_models = new three_1.Group();
            this._units = new Map();
            this._gameState = GameState_1.InitGameState();
            this._savedGame = null;
            this._onAnimate = (dtS) => { };
            this._minimap_aspect_width = 400;
            this._minimap_aspect_height = 275;
            this.spotlight = null;
            this.unitInfoPanel = null;
            this.unitInfoCache = "";
            this.unitInfoIndex = "";
            this.placingCity = false;
            this.buyingLand = "";
            this.gameStatePanel = null;
            this.menuPanel = null;
            this.actionPanel = null;
            this.resourcePanel = null;
            this.sectionHalo = null;
            this.scrollSpeed = 10;
            this.animate = (timestamp) => {
                const dtS = (timestamp - this._lastTimestamp) / 1000.0;
                const camera = this._camera;
                const zoomRelative = camera.position.z / MapView.DEFAULT_ZOOM;
                const scroll = this._scrollDir.clone().normalize().multiplyScalar(this.scrollSpeed * zoomRelative * dtS);
                camera.position.add(scroll);
                if (this._chunkedMesh) {
                    this._chunkedMesh.updateVisibility(camera);
                    this._chunkedMesh.updateVisibility(this._minimap_camera);
                }
                this._minimap_camera.position.x = 0;
                this._minimap_camera.position.y = 0;
                this._minimap_camera.position.z = this._tileGrid.width * 3.25;
                this._onAnimate(dtS);
                this._spotLightHelper.update();
                for (const ps of ParticleSystem_1.ParticleSystems) {
                    ps.update(dtS);
                    if (!ps.isActive()) {
                        ps.dispose();
                    }
                }
                this._renderer.render(this._scene, camera);
                this._labelRenderer.render(this._scene, camera);
                this._minimap_renderer.render(this._scene, this._minimap_camera);
                requestAnimationFrame(this.animate);
                this._lastTimestamp = timestamp;
            };
            const canvas = this._canvas = document.querySelector(canvasElementQuery);
            const camera = this._camera = new three_1.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 2, 10000);
            const minimap_camera = this._minimap_camera = new three_1.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 2, 10000);
            const scene = this._scene = new three_1.Scene();
            const renderer = this._renderer = new three_1.WebGLRenderer({
                canvas: canvas,
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
            // Add a spotlight to the scene
            const spotlight = new three_1.SpotLight(0xffffff, 1, 100, Math.PI / 4, 0.5, 2);
            spotlight.position.set(0, 10, 0); // Adjust the position as needed
            spotlight.target.position.set(0, 0, 0); // The target is the center of the spotlight
            this._spotlight = spotlight;
            this._spotlight.color.setHex(0xffffff); // White light
            this._spotlight.intensity = 5; // Increase the intensity
            this._spotlight.distance = 5; // Increase the distance
            this._spotlight.angle = Math.PI / 6; // Narrower cone angle
            this._spotlight.decay = 1; // No decay
            this._renderer.shadowMap.enabled = true;
            this._renderer.shadowMap.type = three_1.PCFSoftShadowMap;
            this._scene.receiveShadow = true;
            console.log(this._scene);
            this._spotLightHelper = new three_1.SpotLightHelper(spotlight);
            this._scene.add(this._spotLightHelper);
            // Enable shadows for the spotlight
            this._spotlight.castShadow = true;
            // Adjust shadow map properties for better quality
            this._spotlight.shadow.mapSize.width = 1024;
            this._spotlight.shadow.mapSize.height = 1024;
            this._spotlight.shadow.camera.near = 1;
            this._spotlight.shadow.camera.far = 100;
            this._scene.add(spotlight);
            this._scene.add(spotlight.target);
            // Store the spotlight in your class for later manipulation
            this._spotlight = spotlight;
            // hover selector
            this._hoverSelector.position.setZ(0.0001);
            this._scene.add(this._hoverSelector);
            this._hoverSelector.visible = true;
            // tile selector
            this._tileSelector.position.setZ(0.02);
            this._scene.add(this._tileSelector);
            this._tileSelector.visible = true;
            // audtio
            this._listener = new three_1.AudioListener();
            this._camera.add(this._listener);
            // units
            this._scene.add(this._units_models);
            window.addEventListener('resize', (e) => this.onWindowResize(e), false);
            // start rendering loop
            this.animate(0);
            this._controller.init(this, canvas);
        }
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
            const gc = util_1.deepCopy(this._gameState);
            for (const [key, player] of Object.entries(gc.players)) {
                let units = util_1.deepCopy(player.units);
                let improvements = util_1.deepCopy(player.improvements);
                for (const [unitKey, _] of Object.entries(units)) {
                    units[unitKey].model = null;
                }
                player.units = units;
                for (const [improvementKey, _] of Object.entries(improvements)) {
                    improvements[improvementKey].model = null;
                }
                player.improvements = improvements;
            }
            return JSON.stringify({
                "gameState": gc,
                "grid": this._tileGrid.exportData(),
                "selectedTile": { q: this._selectedTile.q, r: this._selectedTile.r }
            });
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
                    const texture = textureLoader.load(util_1.asset(name));
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
                        undefined,
                        {
                            treesPerForest: 25
                        },
                        {
                            treesPerForest: 10,
                            scale: 0.85
                        } // no options for tropical forests (index = 3)
                    ]
                };
                const atlas = yield util_1.loadTextureAtlas();
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
            if (interfaces_1.isMountain(tile.height)) {
                console.log("cannot place on mountain");
                return;
            }
            // if (isWater(tile.height)) {
            //     console.log("cannot place in water");
            //     return;
            // }
            const worldPos = coords_1.qrToWorld(tile.q, tile.r);
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
            if (interfaces_1.isMountain(tile.height)) {
                console.log("cannot place on mountain");
                return;
            }
            if (interfaces_1.isWater(tile.height)) {
                console.log("cannot place in water");
                return;
            }
            let player = this.getPlayer(improvement.owner);
            player.improvements[improvement.id] = improvement;
            const worldPos = coords_1.qrToWorld(tile.q, tile.r);
            improvement.model.position.set(worldPos.x, worldPos.y, .4);
            improvement.tileInfo = { q: tile.q, r: tile.r };
            tile.improvement = improvement;
            let overlayCity = Units_1.createCityOverlayModel();
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
            this._units_models.add(improvement.model);
            if (fromSaved) {
                return;
            }
            const mm = this;
            if (this.gameState.currentPlayer === improvement.owner) {
                this.toast({
                    icon: "/assets/map/icons/star.png",
                    text: `${improvement.name} founded by ${player.name}`,
                    onClick: function () {
                        mm.selectTile(tile);
                        mm.focus(mm.selectedTile.q + 1, mm.selectedTile.r - 3);
                    }
                });
            }
            this.updateResourcePanel();
            this.updateGameStatePanel();
        }
        addTerritoryOverlay(t, city_id, player) {
            if (t.territoryOverlay) {
                t.territoryOverlay.parent.remove(t.territoryOverlay);
            }
            t.city = city_id;
            t.territoryOverlay = Units_1.createTerritoryOverlayModel(player);
            this._units_models.add(t.territoryOverlay);
            const tworldPos = coords_1.qrToWorld(t.q, t.r);
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
        }
        addResourceToMap(resourceName, tile) {
            let resource = Units_1.ResourceMap[resourceName];
            // Bad Cases
            if (tile.resource !== undefined) {
                console.log("cannot add resource; already occupied");
                return;
            }
            if (interfaces_1.isMountain(tile.height)) {
                console.log("cannot place on mountain");
                return;
            }
            if (interfaces_1.isWater(tile.height)) {
                console.log("cannot place in water");
                return;
            }
            const worldPos = coords_1.qrToWorld(tile.q, tile.r);
            resource = Units_1.CreateResourceModel(resource);
            resource.model.visible = false;
            resource.model.position.set(worldPos.x, worldPos.y - .2, 0.2);
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
                        const improvement = Units_2.CreateCity(player);
                        improvement.id = improvementData.id;
                        improvement.population = improvementData.population;
                        improvement.name = improvementData.name;
                        let t = this.getTile(improvementData.tileInfo.q, improvementData.tileInfo.r);
                        // t.improvement = undefined;
                        this.addImprovementToMap(improvement, t, true);
                    }
                    for (const unitData of Object.values(player.units)) {
                        const unit = Units_1.LoadSavedUnit(unitData, player);
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
            // set up initial resources
            const resourceNames = Object.keys(Units_1.ResourceMap);
            for (let i = 0; i < 50; i++) {
                let tile = this.getRandomTile(false);
                if (tile && tile.resource === undefined && !interfaces_1.isMountain(tile.height) && !interfaces_1.isWater(tile.height)) {
                    // get random from resource map
                    const name = resourceNames[Math.floor(Math.random() * resourceNames.length)];
                    this.addResourceToMap(name, tile);
                }
            }
            // set up players initial locations
            for (const [key, player] of Object.entries(this._gameState.players)) {
                const startTile = this.getRandomTile(true);
                const improvement = Units_2.CreateCity(player);
                this.addImprovementToMap(improvement, startTile);
                const unit = Units_2.CreateRifleman(player);
                this.addUnitToMap(unit, startTile);
                if (player.name === this._gameState.currentPlayer) {
                    this.selectTile(startTile);
                }
            }
        }
        toast({ text, icon, onClick }) {
            this.playSound(util_1.asset("sounds/ui/notification.mp3"));
            new toastify_1.default({
                text: text,
                position: "left",
                avatar: icon,
                close: true,
                duration: 80000,
                offset: {
                    x: -10,
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
            this._minimap_camera.aspect = this._minimap_aspect_width / this._minimap_aspect_height;
            // this._minimap_renderer.setSize(this._minimap_aspect_width / this._minimap_aspect_height);
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
            return coords_1.mouseToWorld({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 }, this._camera);
        }
        getCameraFocusPosition(pos) {
            return this.getCameraFocusPositionWorld(coords_1.qrToWorld(pos.q, pos.r));
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
            if (this._hoveredTile === tile) {
                return;
            }
            this._hoveredTile = tile;
            if (this._arrow !== null) {
                this._scene.remove(this._arrow);
            }
            if (tile === undefined) {
                return;
            }
            const worldPos = coords_1.qrToWorld(tile.q, tile.r);
            let enemyTargeted = false;
            if (tile !== undefined) {
                if ((tile.unit !== undefined && tile.unit.owner !== this.gameState.currentPlayer) ||
                    (tile.improvement !== undefined && tile.improvement.owner !== this.gameState.currentPlayer)) {
                    enemyTargeted = true;
                    DefaultTileHoverSelector_1.hoverSelectorMaterial.color.set(0xff0000); // Red color
                    DefaultTileHoverSelector_1.hoverSelectorMaterial.opacity = 1;
                }
                else {
                    DefaultTileHoverSelector_1.hoverSelectorMaterial.color.set(0xffff00); // yellow color
                    DefaultTileHoverSelector_1.hoverSelectorMaterial.opacity = 0.2;
                }
            }
            if (enemyTargeted && this.selectedTile.unit !== undefined && this.selectedTile.unit.owner === this.gameState.currentPlayer && this.selectedTile.unit.movement > 0) {
                const startWorldPos = coords_1.qrToWorld(this.selectedTile.q, this.selectedTile.r);
                const d = getHexDistance(this.selectedTile, tile);
                if (d <= this.selectedTile.unit.attack_range) {
                    let height = .2;
                    if (this.selectedTile.unit.attack_range > 1) {
                        height = 3.5;
                    }
                    const arrow = new DefaultTileHoverSelector_1.AttackArrow(startWorldPos, height, worldPos);
                    this._arrow = arrow.createCurveMesh();
                    this._scene.add(this._arrow);
                }
            }
            // const startWorldPos = qrToWorld(this.selectedTile.q, this.selectedTile.r)
            // const arrow = new AttackArrow(
            //     startWorldPos,
            //     3.5,
            //     worldPos,
            // )
            // this._arrow = arrow.createCurveMesh()
            // this._scene.add(this._arrow)
            this._hoverSelector.position.set(worldPos.x, worldPos.y, 0.01);
        }
        selectTile(tile) {
            const worldPos = coords_1.qrToWorld(tile.q, tile.r);
            this._tileSelector.position.set(worldPos.x, worldPos.y, 0.1);
            this._selectedTile = tile;
            this.updateUnitInfoForTile(tile);
            // hide menu; TODO do this better
            document.getElementById('menu').innerHTML = "";
            document.getElementById('menu').style.visibility = 'hidden';
            this._spotlight.position.set(worldPos.x, worldPos.y, 4); // Adjust the Y coordinate as needed
            this._spotlight.target.position.set(worldPos.x, worldPos.y, 0.2);
            console.log(this._spotlight);
            if (this.sectionHalo) {
                this.sectionHalo.dispose();
            }
            // Create new halo
            // this.sectionHalo = createSpotlightEffect(this._scene, worldPos);
            let player = this.getPlayer(this.gameState.currentPlayer);
            if (this.placingCity) {
                // validate placement location
                if (!this.isTileCityEligbile(tile)) {
                    this.setActionPanel(`<div class="action-menu" data-name="">Cannot place a city here; Select a new location to place city</div> or <div class="action-menu" data-name="create_city_cancel">Cancel</div>`);
                    return;
                }
                this.addImprovementToMap(Units_2.CreateCity(this.getPlayer(this.gameState.currentPlayer)), tile);
                this.placingCity = false;
                this.showEndTurnInActionPanel();
                this.updateUnitInfoForTile(tile);
            }
            if (this.buyingLand != "") {
                // validate placement location
                // if (!this.isTileCityEligbile(tile)) {
                //     this.setActionPanel(`<div class="action-menu" data-name="">Cannot buy land here</div> or <div class="action-menu" data-name="buy_land_cancel">Cancel</div>`);
                //     return;
                // }
                // this.addImprovementToMap(CreateCity(this.getPlayer(this.gameState.currentPlayer)), tile);
                tile.owner = this.gameState.currentPlayer;
                // update tile ownership of  this and surrounding
                if (tile.territoryOverlay) {
                    tile.territoryOverlay.parent.remove(tile.territoryOverlay);
                }
                tile.territoryOverlay = Units_1.createTerritoryOverlayModel(player);
                this._units_models.add(tile.territoryOverlay);
                const tworldPos = coords_1.qrToWorld(tile.q, tile.r);
                tile.territoryOverlay.position.set(tworldPos.x, tworldPos.y, 0.01);
                tile.territoryOverlay.layers.enable(10);
                tile.city = this.buyingLand;
                this.buyingLand = "";
                this.showEndTurnInActionPanel();
                this.updateUnitInfoForTile(tile);
            }
            if (this._onTileSelected) {
                this._onTileSelected(tile);
            }
        }
        actionTile(tile) {
            console.log("action point", coords_1.qrToWorld(tile.q, tile.r));
            // Bad Cases
            if (this.selectedTile.q === tile.q && this.selectedTile.r === tile.r) {
                return;
            }
            const worldPos = coords_1.qrToWorld(tile.q, tile.r);
            const from = coords_1.qrToWorld(this.selectedTile.q, this.selectedTile.r);
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
            this.moveUnit(this.selectedTile, tile, true);
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
            return `
            <div>
                Terrain
                <div style="display: flex; align-items: left;">
                    <table style="margin-right: 10px; text-align: left;">
                        <tr>
                            <th>Type</th>
                            <td>${util_1.capitalize(tile.terrain)}</td>
                        </tr>
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
            let gold_icon = `<img src="/assets/ui/resources/gold.png" style="height: 25px; padding-right: 10px;"/>`;
            return `
            <div>
                Resource
                <div style="display: flex; align-items: left;">
                    <table style="margin-right: 10px; text-align: left;">
                        <tr>
                            <th>Type</th>
                            <td>${util_1.capitalize(resource.name)}</td>
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
            const nextMovementTile = this.getNextMovementTile(currentTile, targetTile);
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
            if (playerInitiated) {
                this.playSound(util_1.asset("sounds/units/rifleman2.mp3"), nextMovementTile.unit.model.position);
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
            const worldPos = coords_1.qrToWorld(nextMovementTile.q, nextMovementTile.r);
            animateToPosition(nextMovementTile.unit.model, worldPos.x, worldPos.y, .2, easeOutQuad, () => {
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
            const worldPosCur = coords_1.qrToWorld(currentTile.q, currentTile.r);
            const worldPosTarget = coords_1.qrToWorld(targetTile.q, targetTile.r);
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
            this.playSound(util_1.asset("sounds/units/rifleman_attack.mp3"), worldPosCur);
            // have attacker move foward and defender move back
            animateToPosition(targetTile.unit.model, defenderBackX, defenderBackY, battleDuration, easeOutQuad, () => { });
            animateToPosition(currentTile.unit.model, twoThirdsX, twoThirdsY, battleDuration, easeOutQuad, () => {
                const outcome = util_1.getRandomInt(1, 2);
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
                        this.playSound(util_1.asset("sounds/units/cinematic_boom.mp3"), worldPosCur);
                        const mm = this;
                        if (this.gameState.currentPlayer === targetTile.unit.owner) {
                            this.toast({
                                icon: `/assets/map/icons/rifleman.png`,
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
            const worldPosCur = coords_1.qrToWorld(currentTile.q, currentTile.r);
            const worldPosTarget = coords_1.qrToWorld(targetTile.q, targetTile.r);
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
            this.playSound(util_1.asset("sounds/units/rifleman_attack.mp3"), worldPosCur);
            // have attacker move foward
            animateToPosition(currentTile.unit.model, twoThirdsX, twoThirdsY, battleDuration, easeOutQuad, () => {
                const outcome = util_1.getRandomInt(1, 2);
                // fall back to original positions
                animateToPosition(currentTile.unit.model, worldPosCur.x, worldPosCur.y, battleDuration, easeOutQuad, () => { });
                animateToPosition(targetTile.improvement.model, worldPosTarget.x, worldPosTarget.y, battleDuration, easeOutQuad, () => {
                    if (isRanged) {
                        currentTile.locked = false;
                        targetTile.locked = false;
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
                        this.playSound(util_1.asset("sounds/units/cinematic_boom.mp3"), worldPosCur);
                        this.addTerritoryOverlayFilterById(targetTile, targetTile.improvement.id, p2);
                        // const tiles = this.getTileGrid().neighbors(targetTile.q, targetTile.r, 4)
                        // tiles.push(targetTile);
                        // for (const t of tiles) {
                        //     t.owner = currentTile.unit.owner;
                        //     if (t.territoryOverlay) {
                        //         t.territoryOverlay.parent.remove(t.territoryOverlay);
                        //     }
                        //     t.territoryOverlay = createTerritoryOverlayModel(p2);
                        //     this._units_models.add(t.territoryOverlay);
                        //     const tworldPos = qrToWorld(t.q, t.r);
                        //     t.territoryOverlay.position.set(tworldPos.x, tworldPos.y, 0.01);
                        //     t.territoryOverlay.layers.enable(10);
                        // }
                        const mm = this;
                        this.toast({
                            icon: "/assets/map/icons/star.png",
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
                        const label = `<span class="city-label">${img} ${targetTile.improvement.name} (${roundedPopulation})</span>`;
                        Units_1.updateLabel(targetTile.improvement.id, label);
                        // update all tiles that belonged to that city to new owner.
                        currentTile.unit.kills += 1;
                        currentTile.locked = false;
                        targetTile.locked = false;
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
            Research_1.RenderTechTree(currentPlayer.research.current, currentPlayer.research.researched, (tech) => {
                currentPlayer.research.current = tech.id;
                currentPlayer.research.progress = 0;
                this.updateResourcePanel();
                this.menuPanel.innerHTML = "";
                this.menuPanel.style.visibility = "hidden";
            });
        }
        updateTaxes() {
            let info = `
            <button class="close-button" onclick="document.getElementById('menu').style.visibility='hidden'">&times;</button>
            <div style="text-align: center;">
                <img id="menu-leader-img" src="/assets/ui/resources/taxes.png">
            </div>
            <div class="options">
                <button class="city-menu" data-name="increase_taxes"><img id="menu-unit-img" src="/assets/ui/resources/taxes.png">Increase Taxes (nationwide)</button>
                <button class="city-menu" data-name="decrease_taxes"><img id="menu-unit-img" src="/assets/ui/resources/taxes.png">Decrease Taxes (nationwide)</button>
            </div>
        `;
            this.menuPanel.innerHTML = info;
            this.menuPanel.style.visibility = "visible";
        }
        pickTile(worldPos) {
            var x = worldPos.x;
            var y = worldPos.y;
            // convert from world coordinates into fractal axial coordinates
            var q = (1.0 / 3 * Math.sqrt(3) * x - 1.0 / 3 * y);
            var r = 2.0 / 3 * y;
            // now need to round the fractal axial coords into integer axial coords for the grid lookup
            var cubePos = coords_1.axialToCube(q, r);
            var roundedCubePos = coords_1.roundToHex(cubePos);
            var roundedAxialPos = coords_1.cubeToAxial(roundedCubePos.x, roundedCubePos.y, roundedCubePos.z);
            // just look up the coords in our grid
            return this._tileGrid.get(roundedAxialPos.q, roundedAxialPos.r);
        }
        getRandomTile(cityEligibile) {
            if (cityEligibile) {
                while (true) {
                    const q = util_1.getRandomInt(-1 * (this._tileGrid.width / 2) + 4, this._tileGrid.width / 2 - 4);
                    const r = util_1.getRandomInt(-1 * (this._tileGrid.width / 2) + 4, this._tileGrid.height / 2 - 4);
                    const randomTile = this._tileGrid.get(q, r);
                    if (!this.isTileCityEligbile(randomTile)) {
                        continue;
                    }
                    return randomTile;
                }
            }
            const q = util_1.getRandomInt(-1 * (this._tileGrid.width / 2), this._tileGrid.width / 2);
            const r = util_1.getRandomInt(-1 * (this._tileGrid.width / 2), this._tileGrid.height / 2);
            const randomTile = this._tileGrid.get(q, r);
            return randomTile;
        }
        isTileCityEligbile(tile) {
            if (!tile) {
                return false;
            }
            if (interfaces_1.isMountain(tile.height) || interfaces_1.isWater(tile.height)) {
                return false;
            }
            if (tile.improvement !== undefined) {
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
            let owner = "";
            if (tile.improvement !== undefined) {
                owner = tile.improvement.owner;
            }
            let q = [tile].concat(this.getTileGrid().neighbors(tile.q, tile.r, 2));
            let checked = {};
            while (q.length > 0) {
                let current = q.shift();
                if (current !== undefined && current.unit === undefined && !interfaces_1.isMountain(current.height) && (current.improvement === undefined || current.improvement.owner === owner)) {
                    if (type == "land" && !interfaces_1.isWater(current.height)) {
                        return current;
                    }
                    if (type == "water" && interfaces_1.isWater(current.height)) {
                        return current;
                    }
                }
            }
            return undefined;
        }
        getNextMovementTile(current, target) {
            // Define all possible neighbors in axial coordinates
            const neighbors = [
                { q: current.q + 1, r: current.r },
                { q: current.q - 1, r: current.r },
                { q: current.q, r: current.r + 1 },
                { q: current.q, r: current.r - 1 },
                { q: current.q + 1, r: current.r - 1 },
                { q: current.q - 1, r: current.r + 1 },
            ];
            // Find the neighbor closest to the target
            let bestNeighbor = current;
            let shortestDistance = Infinity;
            for (const neighbor of neighbors) {
                let tt = this._tileGrid.get(neighbor.q, neighbor.r);
                if (tt === undefined) {
                    continue;
                }
                if (interfaces_1.isMountain(tt.height)) {
                    continue;
                }
                if (tt.unit !== undefined && current.unit !== undefined && tt.unit.owner === current.unit.owner) {
                    // cant occupy what we already have a unit on
                    continue;
                }
                if (current.unit.land == false && !interfaces_1.isWater(tt.height)) {
                    continue;
                }
                if (current.unit.water == false && interfaces_1.isWater(tt.height)) {
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
        showEndTurnInActionPanel() {
            this.setActionPanel(`<div class="action-menu" data-name="end_turn">End Turn</div>`);
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
            if (this._gameState.playersTurn === this._gameState.currentPlayer) {
                this.showEndTurnInActionPanel();
            }
            else {
                this.setActionPanel(`<div class="grey">Waiting for ${this._gameState.playersTurn}..<div>`);
            }
            // calculate new resources for player
            const player = this._gameState.players[this._gameState.playersTurn];
            const nation = Nations_1.Nations[player.nation];
            for (const [key, improvement] of Object.entries(player.improvements)) {
                // population
                Units_1.updatePopulationAndProductionRates(player, improvement);
                improvement.population += improvement.population_rate;
                const roundedPopulation = Math.floor(improvement.population);
                const img = `<img src="${nation.flag_image}" style="padding-right:10px;" width="30px" height="25px"/>`;
                const label = `<span class="city-label">${img} ${improvement.name} (${roundedPopulation})</span>`;
                Units_1.updateLabel(improvement.id, label);
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
                        icon: "/assets/map/icons/star.png",
                        text: `${tech.name} research complete!`,
                        onClick: function () {
                            mm.pickResearch();
                        }
                    });
                    Research_1.DisplayResearchFinished(tech);
                    if (tech.quote_audio) {
                        this.playSound(util_1.asset(tech.quote_audio));
                    }
                    player.research.current = "";
                }
                else {
                    let tech = Research_1.AIChooseResearch();
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
            this.updateResourcePanel();
            this.updateGameStatePanel();
            this.updateUnitInfoForTile(this.selectedTile);
            if (this._gameState.playersTurn !== this._gameState.currentPlayer) {
                AI_1.takeTurn(this, player);
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
                resourcesString += ` <img src="/assets/map/resources/${key}.png" style="padding-left: 5px; padding-right: 5px; width: 25px; height: 25px;"/> ${number} `;
                goldPerTurn += Units_1.ResourceMap[key].gold;
            }
            for (const [key, improvement] of Object.entries(player.improvements)) {
                population += Math.floor(improvement.population);
                populationPerTurn += improvement.population_rate;
                goldPerTurn += improvement.population * player.taxRate * 10;
            }
            goldPerTurn = Math.round(goldPerTurn);
            let taxRate = (player.taxRate * 100).toFixed(0) + '%';
            let gold_icon = `<img src="/assets/ui/resources/gold.png" style="padding-right: 5px; width: 25px; height: 25px;"/>`;
            let pop_icon = `<img src="/assets/ui/resources/population.png" style="padding-left: 5px; padding-right: 5px; width: 25px; height: 25px;"/>`;
            let taxes_icon = `<img src="/assets/ui/resources/taxes.png" style="padding-left: 5px; padding-right: 5px; width: 25px; height: 25px;"/>`;
            let research_icon = `<img src="/assets/ui/resources/research.png" style="padding-left: 5px; padding-right: 5px; width: 25px; height: 25px;"/>`;
            let research_amount = "(+5) (2 turns)";
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
            let research = `<span class="research highlight-hover">${research_percentage} ${tech_name} ${research_amount}</span>`;
            let taxes = `${taxes_icon}<span class="taxes highlight-hover"> ${taxRate}</span>`;
            let info = `${gold_icon} ${player.gold} (+${goldPerTurn}) | ${pop_icon} ${population} (+${populationPerTurn}) | ${taxes} | ${research_icon} ${research} |${resourcesString}`;
            this.resourcePanel.innerHTML = info;
        }
        updateUnitInfoForTile(tile) {
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
                let info = `<div>
                        <div style="text-align: left;" class="bold">${tile.unit.name}</div>
                        <div style="display: flex; align-items: left;">
                            <img src="${tile.unit.image}" alt="${tile.unit.type}" width="200px" height="200px">
                                
                                <table style="margin-right: 10px; text-align: left;">
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
            info += `<span style="padding-left: 15px;"> turn: ${this._gameState.turn}</span>`;
            info += `<span class="main-menu" style="padding-left: 15px;">Menu</span>`;
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
                return;
            }
            if (dataName === "create_city_cancel") {
                this._gameState.players[this._gameState.currentPlayer].gold += 100;
                this.placingCity = false;
                this.showEndTurnInActionPanel();
                this.updateGameStatePanel();
                this.updateResourcePanel();
                return;
            }
            if (dataName === "buy_land_cancel") {
                this._gameState.players[this._gameState.currentPlayer].gold += 40;
                this.buyingLand = "";
                this.showEndTurnInActionPanel();
                this.updateGameStatePanel();
                this.updateResourcePanel();
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
                ["start_city", "Start City", 100, "city.png"],
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
                option_info += `<button class="city-menu" data-name="${name}"><img id="menu-unit-img" src="/assets/ui/units/${image}">${cost}<img id="menu-unit-cost" src="/assets/ui/resources/gold.png">${label}</button>`;
            }
            let info = `
            <button class="close-button" onclick="document.getElementById('menu').style.visibility='hidden'">&times;</button>
            <div style="text-align: center;">
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
                ["new_game", "New Game"],
                ["load_game", "Load Game"],
                ["save_game", "Save Game"],
            ];
            let option_info = "";
            for (const [name, label] of options) {
                option_info += `<button class="main-menu-option" data-name="${name}">${label}</button>`;
            }
            let info = `
            <h1 class="title">Main Menu</h1>
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
                if (name === "new_game") {
                    location.reload(); // TODO
                }
                if (name === "load_game") {
                    localStorage.setItem('load_game', 'saved_game');
                    location.reload(); // TODO (give choice of saved games)
                }
                if (name === "save_game") {
                    this.menuPanel.innerHTML = "Saving..";
                    const sg = this.getSaveGame();
                    const currentDate = new Date().toISOString(); // Get current date in ISO format
                    localStorage.setItem('saved_game', sg); // Save to localStorage
                    console.log('Game saved on:', currentDate);
                    // console.log(sg);
                    this.toast({
                        icon: "/assets/map/icons/star.png",
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
        cityMenuAction(name) {
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
                    Units_1.updatePopulationAndProductionRates(player, improvement);
                }
            }
            if (name === "decrease_taxes") {
                if (player.taxRate - 0.1 < 0) {
                    return;
                }
                player.taxRate -= 0.1;
                for (const [key, improvement] of Object.entries(player.improvements)) {
                    Units_1.updatePopulationAndProductionRates(player, improvement);
                }
            }
            if (name === "start_city") {
                player.gold -= 100;
                this.placingCity = true;
                this.setActionPanel(`<div class="action-menu" data-name="">Select a location to place city</div> or <div class="action-menu" data-name="create_city_cancel">Cancel</div>`);
                this.menuPanel.style.visibility = "hidden";
            }
            if (name === "buy_land") {
                player.gold -= 40;
                this.buyingLand = tile.improvement.id;
                this.setActionPanel(`<div class="action-menu" data-name="">Select a location to buy land</div> or <div class="action-menu" data-name="buy_land_cancel">Cancel</div>`);
                this.menuPanel.style.visibility = "hidden";
            }
            let unit_type = "";
            let unit_terrain = "land";
            if (name === "buy_rifleman") {
                let unit_type = "rifleman";
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
                GameState_1.DeclareWarBetweenPlayers(this._gameState, player, targetPlayer);
                this.toast({
                    icon: "/assets/map/icons/star.png",
                    text: `War between ${player.name} and ${targetPlayer.name} declared!`,
                    onClick: function () { }
                });
                this.menuPanel.style.visibility = "hidden";
                console.log(this._gameState);
                return;
            }
            if (name === "declare_peace") {
                GameState_1.DeclarePeaceBetweenPlayers(this._gameState, player, targetPlayer);
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
                        icon: "/assets/map/icons/star.png",
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