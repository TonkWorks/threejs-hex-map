define(["require", "exports", "../../constants.js", "../WebGLCubeRenderTarget.js"], function (require, exports, constants_js_1, WebGLCubeRenderTarget_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function WebGLCubeMaps(renderer) {
        let cubemaps = new WeakMap();
        function mapTextureMapping(texture, mapping) {
            if (mapping === constants_js_1.EquirectangularReflectionMapping) {
                texture.mapping = constants_js_1.CubeReflectionMapping;
            }
            else if (mapping === constants_js_1.EquirectangularRefractionMapping) {
                texture.mapping = constants_js_1.CubeRefractionMapping;
            }
            return texture;
        }
        function get(texture) {
            if (texture && texture.isTexture) {
                const mapping = texture.mapping;
                if (mapping === constants_js_1.EquirectangularReflectionMapping || mapping === constants_js_1.EquirectangularRefractionMapping) {
                    if (cubemaps.has(texture)) {
                        const cubemap = cubemaps.get(texture).texture;
                        return mapTextureMapping(cubemap, texture.mapping);
                    }
                    else {
                        const image = texture.image;
                        if (image && image.height > 0) {
                            const currentRenderList = renderer.getRenderList();
                            const currentRenderTarget = renderer.getRenderTarget();
                            const currentRenderState = renderer.getRenderState();
                            const renderTarget = new WebGLCubeRenderTarget_js_1.WebGLCubeRenderTarget(image.height / 2);
                            renderTarget.fromEquirectangularTexture(renderer, texture);
                            cubemaps.set(texture, renderTarget);
                            renderer.setRenderTarget(currentRenderTarget);
                            renderer.setRenderList(currentRenderList);
                            renderer.setRenderState(currentRenderState);
                            texture.addEventListener('dispose', onTextureDispose);
                            return mapTextureMapping(renderTarget.texture, texture.mapping);
                        }
                        else {
                            // image not yet ready. try the conversion next frame
                            return null;
                        }
                    }
                }
            }
            return texture;
        }
        function onTextureDispose(event) {
            const texture = event.target;
            texture.removeEventListener('dispose', onTextureDispose);
            const cubemap = cubemaps.get(texture);
            if (cubemap !== undefined) {
                cubemaps.delete(texture);
                cubemap.dispose();
            }
        }
        function dispose() {
            cubemaps = new WeakMap();
        }
        return {
            get: get,
            dispose: dispose
        };
    }
    exports.WebGLCubeMaps = WebGLCubeMaps;
});
//# sourceMappingURL=WebGLCubeMaps.js.map