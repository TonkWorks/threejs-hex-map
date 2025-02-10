define(["require", "exports", "../../../build/three.module.js", "../postprocessing/Pass.js", "../shaders/AfterimageShader.js"], function (require, exports, three_module_js_1, Pass_js_1, AfterimageShader_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AfterimagePass = function (damp) {
        Pass_js_1.Pass.call(this);
        if (AfterimageShader_js_1.AfterimageShader === undefined)
            console.error("AfterimagePass relies on AfterimageShader");
        this.shader = AfterimageShader_js_1.AfterimageShader;
        this.uniforms = three_module_js_1.UniformsUtils.clone(this.shader.uniforms);
        this.uniforms["damp"].value = damp !== undefined ? damp : 0.96;
        this.textureComp = new three_module_js_1.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
            minFilter: three_module_js_1.LinearFilter,
            magFilter: three_module_js_1.NearestFilter,
            format: three_module_js_1.RGBAFormat
        });
        this.textureOld = new three_module_js_1.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
            minFilter: three_module_js_1.LinearFilter,
            magFilter: three_module_js_1.NearestFilter,
            format: three_module_js_1.RGBAFormat
        });
        this.shaderMaterial = new three_module_js_1.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.shader.vertexShader,
            fragmentShader: this.shader.fragmentShader
        });
        this.compFsQuad = new Pass_js_1.Pass.FullScreenQuad(this.shaderMaterial);
        var material = new three_module_js_1.MeshBasicMaterial();
        this.copyFsQuad = new Pass_js_1.Pass.FullScreenQuad(material);
    };
    exports.AfterimagePass = AfterimagePass;
    AfterimagePass.prototype = Object.assign(Object.create(Pass_js_1.Pass.prototype), {
        constructor: AfterimagePass,
        render: function (renderer, writeBuffer, readBuffer) {
            this.uniforms["tOld"].value = this.textureOld.texture;
            this.uniforms["tNew"].value = readBuffer.texture;
            renderer.setRenderTarget(this.textureComp);
            this.compFsQuad.render(renderer);
            this.copyFsQuad.material.map = this.textureComp.texture;
            if (this.renderToScreen) {
                renderer.setRenderTarget(null);
                this.copyFsQuad.render(renderer);
            }
            else {
                renderer.setRenderTarget(writeBuffer);
                if (this.clear)
                    renderer.clear();
                this.copyFsQuad.render(renderer);
            }
            // Swap buffers.
            var temp = this.textureOld;
            this.textureOld = this.textureComp;
            this.textureComp = temp;
            // Now textureOld contains the latest image, ready for the next frame.
        },
        setSize: function (width, height) {
            this.textureComp.setSize(width, height);
            this.textureOld.setSize(width, height);
        }
    });
});
//# sourceMappingURL=AfterimagePass.js.map