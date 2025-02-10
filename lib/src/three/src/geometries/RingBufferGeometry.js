define(["require", "exports", "../core/BufferGeometry.js", "../core/BufferAttribute.js", "../math/Vector2.js", "../math/Vector3.js"], function (require, exports, BufferGeometry_js_1, BufferAttribute_js_1, Vector2_js_1, Vector3_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class RingBufferGeometry extends BufferGeometry_js_1.BufferGeometry {
        constructor(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength) {
            super();
            this.type = 'RingBufferGeometry';
            this.parameters = {
                innerRadius: innerRadius,
                outerRadius: outerRadius,
                thetaSegments: thetaSegments,
                phiSegments: phiSegments,
                thetaStart: thetaStart,
                thetaLength: thetaLength
            };
            innerRadius = innerRadius || 0.5;
            outerRadius = outerRadius || 1;
            thetaStart = thetaStart !== undefined ? thetaStart : 0;
            thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2;
            thetaSegments = thetaSegments !== undefined ? Math.max(3, thetaSegments) : 8;
            phiSegments = phiSegments !== undefined ? Math.max(1, phiSegments) : 1;
            // buffers
            const indices = [];
            const vertices = [];
            const normals = [];
            const uvs = [];
            // some helper variables
            let radius = innerRadius;
            const radiusStep = ((outerRadius - innerRadius) / phiSegments);
            const vertex = new Vector3_js_1.Vector3();
            const uv = new Vector2_js_1.Vector2();
            // generate vertices, normals and uvs
            for (let j = 0; j <= phiSegments; j++) {
                for (let i = 0; i <= thetaSegments; i++) {
                    // values are generate from the inside of the ring to the outside
                    const segment = thetaStart + i / thetaSegments * thetaLength;
                    // vertex
                    vertex.x = radius * Math.cos(segment);
                    vertex.y = radius * Math.sin(segment);
                    vertices.push(vertex.x, vertex.y, vertex.z);
                    // normal
                    normals.push(0, 0, 1);
                    // uv
                    uv.x = (vertex.x / outerRadius + 1) / 2;
                    uv.y = (vertex.y / outerRadius + 1) / 2;
                    uvs.push(uv.x, uv.y);
                }
                // increase the radius for next row of vertices
                radius += radiusStep;
            }
            // indices
            for (let j = 0; j < phiSegments; j++) {
                const thetaSegmentLevel = j * (thetaSegments + 1);
                for (let i = 0; i < thetaSegments; i++) {
                    const segment = i + thetaSegmentLevel;
                    const a = segment;
                    const b = segment + thetaSegments + 1;
                    const c = segment + thetaSegments + 2;
                    const d = segment + 1;
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
    exports.RingBufferGeometry = RingBufferGeometry;
});
//# sourceMappingURL=RingBufferGeometry.js.map