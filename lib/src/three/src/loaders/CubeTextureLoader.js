define(["require", "exports", "./ImageLoader.js", "../textures/CubeTexture.js", "./Loader.js"], function (require, exports, ImageLoader_js_1, CubeTexture_js_1, Loader_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function CubeTextureLoader(manager) {
        Loader_js_1.Loader.call(this, manager);
    }
    exports.CubeTextureLoader = CubeTextureLoader;
    CubeTextureLoader.prototype = Object.assign(Object.create(Loader_js_1.Loader.prototype), {
        constructor: CubeTextureLoader,
        load: function (urls, onLoad, onProgress, onError) {
            const texture = new CubeTexture_js_1.CubeTexture();
            const loader = new ImageLoader_js_1.ImageLoader(this.manager);
            loader.setCrossOrigin(this.crossOrigin);
            loader.setPath(this.path);
            let loaded = 0;
            function loadTexture(i) {
                loader.load(urls[i], function (image) {
                    texture.images[i] = image;
                    loaded++;
                    if (loaded === 6) {
                        texture.needsUpdate = true;
                        if (onLoad)
                            onLoad(texture);
                    }
                }, undefined, onError);
            }
            for (let i = 0; i < urls.length; ++i) {
                loadTexture(i);
            }
            return texture;
        }
    });
});
//# sourceMappingURL=CubeTextureLoader.js.map