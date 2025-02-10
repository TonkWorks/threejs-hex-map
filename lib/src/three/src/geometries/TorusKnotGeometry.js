define(["require", "exports", "../core/Geometry.js", "./TorusKnotBufferGeometry.js"], function (require, exports, Geometry_js_1, TorusKnotBufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TorusKnotGeometry extends Geometry_js_1.Geometry {
        constructor(radius, tube, tubularSegments, radialSegments, p, q, heightScale) {
            super();
            this.type = 'TorusKnotGeometry';
            this.parameters = {
                radius: radius,
                tube: tube,
                tubularSegments: tubularSegments,
                radialSegments: radialSegments,
                p: p,
                q: q
            };
            if (heightScale !== undefined)
                console.warn('THREE.TorusKnotGeometry: heightScale has been deprecated. Use .scale( x, y, z ) instead.');
            this.fromBufferGeometry(new TorusKnotBufferGeometry_js_1.TorusKnotBufferGeometry(radius, tube, tubularSegments, radialSegments, p, q));
            this.mergeVertices();
        }
    }
    exports.TorusKnotGeometry = TorusKnotGeometry;
});
//# sourceMappingURL=TorusKnotGeometry.js.map