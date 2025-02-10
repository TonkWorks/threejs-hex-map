define(["require", "exports", "../../constants.js"], function (require, exports, constants_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function WebGLUtils(gl, extensions, capabilities) {
        const isWebGL2 = capabilities.isWebGL2;
        function convert(p) {
            let extension;
            if (p === constants_js_1.UnsignedByteType)
                return gl.UNSIGNED_BYTE;
            if (p === constants_js_1.UnsignedShort4444Type)
                return gl.UNSIGNED_SHORT_4_4_4_4;
            if (p === constants_js_1.UnsignedShort5551Type)
                return gl.UNSIGNED_SHORT_5_5_5_1;
            if (p === constants_js_1.UnsignedShort565Type)
                return gl.UNSIGNED_SHORT_5_6_5;
            if (p === constants_js_1.ByteType)
                return gl.BYTE;
            if (p === constants_js_1.ShortType)
                return gl.SHORT;
            if (p === constants_js_1.UnsignedShortType)
                return gl.UNSIGNED_SHORT;
            if (p === constants_js_1.IntType)
                return gl.INT;
            if (p === constants_js_1.UnsignedIntType)
                return gl.UNSIGNED_INT;
            if (p === constants_js_1.FloatType)
                return gl.FLOAT;
            if (p === constants_js_1.HalfFloatType) {
                if (isWebGL2)
                    return gl.HALF_FLOAT;
                extension = extensions.get('OES_texture_half_float');
                if (extension !== null) {
                    return extension.HALF_FLOAT_OES;
                }
                else {
                    return null;
                }
            }
            if (p === constants_js_1.AlphaFormat)
                return gl.ALPHA;
            if (p === constants_js_1.RGBFormat)
                return gl.RGB;
            if (p === constants_js_1.RGBAFormat)
                return gl.RGBA;
            if (p === constants_js_1.LuminanceFormat)
                return gl.LUMINANCE;
            if (p === constants_js_1.LuminanceAlphaFormat)
                return gl.LUMINANCE_ALPHA;
            if (p === constants_js_1.DepthFormat)
                return gl.DEPTH_COMPONENT;
            if (p === constants_js_1.DepthStencilFormat)
                return gl.DEPTH_STENCIL;
            if (p === constants_js_1.RedFormat)
                return gl.RED;
            // WebGL2 formats.
            if (p === constants_js_1.RedIntegerFormat)
                return gl.RED_INTEGER;
            if (p === constants_js_1.RGFormat)
                return gl.RG;
            if (p === constants_js_1.RGIntegerFormat)
                return gl.RG_INTEGER;
            if (p === constants_js_1.RGBIntegerFormat)
                return gl.RGB_INTEGER;
            if (p === constants_js_1.RGBAIntegerFormat)
                return gl.RGBA_INTEGER;
            if (p === constants_js_1.RGB_S3TC_DXT1_Format || p === constants_js_1.RGBA_S3TC_DXT1_Format ||
                p === constants_js_1.RGBA_S3TC_DXT3_Format || p === constants_js_1.RGBA_S3TC_DXT5_Format) {
                extension = extensions.get('WEBGL_compressed_texture_s3tc');
                if (extension !== null) {
                    if (p === constants_js_1.RGB_S3TC_DXT1_Format)
                        return extension.COMPRESSED_RGB_S3TC_DXT1_EXT;
                    if (p === constants_js_1.RGBA_S3TC_DXT1_Format)
                        return extension.COMPRESSED_RGBA_S3TC_DXT1_EXT;
                    if (p === constants_js_1.RGBA_S3TC_DXT3_Format)
                        return extension.COMPRESSED_RGBA_S3TC_DXT3_EXT;
                    if (p === constants_js_1.RGBA_S3TC_DXT5_Format)
                        return extension.COMPRESSED_RGBA_S3TC_DXT5_EXT;
                }
                else {
                    return null;
                }
            }
            if (p === constants_js_1.RGB_PVRTC_4BPPV1_Format || p === constants_js_1.RGB_PVRTC_2BPPV1_Format ||
                p === constants_js_1.RGBA_PVRTC_4BPPV1_Format || p === constants_js_1.RGBA_PVRTC_2BPPV1_Format) {
                extension = extensions.get('WEBGL_compressed_texture_pvrtc');
                if (extension !== null) {
                    if (p === constants_js_1.RGB_PVRTC_4BPPV1_Format)
                        return extension.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
                    if (p === constants_js_1.RGB_PVRTC_2BPPV1_Format)
                        return extension.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
                    if (p === constants_js_1.RGBA_PVRTC_4BPPV1_Format)
                        return extension.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
                    if (p === constants_js_1.RGBA_PVRTC_2BPPV1_Format)
                        return extension.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
                }
                else {
                    return null;
                }
            }
            if (p === constants_js_1.RGB_ETC1_Format) {
                extension = extensions.get('WEBGL_compressed_texture_etc1');
                if (extension !== null) {
                    return extension.COMPRESSED_RGB_ETC1_WEBGL;
                }
                else {
                    return null;
                }
            }
            if (p === constants_js_1.RGB_ETC2_Format || p === constants_js_1.RGBA_ETC2_EAC_Format) {
                extension = extensions.get('WEBGL_compressed_texture_etc');
                if (extension !== null) {
                    if (p === constants_js_1.RGB_ETC2_Format)
                        return extension.COMPRESSED_RGB8_ETC2;
                    if (p === constants_js_1.RGBA_ETC2_EAC_Format)
                        return extension.COMPRESSED_RGBA8_ETC2_EAC;
                }
            }
            if (p === constants_js_1.RGBA_ASTC_4x4_Format || p === constants_js_1.RGBA_ASTC_5x4_Format || p === constants_js_1.RGBA_ASTC_5x5_Format ||
                p === constants_js_1.RGBA_ASTC_6x5_Format || p === constants_js_1.RGBA_ASTC_6x6_Format || p === constants_js_1.RGBA_ASTC_8x5_Format ||
                p === constants_js_1.RGBA_ASTC_8x6_Format || p === constants_js_1.RGBA_ASTC_8x8_Format || p === constants_js_1.RGBA_ASTC_10x5_Format ||
                p === constants_js_1.RGBA_ASTC_10x6_Format || p === constants_js_1.RGBA_ASTC_10x8_Format || p === constants_js_1.RGBA_ASTC_10x10_Format ||
                p === constants_js_1.RGBA_ASTC_12x10_Format || p === constants_js_1.RGBA_ASTC_12x12_Format ||
                p === constants_js_1.SRGB8_ALPHA8_ASTC_4x4_Format || p === constants_js_1.SRGB8_ALPHA8_ASTC_5x4_Format || p === constants_js_1.SRGB8_ALPHA8_ASTC_5x5_Format ||
                p === constants_js_1.SRGB8_ALPHA8_ASTC_6x5_Format || p === constants_js_1.SRGB8_ALPHA8_ASTC_6x6_Format || p === constants_js_1.SRGB8_ALPHA8_ASTC_8x5_Format ||
                p === constants_js_1.SRGB8_ALPHA8_ASTC_8x6_Format || p === constants_js_1.SRGB8_ALPHA8_ASTC_8x8_Format || p === constants_js_1.SRGB8_ALPHA8_ASTC_10x5_Format ||
                p === constants_js_1.SRGB8_ALPHA8_ASTC_10x6_Format || p === constants_js_1.SRGB8_ALPHA8_ASTC_10x8_Format || p === constants_js_1.SRGB8_ALPHA8_ASTC_10x10_Format ||
                p === constants_js_1.SRGB8_ALPHA8_ASTC_12x10_Format || p === constants_js_1.SRGB8_ALPHA8_ASTC_12x12_Format) {
                extension = extensions.get('WEBGL_compressed_texture_astc');
                if (extension !== null) {
                    // TODO Complete?
                    return p;
                }
                else {
                    return null;
                }
            }
            if (p === constants_js_1.RGBA_BPTC_Format) {
                extension = extensions.get('EXT_texture_compression_bptc');
                if (extension !== null) {
                    // TODO Complete?
                    return p;
                }
                else {
                    return null;
                }
            }
            if (p === constants_js_1.UnsignedInt248Type) {
                if (isWebGL2)
                    return gl.UNSIGNED_INT_24_8;
                extension = extensions.get('WEBGL_depth_texture');
                if (extension !== null) {
                    return extension.UNSIGNED_INT_24_8_WEBGL;
                }
                else {
                    return null;
                }
            }
        }
        return { convert: convert };
    }
    exports.WebGLUtils = WebGLUtils;
});
//# sourceMappingURL=WebGLUtils.js.map