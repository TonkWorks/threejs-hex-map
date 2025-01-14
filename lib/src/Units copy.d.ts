import { Mesh } from 'three';
import { Player } from './GameState';
export interface Unit {
    id: string;
    type: string;
    health: number;
    health_max: number;
    image: string;
    movement_max: number;
    attack: number;
    defence: number;
    movement: number;
    movementOrders?: {
        q: number;
        r: number;
    };
    owner: string;
    model?: Mesh;
}
export declare function CreateUnit(player: Player): Unit;
export interface Improvement {
    id: string;
    type: string;
    health: number;
    health_max: number;
    population: number;
    name: string;
    defence: number;
    population_rate: number;
    production_rate: number;
    image: string;
    owner: string;
    model?: Mesh;
}
export declare function CreateCity(player: Player): Improvement;
export declare function updateLabel(domID: string, content: string): void;
export declare function updatePopulationAndProductionRates(improvement: Improvement): void;
export default Unit;
