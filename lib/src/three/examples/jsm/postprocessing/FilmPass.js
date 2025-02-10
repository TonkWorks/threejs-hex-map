define(["require", "exports", "../../../build/three.module.js", "../postprocessing/Pass.js", "../shaders/FilmShader.js"], function (require, exports, three_module_js_1, Pass_js_1, FilmShader_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FilmPass = function (noiseIntensity, scanlinesIntensity, scanlinesCount, grayscale) {
        Pass_js_1.Pass.call(this);
        if (FilmShader_js_1.FilmShader === undefined)
            console.error("FilmPass relies on FilmShader");
        var shader = FilmShader_js_1.FilmShader;
        this.uniforms = three_module_js_1.UniformsUtils.clone(shader.uniforms);
        this.material = new three_module_js_1.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader
        });
        if (grayscale !== undefined)
            this.uniforms.grayscale.value = grayscale;
        if (noiseIntensity !== undefined)
            this.uniforms.nIntensity.value = noiseIntensity;
        if (scanlinesIntensity !== undefined)
            this.uniforms.sIntensity.value = scanlinesIntensity;
        if (scanlinesCount !== undefined)
            this.uniforms.sCount.value = scanlinesCount;
        this.fsQuad = new Pass_js_1.Pass.FullScreenQuad(this.material);
    };
    exports.FilmPass = FilmPass;
    FilmPass.prototype = Object.assign(Object.create(Pass_js_1.Pass.prototype), {
        constructor: FilmPass,
        render: function (renderer, writeBuffer, readBuffer, deltaTime /*, maskActive */) {
            this.uniforms["tDiffuse"].value = readBuffer.texture;
            this.uniforms["time"].value += deltaTime;
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
//# sourceMappingURL=FilmPass.js.map