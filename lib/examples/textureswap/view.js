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
            return map_generator_1.generateRandomMap(mapSize, (q, r, height) => {
                const terrain = (height < 0 && "ocean") || (height > 0.75 && "mountain") || util_2.varying("grass", "plains");
                const trees = !interfaces_1.isMountain(height) && !interfaces_1.isWater(height) && util_2.varying(true, false) ?
                    Math.floor(Math.random() * 2) : undefined;
                return { q, r, height, terrain, treeIndex: trees, rivers: null, fog: false, clouds: false };
            });
        });
    }
    function initView(mapSize, initialZoom) {
        return __awaiter(this, void 0, void 0, function* () {
            const textureLoader = new three_1.TextureLoader();
            const loadTexture = (name) => textureLoader.load(asset(name));
            const options = {
                terrainAtlas: null,
                terrainAtlasTexture: loadTexture("terrain.png"),
                hillsNormalTexture: loadTexture("hills-normal.png"),
                coastAtlasTexture: loadTexture("coast-diffuse.png"),
                riverAtlasTexture: loadTexture("river-diffuse.png"),
                undiscoveredTexture: loadTexture("paper.jpg"),
                transitionTexture: loadTexture("transitions.png"),
                treeSpritesheet: loadTexture("trees.png"),
                treeSpritesheetSubdivisions: 4
            };
            const [map, atlas] = yield Promise.all([generateMap(mapSize), loadTextureAtlas()]);
            options.terrainAtlas = atlas;
            const mapView = new MapView_1.default();
            mapView.zoom = initialZoom;
            mapView.load(map, options);
            mapView.onTileSelected = (tile) => {
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