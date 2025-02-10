define(["require", "exports", "../../constants.js", "../KeyframeTrack.js"], function (require, exports, constants_js_1, KeyframeTrack_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A Track that interpolates Strings
     */
    function StringKeyframeTrack(name, times, values, interpolation) {
        KeyframeTrack_js_1.KeyframeTrack.call(this, name, times, values, interpolation);
    }
    exports.StringKeyframeTrack = StringKeyframeTrack;
    StringKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack_js_1.KeyframeTrack.prototype), {
        constructor: StringKeyframeTrack,
        ValueTypeName: 'string',
        ValueBufferType: Array,
        DefaultInterpolation: constants_js_1.InterpolateDiscrete,
        InterpolantFactoryMethodLinear: undefined,
        InterpolantFactoryMethodSmooth: undefined
    });
});
//# sourceMappingURL=StringKeyframeTrack.js.map