var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "../../constants.js", "../WebGLRenderTarget.js", "../../materials/MeshDepthMaterial.js", "../../materials/MeshDistanceMaterial.js", "../../materials/ShaderMaterial.js", "../../core/BufferAttribute.js", "../../core/BufferGeometry.js", "../../objects/Mesh.js", "../../math/Vector4.js", "../../math/Vector2.js", "../../math/Frustum.js", "../shaders/ShaderLib/vsm_frag.glsl.js", "../shaders/ShaderLib/vsm_vert.glsl.js"], function (require, exports, constants_js_1, WebGLRenderTarget_js_1, MeshDepthMaterial_js_1, MeshDistanceMaterial_js_1, ShaderMaterial_js_1, BufferAttribute_js_1, BufferGeometry_js_1, Mesh_js_1, Vector4_js_1, Vector2_js_1, Frustum_js_1, vsm_frag_glsl_js_1, vsm_vert_glsl_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    vsm_frag_glsl_js_1 = __importDefault(vsm_frag_glsl_js_1);
    vsm_vert_glsl_js_1 = __importDefault(vsm_vert_glsl_js_1);
    function WebGLShadowMap(_renderer, _objects, maxTextureSize) {
        let _frustum = new Frustum_js_1.Frustum();
        const _shadowMapSize = new Vector2_js_1.Vector2(), _viewportSize = new Vector2_js_1.Vector2(), _viewport = new Vector4_js_1.Vector4(), _depthMaterials = [], _distanceMaterials = [], _materialCache = {};
        const shadowSide = { 0: constants_js_1.BackSide, 1: constants_js_1.FrontSide, 2: constants_js_1.DoubleSide };
        const shadowMaterialVertical = new ShaderMaterial_js_1.ShaderMaterial({
            defines: {
                SAMPLE_RATE: 2.0 / 8.0,
                HALF_SAMPLE_RATE: 1.0 / 8.0
            },
            uniforms: {
                shadow_pass: { value: null },
                resolution: { value: new Vector2_js_1.Vector2() },
                radius: { value: 4.0 }
            },
            vertexShader: vsm_vert_glsl_js_1.default,
            fragmentShader: vsm_frag_glsl_js_1.default
        });
        const shadowMaterialHorizonal = shadowMaterialVertical.clone();
        shadowMaterialHorizonal.defines.HORIZONAL_PASS = 1;
        const fullScreenTri = new BufferGeometry_js_1.BufferGeometry();
        fullScreenTri.setAttribute("position", new BufferAttribute_js_1.BufferAttribute(new Float32Array([-1, -1, 0.5, 3, -1, 0.5, -1, 3, 0.5]), 3));
        const fullScreenMesh = new Mesh_js_1.Mesh(fullScreenTri, shadowMaterialVertical);
        const scope = this;
        this.enabled = false;
        this.autoUpdate = true;
        this.needsUpdate = false;
        this.type = constants_js_1.PCFShadowMap;
        this.render = function (lights, scene, camera) {
            if (scope.enabled === false)
                return;
            if (scope.autoUpdate === false && scope.needsUpdate === false)
                return;
            if (lights.length === 0)
                return;
            const currentRenderTarget = _renderer.getRenderTarget();
            const activeCubeFace = _renderer.getActiveCubeFace();
            const activeMipmapLevel = _renderer.getActiveMipmapLevel();
            const _state = _renderer.state;
            // Set GL state for depth map.
            _state.setBlending(constants_js_1.NoBlending);
            _state.buffers.color.setClear(1, 1, 1, 1);
            _state.buffers.depth.setTest(true);
            _state.setScissorTest(false);
            // render depth map
            for (let i = 0, il = lights.length; i < il; i++) {
                const light = lights[i];
                const shadow = light.shadow;
                if (shadow === undefined) {
                    console.warn('THREE.WebGLShadowMap:', light, 'has no shadow.');
                    continue;
                }
                if (shadow.autoUpdate === false && shadow.needsUpdate === false)
                    continue;
                _shadowMapSize.copy(shadow.mapSize);
                const shadowFrameExtents = shadow.getFrameExtents();
                _shadowMapSize.multiply(shadowFrameExtents);
                _viewportSize.copy(shadow.mapSize);
                if (_shadowMapSize.x > maxTextureSize || _shadowMapSize.y > maxTextureSize) {
                    if (_shadowMapSize.x > maxTextureSize) {
                        _viewportSize.x = Math.floor(maxTextureSize / shadowFrameExtents.x);
                        _shadowMapSize.x = _viewportSize.x * shadowFrameExtents.x;
                        shadow.mapSize.x = _viewportSize.x;
                    }
                    if (_shadowMapSize.y > maxTextureSize) {
                        _viewportSize.y = Math.floor(maxTextureSize / shadowFrameExtents.y);
                        _shadowMapSize.y = _viewportSize.y * shadowFrameExtents.y;
                        shadow.mapSize.y = _viewportSize.y;
                    }
                }
                if (shadow.map === null && !shadow.isPointLightShadow && this.type === constants_js_1.VSMShadowMap) {
                    const pars = { minFilter: constants_js_1.LinearFilter, magFilter: constants_js_1.LinearFilter, format: constants_js_1.RGBAFormat };
                    shadow.map = new WebGLRenderTarget_js_1.WebGLRenderTarget(_shadowMapSize.x, _shadowMapSize.y, pars);
                    shadow.map.texture.name = light.name + ".shadowMap";
                    shadow.mapPass = new WebGLRenderTarget_js_1.WebGLRenderTarget(_shadowMapSize.x, _shadowMapSize.y, pars);
                    shadow.camera.updateProjectionMatrix();
                }
                if (shadow.map === null) {
                    const pars = { minFilter: constants_js_1.NearestFilter, magFilter: constants_js_1.NearestFilter, format: constants_js_1.RGBAFormat };
                    shadow.map = new WebGLRenderTarget_js_1.WebGLRenderTarget(_shadowMapSize.x, _shadowMapSize.y, pars);
                    shadow.map.texture.name = light.name + ".shadowMap";
                    shadow.camera.updateProjectionMatrix();
                }
                _renderer.setRenderTarget(shadow.map);
                _renderer.clear();
                const viewportCount = shadow.getViewportCount();
                for (let vp = 0; vp < viewportCount; vp++) {
                    const viewport = shadow.getViewport(vp);
                    _viewport.set(_viewportSize.x * viewport.x, _viewportSize.y * viewport.y, _viewportSize.x * viewport.z, _viewportSize.y * viewport.w);
                    _state.viewport(_viewport);
                    shadow.updateMatrices(light, vp);
                    _frustum = shadow.getFrustum();
                    renderObject(scene, camera, shadow.camera, light, this.type);
                }
                // do blur pass for VSM
                if (!shadow.isPointLightShadow && this.type === constants_js_1.VSMShadowMap) {
                    VSMPass(shadow, camera);
                }
                shadow.needsUpdate = false;
            }
            scope.needsUpdate = false;
            _renderer.setRenderTarget(currentRenderTarget, activeCubeFace, activeMipmapLevel);
        };
        function VSMPass(shadow, camera) {
            const geometry = _objects.update(fullScreenMesh);
            // vertical pass
            shadowMaterialVertical.uniforms.shadow_pass.value = shadow.map.texture;
            shadowMaterialVertical.uniforms.resolution.value = shadow.mapSize;
            shadowMaterialVertical.uniforms.radius.value = shadow.radius;
            _renderer.setRenderTarget(shadow.mapPass);
            _renderer.clear();
            _renderer.renderBufferDirect(camera, null, geometry, shadowMaterialVertical, fullScreenMesh, null);
            // horizonal pass
            shadowMaterialHorizonal.uniforms.shadow_pass.value = shadow.mapPass.texture;
            shadowMaterialHorizonal.uniforms.resolution.value = shadow.mapSize;
            shadowMaterialHorizonal.uniforms.radius.value = shadow.radius;
            _renderer.setRenderTarget(shadow.map);
            _renderer.clear();
            _renderer.renderBufferDirect(camera, null, geometry, shadowMaterialHorizonal, fullScreenMesh, null);
        }
        function getDepthMaterialVariant(useMorphing, useSkinning, useInstancing) {
            const index = useMorphing << 0 | useSkinning << 1 | useInstancing << 2;
            let material = _depthMaterials[index];
            if (material === undefined) {
                material = new MeshDepthMaterial_js_1.MeshDepthMaterial({
                    depthPacking: constants_js_1.RGBADepthPacking,
                    morphTargets: useMorphing,
                    skinning: useSkinning
                });
                _depthMaterials[index] = material;
            }
            return material;
        }
        function getDistanceMaterialVariant(useMorphing, useSkinning, useInstancing) {
            const index = useMorphing << 0 | useSkinning << 1 | useInstancing << 2;
            let material = _distanceMaterials[index];
            if (material === undefined) {
                material = new MeshDistanceMaterial_js_1.MeshDistanceMaterial({
                    morphTargets: useMorphing,
                    skinning: useSkinning
                });
                _distanceMaterials[index] = material;
            }
            return material;
        }
        function getDepthMaterial(object, geometry, material, light, shadowCameraNear, shadowCameraFar, type) {
            let result = null;
            let getMaterialVariant = getDepthMaterialVariant;
            let customMaterial = object.customDepthMaterial;
            if (light.isPointLight === true) {
                getMaterialVariant = getDistanceMaterialVariant;
                customMaterial = object.customDistanceMaterial;
            }
            if (customMaterial === undefined) {
                let useMorphing = false;
                if (material.morphTargets === true) {
                    useMorphing = geometry.morphAttributes && geometry.morphAttributes.position && geometry.morphAttributes.position.length > 0;
                }
                let useSkinning = false;
                if (object.isSkinnedMesh === true) {
                    if (material.skinning === true) {
                        useSkinning = true;
                    }
                    else {
                        console.warn('THREE.WebGLShadowMap: THREE.SkinnedMesh with material.skinning set to false:', object);
                    }
                }
                const useInstancing = object.isInstancedMesh === true;
                result = getMaterialVariant(useMorphing, useSkinning, useInstancing);
            }
            else {
                result = customMaterial;
            }
            if (_renderer.localClippingEnabled &&
                material.clipShadows === true &&
                material.clippingPlanes.length !== 0) {
                // in this case we need a unique material instance reflecting the
                // appropriate state
                const keyA = result.uuid, keyB = material.uuid;
                let materialsForVariant = _materialCache[keyA];
                if (materialsForVariant === undefined) {
                    materialsForVariant = {};
                    _materialCache[keyA] = materialsForVariant;
                }
                let cachedMaterial = materialsForVariant[keyB];
                if (cachedMaterial === undefined) {
                    cachedMaterial = result.clone();
                    materialsForVariant[keyB] = cachedMaterial;
                }
                result = cachedMaterial;
            }
            result.visible = material.visible;
            result.wireframe = material.wireframe;
            if (type === constants_js_1.VSMShadowMap) {
                result.side = (material.shadowSide !== null) ? material.shadowSide : material.side;
            }
            else {
                result.side = (material.shadowSide !== null) ? material.shadowSide : shadowSide[material.side];
            }
            result.clipShadows = material.clipShadows;
            result.clippingPlanes = material.clippingPlanes;
            result.clipIntersection = material.clipIntersection;
            result.wireframeLinewidth = material.wireframeLinewidth;
            result.linewidth = material.linewidth;
            if (light.isPointLight === true && result.isMeshDistanceMaterial === true) {
                result.referencePosition.setFromMatrixPosition(light.matrixWorld);
                result.nearDistance = shadowCameraNear;
                result.farDistance = shadowCameraFar;
            }
            return result;
        }
        function renderObject(object, camera, shadowCamera, light, type) {
            if (object.visible === false)
                return;
            const visible = object.layers.test(camera.layers);
            if (visible && (object.isMesh || object.isLine || object.isPoints)) {
                if ((object.castShadow || (object.receiveShadow && type === constants_js_1.VSMShadowMap)) && (!object.frustumCulled || _frustum.intersectsObject(object))) {
                    object.modelViewMatrix.multiplyMatrices(shadowCamera.matrixWorldInverse, object.matrixWorld);
                    const geometry = _objects.update(object);
                    const material = object.material;
                    if (Array.isArray(material)) {
                        const groups = geometry.groups;
                        for (let k = 0, kl = groups.length; k < kl; k++) {
                            const group = groups[k];
                            const groupMaterial = material[group.materialIndex];
                            if (groupMaterial && groupMaterial.visible) {
                                const depthMaterial = getDepthMaterial(object, geometry, groupMaterial, light, shadowCamera.near, shadowCamera.far, type);
                                _renderer.renderBufferDirect(shadowCamera, null, geometry, depthMaterial, object, group);
                            }
                        }
                    }
                    else if (material.visible) {
                        const depthMaterial = getDepthMaterial(object, geometry, material, light, shadowCamera.near, shadowCamera.far, type);
                        _renderer.renderBufferDirect(shadowCamera, null, geometry, depthMaterial, object, null);
                    }
                }
            }
            const children = object.children;
            for (let i = 0, l = children.length; i < l; i++) {
                renderObject(children[i], camera, shadowCamera, light, type);
            }
        }
    }
    exports.WebGLShadowMap = WebGLShadowMap;
});
//# sourceMappingURL=WebGLShadowMap.js.map