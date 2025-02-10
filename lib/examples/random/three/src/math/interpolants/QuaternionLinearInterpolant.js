define(["require", "exports", "../Interpolant.js", "../Quaternion.js"], function (require, exports, Interpolant_js_1, Quaternion_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Spherical linear unit quaternion interpolant.
     */
    function QuaternionLinearInterpolant(parameterPositions, sampleValues, sampleSize, resultBuffer) {
        Interpolant_js_1.Interpolant.call(this, parameterPositions, sampleValues, sampleSize, resultBuffer);
    }
    exports.QuaternionLinearInterpolant = QuaternionLinearInterpolant;
    QuaternionLinearInterpolant.prototype = Object.assign(Object.create(Interpolant_js_1.Interpolant.prototype), {
        constructor: QuaternionLinearInterpolant,
        interpolate_: function (i1, t0, t, t1) {
            const result = this.resultBuffer, values = this.sampleValues, stride = this.valueSize, alpha = (t - t0) / (t1 - t0);
            let offset = i1 * stride;
            for (let end = offset + stride; offset !== end; offset += 4) {
                Quaternion_js_1.Quaternion.slerpFlat(result, 0, values, offset - stride, values, offset, alpha);
            }
            return result;
        }
    });
});
//# sourceMappingURL=QuaternionLinearInterpolant.js.map