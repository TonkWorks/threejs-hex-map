define(["require", "exports", "../../../build/three.module.js", "../lines/LineSegmentsGeometry.js", "../lines/LineMaterial.js"], function (require, exports, three_module_js_1, LineSegmentsGeometry_js_1, LineMaterial_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Wireframe = void 0;
    var Wireframe = function (geometry, material) {
        three_module_js_1.Mesh.call(this);
        this.type = 'Wireframe';
        this.geometry = geometry !== undefined ? geometry : new LineSegmentsGeometry_js_1.LineSegmentsGeometry();
        this.material = material !== undefined ? material : new LineMaterial_js_1.LineMaterial({ color: Math.random() * 0xffffff });
    };
    exports.Wireframe = Wireframe;
    Wireframe.prototype = Object.assign(Object.create(three_module_js_1.Mesh.prototype), {
        constructor: Wireframe,
        isWireframe: true,
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
        }())
    });
});
//# sourceMappingURL=Wireframe.js.map
//# sourceMappingURL=Wireframe.js.map