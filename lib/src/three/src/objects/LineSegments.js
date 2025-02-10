define(["require", "exports", "./Line.js", "../math/Vector3.js", "../core/BufferAttribute.js"], function (require, exports, Line_js_1, Vector3_js_1, BufferAttribute_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const _start = new Vector3_js_1.Vector3();
    const _end = new Vector3_js_1.Vector3();
    function LineSegments(geometry, material) {
        Line_js_1.Line.call(this, geometry, material);
        this.type = 'LineSegments';
    }
    exports.LineSegments = LineSegments;
    LineSegments.prototype = Object.assign(Object.create(Line_js_1.Line.prototype), {
        constructor: LineSegments,
        isLineSegments: true,
        computeLineDistances: function () {
            const geometry = this.geometry;
            if (geometry.isBufferGeometry) {
                // we assume non-indexed geometry
                if (geometry.index === null) {
                    const positionAttribute = geometry.attributes.position;
                    const lineDistances = [];
                    for (let i = 0, l = positionAttribute.count; i < l; i += 2) {
                        _start.fromBufferAttribute(positionAttribute, i);
                        _end.fromBufferAttribute(positionAttribute, i + 1);
                        lineDistances[i] = (i === 0) ? 0 : lineDistances[i - 1];
                        lineDistances[i + 1] = lineDistances[i] + _start.distanceTo(_end);
                    }
                    geometry.setAttribute('lineDistance', new BufferAttribute_js_1.Float32BufferAttribute(lineDistances, 1));
                }
                else {
                    console.warn('THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.');
                }
            }
            else if (geometry.isGeometry) {
                const vertices = geometry.vertices;
                const lineDistances = geometry.lineDistances;
                for (let i = 0, l = vertices.length; i < l; i += 2) {
                    _start.copy(vertices[i]);
                    _end.copy(vertices[i + 1]);
                    lineDistances[i] = (i === 0) ? 0 : lineDistances[i - 1];
                    lineDistances[i + 1] = lineDistances[i] + _start.distanceTo(_end);
                }
            }
            return this;
        }
    });
});
//# sourceMappingURL=LineSegments.js.map