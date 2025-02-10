define(["require", "exports", "../../../build/three.module.js", "../postprocessing/Pass.js", "../shaders/DotScreenShader.js"], function (require, exports, three_module_js_1, Pass_js_1, DotScreenShader_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DotScreenPass = function (center, angle, scale) {
        Pass_js_1.Pass.call(this);
        if (DotScreenShader_js_1.DotScreenShader === undefined)
            console.error("DotScreenPass relies on DotScreenShader");
        var shader = DotScreenShader_js_1.DotScreenShader;
        this.uniforms = three_module_js_1.UniformsUtils.clone(shader.uniforms);
        if (center !== undefined)
            this.uniforms["center"].value.copy(center);
        if (angle !== undefined)
            this.uniforms["angle"].value = angle;
        if (scale !== undefined)
            this.uniforms["scale"].value = scale;
        this.material = new three_module_js_1.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader
        });
        this.fsQuad = new Pass_js_1.Pass.FullScreenQuad(this.material);
    };
    exports.DotScreenPass = DotScreenPass;
    DotScreenPass.prototype = Object.assign(Object.create(Pass_js_1.Pass.prototype), {
        constructor: DotScreenPass,
        render: function (renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */) {
            this.uniforms["tDiffuse"].value = readBuffer.texture;
            this.uniforms["tSize"].value.set(readBuffer.width, readBuffer.height);
            if (this.renderToScreen) {
                renderer.setRenderTarget(null);
                this.fsQuad.render(renderer);
            }
            else {
                renderer.setRenderTarget(writeBuffer);
                if (this.clear)
                    renderer.clear();
                this.fsQuad.render(renderer);
            }
        }
    });
});
//# sourceMappingURL=DotScreenPass.js.map