define(["require", "exports", "./LightShadow.js", "../math/MathUtils.js", "../cameras/PerspectiveCamera.js"], function (require, exports, LightShadow_js_1, MathUtils_js_1, PerspectiveCamera_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function SpotLightShadow() {
        LightShadow_js_1.LightShadow.call(this, new PerspectiveCamera_js_1.PerspectiveCamera(50, 1, 0.5, 500));
        this.focus = 1;
    }
    exports.SpotLightShadow = SpotLightShadow;
    SpotLightShadow.prototype = Object.assign(Object.create(LightShadow_js_1.LightShadow.prototype), {
        constructor: SpotLightShadow,
        isSpotLightShadow: true,
        updateMatrices: function (light) {
            const camera = this.camera;
            const fov = MathUtils_js_1.MathUtils.RAD2DEG * 2 * light.angle * this.focus;
            const aspect = this.mapSize.width / this.mapSize.height;
            const far = light.distance || camera.far;
            if (fov !== camera.fov || aspect !== camera.aspect || far !== camera.far) {
                camera.fov = fov;
                camera.aspect = aspect;
                camera.far = far;
                camera.updateProjectionMatrix();
            }
            LightShadow_js_1.LightShadow.prototype.updateMatrices.call(this, light);
        }
    });
});
//# sourceMappingURL=SpotLightShadow.js.map