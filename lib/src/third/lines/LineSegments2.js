define(["require", "exports", "../../../build/three.module.js", "../lines/LineSegmentsGeometry.js", "../lines/LineMaterial.js"], function (require, exports, three_module_js_1, LineSegmentsGeometry_js_1, LineMaterial_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LineSegments2 = void 0;
    var LineSegments2 = function (geometry, material) {
        if (geometry === undefined)
            geometry = new LineSegmentsGeometry_js_1.LineSegmentsGeometry();
        if (material === undefined)
            material = new LineMaterial_js_1.LineMaterial({ color: Math.random() * 0xffffff });
        three_module_js_1.Mesh.call(this, geometry, material);
        this.type = 'LineSegments2';
    };
    exports.LineSegments2 = LineSegments2;
    LineSegments2.prototype = Object.assign(Object.create(three_module_js_1.Mesh.prototype), {
        constructor: LineSegments2,
        isLineSegments2: true,
        computeLineDistances: (function () {
            var start = new three_module_js_1.Vector3();
            var end = new three_module_js_1.Vector3();
            return function computeLineDistances() {
                var geometry = this.geometry;
                var instanceStart = geometry.attributes.instanceStart;
                var instanceEnd = geometry.attributes.instanceEnd;
                var lineDistances = new Float32Array(2 * instanceStart.data.count);
                for (var i = 0, j = 0, l = instanceStart.data.count; i < l; i++, j += 2) {
                    start.fromBufferAttribute(instanceStart, i);
                    end.fromBufferAttribute(instanceEnd, i);
                    lineDistances[j] = (j === 0) ? 0 : lineDistances[j - 1];
                    lineDistances[j + 1] = lineDistances[j] + start.distanceTo(end);
                }
                var instanceDistanceBuffer = new three_module_js_1.InstancedInterleavedBuffer(lineDistances, 2, 1); // d0, d1
                geometry.setAttribute('instanceDistanceStart', new three_module_js_1.InterleavedBufferAttribute(instanceDistanceBuffer, 1, 0)); // d0
                geometry.setAttribute('instanceDistanceEnd', new three_module_js_1.InterleavedBufferAttribute(instanceDistanceBuffer, 1, 1)); // d1
                return this;
            };
        }()),
        raycast: (function () {
            var start = new three_module_js_1.Vector4();
            var end = new three_module_js_1.Vector4();
            var ssOrigin = new three_module_js_1.Vector4();
            var ssOrigin3 = new three_module_js_1.Vector3();
            var mvMatrix = new three_module_js_1.Matrix4();
            var line = new three_module_js_1.Line3();
            var closestPoint = new three_module_js_1.Vector3();
            return function raycast(raycaster, intersects) {
                if (raycaster.camera === null) {
                    console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2.');
                }
                var threshold = (raycaster.params.Line2 !== undefined) ? raycaster.params.Line2.threshold || 0 : 0;
                var ray = raycaster.ray;
                var camera = raycaster.camera;
                var projectionMatrix = camera.projectionMatrix;
                var geometry = this.geometry;
                var material = this.material;
                var resolution = material.resolution;
                var lineWidth = material.linewidth + threshold;
                var instanceStart = geometry.attributes.instanceStart;
                var instanceEnd = geometry.attributes.instanceEnd;
                // pick a point 1 unit out along the ray to avoid the ray origin
                // sitting at the camera origin which will cause "w" to be 0 when
                // applying the projection matrix.
                ray.at(1, ssOrigin);
                // ndc space [ - 1.0, 1.0 ]
                ssOrigin.w = 1;
                ssOrigin.applyMatrix4(camera.matrixWorldInverse);
                ssOrigin.applyMatrix4(projectionMatrix);
                ssOrigin.multiplyScalar(1 / ssOrigin.w);
                // screen space
                ssOrigin.x *= resolution.x / 2;
                ssOrigin.y *= resolution.y / 2;
                ssOrigin.z = 0;
                ssOrigin3.copy(ssOrigin);
                var matrixWorld = this.matrixWorld;
                mvMatrix.multiplyMatrices(camera.matrixWorldInverse, matrixWorld);
                for (var i = 0, l = instanceStart.count; i < l; i++) {
                    start.fromBufferAttribute(instanceStart, i);
                    end.fromBufferAttribute(instanceEnd, i);
                    start.w = 1;
                    end.w = 1;
                    // camera space
                    start.applyMatrix4(mvMatrix);
                    end.applyMatrix4(mvMatrix);
                    // clip space
                    start.applyMatrix4(projectionMatrix);
                    end.applyMatrix4(projectionMatrix);
                    // ndc space [ - 1.0, 1.0 ]
                    start.multiplyScalar(1 / start.w);
                    end.multiplyScalar(1 / end.w);
                    // skip the segment if it's outside the camera near and far planes
                    var isBehindCameraNear = start.z < -1 && end.z < -1;
                    var isPastCameraFar = start.z > 1 && end.z > 1;
                    if (isBehindCameraNear || isPastCameraFar) {
                        continue;
                    }
                    // screen space
                    start.x *= resolution.x / 2;
                    start.y *= resolution.y / 2;
                    end.x *= resolution.x / 2;
                    end.y *= resolution.y / 2;
                    // create 2d segment
                    line.start.copy(start);
                    line.start.z = 0;
                    line.end.copy(end);
                    line.end.z = 0;
                    // get closest point on ray to segment
                    var param = line.closestPointToPointParameter(ssOrigin3, true);
                    line.at(param, closestPoint);
                    // check if the intersection point is within clip space
                    var zPos = three_module_js_1.MathUtils.lerp(start.z, end.z, param);
                    var isInClipSpace = zPos >= -1 && zPos <= 1;
                    var isInside = ssOrigin3.distanceTo(closestPoint) < lineWidth * 0.5;
                    if (isInClipSpace && isInside) {
                        line.start.fromBufferAttribute(instanceStart, i);
                        line.end.fromBufferAttribute(instanceEnd, i);
                        line.start.applyMatrix4(matrixWorld);
                        line.end.applyMatrix4(matrixWorld);
                        var pointOnLine = new three_module_js_1.Vector3();
                        var point = new three_module_js_1.Vector3();
                        ray.distanceSqToSegment(line.start, line.end, point, pointOnLine);
                        intersects.push({
                            point: point,
                            pointOnLine: pointOnLine,
                            distance: ray.origin.distanceTo(point),
                            object: this,
                            face: null,
                            faceIndex: i,
                            uv: null,
                            uv2: null,
                        });
                    }
                }
            };
        }())
    });
});
//# sourceMappingURL=LineSegments2.js.map