import { MeshBasicMaterial, Mesh, Vector3 } from "three";
export declare const hoverSelectorMaterial: MeshBasicMaterial;
export declare const DefaultTileHoverSelector: Mesh;
export declare class AttackArrow {
    private curve;
    private rectangleWidth;
    private rectangleHeight;
    private steps;
    private color;
    private arrowHeight;
    constructor(start: Vector3, arrowHeight: number, end: Vector3);
    createCurveMesh(): Mesh;
}
export default DefaultTileHoverSelector;
