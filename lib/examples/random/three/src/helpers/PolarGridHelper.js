define(["require", "exports", "../objects/LineSegments.js", "../materials/LineBasicMaterial.js", "../core/BufferAttribute.js", "../core/BufferGeometry.js", "../math/Color.js"], function (require, exports, LineSegments_js_1, LineBasicMaterial_js_1, BufferAttribute_js_1, BufferGeometry_js_1, Color_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PolarGridHelper extends LineSegments_js_1.LineSegments {
        constructor(radius, radials, circles, divisions, color1, color2) {
            radius = radius || 10;
            radials = radials || 16;
            circles = circles || 8;
            divisions = divisions || 64;
            color1 = new Color_js_1.Color(color1 !== undefined ? color1 : 0x444444);
            color2 = new Color_js_1.Color(color2 !== undefined ? color2 : 0x888888);
            const vertices = [];
            const colors = [];
            // create the radials
            for (let i = 0; i <= radials; i++) {
                const v = (i / radials) * (Math.PI * 2);
                const x = Math.sin(v) * radius;
                const z = Math.cos(v) * radius;
                vertices.push(0, 0, 0);
                vertices.push(x, 0, z);
                const color = (i & 1) ? color1 : color2;
                colors.push(color.r, color.g, color.b);
                colors.push(color.r, color.g, color.b);
            }
            // create the circles
            for (let i = 0; i <= circles; i++) {
                const color = (i & 1) ? color1 : color2;
                const r = radius - (radius / circles * i);
                for (let j = 0; j < divisions; j++) {
                    // first vertex
                    let v = (j / divisions) * (Math.PI * 2);
                    let x = Math.sin(v) * r;
                    let z = Math.cos(v) * r;
                    vertices.push(x, 0, z);
                    colors.push(color.r, color.g, color.b);
                    // second vertex
                    v = ((j + 1) / divisions) * (Math.PI * 2);
                    x = Math.sin(v) * r;
                    z = Math.cos(v) * r;
                    vertices.push(x, 0, z);
                    colors.push(color.r, color.g, color.b);
                }
            }
            const geometry = new BufferGeometry_js_1.BufferGeometry();
            geometry.setAttribute('position', new BufferAttribute_js_1.Float32BufferAttribute(vertices, 3));
            geometry.setAttribute('color', new BufferAttribute_js_1.Float32BufferAttribute(colors, 3));
            const material = new LineBasicMaterial_js_1.LineBasicMaterial({ vertexColors: true, toneMapped: false });
            super(geometry, material);
            this.type = 'PolarGridHelper';
        }
    }
    exports.PolarGridHelper = PolarGridHelper;
});
//# sourceMappingURL=PolarGridHelper.js.map