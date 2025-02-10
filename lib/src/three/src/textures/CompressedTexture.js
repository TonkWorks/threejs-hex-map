define(["require", "exports", "./Texture.js"], function (require, exports, Texture_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function CompressedTexture(mipmaps, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy, encoding) {
        Texture_js_1.Texture.call(this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);
        this.image = { width: width, height: height };
        this.mipmaps = mipmaps;
        // no flipping for cube textures
        // (also flipping doesn't work for compressed textures )
        this.flipY = false;
        // can't generate mipmaps for compressed textures
        // mips must be embedded in DDS files
        this.generateMipmaps = false;
    }
    exports.CompressedTexture = CompressedTexture;
    CompressedTexture.prototype = Object.create(Texture_js_1.Texture.prototype);
    CompressedTexture.prototype.constructor = CompressedTexture;
    CompressedTexture.prototype.isCompressedTexture = true;
});
//# sourceMappingURL=CompressedTexture.js.map