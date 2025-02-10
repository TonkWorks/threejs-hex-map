define(["require", "exports", "../math/Vector3.js", "../core/Object3D.js", "../objects/LineSegments.js", "../materials/LineBasicMaterial.js", "../core/BufferAttribute.js", "../core/BufferGeometry.js"], function (require, exports, Vector3_js_1, Object3D_js_1, LineSegments_js_1, LineBasicMaterial_js_1, BufferAttribute_js_1, BufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const _vector = /*@__PURE__*/ new Vector3_js_1.Vector3();
    class SpotLightHelper extends Object3D_js_1.Object3D {
        constructor(light, color) {
            super();
            this.light = light;
            this.light.updateMatrixWorld();
            this.matrix = light.matrixWorld;
            this.matrixAutoUpdate = false;
            this.color = color;
            const geometry = new BufferGeometry_js_1.BufferGeometry();
            const positions = [
                0, 0, 0, 0, 0, 1,
                0, 0, 0, 1, 0, 1,
                0, 0, 0, -1, 0, 1,
                0, 0, 0, 0, 1, 1,
                0, 0, 0, 0, -1, 1
            ];
            for (let i = 0, j = 1, l = 32; i < l; i++, j++) {
                const p1 = (i / l) * Math.PI * 2;
                const p2 = (j / l) * Math.PI * 2;
                positions.push(Math.cos(p1), Math.sin(p1), 1, Math.cos(p2), Math.sin(p2), 1);
            }
            geometry.setAttribute('position', new BufferAttribute_js_1.Float32BufferAttribute(positions, 3));
            const material = new LineBasicMaterial_js_1.LineBasicMaterial({ fog: false, toneMapped: false });
            this.cone = new LineSegments_js_1.LineSegments(geometry, material);
            this.add(this.cone);
            this.update();
        }
        dispose() {
            this.cone.geometry.dispose();
            this.cone.material.dispose();
        }
        update() {
            this.light.updateMatrixWorld();
            const coneLength = this.light.distance ? this.light.distance : 1000;
            const coneWidth = coneLength * Math.tan(this.light.angle);
            this.cone.scale.set(coneWidth, coneWidth, coneLength);
            _vector.setFromMatrixPosition(this.light.target.matrixWorld);
            this.cone.lookAt(_vector);
            if (this.color !== undefined) {
                this.cone.material.color.set(this.color);
            }
            else {
                this.cone.material.color.copy(this.light.color);
            }
        }
    }
    exports.SpotLightHelper = SpotLightHelper;
});
//# sourceMappingURL=SpotLightHelper.js.map