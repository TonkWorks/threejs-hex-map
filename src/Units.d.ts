import { Mesh } from "three";
interface Unit {
    id: string;
    type: string;
    health: number;
    movement: number;
    owner: string;
    model?: Mesh;
}
export default Unit;
