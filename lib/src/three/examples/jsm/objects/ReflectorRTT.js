define(["require", "exports", "../objects/Reflector.js"], function (require, exports, Reflector_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ReflectorRTT = function (geometry, options) {
        Reflector_js_1.Reflector.call(this, geometry, options);
        this.geometry.setDrawRange(0, 0); // avoid rendering geometry
    };
    exports.ReflectorRTT = ReflectorRTT;
    ReflectorRTT.prototype = Object.create(Reflector_js_1.Reflector.prototype);
});
//# sourceMappingURL=ReflectorRTT.js.map