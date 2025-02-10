define(["require", "exports", "./WebGLRenderer.js"], function (require, exports, WebGLRenderer_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function WebGL1Renderer(parameters) {
        WebGLRenderer_js_1.WebGLRenderer.call(this, parameters);
    }
    exports.WebGL1Renderer = WebGL1Renderer;
    WebGL1Renderer.prototype = Object.assign(Object.create(WebGLRenderer_js_1.WebGLRenderer.prototype), {
        constructor: WebGL1Renderer,
        isWebGL1Renderer: true
    });
});
//# sourceMappingURL=WebGL1Renderer.js.map