define(["require", "exports", "../math/Vector3.js", "../math/Color.js", "../core/Object3D.js", "../objects/Mesh.js", "../materials/MeshBasicMaterial.js", "../geometries/OctahedronBufferGeometry.js", "../core/BufferAttribute.js"], function (require, exports, Vector3_js_1, Color_js_1, Object3D_js_1, Mesh_js_1, MeshBasicMaterial_js_1, OctahedronBufferGeometry_js_1, BufferAttribute_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const _vector = /*@__PURE__*/ new Vector3_js_1.Vector3();
    const _color1 = /*@__PURE__*/ new Color_js_1.Color();
    const _color2 = /*@__PURE__*/ new Color_js_1.Color();
    class HemisphereLightHelper extends Object3D_js_1.Object3D {
        constructor(light, size, color) {
            super();
            this.light = light;
            this.light.updateMatrixWorld();
            this.matrix = light.matrixWorld;
            this.matrixAutoUpdate = false;
            this.color = color;
            const geometry = new OctahedronBufferGeometry_js_1.OctahedronBufferGeometry(size);
            geometry.rotateY(Math.PI * 0.5);
            this.material = new MeshBasicMaterial_js_1.MeshBasicMaterial({ wireframe: true, fog: false, toneMapped: false });
            if (this.color === undefined)
                this.material.vertexColors = true;
            const position = geometry.getAttribute('position');
            const colors = new Float32Array(position.count * 3);
            geometry.setAttribute('color', new BufferAttribute_js_1.BufferAttribute(colors, 3));
            this.add(new Mesh_js_1.Mesh(geometry, this.material));
            this.update();
        }
        dispose() {
            this.children[0].geometry.dispose();
            this.children[0].material.dispose();
        }
        update() {
            const mesh = this.children[0];
            if (this.color !== undefined) {
                this.material.color.set(this.color);
            }
            else {
                const colors = mesh.geometry.getAttribute('color');
                _color1.copy(this.light.color);
                _color2.copy(this.light.groundColor);
                for (let i = 0, l = colors.count; i < l; i++) {
                    const color = (i < (l / 2)) ? _color1 : _color2;
                    colors.setXYZ(i, color.r, color.g, color.b);
                }
                colors.needsUpdate = true;
            }
            mesh.lookAt(_vector.setFromMatrixPosition(this.light.matrixWorld).negate());
        }
    }
    exports.HemisphereLightHelper = HemisphereLightHelper;
});
//# sourceMappingURL=HemisphereLightHelper.js.map