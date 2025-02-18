import { DeclarePeaceBetweenPlayers, GetDiplomaticActionsSummary, Player } from "./GameState";
import MapView from "./MapView";

export class Offer {
    player?: Player;
    name: string = "";
    gold: number = 0;
    gold_per_turn: number = 0;
    resources: { [key: string]: number } = {};
    cities: { [key: string]: string } = {};
    diplomatic_actions: { [key: string]: string } = {};
}

// Updated based on negotiations
export let CurrentNegotiation = {
    "player1": new Offer(),
    "player2": new Offer(),

    "player1InPot": new Offer(),
    "player2InPot": new Offer(),
};

export function GetWhatPlayerCanOffer(mapView: MapView, player: Player, targetPlayer: Player): Offer {
    
    let diplomaticSummary = GetDiplomaticActionsSummary(mapView._gameState, player);
    
    let actions: { [key: string]: string } = {
        // "declare_war_trade": "Declare War",
        "declare_peace_trade": "Declare Peace",
        "open_borders_trade": "Open Borders",
    };
    let cities: { [key: string]: string } = {};
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
        offer.resources[resource_name] +=  amount;
    }

    console.log(offer);
    return offer;
}


export function ResetNegotiations(mapView: MapView, player1: Player, player2: Player) {
    // reset the current negotiation
    let player1CanOffer = GetWhatPlayerCanOffer(mapView, player1, player2);
    let player2CanOffer = GetWhatPlayerCanOffer(mapView, player2, player1);
    CurrentNegotiation = {
        "player1": player1CanOffer,
        "player2": player2CanOffer,
    
        "player1InPot": new Offer(),
        "player2InPot": new Offer(),
    };
}


export function ColumnHtml(offer: Offer, column: string): string {
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

export function TradeMenuHtml(): string {
    return `
<div id="trade-screen" class="trade-screen">
    <div class="columns-container">
        <!-- Player 1 Column -->
        <div class="player-column left">
            <p>${CurrentNegotiation.player1.name}</p>
            ${ColumnHtml(CurrentNegotiation.player1, "player1")}
        </div>

        <!-- Middle Column -->
        <div class="middle-column">
            <div class="offers-section">
                <div class="trade-screen-header">${CurrentNegotiation.player1.name}</div>
                <ul id="player1-offers">${ColumnHtml(CurrentNegotiation.player1InPot, "player1-offers")}</ul>
            </div>
        </div>

        <!-- Middle Column -->
        <div class="middle-column">
            <div class="offers-section">
                <div class="trade-screen-header">${CurrentNegotiation.player2.name}</div>
                <ul id="player2-offers">${ColumnHtml(CurrentNegotiation.player2InPot, "player2-offers")}</ul>
            </div>
        </div>
        <div class="player-column right">
            <p>${CurrentNegotiation.player2.name}</p>
            ${ColumnHtml(CurrentNegotiation.player2, "player2")}
        </div>
    </div>

    <div class="options">
        <button class="menu-trade" data-action="accept">Accept Deal</button>
    </div>

</div>`;
}

export function TradeMenuButtonClicked(mapView: MapView, targetDom: HTMLElement) {
    const action = targetDom.getAttribute('data-action');
    const column = targetDom.getAttribute('data-column');
    let sourceOffer: Offer | null = null;
    let destOffer: Offer | null = null;

    if (action === 'accept') {
        // TODO check with AI!

        console.log("Accepting deal");
        console.log(CurrentNegotiation);

        let p1 = CurrentNegotiation.player1.player;
        let p2 = CurrentNegotiation.player2.player;
        let gs = mapView._gameState;
        
        // gold
        p1.gold -= CurrentNegotiation.player1InPot.gold;
        p1.gold += CurrentNegotiation.player2InPot.gold;
        p2.gold += CurrentNegotiation.player1InPot.gold;
        p2.gold -= CurrentNegotiation.player2InPot.gold;

        // gold per turn
        let amount = CurrentNegotiation.player1InPot.gold_per_turn;
        if (amount > 0) {
            gs.players[p2.name].diplomatic_actions[p1.name][`gpt`] = {
                startTurn: gs.turn,
                amount: amount,
                endTurn: gs.turn + 10,
            };
            gs.players[p1.name].diplomatic_actions[p2.name][`gpt`] = {
                startTurn: gs.turn,
                amount: -1*amount,
                endTurn: gs.turn + 10,
            };
        }
        amount = CurrentNegotiation.player2InPot.gold_per_turn;
        if (amount > 0) {
            gs.players[p1.name].diplomatic_actions[p2.name][`gpt`] = {
                startTurn: gs.turn,
                amount: amount,
                endTurn: gs.turn + 10,
            };
            gs.players[p2.name].diplomatic_actions[p1.name][`gpt`] = {
                startTurn: gs.turn,
                amount: -1*amount,
                endTurn: gs.turn + 10,
            };
        }



        // cities
        for (const [cityId, cityName] of Object.entries(CurrentNegotiation.player1InPot.cities)) {
            mapView.updateCityOwner(p1.improvements[cityId], p2);

        }
        for (const [cityId, _] of Object.entries(CurrentNegotiation.player2InPot.cities)) {
            mapView.updateCityOwner(p2.improvements[cityId], p1);
        }


        // resources
        for (const [resource, amount] of Object.entries(CurrentNegotiation.player1InPot.resources)) {

            gs.players[p2.name].diplomatic_actions[p1.name][`resource_${Math.random()}`] = {
                startTurn: gs.turn,
                resource: resource,
                amount: amount,
                endTurn: gs.turn + 10,
            };
            gs.players[p1.name].diplomatic_actions[p2.name][`resource_${Math.random()}`] = {
                startTurn: gs.turn,
                resource: resource,
                amount: -1*amount,
                endTurn: gs.turn + 10,
            };
        }

        for (const [resource, amount] of Object.entries(CurrentNegotiation.player2InPot.resources)) {
            gs.players[p1.name].diplomatic_actions[p2.name][`resource_${Math.random()}`] = {
                startTurn: gs.turn,
                resource: resource,
                amount: amount,
                endTurn: gs.turn + 10,
            };
            gs.players[p2.name].diplomatic_actions[p1.name][`resource_${Math.random()}`] = {
                startTurn: gs.turn,
                resource: resource,
                amount: -1*amount,
                endTurn: gs.turn + 10,
            };
        }


        // diplomatic actions
        if (CurrentNegotiation.player1InPot.diplomatic_actions['declare_peace_trade']) {
            DeclarePeaceBetweenPlayers(gs, p1, p2);
        }

        if (CurrentNegotiation.player1InPot.diplomatic_actions['open_borders_trade']) {
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
        sourceOffer = CurrentNegotiation[column];
        const inPotKey = `${column}InPot` as keyof typeof CurrentNegotiation;
        destOffer = CurrentNegotiation[inPotKey];
    } else if (column === 'player1-offers' || column === 'player2-offers') {
        const playerKey = column.replace('-offers', '') as keyof typeof CurrentNegotiation;
        destOffer = CurrentNegotiation[playerKey];
        const inPotKey = `${playerKey}InPot` as keyof typeof CurrentNegotiation;
        sourceOffer = CurrentNegotiation[inPotKey];
    } else {
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
                        const otherInPot = CurrentNegotiation[otherInPotKey as keyof typeof CurrentNegotiation];
        
                        // Add/remove from both InPots
                        if ([CurrentNegotiation.player1InPot, CurrentNegotiation.player2InPot].includes(destOffer)) {
                            // Added to InPot - mirror to other side
                            otherInPot.diplomatic_actions[actionId] = actionName;
                        } else {
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