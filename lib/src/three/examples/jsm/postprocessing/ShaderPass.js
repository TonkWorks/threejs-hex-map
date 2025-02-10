define(["require", "exports", "../../../build/three.module.js", "../postprocessing/Pass.js"], function (require, exports, three_module_js_1, Pass_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ShaderPass = function (shader, textureID) {
        Pass_js_1.Pass.call(this);
        this.textureID = (textureID !== undefined) ? textureID : "tDiffuse";
        if (shader instanceof three_module_js_1.ShaderMaterial) {
            this.uniforms = shader.uniforms;
            this.material = shader;
        }
        else if (shader) {
            this.uniforms = three_module_js_1.UniformsUtils.clone(shader.uniforms);
            this.material = new three_module_js_1.ShaderMaterial({
                defines: Object.assign({}, shader.defines),
                uniforms: this.uniforms,
                vertexShader: shader.vertexShader,
                fragmentShader: shader.fragmentShader
            });
        }
        this.fsQuad = new Pass_js_1.Pass.FullScreenQuad(this.material);
    };
    exports.ShaderPass = ShaderPass;
    ShaderPass.prototype = Object.assign(Object.create(Pass_js_1.Pass.prototype), {
        constructor: ShaderPass,
        render: function (renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */) {
            if (this.uniforms[this.textureID]) {
                this.uniforms[this.textureID].value = readBuffer.texture;
            }
            this.fsQuad.material = this.material;
            if (this.renderToScreen) {
                renderer.setRenderTarget(null);
                this.fsQuad.render(renderer);
            }
            else {
                renderer.setRenderTarget(writeBuffer);
                // TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
                if (this.clear)
                    renderer.clear(renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil);
                this.fsQuad.render(renderer);
            }
        }
    });
});
//# sourceMappingURL=ShaderPass.js.map