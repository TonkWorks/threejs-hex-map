define(["require", "exports", "three"], function (require, exports, three_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hoverSelectorMaterial = new three_1.MeshBasicMaterial({
        opacity: 0.0,
        transparent: true,
        color: 0xffff00
    });
    exports.DefaultTileHoverSelector = new three_1.Mesh(new three_1.RingBufferGeometry(0.85, 1, 6, 2), exports.hoverSelectorMaterial);
    exports.DefaultTileHoverSelector.rotateZ(Math.PI / 2);
    class AttackArrow {
        constructor(start, arrowHeight, end) {
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;
            this.curve = new three_1.QuadraticBezierCurve3(start, new three_1.Vector3(midX, midY, arrowHeight), end);
            this.rectangleWidth = 0.3,
                this.rectangleHeight = 0.05,
                this.steps = 50,
                this.color = 0xff0000;
        }
        createCurveMesh() {
            // Generate curve points
            const points = this.curve.getPoints(this.steps);
            // Create a rectangular shape
            const shape = new three_1.Shape();
            shape.moveTo(-this.rectangleWidth / 2, -this.rectangleHeight / 2);
            shape.lineTo(this.rectangleWidth / 2, -this.rectangleHeight / 2);
            shape.lineTo(this.rectangleWidth / 2, this.rectangleHeight / 2);
            shape.lineTo(-this.rectangleWidth / 2, this.rectangleHeight / 2);
            shape.lineTo(-this.rectangleWidth / 2, -this.rectangleHeight / 2);
            const curveGeometry = new three_1.ExtrudeGeometry(shape, {
                steps: this.steps,
                bevelEnabled: false,
                extrudePath: new three_1.CatmullRomCurve3(points.slice(0, -5)),
            });
            // Create material and mesh
            const curveMaterial = new three_1.MeshBasicMaterial({ color: this.color });
            return new three_1.Mesh(curveGeometry, curveMaterial);
        }
    }
    exports.AttackArrow = AttackArrow;
    exports.default = exports.DefaultTileHoverSelector;
});
//# sourceMappingURL=DefaultTileHoverSelector.js.map