import { Player, DeclareWarBetweenPlayers } from './GameState';
import { TileData } from './interfaces';
import MapView from './MapView';
import Unit, { CreateRifleman, CreateCavalry, CreateArtillary, CreateCity } from './Units';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function takeTurn(mapView: MapView, player: Player) {

    // Generate a random delay between 0.1 and 1.5 seconds
    const randomDelay = Math.random() * (300 - 100) + 100;
    await sleep(randomDelay);

    // TODO fight against all players not just first player
    let atWar = false;
    let targets = [];
    for (const playerName in player.diplomatic_actions) {
        if ("war" in player.diplomatic_actions[playerName]) {
            atWar = true;
            targets.push(...findAlltargetTiles(mapView.gameState.players[playerName]));
        }
    }

    determineStrategy(player);
    buildEconomy(player);

    if (Object.keys(player.improvements).length < 2 && player.gold >= 100) {
        placeACity(mapView, player);
    }
    buildArmy(mapView, player);

    if (atWar) {
        attack(mapView, player, targets);
    }

    mapView.endTurn();
}
export function determineStrategy(player: Player) {
    //
}

export function buildEconomy(player: Player) {
    //
}

export function buildArmy(mapView: MapView, player: Player) {
    const cityKeys = Object.keys(player.improvements);
    const randomIndex = Math.floor(Math.random() * cityKeys.length);
    const randomCityKey = cityKeys[randomIndex];
    const city = player.improvements[randomCityKey];
    const tile = city.tile;

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
            unit = CreateRifleman(player);
        } else if (options[randomIndex] === "build_calvary") {
            player.gold -= 200;
            unit = CreateCavalry(player);
        } else if (options[randomIndex] === "build_artillary") {
            player.gold -= 300;
            unit = CreateArtillary(player);
        }
        if (unit) {
            mapView.addUnitToMap(
                unit, 
                mapView.getClosestUnoccupiedTile(tile)
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
        return true;
    }
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const tile = findACityLocation(mapView, player, 6);
        if (!tile) {
            continue;
        }
        player.gold -= 100;
        mapView.addImprovementToMap(CreateCity(player), tile);
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
    const tile = city.tile;

    const tiles = mapView.getTileGrid().neighbors(tile.q, tile.r, radius)
    const randomTileIndex = Math.floor(Math.random() * tiles.length);
    const randomTile = tiles[randomTileIndex];

    if (!mapView.isTileCityEligbile(randomTile)) {
        return null;
    }
    return randomTile;

}

function findAlltargetTiles(player: Player) {
    const targets = [];
    for (const tt of Object.values(player.units)) {
        targets.push(tt.tile);
    }
    for (const tt of Object.values(player.improvements)) {
        targets.push(tt.tile);
    }
    return targets;
}


export function attack(mapView: MapView, player: Player, targets: TileData[]) {
    for (const unit of Object.values(player.units)) {
        let targetTile = findTargetForUnit(unit.tile, targets);
        if (!targetTile) {
            return;
        }
        mapView.moveUnit(unit.tile, targetTile);
        // Attack the nearest enemy unit
        // For now, just attack the first enemy unit we find
    }
}
  
function findTargetForUnit(currentTile: TileData, targets: TileData[]) {
    // spice it up by removing a random target
    // TODO: add more spice (maybe first, second, third closest?)
    if (targets.length > 1) {
        const randomIndex = Math.floor(Math.random() * targets.length);
        targets.splice(randomIndex, 1);
    }

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
        if (distance < shortestDistance) {
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
