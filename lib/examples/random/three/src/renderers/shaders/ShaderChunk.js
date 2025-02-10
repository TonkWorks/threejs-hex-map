var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./ShaderChunk/alphamap_fragment.glsl.js", "./ShaderChunk/alphamap_pars_fragment.glsl.js", "./ShaderChunk/alphatest_fragment.glsl.js", "./ShaderChunk/aomap_fragment.glsl.js", "./ShaderChunk/aomap_pars_fragment.glsl.js", "./ShaderChunk/begin_vertex.glsl.js", "./ShaderChunk/beginnormal_vertex.glsl.js", "./ShaderChunk/bsdfs.glsl.js", "./ShaderChunk/bumpmap_pars_fragment.glsl.js", "./ShaderChunk/clipping_planes_fragment.glsl.js", "./ShaderChunk/clipping_planes_pars_fragment.glsl.js", "./ShaderChunk/clipping_planes_pars_vertex.glsl.js", "./ShaderChunk/clipping_planes_vertex.glsl.js", "./ShaderChunk/color_fragment.glsl.js", "./ShaderChunk/color_pars_fragment.glsl.js", "./ShaderChunk/color_pars_vertex.glsl.js", "./ShaderChunk/color_vertex.glsl.js", "./ShaderChunk/common.glsl.js", "./ShaderChunk/cube_uv_reflection_fragment.glsl.js", "./ShaderChunk/defaultnormal_vertex.glsl.js", "./ShaderChunk/displacementmap_pars_vertex.glsl.js", "./ShaderChunk/displacementmap_vertex.glsl.js", "./ShaderChunk/emissivemap_fragment.glsl.js", "./ShaderChunk/emissivemap_pars_fragment.glsl.js", "./ShaderChunk/encodings_fragment.glsl.js", "./ShaderChunk/encodings_pars_fragment.glsl.js", "./ShaderChunk/envmap_fragment.glsl.js", "./ShaderChunk/envmap_common_pars_fragment.glsl.js", "./ShaderChunk/envmap_pars_fragment.glsl.js", "./ShaderChunk/envmap_pars_vertex.glsl.js", "./ShaderChunk/envmap_vertex.glsl.js", "./ShaderChunk/fog_vertex.glsl.js", "./ShaderChunk/fog_pars_vertex.glsl.js", "./ShaderChunk/fog_fragment.glsl.js", "./ShaderChunk/fog_pars_fragment.glsl.js", "./ShaderChunk/gradientmap_pars_fragment.glsl.js", "./ShaderChunk/lightmap_fragment.glsl.js", "./ShaderChunk/lightmap_pars_fragment.glsl.js", "./ShaderChunk/lights_lambert_vertex.glsl.js", "./ShaderChunk/lights_pars_begin.glsl.js", "./ShaderChunk/envmap_physical_pars_fragment.glsl.js", "./ShaderChunk/lights_toon_fragment.glsl.js", "./ShaderChunk/lights_toon_pars_fragment.glsl.js", "./ShaderChunk/lights_phong_fragment.glsl.js", "./ShaderChunk/lights_phong_pars_fragment.glsl.js", "./ShaderChunk/lights_physical_fragment.glsl.js", "./ShaderChunk/lights_physical_pars_fragment.glsl.js", "./ShaderChunk/lights_fragment_begin.glsl.js", "./ShaderChunk/lights_fragment_maps.glsl.js", "./ShaderChunk/lights_fragment_end.glsl.js", "./ShaderChunk/logdepthbuf_fragment.glsl.js", "./ShaderChunk/logdepthbuf_pars_fragment.glsl.js", "./ShaderChunk/logdepthbuf_pars_vertex.glsl.js", "./ShaderChunk/logdepthbuf_vertex.glsl.js", "./ShaderChunk/map_fragment.glsl.js", "./ShaderChunk/map_pars_fragment.glsl.js", "./ShaderChunk/map_particle_fragment.glsl.js", "./ShaderChunk/map_particle_pars_fragment.glsl.js", "./ShaderChunk/metalnessmap_fragment.glsl.js", "./ShaderChunk/metalnessmap_pars_fragment.glsl.js", "./ShaderChunk/morphnormal_vertex.glsl.js", "./ShaderChunk/morphtarget_pars_vertex.glsl.js", "./ShaderChunk/morphtarget_vertex.glsl.js", "./ShaderChunk/normal_fragment_begin.glsl.js", "./ShaderChunk/normal_fragment_maps.glsl.js", "./ShaderChunk/normalmap_pars_fragment.glsl.js", "./ShaderChunk/clearcoat_normal_fragment_begin.glsl.js", "./ShaderChunk/clearcoat_normal_fragment_maps.glsl.js", "./ShaderChunk/clearcoat_pars_fragment.glsl.js", "./ShaderChunk/packing.glsl.js", "./ShaderChunk/premultiplied_alpha_fragment.glsl.js", "./ShaderChunk/project_vertex.glsl.js", "./ShaderChunk/dithering_fragment.glsl.js", "./ShaderChunk/dithering_pars_fragment.glsl.js", "./ShaderChunk/roughnessmap_fragment.glsl.js", "./ShaderChunk/roughnessmap_pars_fragment.glsl.js", "./ShaderChunk/shadowmap_pars_fragment.glsl.js", "./ShaderChunk/shadowmap_pars_vertex.glsl.js", "./ShaderChunk/shadowmap_vertex.glsl.js", "./ShaderChunk/shadowmask_pars_fragment.glsl.js", "./ShaderChunk/skinbase_vertex.glsl.js", "./ShaderChunk/skinning_pars_vertex.glsl.js", "./ShaderChunk/skinning_vertex.glsl.js", "./ShaderChunk/skinnormal_vertex.glsl.js", "./ShaderChunk/specularmap_fragment.glsl.js", "./ShaderChunk/specularmap_pars_fragment.glsl.js", "./ShaderChunk/tonemapping_fragment.glsl.js", "./ShaderChunk/tonemapping_pars_fragment.glsl.js", "./ShaderChunk/transmissionmap_fragment.glsl.js", "./ShaderChunk/transmissionmap_pars_fragment.glsl.js", "./ShaderChunk/uv_pars_fragment.glsl.js", "./ShaderChunk/uv_pars_vertex.glsl.js", "./ShaderChunk/uv_vertex.glsl.js", "./ShaderChunk/uv2_pars_fragment.glsl.js", "./ShaderChunk/uv2_pars_vertex.glsl.js", "./ShaderChunk/uv2_vertex.glsl.js", "./ShaderChunk/worldpos_vertex.glsl.js", "./ShaderLib/background_frag.glsl.js", "./ShaderLib/background_vert.glsl.js", "./ShaderLib/cube_frag.glsl.js", "./ShaderLib/cube_vert.glsl.js", "./ShaderLib/depth_frag.glsl.js", "./ShaderLib/depth_vert.glsl.js", "./ShaderLib/distanceRGBA_frag.glsl.js", "./ShaderLib/distanceRGBA_vert.glsl.js", "./ShaderLib/equirect_frag.glsl.js", "./ShaderLib/equirect_vert.glsl.js", "./ShaderLib/linedashed_frag.glsl.js", "./ShaderLib/linedashed_vert.glsl.js", "./ShaderLib/meshbasic_frag.glsl.js", "./ShaderLib/meshbasic_vert.glsl.js", "./ShaderLib/meshlambert_frag.glsl.js", "./ShaderLib/meshlambert_vert.glsl.js", "./ShaderLib/meshmatcap_frag.glsl.js", "./ShaderLib/meshmatcap_vert.glsl.js", "./ShaderLib/meshtoon_frag.glsl.js", "./ShaderLib/meshtoon_vert.glsl.js", "./ShaderLib/meshphong_frag.glsl.js", "./ShaderLib/meshphong_vert.glsl.js", "./ShaderLib/meshphysical_frag.glsl.js", "./ShaderLib/meshphysical_vert.glsl.js", "./ShaderLib/normal_frag.glsl.js", "./ShaderLib/normal_vert.glsl.js", "./ShaderLib/points_frag.glsl.js", "./ShaderLib/points_vert.glsl.js", "./ShaderLib/shadow_frag.glsl.js", "./ShaderLib/shadow_vert.glsl.js", "./ShaderLib/sprite_frag.glsl.js", "./ShaderLib/sprite_vert.glsl.js"], function (require, exports, alphamap_fragment_glsl_js_1, alphamap_pars_fragment_glsl_js_1, alphatest_fragment_glsl_js_1, aomap_fragment_glsl_js_1, aomap_pars_fragment_glsl_js_1, begin_vertex_glsl_js_1, beginnormal_vertex_glsl_js_1, bsdfs_glsl_js_1, bumpmap_pars_fragment_glsl_js_1, clipping_planes_fragment_glsl_js_1, clipping_planes_pars_fragment_glsl_js_1, clipping_planes_pars_vertex_glsl_js_1, clipping_planes_vertex_glsl_js_1, color_fragment_glsl_js_1, color_pars_fragment_glsl_js_1, color_pars_vertex_glsl_js_1, color_vertex_glsl_js_1, common_glsl_js_1, cube_uv_reflection_fragment_glsl_js_1, defaultnormal_vertex_glsl_js_1, displacementmap_pars_vertex_glsl_js_1, displacementmap_vertex_glsl_js_1, emissivemap_fragment_glsl_js_1, emissivemap_pars_fragment_glsl_js_1, encodings_fragment_glsl_js_1, encodings_pars_fragment_glsl_js_1, envmap_fragment_glsl_js_1, envmap_common_pars_fragment_glsl_js_1, envmap_pars_fragment_glsl_js_1, envmap_pars_vertex_glsl_js_1, envmap_vertex_glsl_js_1, fog_vertex_glsl_js_1, fog_pars_vertex_glsl_js_1, fog_fragment_glsl_js_1, fog_pars_fragment_glsl_js_1, gradientmap_pars_fragment_glsl_js_1, lightmap_fragment_glsl_js_1, lightmap_pars_fragment_glsl_js_1, lights_lambert_vertex_glsl_js_1, lights_pars_begin_glsl_js_1, envmap_physical_pars_fragment_glsl_js_1, lights_toon_fragment_glsl_js_1, lights_toon_pars_fragment_glsl_js_1, lights_phong_fragment_glsl_js_1, lights_phong_pars_fragment_glsl_js_1, lights_physical_fragment_glsl_js_1, lights_physical_pars_fragment_glsl_js_1, lights_fragment_begin_glsl_js_1, lights_fragment_maps_glsl_js_1, lights_fragment_end_glsl_js_1, logdepthbuf_fragment_glsl_js_1, logdepthbuf_pars_fragment_glsl_js_1, logdepthbuf_pars_vertex_glsl_js_1, logdepthbuf_vertex_glsl_js_1, map_fragment_glsl_js_1, map_pars_fragment_glsl_js_1, map_particle_fragment_glsl_js_1, map_particle_pars_fragment_glsl_js_1, metalnessmap_fragment_glsl_js_1, metalnessmap_pars_fragment_glsl_js_1, morphnormal_vertex_glsl_js_1, morphtarget_pars_vertex_glsl_js_1, morphtarget_vertex_glsl_js_1, normal_fragment_begin_glsl_js_1, normal_fragment_maps_glsl_js_1, normalmap_pars_fragment_glsl_js_1, clearcoat_normal_fragment_begin_glsl_js_1, clearcoat_normal_fragment_maps_glsl_js_1, clearcoat_pars_fragment_glsl_js_1, packing_glsl_js_1, premultiplied_alpha_fragment_glsl_js_1, project_vertex_glsl_js_1, dithering_fragment_glsl_js_1, dithering_pars_fragment_glsl_js_1, roughnessmap_fragment_glsl_js_1, roughnessmap_pars_fragment_glsl_js_1, shadowmap_pars_fragment_glsl_js_1, shadowmap_pars_vertex_glsl_js_1, shadowmap_vertex_glsl_js_1, shadowmask_pars_fragment_glsl_js_1, skinbase_vertex_glsl_js_1, skinning_pars_vertex_glsl_js_1, skinning_vertex_glsl_js_1, skinnormal_vertex_glsl_js_1, specularmap_fragment_glsl_js_1, specularmap_pars_fragment_glsl_js_1, tonemapping_fragment_glsl_js_1, tonemapping_pars_fragment_glsl_js_1, transmissionmap_fragment_glsl_js_1, transmissionmap_pars_fragment_glsl_js_1, uv_pars_fragment_glsl_js_1, uv_pars_vertex_glsl_js_1, uv_vertex_glsl_js_1, uv2_pars_fragment_glsl_js_1, uv2_pars_vertex_glsl_js_1, uv2_vertex_glsl_js_1, worldpos_vertex_glsl_js_1, background_frag_glsl_js_1, background_vert_glsl_js_1, cube_frag_glsl_js_1, cube_vert_glsl_js_1, depth_frag_glsl_js_1, depth_vert_glsl_js_1, distanceRGBA_frag_glsl_js_1, distanceRGBA_vert_glsl_js_1, equirect_frag_glsl_js_1, equirect_vert_glsl_js_1, linedashed_frag_glsl_js_1, linedashed_vert_glsl_js_1, meshbasic_frag_glsl_js_1, meshbasic_vert_glsl_js_1, meshlambert_frag_glsl_js_1, meshlambert_vert_glsl_js_1, meshmatcap_frag_glsl_js_1, meshmatcap_vert_glsl_js_1, meshtoon_frag_glsl_js_1, meshtoon_vert_glsl_js_1, meshphong_frag_glsl_js_1, meshphong_vert_glsl_js_1, meshphysical_frag_glsl_js_1, meshphysical_vert_glsl_js_1, normal_frag_glsl_js_1, normal_vert_glsl_js_1, points_frag_glsl_js_1, points_vert_glsl_js_1, shadow_frag_glsl_js_1, shadow_vert_glsl_js_1, sprite_frag_glsl_js_1, sprite_vert_glsl_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    alphamap_fragment_glsl_js_1 = __importDefault(alphamap_fragment_glsl_js_1);
    alphamap_pars_fragment_glsl_js_1 = __importDefault(alphamap_pars_fragment_glsl_js_1);
    alphatest_fragment_glsl_js_1 = __importDefault(alphatest_fragment_glsl_js_1);
    aomap_fragment_glsl_js_1 = __importDefault(aomap_fragment_glsl_js_1);
    aomap_pars_fragment_glsl_js_1 = __importDefault(aomap_pars_fragment_glsl_js_1);
    begin_vertex_glsl_js_1 = __importDefault(begin_vertex_glsl_js_1);
    beginnormal_vertex_glsl_js_1 = __importDefault(beginnormal_vertex_glsl_js_1);
    bsdfs_glsl_js_1 = __importDefault(bsdfs_glsl_js_1);
    bumpmap_pars_fragment_glsl_js_1 = __importDefault(bumpmap_pars_fragment_glsl_js_1);
    clipping_planes_fragment_glsl_js_1 = __importDefault(clipping_planes_fragment_glsl_js_1);
    clipping_planes_pars_fragment_glsl_js_1 = __importDefault(clipping_planes_pars_fragment_glsl_js_1);
    clipping_planes_pars_vertex_glsl_js_1 = __importDefault(clipping_planes_pars_vertex_glsl_js_1);
    clipping_planes_vertex_glsl_js_1 = __importDefault(clipping_planes_vertex_glsl_js_1);
    color_fragment_glsl_js_1 = __importDefault(color_fragment_glsl_js_1);
    color_pars_fragment_glsl_js_1 = __importDefault(color_pars_fragment_glsl_js_1);
    color_pars_vertex_glsl_js_1 = __importDefault(color_pars_vertex_glsl_js_1);
    color_vertex_glsl_js_1 = __importDefault(color_vertex_glsl_js_1);
    common_glsl_js_1 = __importDefault(common_glsl_js_1);
    cube_uv_reflection_fragment_glsl_js_1 = __importDefault(cube_uv_reflection_fragment_glsl_js_1);
    defaultnormal_vertex_glsl_js_1 = __importDefault(defaultnormal_vertex_glsl_js_1);
    displacementmap_pars_vertex_glsl_js_1 = __importDefault(displacementmap_pars_vertex_glsl_js_1);
    displacementmap_vertex_glsl_js_1 = __importDefault(displacementmap_vertex_glsl_js_1);
    emissivemap_fragment_glsl_js_1 = __importDefault(emissivemap_fragment_glsl_js_1);
    emissivemap_pars_fragment_glsl_js_1 = __importDefault(emissivemap_pars_fragment_glsl_js_1);
    encodings_fragment_glsl_js_1 = __importDefault(encodings_fragment_glsl_js_1);
    encodings_pars_fragment_glsl_js_1 = __importDefault(encodings_pars_fragment_glsl_js_1);
    envmap_fragment_glsl_js_1 = __importDefault(envmap_fragment_glsl_js_1);
    envmap_common_pars_fragment_glsl_js_1 = __importDefault(envmap_common_pars_fragment_glsl_js_1);
    envmap_pars_fragment_glsl_js_1 = __importDefault(envmap_pars_fragment_glsl_js_1);
    envmap_pars_vertex_glsl_js_1 = __importDefault(envmap_pars_vertex_glsl_js_1);
    envmap_vertex_glsl_js_1 = __importDefault(envmap_vertex_glsl_js_1);
    fog_vertex_glsl_js_1 = __importDefault(fog_vertex_glsl_js_1);
    fog_pars_vertex_glsl_js_1 = __importDefault(fog_pars_vertex_glsl_js_1);
    fog_fragment_glsl_js_1 = __importDefault(fog_fragment_glsl_js_1);
    fog_pars_fragment_glsl_js_1 = __importDefault(fog_pars_fragment_glsl_js_1);
    gradientmap_pars_fragment_glsl_js_1 = __importDefault(gradientmap_pars_fragment_glsl_js_1);
    lightmap_fragment_glsl_js_1 = __importDefault(lightmap_fragment_glsl_js_1);
    lightmap_pars_fragment_glsl_js_1 = __importDefault(lightmap_pars_fragment_glsl_js_1);
    lights_lambert_vertex_glsl_js_1 = __importDefault(lights_lambert_vertex_glsl_js_1);
    lights_pars_begin_glsl_js_1 = __importDefault(lights_pars_begin_glsl_js_1);
    envmap_physical_pars_fragment_glsl_js_1 = __importDefault(envmap_physical_pars_fragment_glsl_js_1);
    lights_toon_fragment_glsl_js_1 = __importDefault(lights_toon_fragment_glsl_js_1);
    lights_toon_pars_fragment_glsl_js_1 = __importDefault(lights_toon_pars_fragment_glsl_js_1);
    lights_phong_fragment_glsl_js_1 = __importDefault(lights_phong_fragment_glsl_js_1);
    lights_phong_pars_fragment_glsl_js_1 = __importDefault(lights_phong_pars_fragment_glsl_js_1);
    lights_physical_fragment_glsl_js_1 = __importDefault(lights_physical_fragment_glsl_js_1);
    lights_physical_pars_fragment_glsl_js_1 = __importDefault(lights_physical_pars_fragment_glsl_js_1);
    lights_fragment_begin_glsl_js_1 = __importDefault(lights_fragment_begin_glsl_js_1);
    lights_fragment_maps_glsl_js_1 = __importDefault(lights_fragment_maps_glsl_js_1);
    lights_fragment_end_glsl_js_1 = __importDefault(lights_fragment_end_glsl_js_1);
    logdepthbuf_fragment_glsl_js_1 = __importDefault(logdepthbuf_fragment_glsl_js_1);
    logdepthbuf_pars_fragment_glsl_js_1 = __importDefault(logdepthbuf_pars_fragment_glsl_js_1);
    logdepthbuf_pars_vertex_glsl_js_1 = __importDefault(logdepthbuf_pars_vertex_glsl_js_1);
    logdepthbuf_vertex_glsl_js_1 = __importDefault(logdepthbuf_vertex_glsl_js_1);
    map_fragment_glsl_js_1 = __importDefault(map_fragment_glsl_js_1);
    map_pars_fragment_glsl_js_1 = __importDefault(map_pars_fragment_glsl_js_1);
    map_particle_fragment_glsl_js_1 = __importDefault(map_particle_fragment_glsl_js_1);
    map_particle_pars_fragment_glsl_js_1 = __importDefault(map_particle_pars_fragment_glsl_js_1);
    metalnessmap_fragment_glsl_js_1 = __importDefault(metalnessmap_fragment_glsl_js_1);
    metalnessmap_pars_fragment_glsl_js_1 = __importDefault(metalnessmap_pars_fragment_glsl_js_1);
    morphnormal_vertex_glsl_js_1 = __importDefault(morphnormal_vertex_glsl_js_1);
    morphtarget_pars_vertex_glsl_js_1 = __importDefault(morphtarget_pars_vertex_glsl_js_1);
    morphtarget_vertex_glsl_js_1 = __importDefault(morphtarget_vertex_glsl_js_1);
    normal_fragment_begin_glsl_js_1 = __importDefault(normal_fragment_begin_glsl_js_1);
    normal_fragment_maps_glsl_js_1 = __importDefault(normal_fragment_maps_glsl_js_1);
    normalmap_pars_fragment_glsl_js_1 = __importDefault(normalmap_pars_fragment_glsl_js_1);
    clearcoat_normal_fragment_begin_glsl_js_1 = __importDefault(clearcoat_normal_fragment_begin_glsl_js_1);
    clearcoat_normal_fragment_maps_glsl_js_1 = __importDefault(clearcoat_normal_fragment_maps_glsl_js_1);
    clearcoat_pars_fragment_glsl_js_1 = __importDefault(clearcoat_pars_fragment_glsl_js_1);
    packing_glsl_js_1 = __importDefault(packing_glsl_js_1);
    premultiplied_alpha_fragment_glsl_js_1 = __importDefault(premultiplied_alpha_fragment_glsl_js_1);
    project_vertex_glsl_js_1 = __importDefault(project_vertex_glsl_js_1);
    dithering_fragment_glsl_js_1 = __importDefault(dithering_fragment_glsl_js_1);
    dithering_pars_fragment_glsl_js_1 = __importDefault(dithering_pars_fragment_glsl_js_1);
    roughnessmap_fragment_glsl_js_1 = __importDefault(roughnessmap_fragment_glsl_js_1);
    roughnessmap_pars_fragment_glsl_js_1 = __importDefault(roughnessmap_pars_fragment_glsl_js_1);
    shadowmap_pars_fragment_glsl_js_1 = __importDefault(shadowmap_pars_fragment_glsl_js_1);
    shadowmap_pars_vertex_glsl_js_1 = __importDefault(shadowmap_pars_vertex_glsl_js_1);
    shadowmap_vertex_glsl_js_1 = __importDefault(shadowmap_vertex_glsl_js_1);
    shadowmask_pars_fragment_glsl_js_1 = __importDefault(shadowmask_pars_fragment_glsl_js_1);
    skinbase_vertex_glsl_js_1 = __importDefault(skinbase_vertex_glsl_js_1);
    skinning_pars_vertex_glsl_js_1 = __importDefault(skinning_pars_vertex_glsl_js_1);
    skinning_vertex_glsl_js_1 = __importDefault(skinning_vertex_glsl_js_1);
    skinnormal_vertex_glsl_js_1 = __importDefault(skinnormal_vertex_glsl_js_1);
    specularmap_fragment_glsl_js_1 = __importDefault(specularmap_fragment_glsl_js_1);
    specularmap_pars_fragment_glsl_js_1 = __importDefault(specularmap_pars_fragment_glsl_js_1);
    tonemapping_fragment_glsl_js_1 = __importDefault(tonemapping_fragment_glsl_js_1);
    tonemapping_pars_fragment_glsl_js_1 = __importDefault(tonemapping_pars_fragment_glsl_js_1);
    transmissionmap_fragment_glsl_js_1 = __importDefault(transmissionmap_fragment_glsl_js_1);
    transmissionmap_pars_fragment_glsl_js_1 = __importDefault(transmissionmap_pars_fragment_glsl_js_1);
    uv_pars_fragment_glsl_js_1 = __importDefault(uv_pars_fragment_glsl_js_1);
    uv_pars_vertex_glsl_js_1 = __importDefault(uv_pars_vertex_glsl_js_1);
    uv_vertex_glsl_js_1 = __importDefault(uv_vertex_glsl_js_1);
    uv2_pars_fragment_glsl_js_1 = __importDefault(uv2_pars_fragment_glsl_js_1);
    uv2_pars_vertex_glsl_js_1 = __importDefault(uv2_pars_vertex_glsl_js_1);
    uv2_vertex_glsl_js_1 = __importDefault(uv2_vertex_glsl_js_1);
    worldpos_vertex_glsl_js_1 = __importDefault(worldpos_vertex_glsl_js_1);
    background_frag_glsl_js_1 = __importDefault(background_frag_glsl_js_1);
    background_vert_glsl_js_1 = __importDefault(background_vert_glsl_js_1);
    cube_frag_glsl_js_1 = __importDefault(cube_frag_glsl_js_1);
    cube_vert_glsl_js_1 = __importDefault(cube_vert_glsl_js_1);
    depth_frag_glsl_js_1 = __importDefault(depth_frag_glsl_js_1);
    depth_vert_glsl_js_1 = __importDefault(depth_vert_glsl_js_1);
    distanceRGBA_frag_glsl_js_1 = __importDefault(distanceRGBA_frag_glsl_js_1);
    distanceRGBA_vert_glsl_js_1 = __importDefault(distanceRGBA_vert_glsl_js_1);
    equirect_frag_glsl_js_1 = __importDefault(equirect_frag_glsl_js_1);
    equirect_vert_glsl_js_1 = __importDefault(equirect_vert_glsl_js_1);
    linedashed_frag_glsl_js_1 = __importDefault(linedashed_frag_glsl_js_1);
    linedashed_vert_glsl_js_1 = __importDefault(linedashed_vert_glsl_js_1);
    meshbasic_frag_glsl_js_1 = __importDefault(meshbasic_frag_glsl_js_1);
    meshbasic_vert_glsl_js_1 = __importDefault(meshbasic_vert_glsl_js_1);
    meshlambert_frag_glsl_js_1 = __importDefault(meshlambert_frag_glsl_js_1);
    meshlambert_vert_glsl_js_1 = __importDefault(meshlambert_vert_glsl_js_1);
    meshmatcap_frag_glsl_js_1 = __importDefault(meshmatcap_frag_glsl_js_1);
    meshmatcap_vert_glsl_js_1 = __importDefault(meshmatcap_vert_glsl_js_1);
    meshtoon_frag_glsl_js_1 = __importDefault(meshtoon_frag_glsl_js_1);
    meshtoon_vert_glsl_js_1 = __importDefault(meshtoon_vert_glsl_js_1);
    meshphong_frag_glsl_js_1 = __importDefault(meshphong_frag_glsl_js_1);
    meshphong_vert_glsl_js_1 = __importDefault(meshphong_vert_glsl_js_1);
    meshphysical_frag_glsl_js_1 = __importDefault(meshphysical_frag_glsl_js_1);
    meshphysical_vert_glsl_js_1 = __importDefault(meshphysical_vert_glsl_js_1);
    normal_frag_glsl_js_1 = __importDefault(normal_frag_glsl_js_1);
    normal_vert_glsl_js_1 = __importDefault(normal_vert_glsl_js_1);
    points_frag_glsl_js_1 = __importDefault(points_frag_glsl_js_1);
    points_vert_glsl_js_1 = __importDefault(points_vert_glsl_js_1);
    shadow_frag_glsl_js_1 = __importDefault(shadow_frag_glsl_js_1);
    shadow_vert_glsl_js_1 = __importDefault(shadow_vert_glsl_js_1);
    sprite_frag_glsl_js_1 = __importDefault(sprite_frag_glsl_js_1);
    sprite_vert_glsl_js_1 = __importDefault(sprite_vert_glsl_js_1);
    exports.ShaderChunk = {
        alphamap_fragment: alphamap_fragment_glsl_js_1.default,
        alphamap_pars_fragment: alphamap_pars_fragment_glsl_js_1.default,
        alphatest_fragment: alphatest_fragment_glsl_js_1.default,
        aomap_fragment: aomap_fragment_glsl_js_1.default,
        aomap_pars_fragment: aomap_pars_fragment_glsl_js_1.default,
        begin_vertex: begin_vertex_glsl_js_1.default,
        beginnormal_vertex: beginnormal_vertex_glsl_js_1.default,
        bsdfs: bsdfs_glsl_js_1.default,
        bumpmap_pars_fragment: bumpmap_pars_fragment_glsl_js_1.default,
        clipping_planes_fragment: clipping_planes_fragment_glsl_js_1.default,
        clipping_planes_pars_fragment: clipping_planes_pars_fragment_glsl_js_1.default,
        clipping_planes_pars_vertex: clipping_planes_pars_vertex_glsl_js_1.default,
        clipping_planes_vertex: clipping_planes_vertex_glsl_js_1.default,
        color_fragment: color_fragment_glsl_js_1.default,
        color_pars_fragment: color_pars_fragment_glsl_js_1.default,
        color_pars_vertex: color_pars_vertex_glsl_js_1.default,
        color_vertex: color_vertex_glsl_js_1.default,
        common: common_glsl_js_1.default,
        cube_uv_reflection_fragment: cube_uv_reflection_fragment_glsl_js_1.default,
        defaultnormal_vertex: defaultnormal_vertex_glsl_js_1.default,
        displacementmap_pars_vertex: displacementmap_pars_vertex_glsl_js_1.default,
        displacementmap_vertex: displacementmap_vertex_glsl_js_1.default,
        emissivemap_fragment: emissivemap_fragment_glsl_js_1.default,
        emissivemap_pars_fragment: emissivemap_pars_fragment_glsl_js_1.default,
        encodings_fragment: encodings_fragment_glsl_js_1.default,
        encodings_pars_fragment: encodings_pars_fragment_glsl_js_1.default,
        envmap_fragment: envmap_fragment_glsl_js_1.default,
        envmap_common_pars_fragment: envmap_common_pars_fragment_glsl_js_1.default,
        envmap_pars_fragment: envmap_pars_fragment_glsl_js_1.default,
        envmap_pars_vertex: envmap_pars_vertex_glsl_js_1.default,
        envmap_physical_pars_fragment: envmap_physical_pars_fragment_glsl_js_1.default,
        envmap_vertex: envmap_vertex_glsl_js_1.default,
        fog_vertex: fog_vertex_glsl_js_1.default,
        fog_pars_vertex: fog_pars_vertex_glsl_js_1.default,
        fog_fragment: fog_fragment_glsl_js_1.default,
        fog_pars_fragment: fog_pars_fragment_glsl_js_1.default,
        gradientmap_pars_fragment: gradientmap_pars_fragment_glsl_js_1.default,
        lightmap_fragment: lightmap_fragment_glsl_js_1.default,
        lightmap_pars_fragment: lightmap_pars_fragment_glsl_js_1.default,
        lights_lambert_vertex: lights_lambert_vertex_glsl_js_1.default,
        lights_pars_begin: lights_pars_begin_glsl_js_1.default,
        lights_toon_fragment: lights_toon_fragment_glsl_js_1.default,
        lights_toon_pars_fragment: lights_toon_pars_fragment_glsl_js_1.default,
        lights_phong_fragment: lights_phong_fragment_glsl_js_1.default,
        lights_phong_pars_fragment: lights_phong_pars_fragment_glsl_js_1.default,
        lights_physical_fragment: lights_physical_fragment_glsl_js_1.default,
        lights_physical_pars_fragment: lights_physical_pars_fragment_glsl_js_1.default,
        lights_fragment_begin: lights_fragment_begin_glsl_js_1.default,
        lights_fragment_maps: lights_fragment_maps_glsl_js_1.default,
        lights_fragment_end: lights_fragment_end_glsl_js_1.default,
        logdepthbuf_fragment: logdepthbuf_fragment_glsl_js_1.default,
        logdepthbuf_pars_fragment: logdepthbuf_pars_fragment_glsl_js_1.default,
        logdepthbuf_pars_vertex: logdepthbuf_pars_vertex_glsl_js_1.default,
        logdepthbuf_vertex: logdepthbuf_vertex_glsl_js_1.default,
        map_fragment: map_fragment_glsl_js_1.default,
        map_pars_fragment: map_pars_fragment_glsl_js_1.default,
        map_particle_fragment: map_particle_fragment_glsl_js_1.default,
        map_particle_pars_fragment: map_particle_pars_fragment_glsl_js_1.default,
        metalnessmap_fragment: metalnessmap_fragment_glsl_js_1.default,
        metalnessmap_pars_fragment: metalnessmap_pars_fragment_glsl_js_1.default,
        morphnormal_vertex: morphnormal_vertex_glsl_js_1.default,
        morphtarget_pars_vertex: morphtarget_pars_vertex_glsl_js_1.default,
        morphtarget_vertex: morphtarget_vertex_glsl_js_1.default,
        normal_fragment_begin: normal_fragment_begin_glsl_js_1.default,
        normal_fragment_maps: normal_fragment_maps_glsl_js_1.default,
        normalmap_pars_fragment: normalmap_pars_fragment_glsl_js_1.default,
        clearcoat_normal_fragment_begin: clearcoat_normal_fragment_begin_glsl_js_1.default,
        clearcoat_normal_fragment_maps: clearcoat_normal_fragment_maps_glsl_js_1.default,
        clearcoat_pars_fragment: clearcoat_pars_fragment_glsl_js_1.default,
        packing: packing_glsl_js_1.default,
        premultiplied_alpha_fragment: premultiplied_alpha_fragment_glsl_js_1.default,
        project_vertex: project_vertex_glsl_js_1.default,
        dithering_fragment: dithering_fragment_glsl_js_1.default,
        dithering_pars_fragment: dithering_pars_fragment_glsl_js_1.default,
        roughnessmap_fragment: roughnessmap_fragment_glsl_js_1.default,
        roughnessmap_pars_fragment: roughnessmap_pars_fragment_glsl_js_1.default,
        shadowmap_pars_fragment: shadowmap_pars_fragment_glsl_js_1.default,
        shadowmap_pars_vertex: shadowmap_pars_vertex_glsl_js_1.default,
        shadowmap_vertex: shadowmap_vertex_glsl_js_1.default,
        shadowmask_pars_fragment: shadowmask_pars_fragment_glsl_js_1.default,
        skinbase_vertex: skinbase_vertex_glsl_js_1.default,
        skinning_pars_vertex: skinning_pars_vertex_glsl_js_1.default,
        skinning_vertex: skinning_vertex_glsl_js_1.default,
        skinnormal_vertex: skinnormal_vertex_glsl_js_1.default,
        specularmap_fragment: specularmap_fragment_glsl_js_1.default,
        specularmap_pars_fragment: specularmap_pars_fragment_glsl_js_1.default,
        tonemapping_fragment: tonemapping_fragment_glsl_js_1.default,
        tonemapping_pars_fragment: tonemapping_pars_fragment_glsl_js_1.default,
        transmissionmap_fragment: transmissionmap_fragment_glsl_js_1.default,
        transmissionmap_pars_fragment: transmissionmap_pars_fragment_glsl_js_1.default,
        uv_pars_fragment: uv_pars_fragment_glsl_js_1.default,
        uv_pars_vertex: uv_pars_vertex_glsl_js_1.default,
        uv_vertex: uv_vertex_glsl_js_1.default,
        uv2_pars_fragment: uv2_pars_fragment_glsl_js_1.default,
        uv2_pars_vertex: uv2_pars_vertex_glsl_js_1.default,
        uv2_vertex: uv2_vertex_glsl_js_1.default,
        worldpos_vertex: worldpos_vertex_glsl_js_1.default,
        background_frag: background_frag_glsl_js_1.default,
        background_vert: background_vert_glsl_js_1.default,
        cube_frag: cube_frag_glsl_js_1.default,
        cube_vert: cube_vert_glsl_js_1.default,
        depth_frag: depth_frag_glsl_js_1.default,
        depth_vert: depth_vert_glsl_js_1.default,
        distanceRGBA_frag: distanceRGBA_frag_glsl_js_1.default,
        distanceRGBA_vert: distanceRGBA_vert_glsl_js_1.default,
        equirect_frag: equirect_frag_glsl_js_1.default,
        equirect_vert: equirect_vert_glsl_js_1.default,
        linedashed_frag: linedashed_frag_glsl_js_1.default,
        linedashed_vert: linedashed_vert_glsl_js_1.default,
        meshbasic_frag: meshbasic_frag_glsl_js_1.default,
        meshbasic_vert: meshbasic_vert_glsl_js_1.default,
        meshlambert_frag: meshlambert_frag_glsl_js_1.default,
        meshlambert_vert: meshlambert_vert_glsl_js_1.default,
        meshmatcap_frag: meshmatcap_frag_glsl_js_1.default,
        meshmatcap_vert: meshmatcap_vert_glsl_js_1.default,
        meshtoon_frag: meshtoon_frag_glsl_js_1.default,
        meshtoon_vert: meshtoon_vert_glsl_js_1.default,
        meshphong_frag: meshphong_frag_glsl_js_1.default,
        meshphong_vert: meshphong_vert_glsl_js_1.default,
        meshphysical_frag: meshphysical_frag_glsl_js_1.default,
        meshphysical_vert: meshphysical_vert_glsl_js_1.default,
        normal_frag: normal_frag_glsl_js_1.default,
        normal_vert: normal_vert_glsl_js_1.default,
        points_frag: points_frag_glsl_js_1.default,
        points_vert: points_vert_glsl_js_1.default,
        shadow_frag: shadow_frag_glsl_js_1.default,
        shadow_vert: shadow_vert_glsl_js_1.default,
        sprite_frag: sprite_frag_glsl_js_1.default,
        sprite_vert: sprite_vert_glsl_js_1.default
    };
});
//# sourceMappingURL=ShaderChunk.js.map