define(["require", "exports", "./Light.js", "./DirectionalLightShadow.js", "../core/Object3D.js"], function (require, exports, Light_js_1, DirectionalLightShadow_js_1, Object3D_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function DirectionalLight(color, intensity) {
        Light_js_1.Light.call(this, color, intensity);
        this.type = 'DirectionalLight';
        this.position.copy(Object3D_js_1.Object3D.DefaultUp);
        this.updateMatrix();
        this.target = new Object3D_js_1.Object3D();
        this.shadow = new DirectionalLightShadow_js_1.DirectionalLightShadow();
    }
    exports.DirectionalLight = DirectionalLight;
    DirectionalLight.prototype = Object.assign(Object.create(Light_js_1.Light.prototype), {
        constructor: DirectionalLight,
        isDirectionalLight: true,
        copy: function (source) {
            Light_js_1.Light.prototype.copy.call(this, source);
            this.target = source.target.clone();
            this.shadow = source.shadow.clone();
            return this;
        }
    });
});
//# sourceMappingURL=DirectionalLight.js.map