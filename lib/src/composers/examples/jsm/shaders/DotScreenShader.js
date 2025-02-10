define(["require", "exports", "../../../build/three.module.js"], function (require, exports, three_module_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Dot screen shader
     * based on glfx.js sepia shader
     * https://github.com/evanw/glfx.js
     */
    var DotScreenShader = {
        uniforms: {
            "tDiffuse": { value: null },
            "tSize": { value: new three_module_js_1.Vector2(256, 256) },
            "center": { value: new three_module_js_1.Vector2(0.5, 0.5) },
            "angle": { value: 1.57 },
            "scale": { value: 1.0 }
        },
        vertexShader: [
            "varying vec2 vUv;",
            "void main() {",
            "	vUv = uv;",
            "	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        ].join("\n"),
        fragmentShader: [
            "uniform vec2 center;",
            "uniform float angle;",
            "uniform float scale;",
            "uniform vec2 tSize;",
            "uniform sampler2D tDiffuse;",
            "varying vec2 vUv;",
            "float pattern() {",
            "	float s = sin( angle ), c = cos( angle );",
            "	vec2 tex = vUv * tSize - center;",
            "	vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;",
            "	return ( sin( point.x ) * sin( point.y ) ) * 4.0;",
            "}",
            "void main() {",
            "	vec4 color = texture2D( tDiffuse, vUv );",
            "	float average = ( color.r + color.g + color.b ) / 3.0;",
            "	gl_FragColor = vec4( vec3( average * 10.0 - 5.0 + pattern() ), color.a );",
            "}"
        ].join("\n")
    };
    exports.DotScreenShader = DotScreenShader;
});
//# sourceMappingURL=DotScreenShader.js.map