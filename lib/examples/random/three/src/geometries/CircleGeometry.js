define(["require", "exports", "../core/Geometry.js", "./CircleBufferGeometry.js"], function (require, exports, Geometry_js_1, CircleBufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CircleGeometry extends Geometry_js_1.Geometry {
        constructor(radius, segments, thetaStart, thetaLength) {
            super();
            this.type = 'CircleGeometry';
            this.parameters = {
                radius: radius,
                segments: segments,
                thetaStart: thetaStart,
                thetaLength: thetaLength
            };
            this.fromBufferGeometry(new CircleBufferGeometry_js_1.CircleBufferGeometry(radius, segments, thetaStart, thetaLength));
            this.mergeVertices();
        }
    }
    exports.CircleGeometry = CircleGeometry;
});
//# sourceMappingURL=CircleGeometry.js.map