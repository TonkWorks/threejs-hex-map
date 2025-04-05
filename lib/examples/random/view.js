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
define(["require", "exports", "../../src/MapView", "../../src/util", "../../src/interfaces", "../../src/map/map-generator", "./util", "three"], function (require, exports, MapView_1, util_1, interfaces_1, map_generator_1, util_2, three_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initView = initView;
    MapView_1 = __importDefault(MapView_1);
    function asset(relativePath) {
        return "../../assets/" + relativePath;
    }
    function loadTextureAtlas() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, util_1.loadJSON)(asset("land-atlas.json"));
        });
    }
    function generateMap(mapSize_1) {
        return __awaiter(this, arguments, void 0, function* (mapSize, mapType = map_generator_1.MapType.ONE_BIG_ISLAND) {
            function coldZone(q, r, height) {
                if (Math.abs(r) > mapSize * (0.44 + Math.random() * 0.03))
                    return "snow";
                else
                    return "tundra";
            }
            function warmZone(q, r, height) {
                // Simple coordinate-based hash to create coherent regions
                // This combines coordinates to create stable terrain "pockets"
                const regionSize = 2; // Controls how large terrain groups are (2-3 cells)
                // Create region coordinates (nearby cells will share same region)
                const regionQ = Math.floor(q / regionSize);
                const regionR = Math.floor(r / regionSize);
                // Handle negative coordinates differently to prevent bias
                // Use absolute values in the hash calculation to prevent left-side bias
                const absQ = Math.abs(regionQ);
                const absR = Math.abs(regionR);
                // Create a more balanced hash value from the region coordinates
                // Using different prime multipliers and adding a rotation factor
                const hash = ((absQ * 37 + absR * 29) + (regionQ * regionR * 13)) % 100;
                // Use a secondary spatial factor to prevent deserts from clustering on one side
                const spatialFactor = Math.sin(regionQ * 0.3 + regionR * 0.4) * 50 + 50; // 0-100 range
                // Combine the hash and spatial factor for final terrain determination
                const terrainValue = (hash + spatialFactor) / 2;
                // Use terrainValue to determine terrain type with weighted distribution
                if (terrainValue < 15) {
                    return "desert"; // 15% chance
                }
                else if (terrainValue < 35) {
                    return "plains"; // 20% chance
                }
                else if (terrainValue < 75) {
                    return "grass"; // 40% chance
                }
                else if (terrainValue < 90) {
                    return "grass_2"; // 15% chance
                }
                else {
                    return "plains"; // 10% chance
                }
                // return varying("grass", "grass", "grass_2", "plains", "plains", "desert")
            }
            function terrainAt(q, r, height) {
                if (height < 0.0)
                    return "ocean";
                else if (height > 0.75)
                    return "mountain";
                else if (Math.abs(r) > mapSize * 0.4)
                    return coldZone(q, r, height);
                else
                    return warmZone(q, r, height);
            }
            function treeAt(q, r, terrain) {
                if (terrain == "snow")
                    return 2;
                else if (terrain == "tundra")
                    return 1;
                else
                    return 0;
            }
            const grid = yield (0, map_generator_1.generateRandomMap)(mapSize, (q, r, height) => {
                const terrain = terrainAt(q, r, height);
                const trees = (0, interfaces_1.isMountain)(height) || (0, interfaces_1.isWater)(height) || terrain == "desert" ? undefined :
                    ((0, util_2.varying)(true, false, false) ? treeAt(q, r, terrain) : undefined);
                return { q, r, height, terrain, treeIndex: trees, rivers: null, locked: false, fog: true, clouds: true };
            }, mapType);
            grid.forEachQR((q, r, tile) => {
                let terrain = (0, interfaces_1.getTerrain)(tile);
                if (terrain === "ocean" && tile.height >= 0.0) {
                    // Re-calculate terrain based on the new height
                    terrain = terrainAt(q, r, tile.height);
                    // Update tree indexes if needed
                    if (terrain !== "desert" && terrain !== "mountain") {
                        tile.treeIndex = (0, util_2.varying)(true, false, false) ? treeAt(q, r, terrain) : undefined;
                    }
                }
            });
            return grid;
        });
    }
    function initView(mapSize, initialZoom) {
        return __awaiter(this, void 0, void 0, function* () {
            const textureLoader = new three_1.TextureLoader();
            const loadTexture = (name) => {
                const texture = textureLoader.load(asset(name));
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
            const mapView = new MapView_1.default();
            mapView.zoom = initialZoom;
            const controller = mapView.controller;
            mapView.resourcePanel = document.getElementById("resource-info");
            mapView.unitInfoPanel = document.getElementById("unit-info");
            mapView.gameStatePanel = document.getElementById("game-info");
            mapView.menuPanel = document.getElementById("menu");
            mapView.actionPanel = document.getElementById("action");
            // const url = '/assets/game_maps/random.json';
            // await fetch(url)
            // .then(response => {
            //   // Check if the request was successful
            //   if (!response.ok) {
            //       throw new Error('Network response was not ok');
            //   }
            //   return response.json(); // Parse JSON from the response
            // })
            // .then(data => {
            //   console.log('JSON data:', data); // Handle the JSON data
            //   mapView.loadFromJSON(data)
            // })
            let makeNew = true;
            const savedGameName = localStorage.getItem('load_game');
            // console.log(localStorage);
            if (savedGameName) {
                const savedGame = localStorage.getItem(`${savedGameName}`);
                if (savedGame) {
                    mapView.loadFromJSON(JSON.parse(savedGame));
                    localStorage.removeItem('load_game');
                    makeNew = false;
                }
                else {
                    console.error('Failed to load saved game');
                }
            }
            if (makeNew) {
                let new_game_settingsStr = localStorage.getItem("new_game_settings");
                let new_game_settings = {};
                if (new_game_settingsStr) {
                    new_game_settings = JSON.parse(new_game_settingsStr);
                }
                if (new_game_settings.mapSize) {
                    mapSize = new_game_settings.mapSize;
                }
                const [map, atlas] = yield Promise.all([generateMap(mapSize, new_game_settings.map), loadTextureAtlas()]);
                options.terrainAtlas = atlas;
                mapView.load(map, options);
            }
            mapView.onLoaded = () => {
                // uncover tiles around initial selection
                //  setFogAround(mapView, mapView.selectedTile, 100, true, true)
                mapView.initGameSetup();
                mapView._selectedUnit = null;
                mapView.focus(mapView.selectedTile.q + 1, mapView.selectedTile.r - 3);
                // setFogAround(mapView, mapView.selectedTile, 5, true, false)
                // setFogAround(mapView, mapView.selectedTile, 5, false, false)
                mapView.updateResourcePanel();
                mapView.updateGameStatePanel();
                mapView.showEndTurnInActionPanel();
                document.body.addEventListener('click', (event) => {
                    let action = false;
                    const target = event.target;
                    if (target && target.classList.contains('player-negotiation')) {
                        action = true;
                        const dataAttribute = target.getAttribute('data-name');
                        mapView.playerNegotiation(dataAttribute);
                    }
                    if (target && target.classList.contains('player-diplomatic-menu')) {
                        action = true;
                        const dataAttribute = target.getAttribute('data-name');
                        const dataTarget = target.getAttribute('data-target');
                        mapView.playerDiplmaticAction(dataAttribute, dataTarget);
                    }
                    if (target && target.classList.contains('main-menu')) {
                        console.log('main-menu clicked');
                        action = true;
                        mapView.mainMenu();
                    }
                    if (target && target.classList.contains('main-menu-option')) {
                        action = true;
                        const dataAttribute = target.getAttribute('data-name');
                        mapView.mainMenuOption(dataAttribute);
                    }
                    if (target && target.id === 'menu-modal') {
                        mapView.CloseMenu();
                    }
                    if (target && target.classList.contains('city-menu')) {
                        action = true;
                        const dataAttribute = target.getAttribute('data-name');
                        const dataTarget = target.getAttribute('data-target');
                        mapView.cityMenuAction(dataAttribute, dataTarget, target);
                    }
                    if (target && target.classList.contains('city-label')) {
                        action = true;
                        const dataAttribute = target.getAttribute('data-target');
                        mapView.cityLabelClick(dataAttribute);
                    }
                    if (target && target.classList.contains('action-menu')) {
                        action = true;
                        const dataAttribute = target.getAttribute('data-name');
                        mapView.actionPanelClicked(dataAttribute);
                    }
                    if (target && target.classList.contains('general-menu')) {
                        action = true;
                        const dataAttribute = target.getAttribute('data-name');
                        mapView.generalMenuClicked(dataAttribute);
                    }
                    if (target && target.classList.contains('menu-trade')) {
                        action = true;
                        mapView.tradeMenuClicked(target);
                    }
                    if (target && target.classList.contains('research')) {
                        action = true;
                        mapView.pickResearch();
                    }
                    if (target && target.classList.contains('taxes')) {
                        action = true;
                        mapView.updateTaxes();
                    }
                    if (action) {
                        event.stopPropagation();
                        mapView.playSound(asset("sounds/ui/click.mp3"));
                    }
                });
            };
            let lastDivToolTipTarget = "";
            document.getElementById("resource-info").addEventListener('mouseover', (event) => {
                const tt = event.target;
                const target = tt.closest('span.sub');
                if (!target)
                    return;
                if (lastDivToolTipTarget === target.id)
                    return;
                lastDivToolTipTarget = target.id;
                mapView.updateToolTipFromDiv(target.id, event.x, event.y);
            });
            document.getElementById("resource-info").addEventListener('mouseleave', (event) => {
                lastDivToolTipTarget = "";
                mapView.hideTooltip();
            });
            mapView.onTileSelected = (tile) => {
                // uncover tiles around selection
                // setFogAround(mapView, tile,  2, false, false)
                // update unit window
            };
            return mapView;
        });
    }
    // function moveUnitToHex(q, r) {
    //     const targetHex = hexMap.getHex(q, r); // Get the hex at q, r
    //     if (targetHex) {
    //         unit.position.set(targetHex.x, targetHex.y, targetHex.z + 0.5); // Adjust Z for height
    //     } else {
    //         console.warn("Target hex not found!");
    //     }
    // }
    // // Example move to a hex at q = 2, r = -1
    // moveUnitToHex(2, -1);
    /**
     * @param fog whether there should be fog on this tile making it appear darker
     * @param clouds whether there should be "clouds", i.e. an opaque texture, hiding the tile
     * @param range number of tiles around the given tile that should be updated
     * @param tile tile around which fog should be updated
     */
    function setFogAround(mapView, tile, range, fog, clouds) {
        const tiles = mapView.getTileGrid().neighbors(tile.q, tile.r, range);
        const updated = tiles.map((t) => {
            t.fog = fog;
            t.clouds = clouds;
            return t;
        });
        mapView.updateTiles(updated);
    }
});
//# sourceMappingURL=view.js.map