define(["require", "exports", "../objects/LineSegments.js", "../math/Matrix4.js", "../materials/LineBasicMaterial.js", "../math/Color.js", "../math/Vector3.js", "../core/BufferGeometry.js", "../core/BufferAttribute.js"], function (require, exports, LineSegments_js_1, Matrix4_js_1, LineBasicMaterial_js_1, Color_js_1, Vector3_js_1, BufferGeometry_js_1, BufferAttribute_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const _vector = /*@__PURE__*/ new Vector3_js_1.Vector3();
    const _boneMatrix = /*@__PURE__*/ new Matrix4_js_1.Matrix4();
    const _matrixWorldInv = /*@__PURE__*/ new Matrix4_js_1.Matrix4();
    class SkeletonHelper extends LineSegments_js_1.LineSegments {
        constructor(object) {
            const bones = getBoneList(object);
            const geometry = new BufferGeometry_js_1.BufferGeometry();
            const vertices = [];
            const colors = [];
            const color1 = new Color_js_1.Color(0, 0, 1);
            const color2 = new Color_js_1.Color(0, 1, 0);
            for (let i = 0; i < bones.length; i++) {
                const bone = bones[i];
                if (bone.parent && bone.parent.isBone) {
                    vertices.push(0, 0, 0);
                    vertices.push(0, 0, 0);
                    colors.push(color1.r, color1.g, color1.b);
                    colors.push(color2.r, color2.g, color2.b);
                }
            }
            geometry.setAttribute('position', new BufferAttribute_js_1.Float32BufferAttribute(vertices, 3));
            geometry.setAttribute('color', new BufferAttribute_js_1.Float32BufferAttribute(colors, 3));
            const material = new LineBasicMaterial_js_1.LineBasicMaterial({ vertexColors: true, depthTest: false, depthWrite: false, toneMapped: false, transparent: true });
            super(geometry, material);
            this.type = 'SkeletonHelper';
            this.isSkeletonHelper = true;
            this.root = object;
            this.bones = bones;
            this.matrix = object.matrixWorld;
            this.matrixAutoUpdate = false;
        }
        updateMatrixWorld(force) {
            const bones = this.bones;
            const geometry = this.geometry;
            const position = geometry.getAttribute('position');
            _matrixWorldInv.getInverse(this.root.matrixWorld);
            for (let i = 0, j = 0; i < bones.length; i++) {
                const bone = bones[i];
                if (bone.parent && bone.parent.isBone) {
                    _boneMatrix.multiplyMatrices(_matrixWorldInv, bone.matrixWorld);
                    _vector.setFromMatrixPosition(_boneMatrix);
                    position.setXYZ(j, _vector.x, _vector.y, _vector.z);
                    _boneMatrix.multiplyMatrices(_matrixWorldInv, bone.parent.matrixWorld);
                    _vector.setFromMatrixPosition(_boneMatrix);
                    position.setXYZ(j + 1, _vector.x, _vector.y, _vector.z);
                    j += 2;
                }
            }
            geometry.getAttribute('position').needsUpdate = true;
            super.updateMatrixWorld(force);
        }
    }
    exports.SkeletonHelper = SkeletonHelper;
    function getBoneList(object) {
        const boneList = [];
        if (object && object.isBone) {
            boneList.push(object);
        }
        for (let i = 0; i < object.children.length; i++) {
            boneList.push.apply(boneList, getBoneList(object.children[i]));
        }
        return boneList;
    }
});
//# sourceMappingURL=SkeletonHelper.js.map