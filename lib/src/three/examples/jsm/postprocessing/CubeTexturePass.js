define(["require", "exports", "../../../build/three.module.js", "../postprocessing/Pass.js"], function (require, exports, three_module_js_1, Pass_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CubeTexturePass = function (camera, envMap, opacity) {
        Pass_js_1.Pass.call(this);
        this.camera = camera;
        this.needsSwap = false;
        this.cubeShader = three_module_js_1.ShaderLib['cube'];
        this.cubeMesh = new three_module_js_1.Mesh(new three_module_js_1.BoxBufferGeometry(10, 10, 10), new three_module_js_1.ShaderMaterial({
            uniforms: this.cubeShader.uniforms,
            vertexShader: this.cubeShader.vertexShader,
            fragmentShader: this.cubeShader.fragmentShader,
            depthTest: false,
            depthWrite: false,
            side: three_module_js_1.BackSide
        }));
        Object.defineProperty(this.cubeMesh.material, 'envMap', {
            get: function () {
                return this.uniforms.envMap.value;
            }
        });
        this.envMap = envMap;
        this.opacity = (opacity !== undefined) ? opacity : 1.0;
        this.cubeScene = new three_module_js_1.Scene();
        this.cubeCamera = new three_module_js_1.PerspectiveCamera();
        this.cubeScene.add(this.cubeMesh);
    };
    exports.CubeTexturePass = CubeTexturePass;
    CubeTexturePass.prototype = Object.assign(Object.create(Pass_js_1.Pass.prototype), {
        constructor: CubeTexturePass,
        render: function (renderer, writeBuffer, readBuffer /*, deltaTime, maskActive*/) {
            var oldAutoClear = renderer.autoClear;
            renderer.autoClear = false;
            this.cubeCamera.projectionMatrix.copy(this.camera.projectionMatrix);
            this.cubeCamera.quaternion.setFromRotationMatrix(this.camera.matrixWorld);
            this.cubeMesh.material.uniforms.envMap.value = this.envMap;
            this.cubeMesh.material.uniforms.opacity.value = this.opacity;
            this.cubeMesh.material.transparent = (this.opacity < 1.0);
            renderer.setRenderTarget(this.renderToScreen ? null : readBuffer);
            if (this.clear)
                renderer.clear();
            renderer.render(this.cubeScene, this.cubeCamera);
            renderer.autoClear = oldAutoClear;
        }
    });
});
//# sourceMappingURL=CubeTexturePass.js.map