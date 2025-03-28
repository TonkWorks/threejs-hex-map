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
define(["require", "exports", "./perlin", "../interfaces", "../util", "./Grid", "./hexagon"], function (require, exports, perlin_1, interfaces_1, util_1, Grid_1, hexagon_1) {
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
});
//# sourceMappingURL=map-generator.js.map