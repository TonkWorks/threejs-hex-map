define(["require", "exports", "../math/Color.js"], function (require, exports, Color_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Fog {
        constructor(color, near, far) {
            Object.defineProperty(this, 'isFog', { value: true });
            this.name = '';
            this.color = new Color_js_1.Color(color);
            this.near = (near !== undefined) ? near : 1;
            this.far = (far !== undefined) ? far : 1000;
        }
        clone() {
            return new Fog(this.color, this.near, this.far);
        }
        toJSON( /* meta */) {
            return {
                type: 'Fog',
                color: this.color.getHex(),
                near: this.near,
                far: this.far
            };
        }
    }
    exports.Fog = Fog;
});
//# sourceMappingURL=Fog.js.map