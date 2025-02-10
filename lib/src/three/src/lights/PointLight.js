define(["require", "exports", "./Light.js", "./PointLightShadow.js"], function (require, exports, Light_js_1, PointLightShadow_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function PointLight(color, intensity, distance, decay) {
        Light_js_1.Light.call(this, color, intensity);
        this.type = 'PointLight';
        Object.defineProperty(this, 'power', {
            get: function () {
                // intensity = power per solid angle.
                // ref: equation (15) from https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
                return this.intensity * 4 * Math.PI;
            },
            set: function (power) {
                // intensity = power per solid angle.
                // ref: equation (15) from https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
                this.intensity = power / (4 * Math.PI);
            }
        });
        this.distance = (distance !== undefined) ? distance : 0;
        this.decay = (decay !== undefined) ? decay : 1; // for physically correct lights, should be 2.
        this.shadow = new PointLightShadow_js_1.PointLightShadow();
    }
    exports.PointLight = PointLight;
    PointLight.prototype = Object.assign(Object.create(Light_js_1.Light.prototype), {
        constructor: PointLight,
        isPointLight: true,
        copy: function (source) {
            Light_js_1.Light.prototype.copy.call(this, source);
            this.distance = source.distance;
            this.decay = source.decay;
            this.shadow = source.shadow.clone();
            return this;
        }
    });
});
//# sourceMappingURL=PointLight.js.map