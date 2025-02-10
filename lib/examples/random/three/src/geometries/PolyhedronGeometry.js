define(["require", "exports", "../core/Geometry.js", "./PolyhedronBufferGeometry.js"], function (require, exports, Geometry_js_1, PolyhedronBufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PolyhedronGeometry extends Geometry_js_1.Geometry {
        constructor(vertices, indices, radius, detail) {
            super();
            this.type = 'PolyhedronGeometry';
            this.parameters = {
                vertices: vertices,
                indices: indices,
                radius: radius,
                detail: detail
            };
            this.fromBufferGeometry(new PolyhedronBufferGeometry_js_1.PolyhedronBufferGeometry(vertices, indices, radius, detail));
            this.mergeVertices();
        }
    }
    exports.PolyhedronGeometry = PolyhedronGeometry;
});
//# sourceMappingURL=PolyhedronGeometry.js.map