define(["require", "exports", "../../../build/three.module.js", "../loaders/RGBELoader.js"], function (require, exports, three_module_js_1, RGBELoader_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HDRCubeTextureLoader = function (manager) {
        three_module_js_1.Loader.call(this, manager);
        this.hdrLoader = new RGBELoader_js_1.RGBELoader();
        this.type = three_module_js_1.UnsignedByteType;
    };
    exports.HDRCubeTextureLoader = HDRCubeTextureLoader;
    HDRCubeTextureLoader.prototype = Object.assign(Object.create(three_module_js_1.Loader.prototype), {
        constructor: HDRCubeTextureLoader,
        load: function (urls, onLoad, onProgress, onError) {
            if (!Array.isArray(urls)) {
                console.warn('THREE.HDRCubeTextureLoader signature has changed. Use .setDataType() instead.');
                this.setDataType(urls);
                urls = onLoad;
                onLoad = onProgress;
                onProgress = onError;
                onError = arguments[4];
            }
            var texture = new three_module_js_1.CubeTexture();
            texture.type = this.type;
            switch (texture.type) {
                case three_module_js_1.UnsignedByteType:
                    texture.encoding = three_module_js_1.RGBEEncoding;
                    texture.format = three_module_js_1.RGBAFormat;
                    texture.minFilter = three_module_js_1.NearestFilter;
                    texture.magFilter = three_module_js_1.NearestFilter;
                    texture.generateMipmaps = false;
                    break;
                case three_module_js_1.FloatType:
                    texture.encoding = three_module_js_1.LinearEncoding;
                    texture.format = three_module_js_1.RGBFormat;
                    texture.minFilter = three_module_js_1.LinearFilter;
                    texture.magFilter = three_module_js_1.LinearFilter;
                    texture.generateMipmaps = false;
                    break;
                case three_module_js_1.HalfFloatType:
                    texture.encoding = three_module_js_1.LinearEncoding;
                    texture.format = three_module_js_1.RGBFormat;
                    texture.minFilter = three_module_js_1.LinearFilter;
                    texture.magFilter = three_module_js_1.LinearFilter;
                    texture.generateMipmaps = false;
                    break;
            }
            var scope = this;
            var loaded = 0;
            function loadHDRData(i, onLoad, onProgress, onError) {
                new three_module_js_1.FileLoader(scope.manager)
                    .setPath(scope.path)
                    .setResponseType('arraybuffer')
                    .setWithCredentials(scope.withCredentials)
                    .load(urls[i], function (buffer) {
                    loaded++;
                    var texData = scope.hdrLoader.parse(buffer);
                    if (!texData)
                        return;
                    if (texData.data !== undefined) {
                        var dataTexture = new three_module_js_1.DataTexture(texData.data, texData.width, texData.height);
                        dataTexture.type = texture.type;
                        dataTexture.encoding = texture.encoding;
                        dataTexture.format = texture.format;
                        dataTexture.minFilter = texture.minFilter;
                        dataTexture.magFilter = texture.magFilter;
                        dataTexture.generateMipmaps = texture.generateMipmaps;
                        texture.images[i] = dataTexture;
                    }
                    if (loaded === 6) {
                        texture.needsUpdate = true;
                        if (onLoad)
                            onLoad(texture);
                    }
                }, onProgress, onError);
            }
            for (var i = 0; i < urls.length; i++) {
                loadHDRData(i, onLoad, onProgress, onError);
            }
            return texture;
        },
        setDataType: function (value) {
            this.type = value;
            this.hdrLoader.setDataType(value);
            return this;
        }
    });
});
//# sourceMappingURL=HDRCubeTextureLoader.js.map