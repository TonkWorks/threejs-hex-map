define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WATER_FRAGMENT_SHADER = void 0;
    exports.WATER_FRAGMENT_SHADER = `
// WATER_FRAGMENT_SHADER.glsl
precision mediump float;

uniform float sineTime;
uniform float showGrid;
uniform float zoom;
uniform sampler2D texture;
uniform sampler2D hillsNormal;
uniform sampler2D coastAtlas;
uniform sampler2D riverAtlas;
uniform sampler2D mapTexture;
uniform sampler2D transitionTexture;
uniform mat3 normalMatrix;

uniform vec3 gridColor;
uniform float gridWidth;
uniform float gridOpacity;

uniform vec4 textureAtlasMeta;

// --- NEW UNIFORMS FOR WATER DEPTH COLORING ---
uniform float minWaterHeight;  // e.g. -5.0 (deepest water)
uniform float maxWaterHeight;  // e.g. 0.0  (shallow water)
uniform vec3 deepWaterColor;   // e.g. dark blue (0x001133)
uniform vec3 shallowWaterColor;// e.g. lighter blue (0x3366ff)

varying vec2 vUV;
varying vec2 vTexCoord;
varying vec3 vPosition;
varying float vExtra;
varying float vTerrain;
varying float vFogOfWar;
varying float vHill;
varying float vHidden;
varying vec2 vOffset;
varying vec2 vCoastTextureCell;
varying vec2 vRiverTextureCell;
varying vec3 vLightDirT;
varying vec3 vNeighborsEast;
varying vec3 vNeighborsWest;
varying float vTileHeight;  // passed from vertex shader

const vec3 cameraPos = vec3(0, -25.0, 25.0);
const vec3 lightDir = vec3(0.0, -1.0, -1.0);
const vec3 lightAmbient = vec3(0.3, 0.3, 0.3);
const vec3 lightDiffuse = vec3(1.3, 1.3, 1.3);

const float hillsNormalMapScale = 0.3;

vec2 cellIndexToUV(float idx) {
    float atlasWidth = textureAtlasMeta.x;
    float atlasHeight = textureAtlasMeta.y;
    float cellSize = textureAtlasMeta.z;
    float cols = atlasWidth / cellSize - 1e-6;
    float rows = atlasHeight / cellSize;
    float x = mod(idx, cols);
    float y = floor(idx / cols);
    return vec2(x / cols + vUV.x / cols, 1.0 - (y / rows + (1.0 - vUV.y) / rows));
}

vec4 terrainTransition(vec4 inputColor, float terrain, float sector) {
    if (vTerrain <= 1.0 && terrain > 1.0) return inputColor;
    vec2 otherUV = cellIndexToUV(terrain);
    vec2 blendMaskUV = vec2(sector / 6.0 + vUV.x / 6.0, 1.0 - vUV.y / 6.0);
    vec4 color = texture2D(texture, otherUV);
    vec4 blend = texture2D(transitionTexture, blendMaskUV);
    float a = min(blend.r, clamp(terrain - vTerrain, 0.0, 1.0));
    return mix(inputColor, color, a);
}

void main() {
    // Base texture sample from the atlas.
    vec4 texColor = texture2D(texture, vTexCoord);
    vec3 normal = vec3(0.0, 1.0, 0.0);
    vec2 normalMapUV = vPosition.xy * hillsNormalMapScale;

    // Apply terrain transitions from neighboring tiles.
    texColor = terrainTransition(texColor, vNeighborsEast.x, 0.0);
    texColor = terrainTransition(texColor, vNeighborsEast.y, 1.0);
    texColor = terrainTransition(texColor, vNeighborsEast.z, 2.0);
    texColor = terrainTransition(texColor, vNeighborsWest.x, 3.0);
    texColor = terrainTransition(texColor, vNeighborsWest.y, 4.0);
    texColor = terrainTransition(texColor, vNeighborsWest.z, 5.0);

    // For hill tiles, sample and blend a normal map.
    if (vHill > 0.0) {
        normal = normalize((texture2D(hillsNormal, normalMapUV).xyz * 2.0) - 1.0);
        normal = mix(normal, vec3(0.0, 1.0, 0.0), vExtra * vExtra * vExtra);
    }
    
    // --- NEW: For water tiles (non-hills), use tileHeight to tint the color.
    // (Assuming water tiles have vHill == 0.0)
    if (vHill < 0.5) {
        // Compute a factor in [0, 1] where 0 = deep and 1 = shallow.
        float depthFactor = clamp((vTileHeight - minWaterHeight) / (maxWaterHeight - minWaterHeight), 0.0, 1.0);
        // Mix between a deep-water color and a shallow-water color.
        vec3 waterColor = mix(deepWaterColor, shallowWaterColor, depthFactor);
        // Blend the sampled texture with the water color.
        texColor.rgb = mix(texColor.rgb, waterColor, 0.8);
    }

    // Lighting
    float lambertian = max(dot(vLightDirT, normal), 0.0);
    vec3 color = lightAmbient * texColor.xyz + lambertian * texColor.xyz * lightDiffuse;
    gl_FragColor = vec4(color, 1.0);
    
    // Coast overlay
    vec2 coastUv = vec2(vCoastTextureCell.x / 8.0 + vUV.x / 8.0, 1.0 - (vCoastTextureCell.y / 8.0 + vUV.y / 8.0));
    vec4 coastColor = texture2D(coastAtlas, coastUv);
    if (coastColor.w > 0.0) {
        vec3 coast = lightAmbient * coastColor.xyz + lambertian * coastColor.xyz * lightDiffuse;
        gl_FragColor = mix(gl_FragColor, vec4(coast, 1.0), coastColor.w);
    }
    
    // River overlay
    vec2 riverUv = vec2(vRiverTextureCell.x / 8.0 + vUV.x / 8.0, 1.0 - (vRiverTextureCell.y / 8.0 + vUV.y / 8.0));
    vec4 riverColor = texture2D(riverAtlas, riverUv);
    if (riverColor.w > 0.0) {
        vec3 river = lightAmbient * riverColor.xyz + lambertian * riverColor.xyz * lightDiffuse;
        gl_FragColor = mix(gl_FragColor, vec4(river, 1.0), riverColor.w);
    }

    // Grid lines (if enabled)
    if (showGrid > 0.0 && vExtra > 1.0 - gridWidth) {
        gl_FragColor = mix(vec4(gridColor, 1.0), gl_FragColor, 1.0 - gridOpacity);
    }

    // Fog of war
    gl_FragColor = gl_FragColor * (vFogOfWar > 0.0 && vHidden == 0.0 ? 0.66 : 1.0);

    // For hidden tiles, show a map texture.
    if (vHidden > 0.0) {
        gl_FragColor = texture2D(mapTexture, vec2(vPosition.x * 0.05, vPosition.y * 0.05));
    }    
}
`;
});
//# sourceMappingURL=water.fragment.js.map