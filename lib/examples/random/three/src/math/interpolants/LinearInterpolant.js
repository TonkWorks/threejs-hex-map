define(["require", "exports", "../Interpolant.js"], function (require, exports, Interpolant_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function LinearInterpolant(parameterPositions, sampleValues, sampleSize, resultBuffer) {
        Interpolant_js_1.Interpolant.call(this, parameterPositions, sampleValues, sampleSize, resultBuffer);
    }
    exports.LinearInterpolant = LinearInterpolant;
    LinearInterpolant.prototype = Object.assign(Object.create(Interpolant_js_1.Interpolant.prototype), {
        constructor: LinearInterpolant,
        interpolate_: function (i1, t0, t, t1) {
            const result = this.resultBuffer, values = this.sampleValues, stride = this.valueSize, offset1 = i1 * stride, offset0 = offset1 - stride, weight1 = (t - t0) / (t1 - t0), weight0 = 1 - weight1;
            for (let i = 0; i !== stride; ++i) {
                result[i] =
                    values[offset0 + i] * weight0 +
                        values[offset1 + i] * weight1;
            }
            return result;
        }
    });
});
//# sourceMappingURL=LinearInterpolant.js.map