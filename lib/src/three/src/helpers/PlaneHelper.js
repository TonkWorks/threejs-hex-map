define(["require", "exports", "../objects/Line.js", "../objects/Mesh.js", "../materials/LineBasicMaterial.js", "../materials/MeshBasicMaterial.js", "../core/BufferAttribute.js", "../core/BufferGeometry.js", "../constants.js"], function (require, exports, Line_js_1, Mesh_js_1, LineBasicMaterial_js_1, MeshBasicMaterial_js_1, BufferAttribute_js_1, BufferGeometry_js_1, constants_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PlaneHelper extends Line_js_1.Line {
        constructor(plane, size, hex) {
            const color = (hex !== undefined) ? hex : 0xffff00;
            const positions = [1, -1, 1, -1, 1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0];
            const geometry = new BufferGeometry_js_1.BufferGeometry();
            geometry.setAttribute('position', new BufferAttribute_js_1.Float32BufferAttribute(positions, 3));
            geometry.computeBoundingSphere();
            super(geometry, new LineBasicMaterial_js_1.LineBasicMaterial({ color: color, toneMapped: false }));
            this.type = 'PlaneHelper';
            this.plane = plane;
            this.size = (size === undefined) ? 1 : size;
            const positions2 = [1, 1, 1, -1, 1, 1, -1, -1, 1, 1, 1, 1, -1, -1, 1, 1, -1, 1];
            const geometry2 = new BufferGeometry_js_1.BufferGeometry();
            geometry2.setAttribute('position', new BufferAttribute_js_1.Float32BufferAttribute(positions2, 3));
            geometry2.computeBoundingSphere();
            this.add(new Mesh_js_1.Mesh(geometry2, new MeshBasicMaterial_js_1.MeshBasicMaterial({ color: color, opacity: 0.2, transparent: true, depthWrite: false, toneMapped: false })));
        }
        updateMatrixWorld(force) {
            let scale = -this.plane.constant;
            if (Math.abs(scale) < 1e-8)
                scale = 1e-8; // sign does not matter
            this.scale.set(0.5 * this.size, 0.5 * this.size, scale);
            this.children[0].material.side = (scale < 0) ? constants_js_1.BackSide : constants_js_1.FrontSide; // renderer flips side when determinant < 0; flipping not wanted here
            this.lookAt(this.plane.normal);
            super.updateMatrixWorld(force);
        }
    }
    exports.PlaneHelper = PlaneHelper;
});
//# sourceMappingURL=PlaneHelper.js.map