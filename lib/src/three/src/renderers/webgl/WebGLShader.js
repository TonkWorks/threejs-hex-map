define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function WebGLShader(gl, type, string) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, string);
        gl.compileShader(shader);
        return shader;
    }
    exports.WebGLShader = WebGLShader;
});
//# sourceMappingURL=WebGLShader.js.map