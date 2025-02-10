define(["require", "exports", "../core/Geometry.js", "./RingBufferGeometry.js"], function (require, exports, Geometry_js_1, RingBufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class RingGeometry extends Geometry_js_1.Geometry {
        constructor(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength) {
            super();
            this.type = 'RingGeometry';
            this.parameters = {
                innerRadius: innerRadius,
                outerRadius: outerRadius,
                thetaSegments: thetaSegments,
                phiSegments: phiSegments,
                thetaStart: thetaStart,
                thetaLength: thetaLength
            };
            this.fromBufferGeometry(new RingBufferGeometry_js_1.RingBufferGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength));
            this.mergeVertices();
        }
    }
    exports.RingGeometry = RingGeometry;
});
//# sourceMappingURL=RingGeometry.js.map