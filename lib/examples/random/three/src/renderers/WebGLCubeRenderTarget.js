define(["require", "exports", "../constants.js", "../objects/Mesh.js", "../geometries/BoxBufferGeometry.js", "../materials/ShaderMaterial.js", "./shaders/UniformsUtils.js", "./WebGLRenderTarget.js", "../cameras/CubeCamera.js", "../textures/CubeTexture.js"], function (require, exports, constants_js_1, Mesh_js_1, BoxBufferGeometry_js_1, ShaderMaterial_js_1, UniformsUtils_js_1, WebGLRenderTarget_js_1, CubeCamera_js_1, CubeTexture_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function WebGLCubeRenderTarget(size, options, dummy) {
        if (Number.isInteger(options)) {
            console.warn('THREE.WebGLCubeRenderTarget: constructor signature is now WebGLCubeRenderTarget( size, options )');
            options = dummy;
        }
        WebGLRenderTarget_js_1.WebGLRenderTarget.call(this, size, size, options);
        options = options || {};
        this.texture = new CubeTexture_js_1.CubeTexture(undefined, options.mapping, options.wrapS, options.wrapT, options.magFilter, options.minFilter, options.format, options.type, options.anisotropy, options.encoding);
        this.texture._needsFlipEnvMap = false;
    }
    exports.WebGLCubeRenderTarget = WebGLCubeRenderTarget;
    WebGLCubeRenderTarget.prototype = Object.create(WebGLRenderTarget_js_1.WebGLRenderTarget.prototype);
    WebGLCubeRenderTarget.prototype.constructor = WebGLCubeRenderTarget;
    WebGLCubeRenderTarget.prototype.isWebGLCubeRenderTarget = true;
    WebGLCubeRenderTarget.prototype.fromEquirectangularTexture = function (renderer, texture) {
        this.texture.type = texture.type;
        this.texture.format = constants_js_1.RGBAFormat; // see #18859
        this.texture.encoding = texture.encoding;
        this.texture.generateMipmaps = texture.generateMipmaps;
        this.texture.minFilter = texture.minFilter;
        this.texture.magFilter = texture.magFilter;
        const shader = {
            uniforms: {
                tEquirect: { value: null },
            },
            vertexShader: /* glsl */ `

			varying vec3 vWorldDirection;

			vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

				return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

			}

			void main() {

				vWorldDirection = transformDirection( position, modelMatrix );

				#include <begin_vertex>
				#include <project_vertex>

			}
		`,
            fragmentShader: /* glsl */ `

			uniform sampler2D tEquirect;

			varying vec3 vWorldDirection;

			#include <common>

			void main() {

				vec3 direction = normalize( vWorldDirection );

				vec2 sampleUV = equirectUv( direction );

				gl_FragColor = texture2D( tEquirect, sampleUV );

			}
		`
        };
        const geometry = new BoxBufferGeometry_js_1.BoxBufferGeometry(5, 5, 5);
        const material = new ShaderMaterial_js_1.ShaderMaterial({
            name: 'CubemapFromEquirect',
            uniforms: UniformsUtils_js_1.cloneUniforms(shader.uniforms),
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader,
            side: constants_js_1.BackSide,
            blending: constants_js_1.NoBlending
        });
        material.uniforms.tEquirect.value = texture;
        const mesh = new Mesh_js_1.Mesh(geometry, material);
        const currentMinFilter = texture.minFilter;
        // Avoid blurred poles
        if (texture.minFilter === constants_js_1.LinearMipmapLinearFilter)
            texture.minFilter = constants_js_1.LinearFilter;
        const camera = new CubeCamera_js_1.CubeCamera(1, 10, this);
        camera.update(renderer, mesh);
        texture.minFilter = currentMinFilter;
        mesh.geometry.dispose();
        mesh.material.dispose();
        return this;
    };
    WebGLCubeRenderTarget.prototype.clear = function (renderer, color, depth, stencil) {
        const currentRenderTarget = renderer.getRenderTarget();
        for (let i = 0; i < 6; i++) {
            renderer.setRenderTarget(this, i);
            renderer.clear(color, depth, stencil);
        }
        renderer.setRenderTarget(currentRenderTarget);
    };
});
//# sourceMappingURL=WebGLCubeRenderTarget.js.map