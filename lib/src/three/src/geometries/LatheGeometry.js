define(["require", "exports", "../core/Geometry.js", "./LatheBufferGeometry.js"], function (require, exports, Geometry_js_1, LatheBufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LatheGeometry extends Geometry_js_1.Geometry {
        constructor(points, segments, phiStart, phiLength) {
            super();
            this.type = 'LatheGeometry';
            this.parameters = {
                points: points,
                segments: segments,
                phiStart: phiStart,
                phiLength: phiLength
            };
            this.fromBufferGeometry(new LatheBufferGeometry_js_1.LatheBufferGeometry(points, segments, phiStart, phiLength));
            this.mergeVertices();
        }
    }
    exports.LatheGeometry = LatheGeometry;
});
//# sourceMappingURL=LatheGeometry.js.map