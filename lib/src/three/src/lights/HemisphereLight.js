define(["require", "exports", "./Light.js", "../math/Color.js", "../core/Object3D.js"], function (require, exports, Light_js_1, Color_js_1, Object3D_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function HemisphereLight(skyColor, groundColor, intensity) {
        Light_js_1.Light.call(this, skyColor, intensity);
        this.type = 'HemisphereLight';
        this.position.copy(Object3D_js_1.Object3D.DefaultUp);
        this.updateMatrix();
        this.groundColor = new Color_js_1.Color(groundColor);
    }
    exports.HemisphereLight = HemisphereLight;
    HemisphereLight.prototype = Object.assign(Object.create(Light_js_1.Light.prototype), {
        constructor: HemisphereLight,
        isHemisphereLight: true,
        copy: function (source) {
            Light_js_1.Light.prototype.copy.call(this, source);
            this.groundColor.copy(source.groundColor);
            return this;
        }
    });
});
//# sourceMappingURL=HemisphereLight.js.map