define(["require", "exports", "../core/Geometry.js", "./SphereBufferGeometry.js"], function (require, exports, Geometry_js_1, SphereBufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SphereGeometry extends Geometry_js_1.Geometry {
        constructor(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
            super();
            this.type = 'SphereGeometry';
            this.parameters = {
                radius: radius,
                widthSegments: widthSegments,
                heightSegments: heightSegments,
                phiStart: phiStart,
                phiLength: phiLength,
                thetaStart: thetaStart,
                thetaLength: thetaLength
            };
            this.fromBufferGeometry(new SphereBufferGeometry_js_1.SphereBufferGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength));
            this.mergeVertices();
        }
    }
    exports.SphereGeometry = SphereGeometry;
});
//# sourceMappingURL=SphereGeometry.js.map