define(["require", "exports", "./CylinderBufferGeometry.js"], function (require, exports, CylinderBufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ConeBufferGeometry extends CylinderBufferGeometry_js_1.CylinderBufferGeometry {
        constructor(radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
            super(0, radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength);
            this.type = 'ConeBufferGeometry';
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
    exports.ConeBufferGeometry = ConeBufferGeometry;
});
//# sourceMappingURL=ConeBufferGeometry.js.map