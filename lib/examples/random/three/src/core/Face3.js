define(["require", "exports", "../math/Color.js", "../math/Vector3.js"], function (require, exports, Color_js_1, Vector3_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Face3 {
        constructor(a, b, c, normal, color, materialIndex) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.normal = (normal && normal.isVector3) ? normal : new Vector3_js_1.Vector3();
            this.vertexNormals = Array.isArray(normal) ? normal : [];
            this.color = (color && color.isColor) ? color : new Color_js_1.Color();
            this.vertexColors = Array.isArray(color) ? color : [];
            this.materialIndex = materialIndex !== undefined ? materialIndex : 0;
        }
        clone() {
            return new this.constructor().copy(this);
        }
        copy(source) {
            this.a = source.a;
            this.b = source.b;
            this.c = source.c;
            this.normal.copy(source.normal);
            this.color.copy(source.color);
            this.materialIndex = source.materialIndex;
            for (let i = 0, il = source.vertexNormals.length; i < il; i++) {
                this.vertexNormals[i] = source.vertexNormals[i].clone();
            }
            for (let i = 0, il = source.vertexColors.length; i < il; i++) {
                this.vertexColors[i] = source.vertexColors[i].clone();
            }
            return this;
        }
    }
    exports.Face3 = Face3;
});
//# sourceMappingURL=Face3.js.map