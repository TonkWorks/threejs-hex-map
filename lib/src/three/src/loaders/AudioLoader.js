define(["require", "exports", "../audio/AudioContext.js", "./FileLoader.js", "./Loader.js"], function (require, exports, AudioContext_js_1, FileLoader_js_1, Loader_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function AudioLoader(manager) {
        Loader_js_1.Loader.call(this, manager);
    }
    exports.AudioLoader = AudioLoader;
    AudioLoader.prototype = Object.assign(Object.create(Loader_js_1.Loader.prototype), {
        constructor: AudioLoader,
        load: function (url, onLoad, onProgress, onError) {
            const scope = this;
            const loader = new FileLoader_js_1.FileLoader(scope.manager);
            loader.setResponseType('arraybuffer');
            loader.setPath(scope.path);
            loader.setRequestHeader(scope.requestHeader);
            loader.setWithCredentials(scope.withCredentials);
            loader.load(url, function (buffer) {
                try {
                    // Create a copy of the buffer. The `decodeAudioData` method
                    // detaches the buffer when complete, preventing reuse.
                    const bufferCopy = buffer.slice(0);
                    const context = AudioContext_js_1.AudioContext.getContext();
                    context.decodeAudioData(bufferCopy, function (audioBuffer) {
                        onLoad(audioBuffer);
                    });
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
        }
    });
});
//# sourceMappingURL=AudioLoader.js.map