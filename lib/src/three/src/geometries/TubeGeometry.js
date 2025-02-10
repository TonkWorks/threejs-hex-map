define(["require", "exports", "../core/Geometry.js", "./TubeBufferGeometry.js"], function (require, exports, Geometry_js_1, TubeBufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TubeGeometry extends Geometry_js_1.Geometry {
        constructor(path, tubularSegments, radius, radialSegments, closed, taper) {
            super();
            this.type = 'TubeGeometry';
            this.parameters = {
                path: path,
                tubularSegments: tubularSegments,
                radius: radius,
                radialSegments: radialSegments,
                closed: closed
            };
            if (taper !== undefined)
                console.warn('THREE.TubeGeometry: taper has been removed.');
            const bufferGeometry = new TubeBufferGeometry_js_1.TubeBufferGeometry(path, tubularSegments, radius, radialSegments, closed);
            // expose internals
            this.tangents = bufferGeometry.tangents;
            this.normals = bufferGeometry.normals;
            this.binormals = bufferGeometry.binormals;
            // create geometry
            this.fromBufferGeometry(bufferGeometry);
            this.mergeVertices();
        }
    }
    exports.TubeGeometry = TubeGeometry;
});
//# sourceMappingURL=TubeGeometry.js.map