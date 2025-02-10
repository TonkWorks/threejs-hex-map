define(["require", "exports", "../../../build/three.module.js", "../postprocessing/Pass.js", "../math/SimplexNoise.js", "../shaders/SSAOShader.js", "../shaders/SSAOShader.js", "../shaders/SSAOShader.js", "../shaders/CopyShader.js"], function (require, exports, three_module_js_1, Pass_js_1, SimplexNoise_js_1, SSAOShader_js_1, SSAOShader_js_2, SSAOShader_js_3, CopyShader_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SSAOPass = function (scene, camera, width, height) {
        Pass_js_1.Pass.call(this);
        this.width = (width !== undefined) ? width : 512;
        this.height = (height !== undefined) ? height : 512;
        this.clear = true;
        this.camera = camera;
        this.scene = scene;
        this.kernelRadius = 8;
        this.kernelSize = 32;
        this.kernel = [];
        this.noiseTexture = null;
        this.output = 0;
        this.minDistance = 0.005;
        this.maxDistance = 0.1;
        this._visibilityCache = new Map();
        //
        this.generateSampleKernel();
        this.generateRandomKernelRotations();
        // beauty render target
        var depthTexture = new three_module_js_1.DepthTexture();
        depthTexture.type = three_module_js_1.UnsignedShortType;
        depthTexture.minFilter = three_module_js_1.NearestFilter;
        depthTexture.maxFilter = three_module_js_1.NearestFilter;
        this.beautyRenderTarget = new three_module_js_1.WebGLRenderTarget(this.width, this.height, {
            minFilter: three_module_js_1.LinearFilter,
            magFilter: three_module_js_1.LinearFilter,
            format: three_module_js_1.RGBAFormat
        });
        // normal render target with depth buffer
        this.normalRenderTarget = new three_module_js_1.WebGLRenderTarget(this.width, this.height, {
            minFilter: three_module_js_1.NearestFilter,
            magFilter: three_module_js_1.NearestFilter,
            format: three_module_js_1.RGBAFormat,
            depthTexture: depthTexture
        });
        // ssao render target
        this.ssaoRenderTarget = new three_module_js_1.WebGLRenderTarget(this.width, this.height, {
            minFilter: three_module_js_1.LinearFilter,
            magFilter: three_module_js_1.LinearFilter,
            format: three_module_js_1.RGBAFormat
        });
        this.blurRenderTarget = this.ssaoRenderTarget.clone();
        // ssao material
        if (SSAOShader_js_1.SSAOShader === undefined) {
            console.error('THREE.SSAOPass: The pass relies on SSAOShader.');
        }
        this.ssaoMaterial = new three_module_js_1.ShaderMaterial({
            defines: Object.assign({}, SSAOShader_js_1.SSAOShader.defines),
            uniforms: three_module_js_1.UniformsUtils.clone(SSAOShader_js_1.SSAOShader.uniforms),
            vertexShader: SSAOShader_js_1.SSAOShader.vertexShader,
            fragmentShader: SSAOShader_js_1.SSAOShader.fragmentShader,
            blending: three_module_js_1.NoBlending
        });
        this.ssaoMaterial.uniforms['tDiffuse'].value = this.beautyRenderTarget.texture;
        this.ssaoMaterial.uniforms['tNormal'].value = this.normalRenderTarget.texture;
        this.ssaoMaterial.uniforms['tDepth'].value = this.normalRenderTarget.depthTexture;
        this.ssaoMaterial.uniforms['tNoise'].value = this.noiseTexture;
        this.ssaoMaterial.uniforms['kernel'].value = this.kernel;
        this.ssaoMaterial.uniforms['cameraNear'].value = this.camera.near;
        this.ssaoMaterial.uniforms['cameraFar'].value = this.camera.far;
        this.ssaoMaterial.uniforms['resolution'].value.set(this.width, this.height);
        this.ssaoMaterial.uniforms['cameraProjectionMatrix'].value.copy(this.camera.projectionMatrix);
        this.ssaoMaterial.uniforms['cameraInverseProjectionMatrix'].value.getInverse(this.camera.projectionMatrix);
        // normal material
        this.normalMaterial = new three_module_js_1.MeshNormalMaterial();
        this.normalMaterial.blending = three_module_js_1.NoBlending;
        // blur material
        this.blurMaterial = new three_module_js_1.ShaderMaterial({
            defines: Object.assign({}, SSAOShader_js_2.SSAOBlurShader.defines),
            uniforms: three_module_js_1.UniformsUtils.clone(SSAOShader_js_2.SSAOBlurShader.uniforms),
            vertexShader: SSAOShader_js_2.SSAOBlurShader.vertexShader,
            fragmentShader: SSAOShader_js_2.SSAOBlurShader.fragmentShader
        });
        this.blurMaterial.uniforms['tDiffuse'].value = this.ssaoRenderTarget.texture;
        this.blurMaterial.uniforms['resolution'].value.set(this.width, this.height);
        // material for rendering the depth
        this.depthRenderMaterial = new three_module_js_1.ShaderMaterial({
            defines: Object.assign({}, SSAOShader_js_3.SSAODepthShader.defines),
            uniforms: three_module_js_1.UniformsUtils.clone(SSAOShader_js_3.SSAODepthShader.uniforms),
            vertexShader: SSAOShader_js_3.SSAODepthShader.vertexShader,
            fragmentShader: SSAOShader_js_3.SSAODepthShader.fragmentShader,
            blending: three_module_js_1.NoBlending
        });
        this.depthRenderMaterial.uniforms['tDepth'].value = this.normalRenderTarget.depthTexture;
        this.depthRenderMaterial.uniforms['cameraNear'].value = this.camera.near;
        this.depthRenderMaterial.uniforms['cameraFar'].value = this.camera.far;
        // material for rendering the content of a render target
        this.copyMaterial = new three_module_js_1.ShaderMaterial({
            uniforms: three_module_js_1.UniformsUtils.clone(CopyShader_js_1.CopyShader.uniforms),
            vertexShader: CopyShader_js_1.CopyShader.vertexShader,
            fragmentShader: CopyShader_js_1.CopyShader.fragmentShader,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            blendSrc: three_module_js_1.DstColorFactor,
            blendDst: three_module_js_1.ZeroFactor,
            blendEquation: three_module_js_1.AddEquation,
            blendSrcAlpha: three_module_js_1.DstAlphaFactor,
            blendDstAlpha: three_module_js_1.ZeroFactor,
            blendEquationAlpha: three_module_js_1.AddEquation
        });
        this.fsQuad = new Pass_js_1.Pass.FullScreenQuad(null);
        this.originalClearColor = new three_module_js_1.Color();
    };
    exports.SSAOPass = SSAOPass;
    SSAOPass.prototype = Object.assign(Object.create(Pass_js_1.Pass.prototype), {
        constructor: SSAOPass,
        dispose: function () {
            // dispose render targets
            this.beautyRenderTarget.dispose();
            this.normalRenderTarget.dispose();
            this.ssaoRenderTarget.dispose();
            this.blurRenderTarget.dispose();
            // dispose materials
            this.normalMaterial.dispose();
            this.blurMaterial.dispose();
            this.copyMaterial.dispose();
            this.depthRenderMaterial.dispose();
            // dipsose full screen quad
            this.fsQuad.dispose();
        },
        render: function (renderer, writeBuffer /*, readBuffer, deltaTime, maskActive */) {
            // render beauty
            renderer.setRenderTarget(this.beautyRenderTarget);
            renderer.clear();
            renderer.render(this.scene, this.camera);
            // render normals and depth (honor only meshes, points and lines do not contribute to SSAO)
            this.overrideVisibility();
            this.renderOverride(renderer, this.normalMaterial, this.normalRenderTarget, 0x7777ff, 1.0);
            this.restoreVisibility();
            // render SSAO
            this.ssaoMaterial.uniforms['kernelRadius'].value = this.kernelRadius;
            this.ssaoMaterial.uniforms['minDistance'].value = this.minDistance;
            this.ssaoMaterial.uniforms['maxDistance'].value = this.maxDistance;
            this.renderPass(renderer, this.ssaoMaterial, this.ssaoRenderTarget);
            // render blur
            this.renderPass(renderer, this.blurMaterial, this.blurRenderTarget);
            // output result to screen
            switch (this.output) {
                case SSAOPass.OUTPUT.SSAO:
                    this.copyMaterial.uniforms['tDiffuse'].value = this.ssaoRenderTarget.texture;
                    this.copyMaterial.blending = three_module_js_1.NoBlending;
                    this.renderPass(renderer, this.copyMaterial, this.renderToScreen ? null : writeBuffer);
                    break;
                case SSAOPass.OUTPUT.Blur:
                    this.copyMaterial.uniforms['tDiffuse'].value = this.blurRenderTarget.texture;
                    this.copyMaterial.blending = three_module_js_1.NoBlending;
                    this.renderPass(renderer, this.copyMaterial, this.renderToScreen ? null : writeBuffer);
                    break;
                case SSAOPass.OUTPUT.Beauty:
                    this.copyMaterial.uniforms['tDiffuse'].value = this.beautyRenderTarget.texture;
                    this.copyMaterial.blending = three_module_js_1.NoBlending;
                    this.renderPass(renderer, this.copyMaterial, this.renderToScreen ? null : writeBuffer);
                    break;
                case SSAOPass.OUTPUT.Depth:
                    this.renderPass(renderer, this.depthRenderMaterial, this.renderToScreen ? null : writeBuffer);
                    break;
                case SSAOPass.OUTPUT.Normal:
                    this.copyMaterial.uniforms['tDiffuse'].value = this.normalRenderTarget.texture;
                    this.copyMaterial.blending = three_module_js_1.NoBlending;
                    this.renderPass(renderer, this.copyMaterial, this.renderToScreen ? null : writeBuffer);
                    break;
                case SSAOPass.OUTPUT.Default:
                    this.copyMaterial.uniforms['tDiffuse'].value = this.beautyRenderTarget.texture;
                    this.copyMaterial.blending = three_module_js_1.NoBlending;
                    this.renderPass(renderer, this.copyMaterial, this.renderToScreen ? null : writeBuffer);
                    this.copyMaterial.uniforms['tDiffuse'].value = this.blurRenderTarget.texture;
                    this.copyMaterial.blending = three_module_js_1.CustomBlending;
                    this.renderPass(renderer, this.copyMaterial, this.renderToScreen ? null : writeBuffer);
                    break;
                default:
                    console.warn('THREE.SSAOPass: Unknown output type.');
            }
        },
        renderPass: function (renderer, passMaterial, renderTarget, clearColor, clearAlpha) {
            // save original state
            this.originalClearColor.copy(renderer.getClearColor());
            var originalClearAlpha = renderer.getClearAlpha();
            var originalAutoClear = renderer.autoClear;
            renderer.setRenderTarget(renderTarget);
            // setup pass state
            renderer.autoClear = false;
            if ((clearColor !== undefined) && (clearColor !== null)) {
                renderer.setClearColor(clearColor);
                renderer.setClearAlpha(clearAlpha || 0.0);
                renderer.clear();
            }
            this.fsQuad.material = passMaterial;
            this.fsQuad.render(renderer);
            // restore original state
            renderer.autoClear = originalAutoClear;
            renderer.setClearColor(this.originalClearColor);
            renderer.setClearAlpha(originalClearAlpha);
        },
        renderOverride: function (renderer, overrideMaterial, renderTarget, clearColor, clearAlpha) {
            this.originalClearColor.copy(renderer.getClearColor());
            var originalClearAlpha = renderer.getClearAlpha();
            var originalAutoClear = renderer.autoClear;
            renderer.setRenderTarget(renderTarget);
            renderer.autoClear = false;
            clearColor = overrideMaterial.clearColor || clearColor;
            clearAlpha = overrideMaterial.clearAlpha || clearAlpha;
            if ((clearColor !== undefined) && (clearColor !== null)) {
                renderer.setClearColor(clearColor);
                renderer.setClearAlpha(clearAlpha || 0.0);
                renderer.clear();
            }
            this.scene.overrideMaterial = overrideMaterial;
            renderer.render(this.scene, this.camera);
            this.scene.overrideMaterial = null;
            // restore original state
            renderer.autoClear = originalAutoClear;
            renderer.setClearColor(this.originalClearColor);
            renderer.setClearAlpha(originalClearAlpha);
        },
        setSize: function (width, height) {
            this.width = width;
            this.height = height;
            this.beautyRenderTarget.setSize(width, height);
            this.ssaoRenderTarget.setSize(width, height);
            this.normalRenderTarget.setSize(width, height);
            this.blurRenderTarget.setSize(width, height);
            this.ssaoMaterial.uniforms['resolution'].value.set(width, height);
            this.ssaoMaterial.uniforms['cameraProjectionMatrix'].value.copy(this.camera.projectionMatrix);
            this.ssaoMaterial.uniforms['cameraInverseProjectionMatrix'].value.getInverse(this.camera.projectionMatrix);
            this.blurMaterial.uniforms['resolution'].value.set(width, height);
        },
        generateSampleKernel: function () {
            var kernelSize = this.kernelSize;
            var kernel = this.kernel;
            for (var i = 0; i < kernelSize; i++) {
                var sample = new three_module_js_1.Vector3();
                sample.x = (Math.random() * 2) - 1;
                sample.y = (Math.random() * 2) - 1;
                sample.z = Math.random();
                sample.normalize();
                var scale = i / kernelSize;
                scale = three_module_js_1.MathUtils.lerp(0.1, 1, scale * scale);
                sample.multiplyScalar(scale);
                kernel.push(sample);
            }
        },
        generateRandomKernelRotations: function () {
            var width = 4, height = 4;
            if (SimplexNoise_js_1.SimplexNoise === undefined) {
                console.error('THREE.SSAOPass: The pass relies on SimplexNoise.');
            }
            var simplex = new SimplexNoise_js_1.SimplexNoise();
            var size = width * height;
            var data = new Float32Array(size * 4);
            for (var i = 0; i < size; i++) {
                var stride = i * 4;
                var x = (Math.random() * 2) - 1;
                var y = (Math.random() * 2) - 1;
                var z = 0;
                var noise = simplex.noise3d(x, y, z);
                data[stride] = noise;
                data[stride + 1] = noise;
                data[stride + 2] = noise;
                data[stride + 3] = 1;
            }
            this.noiseTexture = new three_module_js_1.DataTexture(data, width, height, three_module_js_1.RGBAFormat, three_module_js_1.FloatType);
            this.noiseTexture.wrapS = three_module_js_1.RepeatWrapping;
            this.noiseTexture.wrapT = three_module_js_1.RepeatWrapping;
        },
        overrideVisibility: function () {
            var scene = this.scene;
            var cache = this._visibilityCache;
            scene.traverse(function (object) {
                cache.set(object, object.visible);
                if (object.isPoints || object.isLine)
                    object.visible = false;
            });
        },
        restoreVisibility: function () {
            var scene = this.scene;
            var cache = this._visibilityCache;
            scene.traverse(function (object) {
                var visible = cache.get(object);
                object.visible = visible;
            });
            cache.clear();
        }
    });
    SSAOPass.OUTPUT = {
        'Default': 0,
        'SSAO': 1,
        'Blur': 2,
        'Beauty': 3,
        'Depth': 4,
        'Normal': 5
    };
});
//# sourceMappingURL=SSAOPass.js.map