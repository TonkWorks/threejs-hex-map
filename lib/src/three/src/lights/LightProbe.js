define(["require", "exports", "../math/SphericalHarmonics3.js", "./Light.js"], function (require, exports, SphericalHarmonics3_js_1, Light_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function LightProbe(sh, intensity) {
        Light_js_1.Light.call(this, undefined, intensity);
        this.type = 'LightProbe';
        this.sh = (sh !== undefined) ? sh : new SphericalHarmonics3_js_1.SphericalHarmonics3();
    }
    exports.LightProbe = LightProbe;
    LightProbe.prototype = Object.assign(Object.create(Light_js_1.Light.prototype), {
        constructor: LightProbe,
        isLightProbe: true,
        copy: function (source) {
            Light_js_1.Light.prototype.copy.call(this, source);
            this.sh.copy(source.sh);
            return this;
        },
        fromJSON: function (json) {
            this.intensity = json.intensity; // TODO: Move this bit to Light.fromJSON();
            this.sh.fromArray(json.sh);
            return this;
        },
        toJSON: function (meta) {
            const data = Light_js_1.Light.prototype.toJSON.call(this, meta);
            data.object.sh = this.sh.toArray();
            return data;
        }
    });
});
//# sourceMappingURL=LightProbe.js.map