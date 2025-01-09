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
define(["require", "exports", "../../src/MapView", "../../src/util", "../../src/interfaces", "../../src/map-generator", "./util", "three"], function (require, exports, MapView_1, util_1, interfaces_1, map_generator_1, util_2, three_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MapView_1 = __importDefault(MapView_1);
    function asset(relativePath) {
        return "../../assets/" + relativePath;
    }
    function loadTextureAtlas() {
        return __awaiter(this, void 0, void 0, function* () {
            return util_1.loadJSON(asset("land-atlas.json"));
        });
    }
    function generateMap(mapSize) {
        return __awaiter(this, void 0, void 0, function* () {
            function coldZone(q, r, height) {
                if (Math.abs(r) > mapSize * (0.44 + Math.random() * 0.03))
                    return "snow";
                else
                    return "tundra";
            }
            function warmZone(q, r, height) {
                return util_2.varying("grass", "grass", "grass", "plains", "plains", "desert");
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
            return map_generator_1.generateRandomMap(mapSize, (q, r, height) => {
                const terrain = terrainAt(q, r, height);
                const trees = interfaces_1.isMountain(height) || interfaces_1.isWater(height) || terrain == "desert" ? undefined :
                    (util_2.varying(true, false, false) ? treeAt(q, r, terrain) : undefined);
                return { q, r, height, terrain, treeIndex: trees, rivers: null, fog: false, clouds: false };
            });
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
            const [map, atlas] = yield Promise.all([generateMap(mapSize), loadTextureAtlas()]);
            options.terrainAtlas = atlas;
            const mapView = new MapView_1.default();
            mapView.zoom = initialZoom;
            mapView.load(map, options);
            const controller = mapView.controller;
            controller.debugOutput = document.getElementById("debug");
            mapView.onLoaded = () => {
                // uncover tiles around initial selection
                setFogAround(mapView, mapView.selectedTile, 10, true, false);
                setFogAround(mapView, mapView.selectedTile, 5, false, false);
            };
            mapView.onTileSelected = (tile) => {
                // uncover tiles around selection
                setFogAround(mapView, tile, 2, false, false);
                createUnit(mapView, tile);
            };
            return mapView;
        });
    }
    exports.initView = initView;
    /**
     * @param fog whether there should be fog on this tile making it appear darker
     * @param clouds whether there should be "clouds", i.e. an opaque texture, hiding the tile
     * @param range number of tiles around the given tile that should be updated
     * @param tile tile around which fog should be updated
     */
    function createUnit(mapView, tile) {
        console.log("create unit?");
        mapView.addUnitToTile(tile);
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
        const updated = tiles.map(t => {
            t.fog = fog;
            t.clouds = clouds;
            return t;
        });
        mapView.updateTiles(updated);
    }
});
//# sourceMappingURL=view.js.map