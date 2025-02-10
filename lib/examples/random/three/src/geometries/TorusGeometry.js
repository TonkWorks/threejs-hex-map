define(["require", "exports", "../core/Geometry.js", "./TorusBufferGeometry.js"], function (require, exports, Geometry_js_1, TorusBufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TorusGeometry extends Geometry_js_1.Geometry {
        constructor(radius, tube, radialSegments, tubularSegments, arc) {
            super();
            this.type = 'TorusGeometry';
            this.parameters = {
                radius: radius,
                tube: tube,
                radialSegments: radialSegments,
                tubularSegments: tubularSegments,
                arc: arc
            };
            this.fromBufferGeometry(new TorusBufferGeometry_js_1.TorusBufferGeometry(radius, tube, radialSegments, tubularSegments, arc));
            this.mergeVertices();
        }
    }
    exports.TorusGeometry = TorusGeometry;
});
//# sourceMappingURL=TorusGeometry.js.map