define(["require", "exports", "../../../build/three.module.js", "../postprocessing/Pass.js", "../shaders/CopyShader.js"], function (require, exports, three_module_js_1, Pass_js_1, CopyShader_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TexturePass = function (map, opacity) {
        Pass_js_1.Pass.call(this);
        if (CopyShader_js_1.CopyShader === undefined)
            console.error("TexturePass relies on CopyShader");
        var shader = CopyShader_js_1.CopyShader;
        this.map = map;
        this.opacity = (opacity !== undefined) ? opacity : 1.0;
        this.uniforms = three_module_js_1.UniformsUtils.clone(shader.uniforms);
        this.material = new three_module_js_1.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader,
            depthTest: false,
            depthWrite: false
        });
        this.needsSwap = false;
        this.fsQuad = new Pass_js_1.Pass.FullScreenQuad(null);
    };
    exports.TexturePass = TexturePass;
    TexturePass.prototype = Object.assign(Object.create(Pass_js_1.Pass.prototype), {
        constructor: TexturePass,
        render: function (renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */) {
            var oldAutoClear = renderer.autoClear;
            renderer.autoClear = false;
            this.fsQuad.material = this.material;
            this.uniforms["opacity"].value = this.opacity;
            this.uniforms["tDiffuse"].value = this.map;
            this.material.transparent = (this.opacity < 1.0);
            renderer.setRenderTarget(this.renderToScreen ? null : readBuffer);
            if (this.clear)
                renderer.clear();
            this.fsQuad.render(renderer);
            renderer.autoClear = oldAutoClear;
        }
    });
});
//# sourceMappingURL=TexturePass.js.map