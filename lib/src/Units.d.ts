import { Mesh } from 'three';
import { Player } from './GameState';
import { TileData } from './interfaces';
export interface Unit {
    id: string;
    type: string;
    health: number;
    health_max: number;
    name: string;
    image: string;
    movement_max: number;
    attack_range: number;
    cost: number;
    attack: number;
    defence: number;
    movement: number;
    movementOrders?: {
        q: number;
        r: number;
    };
    kills: number;
    owner: string;
    model?: Mesh;
    tile?: TileData;
}
export declare function CreateSettler(player: Player): Unit;
export declare function AddUnitLabel(unitModel: Mesh, unitID: string, icon: string, color: string): void;
export declare function CreateRifleman(player: Player): Unit;
export declare function CreateCavalry(player: Player): Unit;
export declare function CreateArtillary(player: Player): Unit;
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
    tile?: TileData;
}
export declare function CreateCity(player: Player): Improvement;
export declare function updateLabel(domID: string, content: string): void;
export declare function updatePopulationAndProductionRates(player: Player, improvement: Improvement): void;
export default Unit;
