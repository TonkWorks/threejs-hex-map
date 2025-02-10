define(["require", "exports", "../../../build/three.module.js"], function (require, exports, three_module_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ParallaxBarrierEffect = function (renderer) {
        var _camera = new three_module_js_1.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        var _scene = new three_module_js_1.Scene();
        var _stereo = new three_module_js_1.StereoCamera();
        var _params = { minFilter: three_module_js_1.LinearFilter, magFilter: three_module_js_1.NearestFilter, format: three_module_js_1.RGBAFormat };
        var _renderTargetL = new three_module_js_1.WebGLRenderTarget(512, 512, _params);
        var _renderTargetR = new three_module_js_1.WebGLRenderTarget(512, 512, _params);
        var _material = new three_module_js_1.ShaderMaterial({
            uniforms: {
                "mapLeft": { value: _renderTargetL.texture },
                "mapRight": { value: _renderTargetR.texture }
            },
            vertexShader: [
                "varying vec2 vUv;",
                "void main() {",
                "	vUv = vec2( uv.x, uv.y );",
                "	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                "}"
            ].join("\n"),
            fragmentShader: [
                "uniform sampler2D mapLeft;",
                "uniform sampler2D mapRight;",
                "varying vec2 vUv;",
                "void main() {",
                "	vec2 uv = vUv;",
                "	if ( ( mod( gl_FragCoord.y, 2.0 ) ) > 1.00 ) {",
                "		gl_FragColor = texture2D( mapLeft, uv );",
                "	} else {",
                "		gl_FragColor = texture2D( mapRight, uv );",
                "	}",
                "}"
            ].join("\n")
        });
        var mesh = new three_module_js_1.Mesh(new three_module_js_1.PlaneBufferGeometry(2, 2), _material);
        _scene.add(mesh);
        this.setSize = function (width, height) {
            renderer.setSize(width, height);
            var pixelRatio = renderer.getPixelRatio();
            _renderTargetL.setSize(width * pixelRatio, height * pixelRatio);
            _renderTargetR.setSize(width * pixelRatio, height * pixelRatio);
        };
        this.render = function (scene, camera) {
            scene.updateMatrixWorld();
            if (camera.parent === null)
                camera.updateMatrixWorld();
            _stereo.update(camera);
            renderer.setRenderTarget(_renderTargetL);
            renderer.clear();
            renderer.render(scene, _stereo.cameraL);
            renderer.setRenderTarget(_renderTargetR);
            renderer.clear();
            renderer.render(scene, _stereo.cameraR);
            renderer.setRenderTarget(null);
            renderer.render(_scene, _camera);
        };
    };
    exports.ParallaxBarrierEffect = ParallaxBarrierEffect;
});
//# sourceMappingURL=ParallaxBarrierEffect.js.map