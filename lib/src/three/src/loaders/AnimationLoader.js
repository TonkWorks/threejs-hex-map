define(["require", "exports", "../animation/AnimationClip.js", "./FileLoader.js", "./Loader.js"], function (require, exports, AnimationClip_js_1, FileLoader_js_1, Loader_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function AnimationLoader(manager) {
        Loader_js_1.Loader.call(this, manager);
    }
    exports.AnimationLoader = AnimationLoader;
    AnimationLoader.prototype = Object.assign(Object.create(Loader_js_1.Loader.prototype), {
        constructor: AnimationLoader,
        load: function (url, onLoad, onProgress, onError) {
            const scope = this;
            const loader = new FileLoader_js_1.FileLoader(scope.manager);
            loader.setPath(scope.path);
            loader.setRequestHeader(scope.requestHeader);
            loader.setWithCredentials(scope.withCredentials);
            loader.load(url, function (text) {
                try {
                    onLoad(scope.parse(JSON.parse(text)));
                }
                catch (e) {
                    if (onError) {
                        onError(e);
                    }
                    else {
                        console.error(e);
                    }
                    scope.manager.itemError(url);
                }
            }, onProgress, onError);
        },
        parse: function (json) {
            const animations = [];
            for (let i = 0; i < json.length; i++) {
                const clip = AnimationClip_js_1.AnimationClip.parse(json[i]);
                animations.push(clip);
            }
            return animations;
        }
    });
});
//# sourceMappingURL=AnimationLoader.js.map