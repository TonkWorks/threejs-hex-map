define(["require", "exports", "../../../build/three.module.js"], function (require, exports, three_module_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StereoEffect = function (renderer) {
        var _stereo = new three_module_js_1.StereoCamera();
        _stereo.aspect = 0.5;
        var size = new three_module_js_1.Vector2();
        this.setEyeSeparation = function (eyeSep) {
            _stereo.eyeSep = eyeSep;
        };
        this.setSize = function (width, height) {
            renderer.setSize(width, height);
        };
        this.render = function (scene, camera) {
            scene.updateMatrixWorld();
            if (camera.parent === null)
                camera.updateMatrixWorld();
            _stereo.update(camera);
            renderer.getSize(size);
            if (renderer.autoClear)
                renderer.clear();
            renderer.setScissorTest(true);
            renderer.setScissor(0, 0, size.width / 2, size.height);
            renderer.setViewport(0, 0, size.width / 2, size.height);
            renderer.render(scene, _stereo.cameraL);
            renderer.setScissor(size.width / 2, 0, size.width / 2, size.height);
            renderer.setViewport(size.width / 2, 0, size.width / 2, size.height);
            renderer.render(scene, _stereo.cameraR);
            renderer.setScissorTest(false);
        };
    };
    exports.StereoEffect = StereoEffect;
});
//# sourceMappingURL=StereoEffect.js.map