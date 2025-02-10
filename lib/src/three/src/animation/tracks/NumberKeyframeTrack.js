define(["require", "exports", "../KeyframeTrack.js"], function (require, exports, KeyframeTrack_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A Track of numeric keyframe values.
     */
    function NumberKeyframeTrack(name, times, values, interpolation) {
        KeyframeTrack_js_1.KeyframeTrack.call(this, name, times, values, interpolation);
    }
    exports.NumberKeyframeTrack = NumberKeyframeTrack;
    NumberKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack_js_1.KeyframeTrack.prototype), {
        constructor: NumberKeyframeTrack,
        ValueTypeName: 'number'
        // ValueBufferType is inherited
        // DefaultInterpolation is inherited
    });
});
//# sourceMappingURL=NumberKeyframeTrack.js.map