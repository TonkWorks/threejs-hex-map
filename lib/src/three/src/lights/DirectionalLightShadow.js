define(["require", "exports", "./LightShadow.js", "../cameras/OrthographicCamera.js"], function (require, exports, LightShadow_js_1, OrthographicCamera_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function DirectionalLightShadow() {
        LightShadow_js_1.LightShadow.call(this, new OrthographicCamera_js_1.OrthographicCamera(-5, 5, 5, -5, 0.5, 500));
    }
    exports.DirectionalLightShadow = DirectionalLightShadow;
    DirectionalLightShadow.prototype = Object.assign(Object.create(LightShadow_js_1.LightShadow.prototype), {
        constructor: DirectionalLightShadow,
        isDirectionalLightShadow: true,
        updateMatrices: function (light) {
            LightShadow_js_1.LightShadow.prototype.updateMatrices.call(this, light);
        }
    });
});
//# sourceMappingURL=DirectionalLightShadow.js.map