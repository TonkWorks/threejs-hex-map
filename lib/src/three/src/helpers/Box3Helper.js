define(["require", "exports", "../objects/LineSegments.js", "../materials/LineBasicMaterial.js", "../core/BufferAttribute.js", "../core/BufferAttribute.js", "../core/BufferGeometry.js"], function (require, exports, LineSegments_js_1, LineBasicMaterial_js_1, BufferAttribute_js_1, BufferAttribute_js_2, BufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Box3Helper extends LineSegments_js_1.LineSegments {
        constructor(box, color = 0xffff00) {
            const indices = new Uint16Array([0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7]);
            const positions = [1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1];
            const geometry = new BufferGeometry_js_1.BufferGeometry();
            geometry.setIndex(new BufferAttribute_js_1.BufferAttribute(indices, 1));
            geometry.setAttribute('position', new BufferAttribute_js_2.Float32BufferAttribute(positions, 3));
            super(geometry, new LineBasicMaterial_js_1.LineBasicMaterial({ color: color, toneMapped: false }));
            this.box = box;
            this.type = 'Box3Helper';
            this.geometry.computeBoundingSphere();
        }
        updateMatrixWorld(force) {
            const box = this.box;
            if (box.isEmpty())
                return;
            box.getCenter(this.position);
            box.getSize(this.scale);
            this.scale.multiplyScalar(0.5);
            super.updateMatrixWorld(force);
        }
    }
    exports.Box3Helper = Box3Helper;
});
//# sourceMappingURL=Box3Helper.js.map