define(["require", "exports", "../../../build/three.module.js", "../loaders/ColladaLoader.js", "../libs/jszip.module.min.js"], function (require, exports, three_module_js_1, ColladaLoader_js_1, jszip_module_min_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var KMZLoader = function (manager) {
        three_module_js_1.Loader.call(this, manager);
    };
    exports.KMZLoader = KMZLoader;
    KMZLoader.prototype = Object.assign(Object.create(three_module_js_1.Loader.prototype), {
        constructor: KMZLoader,
        load: function (url, onLoad, onProgress, onError) {
            var scope = this;
            var loader = new three_module_js_1.FileLoader(scope.manager);
            loader.setPath(scope.path);
            loader.setResponseType('arraybuffer');
            loader.setRequestHeader(scope.requestHeader);
            loader.setWithCredentials(scope.withCredentials);
            loader.load(url, function (text) {
                try {
                    onLoad(scope.parse(text));
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
        parse: function (data) {
            function findFile(url) {
                for (var path in zip.files) {
                    if (path.substr(-url.length) === url) {
                        return zip.files[path];
                    }
                }
            }
            var manager = new three_module_js_1.LoadingManager();
            manager.setURLModifier(function (url) {
                var image = findFile(url);
                if (image) {
                    console.log('Loading', url);
                    var blob = new Blob([image.asArrayBuffer()], { type: 'application/octet-stream' });
                    return URL.createObjectURL(blob);
                }
                return url;
            });
            //
            var zip = new jszip_module_min_js_1.JSZip(data); // eslint-disable-line no-undef
            if (zip.files['doc.kml']) {
                var xml = new DOMParser().parseFromString(zip.files['doc.kml'].asText(), 'application/xml');
                var model = xml.querySelector('Placemark Model Link href');
                if (model) {
                    var loader = new ColladaLoader_js_1.ColladaLoader(manager);
                    return loader.parse(zip.files[model.textContent].asText());
                }
            }
            else {
                console.warn('KMZLoader: Missing doc.kml file.');
                for (var path in zip.files) {
                    var extension = path.split('.').pop().toLowerCase();
                    if (extension === 'dae') {
                        var loader = new ColladaLoader_js_1.ColladaLoader(manager);
                        return loader.parse(zip.files[path].asText());
                    }
                }
            }
            console.error('KMZLoader: Couldn\'t find .dae file.');
            return { scene: new three_module_js_1.Group() };
        }
    });
});
//# sourceMappingURL=KMZLoader.js.map