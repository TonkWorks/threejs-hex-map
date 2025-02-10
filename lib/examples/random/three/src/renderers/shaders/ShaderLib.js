define(["require", "exports", "./ShaderChunk.js", "./UniformsUtils.js", "../../math/Vector2.js", "../../math/Vector3.js", "./UniformsLib.js", "../../math/Color.js", "../../math/Matrix3.js"], function (require, exports, ShaderChunk_js_1, UniformsUtils_js_1, Vector2_js_1, Vector3_js_1, UniformsLib_js_1, Color_js_1, Matrix3_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const ShaderLib = {
        basic: {
            uniforms: UniformsUtils_js_1.mergeUniforms([
                UniformsLib_js_1.UniformsLib.common,
                UniformsLib_js_1.UniformsLib.specularmap,
                UniformsLib_js_1.UniformsLib.envmap,
                UniformsLib_js_1.UniformsLib.aomap,
                UniformsLib_js_1.UniformsLib.lightmap,
                UniformsLib_js_1.UniformsLib.fog
            ]),
            vertexShader: ShaderChunk_js_1.ShaderChunk.meshbasic_vert,
            fragmentShader: ShaderChunk_js_1.ShaderChunk.meshbasic_frag
        },
        lambert: {
            uniforms: UniformsUtils_js_1.mergeUniforms([
                UniformsLib_js_1.UniformsLib.common,
                UniformsLib_js_1.UniformsLib.specularmap,
                UniformsLib_js_1.UniformsLib.envmap,
                UniformsLib_js_1.UniformsLib.aomap,
                UniformsLib_js_1.UniformsLib.lightmap,
                UniformsLib_js_1.UniformsLib.emissivemap,
                UniformsLib_js_1.UniformsLib.fog,
                UniformsLib_js_1.UniformsLib.lights,
                {
                    emissive: { value: new Color_js_1.Color(0x000000) }
                }
            ]),
            vertexShader: ShaderChunk_js_1.ShaderChunk.meshlambert_vert,
            fragmentShader: ShaderChunk_js_1.ShaderChunk.meshlambert_frag
        },
        phong: {
            uniforms: UniformsUtils_js_1.mergeUniforms([
                UniformsLib_js_1.UniformsLib.common,
                UniformsLib_js_1.UniformsLib.specularmap,
                UniformsLib_js_1.UniformsLib.envmap,
                UniformsLib_js_1.UniformsLib.aomap,
                UniformsLib_js_1.UniformsLib.lightmap,
                UniformsLib_js_1.UniformsLib.emissivemap,
                UniformsLib_js_1.UniformsLib.bumpmap,
                UniformsLib_js_1.UniformsLib.normalmap,
                UniformsLib_js_1.UniformsLib.displacementmap,
                UniformsLib_js_1.UniformsLib.fog,
                UniformsLib_js_1.UniformsLib.lights,
                {
                    emissive: { value: new Color_js_1.Color(0x000000) },
                    specular: { value: new Color_js_1.Color(0x111111) },
                    shininess: { value: 30 }
                }
            ]),
            vertexShader: ShaderChunk_js_1.ShaderChunk.meshphong_vert,
            fragmentShader: ShaderChunk_js_1.ShaderChunk.meshphong_frag
        },
        standard: {
            uniforms: UniformsUtils_js_1.mergeUniforms([
                UniformsLib_js_1.UniformsLib.common,
                UniformsLib_js_1.UniformsLib.envmap,
                UniformsLib_js_1.UniformsLib.aomap,
                UniformsLib_js_1.UniformsLib.lightmap,
                UniformsLib_js_1.UniformsLib.emissivemap,
                UniformsLib_js_1.UniformsLib.bumpmap,
                UniformsLib_js_1.UniformsLib.normalmap,
                UniformsLib_js_1.UniformsLib.displacementmap,
                UniformsLib_js_1.UniformsLib.roughnessmap,
                UniformsLib_js_1.UniformsLib.metalnessmap,
                UniformsLib_js_1.UniformsLib.fog,
                UniformsLib_js_1.UniformsLib.lights,
                {
                    emissive: { value: new Color_js_1.Color(0x000000) },
                    roughness: { value: 1.0 },
                    metalness: { value: 0.0 },
                    envMapIntensity: { value: 1 } // temporary
                }
            ]),
            vertexShader: ShaderChunk_js_1.ShaderChunk.meshphysical_vert,
            fragmentShader: ShaderChunk_js_1.ShaderChunk.meshphysical_frag
        },
        toon: {
            uniforms: UniformsUtils_js_1.mergeUniforms([
                UniformsLib_js_1.UniformsLib.common,
                UniformsLib_js_1.UniformsLib.aomap,
                UniformsLib_js_1.UniformsLib.lightmap,
                UniformsLib_js_1.UniformsLib.emissivemap,
                UniformsLib_js_1.UniformsLib.bumpmap,
                UniformsLib_js_1.UniformsLib.normalmap,
                UniformsLib_js_1.UniformsLib.displacementmap,
                UniformsLib_js_1.UniformsLib.gradientmap,
                UniformsLib_js_1.UniformsLib.fog,
                UniformsLib_js_1.UniformsLib.lights,
                {
                    emissive: { value: new Color_js_1.Color(0x000000) }
                }
            ]),
            vertexShader: ShaderChunk_js_1.ShaderChunk.meshtoon_vert,
            fragmentShader: ShaderChunk_js_1.ShaderChunk.meshtoon_frag
        },
        matcap: {
            uniforms: UniformsUtils_js_1.mergeUniforms([
                UniformsLib_js_1.UniformsLib.common,
                UniformsLib_js_1.UniformsLib.bumpmap,
                UniformsLib_js_1.UniformsLib.normalmap,
                UniformsLib_js_1.UniformsLib.displacementmap,
                UniformsLib_js_1.UniformsLib.fog,
                {
                    matcap: { value: null }
                }
            ]),
            vertexShader: ShaderChunk_js_1.ShaderChunk.meshmatcap_vert,
            fragmentShader: ShaderChunk_js_1.ShaderChunk.meshmatcap_frag
        },
        points: {
            uniforms: UniformsUtils_js_1.mergeUniforms([
                UniformsLib_js_1.UniformsLib.points,
                UniformsLib_js_1.UniformsLib.fog
            ]),
            vertexShader: ShaderChunk_js_1.ShaderChunk.points_vert,
            fragmentShader: ShaderChunk_js_1.ShaderChunk.points_frag
        },
        dashed: {
            uniforms: UniformsUtils_js_1.mergeUniforms([
                UniformsLib_js_1.UniformsLib.common,
                UniformsLib_js_1.UniformsLib.fog,
                {
                    scale: { value: 1 },
                    dashSize: { value: 1 },
                    totalSize: { value: 2 }
                }
            ]),
            vertexShader: ShaderChunk_js_1.ShaderChunk.linedashed_vert,
            fragmentShader: ShaderChunk_js_1.ShaderChunk.linedashed_frag
        },
        depth: {
            uniforms: UniformsUtils_js_1.mergeUniforms([
                UniformsLib_js_1.UniformsLib.common,
                UniformsLib_js_1.UniformsLib.displacementmap
            ]),
            vertexShader: ShaderChunk_js_1.ShaderChunk.depth_vert,
            fragmentShader: ShaderChunk_js_1.ShaderChunk.depth_frag
        },
        normal: {
            uniforms: UniformsUtils_js_1.mergeUniforms([
                UniformsLib_js_1.UniformsLib.common,
                UniformsLib_js_1.UniformsLib.bumpmap,
                UniformsLib_js_1.UniformsLib.normalmap,
                UniformsLib_js_1.UniformsLib.displacementmap,
                {
                    opacity: { value: 1.0 }
                }
            ]),
            vertexShader: ShaderChunk_js_1.ShaderChunk.normal_vert,
            fragmentShader: ShaderChunk_js_1.ShaderChunk.normal_frag
        },
        sprite: {
            uniforms: UniformsUtils_js_1.mergeUniforms([
                UniformsLib_js_1.UniformsLib.sprite,
                UniformsLib_js_1.UniformsLib.fog
            ]),
            vertexShader: ShaderChunk_js_1.ShaderChunk.sprite_vert,
            fragmentShader: ShaderChunk_js_1.ShaderChunk.sprite_frag
        },
        background: {
            uniforms: {
                uvTransform: { value: new Matrix3_js_1.Matrix3() },
                t2D: { value: null },
            },
            vertexShader: ShaderChunk_js_1.ShaderChunk.background_vert,
            fragmentShader: ShaderChunk_js_1.ShaderChunk.background_frag
        },
        /* -------------------------------------------------------------------------
        //	Cube map shader
         ------------------------------------------------------------------------- */
        cube: {
            uniforms: UniformsUtils_js_1.mergeUniforms([
                UniformsLib_js_1.UniformsLib.envmap,
                {
                    opacity: { value: 1.0 }
                }
            ]),
            vertexShader: ShaderChunk_js_1.ShaderChunk.cube_vert,
            fragmentShader: ShaderChunk_js_1.ShaderChunk.cube_frag
        },
        equirect: {
            uniforms: {
                tEquirect: { value: null },
            },
            vertexShader: ShaderChunk_js_1.ShaderChunk.equirect_vert,
            fragmentShader: ShaderChunk_js_1.ShaderChunk.equirect_frag
        },
        distanceRGBA: {
            uniforms: UniformsUtils_js_1.mergeUniforms([
                UniformsLib_js_1.UniformsLib.common,
                UniformsLib_js_1.UniformsLib.displacementmap,
                {
                    referencePosition: { value: new Vector3_js_1.Vector3() },
                    nearDistance: { value: 1 },
                    farDistance: { value: 1000 }
                }
            ]),
            vertexShader: ShaderChunk_js_1.ShaderChunk.distanceRGBA_vert,
            fragmentShader: ShaderChunk_js_1.ShaderChunk.distanceRGBA_frag
        },
        shadow: {
            uniforms: UniformsUtils_js_1.mergeUniforms([
                UniformsLib_js_1.UniformsLib.lights,
                UniformsLib_js_1.UniformsLib.fog,
                {
                    color: { value: new Color_js_1.Color(0x00000) },
                    opacity: { value: 1.0 }
                },
            ]),
            vertexShader: ShaderChunk_js_1.ShaderChunk.shadow_vert,
            fragmentShader: ShaderChunk_js_1.ShaderChunk.shadow_frag
        }
    };
    exports.ShaderLib = ShaderLib;
    ShaderLib.physical = {
        uniforms: UniformsUtils_js_1.mergeUniforms([
            ShaderLib.standard.uniforms,
            {
                clearcoat: { value: 0 },
                clearcoatMap: { value: null },
                clearcoatRoughness: { value: 0 },
                clearcoatRoughnessMap: { value: null },
                clearcoatNormalScale: { value: new Vector2_js_1.Vector2(1, 1) },
                clearcoatNormalMap: { value: null },
                sheen: { value: new Color_js_1.Color(0x000000) },
                transmission: { value: 0 },
                transmissionMap: { value: null },
            }
        ]),
        vertexShader: ShaderChunk_js_1.ShaderChunk.meshphysical_vert,
        fragmentShader: ShaderChunk_js_1.ShaderChunk.meshphysical_frag
    };
});
//# sourceMappingURL=ShaderLib.js.map