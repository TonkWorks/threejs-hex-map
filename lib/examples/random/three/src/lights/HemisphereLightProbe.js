define(["require", "exports", "../math/Color.js", "../math/Vector3.js", "./LightProbe.js"], function (require, exports, Color_js_1, Vector3_js_1, LightProbe_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function HemisphereLightProbe(skyColor, groundColor, intensity) {
        LightProbe_js_1.LightProbe.call(this, undefined, intensity);
        const color1 = new Color_js_1.Color().set(skyColor);
        const color2 = new Color_js_1.Color().set(groundColor);
        const sky = new Vector3_js_1.Vector3(color1.r, color1.g, color1.b);
        const ground = new Vector3_js_1.Vector3(color2.r, color2.g, color2.b);
        // without extra factor of PI in the shader, should = 1 / Math.sqrt( Math.PI );
        const c0 = Math.sqrt(Math.PI);
        const c1 = c0 * Math.sqrt(0.75);
        this.sh.coefficients[0].copy(sky).add(ground).multiplyScalar(c0);
        this.sh.coefficients[1].copy(sky).sub(ground).multiplyScalar(c1);
    }
    exports.HemisphereLightProbe = HemisphereLightProbe;
    HemisphereLightProbe.prototype = Object.assign(Object.create(LightProbe_js_1.LightProbe.prototype), {
        constructor: HemisphereLightProbe,
        isHemisphereLightProbe: true,
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
//# sourceMappingURL=HemisphereLightProbe.js.map