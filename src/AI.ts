import { Player } from './GameState';
import MapView from './MapView';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function takeTurn(mapView: MapView, player: Player) {

    // Generate a random delay between 0.1 and 1.5 seconds
    const randomDelay = Math.random() * (1500 - 100) + 100;
    await sleep(randomDelay);

    determineStrategy();
    buildEconomy();
    mapView.endTurn();
}
export function determineStrategy() {
    //
}

export function buildEconomy() {
    //
}

export default determineStrategy;
