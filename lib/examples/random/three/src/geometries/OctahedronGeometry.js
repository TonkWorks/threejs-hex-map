define(["require", "exports", "../core/Geometry.js", "./OctahedronBufferGeometry.js"], function (require, exports, Geometry_js_1, OctahedronBufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class OctahedronGeometry extends Geometry_js_1.Geometry {
        constructor(radius, detail) {
            super();
            this.type = 'OctahedronGeometry';
            this.parameters = {
                radius: radius,
                detail: detail
            };
            this.fromBufferGeometry(new OctahedronBufferGeometry_js_1.OctahedronBufferGeometry(radius, detail));
            this.mergeVertices();
        }
    }
    exports.OctahedronGeometry = OctahedronGeometry;
});
//# sourceMappingURL=OctahedronGeometry.js.map