define(["require", "exports", "../core/BufferGeometry.js", "../core/BufferAttribute.js", "../math/Vector3.js"], function (require, exports, BufferGeometry_js_1, BufferAttribute_js_1, Vector3_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TorusBufferGeometry extends BufferGeometry_js_1.BufferGeometry {
        constructor(radius, tube, radialSegments, tubularSegments, arc) {
            super();
            this.type = 'TorusBufferGeometry';
            this.parameters = {
                radius: radius,
                tube: tube,
                radialSegments: radialSegments,
                tubularSegments: tubularSegments,
                arc: arc
            };
            radius = radius || 1;
            tube = tube || 0.4;
            radialSegments = Math.floor(radialSegments) || 8;
            tubularSegments = Math.floor(tubularSegments) || 6;
            arc = arc || Math.PI * 2;
            // buffers
            const indices = [];
            const vertices = [];
            const normals = [];
            const uvs = [];
            // helper variables
            const center = new Vector3_js_1.Vector3();
            const vertex = new Vector3_js_1.Vector3();
            const normal = new Vector3_js_1.Vector3();
            // generate vertices, normals and uvs
            for (let j = 0; j <= radialSegments; j++) {
                for (let i = 0; i <= tubularSegments; i++) {
                    const u = i / tubularSegments * arc;
                    const v = j / radialSegments * Math.PI * 2;
                    // vertex
                    vertex.x = (radius + tube * Math.cos(v)) * Math.cos(u);
                    vertex.y = (radius + tube * Math.cos(v)) * Math.sin(u);
                    vertex.z = tube * Math.sin(v);
                    vertices.push(vertex.x, vertex.y, vertex.z);
                    // normal
                    center.x = radius * Math.cos(u);
                    center.y = radius * Math.sin(u);
                    normal.subVectors(vertex, center).normalize();
                    normals.push(normal.x, normal.y, normal.z);
                    // uv
                    uvs.push(i / tubularSegments);
                    uvs.push(j / radialSegments);
                }
            }
            // generate indices
            for (let j = 1; j <= radialSegments; j++) {
                for (let i = 1; i <= tubularSegments; i++) {
                    // indices
                    const a = (tubularSegments + 1) * j + i - 1;
                    const b = (tubularSegments + 1) * (j - 1) + i - 1;
                    const c = (tubularSegments + 1) * (j - 1) + i;
                    const d = (tubularSegments + 1) * j + i;
                    // faces
                    indices.push(a, b, d);
                    indices.push(b, c, d);
                }
            }
            // build geometry
            this.setIndex(indices);
            this.setAttribute('position', new BufferAttribute_js_1.Float32BufferAttribute(vertices, 3));
            this.setAttribute('normal', new BufferAttribute_js_1.Float32BufferAttribute(normals, 3));
            this.setAttribute('uv', new BufferAttribute_js_1.Float32BufferAttribute(uvs, 2));
        }
    }
    exports.TorusBufferGeometry = TorusBufferGeometry;
});
//# sourceMappingURL=TorusBufferGeometry.js.map