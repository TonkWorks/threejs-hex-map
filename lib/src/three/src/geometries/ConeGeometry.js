define(["require", "exports", "./CylinderGeometry.js"], function (require, exports, CylinderGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ConeGeometry extends CylinderGeometry_js_1.CylinderGeometry {
        constructor(radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
            super(0, radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength);
            this.type = 'ConeGeometry';
            this.parameters = {
                radius: radius,
                height: height,
                radialSegments: radialSegments,
                heightSegments: heightSegments,
                openEnded: openEnded,
                thetaStart: thetaStart,
                thetaLength: thetaLength
            };
        }
    }
    exports.ConeGeometry = ConeGeometry;
});
//# sourceMappingURL=ConeGeometry.js.map