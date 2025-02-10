define(["require", "exports", "../../../build/three.module.js", "../math/ConvexHull.js"], function (require, exports, three_module_js_1, ConvexHull_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // ConvexGeometry
    var ConvexGeometry = function (points) {
        three_module_js_1.Geometry.call(this);
        this.fromBufferGeometry(new ConvexBufferGeometry(points));
        this.mergeVertices();
    };
    exports.ConvexGeometry = ConvexGeometry;
    ConvexGeometry.prototype = Object.create(three_module_js_1.Geometry.prototype);
    ConvexGeometry.prototype.constructor = ConvexGeometry;
    // ConvexBufferGeometry
    var ConvexBufferGeometry = function (points) {
        three_module_js_1.BufferGeometry.call(this);
        // buffers
        var vertices = [];
        var normals = [];
        if (ConvexHull_js_1.ConvexHull === undefined) {
            console.error('THREE.ConvexBufferGeometry: ConvexBufferGeometry relies on ConvexHull');
        }
        var convexHull = new ConvexHull_js_1.ConvexHull().setFromPoints(points);
        // generate vertices and normals
        var faces = convexHull.faces;
        for (var i = 0; i < faces.length; i++) {
            var face = faces[i];
            var edge = face.edge;
            // we move along a doubly-connected edge list to access all face points (see HalfEdge docs)
            do {
                var point = edge.head().point;
                vertices.push(point.x, point.y, point.z);
                normals.push(face.normal.x, face.normal.y, face.normal.z);
                edge = edge.next;
            } while (edge !== face.edge);
        }
        // build geometry
        this.setAttribute('position', new three_module_js_1.Float32BufferAttribute(vertices, 3));
        this.setAttribute('normal', new three_module_js_1.Float32BufferAttribute(normals, 3));
    };
    exports.ConvexBufferGeometry = ConvexBufferGeometry;
    ConvexBufferGeometry.prototype = Object.create(three_module_js_1.BufferGeometry.prototype);
    ConvexBufferGeometry.prototype.constructor = ConvexBufferGeometry;
});
//# sourceMappingURL=ConvexGeometry.js.map