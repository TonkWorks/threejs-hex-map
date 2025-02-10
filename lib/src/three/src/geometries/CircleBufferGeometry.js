define(["require", "exports", "../core/BufferGeometry.js", "../core/BufferAttribute.js", "../math/Vector3.js", "../math/Vector2.js"], function (require, exports, BufferGeometry_js_1, BufferAttribute_js_1, Vector3_js_1, Vector2_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CircleBufferGeometry extends BufferGeometry_js_1.BufferGeometry {
        constructor(radius, segments, thetaStart, thetaLength) {
            super();
            this.type = 'CircleBufferGeometry';
            this.parameters = {
                radius: radius,
                segments: segments,
                thetaStart: thetaStart,
                thetaLength: thetaLength
            };
            radius = radius || 1;
            segments = segments !== undefined ? Math.max(3, segments) : 8;
            thetaStart = thetaStart !== undefined ? thetaStart : 0;
            thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2;
            // buffers
            const indices = [];
            const vertices = [];
            const normals = [];
            const uvs = [];
            // helper variables
            const vertex = new Vector3_js_1.Vector3();
            const uv = new Vector2_js_1.Vector2();
            // center point
            vertices.push(0, 0, 0);
            normals.push(0, 0, 1);
            uvs.push(0.5, 0.5);
            for (let s = 0, i = 3; s <= segments; s++, i += 3) {
                const segment = thetaStart + s / segments * thetaLength;
                // vertex
                vertex.x = radius * Math.cos(segment);
                vertex.y = radius * Math.sin(segment);
                vertices.push(vertex.x, vertex.y, vertex.z);
                // normal
                normals.push(0, 0, 1);
                // uvs
                uv.x = (vertices[i] / radius + 1) / 2;
                uv.y = (vertices[i + 1] / radius + 1) / 2;
                uvs.push(uv.x, uv.y);
            }
            // indices
            for (let i = 1; i <= segments; i++) {
                indices.push(i, i + 1, 0);
            }
            // build geometry
            this.setIndex(indices);
            this.setAttribute('position', new BufferAttribute_js_1.Float32BufferAttribute(vertices, 3));
            this.setAttribute('normal', new BufferAttribute_js_1.Float32BufferAttribute(normals, 3));
            this.setAttribute('uv', new BufferAttribute_js_1.Float32BufferAttribute(uvs, 2));
        }
    }
    exports.CircleBufferGeometry = CircleBufferGeometry;
});
//# sourceMappingURL=CircleBufferGeometry.js.map