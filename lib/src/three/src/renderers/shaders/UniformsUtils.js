/**
 * Uniform Utilities
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function cloneUniforms(src) {
        const dst = {};
        for (const u in src) {
            dst[u] = {};
            for (const p in src[u]) {
                const property = src[u][p];
                if (property && (property.isColor ||
                    property.isMatrix3 || property.isMatrix4 ||
                    property.isVector2 || property.isVector3 || property.isVector4 ||
                    property.isTexture)) {
                    dst[u][p] = property.clone();
                }
                else if (Array.isArray(property)) {
                    dst[u][p] = property.slice();
                }
                else {
                    dst[u][p] = property;
                }
            }
        }
        return dst;
    }
    exports.cloneUniforms = cloneUniforms;
    function mergeUniforms(uniforms) {
        const merged = {};
        for (let u = 0; u < uniforms.length; u++) {
            const tmp = cloneUniforms(uniforms[u]);
            for (const p in tmp) {
                merged[p] = tmp[p];
            }
        }
        return merged;
    }
    exports.mergeUniforms = mergeUniforms;
    // Legacy
    const UniformsUtils = { clone: cloneUniforms, merge: mergeUniforms };
    exports.UniformsUtils = UniformsUtils;
});
//# sourceMappingURL=UniformsUtils.js.map