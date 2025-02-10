define(["require", "exports", "../KeyframeTrack.js"], function (require, exports, KeyframeTrack_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A Track of keyframe values that represent color.
     */
    function ColorKeyframeTrack(name, times, values, interpolation) {
        KeyframeTrack_js_1.KeyframeTrack.call(this, name, times, values, interpolation);
    }
    exports.ColorKeyframeTrack = ColorKeyframeTrack;
    ColorKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack_js_1.KeyframeTrack.prototype), {
        constructor: ColorKeyframeTrack,
        ValueTypeName: 'color'
        // ValueBufferType is inherited
        // DefaultInterpolation is inherited
        // Note: Very basic implementation and nothing special yet.
        // However, this is the place for color space parameterization.
    });
});
//# sourceMappingURL=ColorKeyframeTrack.js.map