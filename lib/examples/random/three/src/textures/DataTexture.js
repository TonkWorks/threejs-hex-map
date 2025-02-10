define(["require", "exports", "./Texture.js", "../constants.js"], function (require, exports, Texture_js_1, constants_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function DataTexture(data, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy, encoding) {
        Texture_js_1.Texture.call(this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);
        this.image = { data: data || null, width: width || 1, height: height || 1 };
        this.magFilter = magFilter !== undefined ? magFilter : constants_js_1.NearestFilter;
        this.minFilter = minFilter !== undefined ? minFilter : constants_js_1.NearestFilter;
        this.generateMipmaps = false;
        this.flipY = false;
        this.unpackAlignment = 1;
        this.needsUpdate = true;
    }
    exports.DataTexture = DataTexture;
    DataTexture.prototype = Object.create(Texture_js_1.Texture.prototype);
    DataTexture.prototype.constructor = DataTexture;
    DataTexture.prototype.isDataTexture = true;
});
//# sourceMappingURL=DataTexture.js.map