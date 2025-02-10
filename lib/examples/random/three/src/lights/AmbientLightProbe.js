define(["require", "exports", "../math/Color.js", "./LightProbe.js"], function (require, exports, Color_js_1, LightProbe_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function AmbientLightProbe(color, intensity) {
        LightProbe_js_1.LightProbe.call(this, undefined, intensity);
        const color1 = new Color_js_1.Color().set(color);
        // without extra factor of PI in the shader, would be 2 / Math.sqrt( Math.PI );
        this.sh.coefficients[0].set(color1.r, color1.g, color1.b).multiplyScalar(2 * Math.sqrt(Math.PI));
    }
    exports.AmbientLightProbe = AmbientLightProbe;
    AmbientLightProbe.prototype = Object.assign(Object.create(LightProbe_js_1.LightProbe.prototype), {
        constructor: AmbientLightProbe,
        isAmbientLightProbe: true,
        copy: function (source) {
            LightProbe_js_1.LightProbe.prototype.copy.call(this, source);
            return this;
        },
        toJSON: function (meta) {
            const data = LightProbe_js_1.LightProbe.prototype.toJSON.call(this, meta);
            // data.sh = this.sh.toArray(); // todo
            return data;
        }
    });
});
//# sourceMappingURL=AmbientLightProbe.js.map