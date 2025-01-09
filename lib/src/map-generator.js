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
define(["require", "exports", "./perlin", "./interfaces", "./util", "./Grid", "./hexagon"], function (require, exports, perlin_1, interfaces_1, util_1, Grid_1, hexagon_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Grid_1 = __importDefault(Grid_1);
    function randomHeight(q, r) {
        var noise1 = perlin_1.simplex2(q / 10, r / 10);
        var noise2 = perlin_1.perlin2(q / 5, r / 5);
        var noise3 = perlin_1.perlin2(q / 30, r / 30);
        var noise = noise1 + noise2 + noise3;
        return noise / 3.0 * 2.0;
    }
    /**
     * Generates are square map of the given size centered at (0,0).
     * @param size
     * @param heightAt
     * @param terrainAt
     */
    function generateMap(size, tile) {
        return __awaiter(this, void 0, void 0, function* () {
            const grid = new Grid_1.default(size, size).mapQR((q, r) => tile(q, r));
            const withRivers = generateRivers(grid);
            return withRivers;
        });
    }
    exports.generateMap = generateMap;
    function generateRandomMap(size, tile) {
        return __awaiter(this, void 0, void 0, function* () {
            perlin_1.seed(Date.now() + Math.random());
            return generateMap(size, (q, r) => tile(q, r, randomHeight(q, r)));
        });
    }
    exports.generateRandomMap = generateRandomMap;
    function generateRivers(grid) {
        // find a few river spawn points, preferably in mountains
        const tiles = grid.toArray();
        const numRivers = Math.max(1, Math.round(Math.sqrt(grid.length) / 4));
        const spawns = util_1.shuffle(tiles.filter(t => isAccessibleMountain(t, grid))).slice(0, numRivers);
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
            while (!interfaces_1.isWater(tile.height) && river.length < 20) {
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
        let spring = interfaces_1.isMountain(tile.height);
        return spring && ns.filter(t => interfaces_1.isLand(t.height)).length > 3;
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
            return interfaces_1.isWater(t.height);
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
    exports.waterAdjacency = waterAdjacency;
    /**
     * Returns a random point on a hex tile considering adjacent water, i.e. avoiding points on the beach.
     * @param water water adjacency of the tile
     * @param scale coordinate scale
     * @returns {THREE.Vector3} local position
     */
    function randomPointOnCoastTile(water, scale = 1.0) {
        return hexagon_1.randomPointInHexagonEx(scale, corner => {
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
    exports.randomPointOnCoastTile = randomPointOnCoastTile;
});
//# sourceMappingURL=map-generator.js.map