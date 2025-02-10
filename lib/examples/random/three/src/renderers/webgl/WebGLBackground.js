define(["require", "exports", "../../constants.js", "../../geometries/BoxBufferGeometry.js", "../../geometries/PlaneBufferGeometry.js", "../../materials/ShaderMaterial.js", "../../math/Color.js", "../../objects/Mesh.js", "../shaders/ShaderLib.js", "../shaders/UniformsUtils.js"], function (require, exports, constants_js_1, BoxBufferGeometry_js_1, PlaneBufferGeometry_js_1, ShaderMaterial_js_1, Color_js_1, Mesh_js_1, ShaderLib_js_1, UniformsUtils_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function WebGLBackground(renderer, cubemaps, state, objects, premultipliedAlpha) {
        const clearColor = new Color_js_1.Color(0x000000);
        let clearAlpha = 0;
        let planeMesh;
        let boxMesh;
        let currentBackground = null;
        let currentBackgroundVersion = 0;
        let currentTonemapping = null;
        function render(renderList, scene, camera, forceClear) {
            let background = scene.isScene === true ? scene.background : null;
            if (background && background.isTexture) {
                background = cubemaps.get(background);
            }
            // Ignore background in AR
            // TODO: Reconsider this.
            const xr = renderer.xr;
            const session = xr.getSession && xr.getSession();
            if (session && session.environmentBlendMode === 'additive') {
                background = null;
            }
            if (background === null) {
                setClear(clearColor, clearAlpha);
            }
            else if (background && background.isColor) {
                setClear(background, 1);
                forceClear = true;
            }
            if (renderer.autoClear || forceClear) {
                renderer.clear(renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil);
            }
            if (background && (background.isCubeTexture || background.isWebGLCubeRenderTarget || background.mapping === constants_js_1.CubeUVReflectionMapping)) {
                if (boxMesh === undefined) {
                    boxMesh = new Mesh_js_1.Mesh(new BoxBufferGeometry_js_1.BoxBufferGeometry(1, 1, 1), new ShaderMaterial_js_1.ShaderMaterial({
                        name: 'BackgroundCubeMaterial',
                        uniforms: UniformsUtils_js_1.cloneUniforms(ShaderLib_js_1.ShaderLib.cube.uniforms),
                        vertexShader: ShaderLib_js_1.ShaderLib.cube.vertexShader,
                        fragmentShader: ShaderLib_js_1.ShaderLib.cube.fragmentShader,
                        side: constants_js_1.BackSide,
                        depthTest: false,
                        depthWrite: false,
                        fog: false
                    }));
                    boxMesh.geometry.deleteAttribute('normal');
                    boxMesh.geometry.deleteAttribute('uv');
                    boxMesh.onBeforeRender = function (renderer, scene, camera) {
                        this.matrixWorld.copyPosition(camera.matrixWorld);
                    };
                    // enable code injection for non-built-in material
                    Object.defineProperty(boxMesh.material, 'envMap', {
                        get: function () {
                            return this.uniforms.envMap.value;
                        }
                    });
                    objects.update(boxMesh);
                }
                if (background.isWebGLCubeRenderTarget) {
                    // TODO Deprecate
                    background = background.texture;
                }
                boxMesh.material.uniforms.envMap.value = background;
                boxMesh.material.uniforms.flipEnvMap.value = (background.isCubeTexture && background._needsFlipEnvMap) ? -1 : 1;
                if (currentBackground !== background ||
                    currentBackgroundVersion !== background.version ||
                    currentTonemapping !== renderer.toneMapping) {
                    boxMesh.material.needsUpdate = true;
                    currentBackground = background;
                    currentBackgroundVersion = background.version;
                    currentTonemapping = renderer.toneMapping;
                }
                // push to the pre-sorted opaque render list
                renderList.unshift(boxMesh, boxMesh.geometry, boxMesh.material, 0, 0, null);
            }
            else if (background && background.isTexture) {
                if (planeMesh === undefined) {
                    planeMesh = new Mesh_js_1.Mesh(new PlaneBufferGeometry_js_1.PlaneBufferGeometry(2, 2), new ShaderMaterial_js_1.ShaderMaterial({
                        name: 'BackgroundMaterial',
                        uniforms: UniformsUtils_js_1.cloneUniforms(ShaderLib_js_1.ShaderLib.background.uniforms),
                        vertexShader: ShaderLib_js_1.ShaderLib.background.vertexShader,
                        fragmentShader: ShaderLib_js_1.ShaderLib.background.fragmentShader,
                        side: constants_js_1.FrontSide,
                        depthTest: false,
                        depthWrite: false,
                        fog: false
                    }));
                    planeMesh.geometry.deleteAttribute('normal');
                    // enable code injection for non-built-in material
                    Object.defineProperty(planeMesh.material, 'map', {
                        get: function () {
                            return this.uniforms.t2D.value;
                        }
                    });
                    objects.update(planeMesh);
                }
                planeMesh.material.uniforms.t2D.value = background;
                if (background.matrixAutoUpdate === true) {
                    background.updateMatrix();
                }
                planeMesh.material.uniforms.uvTransform.value.copy(background.matrix);
                if (currentBackground !== background ||
                    currentBackgroundVersion !== background.version ||
                    currentTonemapping !== renderer.toneMapping) {
                    planeMesh.material.needsUpdate = true;
                    currentBackground = background;
                    currentBackgroundVersion = background.version;
                    currentTonemapping = renderer.toneMapping;
                }
                // push to the pre-sorted opaque render list
                renderList.unshift(planeMesh, planeMesh.geometry, planeMesh.material, 0, 0, null);
            }
        }
        function setClear(color, alpha) {
            state.buffers.color.setClear(color.r, color.g, color.b, alpha, premultipliedAlpha);
        }
        return {
            getClearColor: function () {
                return clearColor;
            },
            setClearColor: function (color, alpha) {
                clearColor.set(color);
                clearAlpha = alpha !== undefined ? alpha : 1;
                setClear(clearColor, clearAlpha);
            },
            getClearAlpha: function () {
                return clearAlpha;
            },
            setClearAlpha: function (alpha) {
                clearAlpha = alpha;
                setClear(clearColor, clearAlpha);
            },
            render: render
        };
    }
    exports.WebGLBackground = WebGLBackground;
});
//# sourceMappingURL=WebGLBackground.js.map