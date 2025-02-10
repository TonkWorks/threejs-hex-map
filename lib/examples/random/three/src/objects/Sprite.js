define(["require", "exports", "../math/Vector2.js", "../math/Vector3.js", "../math/Matrix4.js", "../math/Triangle.js", "../core/Object3D.js", "../core/BufferGeometry.js", "../core/InterleavedBuffer.js", "../core/InterleavedBufferAttribute.js", "../materials/SpriteMaterial.js"], function (require, exports, Vector2_js_1, Vector3_js_1, Matrix4_js_1, Triangle_js_1, Object3D_js_1, BufferGeometry_js_1, InterleavedBuffer_js_1, InterleavedBufferAttribute_js_1, SpriteMaterial_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let _geometry;
    const _intersectPoint = new Vector3_js_1.Vector3();
    const _worldScale = new Vector3_js_1.Vector3();
    const _mvPosition = new Vector3_js_1.Vector3();
    const _alignedPosition = new Vector2_js_1.Vector2();
    const _rotatedPosition = new Vector2_js_1.Vector2();
    const _viewWorldMatrix = new Matrix4_js_1.Matrix4();
    const _vA = new Vector3_js_1.Vector3();
    const _vB = new Vector3_js_1.Vector3();
    const _vC = new Vector3_js_1.Vector3();
    const _uvA = new Vector2_js_1.Vector2();
    const _uvB = new Vector2_js_1.Vector2();
    const _uvC = new Vector2_js_1.Vector2();
    function Sprite(material) {
        Object3D_js_1.Object3D.call(this);
        this.type = 'Sprite';
        if (_geometry === undefined) {
            _geometry = new BufferGeometry_js_1.BufferGeometry();
            const float32Array = new Float32Array([
                -0.5, -0.5, 0, 0, 0,
                0.5, -0.5, 0, 1, 0,
                0.5, 0.5, 0, 1, 1,
                -0.5, 0.5, 0, 0, 1
            ]);
            const interleavedBuffer = new InterleavedBuffer_js_1.InterleavedBuffer(float32Array, 5);
            _geometry.setIndex([0, 1, 2, 0, 2, 3]);
            _geometry.setAttribute('position', new InterleavedBufferAttribute_js_1.InterleavedBufferAttribute(interleavedBuffer, 3, 0, false));
            _geometry.setAttribute('uv', new InterleavedBufferAttribute_js_1.InterleavedBufferAttribute(interleavedBuffer, 2, 3, false));
        }
        this.geometry = _geometry;
        this.material = (material !== undefined) ? material : new SpriteMaterial_js_1.SpriteMaterial();
        this.center = new Vector2_js_1.Vector2(0.5, 0.5);
    }
    exports.Sprite = Sprite;
    Sprite.prototype = Object.assign(Object.create(Object3D_js_1.Object3D.prototype), {
        constructor: Sprite,
        isSprite: true,
        raycast: function (raycaster, intersects) {
            if (raycaster.camera === null) {
                console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.');
            }
            _worldScale.setFromMatrixScale(this.matrixWorld);
            _viewWorldMatrix.copy(raycaster.camera.matrixWorld);
            this.modelViewMatrix.multiplyMatrices(raycaster.camera.matrixWorldInverse, this.matrixWorld);
            _mvPosition.setFromMatrixPosition(this.modelViewMatrix);
            if (raycaster.camera.isPerspectiveCamera && this.material.sizeAttenuation === false) {
                _worldScale.multiplyScalar(-_mvPosition.z);
            }
            const rotation = this.material.rotation;
            let sin, cos;
            if (rotation !== 0) {
                cos = Math.cos(rotation);
                sin = Math.sin(rotation);
            }
            const center = this.center;
            transformVertex(_vA.set(-0.5, -0.5, 0), _mvPosition, center, _worldScale, sin, cos);
            transformVertex(_vB.set(0.5, -0.5, 0), _mvPosition, center, _worldScale, sin, cos);
            transformVertex(_vC.set(0.5, 0.5, 0), _mvPosition, center, _worldScale, sin, cos);
            _uvA.set(0, 0);
            _uvB.set(1, 0);
            _uvC.set(1, 1);
            // check first triangle
            let intersect = raycaster.ray.intersectTriangle(_vA, _vB, _vC, false, _intersectPoint);
            if (intersect === null) {
                // check second triangle
                transformVertex(_vB.set(-0.5, 0.5, 0), _mvPosition, center, _worldScale, sin, cos);
                _uvB.set(0, 1);
                intersect = raycaster.ray.intersectTriangle(_vA, _vC, _vB, false, _intersectPoint);
                if (intersect === null) {
                    return;
                }
            }
            const distance = raycaster.ray.origin.distanceTo(_intersectPoint);
            if (distance < raycaster.near || distance > raycaster.far)
                return;
            intersects.push({
                distance: distance,
                point: _intersectPoint.clone(),
                uv: Triangle_js_1.Triangle.getUV(_intersectPoint, _vA, _vB, _vC, _uvA, _uvB, _uvC, new Vector2_js_1.Vector2()),
                face: null,
                object: this
            });
        },
        copy: function (source) {
            Object3D_js_1.Object3D.prototype.copy.call(this, source);
            if (source.center !== undefined)
                this.center.copy(source.center);
            this.material = source.material;
            return this;
        }
    });
    function transformVertex(vertexPosition, mvPosition, center, scale, sin, cos) {
        // compute position in camera space
        _alignedPosition.subVectors(vertexPosition, center).addScalar(0.5).multiply(scale);
        // to check if rotation is not zero
        if (sin !== undefined) {
            _rotatedPosition.x = (cos * _alignedPosition.x) - (sin * _alignedPosition.y);
            _rotatedPosition.y = (sin * _alignedPosition.x) + (cos * _alignedPosition.y);
        }
        else {
            _rotatedPosition.copy(_alignedPosition);
        }
        vertexPosition.copy(mvPosition);
        vertexPosition.x += _rotatedPosition.x;
        vertexPosition.y += _rotatedPosition.y;
        // transform to world space
        vertexPosition.applyMatrix4(_viewWorldMatrix);
    }
});
//# sourceMappingURL=Sprite.js.map