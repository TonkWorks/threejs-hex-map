import { Player } from './GameState';
import MapView from './MapView';
export declare function takeTurn(mapView: MapView, player: Player): Promise<void>;
export declare function determineStrategy(): void;
export declare function buildEconomy(): void;
export default determineStrategy;
