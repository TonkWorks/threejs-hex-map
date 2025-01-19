import { createHexagon } from './hexagon';
import { RingGeometry, RingBufferGeometry, MeshBasicMaterial, Mesh, QuadraticBezierCurve3, TubeGeometry, ConeGeometry, CurvePath, Vector3, CatmullRomCurve3, Shape, ExtrudeGeometry } from "three"

export const hoverSelectorMaterial = new MeshBasicMaterial({
    opacity: 0.0,
    transparent: true,
    color: 0xffff00
})
export const DefaultTileHoverSelector = new Mesh(
    new RingBufferGeometry(0.85, 1, 6, 2), 
    hoverSelectorMaterial
)
DefaultTileHoverSelector.rotateZ(Math.PI/2)


export class AttackArrow {
    private curve: THREE.QuadraticBezierCurve3;
    private rectangleWidth: number;
    private rectangleHeight: number;
    private steps: number;
    private color: number;
    private arrowHeight: number;

    constructor(
        start: Vector3,
        arrowHeight: number,
        end: Vector3,
    ) {
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;

        this.curve = new QuadraticBezierCurve3(start, new Vector3(midX, midY, arrowHeight), end);
        this.rectangleWidth = 0.3,
        this.rectangleHeight = 0.05,
        this.steps = 50,
        this.color = 0xff0000
    }

    public createCurveMesh(): Mesh {
        // Generate curve points
        const points = this.curve.getPoints(this.steps);

        // Create a rectangular shape
        const shape = new Shape();
        shape.moveTo(-this.rectangleWidth / 2, -this.rectangleHeight / 2);
        shape.lineTo(this.rectangleWidth / 2, -this.rectangleHeight / 2);
        shape.lineTo(this.rectangleWidth / 2, this.rectangleHeight / 2);
        shape.lineTo(-this.rectangleWidth / 2, this.rectangleHeight / 2);
        shape.lineTo(-this.rectangleWidth / 2, -this.rectangleHeight / 2);


        const curveGeometry = new ExtrudeGeometry(shape, {
            steps: this.steps,
            bevelEnabled: false,
            extrudePath: new CatmullRomCurve3(points.slice(0, -5)), // Stop before the final point
        });

        // Create material and mesh
        const curveMaterial = new MeshBasicMaterial({ color: this.color });
        return new Mesh(curveGeometry, curveMaterial);
    }
}

export default DefaultTileHoverSelector