import { BuildingMap } from './CityImprovements';
import { Player, DeclareWarBetweenPlayers } from './GameState';
import { CreateWorkerImprovement } from './ImprovementsWorker';
import { TileData } from './interfaces';
import MapView from './MapView';
import Unit, { CreateCity, createUnit } from './Units';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function takeTurn(mapView: MapView, player: Player) {
    if (player.isBarbarian === true) {
        // todo unit movements/attacks
        placeBarbarianEncampents(mapView);
        mapView.endTurn();
        return
    }

    if (player.isDefeated === true) {
        mapView.endTurn();
        return;
    }

    // Generate a random delay between 0.1 and 1.5 seconds
    const randomDelay = Math.random() * (300 - 100) + 100;
    await sleep(randomDelay);

    // TODO fight against all players not just first player
    let atWar = false;
    let targets = [];
    for (const playerName in player.diplomatic_actions) {
        if ("war" in player.diplomatic_actions[playerName]) {
            atWar = true;
            targets.push(...findAlltargetTiles(mapView, mapView.gameState.players[playerName]));
        }
    }

    determineStrategy(player);
    buildEconomy(mapView, player);

    if (Object.keys(player.improvements).length < 2 && player.gold >= 100) {
        placeACity(mapView, player);
    }
    buildArmy(mapView, player);

    if (atWar) {
        await attack(mapView, player, targets);
    }

    mapView.endTurn();
}
export function determineStrategy(player: Player) {
    //
}

export function buildEconomy(mapView: MapView, player: Player) {
    // go through cities and set production queues
    for (const [key, improvement] of Object.entries(player.improvements)) {
        if (improvement.production_queue.length === 0) {
            let rec = getRecommendedEconomic(improvement, player);
            if (rec !== "") {
                improvement.production_queue = [rec];
                if (Object.keys(BuildingMap).includes(rec)) {
                    improvement.work_building = true;                
                }
            }
        }
    }
    // go through workers
    let tilesBeingWorked: TileData[] = [];
    for (const [key, unit] of Object.entries(player.units)) {
        if (unit.type === "worker") {
            let t = findTargetForWorker(mapView, mapView.getTile(unit.tileInfo.q, unit.tileInfo.r), tilesBeingWorked);
            tilesBeingWorked.push(t);
        }
    }
}

export function buildArmy(mapView: MapView, player: Player) {
    const cityKeys = Object.keys(player.improvements);
    const randomIndex = Math.floor(Math.random() * cityKeys.length);
    const randomCityKey = cityKeys[randomIndex];
    const city = player.improvements[randomCityKey];
    const tile = mapView.getTile(city.tileInfo.q, city.tileInfo.r);

    // must do something with money?
    let maxActions = 6;
    while (player.gold > 100 && maxActions > 0) {
        maxActions -= 1;
        const options = ["build_city", "build_rifleman", "build_calvary", "build_artillary"]
        const randomIndex = Math.floor(Math.random() * options.length);

        let unit = null
        if (options[randomIndex] === "build_city") {
            player.gold -= 100;
            placeACity(mapView, player);
        }
        else if (options[randomIndex] === "build_rifleman") {
            player.gold -= 100;
            unit = createUnit("rifleman", player);
        } else if (options[randomIndex] === "build_calvary") {
            player.gold -= 200;
            unit = createUnit("cavalry", player);
        } else if (options[randomIndex] === "build_artillary") {
            player.gold -= 300;
            unit = createUnit("artillary", player);
        }
        if (unit) {
            mapView.addUnitToMap(
                unit, 
                mapView.getClosestUnoccupiedTile(tile, "land")
            );
        }
    }
}

export function placeACity(mapView: MapView, player: Player): boolean {
    // randomly pick a city that is owned by the player
    const maxAttempts = 20;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const tile = findACityLocation(mapView, player, 4);
        if (!tile) {
            continue;
        }
        player.gold -= 100;
        mapView.addImprovementToMap(CreateCity(player), tile);
        mapView.updateAllVisilibility();
        return true;
    }
    return false;
    
}

export function findACityLocation(mapView: MapView, player: Player, radius: number): TileData | null {
    // randomly pick a city that is owned by the player
    const cityKeys = Object.keys(player.improvements);
    const randomIndex = Math.floor(Math.random() * cityKeys.length);
    const randomCityKey = cityKeys[randomIndex];
    const city = player.improvements[randomCityKey];
    const tile = mapView.getTile(city.tileInfo.q, city.tileInfo.r);

    const tiles = mapView.getTileGrid().neighbors(tile.q, tile.r, radius)
    const randomTileIndex = Math.floor(Math.random() * tiles.length);
    const randomTile = tiles[randomTileIndex];

    if (!mapView.isTileCityEligbile(randomTile)) {
        return null;
    }
    return randomTile;

}

function findAlltargetTiles(mapView: MapView, player: Player) {
    const targets = [];
    for (const tt of Object.values(player.units)) {
        const t = mapView.getTile(tt.tileInfo.q, tt.tileInfo.r);
        targets.push(t);
    }
    for (const tt of Object.values(player.improvements)) {
        const t = mapView.getTile(tt.tileInfo.q, tt.tileInfo.r);
        targets.push(t);
    }
    return targets;
}


export async function attack(mapView: MapView, player: Player, targets: TileData[]) {
    for (const unit of Object.values(player.units)) {
      const t = mapView.getTile(unit.tileInfo.q, unit.tileInfo.r);
      let targetTile = findTargetForUnit(t, targets);
  
      // If no target is available, skip this unit
      if (!targetTile) {
        continue;
      }
  
      const MAX_RETRIES = 5;
      let retries = 0;
  
      // Try a few times with 250ms delay if the target is locked
      while (targetTile && targetTile.locked && retries < MAX_RETRIES) {
        await sleep(250);
        retries++;
      }
  
      // If the target is still locked after retries, move it to the back of the queue
      if (targetTile && targetTile.locked) {
        const idx = targets.indexOf(targetTile);
        if (idx > -1) {
          targets.splice(idx, 1);
          targets.push(targetTile);
        }
        // Attempt to find another target now that the locked one is at the back
        targetTile = findTargetForUnit(t, targets);
      }
  
      // If still no valid (and unlocked) target is found, skip this unit
      if (!targetTile || targetTile.locked) {
        continue;
      }
      mapView.moveUnit(t, targetTile);
  
      // Additional attack logic would go here (e.g. attacking enemy units)
    }
  }
  
// Barbarian AI
function placeBarbarianEncampents(mapView: MapView) {
    // For now just place near the player cities
    // Get players cities
    const playerCities = mapView._gameState.players[mapView._gameState.currentPlayer].improvements;
    const cityKeys = Object.keys(playerCities);
    if (cityKeys.length === 0) {
        return;
    }
    const randomIndex = Math.floor(Math.random() * cityKeys.length);
    const randomCityKey = cityKeys[randomIndex];
    const city = playerCities[randomCityKey];


    // Attempt to place encampment near city
    const tile = mapView.getTile(city.tileInfo.q, city.tileInfo.r);
    const max_radius = 7;

    const tiles = mapView.getTileGrid().neighbors(tile.q, tile.r, max_radius);
    const eligibleTiles:TileData[] = [];
    for (const t of tiles) {
        if (t.fog === false) {
            continue;
        }
        if (t.terrain === "water" || t.terrain === "mountain") {
            continue;
        }
        if (t.owner !== undefined && t.owner !== "") {
            continue;
        }
        if (t.worker_improvement) {
            continue;
        }
        // no encampents within 7 tiles of each other.
        if (mapView.getTileGrid().neighbors(t.q, t.r, 6).filter(x => x.worker_improvement?.type === "encampent").length > 0) {
            continue;
        }
        eligibleTiles.push(t);
    }
    if (eligibleTiles.length === 0) {
        return;
    }
    const randomTileIndex = Math.floor(Math.random() * eligibleTiles.length);
    const randomTile = eligibleTiles[randomTileIndex];
    randomTile.worker_improvement = CreateWorkerImprovement("encampent");
    mapView.addWorkerImprovementToMap(randomTile.worker_improvement, randomTile);
    let barbPlayer = mapView._gameState.players["barbarians"];

    let t = mapView.getTile(randomTile.q, randomTile.r);
    mapView.addUnitToMap(createUnit("rifleman", barbPlayer), t);

};

// General AI
function getRecommendedEconomic(improvement: any, player: Player) {
    // if not at least 1 worker build a worker
    if (!hasEnoughWorkers(player)) {
        return "worker";
    }

    // available buildings
    let available_buildings = [];
    for (const [key, building] of Object.entries(BuildingMap)) {
        if (key in improvement.cityBuildings) {
            continue;
        }
        available_buildings.push(key);
    }

    const randomIndex = Math.floor(Math.random() * available_buildings.length);
    if (available_buildings.length > 0) {
        return available_buildings[randomIndex];
    }

    //default 
    return ""; // or gold?
}

export function findTargetForWorker(mapView: MapView, tile: TileData, tilesBeingWorked: TileData[]) {
    const tiles = mapView.getTileGrid().neighbors(tile.q, tile.r, 6)
    let tt = mapView.getBestYield(tiles, tile);

    for (const t of tt) {
        if (t.worker_improvement) {
            continue;
        }
        if (t.improvement) {
            continue;
        }
        if (t.owner === undefined) {
            continue;
        }
        if (t.owner !== tile.unit.owner) {
            continue;
        }
        if (tilesBeingWorked.includes(t)) {
            continue;
        }

        let options = ["farm", "mine"];
        let randomTypeIndex = Math.floor(Math.random() * options.length);
        let type = options[randomTypeIndex];

        let target = t;
        if (tile !== target) {
            mapView.moveUnit(tile, t);
        } else {
            mapView.addWorkerImprovementToMap(CreateWorkerImprovement(type), t);
        }
        return t;
    }
}

function hasEnoughWorkers(player: Player) {
    let count = 0;
    for (const [key, unit] of Object.entries(player.units)) {
        if (unit.type === "worker") {
            count += 1;
        }
    }
    return count >= 1;
}

// General
function findTargetForUnit(currentTile: TileData, targets: TileData[]) {
    // spice it up by removing a random target
    // TODO: add more spice (maybe first, second, third closest?)
    // if (targets.length > 2) {
    //     const randomIndex = Math.floor(Math.random() * targets.length);
    //     targets.splice(randomIndex, 1);
    // }

    // get closest?
    return getClosestTile(currentTile, targets);
}

function getClosestTile(currentTile: TileData, targets: TileData[]): TileData | null {
    if (targets.length === 0) {
        return null;
    }

    let closestTile = targets[0];
    let shortestDistance = getDistance(currentTile, closestTile);

    for (const target of targets) {
        const distance = getDistance(currentTile, target);
        if (distance <= shortestDistance) {
            closestTile = target;
            shortestDistance = distance;
        }
    }

    return closestTile;
}

function getDistance(a: TileData, b: TileData): number {
    return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
}

export default determineStrategy;
