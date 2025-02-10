define(["require", "exports", "../../../build/three.module.js", "../postprocessing/Pass.js", "../shaders/HalftoneShader.js"], function (require, exports, three_module_js_1, Pass_js_1, HalftoneShader_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * RGB Halftone pass for three.js effects composer. Requires HalftoneShader.
     */
    var HalftonePass = function (width, height, params) {
        Pass_js_1.Pass.call(this);
        if (HalftoneShader_js_1.HalftoneShader === undefined) {
            console.error('THREE.HalftonePass requires HalftoneShader');
        }
        this.uniforms = three_module_js_1.UniformsUtils.clone(HalftoneShader_js_1.HalftoneShader.uniforms);
        this.material = new three_module_js_1.ShaderMaterial({
            uniforms: this.uniforms,
            fragmentShader: HalftoneShader_js_1.HalftoneShader.fragmentShader,
            vertexShader: HalftoneShader_js_1.HalftoneShader.vertexShader
        });
        // set params
        this.uniforms.width.value = width;
        this.uniforms.height.value = height;
        for (var key in params) {
            if (params.hasOwnProperty(key) && this.uniforms.hasOwnProperty(key)) {
                this.uniforms[key].value = params[key];
            }
        }
        this.fsQuad = new Pass_js_1.Pass.FullScreenQuad(this.material);
    };
    exports.HalftonePass = HalftonePass;
    HalftonePass.prototype = Object.assign(Object.create(Pass_js_1.Pass.prototype), {
        constructor: HalftonePass,
        render: function (renderer, writeBuffer, readBuffer /*, deltaTime, maskActive*/) {
            this.material.uniforms["tDiffuse"].value = readBuffer.texture;
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
        },
        setSize: function (width, height) {
            this.uniforms.width.value = width;
            this.uniforms.height.value = height;
        }
    });
});
//# sourceMappingURL=HalftonePass.js.map