define(["require", "exports", "../core/BufferAttribute.js", "./Mesh.js", "../math/Matrix4.js"], function (require, exports, BufferAttribute_js_1, Mesh_js_1, Matrix4_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const _instanceLocalMatrix = new Matrix4_js_1.Matrix4();
    const _instanceWorldMatrix = new Matrix4_js_1.Matrix4();
    const _instanceIntersects = [];
    const _mesh = new Mesh_js_1.Mesh();
    function InstancedMesh(geometry, material, count) {
        Mesh_js_1.Mesh.call(this, geometry, material);
        this.instanceMatrix = new BufferAttribute_js_1.BufferAttribute(new Float32Array(count * 16), 16);
        this.instanceColor = null;
        this.count = count;
        this.frustumCulled = false;
    }
    exports.InstancedMesh = InstancedMesh;
    InstancedMesh.prototype = Object.assign(Object.create(Mesh_js_1.Mesh.prototype), {
        constructor: InstancedMesh,
        isInstancedMesh: true,
        copy: function (source) {
            Mesh_js_1.Mesh.prototype.copy.call(this, source);
            this.instanceMatrix.copy(source.instanceMatrix);
            this.count = source.count;
            return this;
        },
        setColorAt: function (index, color) {
            if (this.instanceColor === null) {
                this.instanceColor = new BufferAttribute_js_1.BufferAttribute(new Float32Array(this.count * 3), 3);
            }
            color.toArray(this.instanceColor.array, index * 3);
        },
        getMatrixAt: function (index, matrix) {
            matrix.fromArray(this.instanceMatrix.array, index * 16);
        },
        raycast: function (raycaster, intersects) {
            const matrixWorld = this.matrixWorld;
            const raycastTimes = this.count;
            _mesh.geometry = this.geometry;
            _mesh.material = this.material;
            if (_mesh.material === undefined)
                return;
            for (let instanceId = 0; instanceId < raycastTimes; instanceId++) {
                // calculate the world matrix for each instance
                this.getMatrixAt(instanceId, _instanceLocalMatrix);
                _instanceWorldMatrix.multiplyMatrices(matrixWorld, _instanceLocalMatrix);
                // the mesh represents this single instance
                _mesh.matrixWorld = _instanceWorldMatrix;
                _mesh.raycast(raycaster, _instanceIntersects);
                // process the result of raycast
                for (let i = 0, l = _instanceIntersects.length; i < l; i++) {
                    const intersect = _instanceIntersects[i];
                    intersect.instanceId = instanceId;
                    intersect.object = this;
                    intersects.push(intersect);
                }
                _instanceIntersects.length = 0;
            }
        },
        setMatrixAt: function (index, matrix) {
            matrix.toArray(this.instanceMatrix.array, index * 16);
        },
        updateMorphTargets: function () {
        }
    });
});
//# sourceMappingURL=InstancedMesh.js.map