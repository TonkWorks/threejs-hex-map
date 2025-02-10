define(["require", "exports", "../../../build/three.module.js", "../postprocessing/Pass.js", "../shaders/CopyShader.js", "../shaders/ConvolutionShader.js"], function (require, exports, three_module_js_1, Pass_js_1, CopyShader_js_1, ConvolutionShader_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BloomPass = function (strength, kernelSize, sigma, resolution) {
        Pass_js_1.Pass.call(this);
        strength = (strength !== undefined) ? strength : 1;
        kernelSize = (kernelSize !== undefined) ? kernelSize : 25;
        sigma = (sigma !== undefined) ? sigma : 4.0;
        resolution = (resolution !== undefined) ? resolution : 256;
        // render targets
        var pars = { minFilter: three_module_js_1.LinearFilter, magFilter: three_module_js_1.LinearFilter, format: three_module_js_1.RGBAFormat };
        this.renderTargetX = new three_module_js_1.WebGLRenderTarget(resolution, resolution, pars);
        this.renderTargetX.texture.name = "BloomPass.x";
        this.renderTargetY = new three_module_js_1.WebGLRenderTarget(resolution, resolution, pars);
        this.renderTargetY.texture.name = "BloomPass.y";
        // copy material
        if (CopyShader_js_1.CopyShader === undefined)
            console.error("BloomPass relies on CopyShader");
        var copyShader = CopyShader_js_1.CopyShader;
        this.copyUniforms = three_module_js_1.UniformsUtils.clone(copyShader.uniforms);
        this.copyUniforms["opacity"].value = strength;
        this.materialCopy = new three_module_js_1.ShaderMaterial({
            uniforms: this.copyUniforms,
            vertexShader: copyShader.vertexShader,
            fragmentShader: copyShader.fragmentShader,
            blending: three_module_js_1.AdditiveBlending,
            transparent: true
        });
        // convolution material
        if (ConvolutionShader_js_1.ConvolutionShader === undefined)
            console.error("BloomPass relies on ConvolutionShader");
        var convolutionShader = ConvolutionShader_js_1.ConvolutionShader;
        this.convolutionUniforms = three_module_js_1.UniformsUtils.clone(convolutionShader.uniforms);
        this.convolutionUniforms["uImageIncrement"].value = BloomPass.blurX;
        this.convolutionUniforms["cKernel"].value = ConvolutionShader_js_1.ConvolutionShader.buildKernel(sigma);
        this.materialConvolution = new three_module_js_1.ShaderMaterial({
            uniforms: this.convolutionUniforms,
            vertexShader: convolutionShader.vertexShader,
            fragmentShader: convolutionShader.fragmentShader,
            defines: {
                "KERNEL_SIZE_FLOAT": kernelSize.toFixed(1),
                "KERNEL_SIZE_INT": kernelSize.toFixed(0)
            }
        });
        this.needsSwap = false;
        this.fsQuad = new Pass_js_1.Pass.FullScreenQuad(null);
    };
    exports.BloomPass = BloomPass;
    BloomPass.prototype = Object.assign(Object.create(Pass_js_1.Pass.prototype), {
        constructor: BloomPass,
        render: function (renderer, writeBuffer, readBuffer, deltaTime, maskActive) {
            if (maskActive)
                renderer.state.buffers.stencil.setTest(false);
            // Render quad with blured scene into texture (convolution pass 1)
            this.fsQuad.material = this.materialConvolution;
            this.convolutionUniforms["tDiffuse"].value = readBuffer.texture;
            this.convolutionUniforms["uImageIncrement"].value = BloomPass.blurX;
            renderer.setRenderTarget(this.renderTargetX);
            renderer.clear();
            this.fsQuad.render(renderer);
            // Render quad with blured scene into texture (convolution pass 2)
            this.convolutionUniforms["tDiffuse"].value = this.renderTargetX.texture;
            this.convolutionUniforms["uImageIncrement"].value = BloomPass.blurY;
            renderer.setRenderTarget(this.renderTargetY);
            renderer.clear();
            this.fsQuad.render(renderer);
            // Render original scene with superimposed blur to texture
            this.fsQuad.material = this.materialCopy;
            this.copyUniforms["tDiffuse"].value = this.renderTargetY.texture;
            if (maskActive)
                renderer.state.buffers.stencil.setTest(true);
            renderer.setRenderTarget(readBuffer);
            if (this.clear)
                renderer.clear();
            this.fsQuad.render(renderer);
        }
    });
    BloomPass.blurX = new three_module_js_1.Vector2(0.001953125, 0.0);
    BloomPass.blurY = new three_module_js_1.Vector2(0.0, 0.001953125);
});
//# sourceMappingURL=BloomPass.js.map