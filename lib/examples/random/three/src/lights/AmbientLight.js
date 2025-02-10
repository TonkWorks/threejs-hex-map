define(["require", "exports", "./Light.js"], function (require, exports, Light_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function AmbientLight(color, intensity) {
        Light_js_1.Light.call(this, color, intensity);
        this.type = 'AmbientLight';
    }
    exports.AmbientLight = AmbientLight;
    AmbientLight.prototype = Object.assign(Object.create(Light_js_1.Light.prototype), {
        constructor: AmbientLight,
        isAmbientLight: true
    });
});
//# sourceMappingURL=AmbientLight.js.map