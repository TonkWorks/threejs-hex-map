define(["require", "exports", "../constants.js", "./FileLoader.js", "../textures/DataTexture.js", "./Loader.js"], function (require, exports, constants_js_1, FileLoader_js_1, DataTexture_js_1, Loader_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Abstract Base class to load generic binary textures formats (rgbe, hdr, ...)
     *
     * Sub classes have to implement the parse() method which will be used in load().
     */
    function DataTextureLoader(manager) {
        Loader_js_1.Loader.call(this, manager);
    }
    exports.DataTextureLoader = DataTextureLoader;
    DataTextureLoader.prototype = Object.assign(Object.create(Loader_js_1.Loader.prototype), {
        constructor: DataTextureLoader,
        load: function (url, onLoad, onProgress, onError) {
            const scope = this;
            const texture = new DataTexture_js_1.DataTexture();
            const loader = new FileLoader_js_1.FileLoader(this.manager);
            loader.setResponseType('arraybuffer');
            loader.setRequestHeader(this.requestHeader);
            loader.setPath(this.path);
            loader.setWithCredentials(scope.withCredentials);
            loader.load(url, function (buffer) {
                const texData = scope.parse(buffer);
                if (!texData)
                    return;
                if (texData.image !== undefined) {
                    texture.image = texData.image;
                }
                else if (texData.data !== undefined) {
                    texture.image.width = texData.width;
                    texture.image.height = texData.height;
                    texture.image.data = texData.data;
                }
                texture.wrapS = texData.wrapS !== undefined ? texData.wrapS : constants_js_1.ClampToEdgeWrapping;
                texture.wrapT = texData.wrapT !== undefined ? texData.wrapT : constants_js_1.ClampToEdgeWrapping;
                texture.magFilter = texData.magFilter !== undefined ? texData.magFilter : constants_js_1.LinearFilter;
                texture.minFilter = texData.minFilter !== undefined ? texData.minFilter : constants_js_1.LinearFilter;
                texture.anisotropy = texData.anisotropy !== undefined ? texData.anisotropy : 1;
                if (texData.format !== undefined) {
                    texture.format = texData.format;
                }
                if (texData.type !== undefined) {
                    texture.type = texData.type;
                }
                if (texData.mipmaps !== undefined) {
                    texture.mipmaps = texData.mipmaps;
                    texture.minFilter = constants_js_1.LinearMipmapLinearFilter; // presumably...
                }
                if (texData.mipmapCount === 1) {
                    texture.minFilter = constants_js_1.LinearFilter;
                }
                texture.needsUpdate = true;
                if (onLoad)
                    onLoad(texture, texData);
            }, onProgress, onError);
            return texture;
        }
    });
});
//# sourceMappingURL=DataTextureLoader.js.map