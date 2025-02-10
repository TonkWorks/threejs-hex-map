define(["require", "exports", "./PolyhedronBufferGeometry.js"], function (require, exports, PolyhedronBufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TetrahedronBufferGeometry extends PolyhedronBufferGeometry_js_1.PolyhedronBufferGeometry {
        constructor(radius, detail) {
            const vertices = [
                1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1
            ];
            const indices = [
                2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1
            ];
            super(vertices, indices, radius, detail);
            this.type = 'TetrahedronBufferGeometry';
            this.parameters = {
                radius: radius,
                detail: detail
            };
        }
    }
    exports.TetrahedronBufferGeometry = TetrahedronBufferGeometry;
});
//# sourceMappingURL=TetrahedronBufferGeometry.js.map