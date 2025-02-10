define(["require", "exports", "../../../build/three.module.js", "../postprocessing/Pass.js", "../shaders/SAOShader.js", "../shaders/DepthLimitedBlurShader.js", "../shaders/DepthLimitedBlurShader.js", "../shaders/CopyShader.js", "../shaders/UnpackDepthRGBAShader.js"], function (require, exports, three_module_js_1, Pass_js_1, SAOShader_js_1, DepthLimitedBlurShader_js_1, DepthLimitedBlurShader_js_2, CopyShader_js_1, UnpackDepthRGBAShader_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * SAO implementation inspired from bhouston previous SAO work
     */
    var SAOPass = function (scene, camera, depthTexture, useNormals, resolution) {
        Pass_js_1.Pass.call(this);
        this.scene = scene;
        this.camera = camera;
        this.clear = true;
        this.needsSwap = false;
        this.supportsDepthTextureExtension = (depthTexture !== undefined) ? depthTexture : false;
        this.supportsNormalTexture = (useNormals !== undefined) ? useNormals : false;
        this.originalClearColor = new three_module_js_1.Color();
        this.oldClearColor = new three_module_js_1.Color();
        this.oldClearAlpha = 1;
        this.params = {
            output: 0,
            saoBias: 0.5,
            saoIntensity: 0.18,
            saoScale: 1,
            saoKernelRadius: 100,
            saoMinResolution: 0,
            saoBlur: true,
            saoBlurRadius: 8,
            saoBlurStdDev: 4,
            saoBlurDepthCutoff: 0.01
        };
        this.resolution = (resolution !== undefined) ? new three_module_js_1.Vector2(resolution.x, resolution.y) : new three_module_js_1.Vector2(256, 256);
        this.saoRenderTarget = new three_module_js_1.WebGLRenderTarget(this.resolution.x, this.resolution.y, {
            minFilter: three_module_js_1.LinearFilter,
            magFilter: three_module_js_1.LinearFilter,
            format: three_module_js_1.RGBAFormat
        });
        this.blurIntermediateRenderTarget = this.saoRenderTarget.clone();
        this.beautyRenderTarget = this.saoRenderTarget.clone();
        this.normalRenderTarget = new three_module_js_1.WebGLRenderTarget(this.resolution.x, this.resolution.y, {
            minFilter: three_module_js_1.NearestFilter,
            magFilter: three_module_js_1.NearestFilter,
            format: three_module_js_1.RGBAFormat
        });
        this.depthRenderTarget = this.normalRenderTarget.clone();
        if (this.supportsDepthTextureExtension) {
            var depthTexture = new three_module_js_1.DepthTexture();
            depthTexture.type = three_module_js_1.UnsignedShortType;
            depthTexture.minFilter = three_module_js_1.NearestFilter;
            depthTexture.maxFilter = three_module_js_1.NearestFilter;
            this.beautyRenderTarget.depthTexture = depthTexture;
            this.beautyRenderTarget.depthBuffer = true;
        }
        this.depthMaterial = new three_module_js_1.MeshDepthMaterial();
        this.depthMaterial.depthPacking = three_module_js_1.RGBADepthPacking;
        this.depthMaterial.blending = three_module_js_1.NoBlending;
        this.normalMaterial = new three_module_js_1.MeshNormalMaterial();
        this.normalMaterial.blending = three_module_js_1.NoBlending;
        if (SAOShader_js_1.SAOShader === undefined) {
            console.error('THREE.SAOPass relies on SAOShader');
        }
        this.saoMaterial = new three_module_js_1.ShaderMaterial({
            defines: Object.assign({}, SAOShader_js_1.SAOShader.defines),
            fragmentShader: SAOShader_js_1.SAOShader.fragmentShader,
            vertexShader: SAOShader_js_1.SAOShader.vertexShader,
            uniforms: three_module_js_1.UniformsUtils.clone(SAOShader_js_1.SAOShader.uniforms)
        });
        this.saoMaterial.extensions.derivatives = true;
        this.saoMaterial.defines['DEPTH_PACKING'] = this.supportsDepthTextureExtension ? 0 : 1;
        this.saoMaterial.defines['NORMAL_TEXTURE'] = this.supportsNormalTexture ? 1 : 0;
        this.saoMaterial.defines['PERSPECTIVE_CAMERA'] = this.camera.isPerspectiveCamera ? 1 : 0;
        this.saoMaterial.uniforms['tDepth'].value = (this.supportsDepthTextureExtension) ? depthTexture : this.depthRenderTarget.texture;
        this.saoMaterial.uniforms['tNormal'].value = this.normalRenderTarget.texture;
        this.saoMaterial.uniforms['size'].value.set(this.resolution.x, this.resolution.y);
        this.saoMaterial.uniforms['cameraInverseProjectionMatrix'].value.getInverse(this.camera.projectionMatrix);
        this.saoMaterial.uniforms['cameraProjectionMatrix'].value = this.camera.projectionMatrix;
        this.saoMaterial.blending = three_module_js_1.NoBlending;
        if (DepthLimitedBlurShader_js_1.DepthLimitedBlurShader === undefined) {
            console.error('THREE.SAOPass relies on DepthLimitedBlurShader');
        }
        this.vBlurMaterial = new three_module_js_1.ShaderMaterial({
            uniforms: three_module_js_1.UniformsUtils.clone(DepthLimitedBlurShader_js_1.DepthLimitedBlurShader.uniforms),
            defines: Object.assign({}, DepthLimitedBlurShader_js_1.DepthLimitedBlurShader.defines),
            vertexShader: DepthLimitedBlurShader_js_1.DepthLimitedBlurShader.vertexShader,
            fragmentShader: DepthLimitedBlurShader_js_1.DepthLimitedBlurShader.fragmentShader
        });
        this.vBlurMaterial.defines['DEPTH_PACKING'] = this.supportsDepthTextureExtension ? 0 : 1;
        this.vBlurMaterial.defines['PERSPECTIVE_CAMERA'] = this.camera.isPerspectiveCamera ? 1 : 0;
        this.vBlurMaterial.uniforms['tDiffuse'].value = this.saoRenderTarget.texture;
        this.vBlurMaterial.uniforms['tDepth'].value = (this.supportsDepthTextureExtension) ? depthTexture : this.depthRenderTarget.texture;
        this.vBlurMaterial.uniforms['size'].value.set(this.resolution.x, this.resolution.y);
        this.vBlurMaterial.blending = three_module_js_1.NoBlending;
        this.hBlurMaterial = new three_module_js_1.ShaderMaterial({
            uniforms: three_module_js_1.UniformsUtils.clone(DepthLimitedBlurShader_js_1.DepthLimitedBlurShader.uniforms),
            defines: Object.assign({}, DepthLimitedBlurShader_js_1.DepthLimitedBlurShader.defines),
            vertexShader: DepthLimitedBlurShader_js_1.DepthLimitedBlurShader.vertexShader,
            fragmentShader: DepthLimitedBlurShader_js_1.DepthLimitedBlurShader.fragmentShader
        });
        this.hBlurMaterial.defines['DEPTH_PACKING'] = this.supportsDepthTextureExtension ? 0 : 1;
        this.hBlurMaterial.defines['PERSPECTIVE_CAMERA'] = this.camera.isPerspectiveCamera ? 1 : 0;
        this.hBlurMaterial.uniforms['tDiffuse'].value = this.blurIntermediateRenderTarget.texture;
        this.hBlurMaterial.uniforms['tDepth'].value = (this.supportsDepthTextureExtension) ? depthTexture : this.depthRenderTarget.texture;
        this.hBlurMaterial.uniforms['size'].value.set(this.resolution.x, this.resolution.y);
        this.hBlurMaterial.blending = three_module_js_1.NoBlending;
        if (CopyShader_js_1.CopyShader === undefined) {
            console.error('THREE.SAOPass relies on CopyShader');
        }
        this.materialCopy = new three_module_js_1.ShaderMaterial({
            uniforms: three_module_js_1.UniformsUtils.clone(CopyShader_js_1.CopyShader.uniforms),
            vertexShader: CopyShader_js_1.CopyShader.vertexShader,
            fragmentShader: CopyShader_js_1.CopyShader.fragmentShader,
            blending: three_module_js_1.NoBlending
        });
        this.materialCopy.transparent = true;
        this.materialCopy.depthTest = false;
        this.materialCopy.depthWrite = false;
        this.materialCopy.blending = three_module_js_1.CustomBlending;
        this.materialCopy.blendSrc = three_module_js_1.DstColorFactor;
        this.materialCopy.blendDst = three_module_js_1.ZeroFactor;
        this.materialCopy.blendEquation = three_module_js_1.AddEquation;
        this.materialCopy.blendSrcAlpha = three_module_js_1.DstAlphaFactor;
        this.materialCopy.blendDstAlpha = three_module_js_1.ZeroFactor;
        this.materialCopy.blendEquationAlpha = three_module_js_1.AddEquation;
        if (UnpackDepthRGBAShader_js_1.UnpackDepthRGBAShader === undefined) {
            console.error('THREE.SAOPass relies on UnpackDepthRGBAShader');
        }
        this.depthCopy = new three_module_js_1.ShaderMaterial({
            uniforms: three_module_js_1.UniformsUtils.clone(UnpackDepthRGBAShader_js_1.UnpackDepthRGBAShader.uniforms),
            vertexShader: UnpackDepthRGBAShader_js_1.UnpackDepthRGBAShader.vertexShader,
            fragmentShader: UnpackDepthRGBAShader_js_1.UnpackDepthRGBAShader.fragmentShader,
            blending: three_module_js_1.NoBlending
        });
        this.fsQuad = new Pass_js_1.Pass.FullScreenQuad(null);
    };
    exports.SAOPass = SAOPass;
    SAOPass.OUTPUT = {
        'Beauty': 1,
        'Default': 0,
        'SAO': 2,
        'Depth': 3,
        'Normal': 4
    };
    SAOPass.prototype = Object.assign(Object.create(Pass_js_1.Pass.prototype), {
        constructor: SAOPass,
        render: function (renderer, writeBuffer, readBuffer /*, deltaTime, maskActive*/) {
            // Rendering readBuffer first when rendering to screen
            if (this.renderToScreen) {
                this.materialCopy.blending = three_module_js_1.NoBlending;
                this.materialCopy.uniforms['tDiffuse'].value = readBuffer.texture;
                this.materialCopy.needsUpdate = true;
                this.renderPass(renderer, this.materialCopy, null);
            }
            if (this.params.output === 1) {
                return;
            }
            this.oldClearColor.copy(renderer.getClearColor());
            this.oldClearAlpha = renderer.getClearAlpha();
            var oldAutoClear = renderer.autoClear;
            renderer.autoClear = false;
            renderer.setRenderTarget(this.depthRenderTarget);
            renderer.clear();
            this.saoMaterial.uniforms['bias'].value = this.params.saoBias;
            this.saoMaterial.uniforms['intensity'].value = this.params.saoIntensity;
            this.saoMaterial.uniforms['scale'].value = this.params.saoScale;
            this.saoMaterial.uniforms['kernelRadius'].value = this.params.saoKernelRadius;
            this.saoMaterial.uniforms['minResolution'].value = this.params.saoMinResolution;
            this.saoMaterial.uniforms['cameraNear'].value = this.camera.near;
            this.saoMaterial.uniforms['cameraFar'].value = this.camera.far;
            // this.saoMaterial.uniforms['randomSeed'].value = Math.random();
            var depthCutoff = this.params.saoBlurDepthCutoff * (this.camera.far - this.camera.near);
            this.vBlurMaterial.uniforms['depthCutoff'].value = depthCutoff;
            this.hBlurMaterial.uniforms['depthCutoff'].value = depthCutoff;
            this.vBlurMaterial.uniforms['cameraNear'].value = this.camera.near;
            this.vBlurMaterial.uniforms['cameraFar'].value = this.camera.far;
            this.hBlurMaterial.uniforms['cameraNear'].value = this.camera.near;
            this.hBlurMaterial.uniforms['cameraFar'].value = this.camera.far;
            this.params.saoBlurRadius = Math.floor(this.params.saoBlurRadius);
            if ((this.prevStdDev !== this.params.saoBlurStdDev) || (this.prevNumSamples !== this.params.saoBlurRadius)) {
                DepthLimitedBlurShader_js_2.BlurShaderUtils.configure(this.vBlurMaterial, this.params.saoBlurRadius, this.params.saoBlurStdDev, new three_module_js_1.Vector2(0, 1));
                DepthLimitedBlurShader_js_2.BlurShaderUtils.configure(this.hBlurMaterial, this.params.saoBlurRadius, this.params.saoBlurStdDev, new three_module_js_1.Vector2(1, 0));
                this.prevStdDev = this.params.saoBlurStdDev;
                this.prevNumSamples = this.params.saoBlurRadius;
            }
            // Rendering scene to depth texture
            renderer.setClearColor(0x000000);
            renderer.setRenderTarget(this.beautyRenderTarget);
            renderer.clear();
            renderer.render(this.scene, this.camera);
            // Re-render scene if depth texture extension is not supported
            if (!this.supportsDepthTextureExtension) {
                // Clear rule : far clipping plane in both RGBA and Basic encoding
                this.renderOverride(renderer, this.depthMaterial, this.depthRenderTarget, 0x000000, 1.0);
            }
            if (this.supportsNormalTexture) {
                // Clear rule : default normal is facing the camera
                this.renderOverride(renderer, this.normalMaterial, this.normalRenderTarget, 0x7777ff, 1.0);
            }
            // Rendering SAO texture
            this.renderPass(renderer, this.saoMaterial, this.saoRenderTarget, 0xffffff, 1.0);
            // Blurring SAO texture
            if (this.params.saoBlur) {
                this.renderPass(renderer, this.vBlurMaterial, this.blurIntermediateRenderTarget, 0xffffff, 1.0);
                this.renderPass(renderer, this.hBlurMaterial, this.saoRenderTarget, 0xffffff, 1.0);
            }
            var outputMaterial = this.materialCopy;
            // Setting up SAO rendering
            if (this.params.output === 3) {
                if (this.supportsDepthTextureExtension) {
                    this.materialCopy.uniforms['tDiffuse'].value = this.beautyRenderTarget.depthTexture;
                    this.materialCopy.needsUpdate = true;
                }
                else {
                    this.depthCopy.uniforms['tDiffuse'].value = this.depthRenderTarget.texture;
                    this.depthCopy.needsUpdate = true;
                    outputMaterial = this.depthCopy;
                }
            }
            else if (this.params.output === 4) {
                this.materialCopy.uniforms['tDiffuse'].value = this.normalRenderTarget.texture;
                this.materialCopy.needsUpdate = true;
            }
            else {
                this.materialCopy.uniforms['tDiffuse'].value = this.saoRenderTarget.texture;
                this.materialCopy.needsUpdate = true;
            }
            // Blending depends on output, only want a CustomBlending when showing SAO
            if (this.params.output === 0) {
                outputMaterial.blending = three_module_js_1.CustomBlending;
            }
            else {
                outputMaterial.blending = three_module_js_1.NoBlending;
            }
            // Rendering SAOPass result on top of previous pass
            this.renderPass(renderer, outputMaterial, this.renderToScreen ? null : readBuffer);
            renderer.setClearColor(this.oldClearColor, this.oldClearAlpha);
            renderer.autoClear = oldAutoClear;
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
            this.beautyRenderTarget.setSize(width, height);
            this.saoRenderTarget.setSize(width, height);
            this.blurIntermediateRenderTarget.setSize(width, height);
            this.normalRenderTarget.setSize(width, height);
            this.depthRenderTarget.setSize(width, height);
            this.saoMaterial.uniforms['size'].value.set(width, height);
            this.saoMaterial.uniforms['cameraInverseProjectionMatrix'].value.getInverse(this.camera.projectionMatrix);
            this.saoMaterial.uniforms['cameraProjectionMatrix'].value = this.camera.projectionMatrix;
            this.saoMaterial.needsUpdate = true;
            this.vBlurMaterial.uniforms['size'].value.set(width, height);
            this.vBlurMaterial.needsUpdate = true;
            this.hBlurMaterial.uniforms['size'].value.set(width, height);
            this.hBlurMaterial.needsUpdate = true;
        }
    });
});
//# sourceMappingURL=SAOPass.js.map