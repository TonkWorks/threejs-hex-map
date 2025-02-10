define(["require", "exports", "../objects/LineSegments.js", "../materials/LineBasicMaterial.js", "../core/BufferAttribute.js", "../core/BufferGeometry.js"], function (require, exports, LineSegments_js_1, LineBasicMaterial_js_1, BufferAttribute_js_1, BufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AxesHelper extends LineSegments_js_1.LineSegments {
        constructor(size = 1) {
            const vertices = [
                0, 0, 0, size, 0, 0,
                0, 0, 0, 0, size, 0,
                0, 0, 0, 0, 0, size
            ];
            const colors = [
                1, 0, 0, 1, 0.6, 0,
                0, 1, 0, 0.6, 1, 0,
                0, 0, 1, 0, 0.6, 1
            ];
            const geometry = new BufferGeometry_js_1.BufferGeometry();
            geometry.setAttribute('position', new BufferAttribute_js_1.Float32BufferAttribute(vertices, 3));
            geometry.setAttribute('color', new BufferAttribute_js_1.Float32BufferAttribute(colors, 3));
            const material = new LineBasicMaterial_js_1.LineBasicMaterial({ vertexColors: true, toneMapped: false });
            super(geometry, material);
            this.type = 'AxesHelper';
        }
    }
    exports.AxesHelper = AxesHelper;
});
//# sourceMappingURL=AxesHelper.js.map