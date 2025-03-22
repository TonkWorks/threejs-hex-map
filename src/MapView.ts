import THREE, { Audio, AudioListener, PerspectiveCamera, Scene, WebGLRenderer, Vector3, Group, Camera, Mesh, BoxBufferGeometry, MeshBasicMaterial, Object3D, SpotLight, CylinderGeometry, AdditiveBlending, DoubleSide, Color, TextureLoader, AudioLoader, PCFSoftShadowMap, SpotLightHelper, RingBufferGeometry, CanvasTexture, SpriteMaterial, Sprite, Float32BufferAttribute, BufferGeometry, LineBasicMaterial, LineSegments, Vector2, LineDashedMaterial, ArrowHelper, Line, FrontSide, PMREMGenerator, MathUtils } from 'three';
import { generateRandomMap } from "./map/map-generator"
import MapMesh from "./map/MapMesh"
import { TextureAtlas, TileData, TileDataSource, QR, isMountain, isWater, isHill, isForest } from './interfaces';
import { loadFile, getRandomInt, updateMaterialColor, deepCopy, loadTextureAtlas, asset, capitalize, deepCopyIgnoring } from "./util"
import Grid from './map/Grid';
import DefaultTileSelector from "./map/DefaultTileSelector"
import { AttackArrow, DefaultTileHoverSelector, hoverSelectorMaterial } from "./map/DefaultTileHoverSelector"
import { createCityOverlayModel, CreateResourceModel, createTerritoryOverlayModel, createTileOverlayModel, createUnit, CreateYieldModel, getNextCityName, HeathBarDivHtml, LoadSavedUnit, Resource, ResourceMap, RisingText, updateLabel, updateUnitHealthBar } from "./Units"
import DefaultMapViewController from "./DefaultMapViewController"
import MapViewController from './MapViewController';
import { MapViewControls } from './MapViewController';
import { qrToWorld, axialToCube, roundToHex, cubeToAxial, mouseToWorld } from './map/coords';
import ChunkedLazyMapMesh from "./ChunkedLazyMapMesh";
import { MapMeshOptions } from './map/MapMesh';
import { Explosion, FireWithSmoke, HexDust, MainParticleEffects, NuclearExplosion, Rocket, SelectionParticles, SelectionParticlesFromGeometry } from './ParticleSystemEffects';
import { ParticleSystem, ParticleSystems } from './ParticleSystem';

import { Unit, Improvement, CreateCity, UnitMap } from './Units';
import { cloneGameState, DeclarePeaceBetweenPlayers, DeclareWarBetweenPlayers, DiplomaticAction, GameState, GetDiplomaticActionsSummary, TurnToYear, InitGameState, Player, DiplomaticSummary } from './GameState';
import { CSS3DRenderer, CSS3DObject } from './CSS3DRenderer';
import { takeTurn } from './AI';

import Toastify from './third/toastify';
import { Nations } from './Nations';
import { AIChooseResearch, DisplayResearchFinished, RenderTechTree, Technologies, Technology } from './Research';
import AnimatedSelector, { LightOfGod, Selector, Selectors, WhiteOutline } from './Selector';

import { BloomEffect, EffectComposer, EffectPass, RenderPass, SMAAEffect, VignetteEffect } from './third/postprocessing.esm';
import * as Stats from './third/stats';
import { Sky  } from './third/Sky';

import { getHexPoints } from './map/hexagon';
import { ThickLine } from './third/thickLine';
import { GovernmentsMap } from './Governments';
import { ResetNegotiations, TradeMenuButtonClicked, TradeMenuHtml } from './PlayerNegotiations';
import { BuildingMap } from './CityImprovements';
import { CreateWorkerImprovement, WorkerImprovement } from './ImprovementsWorker';
import { RawShaderMaterial, Triangle } from './three';

// import * as postProcessing from './src/third/postprocessing'
declare const tsParticles: any;

export function icon(resource: string) {
    return `<img id="menu-unit-cost" src="../../assets/ui/resources/${resource}.png">`
}
export function resourceIcon(resource: string) {
    return `<img id="menu-unit-cost" src="../../assets/map/resources/${resource}.png">`
}

// declare const postProcessing: any;
export default class MapView implements MapViewControls, TileDataSource {
    private static DEFAULT_ZOOM = 25

    private _camera: PerspectiveCamera
    private _minimap_camera: PerspectiveCamera
    private _scene: Scene
    private _renderer: WebGLRenderer
    private _minimap_renderer: WebGLRenderer
    private _labelRenderer: CSS3DRenderer
    private _scrollDir = new Vector3(0, 0, 0)
    private _lastTimestamp = Date.now()
    private _zoom: number = 25
    private _canvas: HTMLCanvasElement
    private _mapMesh: Object3D & TileDataSource
    private _chunkedMesh: ChunkedLazyMapMesh
    private _tileGrid: Grid<TileData> = new Grid<TileData>(0, 0)

    private _tileSelector: Object3D = DefaultTileSelector
    private _hoverSelector: Object3D = DefaultTileHoverSelector
    private _arrow: Object3D = null

    private _controller: MapViewController = new DefaultMapViewController()
    _selectedTile: TileData
    private _hoveredTile: TileData

    _selectedUnit: Unit

    private _listener: AudioListener;

    private _pathIndicators: Group = new Group();
    private _units: Map<string, Unit> = new Map();
    _gameState: GameState = InitGameState();
    private _savedGame: any = null;
    private _onTileSelected: (tile: TileData) => void
    private _onLoaded: () => void
    private _onAnimate: (dtS: number) => void = (dtS) => { }
    private _text_input_callback: (text: string) => void

    private _minimap_aspect_width = 400;
    private _minimap_aspect_height = 275;

    private borders: any = {};
    private composer: any = null;
    private stats: any = null;
    private settings: any = {};

    _units_models: Group = new Group()
    _movement_overlay: Group = new Group();
    _ui_map_expansion: Group = new Group()
    _ui_map_temp_models: Group = new Group()
    _ui_selectors: Group = new Group()
    in_city_menu: boolean = false;
    keep_menu: boolean = false;

    unitInfoPanel: HTMLElement = null;
    unitInfoCache = "";
    unitInfoIndex = "";
    buyingLand = "";
    gameStatePanel: HTMLElement = null;
    menuPanel: HTMLElement = null;
    actionPanel: HTMLElement = null;
    resourcePanel: HTMLElement = null;
    sectionHalo: LightOfGod = null;
    _lastMinimapUpdate: number = 0;

    _renderMinimap: boolean = true;

    get controller() {
        return this._controller
    }

    get canvas() {
        return this._canvas
    }

    get gameState(): GameState {
        return this._gameState;
    }

    get zoom() {
        return this._zoom
    }

    getZoom(): number {
        return this._zoom
    }

    set zoom(value: number) {
        this.setZoom(value)
    }

    get selectedTile(): TileData {
        return this._selectedTile
    }

    getTileGrid(): Grid<TileData> {
        return this._tileGrid
    }

    getSaveGame() {
        const gc: Partial<GameState> = cloneGameState(this._gameState);
        return {
            "gameState": gc,
            "grid": this._tileGrid.exportData(),
            "selectedTile": { q: this._selectedTile.q, r: this._selectedTile.r }
        };
    }

    get mapMesh(): MapMesh {
        return this._mapMesh as MapMesh
    }

    /**
     * Sets up the camera with the given Z position (height) and so that the view center (the point the camera is pointed at) doesn't change.
     */
    setZoom(z: number) {
        this._camera.updateMatrixWorld(false)

        // position the camera is currently centered at
        const lookAt = this.getViewCenter()

        // move camera along the Z axis to adjust the view distance
        this._zoom = z
        this._camera.position.z = z
        this._camera.updateMatrixWorld(true)

        if (lookAt != null) {
            // reposition camera so that the view center stays the same
            this._camera.position.copy(this.getCameraFocusPositionWorld(lookAt))
        }

        return this
    }

    get scrollDir() {
        return this._scrollDir
    }

    set onTileSelected(callback: (tile: TileData) => void) {
        this._onTileSelected = callback
    }

    set onLoaded(callback: () => void) {
        this._onLoaded = callback
    }

    set onAnimate(callback: (dtS: number) => void) {
        if (!callback) {
            throw new Error("Invalid onAnimate callback")
        }
        this._onAnimate = callback
    }

    setOnAnimateCallback(callback: (dtS: number) => void) {
        this.onAnimate = callback
    }

    public scrollSpeed: number = 10

    constructor(canvasElementQuery: string = "canvas") {
        const canvas = this._canvas = document.querySelector(canvasElementQuery) as HTMLCanvasElement
        const camera = this._camera = new PerspectiveCamera(30, window.innerWidth / window.innerHeight, 2, 10000)
        const minimap_camera = this._minimap_camera = new PerspectiveCamera(30, window.innerWidth / window.innerHeight, 2, 10000)
        const scene = this._scene = new Scene()
        const renderer = this._renderer = new WebGLRenderer({
            canvas: canvas,
            // devicePixelRatio: window.devicePixelRatio
        })

        renderer.setClearColor(0x6495ED);
        renderer.setSize(window.innerWidth, window.innerHeight)


        const minimapRenderer = this._minimap_renderer = new WebGLRenderer({
            // devicePixelRatio: window.devicePixelRatio
        })
        minimap_camera.layers.set(10);

        minimapRenderer.setSize(this._minimap_aspect_width, this._minimap_aspect_height); // Set the size of the minimap
        minimapRenderer.domElement.style.position = 'absolute';
        minimapRenderer.domElement.style.bottom = '0px';
        minimapRenderer.domElement.style.left = '0px';
        minimapRenderer.domElement.style.zIndex = '1000';
        minimapRenderer.domElement.style.border = '2px solid #d4af37';

        minimapRenderer.domElement.id = 'minimap';
        document.body.appendChild(minimapRenderer.domElement);


        const labelRenderer = new CSS3DRenderer();
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0px';
        labelRenderer.domElement.style.pointerEvents = 'none';
        this._labelRenderer = labelRenderer;
        document.body.appendChild(labelRenderer.domElement);

        // setup camera
        camera.rotation.x = Math.PI / 4.5
        minimap_camera.rotation.x = 0
        this.setZoom(MapView.DEFAULT_ZOOM)
        this.focus(0, 0)

        this._minimap_camera.aspect = this._minimap_aspect_width / this._minimap_aspect_height;
        this._minimap_camera.updateProjectionMatrix();


        // sky
        const sun = new Vector3();

        const sky = new Sky();
        sky.scale.setScalar(10000);
        scene.add(sky);

        const parameters = {
            elevation: 2,
            azimuth: 180,
        };
        const pmremGenerator = new PMREMGenerator(renderer);

        const skyUniforms = (sky.material as any).uniforms;
        skyUniforms['turbidity'].value = 10;
        skyUniforms['rayleigh'].value = 2;
        skyUniforms['mieCoefficient'].value = 0.005;
        skyUniforms['mieDirectionalG'].value = 0.8;

        function updateSun() {
            const phi = MathUtils.degToRad(90 - parameters.elevation);
            const theta = MathUtils.degToRad(parameters.azimuth);

            sun.setFromSphericalCoords(1, phi, theta);

            scene.add(sky);

            scene.environment = pmremGenerator.fromScene(scene).texture;
        }

        updateSun();

        // hover selector
        this._hoverSelector.position.setZ(0.0001)
        this._scene.add(this._hoverSelector)
        this._hoverSelector.visible = true

        // tile selector
        this._tileSelector.position.setZ(0.02)
        this._scene.add(this._tileSelector)
        this._tileSelector.visible = true
        this._scene.add(this._pathIndicators);

        // audio
        this._listener = new AudioListener();
        this._camera.add(this._listener as any as Object3D);

        // units
        this._scene.add(this._units_models)
        this._scene.add(this._movement_overlay)
        this._scene.add(this._ui_map_temp_models)
        this._scene.add(this._ui_selectors)
        this._scene.add(this._ui_map_expansion)


        this.stats = Stats.default();
        this.stats.dom.style.top= '35px';
        this.stats.dom.style.left= '';
        this.stats.dom.style.right= '0px';

        // Setup EffectComposer
        this.composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(this._scene, this._camera);
        this.composer.addPass(renderPass);

        // Add Bloom effect
        const bloomEffect = new BloomEffect({
            intensity: 2,
            luminanceThreshold: 0.85,
            luminanceSmoothing: 0.2,
        });
        const bloomPass = new EffectPass(this._camera, bloomEffect);
        this.composer.addPass(bloomPass);

        const vg = new VignetteEffect({ offset: 0.2, darkness: 0.6 });
        this.composer.addPass(new EffectPass(this._camera, vg));

        // // Add SMAA anti-aliasing
        // const smaaEffect = new SMAAEffect();
        // const smaaPass = new EffectPass(this._camera, smaaEffect);
        // this.composer.addPass(smaaPass);

        window.addEventListener('resize', (e) => this.onWindowResize(e), false);
        // start rendering loop
        this.animate(0)
        this._controller.init(this, canvas)
    }

    load(tiles: Grid<TileData>, options: MapMeshOptions) {
        this._tileGrid = tiles
        this._selectedTile = this._tileGrid.get(0, 0)

        if ((tiles.width * tiles.height) < Math.pow(512, 2)) {
            const mesh = this._mapMesh = new MapMesh(tiles.toArray(), options) //, tiles)
            this._scene.add(this._mapMesh)
            mesh.loaded.then(() => {
                this._onLoaded()
            })
        } else {
            // const mesh = this._mapMesh = this._chunkedMesh = new ChunkedLazyMapMesh(tiles, options)
            // this._scene.add(this._mapMesh)
            // mesh.loaded.then(() => {
            //     if (this._onLoaded) this._onLoaded()
            // })
            // console.info("using ChunkedLazyMapMesh with " + mesh.numChunks + " chunks for " + (tiles.width * tiles.height) + " tiles")
        }
    }

    // standard map options
    async getMapOptions(): Promise<MapMeshOptions> {
        const textureLoader = new TextureLoader()
        const loadTexture = (name: string) => {
            const texture = textureLoader.load(asset(name))
            texture.name = name
            return texture
        }

        const options: MapMeshOptions = {
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
            gridColor: new Color(0x42322b),
            gridOpacity: 0.25,

            // options per tree index, varying the different kinds of trees a little
            treeOptions: [
                undefined, // leave default options for trees with index 0 (temperate zone forests)
                { // tundra trees
                    treesPerForest: 25
                },
                { // snowy trees
                    treesPerForest: 10,
                    scale: 0.85
                } // no options for tropical forests (index = 3)
            ]
        }
        const atlas = await loadTextureAtlas();
        options.terrainAtlas = atlas
        return options;
    }

    async loadFromJSON(json: any) {
        const options = await this.getMapOptions();
        this._savedGame = json;
        const tiles = Grid.fromJSON<TileData>(json);
        this.load(tiles, options);
    }

    updateTiles(tiles: TileData[]) {
        this._mapMesh.updateTiles(tiles)

        this.updateAllVisilibility();
        for (let player of Object.values(this._gameState.players)) {
            this.updateBorderOverlay(player);
        }
    }

    updateAllVisilibility() {
        let tiles = this.getTileGrid().toArray();
        let revealed_goodie_hut = null;

        for (const tile of tiles) {
            if (tile.clouds) {
                continue;
            };
            if (tile.fog == true) {
                if (tile.unit !== undefined) {
                    tile.unit.model.visible = false;
                    if (tile.unit.type === "goodie_hut") {
                        tile.unit.model.visible = true;
                    }
                }
            }
            if (tile.fog == false) {
                if (tile.unit !== undefined) {
                    if (tile.unit.type === "goodie_hut" && tile.unit.model.visible === false) {
                        revealed_goodie_hut = tile;
                    }
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

        if (revealed_goodie_hut) {
            let sound = "";
            for (let tile of tiles) {
                if (tile.unit && tile.unit.type === "goodie_hut") {
                    sound = asset("sounds/units/rank_up.mp3");
                }
            }
            if (sound !== "") {
                this.playSound(sound);
            }
            const mm = this;
            this.toast({
                icon: "../../assets/map/icons/star.png",
                text: "Goodie Hut Discovered",
                onClick: function () {
                    mm.selectTile(revealed_goodie_hut);
                    this._controller.PanCameraTo({q: mm.selectedTile.q, r: mm.selectedTile.r - 3}, 600);
                }
            });
        }
    }
    addUnitToMap(unit: Unit, tile: TileData, fromSaved: boolean = false) {
        // Bad Cases
        if (tile === undefined) {
            console.log("cannot add unit; no tile");
            return;
        }

        if (tile.unit !== undefined) {
            console.log("cannot add unit; already occupied");
            return;
        }
        if (isMountain(tile.height)) {
            console.log("cannot place on mountain");
            return;
        }
        // if (isWater(tile.height)) {
        //     console.log("cannot place in water");
        //     return;
        // }

        const worldPos = qrToWorld(tile.q, tile.r);
        if ((tile.fog || tile.clouds) && unit.owner !== this.gameState.currentPlayer) {
            unit.model.visible = false;
        }
        unit.model.position.set(worldPos.x, worldPos.y - .4, unit.offset + .2);

        let player = this.getPlayer(unit.owner);
        player.units[unit.id] = unit;

        tile.unit = unit
        unit.tileInfo = { q: tile.q, r: tile.r };
        this._units_models.add(unit.model);

        if (fromSaved) {
            return
        }
        this.updateResourcePanel();
        this.updateGameStatePanel();
    }

    addImprovementToMap(improvement: Improvement, tile: TileData, fromSaved: boolean = false) {
        // Bad Cases
        if (tile.improvement !== undefined) {
            console.log("cannot add improvement; already occupied");
            return;
        }
        if (isMountain(tile.height)) {
            console.log("cannot place on mountain");
            return;
        }
        if (isWater(tile.height)) {
            console.log("cannot place in water");
            return;
        }

        let player = this.getPlayer(improvement.owner);
        player.improvements[improvement.id] = improvement;

        const worldPos = qrToWorld(tile.q, tile.r);
        improvement.model.position.set(worldPos.x, worldPos.y, .4);
        improvement.tileInfo = { q: tile.q, r: tile.r };
        tile.improvement = improvement


        let overlayCity = createCityOverlayModel();
        this._units_models.add(overlayCity);
        overlayCity.layers.disable(0);
        overlayCity.position.set(worldPos.x, worldPos.y - .4, 0.3);
        overlayCity.layers.enable(10);
        tile.improvementOverlay = overlayCity;
        tile.city = improvement.id;
        // update tile ownership of  this and surrounding
        const tiles = this.getTileGrid().neighbors(tile.q, tile.r, 1)
        tiles.push(tile);
        for (const t of tiles) {
            t.owner = improvement.owner;
            this.addTerritoryOverlay(t, improvement.id, player);
        }
        this.updateBorderOverlay(player);
        this._units_models.add(improvement.model);

        if (fromSaved) {
            return
        }
        const mm = this;
        if (this.gameState.currentPlayer === improvement.owner) {
            this.toast({
                icon: "../../assets/map/icons/star.png",
                text: `${improvement.name} founded by ${player.name}`,
                onClick: function () {
                    mm.selectTile(tile);
                    mm.panCameraTo(mm.selectedTile.q + 1, mm.selectedTile.r - 3)
                }
            });
        }

        if (!improvement.nextTile) {
            let tiles = this.getEligibleTilesForExpansion(tile);
            if (tiles.length > 0) {
                let t = this.getBestYield(tiles, tile)[0]
                improvement.nextTile = { q: t.q, r: t.r }
            }
        }
        this.updateCityLabel(tile);
        // check for cuttoff tiles
        this.checkForCutOffTiles(tile);

        this.updateResourcePanel();
        this.updateGameStatePanel();
    }

    addWorkerImprovementToMap(workerImprovement: WorkerImprovement, tile: TileData, fromSaved: boolean = false) {
        const worldPos = qrToWorld(tile.q, tile.r);
        workerImprovement.model.position.set(worldPos.x, worldPos.y, .3);
        workerImprovement.tileInfo = { q: tile.q, r: tile.r };
        tile.worker_improvement = workerImprovement
        this._units_models.add(workerImprovement.model);
        if (!tile.clouds) {
            workerImprovement.model.visible = true;
        }
    }

    addTerritoryOverlay(t: TileData, city_id: string, player: Player) {
        if (t.territoryOverlay) {
            if (t.territoryOverlay.parent) {
                t.territoryOverlay.parent.remove(t.territoryOverlay);
            }
        }

        t.city = city_id;
        t.territoryOverlay = createTerritoryOverlayModel(player);
        this._units_models.add(t.territoryOverlay);
        const tworldPos = qrToWorld(t.q, t.r);
        t.territoryOverlay.position.set(tworldPos.x, tworldPos.y, 0.001);
        // this.updateTiles([t]);
    }


    addTerritoryOverlayFilterById(t: TileData, city_id: string, player: Player) {
        const tiles = this.getTileGrid().neighbors(t.q, t.r, 4)
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

    updateBorderOverlay(player: Player) {
        const ownedTiles = this._tileGrid.toArray().filter(t => t.owner === player.name);
        this.updateTerritoryBorderOverlay(ownedTiles, player);
    }

    updateAllTerritoryOverlays() {
        for (const player of Object.values(this._gameState.players)) {
            const ownedTiles = this._tileGrid.toArray().filter(t => t.owner === player.name);
            for (const t of ownedTiles) {
                if (!t.territoryOverlay) {
                    t.territoryOverlay = createTerritoryOverlayModel(player);
                    this._units_models.add(t.territoryOverlay);
                    const tworldPos = qrToWorld(t.q, t.r);
                    t.territoryOverlay.position.set(tworldPos.x, tworldPos.y, 0.001);
                }
            }
        }
    }

    updateTerritoryBorderOverlay(ownedTiles: TileData[], player: Player) {
        // Remove any old border overlay
        if (this.borders[player.name]) {
            this._units_models.remove(this.borders[player.name]);
        }
    
        // Array to store separate border lines
        const borderLines: Vector3[][] = [];
    
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
            if (tile.clouds) continue;
    
            const center = qrToWorld(tile.q, tile.r);
            const hexPoints = getHexPoints(center.x, center.y, 1);
    
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
                        new Vector3(innerP1.x, innerP1.y, 0.01),
                        new Vector3(innerP2.x, innerP2.y, 0.01)
                    ]);
                }
            }
        }
    
        // Merge adjacent border segments into continuous paths
        const mergedPaths = this.mergeBorderLines(borderLines);
    
        // Create a separate ThickLine object for each continuous border path
        const allBorders = new Group();
        mergedPaths.forEach(path => {
            const thickLine = new ThickLine(path, {
                linewidth: 3,
                color: player.color,
                resolution: new Vector2(window.innerWidth, window.innerHeight)
            });
            allBorders.add(thickLine);
        });
        allBorders.layers.enable(10);
        this.borders[player.name] = allBorders;
        this._units_models.add(allBorders);
    }
    
    private mergeBorderLines(lines: Vector3[][]): Vector3[][] {
        const mergedPaths: Vector3[][] = [];
        const processed = new Set<number>();
        const epsilon = 0.001;
    
        const arePointsEqual = (a: Vector3, b: Vector3): boolean => {
            return Math.abs(a.x - b.x) < epsilon &&
                   Math.abs(a.y - b.y) < epsilon &&
                   Math.abs(a.z - b.z) < epsilon;
        };
    
        for (let i = 0; i < lines.length; i++) {
            if (processed.has(i)) continue;
    
            let path: Vector3[] = [...lines[i]];
            processed.add(i);
    
            // Extend path forward
            let currentEnd = path[path.length - 1];
            let found = true;
            while (found) {
                found = false;
                for (let j = 0; j < lines.length; j++) {
                    if (processed.has(j)) continue;
                    const segment = lines[j];
                    if (arePointsEqual(segment[0], currentEnd)) {
                        path.push(segment[1]);
                        processed.add(j);
                        currentEnd = segment[1];
                        found = true;
                        break;
                    } else if (arePointsEqual(segment[1], currentEnd)) {
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
                    if (processed.has(j)) continue;
                    const segment = lines[j];
                    if (arePointsEqual(segment[1], currentStart)) {
                        path.unshift(segment[0]);
                        processed.add(j);
                        currentStart = segment[0];
                        found = true;
                        break;
                    } else if (arePointsEqual(segment[0], currentStart)) {
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
    
    addResourceToMap(resourceName: string, tile: TileData) {
        let resource = ResourceMap[resourceName];
        // Bad Cases
        if (tile.resource !== undefined) {
            console.log("cannot add resource; already occupied");
            return;
        }
        if (isMountain(tile.height)) {
            console.log("cannot place on mountain");
            return;
        }
        if (isWater(tile.height)) {
            console.log("cannot place in water");
            return;
        }


        const worldPos = qrToWorld(tile.q, tile.r);
        resource = CreateResourceModel(resource);
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
                this.addWorkerImprovementToMap(
                    CreateWorkerImprovement(type, index), tile);
            }

            for (const [key, player] of Object.entries(this._gameState.players)) {
                for (const improvementData of Object.values(player.improvements)) {
                    const improvement = CreateCity(player, improvementData.name, improvementData.id);
                    improvement.id = improvementData.id;
                    improvement.population = improvementData.population;
                    let t = this.getTile(improvementData.tileInfo.q, improvementData.tileInfo.r)
                    // t.improvement = undefined;
                    this.addImprovementToMap(improvement, t, true);
                }
                for (const unitData of Object.values(player.units)) {
                    const unit = LoadSavedUnit(unitData, player);
                    let t = this.getTile(unitData.tileInfo.q, unitData.tileInfo.r)
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
        let new_game_settings: { resources?: number } = {};
        if (new_game_settingsStr) {
            new_game_settings = JSON.parse(new_game_settingsStr);
            console.log(new_game_settings);
            localStorage.removeItem("new_game_settings");
        }
        // set up initial resources
        const resourceNames = Object.keys(ResourceMap);
        let amount = 200;
        if (new_game_settings.resources) {
            amount = new_game_settings.resources;
        }
        for (let i = 0; i < amount; i++) {
            let tile = this.getRandomTile(false);
            if (tile && tile.resource === undefined && !isMountain(tile.height) && !isWater(tile.height)) {
                // get random from resource map
                const name = resourceNames[Math.floor(Math.random() * resourceNames.length)];
                this.addResourceToMap(name, tile);
            }
        }

        // set initial yields
        for (let tile of this._tileGrid.toArray()) {
            tile.yields = { "gold": 0 }
            switch(tile.terrain) {
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
            if (isMountain(tile.height)) {
                tile.yields = { }
            }
            if (tile.rivers) {
                tile.yields["food"] += 2;
            }
            if (isHill(tile.height)) {
                tile.yields['gold'] += 1;
            }
            if (tile.resource) {
                tile.yields['gold'] += tile.resource.gold;
            }
        }

        // set up players initial locations
        for (const [key, player] of Object.entries(this._gameState.players)) {
            if (player.isBarbarian) {
                continue
            }
            const startTile = this.getRandomTile(true);
            const improvement = CreateCity(player)
            this.addImprovementToMap(improvement, startTile);
            this.updatePopulationAndProductionRates(player, improvement);
            this.updateCityLabel(startTile);
            const unit = createUnit("rifleman", player);
            this.addUnitToMap(unit, startTile);

            if (player.name === this._gameState.currentPlayer) {
                this.selectTile(startTile);
            }
        }
        

        // set up good huts / barbarians
        amount = 200;
        // if (new_game_settings.resources) {
        //     amount = new_game_settings.resources;
        // }
        for (let i = 0; i < amount; i++) {
            let tile = this.getRandomTile(false);
            if (tile && tile.unit === undefined && !isMountain(tile.height) && !isWater(tile.height)) {
                // get random from resource map

                this.addUnitToMap(createUnit("goodie_hut", this._gameState.players['barbarians']), tile);
            }
        }

        this.updateGlobalFog();
        this.addUnitSelectors();
        this.showTurnBanner();
    }

    toast({ text, icon, onClick }: { text: string; icon: string; onClick: () => void }): void {
        // this.playSound(asset("sounds/ui/notification.mp3"));
        new Toastify({
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
    getPlayer(name: string) {
        return this._gameState.players[name];
    }
    getTile(q: number, r: number) {
        // return this._mapMesh.getTile(q, r);
        return this._tileGrid.get(q, r)
    }

    private animate = (timestamp: number) => {
        this.stats.begin();
        const dtS = (timestamp - this._lastTimestamp) / 1000.0

        const camera = this._camera
        const zoomRelative = camera.position.z / MapView.DEFAULT_ZOOM
        const scrollOffset = this._scrollDir.clone().normalize().multiplyScalar(this.scrollSpeed * zoomRelative * dtS)

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

        this._onAnimate(dtS)

        // if (this._mapMesh && (this._mapMesh as MapMesh).waterMaterial) {
        //     (this._mapMesh as MapMesh).waterMaterial.uniforms.sineTime.value = timestamp / 900;
        //     (this._mapMesh as MapMesh).waterMaterial.needsUpdate = true;
        // }
        if (this._mapMesh && (this._mapMesh as MapMesh).land) {
            let l = (this._mapMesh as MapMesh).landMaterial;
            l.uniforms.sineTime.value = dtS;
            l.needsUpdate = true;
        }
        for (const ps of ParticleSystems) {
            ps.update(dtS);
            if (!ps.isActive()) {
                ps.dispose();
            }
        }
        for (const ps of Selectors) {
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
        this._lastTimestamp = timestamp
    }

    onWindowResize(event: Event) {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(window.innerWidth, window.innerHeight);

        this._minimap_camera.updateProjectionMatrix();
        this.composer.setSize(window.innerWidth, window.innerHeight); 
        this._minimap_renderer.setSize(this._minimap_aspect_width, this._minimap_aspect_height);

        this._labelRenderer.setSize(window.innerWidth, window.innerHeight);
    }

    //----- MapViewControls -----

    setScrollDir(x: number, y: number) {
        this._scrollDir.setX(x)
        this._scrollDir.setY(y)
        this._scrollDir.normalize()
    }

    getCamera(): Camera {
        return this._camera
    }


    getMiniMapCamera(): Camera {
        return this._minimap_camera
    }

    /**
     * Returns the world space position on the Z plane (the plane with the tiles) at the center of the view.
     */
    getViewCenter(): Vector3 {
        return mouseToWorld({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 }, this._camera)
    }

    getCameraFocusPosition(pos: QR): Vector3 {
        return this.getCameraFocusPositionWorld(qrToWorld(pos.q, pos.r))
    }

    getCameraFocusPositionWorld(pos: Vector3): Vector3 {
        const currentPos = this._camera.position.clone()
        const viewCenter = this.getViewCenter()
        const viewOffset = currentPos.sub(viewCenter)

        return pos.add(viewOffset)
    }

    focus(q: number, r: number) {
        console.log("focus")
        this._camera.position.copy(this.getCameraFocusPosition({ q, r }))

    }

    panCameraTo(q: number, r:number) {
        console.log("pan")
        this._controller.PanCameraTo({q: q, r: r}, 600);

    }

    focusWorldPos(v: Vector3) {
        this._camera.position.copy(this.getCameraFocusPositionWorld(v))
    }


    hoverTile(tile: TileData, x: number, y: number) {
        this.updateToolTip(tile, x, y);
        if (this._hoveredTile === tile) return;
        this._hoveredTile = tile;

        // Clear previous arrows and path indicators
        if (this._arrow) {
            this._scene.remove(this._arrow);
            this._arrow = null;
        }
        this._pathIndicators.clear();
        this._pathIndicators.children.forEach(child => this._pathIndicators.remove(child));

        if (!tile) return;

        const worldPos = qrToWorld(tile.q, tile.r);
        let enemyTargeted = false;

        if ((tile.unit && tile.unit.owner !== this.gameState.currentPlayer) ||
            (tile.improvement && tile.improvement.owner !== this.gameState.currentPlayer)) {
            enemyTargeted = true;
            hoverSelectorMaterial.color.set(0xff0000);
            hoverSelectorMaterial.opacity = 1;
        } else {
            hoverSelectorMaterial.color.set(0xffff00);
            hoverSelectorMaterial.opacity = 0.2;
        }

        // Show attack arrow if enemy is targeted
        if (enemyTargeted && this._selectedUnit && this.selectedTile.unit && this.selectedTile.unit.owner === this.gameState.currentPlayer && this.selectedTile.unit.movement > 0) {
            const distance = getHexDistance(this.selectedTile, tile);
            if (distance <= this.selectedTile.unit.attack_range) {
                const arrow = new AttackArrow(qrToWorld(this.selectedTile.q, this.selectedTile.r), 3.5, worldPos);
                this._arrow = arrow.createCurveMesh();
                this._scene.add(this._arrow);
            }
        } else if (this._selectedUnit && this.selectedTile.unit && !tile.unit &&  !this.selectedTile.unit.moving && this.selectedTile.unit.owner === this.gameState.currentPlayer && this.selectedTile.unit.movement > 0) {
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

    selectTile(tile: TileData) {
        console.log(tile);
        const worldPos = qrToWorld(tile.q, tile.r)
        this._tileSelector.position.set(worldPos.x, worldPos.y, 0.01)
        this._selectedTile = tile
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
                this.sectionHalo = new LightOfGod();
                tile.unit.model.add(this.sectionHalo.group);
                this.updateUnitInfoForTile(tile);
                this.addUnitMovementBorder(tile.unit);
                // HexDust(this._scene, worldPos);
            }
            else if (this._selectedUnit === tile.unit) {
                this._selectedUnit = undefined;
            }
        }

        // let player = this.getPlayer(this.gameState.currentPlayer);
        if (this._onTileSelected) {
            this._onTileSelected(tile)
        }
    }

    actionTile(tile: TileData) {
        // console.log("action point", qrToWorld(tile.q, tile.r));

        // Bad Cases
        if (this.selectedTile.q === tile.q && this.selectedTile.r === tile.r) {
            return;
        }


        const worldPos = qrToWorld(tile.q, tile.r);
        const from = qrToWorld(this.selectedTile.q, this.selectedTile.r);


        // RisingText(this._scene, worldPos, "+1");
        
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
        // MainParticleEffects.createObjectCreation(worldPos, this._scene);
        if (this._selectedUnit !== undefined && this.selectedTile.unit !== undefined && this.selectedTile.unit.owner === this.gameState.currentPlayer) {
            this.moveUnit(this.selectedTile, tile, true)
        }
    }

    updateGlobalFog() {
        const tileGrid = this.getTileGrid();
        const noFogKeys = new Set<string>();
        if (this.settings.dev_mode === true) {
            let changed: TileData[] = [];
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
        
        // First pass: collect visibility sources (player's tiles, units, hills)
        const visibilitySources: {tile: TileData, range: number}[] = [];
        
        tileGrid.toArray().forEach((tile) => {
            // Skip tiles with clouds
            // if (tile.clouds === true) return;
            
            // If the tile is owned by the current player, add as visibility source with range 1
            if (tile.owner && tile.owner === this.gameState.currentPlayer) {
                visibilitySources.push({tile, range: 2});
            }
            
            // If a unit on the tile belongs to the current player, add as visibility source with range 1
            if (tile.unit && tile.unit.owner === this.gameState.currentPlayer) {
                let range = 2;
                if (isHill(tile.height)) {
                    range = 3;
                }
                visibilitySources.push({tile, range: range});
            }
        });
        
        // Function to check if line of sight is blocked by mountains
        const isLineOfSightBlocked = (fromQ: number, fromR: number, toQ: number, toR: number) => {
            // Get tiles along the line between source and target
            const line = tileGrid.line(fromQ, fromR, toQ, toR);
            
            // Skip the first tile (the source tile)
            for (let i = 1; i < line.length - 1; i++) {
                const intermediateTile = line[i];
                if (isMountain(intermediateTile.height)) {
                    return true; // Line of sight is blocked by a mountain
                }
            }
            
            return false; // No mountains blocking the line of sight
        };
        
        // Process each visibility source
        visibilitySources.forEach(({tile: sourceTile, range}) => {
            // Mark the source tile itself as visible
            noFogKeys.add(`${sourceTile.q},${sourceTile.r}`);
            
            // Get neighbors within range
            const neighbors = tileGrid.neighbors(sourceTile.q, sourceTile.r, range);
            
            // Check each neighbor for line of sight
            neighbors.forEach(neighborTile => {
                // If line of sight is not blocked by mountains, mark as visible
                if (!isLineOfSightBlocked(sourceTile.q, sourceTile.r, neighborTile.q, neighborTile.r)) {
                    noFogKeys.add(`${neighborTile.q},${neighborTile.r}`);
                }
            });
        });
        
        // Second pass: update fog state based on the precomputed no-fog set
        const changed: TileData[] = [];
        tileGrid.toArray().forEach((tile) => {
            const shouldHaveFog = !noFogKeys.has(`${tile.q},${tile.r}`);
            if (tile.fog !== shouldHaveFog) {
                tile.fog = shouldHaveFog;
                tile.clouds = false;
                changed.push(tile);
            }
        });
        this.updateTiles(changed);
    }

    setFogAround(tile: TileData, range: number, fog: boolean) {
        const tiles = this.getTileGrid().neighbors(tile.q, tile.r, range)
    
        const updated = tiles.map(t => {
            t.fog = fog
            t.clouds = false;
            return t
        })
        this.updateTiles(updated)
    }

    updateToolTip(tile: TileData, x: number, y: number) {
        const tooltip = document.getElementById("tooltip");

        if (tile === undefined) {
            tooltip.style.visibility = "hidden";
            return;
        }
        if (tile.clouds) {
            tooltip.style.visibility = "hidden";
            return;
        }

        tooltip.innerHTML = ""

        tooltip.style.left = x + 30 + "px"; // Offset to avoid cursor overlap
        tooltip.style.top = y + "px";
        let data = []
        
        let battleInfo = this.generateBattleInfo(tile);
        if (battleInfo !== "") {
            data.push(battleInfo);
        }

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

    updateToolTipFromDiv(target: String, x: number, y: number) {
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
            let diplomaticSummary = GetDiplomaticActionsSummary(this._gameState, player);
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

    private generateTileInfo(tile: TileData): string {
        let height = '';
        if (tile.height > 0) {
            let rounded = Math.round(tile.height * 100) / 100;
            height += `<tr><th>Height</th><td>${rounded}</td></tr>`
        }
        let allYields = this.getTotalYieldsForTile(tile);
        let improvement_info = "";
        if (tile.worker_improvement) {
            improvement_info += "<tr><th>Improvement</th><td>" + capitalize(tile.worker_improvement.type) + "</td></tr>";
        }

        let yields = '<tr>';
        for (const [key, value] of Object.entries(allYields)) {
            if (value > 0) {
                yields += `<td>${icon(key)}</br>${value}</td>`
            }
        }
        yields += `</tr>`;

        let features: string[] = [];
        let features_info = '';
        if (tile.rivers) {
            features = ["Freshwater", "Navigable River"]
        }
        if (isHill(tile.height)) {
            features.push("Hills")
        }
        if (isForest(tile)) {
            features.push("Forests")
        }
        if (features.length > 0) {
            features_info = `<tr><th>Features</th><td>${features.join(", ")}</td></tr>`
        }

        let cityInfo = "";
        if (tile.city) {
            let name = this.gameState.players[tile.owner].improvements[tile.city].name;
            cityInfo = `<tr><th>City</th><td>${name}</td></tr>`
        }
        return `
            <div>
                <b>${capitalize(tile.terrain)}</b>
                <div style="display: flex; align-items: left;">
                    <table style="margin-right: 10px; text-align: left;">
                        ${yields}
                        ${features_info}
                        ${improvement_info}
                        </hr>
                        ${tile.owner ? `<tr><th>Owner</th><td>${tile.owner}</td></tr>` : ''}
                        ${cityInfo}
                    </table>
                </div>
            </div>`;
    }

    private generateBattleInfo(tile: TileData): string {
        if (tile.unit === undefined && tile.improvement === undefined) {
            return "";
        }
        if (!this._selectedUnit || this._selectedUnit === undefined) {
            return "";
        }
        if (tile.improvement && tile.improvement.owner === this._selectedUnit.owner) {
            return "";
        }
        if (tile.unit && tile.unit.owner === this._selectedUnit.owner) {
            return "";
        }

        let atckerTile = this.getTile(this._selectedUnit.tileInfo.q, this._selectedUnit.tileInfo.r);
        
        if (tile.unit && tile.unit.type === "goodie_hut") {
            return ``;
        }
        let [dmg, defenderDmg, description] = this.battleAssessment(atckerTile, tile);
        let battleInfo = `<div>
            ${description}
        </div>`;
        return battleInfo;
    }
    private generateUnitInfo(unit: Unit): string {
        if (unit.type === "goodie_hut") {
            return ``;
        }
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

    private generateImprovementInfo(improvement: Improvement): string {
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

    private generateResourceInfo(resource: Resource): string {
        return `
            <div>
                Resource
                <div style="display: flex; align-items: left;">
                    <table style="margin-right: 10px; text-align: left;">
                        <tr>
                            <td>${capitalize(resource.name)}</br>${resourceIcon(resource.name)}</td>
                        </tr>
                    </table>
                </div>
            </div>`;
    }


    moveUnit(currentTile: TileData, targetTile: TileData, playerInitiated: boolean = false) {
        if (currentTile === targetTile ) {
            if (currentTile.unit !== undefined) {
                if (currentTile.unit.owner === this._gameState.currentPlayer) {
                    if (currentTile.unit.movement > 0) {
                        this.selectTile(currentTile);
                        this._selectedUnit = currentTile.unit;
                    } else {
                        this.focusOnNextAction();
                    }
                }
            }
            return
        }

        if (currentTile.locked || targetTile.locked) {
            return
        }

        if (currentTile.unit === undefined) {
            return
        }
        if (currentTile.unit.movement < 1) {
            this.focusOnNextAction();
            return
        }
        const nextMovementTile = this.getNextMovementTile(
            currentTile.unit,
            currentTile,
            targetTile,
        );

        currentTile.unit.moving = true;

        // check for goodie hut
        if (nextMovementTile.unit !== undefined &&
            currentTile.unit !== undefined &&
            currentTile.unit.owner !== nextMovementTile.unit.owner &&
            nextMovementTile.unit.type === "goodie_hut"
        ) {
            console.log("goodie hut");
            this.goodieHut(currentTile, nextMovementTile)
            return;
        }

        // check for battling a city
        if (nextMovementTile.improvement !== undefined &&
            currentTile.unit.owner !== nextMovementTile.improvement.owner
        ) {
            console.log("urban combat");
            this.battleCity(currentTile, nextMovementTile)
            return;
        }

        // check for battling a unit
        if (nextMovementTile.unit !== undefined &&
            currentTile.unit !== undefined &&
            currentTile.unit.owner !== nextMovementTile.unit.owner
        ) {
            console.log("battle");
            console.log(nextMovementTile.unit);
            this.battle(currentTile, nextMovementTile)
            return;
        }

        // check for ranged city battle.
        if (currentTile.unit.attack_range > 1 &&
            targetTile.improvement !== undefined &&
            targetTile.improvement.owner !== currentTile.unit.owner) {

            const distance = getHexDistance(currentTile, targetTile);
            if (distance <= currentTile.unit.attack_range) {
                console.log("artillary battle city");
                this.battleCity(currentTile, targetTile)
                return;
            }
        }

        // check for ranged battle.
        if (currentTile.unit.attack_range > 1 &&
            targetTile.unit !== undefined &&
            targetTile.unit.owner !== currentTile.unit.owner) {

            const distance = getHexDistance(currentTile, targetTile);
            if (distance <= currentTile.unit.attack_range) {
                console.log("artillary battle");
                this.battle(currentTile, targetTile)
                return;
            }
        }


        if (currentTile.unit === undefined) {
            return;
        }
        nextMovementTile.unit = currentTile.unit
        currentTile.unit = undefined

        if (nextMovementTile.unit === undefined) {
            "missing unit shouldn't happen!"
            return;
        }
        nextMovementTile.unit.tileInfo = { q: nextMovementTile.q, r: nextMovementTile.r }
        nextMovementTile.unit.movement -= 1;

        if (nextMovementTile.unit.movement === 0) {
            if (nextMovementTile.unit.selector) {
                nextMovementTile.unit.selector.mesh.parent.remove(nextMovementTile.unit.selector.mesh);
                nextMovementTile.unit.selector.dispose();
                nextMovementTile.unit.selector = undefined;
            }
        }

        const worldPos = qrToWorld(nextMovementTile.q, nextMovementTile.r);
        if (playerInitiated) {
            this.playSound(asset("sounds/units/rifleman2.mp3"), nextMovementTile.unit.model.position);
            const targetPost = qrToWorld(targetTile.q, targetTile.r);
            nextMovementTile.unit.orders = "";
            HexDust(this._scene, targetPost);
        }
        if (nextMovementTile.unit.selector) {
            nextMovementTile.unit.selector.mesh.position.set(worldPos.x, worldPos.y, .02);
        }

        // check visibility
        const t = nextMovementTile;
        if (t.clouds || t.fog) {
            t.unit.model.visible = false
            for (const c of t.unit.model.children) {
                c.visible = false
            }
        } else {
            t.unit.model.visible = true
            for (const c of t.unit.model.children) {
                c.visible = true
            }
        }

        // keep selected on this unit unless clicked away
        if (this.selectedTile == currentTile) {
            this.selectTile(nextMovementTile)
        }

        if (nextMovementTile.unit.owner === this.gameState.currentPlayer) {
            //this.setFogAround(nextMovementTile, 1, false);
            this.updateGlobalFog();
        }

        animateToPosition(nextMovementTile.unit.model, worldPos.x, worldPos.y, .2, easeOutQuad, () => {
            if (nextMovementTile.unit) {
                nextMovementTile.unit.moving = false;
                nextMovementTile.unit.owner
                this.moveUnit(nextMovementTile, targetTile, false);
            }
        });
    }

    battleAssessment(currentTile: TileData, targetTile: TileData): [number, number, string] {
        let attack_bonus_descriptions = []
        let target_bonus_descriptions = []

        let currentAttackValue = currentTile.unit.attack;
        let targetAttackValue = 0;
        let targetDefenceValue = 0;
        let targetHealth = 0;
        let targetHealthStrength;
        if (targetTile.improvement) {
            targetAttackValue = 5;
            targetDefenceValue = targetTile.improvement.defence;
            targetHealth = targetTile.improvement.health;
            targetHealthStrength = targetHealth/targetTile.improvement.health_max;
        }
        if (targetTile.unit) {
            targetAttackValue = targetTile.unit.attack;
            targetDefenceValue =   targetTile.unit.defence;
            targetHealth = targetTile.unit.health;
            targetHealthStrength = targetHealth/targetTile.unit.health_max;
        }

        if (currentTile.unit.attack_range !== 1) {
            targetAttackValue = 0;
        }


        // Map Terrain Bonuses
        if (isHill(currentTile.height) && !isHill(targetTile.height)) {
            currentAttackValue *= 1.25;
            attack_bonus_descriptions.push("+25% attack - high ground (Hills)");
        }
        if (!isHill(currentTile.height) && isHill(targetTile.height)) {
            currentAttackValue *= .75;
            attack_bonus_descriptions.push("-25% attack - low ground to high ground (Hills)");
        }
        if (targetTile.rivers) {
            currentAttackValue *= .75;
            attack_bonus_descriptions.push("-25% attack - cross river");
        }
        if (isForest(targetTile)) {
            targetDefenceValue *= 1.25;
            target_bonus_descriptions.push("+25% defence - cover from forest");
        }

        // experience and bonuses
        let currentHealthStrength = currentTile.unit.health/currentTile.unit.health_max;
        if (currentHealthStrength < .30) {
            targetAttackValue *= .5;
            attack_bonus_descriptions.push("-50% attack - massivly injured unit");
        } else if (currentHealthStrength < 1) {
            targetAttackValue *= .95;
            attack_bonus_descriptions.push("-5% attack - injured unit");
        }
        if (targetHealthStrength < .30) {
            targetAttackValue *= .5;
            target_bonus_descriptions.push("-50% attack - massivly injured unit");
        } else if (currentHealthStrength < 1) {
            targetAttackValue *= .95;
            target_bonus_descriptions.push("-5% attack - injured unit");
        }

        let attackValue = Math.round(Math.max(currentAttackValue - targetDefenceValue, 0));
        let defenderAttackValue = Math.round(Math.max(targetAttackValue - currentTile.unit.defence, 0));

        let description = ``;

        targetHealth = targetHealth - attackValue;
        targetHealth = Math.max(targetHealth, 0);
        let color = "gold;"
        if (currentTile.unit.health - defenderAttackValue <= 0) {
            description += `Massive Loss`;
            color = "red";
        }
        else if (targetHealth <= 0) {
            description += `Major Victory`;
        }
        else if (attackValue > defenderAttackValue) {
            description += `Minor Victory`;
        } else if (attackValue == defenderAttackValue) {
            description += `Stalemate`;
        } else {
            description += `Costly Battle`;
            color = "red";
        }
        description = `<div style="text-align: center; color:${color}" class="battle_assessment">Battle: ${description}</div>`;
        description += `<table>`;
        description += `<tr><th></th><td>Attacker</td><td>Defender</td></tr>`;
        let currHealth = currentTile.unit.health - defenderAttackValue;
        currHealth = Math.max(currHealth, 0);

        description += `<tr><th>Health After Battle</th><td>${currHealth}</td><td>${targetHealth}</td></tr>`;
        description += `<tr><th>Attack</th><td>${currentTile.unit.attack}</td><td>${targetAttackValue}</td></tr>`;
        description += `<tr><th>Defence</th><td>${currentTile.unit.defence}</td><td>${targetDefenceValue}</td></tr>`;
        description += `<tr><th>Bonuses</th><td>${attack_bonus_descriptions.join("</br>")}</td><td>${target_bonus_descriptions.join("</br>")}</td></tr>`;
        description += `</table>`;

        // TODO bonuses

        return [attackValue, defenderAttackValue, description];
    }

    battle(currentTile: TileData, targetTile: TileData) {
        const player = this.getPlayer(currentTile.unit.owner);
        const targetPlayer = this.getPlayer(targetTile.unit.owner);

        if (!this.checkForClearanceToAttack(player, targetPlayer)) {
            return;
        }

        currentTile.locked = true;
        targetTile.locked = true;

        if (this._arrow !== null) {
            this._scene.remove(this._arrow)
        }

        // have attacker move forward 2/3 of the way
        const worldPosCur = qrToWorld(currentTile.q, currentTile.r);
        const worldPosTarget = qrToWorld(targetTile.q, targetTile.r);

        const isRanged = currentTile.unit.attack_range !== 1;
        let animation_amount = 1 / 3;
        if (isRanged) {
            animation_amount = 1 / 9;
        }
        const twoThirdsX = worldPosCur.x + (worldPosTarget.x - worldPosCur.x) * animation_amount;
        const twoThirdsY = worldPosCur.y + (worldPosTarget.y - worldPosCur.y) * animation_amount;

        const defenderBackX = worldPosTarget.x + (worldPosTarget.x - worldPosCur.x) * (1 / 12);
        const defenderBackY = worldPosTarget.y + (worldPosTarget.y - worldPosCur.y) * (1 / 12);

        const battleDuration = .3
        new Rocket(worldPosCur, worldPosTarget, this._scene);

        this.playSound(asset("sounds/units/rifleman_attack.mp3"), worldPosCur);

        // have attacker move foward and defender move back
        animateToPosition(targetTile.unit.model, defenderBackX, defenderBackY, battleDuration, easeOutQuad, () => { });
        animateToPosition(currentTile.unit.model, twoThirdsX, twoThirdsY, battleDuration, easeOutQuad, () => {

            // const outcome = getRandomInt(1, 2)
            let [dmg, defenderAtkDmg, description] = this.battleAssessment(currentTile, targetTile);
            RisingText(this._scene, worldPosTarget, `-${dmg}`, "red");
            targetTile.unit.health -= dmg;
            new Rocket(worldPosTarget, worldPosCur, this._scene);
            if (defenderAtkDmg > 0) {
                dmg = defenderAtkDmg;
                currentTile.unit.health -= dmg;
                RisingText(this._scene, worldPosCur, `-${dmg}`, "red");
                new Rocket(worldPosTarget, worldPosCur, this._scene);
            }
            updateUnitHealthBar(currentTile.unit);
            updateUnitHealthBar(targetTile.unit);

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
                        currentTile.unit.movement = 1;
                        this.moveUnit(currentTile, targetTile);
                    }
                })
            } else {
                // defender falls back
                animateToPosition(targetTile.unit.model, worldPosTarget.x, worldPosTarget.y, battleDuration, easeOutQuad, () => { });
                currentTile.locked = false;
                targetTile.locked = false;
                currentTile.unit.movement = 0;
                if (currentTile.unit.selector) {
                    currentTile.unit.selector.mesh.parent.remove(currentTile.unit.selector.mesh);
                    currentTile.unit.selector.dispose();
                    currentTile.unit.selector = undefined;
                }
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

    goodieHut(currentTile: TileData, targetTile: TileData) {

        targetTile.unit.model.clear();
        targetTile.unit.model.parent.remove(targetTile.unit.model);
        let barb = this.getPlayer(targetTile.unit.owner);
        delete barb.units[targetTile.unit.id];
        targetTile.unit = undefined;


        // All the good stuff

        let player = this.getPlayer(currentTile.unit.owner);

        let events = [
            "gold",
            "research",
            "pop",
        ]
        let sound = asset("sounds/ui/buy.mp3");
        let notification_text = `Gained 100 gold from a goodie hut.`;
        let notification_icon = `../../assets/map/icons/star.png`;

        let event = events[Math.floor(Math.random() * events.length)];
        if (event === "research") {
            if (player.research.current !== "") {
                let tech = Technologies.get(player.research.current);
                this.completeResearch(player, tech);
                notification_text = `Research of ${tech.name} greatly advanced.`;
                player.research.progress = 0;
            } else {
                event = "gold";
            }
        }
        if (event === "pop") {
            let cityKeys = Object.keys(player.improvements);
            let cityIndex = Math.floor(Math.random() * cityKeys.length);
            let city = player.improvements[cityKeys[cityIndex]];

            city.population += 1;
            let tt = this.getTile(city.tileInfo.q, city.tileInfo.r);
            this.updateCityLabel(tt);

            const worldPos = qrToWorld(tt.q, tt.r);
            RisingText(this._scene, worldPos, "+1");
            notification_text = `1 population added to ${city.name}`;
        }
        if (event === "gold") {
            player.gold += 100;
        }

        if (this.gameState.currentPlayer === currentTile.unit.owner) {
            // create sound and notification
            const worldPosCur = qrToWorld(targetTile.q, targetTile.r);
            const mm = this;
            this.playSound(sound, worldPosCur);
            this.toast({
                icon: notification_icon,
                text: notification_text,
                onClick: function () {
                    mm.selectTile(targetTile);
                    mm.panCameraTo(mm.selectedTile.q + 1, mm.selectedTile.r - 3)
                }
            });
            this.updateResourcePanel();
            this.updateGameStatePanel();
        }
        this.moveUnit(currentTile, targetTile);
    }

    killUnit(tile: TileData) {
        const worldPosCur = qrToWorld(tile.q, tile.r);
        let player = this.getPlayer(tile.unit.owner);
        const mm = this;
        if (this.gameState.currentPlayer === tile.unit.owner) {
            this.toast({
                icon: `../../assets/map/icons/rifleman.png`,
                text: `${tile.unit.name} has fallen in battle.`,
                onClick: function () {
                    mm.selectTile(tile);
                    mm.panCameraTo(mm.selectedTile.q + 1, mm.selectedTile.r - 3)
                }
            });
        }
        if (tile.unit.selector) {
            tile.unit.selector.mesh.parent.remove(tile.unit.selector.mesh);
            tile.unit.selector.dispose();
        }
        tile.unit.model.clear();
        tile.unit.model.parent.remove(tile.unit.model);
        delete player.units[tile.unit.id];
        this.updateResourcePanel();
        this.updateGameStatePanel();
        this.playSound(asset("sounds/units/cinematic_boom.mp3"), worldPosCur);
        tile.unit = undefined;
    }

    battleCity(currentTile: TileData, targetTile: TileData) {
        const player = this.getPlayer(currentTile.unit.owner);
        const targetPlayer = this.getPlayer(targetTile.improvement.owner);
        if (!this.checkForClearanceToAttack(player, targetPlayer)) {
            return;
        }

        // have attacker move forward 2/3 of the way
        const worldPosCur = qrToWorld(currentTile.q, currentTile.r);
        const worldPosTarget = qrToWorld(targetTile.q, targetTile.r);

        if (this._arrow !== null) {
            this._scene.remove(this._arrow)
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

        const battleDuration = .3
        new Rocket(worldPosCur, worldPosTarget, this._scene);
        this.playSound(asset("sounds/units/rifleman_attack.mp3"), worldPosCur);

        // have attacker move foward
        animateToPosition(currentTile.unit.model, twoThirdsX, twoThirdsY, battleDuration, easeOutQuad, () => {
            // fall back to original positions
            animateToPosition(currentTile.unit.model, worldPosCur.x, worldPosCur.y, battleDuration, easeOutQuad, () => { });
            animateToPosition(targetTile.improvement.model, worldPosTarget.x, worldPosTarget.y, battleDuration, easeOutQuad, () => {

                let [dmg, defenderAtkDmg, description] = this.battleAssessment(currentTile, targetTile);
                targetTile.improvement.health -= dmg;
                this.updateCityLabel(targetTile);
                RisingText(this._scene, worldPosTarget, `-${dmg}`, "red");

                if (isRanged) {
                    currentTile.locked = false;
                    targetTile.locked = false;
                    currentTile.unit.moving = false;

                    currentTile.unit.movement = 0;
                    if (currentTile.unit.selector) {
                        currentTile.unit.selector.mesh.parent.remove(currentTile.unit.selector.mesh);
                        currentTile.unit.selector.dispose();
                        currentTile.unit.selector = undefined;
                    }
                    return;
                }

                dmg = defenderAtkDmg;
                currentTile.unit.health -= dmg;
                updateUnitHealthBar(currentTile.unit);
                RisingText(this._scene, worldPosCur, `-${dmg}`, "red");

                if (targetTile.improvement.health <= 0 && currentTile.unit.health > 0) {
                    console.log("won city battle!");
                    let p = this.getPlayer(targetTile.improvement.owner);
                    let p2 = this.getPlayer(currentTile.unit.owner);

                    this.updateCityOwner(targetTile.improvement, p2);

                    this.playSound(asset("sounds/units/cinematic_boom.mp3"), worldPosCur);

                    // remove any enemy units on tile.
                    if (targetTile.unit) {
                        this.killUnit(targetTile);
                    }

                    // update all tiles that belonged to that city to new owner.
                    currentTile.unit.kills += 1;
                    currentTile.locked = false;
                    targetTile.locked = false;
                    currentTile.unit.moving = false;

                    // check for cuttoff tiles
                    this.checkForCutOffTiles(currentTile);
                    currentTile.unit.movement = 1;
                    this.moveUnit(currentTile, targetTile);
                    this.checkVictoryConditions();
                    return;
                }
                console.log("lost city battle!");
                currentTile.locked = false;
                targetTile.locked = false;
                currentTile.unit.movement = 0;
                if (currentTile.unit.selector) {
                    currentTile.unit.selector.mesh.parent.remove(currentTile.unit.selector.mesh);
                    currentTile.unit.selector.dispose();
                    currentTile.unit.selector = undefined;
                }
                if (currentTile.unit.health <= 0) {
                    this.killUnit(currentTile);
                }
            });
        });
    }

    updateCityOwner(improvement: Improvement, newOwner: Player) {
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
                mm.panCameraTo(mm.selectedTile.q + 1, mm.selectedTile.r - 3)
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

        RenderTechTree(currentPlayer.research.current, currentPlayer.research.researched, rpt, (tech: Technology) => {
            currentPlayer.research.current = tech.id;
            currentPlayer.research.progress = 0;
            this.updateResourcePanel();
            this.showEndTurnInActionPanel();
            this.menuPanel.innerHTML = "";
            this.CloseMenu();
            this.keep_menu = false;
        });
    }

    cityLabelClick(id: string) {
        const improvement = this.getImprovementById(id);
        if (!improvement) {
            return;
        }
        console.log(`improvmenet id: ${id}`);
        if (this.gameState.currentPlayer !== improvement.owner) {
            this.playerNegotiation(improvement.owner);
        } else {
            let tile = this.getTile(improvement.tileInfo.q, improvement.tileInfo.r);
            this._selectedUnit = undefined;
            this._selectedTile = tile;
            this.in_city_menu = true;
            this.panCameraTo(tile.q, tile.r);

            this.showCityMenu(tile);
            let neighborhood = this.getTileGrid().neighbors(tile.q, tile.r, 5);
            this.showYields(neighborhood);
            this.displayWorkedTiles(tile);
            this.displayExpansionView(tile);
        }
    }
    getImprovementById(id: string) {
        for (const [key, player] of Object.entries(this.gameState.players)) {
            if (player.improvements[id]) {
                return player.improvements[id];
            }
        }
       return null;
    }
    updateTaxes() {
        const currentPlayer = this.getPlayer(this.gameState.currentPlayer);
        let government = GovernmentsMap[currentPlayer.government];


        let governments = Object.keys(GovernmentsMap);
        let option_info = ""
        for (const key of governments) {
            let government = GovernmentsMap[key];
            option_info += ` <button class="city-menu" data-name="change_government" data-target=${key}><img id="menu-unit-img" src="../../assets/ui/resources/taxes.png">${government.name}</button>`

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

    getTextInput(instructions: string, value: string = "", callback: (text: string) => void) {
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

    generalMenuClicked(name: string) {
        if (name === "submit_text_input") {
            const text = (<HTMLInputElement>document.getElementById("text-input")).value;
            this.CloseMenu();
            this.menuPanel.innerHTML = "";
            this._text_input_callback(text);
        }
        if (name === "cancel_text_input") {
            this.CloseMenu();
        }
    }

    tradeMenuClicked(target: HTMLElement) {
        TradeMenuButtonClicked(this, target);
    }

    pickTile(worldPos: Vector3): TileData | null {
        var x = worldPos.x
        var y = worldPos.y

        // convert from world coordinates into fractal axial coordinates
        var q = (1.0 / 3 * Math.sqrt(3) * x - 1.0 / 3 * y)
        var r = 2.0 / 3 * y

        // now need to round the fractal axial coords into integer axial coords for the grid lookup
        var cubePos = axialToCube(q, r)
        var roundedCubePos = roundToHex(cubePos)
        var roundedAxialPos = cubeToAxial(roundedCubePos.x, roundedCubePos.y, roundedCubePos.z)

        // just look up the coords in our grid
        return this._tileGrid.get(roundedAxialPos.q, roundedAxialPos.r)
    }

    getRandomTile(cityEligibile: boolean): TileData {
        if (cityEligibile) {
            while (true) {
                const q = getRandomInt(-1 * (this._tileGrid.width / 2) + 4, this._tileGrid.width / 2 - 4);
                const r = getRandomInt(-1 * (this._tileGrid.width / 2) + 4, this._tileGrid.height / 2 - 4);

                const randomTile = this._tileGrid.get(q, r);
                if (!this.isTileCityEligbile(randomTile)) {
                    continue;
                }
                return randomTile;
            }
        }
        const q = getRandomInt(-1 * (this._tileGrid.width / 2), this._tileGrid.width / 2);
        const r = getRandomInt(-1 * (this._tileGrid.width / 2), this._tileGrid.height / 2);
        const randomTile = this._tileGrid.get(q, r);
        return randomTile;
    }

    isTileCityEligbile(tile: TileData): boolean {
        if (!tile) {
            return false;
        }
        if (isMountain(tile.height) || isWater(tile.height)) {
            return false;
        }
        if (tile.improvement !== undefined) {
            return false;
        }
        if (tile.owner && (tile.owner !== this._gameState.playersTurn)) {
            return false;
        }

        // check surrounding
        const tiles = this.getTileGrid().neighbors(tile.q, tile.r, 2)
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

    isImprovementEligible(tile: TileData): boolean {
        if (!tile) {
            return false;
        }
        if (isMountain(tile.height)) {
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

    getClosestUnoccupiedTile(tile: TileData, type: string): TileData | undefined {
        const owner = tile.improvement?.owner || "";
    
        // Initialize the BFS queue and a visited set.
        const queue: TileData[] = [tile];
        const visited: Set<string> = new Set();
        visited.add(`${tile.q},${tile.r}`);
    
        // Process the queue until it's empty.
        while (queue.length > 0) {
            const current = queue.shift()!;
            
            if (
                current.unit === undefined &&
                !isMountain(current.height) &&
                (current.improvement === undefined || current.improvement.owner === owner) &&
                (
                    (type === "land" && !isWater(current.height)) ||
                    (type === "water" && isWater(current.height))
                )
            ) {
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


    getNextMovementTile(unit: Unit, current: TileData, target: TileData): TileData {
        // Define all possible neighbors in axial coordinates
        const neighbors = [
            { q: current.q + 1, r: current.r },     // (+1, 0)
            { q: current.q - 1, r: current.r },     // (-1, 0)
            { q: current.q, r: current.r + 1 },     // ( 0, +1)
            { q: current.q, r: current.r - 1 },     // ( 0, -1)
            { q: current.q + 1, r: current.r - 1 }, // (+1, -1)
            { q: current.q - 1, r: current.r + 1 }, // (-1, +1)
        ];
    
        // Find the neighbor closest to the target, accounting for terrain costs
        let bestNeighbor = current;
        let bestScore = -Infinity;  // Using a score-based approach instead
        let player = this.getPlayer(unit.owner);

        for (const neighbor of neighbors) {
            const tt = this._tileGrid.get(neighbor.q, neighbor.r);
            if (!tt) continue;
            
            // Skip if terrain is impassable
            if (isMountain(tt.height)) continue;
            
            // Skip if there's already a unit from the same owner
            if (tt.unit !== undefined && unit && tt.unit.owner === unit.owner) continue;
            
            // Skip if no unit is provided
            if (!unit) continue;
            
            // Unit type movement restrictions
            if (unit.land === false && !(isWater(tt.height) || tt.rivers)) continue;
            
            // Technology requirement for water tiles
            if (unit.water === false && isWater(tt.height)) {
                const player = this.getPlayer(unit.owner);
                if (!("fishing" in player.research.researched)) continue;
            }
    
            if (tt.owner && tt.owner !== "" && tt.owner !== unit.owner) {
                // allow to click on enemy unit/improvement to breing up declare war dialog
                if (tt.unit || tt.improvement) {}
                else {
                    let canMove = this.checkForClearanceToMove(player, this.gameState.players[tt.owner]);
                    if (!canMove) {
                        continue;
                    }
                }
            }

            // Calculate base distance to target
            const distance = getHexDistance(tt, target);
            
            // Calculate terrain cost including land-sea transitions
            const terrainCost = this.getTerrainMovementCost(tt, current);
            
            // Calculate a score that prioritizes getting closer to the target
            // while also considering the terrain cost
            // Higher score is better: we want to minimize distance but also prefer lower movement costs
            const score = 1000 - (distance * 10) - (terrainCost * 5);
    
            if (score > bestScore) {
                bestScore = score;
                bestNeighbor = tt;
            }
        }
    
        return bestNeighbor;
    }
    
    /**
     * Calculates a path from start to target, respecting movement costs and limits.
     */
    private calculatePath(start: TileData, target: TileData, maxSteps: number): TileData[] {
        const path: TileData[] = [];
        let current = start;
        let remainingMovement = maxSteps;
        
        while (remainingMovement > 0) {
            const next = this.getNextMovementTile(start.unit, current, target);
            if (!next || next === current) break; // No progress or invalid tile
            
            // Calculate movement cost for the next tile
            const movementCost = this.getTerrainMovementCost(next, current);
            
            // Check if we have enough movement points left
            if (remainingMovement < movementCost) break;
            
            // Deduct movement cost and add tile to path
            remainingMovement -= movementCost;
            path.push(next);
            current = next;
            
            if (current === target) break; // Reached target
        }
        
        return path;
    }
    
    /**
     * Returns the movement cost for a specific terrain type.
     * Now accounts for land-sea transitions which cost 2 movement points.
     */
    private getTerrainMovementCost(tile: TileData, fromTile?: TileData): number {
        let cost = 1; // Default cost
        
        // Hill terrain costs 2 movement points
        if (isHill(tile.height)) {
            cost = 2;
        }
        
        // If fromTile is provided, check for land-sea transitions
        if (fromTile) {
            const fromIsWater = isWater(fromTile.height);
            const toIsWater = isWater(tile.height);
            
            // If crossing between land and water (or vice versa), cost is 2
            if (fromIsWater !== toIsWater) {
                // Rivers are considered water for movement purposes
                const fromHasRiver = fromTile.rivers;
                const toHasRiver = tile.rivers;
                
                // If both tiles have rivers, it's not a land-sea transition
                if (!(fromHasRiver && toHasRiver)) {
                    cost = Math.max(cost, 2); // Take the higher cost (for hills)
                }
            }
        }
        
        return cost;
    }
    
    /**
     * Shows the movement path on the map.
     */
    private showPath(path: TileData[]) {
        // Clear previous path indicators
        this._pathIndicators.clear();
        this._pathIndicators.children.forEach(child => this._pathIndicators.remove(child));
    
        // Build an array of world positions from the path tiles
        const positions: Vector3[] = [];
        path.forEach(tile => {
            const worldPos = qrToWorld(tile.q, tile.r);
            // Use a consistent Z (here 0.02) so the path appears above the terrain
            positions.push(new Vector3(worldPos.x, worldPos.y, 0.02));
        });
    
        // Create and display a thick line if we have at least two points
        if (positions.length > 1) {
            const thickLine = new ThickLine(positions, {
                linewidth: 7,
                color: 0x006600, // Green color
                resolution: new Vector2(window.innerWidth, window.innerHeight)
            });
            this._pathIndicators.add(thickLine);
        }
    
        // Calculate total movement cost of the path
        if (path.length > 0) {
            const firstTile = path[0];
            const unit = firstTile.unit;
            
            if (unit) {
                // Calculate total movement points required for this path
                let totalMovementCost = 0;
                let previousTile = null;
                
                for (const tile of path) {
                    totalMovementCost += previousTile ? this.getTerrainMovementCost(tile, previousTile) : 0;
                    previousTile = tile;
                }
                
                // Uncomment this section if you want to show the movement cost indicator
                /*
                // Get the last tile to place the movement indicator
                const lastTile = path[path.length - 1];
                const worldPos = qrToWorld(lastTile.q, lastTile.r);
                
                // Create a canvas to draw the text
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
    
                canvas.width = 200;
                canvas.height = 100;
                context.font = '64px bold Trojan';
                context.fillStyle = 'white';
                context.textAlign = 'center';
                // Adjust vertical placement as needed
                context.fillText(`${totalMovementCost} / ${unit.movement}`, canvas.width / 2, canvas.height / 2 + 20);
                
                // Create a texture from the canvas and use it in a sprite
                const texture = new CanvasTexture(canvas);
                const spriteMaterial = new SpriteMaterial({ map: texture, transparent: true });
                const sprite = new Sprite(spriteMaterial);
                sprite.position.set(worldPos.x, worldPos.y, 0.3); // Render above the dashed line
                sprite.scale.set(0.5, 0.5, 1);
                this._pathIndicators.add(sprite);
                */
            }
        }
    }
    
    /**
     * Adds a movement border around a unit to show where it can move.
     */
    addUnitMovementBorder(unit: Unit) {
        // Don't show movement border if unit has no movement points left
        if (!unit || unit.movement <= 0) {
            return;
        }
        
        this._movement_overlay.clear();
    
        // Create a TileData tracker for movement possibility
        const reachableTiles: Map<string, { tile: {q: number, r: number}, cost: number }> = new Map();
        
        // BFS to find all reachable tiles
        const queue: { tile: {q: number, r: number}, remainingMovement: number, fromTile?: {q: number, r: number} }[] = [];
        const startTile = unit.tileInfo;
        const startKey = `${startTile.q},${startTile.r}`;
        
        // Initialize with the start tile
        reachableTiles.set(startKey, { tile: startTile, cost: 0 });
        queue.push({ tile: startTile, remainingMovement: unit.movement });
        
        while (queue.length > 0) {
            const { tile: currentTile, remainingMovement, fromTile } = queue.shift()!;
            const currentKey = `${currentTile.q},${currentTile.r}`;
            const currentCostInfo = reachableTiles.get(currentKey)!;
            
            // Skip if we don't have any movement points left
            if (remainingMovement <= 0) continue;
            
            // Get neighbors of the current tile
            const neighbors = [
                { q: currentTile.q + 1, r: currentTile.r },     // (+1, 0)
                { q: currentTile.q - 1, r: currentTile.r },     // (-1, 0)
                { q: currentTile.q, r: currentTile.r + 1 },     // ( 0, +1)
                { q: currentTile.q, r: currentTile.r - 1 },     // ( 0, -1)
                { q: currentTile.q + 1, r: currentTile.r - 1 }, // (+1, -1)
                { q: currentTile.q - 1, r: currentTile.r + 1 }, // (-1, +1)
            ];
            
            for (const neighbor of neighbors) {
                const tt = this._tileGrid.get(neighbor.q, neighbor.r);
                if (!tt) continue;
                
                const neighborKey = `${tt.q},${tt.r}`;
                
                // Skip mountains
                if (isMountain(tt.height)) continue;
                
                // Skip tiles with friendly units
                if (tt.unit && tt.unit.owner === unit.owner) continue;
                
                // Skip land tiles for water units
                if (unit.land === false && !(isWater(tt.height) || tt.rivers)) continue;
                
                // Skip water tiles for land units without fishing technology
                if (unit.water === false && isWater(tt.height)) {
                    const player = this.getPlayer(unit.owner);
                    if (!("fishing" in player.research.researched)) continue;
                }
                
                // Get the current source tile for the land-sea transition check
                const fromTileData = fromTile ? this._tileGrid.get(fromTile.q, fromTile.r) : undefined;
                
                // Calculate movement cost to enter this tile, including land-sea transitions
                const currenttt = this._tileGrid.get(currentTile.q, currentTile.r);
                const terrainCost = this.getTerrainMovementCost(tt, currenttt);
                
                // Skip if we don't have enough movement points
                if (remainingMovement < terrainCost) continue;
                
                // If we've already found a better path to this tile, skip
                if (reachableTiles.has(neighborKey)) {
                    const existingCost = reachableTiles.get(neighborKey)!.cost;
                    if (existingCost <= currentCostInfo.cost + terrainCost) continue;
                }
                
                // Add this tile to our reachable tiles
                reachableTiles.set(neighborKey, { 
                    tile: tt, 
                    cost: currentCostInfo.cost + terrainCost 
                });
                
                // Add this tile for further exploration
                queue.push({ 
                    tile: tt, 
                    remainingMovement: remainingMovement - terrainCost,
                    fromTile: currentTile
                });
            }
        }
        
        // Visualize all reachable tiles except the starting tile
        for (const [key, { tile }] of reachableTiles.entries()) {
            if (key !== startKey) {
                const m = createTileOverlayModel();
                const worldPos = qrToWorld(tile.q, tile.r);
                m.position.set(worldPos.x, worldPos.y, 0.02);
                this._movement_overlay.add(m);
            }
        }
    }

      getYieldIconPath(yieldType: string): string {
        switch (yieldType) {
          case 'food':
            return '../../assets/ui/resources/food.png';
          case 'gold':
            return '../../assets/ui/resources/gold.png';
          case 'production':
            return '../../assets/ui/resources/production.png';
          default:
            return '../../assets/ui/resources/gold.png';
        }
      }
      


      getTotalYieldsForTile(tile: TileData): { [key: string]: number } {
        let allYields =  { ...tile.yields };
        if (tile.worker_improvement) {
            for (const [key, value] of Object.entries(tile.worker_improvement.yields)) {
                if (allYields[key] === undefined || Number.isNaN(allYields[key])) {
                    allYields[key] = 0;
                }
                allYields[key] += value as number;
            }
        }
        return allYields;
      }

      showYields(tiles: TileData[]) {
        this._ui_map_temp_models.clear();
      
        tiles.forEach(tile => {
          if (tile.clouds) {
            return;
          }
          const worldPos = qrToWorld(tile.q, tile.r);
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
              const yieldMesh = CreateYieldModel(imagePath);
              const offsetX = initialOffsetX + i * iconSpacing;
              yieldMesh.position.set(worldPos.x + offsetX, worldPos.y + .4 + offsetY, worldPos.z + 0.3);
              this._ui_map_temp_models.add(yieldMesh);
            }
          });
        });
    }

    displayWorkedTiles(tile: TileData) {
        let max_count = Math.max(1, Math.floor(tile.improvement.population));
        let count = 0;
        let tiles = this.getTileGrid().neighbors(tile.q, tile.r, 6).filter(t => t.city === tile.city);
        let tt = this.getBestYield(tiles, tile);
        tt.forEach(t => {
            if (count >= max_count) {
                return;
            }
            count += 1;
            const geom = new RingBufferGeometry(0.001, 1, 6, 1)
            geom.rotateZ(Math.PI/2)

            const model = new Mesh(
                geom,
                new MeshBasicMaterial({ 
                    color: 'purple',
                    opacity: .40,
                    transparent: true,
                    side: FrontSide,
                })
            );
            const worldPos = qrToWorld(t.q, t.r);
            model.position.set(worldPos.x, worldPos.y, 0.01)
            this._ui_map_temp_models.add(model);
        });

    }

    clearYields() {
        this._ui_map_temp_models.clear();
    }

    showNextExpansion(tile: TileData) {
        const geom = new RingBufferGeometry(0.001, 1, 6, 1)
        geom.rotateZ(Math.PI/2)
        const model = new Mesh(
            geom,
            new MeshBasicMaterial({ 
                color: 'blue',
                opacity: .35,
                transparent: true,
                side: FrontSide,
            })
        );
        const worldPos = qrToWorld(tile.q, tile.r);
        model.position.set(worldPos.x, worldPos.y, 0.01)
        this._ui_map_expansion.add(model);
    }
    clearNextExpansion() {
        this._ui_map_expansion.clear();
    }

    displayExpansionView(tile: TileData) {
        this._ui_map_expansion.clear();
        let nextTile = tile.improvement.nextTile;
        if (nextTile) {
            this.showNextExpansion(this.getTile(nextTile.q, nextTile.r));
        }
        let expTiles = this.getEligibleTilesForExpansion(tile);
        this.showExpansionBuyClicks(expTiles, tile);
    }

    showExpansionBuyClicks(tiles: TileData[], origTile: TileData) {
        tiles.forEach(tile => {
          if (tile.clouds) return;
          const worldPos = qrToWorld(tile.q, tile.r);
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
                this.playSound(asset("sounds/ui/ui_error.mp3"));
                return;
            }
            this.playSound(asset("sounds/ui/buy.mp3"));
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
      
          const cssObject = new CSS3DObject(buyDiv);
          cssObject.position.set(worldPos.x + 0.4, worldPos.y + 0.4, worldPos.z + 0.3);
          cssObject.scale.set(0.005, 0.005, 0.005);
          cssObject.rotateX(Math.PI / 6);
      
          this._ui_map_expansion.add(cssObject);
        });
    }

    getEligibleTilesForExpansion(tile: TileData): TileData[] {
        const grid = this.getTileGrid();
        const tiles = grid.neighbors(tile.q, tile.r, 4);
        const eligibleTiles = tiles.filter(newTile =>
          (!newTile.city || newTile.city === "") &&
          (!newTile.owner || newTile.owner === "") &&
          grid.neighbors(newTile.q, newTile.r, 1).some(neighbor => neighbor.city === tile.city)
        );
      
        const uniqueMap = new Map<string, TileData>();
        eligibleTiles.forEach(t => {
          const key = `${t.q},${t.r}`;
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, t);
          }
        });
        return Array.from(uniqueMap.values());
    }

    checkForCutOffTiles(tile: TileData) {
        const grid = this.getTileGrid();
        const tiles = grid.neighbors(tile.q, tile.r, 5);
        tiles.forEach(t => {
            if (t.city && !this.isTileConnectedToHomeCity(t)) {
                t.owner = ""
                t.city = ""
            }
        });
    }

    isTileConnectedToHomeCity(startTile: TileData): boolean {
        const grid = this.getTileGrid();
        // If there is no city specified, we consider it disconnected.
        if (!startTile.city) return false;
      
        const visited = new Set<string>();
        const queue: TileData[] = [startTile];
      
        while (queue.length) {
          const current = queue.shift()!;
          const key = `${current.q},${current.r}`;
          if (visited.has(key)) continue;
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

    getBestYield(tiles: TileData[], referenceTile: TileData): TileData[] {
        return tiles.slice().sort((a, b) => {
          const aYield = Object.values( this.getTotalYieldsForTile(a) ).reduce((sum, v) => sum + v, 0);
          const bYield = Object.values( this.getTotalYieldsForTile(b) ).reduce((sum, v) => sum + v, 0);
          
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
            const max_research = Technologies.size;
            if (research < max_research) {
                this.setActionPanel(`<div class="action-menu action-button research">Pick Research</div>`);
                return;
            }
        }
        this.setActionPanel(`<div class="action-menu action-button" data-name="end_turn">End Turn</div>`);
    }

    getResourcesForPlayer(player: Player): { [key: string]: number } {
        let resources: { [key: string]: number } = {};
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
        this.CloseMenu();
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
            this._ui_selectors.clear();
        }


        // determine next player
        const nextIndex = (currentPlayerIndex + 1) % (this._gameState.playerOrder.length);
        this._gameState.playersTurn = this._gameState.playerOrder[nextIndex];
        if (nextIndex === 0) {
            this._gameState.turn += 1;
        }


        const player = this._gameState.players[this._gameState.playersTurn];
        const nation = Nations[player.nation];

        if (this._gameState.playersTurn === this._gameState.currentPlayer) {
            this.checkVictoryConditions();
            this.showEndTurnInActionPanel();
            this.showTurnBanner();
        } else {
            this.setActionPanel(`<div class="action-button-disabled">Waiting for ${player.name}..<div>`);
        }

        // end diplomaticActions in end date
        for (const [key, value] of Object.entries(player.diplomatic_actions)) {
            for (const [actionKey, action] of Object.entries(value)) {
                let d = action as DiplomaticAction;
                if (d.endTurn && d.endTurn <= this._gameState.turn) {
                    delete player.diplomatic_actions[key][actionKey];
                    // TODO toast if affects player.
                }
            }
        }

        let diplomaticSummary = GetDiplomaticActionsSummary(this._gameState, player);
        // console.log(summary);

        // calculate new resources for player
        for (const [key, improvement] of Object.entries(player.improvements)) {
            let t =  this.getTile(improvement.tileInfo.q, improvement.tileInfo.r);
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
                        const worldPos = qrToWorld(cityTile.q, cityTile.r);
                        RisingText(this._scene, worldPos, "+1");
                        this.toast({
                            icon: "../../assets/map/icons/star.png",
                            text: `${improvement.name} has grown.`,
                            onClick: function () {}
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
            if (improvement.production_queue.length > 0) {
                let thing_to_build = improvement.production_queue[0];
                if (thing_to_build === "gold") {
                    player.gold += improvement.work_done;
                    improvement.work_done  = 0;
                    this.updateCityLabel(t);
                }
            }
            if (improvement.production_queue.length > 0  && improvement.work_done > 0 && improvement.work_done >= improvement.work_total) {
                improvement.work_done -= improvement.work_total;
                let thing_to_build = improvement.production_queue[0];
                let thing_name = "";
                
                let isBuilding = false;
                if (thing_to_build in BuildingMap) {
                    isBuilding = true;
                }
                if (isBuilding === false) {
                    const mm = UnitMap[thing_to_build];
                    let unit = createUnit(thing_to_build, player)
                    thing_name = unit.name;
                    let unit_terrain = "land";
                    if (thing_to_build === "boat" || thing_to_build === "destroyer") {
                        unit_terrain = "water";
                    }
                    if (thing_to_build === "gunship") {
                        unit_terrain = "";
                    }
                    this.addUnitToMap(
                        unit,
                        this.getClosestUnoccupiedTile(t, unit_terrain)
                    );
                }
                if (isBuilding === true) {
                    thing_name = BuildingMap[thing_to_build].name;
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
            resources[resource_name] +=  amount;
        }


        let cityYields = this.getPlayerCityYields(player);
        // let [happiness, happinessInfo] = this.getHappiness(player, cityYields);
        let [rpt, rptInfo] = this.getResearch(player, cityYields);
        let [goldPerTurn, goldPerTurnInfo] = this.getGoldPerTurn(player, diplomaticSummary, cityYields);

        player.gold += goldPerTurn;


        // heal units/cities for player;
        for (const [key, unit] of Object.entries(player.units)) {
            if (unit.health < unit.health_max) {
                let t = this.getTile(unit.tileInfo.q, unit.tileInfo.r);
                if (t.owner !== unit.owner) {
                   continue
                }
                let amt = .2*unit.health_max;
                let oldHealth = unit.health;
                unit.health = Math.min(unit.health + amt, unit.health_max);
                amt = unit.health - oldHealth;
                RisingText(this._scene, qrToWorld(t.q, t.r), `+${amt}`);
                updateUnitHealthBar(unit);
            }
        }
        for (const [key, city] of Object.entries(player.improvements)) {
            if (city.health < city.health_max) {
                let amt = .2*city.health_max;
                let oldHealth = city.health;
                city.health = Math.min(city.health + amt, city.health_max);
                amt = city.health - oldHealth;
                let t = this.getTile(city.tileInfo.q, city.tileInfo.r);
                this.updateCityLabel(t);
                RisingText(this._scene, qrToWorld(t.q, t.r), `+${amt}`);
            }
        }
        // calculate research for player 
        player.research.progress += rpt;
        if (player.research.current !== "") {
            let tech = Technologies.get(player.research.current);
            if (tech.cost <= player.research.progress) {
                player.research.progress -= tech.cost;
                this.completeResearch(player, tech);
            }
        }

        // refresh units movement / health if in city/terittories (todo)
        for (const [key, unit] of Object.entries(player.units)) {
            unit.movement = unit.movement_max;
            // unit.health = unit.health_max;
        }
        
        if (this._gameState.playersTurn === this._gameState.currentPlayer) {
            this.addUnitSelectors();
            this.focusOnNextAction();
        }

        this.updateResourcePanel();
        this.updateGameStatePanel();
        this.updateUnitInfoForTile(this.selectedTile);
        if (this._gameState.playersTurn !== this._gameState.currentPlayer) {
            takeTurn(this, player);
        }
    }

    completeResearch(player: Player, tech: Technology) {
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
            let info = DisplayResearchFinished(tech);
            this.CloseMenu();
            this.keep_menu = true;
            this.showMenu(info, "center");
            if (tech.quote_audio) {
                this.playSound(asset(tech.quote_audio));
            }
        } else {
            let tech = AIChooseResearch();
            if (tech !== undefined) {
                player.research.current = tech.id;
            }
        }
    }

    focusOnNextAction() {
        console.log("focus on")
        if (this.keep_menu) {
            return;
        }
        const player = this._gameState.players[this._gameState.currentPlayer];
        // units
        for (const [key, unit] of Object.entries(player.units)) {
            if (unit.orders === "fortify") {
                continue;
            }
            if (unit.orders === "sleep") {
                continue;
            }
            if (unit.movement > 0) {
                this.selectTile(this.getTile(unit.tileInfo.q, unit.tileInfo.r));
                this._selectedUnit = unit;

                this.panCameraTo(unit.tileInfo.q, unit.tileInfo.r);
                return;
            }
        }
        for (const [key, city] of Object.entries(player.improvements)) {
            if (city.production_queue.length === 0) {
                let t = this.getTile(city.tileInfo.q, city.tileInfo.r);
                this.selectTile(t);
                this.panCameraTo(t.q, t.r);
                this.showCityMenu(t);
                return;
            }
        }
    };

    updateCityLabel(t: TileData) {
        let improvement = t.improvement;
        let player = this._gameState.players[improvement.owner];
        let nation = Nations[player.nation];
        const newPopulation = Math.floor(improvement.population);


        let healthBar = ``
        if (improvement.health < improvement.health_max) {
            healthBar = HeathBarDivHtml(improvement.id, improvement.health/improvement.health_max);
        }
        const img = `<img src="${nation.flag_image}" style="padding-right:10px;" width="30px" height="25px"/>`
        let label = `<span class="city-label" data-target="${improvement.id}">${healthBar}${img} ${newPopulation} ${improvement.name}</span>`;


        if (t.owner !== this._gameState.currentPlayer) {
            updateLabel(improvement.id, label);
            return;
        }

        // Add progress bars for human player
        let progress = this.getCityProgress(t);

        label = `<span class="city-label" data-target="${improvement.id}">`
        label += healthBar;
        label += ` ${img} `;
        let popBar = HeathBarDivHtml(improvement.id, progress.pop_percent);
        label += popBar + `<span class="city-label-lower" style="padding-right:5px;"><sub>${progress.pop_turns}</sub> </span>`
        label += ` ${newPopulation} ${improvement.name}`

        if (improvement.production_queue.length > 0) {
            let prodBar = HeathBarDivHtml(improvement.id, progress.prod_percent);
            label += prodBar + `<span class="city-label-lower" style="padding-left:5px;"> <sub>${progress.prod_turns}</sub></span>`
            label += `<img src="${progress.prod_image}" style="padding-left:10px;" width="30px" height="25px"/>`
            label == "</span>"
        }
        updateLabel(improvement.id, label);
    }

    showTurnBanner() {
        const player = this._gameState.players[this._gameState.playersTurn];
        const nation = Nations[this._gameState.playersTurn];
        showBanner(
            `${nation.name}</br>${TurnToYear(this._gameState.turn)}`,
        );
    }
    addUnitSelectors() {
        // Add selectors for units that have movement
        let player = this.gameState.players[this._gameState.currentPlayer];
        for (const [key, unit] of Object.entries(player.units)) {
            if (unit.movement > 0) {
                const tile = this._tileGrid.get(unit.tileInfo.q, unit.tileInfo.r);
                const worldPos = qrToWorld(tile.q, tile.r);
                const ps = new WhiteOutline();
                ps.mesh.rotateZ(Math.PI/2)
                ps.mesh.position.set(worldPos.x, worldPos.y, worldPos.z + 0.02);
                unit.selector = ps;
                this._ui_selectors.add(ps.mesh);
            }
        }
        this._selectedUnit = undefined;
    }

    getPlayerCityYields(player: Player): { [key: string]: number } {
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

    getCityProgress(tile: TileData): { [key: string]: any } {
        let result = {
            prod_percent: 0,
            prod_turns: 0,
            prod_image: "",
            pop_percent: 0,
            pop_turns: 0,
        }

        let cityYields = this.getYieldsForCity(tile);
        let avialable_prod = 0;
        if ("production" in cityYields) {
            avialable_prod = cityYields["production"];
        }

        if (tile.improvement.production_queue.length > 0) {
            let prod_item = tile.improvement.production_queue[0];
            if (prod_item in UnitMap) {
                let unit = UnitMap[prod_item];
                let cost = tile.improvement.work_total - tile.improvement.work_done;
                let turns = Math.ceil(cost / avialable_prod);
                result.prod_percent = Math.ceil(tile.improvement.work_done / tile.improvement.work_total * 100)/100;
                result.prod_turns = turns;
                result.prod_image = unit.icon;
            }
            if (prod_item in BuildingMap) {
                let building = BuildingMap[prod_item];
                let cost = tile.improvement.work_total - tile.improvement.work_done;
                let turns = Math.ceil(cost / avialable_prod);
                result.prod_percent = Math.ceil(tile.improvement.work_done / tile.improvement.work_total * 100)/100;
                result.prod_turns = turns;
                result.prod_image = building.menu_image;
            }
            if (prod_item === "gold") {
                let cost = 0;
                let turns = Math.ceil(cost / avialable_prod);
                result.prod_percent = 100;
                result.prod_turns = turns;
                result.prod_image = "../../assets/ui/resources/gold.png";
            }

        }

        result.pop_percent = tile.improvement.population % 1;
        let needed = 1 - result.pop_percent;
        result.pop_turns =  Math.ceil(needed / tile.improvement.population_rate);
        return result;
    }
    
    updatePopulationAndProductionRates(player: Player, improvement: Improvement) {
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

    getHappiness(player: Player, cityYields: {[key: string]: number }): [number, string] {
        let info = "Happiness: </br><table>";
        let happiness = 0;

        let population = cityYields.population; 
        population = Math.floor(population);
        happiness -= population;
        info += `<tr><td>Population/Cities</td><td>-${population}</td></tr>`;
        info += `<tr><td></td></tr>`;
        
        let improvements = cityYields.happiness;
        happiness += improvements;
        info += `<tr><td>Buildings/Improvements</td><td>+${improvements}</td></tr>`;

        let resources = this.getResourcesForPlayer(player);
        for (const [resource_name, amount] of Object.entries(resources)) {
            let amount = 4;
            happiness += amount;
            info += `<tr><td>Luxury Resource: ${capitalize(resource_name)}</td><td>+${amount}</td></tr>`;
        }

        // bonuses;

        let difficulty = 3;
        happiness += difficulty;
        info += `<tr><td>Difficulty</td><td>+${difficulty}</td></tr>`;

        info += `</table>`;

        happiness = Math.round(happiness);
        return [happiness, info];
    }

    getGoldPerTurn(player: Player, diplomaticSummary: DiplomaticSummary, cityYields: {[key: string]: number }): [number, string] {
        let info = "Gold: </br><table>";
        let gpt = 0;

        // units
        let unitMainance = Object.keys(player.units).length;
        gpt -= unitMainance;
        info += `<tr><td>Unit maintaince</td><td>-${unitMainance}</td></tr>`;

        // cities
        let building_maintance = cityYields.building_maintance;
        gpt -= building_maintance;
        info += `<tr><td>Buildings maintaince</td><td>-${building_maintance}</td></tr>`;


        // cities and population
        let yieldsGold = cityYields.gold;
        gpt += cityYields.gold;
        info += `<tr><td>Buildings/improvements</td><td>+${yieldsGold}</td></tr>`;

        info += `<tr><td></td></tr>`;
        
        gpt += diplomaticSummary.gold_per_turn;
        info += diplomaticSummary.gold_summary;

        let difficulty = 3;
        gpt += difficulty;
        info += `<tr><td>Difficulty</td><td>+${difficulty}</td></tr>`;

        info += `</table>`;
        gpt = Math.round(gpt);
        return [gpt, info];
    }

    getResearch(player: Player, cityYields: {[key: string]: number }): [number, string] {
        let info = "Research: </br><table>";
        let research = 0;

        // cities and population
        let yieldsResearch = cityYields.research;
        research += yieldsResearch;
        info += `<tr><td>Buildings/improvements</td><td>+${yieldsResearch}</td></tr>`;

        // bonuses;

        let difficulty = 1;
        research += difficulty;
        info += `<tr><td>Difficulty</td><td>+${difficulty}</td></tr>`;

        info += `</table>`;
        return [research, info];
    }

    updateResourcePanel() {
        if (this.resourcePanel == null) {
            return;
        }

        const player = this._gameState.players[this._gameState.currentPlayer];
        let diplomaticSummary = GetDiplomaticActionsSummary(this._gameState, player);

        // const units = Object.keys(player.units).length;
        // const cities = Object.keys(player.improvements).length;

        let resources = this.getResourcesForPlayer(player);
        for (const [resource_name, amount] of Object.entries(diplomaticSummary.resources)) {
            if (!(resource_name in resources)) {
                resources[resource_name] = 0;
            }
            resources[resource_name] +=  amount;
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

        let happiness_icon = ``
        if (happiness <= -10) {
            happiness_icon = `icons8-angry-48.png`
        } else if (happiness < -4) {
            happiness_icon = `icons8-surprised-48.png`
        } else if (happiness < 1) {
            happiness_icon = `icons8-boring-48.png`
        } else if (happiness < 10) {
            happiness_icon = `icons8-happy-48.png`
        } else {
            happiness_icon = `icons8-smiling-48.png`
        }
        happiness_icon = `<img src="../../assets/ui/resources/happiness/${happiness_icon}" style="padding-left: 0px; padding-right: 5px; width: 20px; height: 20px;"/>`

        let gold_icon = `<img src="../../assets/ui/resources/gold.png" style="padding-left: 15px; padding-right: 5px; width: 20px; height: 20px;"/>`
        let taxes_icon = `<img src="../../assets/ui/resources/taxes.png" style="padding-left: 15px; padding-right: 5px; width: 20px; height: 20px;"/>`


        let research_icon = `<img src="../../assets/ui/resources/research.png" style="padding-left: 15px; padding-right: 5px; width: 20px; height: 20px;"/>`
        let research_percentage = `0%`;
        let research_info = "";
        let tech_name = '';
        if (Technologies.has(player.research.current)) {
            let tech = Technologies.get(player.research.current);
            tech_name = tech.name;
            let percent = Math.round(player.research.progress / tech.cost * 100);
            let turns = Math.ceil((tech.cost - player.research.progress) / rpt);
            research_percentage = `${percent}%`;
            research_info = `${percent}% (${turns} turns left)`
        } else {
            tech_name = "Pick a technology to research";
            research_percentage = '0%';
        }
        let research = `<span class="research highlight-hover">
          <div id="progressBarContainer">
            <div style="width: ${research_percentage};" class="progressBar research" id="progressBar"></div>
            <div class="progressText research" id="progressText">${tech_name} ${research_info}</div>
        </div></span> `

        let government = GovernmentsMap[player.government];

        let taxes = `${taxes_icon}<span class="taxes highlight-hover">${government.name}</span>`
        let info = `<span class="sub" id="sub-pop">${happiness_icon} ${happiness}</span><span class="sub" id="sub-gold">${gold_icon} ${player.gold} (${goldPerTurnStr})</span><span class="sub" id="sub-research" style="padding-right: 10px;">${research_icon} (+${rpt})</span> ${research}  ${taxes} ${resourcesString}`;
        this.resourcePanel.innerHTML = info;
    }

    updateUnitInfoForTile(tile: TileData) {
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
            let menu = ``
            if (tile.unit.type === "settler") {
                // validate placement location
                if (!this.isTileCityEligbile(tile)) {
                    menu = `<tr><td><button disabled class="city-menu" data-name="settler_place_city">Start City</button></td><td></td></tr>`
                } else {
                    menu = `<tr><td><button class="city-menu" data-name="settler_place_city">Start City</button></td><td></td></tr>`
                }                
            }
            if (tile.unit.type === "worker") {
                // validate placement location
                if (!this.isImprovementEligible(tile)) {
                    menu = `<tr><td><button disabled class="city-menu" data-name="worker_improvement">Add farm</button></td><td></td></tr>`
                } else {
                    menu = `<tr><td><button class="city-menu" data-name="worker_improvement" data-target="farm">Build Farm</button></td><td></td></tr>`
                    menu += `<tr><td><button class="city-menu" data-name="worker_improvement" data-target="mine">Build Mine</button></td><td></td></tr>`

                }                
            }

            // orders
            menu += `<tr><td><button class="city-menu" data-name="unit_sleep" data-target="mine">Sleep (Skip)</button></td><td></td></tr>`
            menu += `<tr><td><button class="city-menu" data-name="unit_fortify" data-target="mine">Fortify (Skip)</button></td><td></td></tr>`
            let  orders =  `<tr><th>Orders</th><td>${capitalize(tile.unit.orders)}</td></tr>`
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
                                    ${orders}
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
                this.unitInfoCache = info
                this.unitInfoPanel.innerHTML = info;
            }
            return;
        }
        if (tile.improvement) {
            // friendly city
            let menu = ``
            if (tile.improvement.owner === this.gameState.currentPlayer) {
                // let neighborhood = this.getTileGrid().neighbors(tile.q, tile.r, 5);
                // this.showYields(neighborhood);
                // this.displayExpansionView(tile);
                // player owns city
                menu = `<tr><td><button class="city-menu" data-name="show_city_menu">City Menu</button></td><td></td></tr>`
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
                this.unitInfoCache = info
                this.unitInfoPanel.innerHTML = info;
            }
            return;
        }
    }

    updateGameStatePanel() {
        if (this.gameStatePanel == null) {
            return;
        }
        let info = ``
        for (const [key, player] of Object.entries(this._gameState.players)) {
            if (player.isBarbarian) {
                continue;
            }
            // const units = Object.keys(player.units).length;
            // const cities = Object.keys(player.improvements).length;
            const nation = Nations[player.nation];
            let style = "player-info-top";
            let nameColor = ""
            if (player.name === this._gameState.playersTurn) {
                nameColor = `game-info-turn`;
            }
            if (key !== this._gameState.currentPlayer) {
                nameColor += ` player-negotiation highlight-hover`
            }



            info += `<span class="${style}" data-name="${player.name}">`;

            info += `<div class="${nameColor} player-info-name"  style="padding-right:3px; margin-top:-5px;" data-name="${player.name}">`
            info += `<img src="${nation.flag_image}" alt="${nation.leader}" style="padding-right:3px; margin-top:-5px; padding-left:15px;" width="30px">`
            if (player.isDefeated) {
                info += `<s>${player.name}</s>`;
                continue;
            }
            if (key === this._gameState.currentPlayer) {
                info += `${player.name}`

            } else {
                info += `${nation.leader}`
            }
            info += `</div>`;

            // const units = Object.keys(player.units).length;
            const cities = Object.keys(player.improvements).length;
            const research = Object.keys(player.research.researched).length;
            const government = GovernmentsMap[player.government].name;
            info += `<span style="">${government}</span>`;
            info += `</br><span style=""><img class="player-info-labels" src="../../assets/ui/resources/gold.png">${player.gold}</span>`;
            info += `</br><span style=""><img class="player-info-labels" src="../../assets/ui/resources/population.png">${cities}</span>`;
            info += `</br><span style=""><img class="player-info-labels" src="../../assets/ui/resources/research.png">${research}</span>`;
            info += `</span>`;

        }
        info += `<span style="padding-left: 15px;"> ${TurnToYear(this._gameState.turn)} (TURN: ${this._gameState.turn})</span>`;
        info += `<span class="main-menu" style="padding-left: 15px;">MENU</span>`;

        this.gameStatePanel.innerHTML = info;
    }


    setActionPanel(action: string) {
        if (this.actionPanel == null) {
            return;
        }
        this.actionPanel.innerHTML = action;
    }

    actionPanelClicked(dataName: string) {
        if (this._gameState.playersTurn !== this._gameState.currentPlayer) {
            return;
        }
        if (dataName === "end_turn") {
            this.endTurn();

            // remove all selectors
            const player = this._gameState.players[this._gameState.currentPlayer];
            for (const [key, unit] of Object.entries(player.units)) {
                unit.movement = 0;
                if (unit.selector && unit.selector.mesh.parent) {
                    unit.selector.mesh.parent.remove(unit.selector.mesh);
                    unit.selector.dispose();
                    unit.selector = undefined;
                }
            }
            return;
        }
        // console.log("no interaction for action panel");
    }


    playerNegotiation(playerName: string) {
        const player1 = this._gameState.players[this._gameState.currentPlayer];
        const player2 = this._gameState.players[playerName];

        const player2nation = Nations[player2.nation];
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
            info += `<button class="player-diplomatic-menu" data-name="trade_for_peace" data-target="${player2.name}">Ask for Peace</button>`
        } else {
            // at peace
            info += `<button class="player-diplomatic-menu" data-name="trade" data-target="${player2.name}">Trade</button>`
            info += `<button class="player-diplomatic-menu" data-name="form_aliance" data-target="${player2.name}">Form Alliance</button>`

            if (player1.diplomatic_actions[player2.name].hasOwnProperty("peace")) {
                let v:DiplomaticAction = player1.diplomatic_actions[player2.name]["peace"];
                info += `<button disabled class="player-diplomatic-menu" data-name="break_alliance" data-target="${player2.name}"> Declare War Disabled (At peace until turn ${v.endTurn}) </button>`
            } else {
                info += `<button class="player-diplomatic-menu" data-name="declare_war" data-target="${player2.name}">Declare War</button>`
            }
        }
        info += `</div>`;
        this.showMenu(info);
    }

    showMenu(info: string, layout: string = "center") {
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


    showCityMenu(tile: TileData) {
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
        
        let options: [string, string, number, string][] = [
            ["scout", "Scout", 30, "../../map/icons/scout.png"],
            ["worker", "Worker", 50, "../../map/icons/worker.png"],
            ["settler", "Settler", 100, "../../map/icons/settler.png"],
            ["rifleman", "Rifleman", 100, "../../map/icons/rifleman.png"],
            ["cavalry", "Cavalry", 200, "../../map/icons/cavalry.png"],
            ["artillary", "Artillary", 300, "../../map/icons/artillary.png"],
        ]

        let player = this.getPlayer(tile.improvement.owner);
        // console.log(player.research.researched);

        if ("infantry" in player.research.researched) {
            options.push(["infantry", "Infantry", 400, "rifleman.png"]);
        }
        if ("warships" in player.research.researched) {
            options.push(["boat", "Warship", 500, "warship.png"]);
        }
        if ("tank" in player.research.researched) {
            options.push(["tank", "Tank", 500, "tank.png"]);
        }
        if ("destroyer" in player.research.researched) {
            options.push(["destroyer", "Destroyer", 500, "destroyer.png"]);
        }
        if ("gunship" in player.research.researched) {
            options.push(["gunship", "Gunship", 500, "gunship.png"]);
        }
        if ("nukes" in player.research.researched) {
            options.push(["nuke", "Nuke", 1000, "nuke.png"]);
        }

        // get all the city tiles;
        let yield_info = `<table class="city_yields">`
        yield_info += `<tr><td>Population:</td> <td>${tile.improvement.population} (+${tile.improvement.population_rate})</td></tr>`
        let round = Math.floor(tile.improvement.population);
        yield_info += `<tr><td>Yields: (${round} tiles)</td> <td></td></tr>`
        let tileYields = this.getYieldsForCity(tile);
        for (const [key, value] of Object.entries(tileYields)) {
            if (value > 0) {
                yield_info += `<tr><td>${capitalize(key)}:</td> <td>${value}</td></tr>`
            }
        }
        yield_info += "</table>"

        let building_info = `<table class="city_yields"><tr><td>Buildings:</td> <td></td></tr>`
        for (const [key, _] of Object.entries(tile.improvement.cityBuildings)) {
            let b = BuildingMap[key];
            building_info += `<tr><td>${b.name}</td></tr>`
        }
        building_info += "</table>"

        let avialable_prod = 0;
        if ("production" in tileYields) {
            avialable_prod = tileYields["production"];
        }

        let production_info = `<table class="city_yields"><tr><td>Currently Making:</td></tr>`
        if (tile.improvement.production_queue.length > 0) {
            let prod_item = tile.improvement.production_queue[0];
            if (prod_item in UnitMap) {
                let unit = UnitMap[prod_item];
                let cost = tile.improvement.work_total - tile.improvement.work_done;
                let turns = Math.ceil(cost / avialable_prod);
                let percent = Math.ceil(tile.improvement.work_done / tile.improvement.work_total * 100);
                production_info += `<tr><td>${unit.name}</td><td>${turns} turns left (${percent}%)</td></tr>`
            }
            if (prod_item in BuildingMap) {
                let building = BuildingMap[prod_item];
                let cost = tile.improvement.work_total - tile.improvement.work_done;
                let turns = Math.ceil(cost / avialable_prod);
                let percent = Math.ceil(  tile.improvement.work_done /  tile.improvement.work_total * 100);
                production_info += `<tr><td>${building.name}</td><td>${turns} turns left (${percent}%)</td></tr>`
            }
            if (prod_item === "gold") {
                production_info += `<tr><td>Gold</td></tr>`;
            }
        } else {
            production_info += `<tr><td>Nothing</td></tr>`
        }
        production_info += `</table>`

 
        let option_info = ""
        for (const [name, label, cost, image] of options) {
            let turns = Math.ceil(cost / avialable_prod)/10;
            option_info += `<tr>`
            option_info += `<td><button class="city-menu" data-name="queue" data-target="${name}"><img id="menu-unit-img" src="../../assets/ui/units/${image}">${label} (${turns} turns)</button></td>`
            option_info += `<td><button class="city-menu" data-name="buy" data-target="${name}">${cost} <img id="menu-unit-cost" src="../../assets/ui/resources/gold.png"></button></td>`
            option_info += `</tr>`
        }

        option_info += "</br>"
        for (const [key, building] of Object.entries(BuildingMap)) {
            if (key in tile.improvement.cityBuildings) {
                continue;
            }
            let turns = Math.ceil(building.cost / avialable_prod)/10;
            option_info += `<tr><td><button class="city-menu" data-name="queue_building" data-target="${key}"><img id="menu-unit-img" src="${building.menu_image}">${building.name} (${turns} turns)</button></td>`
            option_info += `<td><button class="city-menu" data-name="buy_building" data-target="${key}">${building.cost} <img id="menu-unit-cost" src="../../assets/ui/resources/gold.png"></button></td></tr>`
        }

        // gold
        option_info += `<tr><td><button class="city-menu" data-name="queue" data-target="gold"><img id="menu-unit-img" src="">Produce Gold</button></td>`

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

    getYieldsForCity(tile: TileData) {
        // from worked tiles
        let tiles = this.getTileGrid().neighbors(tile.q, tile.r, 6).filter(t => t.city === tile.city);
        let tt = this.getBestYield(tiles, tile);

        let yields: {[key: string]: number} = {};
        let resources: {[key: string]: number} = {};

        let count = 0;
        let max_count = Math.max(1, Math.floor(tile.improvement.population));
        
        yields = { ...tile.yields };

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
                    yields[keyw] += valuew as number;
                }
            }
        };

        // from buildings
        for (const [key, building] of Object.entries(tile.improvement.cityBuildings)) {
            let b = BuildingMap[key];
            for (const [key, value] of Object.entries(b.yields)) {
                if (yields[key] === undefined) {
                    yields[key] = 0;
                }
                yields[key] += value as number;
            }
        }
        return yields;
    }

    mainMenu() {
        let options: [string, string][] = [
            ["save_game", "Save Game"],
            ["load_game", "Load Latest Saved Game"],
        ]
        let options2: [string, string][] = [
            ["main_menu", "Exit to Main Menu"],
            ["exit_desktop", "Exit to Desktop"],
            ["dev_mode", "Enable Dev Mode"],
        ]

        let option_info = ""
        for (const [name, label] of options) {
            option_info += `<button class="main-menu-option" data-name="${name}">${label}</button>`
        }
        for (const [name, label] of options2) {
            option_info += `<button class="main-menu-option" data-name="${name}">${label}</button>`
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
    async mainMenuOption(name: String) {
        if (name === "main_menu") {
            window.location.href = './main_menu.html'
        }
        if (name === "exit_desktop") {
            window.close();
        }
        if (name === "dev_mode") {
            let settings = JSON.parse(localStorage.getItem('settings') || '{}');
            // if (settings.dev_mode && settings.dev_mode === true) {
            //     settings.dev_mode = false;
            //     localStorage.setItem('settings', JSON.stringify(settings));
            //     this.settings = settings;
            //     this.updateGlobalFog();
            //     return;
            // }
            settings.dev_mode = true;
            localStorage.setItem('settings', JSON.stringify(settings));
            this.settings = settings;
            this.updateGlobalFog();
            this.stats.showPanel(0);
            document.body.appendChild(this.stats.dom);
            console.log("Dev mode enabled");
        }
        if (name === "load_game") {
            let savedGames = JSON.parse(localStorage.getItem('saved_games') || '[]');
            let save_id = `saved_game_${savedGames[savedGames.length - 1].name}`;
            localStorage.setItem('load_game', save_id);
            location.reload(); // TODO (give choice of saved games)
        }
        if (name === "save_game") {
            this.menuPanel.innerHTML = "Saving.."
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
    }

    checkForClearanceToAttack(player1: Player, player2: Player): boolean {
        if (player1.isBarbarian || player2.isBarbarian) {
            return true;
        }
        const nation = Nations[player2.nation];
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

    checkForClearanceToMove(player1: Player, player2: Player): boolean {
        if (player1.isBarbarian || player2.isBarbarian) {
            return true;
        }
        const nation = Nations[player2.nation];
        if (player1.diplomatic_actions[player2.name].hasOwnProperty("war")) {
            return true;
        }
        if (player1.name !== this._gameState.currentPlayer) {
            return false;
        }
        return false;
    }

    cityMenuAction(name: string, target: string) {
        console.log(name, target )
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
            this.playSound(asset("sounds/ui/buy.mp3"));
        }
        if (name === "decrease_taxes") {
            if (player.taxRate - 0.1 < 0) {
                return
            }
            player.taxRate -= 0.1;
            for (const [key, improvement] of Object.entries(player.improvements)) {
                this.updatePopulationAndProductionRates(player, improvement);
            }
            this.playSound(asset("sounds/ui/buy.mp3"));
        }

        if (name === "change_government") {
            player.government = target;
            this.toast({
                icon: "../../assets/map/icons/star.png",
                text: `${player.name} government changed to ${GovernmentsMap[target].name}`,
                onClick: function () { }
            });
            this.CloseMenu();
        }

        if (name === "settler_place_city") {
            let tile = this.selectedTile;
            // start city
            let player = this.getPlayer(this.gameState.currentPlayer);
            let defaultName = getNextCityName(player);
            // this.getTextInput(`<h3>City Name</h3>`, defaultName, (name) => {
                let name = defaultName;
                let city = CreateCity(player, name);
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
            // });
            
        }
        if (name === "worker_improvement") {
            let type = target;
            let tile = this.selectedTile;
            if (tile.unit) {
                tile.unit.movement = 0;
            }
            const workerImprovement = CreateWorkerImprovement(type);
            this.addWorkerImprovementToMap(workerImprovement, tile);
            this.focusOnNextAction();
        }
        if (name === "unit_fortify") {
            let type = target;
            let tile = this.selectedTile;
            if (tile.unit) {
                tile.unit.orders = "fortify";
            }
            this.updateUnitInfoForTile(tile);
            this.focusOnNextAction();
        }
        if (name === "unit_sleep") {
            let type = target;
            let tile = this.selectedTile;
            if (tile.unit) {
                tile.unit.orders = "sleep";
            }
            this.updateUnitInfoForTile(tile);
            this.focusOnNextAction();
        }
        if (name === "buy_building") {
            let building = target;
            tile.improvement.cityBuildings[building] = true;
            player.gold -= BuildingMap[building].cost;
            this.showCityMenu(tile);
        }

        let unit_type = "";
        let unit_terrain = "land";
        if (name === "buy") {
            unit_type = target;
            if (unit_type === "boat" || unit_type === "destroyer") {
                unit_terrain = "water";
            }
            if (unit_type === "gunship") {
                unit_terrain = "";
            }
            if (unit_type !== "") {
                const mm = UnitMap[unit_type];
                let unit = createUnit(unit_type, player)
                player.gold -= mm.cost;
                this.addUnitToMap(
                    unit,
                    this.getClosestUnoccupiedTile(tile, unit_terrain)
                );
            }
            this.playSound(asset("sounds/ui/buy.mp3"));
        }

        if (name === "queue") {
            tile.improvement.work_done = 0;
            tile.improvement.production_queue = [target];
            if (target in UnitMap) {
                tile.improvement.work_total = UnitMap[target].cost/10;
            }
            tile.improvement.work_building = false;
            this.playSound(asset("sounds/ui/notification.mp3"));
            this.updateCityLabel(tile);
            this.CloseMenu();
            this.focusOnNextAction();
        }
        if (name === "queue_building") {
            tile.improvement.work_done = 0;
            tile.improvement.production_queue = [target];
            tile.improvement.work_total = BuildingMap[target].cost/10;
            tile.improvement.work_building = true;
            this.playSound(asset("sounds/ui/notification.mp3"));
            this.updateCityLabel(tile);
            this.CloseMenu();
            this.focusOnNextAction();
        }
        this.updateResourcePanel();
        this.updateGameStatePanel();
        // this.updateUnitInfoForTile(tile);
        // 
    }

    playerDiplmaticAction(name: string, target: string) {
        const player = this._gameState.players[this._gameState.currentPlayer];
        console.log("target", target);
        const targetPlayer = this._gameState.players[target];
        if (name === "declare_war") {
            DeclareWarBetweenPlayers(this._gameState, player, targetPlayer);
            this.toast({
                icon: "../../assets/map/icons/star.png",
                text: `War between ${player.name} and ${targetPlayer.name} declared!`,
                onClick: function () { }
            });
            this.CloseMenu();
            console.log(this._gameState)
            return;
        }
        if (name === "trade" || name === "trade_for_peace") {
            const targetNation = Nations[targetPlayer.nation];
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
            ResetNegotiations(this, player, targetPlayer);
            info += TradeMenuHtml();
            this.showMenu(info);
            return;
        }
    }

    checkVictoryConditions() {
        // check if current player lost
        const currentPlayer = this._gameState.players[this._gameState.currentPlayer];
        if (Object.keys(currentPlayer.improvements).length === 0) {
            console.log("Lost!");
            let info = `<h1>Defeat!</h1>`;
            info += `<p>`;
            info += `<img class="event-img" src="../../assets/ui/events/defeat.png">`;
            info += `</p>`;
            this.playSound(asset("sounds/ui/violin-lose.mp3"));
            this.showMenu(info)
            return;
        }

        for (const [key, player] of Object.entries(this._gameState.players)) {
            if (player.isDefeated === false && Object.keys(player.improvements).length === 0) {
                player.isDefeated = true

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
            if (player.isDefeated === false && player.isBarbarian !== false && player.name !== this._gameState.currentPlayer) {
                return
            }
        }

        console.log("Victory!");
        let info = `<h1>Victory!</h1>`;
        info += `<p>`;
        info += `<img class="event-img" src="../../assets/ui/events/victory.png">`;
        info += `</p>`;
        this.playSound(asset("sounds/ui/violin-win.mp3"));
        this.showMenu(info);
    }

    playSound(name: string, position?: Vector3) {
        const sound = new Audio(this._listener);
        const audioLoader = new AudioLoader();
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

// Calculate the distance between two hexes (Manhattan distance in axial coordinates)
function getHexDistance(a: TileData, b: TileData): number {
    return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
}


// Tween Function
function animateToPosition(
    object: Object3D,
    targetX: number,
    targetY: number,
    duration: number,
    easing: (t: number) => number,
    onComplete?: () => void
) {
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
        } else {
            if (onComplete) {
                onComplete();
            }
        }
    }
    animate();
}

function animateFall(
    object: Object3D,
    targetX: number,
    targetY: number,
    duration: number,
    easing: (t: number) => number,
    onComplete?: () => void
) {
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
        } else {
            if (onComplete) {
                onComplete();
            }
        }
    }

    animate();
}

function showBanner(text: string) {
    let a = document.getElementById('achievement');
    a.innerHTML = text;
    a.classList.add('show');
    setTimeout(() => { document.getElementById('achievement').classList.add('remove'); }, 2000);
    setTimeout(() => { document.getElementById('achievement').classList.remove('remove', 'show'); }, 3000);
}

function easeOutQuad(t: number): number {
    return t * (2 - t);
}

export function CloseMenu() {
    document.getElementById('menu').innerHTML = '';
    document.getElementById('menu-modal').style.visibility = 'hidden';
    document.getElementById('menu').style.visibility = 'hidden';
}