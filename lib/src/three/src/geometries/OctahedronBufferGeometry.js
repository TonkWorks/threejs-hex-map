define(["require", "exports", "./PolyhedronBufferGeometry.js"], function (require, exports, PolyhedronBufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class OctahedronBufferGeometry extends PolyhedronBufferGeometry_js_1.PolyhedronBufferGeometry {
        constructor(radius, detail) {
            const vertices = [
                1, 0, 0, -1, 0, 0, 0, 1, 0,
                0, -1, 0, 0, 0, 1, 0, 0, -1
            ];
            const indices = [
                0, 2, 4, 0, 4, 3, 0, 3, 5,
                0, 5, 2, 1, 2, 5, 1, 5, 3,
                1, 3, 4, 1, 4, 2
            ];
            super(vertices, indices, radius, detail);
            this.type = 'OctahedronBufferGeometry';
            this.parameters = {
                radius: radius,
                detail: detail
            };
        }
    }
    exports.OctahedronBufferGeometry = OctahedronBufferGeometry;
});
//# sourceMappingURL=OctahedronBufferGeometry.js.map