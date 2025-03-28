export const LAND_FRAGMENT_SHADER = `
//
// Fragment Shader for Land
//

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

// (width, height, cellSize, cellSpacing)
uniform vec4 textureAtlasMeta;

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

const vec3 cameraPos = vec3(0, -25.0, 25.0);
const vec3 lightDir = vec3(0.0, -1.0, -1.0);
const vec3 lightAmbient = vec3(0.3, 0.3, 0.3);
const vec3 lightDiffuse = vec3(1.3, 1.3, 1.3);

const float hillsNormalMapScale = 0.3; //0.1;

vec2 cellIndexToUV(float idx) {
    float atlasWidth = textureAtlasMeta.x;
    float atlasHeight = textureAtlasMeta.y;
    float cellSize = textureAtlasMeta.z;
    float cols = atlasWidth / cellSize - 1e-6; // subtract small epsilon to avoid edge cases that cause flickering
    float rows = atlasHeight / cellSize;
    float x = mod(idx, cols);
    float y = floor(idx / cols);

    //return vec2(uv.x * w + u, 1.0 - (uv.y * h + v));
    return vec2(x / cols + vUV.x / cols, 1.0 - (y / rows + (1.0 - vUV.y) / rows));
}

/**
 * Uses the texture of a neighboring terrain to blend the given color.
 * @parma color to blend with
 * @param terrain texture atlas index
 * @param sector 0 - 5 (NE - NW) 
 */
vec4 terrainTransition(vec4 inputColor, float terrain, float sector) {
    if (vTerrain <= 1.0 && terrain > 1.0) return inputColor;
    vec2 otherUV = cellIndexToUV(terrain);
    vec2 blendMaskUV = vec2(sector/6.0 + vUV.x / 6.0, 1.0 - vUV.y / 6.0);
    vec4 color = texture2D(texture, otherUV);
    vec4 blend = texture2D(transitionTexture, blendMaskUV);
    float a = min(blend.r, clamp(terrain - vTerrain, 0.0, 1.0));
    
    return mix(inputColor, color, a);
}

/**
 * Blends river textures between neighboring hexagons
 * @param baseRiverColor The current river color
 * @param neighborCell The neighbor's river texture cell coordinates
 * @param sector Which neighbor (0-5, matching the terrain sectors)
 * @return The blended river color
 */
vec4 blendRivers(vec4 baseRiverColor, vec2 neighborCell, float sector) {
    // Skip if no river in the neighbor
    if (neighborCell.x < 0.0 || neighborCell.y < 0.0) return baseRiverColor;
    
    // Sample the neighbor's river texture
    vec2 neighborRiverUv = vec2(neighborCell.x / 8.0 + vUV.x / 8.0, 
                              1.0 - (neighborCell.y / 8.0 + vUV.y / 8.0));
    
    // Apply similar flow effect as main river
    float distortionStrength = 0.0002;
    vec2 flowOffset = vec2(
        sin(vUV.y * 10.0 + sineTime * 1.5) * distortionStrength,
        sin(vUV.x * 8.0 + sineTime * 1.0) * distortionStrength
    );
    vec4 neighborRiverColor = texture2D(riverAtlas, neighborRiverUv + flowOffset);
    
    // Create a blend mask at the edge corresponding to this sector
    vec2 blendMaskUV = vec2(sector/6.0 + vUV.x / 6.0, 1.0 - vUV.y / 6.0);
    vec4 blendMask = texture2D(transitionTexture, blendMaskUV);
    
    // Only blend at the edges (using the same transition mask that terrain uses)
    float blendFactor = blendMask.r * neighborRiverColor.a;
    
    // Combine base river with neighbor river at boundary
    return vec4(
        mix(baseRiverColor.rgb, neighborRiverColor.rgb, blendFactor),
        max(baseRiverColor.a, blendFactor)
    );
}

void main() {
    // LAND
    vec4 texColor = texture2D(texture, vTexCoord);
    vec3 normal = vec3(0.0, 1.0, 0.0);
    vec2 normalMapUV = vPosition.xy * hillsNormalMapScale;

    /// Transitions to neighboring tiles
    texColor = terrainTransition(texColor, vNeighborsEast.x, 0.0);
    texColor = terrainTransition(texColor, vNeighborsEast.y, 1.0);
    texColor = terrainTransition(texColor, vNeighborsEast.z, 2.0);
    texColor = terrainTransition(texColor, vNeighborsWest.x, 3.0);
    texColor = terrainTransition(texColor, vNeighborsWest.y, 4.0);
    texColor = terrainTransition(texColor, vNeighborsWest.z, 5.0);

    // HILL
    if (vHill > 0.0) {
        normal = normalize((texture2D(hillsNormal, normalMapUV).xyz * 2.0) - 1.0);
        normal = mix(normal, vec3(0.0, 1.0, 0.0), vExtra * vExtra * vExtra); // fade out towards tile edges
    }

    vec3 lightDir = vLightDirT;
    float lambertian = max(dot(lightDir, normal), 0.0);
    //lambertian = sqrt(lambertian);

    vec3 color = lightAmbient * texColor.xyz + lambertian * texColor.xyz * lightDiffuse;
    gl_FragColor = vec4(color, 1.0);    
    
    // comment out following line to show normal vector visualization
    //gl_FragColor = vec4((normal.x + 1.0 / 2.0, 0.0, 1.0), (normal.y + 1.0 / 2.0, 0.0, 1.0), (normal.z + 1.0 / 2.0, 0.0, 1.0), 1.0);
    
    // comment out following line to show normal map texture (UV) coordinates
    //gl_FragColor = vec4(mod(normalMapUV.x, 1.0), mod(normalMapUV.y, 1.0), 0.0, 1.0);

    // Coast
    vec2 coastUv = vec2(vCoastTextureCell.x / 8.0 + vUV.x / 8.0, 1.0 - (vCoastTextureCell.y / 8.0 + vUV.y / 8.0));
    vec4 coastColor = texture2D(coastAtlas, coastUv);

    if (coastColor.w > 0.0) {
        vec3 coast = lightAmbient * coastColor.xyz + lambertian * coastColor.xyz * lightDiffuse;
        gl_FragColor = mix(gl_FragColor, vec4(coast, 1.0), coastColor.w);
    }
    
    // River
    vec2 riverUv = vec2(vRiverTextureCell.x / 8.0 + vUV.x / 8.0, 1.0 - (vRiverTextureCell.y / 8.0 + vUV.y / 8.0));
    
    // Create flowing water effect with subtle texture distortion
    float distortionStrength = 0.0002;
    vec2 flowOffset = vec2(
        sin(vUV.y * 10.0 + sineTime * 1.5) * distortionStrength,
        sin(vUV.x * 8.0 + sineTime * 1.0) * distortionStrength
    );
    vec4 riverColor = texture2D(riverAtlas, riverUv + flowOffset);

    if (riverColor.w > 0.0) {
        // Add brightness variation to simulate flowing water
        float flowBrightness = sin(vUV.x * 8.0 + vUV.y * 12.0 + sineTime * 2.0) * 0.05 + 0.05;
        vec3 river = lightAmbient * riverColor.xyz + lambertian * riverColor.xyz * lightDiffuse;
        river += flowBrightness; // Add highlights that move over time
        gl_FragColor = mix(gl_FragColor, vec4(river, 1.0), riverColor.w);
    }

    if (showGrid > 0.0 && vExtra > 1.0 - gridWidth) { // hex border
        gl_FragColor = mix(vec4(gridColor, 1.0), gl_FragColor, 1.0 - gridOpacity);
    }

    // FOW
    gl_FragColor = gl_FragColor * (vFogOfWar > 0.0 && vHidden == 0.0 ? 0.5 : 0.95);

    // Map Texture for hidden tiles
    if (vHidden > 0.0) {
        gl_FragColor = texture2D(mapTexture, vec2(vPosition.x * 0.05, vPosition.y * 0.05));
    }    
}
`