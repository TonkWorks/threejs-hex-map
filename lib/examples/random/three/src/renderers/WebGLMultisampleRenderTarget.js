define(["require", "exports", "./WebGLRenderTarget.js"], function (require, exports, WebGLRenderTarget_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function WebGLMultisampleRenderTarget(width, height, options) {
        WebGLRenderTarget_js_1.WebGLRenderTarget.call(this, width, height, options);
        this.samples = 4;
    }
    exports.WebGLMultisampleRenderTarget = WebGLMultisampleRenderTarget;
    WebGLMultisampleRenderTarget.prototype = Object.assign(Object.create(WebGLRenderTarget_js_1.WebGLRenderTarget.prototype), {
        constructor: WebGLMultisampleRenderTarget,
        isWebGLMultisampleRenderTarget: true,
        copy: function (source) {
            WebGLRenderTarget_js_1.WebGLRenderTarget.prototype.copy.call(this, source);
            this.samples = source.samples;
            return this;
        }
    });
});
//# sourceMappingURL=WebGLMultisampleRenderTarget.js.map