define(["require", "exports", "./Cache.js", "./Loader.js"], function (require, exports, Cache_js_1, Loader_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ImageBitmapLoader(manager) {
        if (typeof createImageBitmap === 'undefined') {
            console.warn('THREE.ImageBitmapLoader: createImageBitmap() not supported.');
        }
        if (typeof fetch === 'undefined') {
            console.warn('THREE.ImageBitmapLoader: fetch() not supported.');
        }
        Loader_js_1.Loader.call(this, manager);
        this.options = { premultiplyAlpha: 'none' };
    }
    exports.ImageBitmapLoader = ImageBitmapLoader;
    ImageBitmapLoader.prototype = Object.assign(Object.create(Loader_js_1.Loader.prototype), {
        constructor: ImageBitmapLoader,
        isImageBitmapLoader: true,
        setOptions: function setOptions(options) {
            this.options = options;
            return this;
        },
        load: function (url, onLoad, onProgress, onError) {
            if (url === undefined)
                url = '';
            if (this.path !== undefined)
                url = this.path + url;
            url = this.manager.resolveURL(url);
            const scope = this;
            const cached = Cache_js_1.Cache.get(url);
            if (cached !== undefined) {
                scope.manager.itemStart(url);
                setTimeout(function () {
                    if (onLoad)
                        onLoad(cached);
                    scope.manager.itemEnd(url);
                }, 0);
                return cached;
            }
            const fetchOptions = {};
            fetchOptions.credentials = (this.crossOrigin === 'anonymous') ? 'same-origin' : 'include';
            fetch(url, fetchOptions).then(function (res) {
                return res.blob();
            }).then(function (blob) {
                return createImageBitmap(blob, scope.options);
            }).then(function (imageBitmap) {
                Cache_js_1.Cache.add(url, imageBitmap);
                if (onLoad)
                    onLoad(imageBitmap);
                scope.manager.itemEnd(url);
            }).catch(function (e) {
                if (onError)
                    onError(e);
                scope.manager.itemError(url);
                scope.manager.itemEnd(url);
            });
            scope.manager.itemStart(url);
        }
    });
});
//# sourceMappingURL=ImageBitmapLoader.js.map