define(["require", "exports", "../objects/LineSegments.js", "../materials/LineBasicMaterial.js", "../core/BufferAttribute.js", "../core/BufferGeometry.js", "../math/Color.js"], function (require, exports, LineSegments_js_1, LineBasicMaterial_js_1, BufferAttribute_js_1, BufferGeometry_js_1, Color_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GridHelper extends LineSegments_js_1.LineSegments {
        constructor(size, divisions, color1, color2) {
            size = size || 10;
            divisions = divisions || 10;
            color1 = new Color_js_1.Color(color1 !== undefined ? color1 : 0x444444);
            color2 = new Color_js_1.Color(color2 !== undefined ? color2 : 0x888888);
            const center = divisions / 2;
            const step = size / divisions;
            const halfSize = size / 2;
            const vertices = [], colors = [];
            for (let i = 0, j = 0, k = -halfSize; i <= divisions; i++, k += step) {
                vertices.push(-halfSize, 0, k, halfSize, 0, k);
                vertices.push(k, 0, -halfSize, k, 0, halfSize);
                const color = i === center ? color1 : color2;
                color.toArray(colors, j);
                j += 3;
                color.toArray(colors, j);
                j += 3;
                color.toArray(colors, j);
                j += 3;
                color.toArray(colors, j);
                j += 3;
            }
            const geometry = new BufferGeometry_js_1.BufferGeometry();
            geometry.setAttribute('position', new BufferAttribute_js_1.Float32BufferAttribute(vertices, 3));
            geometry.setAttribute('color', new BufferAttribute_js_1.Float32BufferAttribute(colors, 3));
            const material = new LineBasicMaterial_js_1.LineBasicMaterial({ vertexColors: true, toneMapped: false });
            super(geometry, material);
            this.type = 'GridHelper';
        }
    }
    exports.GridHelper = GridHelper;
});
//# sourceMappingURL=GridHelper.js.map