define(["require", "exports", "./Texture.js", "../constants.js"], function (require, exports, Texture_js_1, constants_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function DataTexture2DArray(data, width, height, depth) {
        Texture_js_1.Texture.call(this, null);
        this.image = { data: data || null, width: width || 1, height: height || 1, depth: depth || 1 };
        this.magFilter = constants_js_1.NearestFilter;
        this.minFilter = constants_js_1.NearestFilter;
        this.wrapR = constants_js_1.ClampToEdgeWrapping;
        this.generateMipmaps = false;
        this.flipY = false;
        this.needsUpdate = true;
    }
    exports.DataTexture2DArray = DataTexture2DArray;
    DataTexture2DArray.prototype = Object.create(Texture_js_1.Texture.prototype);
    DataTexture2DArray.prototype.constructor = DataTexture2DArray;
    DataTexture2DArray.prototype.isDataTexture2DArray = true;
});
//# sourceMappingURL=DataTexture2DArray.js.map