import { Mesh } from "three";
export interface Unit {
    id: string;
    type: string;
    health: number;
    movement: number;
    movementOrders?: {
        q: number;
        r: number;
    };
    owner: string;
    model?: Mesh;
}
export default Unit;
