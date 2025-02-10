define(["require", "exports", "../core/BufferAttribute.js", "../core/BufferGeometry.js", "../core/Object3D.js", "../geometries/CylinderBufferGeometry.js", "../materials/MeshBasicMaterial.js", "../materials/LineBasicMaterial.js", "../objects/Mesh.js", "../objects/Line.js", "../math/Vector3.js"], function (require, exports, BufferAttribute_js_1, BufferGeometry_js_1, Object3D_js_1, CylinderBufferGeometry_js_1, MeshBasicMaterial_js_1, LineBasicMaterial_js_1, Mesh_js_1, Line_js_1, Vector3_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const _axis = /*@__PURE__*/ new Vector3_js_1.Vector3();
    let _lineGeometry, _coneGeometry;
    class ArrowHelper extends Object3D_js_1.Object3D {
        constructor(dir, origin, length, color, headLength, headWidth) {
            super();
            // dir is assumed to be normalized
            this.type = 'ArrowHelper';
            if (dir === undefined)
                dir = new Vector3_js_1.Vector3(0, 0, 1);
            if (origin === undefined)
                origin = new Vector3_js_1.Vector3(0, 0, 0);
            if (length === undefined)
                length = 1;
            if (color === undefined)
                color = 0xffff00;
            if (headLength === undefined)
                headLength = 0.2 * length;
            if (headWidth === undefined)
                headWidth = 0.2 * headLength;
            if (_lineGeometry === undefined) {
                _lineGeometry = new BufferGeometry_js_1.BufferGeometry();
                _lineGeometry.setAttribute('position', new BufferAttribute_js_1.Float32BufferAttribute([0, 0, 0, 0, 1, 0], 3));
                _coneGeometry = new CylinderBufferGeometry_js_1.CylinderBufferGeometry(0, 0.5, 1, 5, 1);
                _coneGeometry.translate(0, -0.5, 0);
            }
            this.position.copy(origin);
            this.line = new Line_js_1.Line(_lineGeometry, new LineBasicMaterial_js_1.LineBasicMaterial({ color: color, toneMapped: false }));
            this.line.matrixAutoUpdate = false;
            this.add(this.line);
            this.cone = new Mesh_js_1.Mesh(_coneGeometry, new MeshBasicMaterial_js_1.MeshBasicMaterial({ color: color, toneMapped: false }));
            this.cone.matrixAutoUpdate = false;
            this.add(this.cone);
            this.setDirection(dir);
            this.setLength(length, headLength, headWidth);
        }
        setDirection(dir) {
            // dir is assumed to be normalized
            if (dir.y > 0.99999) {
                this.quaternion.set(0, 0, 0, 1);
            }
            else if (dir.y < -0.99999) {
                this.quaternion.set(1, 0, 0, 0);
            }
            else {
                _axis.set(dir.z, 0, -dir.x).normalize();
                const radians = Math.acos(dir.y);
                this.quaternion.setFromAxisAngle(_axis, radians);
            }
        }
        setLength(length, headLength, headWidth) {
            if (headLength === undefined)
                headLength = 0.2 * length;
            if (headWidth === undefined)
                headWidth = 0.2 * headLength;
            this.line.scale.set(1, Math.max(0.0001, length - headLength), 1); // see #17458
            this.line.updateMatrix();
            this.cone.scale.set(headWidth, headLength, headWidth);
            this.cone.position.y = length;
            this.cone.updateMatrix();
        }
        setColor(color) {
            this.line.material.color.set(color);
            this.cone.material.color.set(color);
        }
        copy(source) {
            super.copy(source, false);
            this.line.copy(source.line);
            this.cone.copy(source.cone);
            return this;
        }
    }
    exports.ArrowHelper = ArrowHelper;
});
//# sourceMappingURL=ArrowHelper.js.map