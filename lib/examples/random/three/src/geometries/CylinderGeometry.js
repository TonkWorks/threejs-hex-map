define(["require", "exports", "../core/Geometry.js", "./CylinderBufferGeometry.js"], function (require, exports, Geometry_js_1, CylinderBufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CylinderGeometry extends Geometry_js_1.Geometry {
        constructor(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
            super();
            this.type = 'CylinderGeometry';
            this.parameters = {
                radiusTop: radiusTop,
                radiusBottom: radiusBottom,
                height: height,
                radialSegments: radialSegments,
                heightSegments: heightSegments,
                openEnded: openEnded,
                thetaStart: thetaStart,
                thetaLength: thetaLength
            };
            this.fromBufferGeometry(new CylinderBufferGeometry_js_1.CylinderBufferGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength));
            this.mergeVertices();
        }
    }
    exports.CylinderGeometry = CylinderGeometry;
});
//# sourceMappingURL=CylinderGeometry.js.map