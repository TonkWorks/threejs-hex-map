define(["require", "exports", "../extras/core/Font.js", "./FileLoader.js", "./Loader.js"], function (require, exports, Font_js_1, FileLoader_js_1, Loader_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function FontLoader(manager) {
        Loader_js_1.Loader.call(this, manager);
    }
    exports.FontLoader = FontLoader;
    FontLoader.prototype = Object.assign(Object.create(Loader_js_1.Loader.prototype), {
        constructor: FontLoader,
        load: function (url, onLoad, onProgress, onError) {
            const scope = this;
            const loader = new FileLoader_js_1.FileLoader(this.manager);
            loader.setPath(this.path);
            loader.setRequestHeader(this.requestHeader);
            loader.setWithCredentials(scope.withCredentials);
            loader.load(url, function (text) {
                let json;
                try {
                    json = JSON.parse(text);
                }
                catch (e) {
                    console.warn('THREE.FontLoader: typeface.js support is being deprecated. Use typeface.json instead.');
                    json = JSON.parse(text.substring(65, text.length - 2));
                }
                const font = scope.parse(json);
                if (onLoad)
                    onLoad(font);
            }, onProgress, onError);
        },
        parse: function (json) {
            return new Font_js_1.Font(json);
        }
    });
});
//# sourceMappingURL=FontLoader.js.map