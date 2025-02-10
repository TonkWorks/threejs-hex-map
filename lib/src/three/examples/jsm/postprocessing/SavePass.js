define(["require", "exports", "../../../build/three.module.js", "../postprocessing/Pass.js", "../shaders/CopyShader.js"], function (require, exports, three_module_js_1, Pass_js_1, CopyShader_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SavePass = function (renderTarget) {
        Pass_js_1.Pass.call(this);
        if (CopyShader_js_1.CopyShader === undefined)
            console.error("SavePass relies on CopyShader");
        var shader = CopyShader_js_1.CopyShader;
        this.textureID = "tDiffuse";
        this.uniforms = three_module_js_1.UniformsUtils.clone(shader.uniforms);
        this.material = new three_module_js_1.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader
        });
        this.renderTarget = renderTarget;
        if (this.renderTarget === undefined) {
            this.renderTarget = new three_module_js_1.WebGLRenderTarget(window.innerWidth, window.innerHeight, { minFilter: three_module_js_1.LinearFilter, magFilter: three_module_js_1.LinearFilter, format: three_module_js_1.RGBFormat });
            this.renderTarget.texture.name = "SavePass.rt";
        }
        this.needsSwap = false;
        this.fsQuad = new Pass_js_1.Pass.FullScreenQuad(this.material);
    };
    exports.SavePass = SavePass;
    SavePass.prototype = Object.assign(Object.create(Pass_js_1.Pass.prototype), {
        constructor: SavePass,
        render: function (renderer, writeBuffer, readBuffer) {
            if (this.uniforms[this.textureID]) {
                this.uniforms[this.textureID].value = readBuffer.texture;
            }
            renderer.setRenderTarget(this.renderTarget);
            if (this.clear)
                renderer.clear();
            this.fsQuad.render(renderer);
        }
    });
});
//# sourceMappingURL=SavePass.js.map