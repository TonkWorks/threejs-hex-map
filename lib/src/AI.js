var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./Units"], function (require, exports, Units_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function takeTurn(mapView, player) {
        return __awaiter(this, void 0, void 0, function* () {
            if (player.isDefeated === true) {
                return;
            }
            // Generate a random delay between 0.1 and 1.5 seconds
            const randomDelay = Math.random() * (300 - 100) + 100;
            yield sleep(randomDelay);
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
        });
    }
    exports.takeTurn = takeTurn;
    function determineStrategy(player) {
        //
    }
    exports.determineStrategy = determineStrategy;
    function buildEconomy(player) {
        //
    }
    exports.buildEconomy = buildEconomy;
    function buildArmy(mapView, player) {
        const cityKeys = Object.keys(player.improvements);
        const randomIndex = Math.floor(Math.random() * cityKeys.length);
        const randomCityKey = cityKeys[randomIndex];
        const city = player.improvements[randomCityKey];
        const tile = city.tile;
        // must do something with money?
        let maxActions = 6;
        while (player.gold > 100 && maxActions > 0) {
            maxActions -= 1;
            const options = ["build_city", "build_rifleman", "build_calvary", "build_artillary"];
            const randomIndex = Math.floor(Math.random() * options.length);
            let unit = null;
            if (options[randomIndex] === "build_city") {
                player.gold -= 100;
                placeACity(mapView, player);
            }
            else if (options[randomIndex] === "build_rifleman") {
                player.gold -= 100;
                unit = Units_1.CreateRifleman(player);
            }
            else if (options[randomIndex] === "build_calvary") {
                player.gold -= 200;
                unit = Units_1.CreateCavalry(player);
            }
            else if (options[randomIndex] === "build_artillary") {
                player.gold -= 300;
                unit = Units_1.CreateArtillary(player);
            }
            if (unit) {
                mapView.addUnitToMap(unit, mapView.getClosestUnoccupiedTile(tile));
            }
        }
    }
    exports.buildArmy = buildArmy;
    function placeACity(mapView, player) {
        // randomly pick a city that is owned by the player
        const maxAttempts = 20;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const tile = findACityLocation(mapView, player, 4);
            if (!tile) {
                continue;
            }
            player.gold -= 100;
            mapView.addImprovementToMap(Units_1.CreateCity(player), tile);
            return true;
        }
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const tile = findACityLocation(mapView, player, 6);
            if (!tile) {
                continue;
            }
            player.gold -= 100;
            mapView.addImprovementToMap(Units_1.CreateCity(player), tile);
            return true;
        }
        return false;
    }
    exports.placeACity = placeACity;
    function findACityLocation(mapView, player, radius) {
        // randomly pick a city that is owned by the player
        const cityKeys = Object.keys(player.improvements);
        const randomIndex = Math.floor(Math.random() * cityKeys.length);
        const randomCityKey = cityKeys[randomIndex];
        const city = player.improvements[randomCityKey];
        const tile = city.tile;
        const tiles = mapView.getTileGrid().neighbors(tile.q, tile.r, radius);
        const randomTileIndex = Math.floor(Math.random() * tiles.length);
        const randomTile = tiles[randomTileIndex];
        if (!mapView.isTileCityEligbile(randomTile)) {
            return null;
        }
        return randomTile;
    }
    exports.findACityLocation = findACityLocation;
    function findAlltargetTiles(player) {
        const targets = [];
        for (const tt of Object.values(player.units)) {
            targets.push(tt.tile);
        }
        for (const tt of Object.values(player.improvements)) {
            targets.push(tt.tile);
        }
        return targets;
    }
    function attack(mapView, player, targets) {
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
    exports.attack = attack;
    function findTargetForUnit(currentTile, targets) {
        // spice it up by removing a random target
        // TODO: add more spice (maybe first, second, third closest?)
        if (targets.length > 1) {
            const randomIndex = Math.floor(Math.random() * targets.length);
            targets.splice(randomIndex, 1);
        }
        // get closest?
        return getClosestTile(currentTile, targets);
    }
    function getClosestTile(currentTile, targets) {
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
    function getDistance(a, b) {
        return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
    }
    exports.default = determineStrategy;
});
//# sourceMappingURL=AI.js.map