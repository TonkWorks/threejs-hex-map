export const WATER_VERTEX_SHADER = `
// WATER_VERTEX_SHADER.glsl
precision mediump float;

uniform float sineTime; // oscillating time [-1.0, 1.0]
uniform float zoom;
uniform float size;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform mat4 modelMatrix;
uniform vec3 camera;
uniform vec4 textureAtlasMeta;
uniform vec3 lightDir;

attribute vec3 position;
attribute vec2 offset;
attribute vec2 uv;
attribute float border;

// New: pass along tile height (used as water depth)
attribute float tileHeight;
varying float vTileHeight;

attribute vec4 style;
attribute vec3 neighborsEast;
attribute vec3 neighborsWest;

varying vec3 vPosition;
varying vec2 vTexCoord;
varying vec2 vUV;
varying float vExtra;
varying float vTerrain;
varying float vFogOfWar;
varying float vHidden;
varying float vHill;
varying vec2 vOffset;
varying vec2 vCoastTextureCell;
varying vec2 vRiverTextureCell;
varying vec3 vLightDirT;

varying vec3 vNeighborsEast;
varying vec3 vNeighborsWest;

vec2 cellIndexToUV(float idx) {
    float atlasWidth = textureAtlasMeta.x;
    float atlasHeight = textureAtlasMeta.y;
    float cellSize = textureAtlasMeta.z;
    float cols = atlasWidth / cellSize;
    float rows = atlasHeight / cellSize;
    float x = mod(idx, cols);
    float y = floor(idx / cols);
    return vec2(x / cols + uv.x / cols, 1.0 - (y / rows + (1.0 - uv.y) / rows));
}

mat3 tangentSpace(vec3 normal_ws, vec3 tangent, mat4 worldMatrix) {
    vec3 binormal = cross(tangent, normal_ws);
    mat3 M;
    M[0] = normalize(binormal);
    M[1] = normalize(tangent);
    M[2] = normalize(normal_ws);
    return mat3(modelMatrix) * M;
}

void main() {
    // Base XY position (all tiles start at z = 0)
    vec3 pos = vec3(offset.x + position.x, offset.y + position.y, 0.0);

    // Determine if this tile is a hill. Convention: if the 2nd digit of style.y is 1 then hill.
    float hill = floor(mod(style.y / 10.0, 10.0)); // 0.0 = water, 1.0 = hill

    if (hill > 0.0 && border < 0.75) {
        pos.z = 0.1 + sin((pos.x + pos.y) * 2.0 + sineTime) * 0.1;
        vHill = 1.0;
    } else {
        // For water (or flat land) tiles, add a gentle animated wave effect.
        float wave1 = sin((pos.x + sineTime * 2.0) * 0.5) * 0.05;
        float wave2 = cos((pos.y + sineTime * 1.5) * 0.5) * 0.05;
        pos.z = wave1 + wave2;
        vHill = 0.0;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vPosition = pos;
    vOffset = offset;
    vUV = uv;
    vTexCoord = cellIndexToUV(style.x);
    vCoastTextureCell = vec2(mod(style.z, 8.0), floor(style.z / 8.0));
    vRiverTextureCell = vec2(mod(style.w, 8.0), floor(style.w / 8.0));
    vExtra = border;
    vFogOfWar = mod(style.y, 10.0) == 1.0 ? 1.0 : 0.0;
    vHidden = style.y >= 100.0 ? 1.0 : 0.0;
    
    // Pass the tile height (water depth) along.
    vTileHeight = tileHeight;
    
    // Build tangent space for lighting.
    mat3 T = tangentSpace(vec3(0.0, -1.0, 0.0), vec3(0.0, 0.0, 1.0), modelMatrix);
    vLightDirT = normalize(T * lightDir);
    
    vNeighborsEast = neighborsEast;
    vNeighborsWest = neighborsWest;
    vTerrain = style.x;
}
`;
