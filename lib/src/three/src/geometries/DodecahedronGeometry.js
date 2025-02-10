define(["require", "exports", "../core/Geometry.js", "./DodecahedronBufferGeometry.js"], function (require, exports, Geometry_js_1, DodecahedronBufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DodecahedronGeometry extends Geometry_js_1.Geometry {
        constructor(radius, detail) {
            super();
            this.type = 'DodecahedronGeometry';
            this.parameters = {
                radius: radius,
                detail: detail
            };
            this.fromBufferGeometry(new DodecahedronBufferGeometry_js_1.DodecahedronBufferGeometry(radius, detail));
            this.mergeVertices();
        }
    }
    exports.DodecahedronGeometry = DodecahedronGeometry;
});
//# sourceMappingURL=DodecahedronGeometry.js.map