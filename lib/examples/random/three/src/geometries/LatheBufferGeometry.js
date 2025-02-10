define(["require", "exports", "../core/BufferAttribute.js", "../core/BufferGeometry.js", "../math/Vector3.js", "../math/Vector2.js", "../math/MathUtils.js"], function (require, exports, BufferAttribute_js_1, BufferGeometry_js_1, Vector3_js_1, Vector2_js_1, MathUtils_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LatheBufferGeometry extends BufferGeometry_js_1.BufferGeometry {
        constructor(points, segments, phiStart, phiLength) {
            super();
            this.type = 'LatheBufferGeometry';
            this.parameters = {
                points: points,
                segments: segments,
                phiStart: phiStart,
                phiLength: phiLength
            };
            segments = Math.floor(segments) || 12;
            phiStart = phiStart || 0;
            phiLength = phiLength || Math.PI * 2;
            // clamp phiLength so it's in range of [ 0, 2PI ]
            phiLength = MathUtils_js_1.MathUtils.clamp(phiLength, 0, Math.PI * 2);
            // buffers
            const indices = [];
            const vertices = [];
            const uvs = [];
            // helper variables
            const inverseSegments = 1.0 / segments;
            const vertex = new Vector3_js_1.Vector3();
            const uv = new Vector2_js_1.Vector2();
            // generate vertices and uvs
            for (let i = 0; i <= segments; i++) {
                const phi = phiStart + i * inverseSegments * phiLength;
                const sin = Math.sin(phi);
                const cos = Math.cos(phi);
                for (let j = 0; j <= (points.length - 1); j++) {
                    // vertex
                    vertex.x = points[j].x * sin;
                    vertex.y = points[j].y;
                    vertex.z = points[j].x * cos;
                    vertices.push(vertex.x, vertex.y, vertex.z);
                    // uv
                    uv.x = i / segments;
                    uv.y = j / (points.length - 1);
                    uvs.push(uv.x, uv.y);
                }
            }
            // indices
            for (let i = 0; i < segments; i++) {
                for (let j = 0; j < (points.length - 1); j++) {
                    const base = j + i * points.length;
                    const a = base;
                    const b = base + points.length;
                    const c = base + points.length + 1;
                    const d = base + 1;
                    // faces
                    indices.push(a, b, d);
                    indices.push(b, c, d);
                }
            }
            // build geometry
            this.setIndex(indices);
            this.setAttribute('position', new BufferAttribute_js_1.Float32BufferAttribute(vertices, 3));
            this.setAttribute('uv', new BufferAttribute_js_1.Float32BufferAttribute(uvs, 2));
            // generate normals
            this.computeVertexNormals();
            // if the geometry is closed, we need to average the normals along the seam.
            // because the corresponding vertices are identical (but still have different UVs).
            if (phiLength === Math.PI * 2) {
                const normals = this.attributes.normal.array;
                const n1 = new Vector3_js_1.Vector3();
                const n2 = new Vector3_js_1.Vector3();
                const n = new Vector3_js_1.Vector3();
                // this is the buffer offset for the last line of vertices
                const base = segments * points.length * 3;
                for (let i = 0, j = 0; i < points.length; i++, j += 3) {
                    // select the normal of the vertex in the first line
                    n1.x = normals[j + 0];
                    n1.y = normals[j + 1];
                    n1.z = normals[j + 2];
                    // select the normal of the vertex in the last line
                    n2.x = normals[base + j + 0];
                    n2.y = normals[base + j + 1];
                    n2.z = normals[base + j + 2];
                    // average normals
                    n.addVectors(n1, n2).normalize();
                    // assign the new values to both normals
                    normals[j + 0] = normals[base + j + 0] = n.x;
                    normals[j + 1] = normals[base + j + 1] = n.y;
                    normals[j + 2] = normals[base + j + 2] = n.z;
                }
            }
        }
    }
    exports.LatheBufferGeometry = LatheBufferGeometry;
});
//# sourceMappingURL=LatheBufferGeometry.js.map