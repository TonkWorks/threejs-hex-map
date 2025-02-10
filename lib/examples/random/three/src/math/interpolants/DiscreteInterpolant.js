define(["require", "exports", "../Interpolant.js"], function (require, exports, Interpolant_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     *
     * Interpolant that evaluates to the sample value at the position preceeding
     * the parameter.
     */
    function DiscreteInterpolant(parameterPositions, sampleValues, sampleSize, resultBuffer) {
        Interpolant_js_1.Interpolant.call(this, parameterPositions, sampleValues, sampleSize, resultBuffer);
    }
    exports.DiscreteInterpolant = DiscreteInterpolant;
    DiscreteInterpolant.prototype = Object.assign(Object.create(Interpolant_js_1.Interpolant.prototype), {
        constructor: DiscreteInterpolant,
        interpolate_: function (i1 /*, t0, t, t1 */) {
            return this.copySampleValue_(i1 - 1);
        }
    });
});
//# sourceMappingURL=DiscreteInterpolant.js.map