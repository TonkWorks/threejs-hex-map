define(["require", "exports", "../../constants.js", "../KeyframeTrack.js"], function (require, exports, constants_js_1, KeyframeTrack_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A Track of Boolean keyframe values.
     */
    function BooleanKeyframeTrack(name, times, values) {
        KeyframeTrack_js_1.KeyframeTrack.call(this, name, times, values);
    }
    exports.BooleanKeyframeTrack = BooleanKeyframeTrack;
    BooleanKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack_js_1.KeyframeTrack.prototype), {
        constructor: BooleanKeyframeTrack,
        ValueTypeName: 'bool',
        ValueBufferType: Array,
        DefaultInterpolation: constants_js_1.InterpolateDiscrete,
        InterpolantFactoryMethodLinear: undefined,
        InterpolantFactoryMethodSmooth: undefined
        // Note: Actually this track could have a optimized / compressed
        // representation of a single value and a custom interpolant that
        // computes "firstValue ^ isOdd( index )".
    });
});
//# sourceMappingURL=BooleanKeyframeTrack.js.map