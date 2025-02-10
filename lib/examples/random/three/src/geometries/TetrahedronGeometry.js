define(["require", "exports", "../core/Geometry.js", "./TetrahedronBufferGeometry.js"], function (require, exports, Geometry_js_1, TetrahedronBufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TetrahedronGeometry extends Geometry_js_1.Geometry {
        constructor(radius, detail) {
            super();
            this.type = 'TetrahedronGeometry';
            this.parameters = {
                radius: radius,
                detail: detail
            };
            this.fromBufferGeometry(new TetrahedronBufferGeometry_js_1.TetrahedronBufferGeometry(radius, detail));
            this.mergeVertices();
        }
    }
    exports.TetrahedronGeometry = TetrahedronGeometry;
});
//# sourceMappingURL=TetrahedronGeometry.js.map