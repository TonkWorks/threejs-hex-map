define(["require", "exports", "../KeyframeTrack.js"], function (require, exports, KeyframeTrack_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A Track of vectored keyframe values.
     */
    function VectorKeyframeTrack(name, times, values, interpolation) {
        KeyframeTrack_js_1.KeyframeTrack.call(this, name, times, values, interpolation);
    }
    exports.VectorKeyframeTrack = VectorKeyframeTrack;
    VectorKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack_js_1.KeyframeTrack.prototype), {
        constructor: VectorKeyframeTrack,
        ValueTypeName: 'vector'
        // ValueBufferType is inherited
        // DefaultInterpolation is inherited
    });
});
//# sourceMappingURL=VectorKeyframeTrack.js.map