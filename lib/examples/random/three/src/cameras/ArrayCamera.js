define(["require", "exports", "./PerspectiveCamera.js"], function (require, exports, PerspectiveCamera_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ArrayCamera(array) {
        PerspectiveCamera_js_1.PerspectiveCamera.call(this);
        this.cameras = array || [];
    }
    exports.ArrayCamera = ArrayCamera;
    ArrayCamera.prototype = Object.assign(Object.create(PerspectiveCamera_js_1.PerspectiveCamera.prototype), {
        constructor: ArrayCamera,
        isArrayCamera: true
    });
});
//# sourceMappingURL=ArrayCamera.js.map