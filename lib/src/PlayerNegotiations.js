define(["require", "exports", "./GameState"], function (require, exports, GameState_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CurrentNegotiation = exports.Offer = void 0;
    exports.GetWhatPlayerCanOffer = GetWhatPlayerCanOffer;
    exports.ResetNegotiations = ResetNegotiations;
    exports.ColumnHtml = ColumnHtml;
    exports.TradeMenuHtml = TradeMenuHtml;
    exports.TradeMenuButtonClicked = TradeMenuButtonClicked;
    class Offer {
        constructor() {
            this.name = "";
            this.gold = 0;
            this.gold_per_turn = 0;
            this.resources = {};
            this.cities = {};
            this.diplomatic_actions = {};
        }
    }
    exports.Offer = Offer;
    // Updated based on negotiations
    exports.CurrentNegotiation = {
        "player1": new Offer(),
        "player2": new Offer(),
        "player1InPot": new Offer(),
        "player2InPot": new Offer(),
    };
    function GetWhatPlayerCanOffer(mapView, player, targetPlayer) {
        let diplomaticSummary = (0, GameState_1.GetDiplomaticActionsSummary)(mapView._gameState, player);
        let actions = {
            // "declare_war_trade": "Declare War",
            "declare_peace_trade": "Declare Peace",
            "open_borders_trade": "Open Borders",
        };
        let cities = {};
        for (const [id, city] of Object.entries(player.improvements)) {
            cities[id] = `${city.name} (${Math.round(city.population)})`;
        }
        let offer = new Offer();
        offer.name = player.name;
        offer.player = player;
        offer.gold = player.gold;
        offer.gold_per_turn = 0;
        offer.resources = mapView.getResourcesForPlayer(player);
        offer.cities = cities;
        offer.diplomatic_actions = actions;
        for (const [resource_name, amount] of Object.entries(diplomaticSummary.resources)) {
            if (!(resource_name in offer.resources)) {
                offer.resources[resource_name] = 0;
            }
            offer.resources[resource_name] += amount;
        }
        console.log(offer);
        return offer;
    }
    function ResetNegotiations(mapView, player1, player2) {
        // reset the current negotiation
        let player1CanOffer = GetWhatPlayerCanOffer(mapView, player1, player2);
        let player2CanOffer = GetWhatPlayerCanOffer(mapView, player2, player1);
        exports.CurrentNegotiation = {
            "player1": player1CanOffer,
            "player2": player2CanOffer,
            "player1InPot": new Offer(),
            "player2InPot": new Offer(),
        };
    }
    function ColumnHtml(offer, column) {
        return `
    <div class="options">
            <div class="section">
                <div class="trade-screen-header">Gold</div>
                <div class="gold">
                    ${offer.gold} 
                    <button class="menu-trade rel" data-action="gold" data-column="${column}" data-amount="1">1</button>
                    <button class="menu-trade rel" data-action="gold" data-column="${column}" data-amount="10">10</button>
                    <button class="menu-trade rel" data-action="gold" data-column="${column}"" data-amount="100">100</button>
                </div>
            </div>

            <div class="section">
                <div class="trade-screen-header">Gold/Turn</div>
                <div class="gold_per_turn">
                    ${offer.gold_per_turn} 
                    <button class="menu-trade rel" data-action="gpt" data-column="${column}" data-amount="1">+1</button>
                    <button class="menu-trade rel" data-action="gpt" data-column="${column}"" data-amount="5">+5</button>
                </div>
            </div>

            <div class="section">
                <div class="trade-screen-header">Resources</div>
                <ul class="resources">
                    ${Object.entries(offer.resources).map(([name, count]) => `
                        <button class="menu-trade" data-action="resource" data-column="${column}" data-id="${name}">
                            ${name} (${count})
                        </button>
                    `).join('')}
                </ul>
            </div>

            <div class="section">
                <div class="trade-screen-header">Diplomatic Actions</div>
                <ul class="actions">
                ${Object.entries(offer.diplomatic_actions).map(([id, name]) => `
                    <button class="menu-trade" data-action="diplomatic" data-column="${column}" data-id="${id}">
                        ${name}
                    </button>
                `).join('')}
                </ul>
            </div>

            <div class="section">
                <div class="trade-screen-header">Cities</div>
                <ul class="cities">
                    ${Object.entries(offer.cities).map(([id, name]) => `
                        <button class="menu-trade" data-action="city" data-column="${column}" data-target="${id}">
                            ${name}
                        </button>
                    `).join('')}
                </ul>
            </div>
    </div>`;
    }
    function TradeMenuHtml() {
        return `
<div id="trade-screen" class="trade-screen">
    <div class="columns-container">
        <!-- Player 1 Column -->
        <div class="player-column left">
            <p>${exports.CurrentNegotiation.player1.name}</p>
            ${ColumnHtml(exports.CurrentNegotiation.player1, "player1")}
        </div>

        <!-- Middle Column -->
        <div class="middle-column">
            <div class="offers-section">
                <div class="trade-screen-header">${exports.CurrentNegotiation.player1.name}</div>
                <ul id="player1-offers">${ColumnHtml(exports.CurrentNegotiation.player1InPot, "player1-offers")}</ul>
            </div>
        </div>

        <!-- Middle Column -->
        <div class="middle-column">
            <div class="offers-section">
                <div class="trade-screen-header">${exports.CurrentNegotiation.player2.name}</div>
                <ul id="player2-offers">${ColumnHtml(exports.CurrentNegotiation.player2InPot, "player2-offers")}</ul>
            </div>
        </div>
        <div class="player-column right">
            <p>${exports.CurrentNegotiation.player2.name}</p>
            ${ColumnHtml(exports.CurrentNegotiation.player2, "player2")}
        </div>
    </div>

    <div class="options">
        <button class="menu-trade" data-action="accept">Accept Deal</button>
    </div>

</div>`;
    }
    function TradeMenuButtonClicked(mapView, targetDom) {
        const action = targetDom.getAttribute('data-action');
        const column = targetDom.getAttribute('data-column');
        let sourceOffer = null;
        let destOffer = null;
        if (action === 'accept') {
            // TODO check with AI!
            console.log("Accepting deal");
            console.log(exports.CurrentNegotiation);
            let p1 = exports.CurrentNegotiation.player1.player;
            let p2 = exports.CurrentNegotiation.player2.player;
            let gs = mapView._gameState;
            // gold
            p1.gold -= exports.CurrentNegotiation.player1InPot.gold;
            p1.gold += exports.CurrentNegotiation.player2InPot.gold;
            p2.gold += exports.CurrentNegotiation.player1InPot.gold;
            p2.gold -= exports.CurrentNegotiation.player2InPot.gold;
            // gold per turn
            let amount = exports.CurrentNegotiation.player1InPot.gold_per_turn;
            if (amount > 0) {
                gs.players[p2.name].diplomatic_actions[p1.name][`gpt`] = {
                    startTurn: gs.turn,
                    amount: amount,
                    endTurn: gs.turn + 10,
                };
                gs.players[p1.name].diplomatic_actions[p2.name][`gpt`] = {
                    startTurn: gs.turn,
                    amount: -1 * amount,
                    endTurn: gs.turn + 10,
                };
            }
            amount = exports.CurrentNegotiation.player2InPot.gold_per_turn;
            if (amount > 0) {
                gs.players[p1.name].diplomatic_actions[p2.name][`gpt`] = {
                    startTurn: gs.turn,
                    amount: amount,
                    endTurn: gs.turn + 10,
                };
                gs.players[p2.name].diplomatic_actions[p1.name][`gpt`] = {
                    startTurn: gs.turn,
                    amount: -1 * amount,
                    endTurn: gs.turn + 10,
                };
            }
            // cities
            for (const [cityId, cityName] of Object.entries(exports.CurrentNegotiation.player1InPot.cities)) {
                mapView.updateCityOwner(p1.improvements[cityId], p2);
            }
            for (const [cityId, _] of Object.entries(exports.CurrentNegotiation.player2InPot.cities)) {
                mapView.updateCityOwner(p2.improvements[cityId], p1);
            }
            // resources
            for (const [resource, amount] of Object.entries(exports.CurrentNegotiation.player1InPot.resources)) {
                gs.players[p2.name].diplomatic_actions[p1.name][`resource_${Math.random()}`] = {
                    startTurn: gs.turn,
                    resource: resource,
                    amount: amount,
                    endTurn: gs.turn + 10,
                };
                gs.players[p1.name].diplomatic_actions[p2.name][`resource_${Math.random()}`] = {
                    startTurn: gs.turn,
                    resource: resource,
                    amount: -1 * amount,
                    endTurn: gs.turn + 10,
                };
            }
            for (const [resource, amount] of Object.entries(exports.CurrentNegotiation.player2InPot.resources)) {
                gs.players[p1.name].diplomatic_actions[p2.name][`resource_${Math.random()}`] = {
                    startTurn: gs.turn,
                    resource: resource,
                    amount: amount,
                    endTurn: gs.turn + 10,
                };
                gs.players[p2.name].diplomatic_actions[p1.name][`resource_${Math.random()}`] = {
                    startTurn: gs.turn,
                    resource: resource,
                    amount: -1 * amount,
                    endTurn: gs.turn + 10,
                };
            }
            // diplomatic actions
            if (exports.CurrentNegotiation.player1InPot.diplomatic_actions['declare_peace_trade']) {
                (0, GameState_1.DeclarePeaceBetweenPlayers)(gs, p1, p2);
            }
            if (exports.CurrentNegotiation.player1InPot.diplomatic_actions['open_borders_trade']) {
                gs.players[p1.name].diplomatic_actions[p2.name]["open_borders"] = {
                    startTurn: gs.turn,
                    endTurn: gs.turn + 30,
                };
                gs.players[p2.name].diplomatic_actions[p1.name]["open_borders"] = {
                    startTurn: gs.turn,
                    endTurn: gs.turn + 30,
                };
            }
            // Accept the deal
            mapView.CloseMenu();
            mapView.updateGlobalFog();
            mapView.updateResourcePanel();
            mapView.updateGameStatePanel();
            mapView.checkVictoryConditions();
            return;
        } // end accept
        // move to middle (in pot)
        // Determine source and destination based on the column
        if (column === 'player1' || column === 'player2') {
            sourceOffer = exports.CurrentNegotiation[column];
            const inPotKey = `${column}InPot`;
            destOffer = exports.CurrentNegotiation[inPotKey];
        }
        else if (column === 'player1-offers' || column === 'player2-offers') {
            const playerKey = column.replace('-offers', '');
            destOffer = exports.CurrentNegotiation[playerKey];
            const inPotKey = `${playerKey}InPot`;
            sourceOffer = exports.CurrentNegotiation[inPotKey];
        }
        else {
            return;
        }
        if (!sourceOffer || !destOffer) {
            return;
        }
        switch (action) {
            case 'gold': {
                const amount = parseInt(targetDom.getAttribute('data-amount') || "0");
                if (amount > 0 && sourceOffer.gold >= amount) {
                    sourceOffer.gold -= amount;
                    destOffer.gold += amount;
                }
                break;
            }
            case 'gpt': {
                const amount = parseInt(targetDom.getAttribute('data-amount') || "0");
                if (amount > 0) {
                    sourceOffer.gold_per_turn -= amount;
                    destOffer.gold_per_turn += amount;
                }
                break;
            }
            case 'resource': {
                const resourceId = targetDom.getAttribute('data-id');
                if (resourceId) {
                    const available = sourceOffer.resources[resourceId] || 0;
                    if (available > 0) {
                        sourceOffer.resources[resourceId] = available - 1;
                        destOffer.resources[resourceId] = (destOffer.resources[resourceId] || 0) + 1;
                    }
                }
                break;
            }
            case 'diplomatic': {
                const actionId = targetDom.getAttribute('data-id');
                if (actionId) {
                    const actionName = sourceOffer.diplomatic_actions[actionId];
                    if (actionName) {
                        // Remove from source and add to destination
                        delete sourceOffer.diplomatic_actions[actionId];
                        destOffer.diplomatic_actions[actionId] = actionName;
                        // Handle mutual war/peace actions
                        const isMutualAction = actionId === 'open_borders_trade' || actionId === 'declare_peace_trade';
                        if (isMutualAction) {
                            // Determine the other InPot
                            const otherInPotKey = column.startsWith('player1') ? 'player2InPot' : 'player1InPot';
                            const otherInPot = exports.CurrentNegotiation[otherInPotKey];
                            // Add/remove from both InPots
                            if ([exports.CurrentNegotiation.player1InPot, exports.CurrentNegotiation.player2InPot].includes(destOffer)) {
                                // Added to InPot - mirror to other side
                                otherInPot.diplomatic_actions[actionId] = actionName;
                            }
                            else {
                                // Removed from InPot - remove from both
                                delete otherInPot.diplomatic_actions[actionId];
                                delete destOffer.diplomatic_actions[actionId];
                            }
                        }
                    }
                }
                break;
            }
            case 'city': {
                const cityId = targetDom.getAttribute('data-target');
                if (cityId) {
                    const cityName = sourceOffer.cities[cityId];
                    if (cityName) {
                        delete sourceOffer.cities[cityId];
                        destOffer.cities[cityId] = cityName;
                    }
                }
                break;
            }
            default:
                break;
        }
        mapView.showMenu(TradeMenuHtml());
    }
});
//# sourceMappingURL=PlayerNegotiations.js.map