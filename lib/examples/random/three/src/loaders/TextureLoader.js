define(["require", "exports", "../constants.js", "./ImageLoader.js", "../textures/Texture.js", "./Loader.js"], function (require, exports, constants_js_1, ImageLoader_js_1, Texture_js_1, Loader_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function TextureLoader(manager) {
        Loader_js_1.Loader.call(this, manager);
    }
    exports.TextureLoader = TextureLoader;
    TextureLoader.prototype = Object.assign(Object.create(Loader_js_1.Loader.prototype), {
        constructor: TextureLoader,
        load: function (url, onLoad, onProgress, onError) {
            const texture = new Texture_js_1.Texture();
            const loader = new ImageLoader_js_1.ImageLoader(this.manager);
            loader.setCrossOrigin(this.crossOrigin);
            loader.setPath(this.path);
            loader.load(url, function (image) {
                texture.image = image;
                // JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.
                const isJPEG = url.search(/\.jpe?g($|\?)/i) > 0 || url.search(/^data\:image\/jpeg/) === 0;
                texture.format = isJPEG ? constants_js_1.RGBFormat : constants_js_1.RGBAFormat;
                texture.needsUpdate = true;
                if (onLoad !== undefined) {
                    onLoad(texture);
                }
            }, onProgress, onError);
            return texture;
        }
    });
});
//# sourceMappingURL=TextureLoader.js.map