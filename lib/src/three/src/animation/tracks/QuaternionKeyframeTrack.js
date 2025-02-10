define(["require", "exports", "../../constants.js", "../KeyframeTrack.js", "../../math/interpolants/QuaternionLinearInterpolant.js"], function (require, exports, constants_js_1, KeyframeTrack_js_1, QuaternionLinearInterpolant_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A Track of quaternion keyframe values.
     */
    function QuaternionKeyframeTrack(name, times, values, interpolation) {
        KeyframeTrack_js_1.KeyframeTrack.call(this, name, times, values, interpolation);
    }
    exports.QuaternionKeyframeTrack = QuaternionKeyframeTrack;
    QuaternionKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack_js_1.KeyframeTrack.prototype), {
        constructor: QuaternionKeyframeTrack,
        ValueTypeName: 'quaternion',
        // ValueBufferType is inherited
        DefaultInterpolation: constants_js_1.InterpolateLinear,
        InterpolantFactoryMethodLinear: function (result) {
            return new QuaternionLinearInterpolant_js_1.QuaternionLinearInterpolant(this.times, this.values, this.getValueSize(), result);
        },
        InterpolantFactoryMethodSmooth: undefined // not yet implemented
    });
});
//# sourceMappingURL=QuaternionKeyframeTrack.js.map