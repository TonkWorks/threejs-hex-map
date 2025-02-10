define(["require", "exports", "../core/EventDispatcher.js", "../textures/Texture.js", "../constants.js", "../math/Vector4.js"], function (require, exports, EventDispatcher_js_1, Texture_js_1, constants_js_1, Vector4_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /*
     In options, we can specify:
     * Texture parameters for an auto-generated target texture
     * depthBuffer/stencilBuffer: Booleans to indicate if we should generate these buffers
    */
    function WebGLRenderTarget(width, height, options) {
        this.width = width;
        this.height = height;
        this.scissor = new Vector4_js_1.Vector4(0, 0, width, height);
        this.scissorTest = false;
        this.viewport = new Vector4_js_1.Vector4(0, 0, width, height);
        options = options || {};
        this.texture = new Texture_js_1.Texture(undefined, options.mapping, options.wrapS, options.wrapT, options.magFilter, options.minFilter, options.format, options.type, options.anisotropy, options.encoding);
        this.texture.image = {};
        this.texture.image.width = width;
        this.texture.image.height = height;
        this.texture.generateMipmaps = options.generateMipmaps !== undefined ? options.generateMipmaps : false;
        this.texture.minFilter = options.minFilter !== undefined ? options.minFilter : constants_js_1.LinearFilter;
        this.depthBuffer = options.depthBuffer !== undefined ? options.depthBuffer : true;
        this.stencilBuffer = options.stencilBuffer !== undefined ? options.stencilBuffer : false;
        this.depthTexture = options.depthTexture !== undefined ? options.depthTexture : null;
    }
    exports.WebGLRenderTarget = WebGLRenderTarget;
    WebGLRenderTarget.prototype = Object.assign(Object.create(EventDispatcher_js_1.EventDispatcher.prototype), {
        constructor: WebGLRenderTarget,
        isWebGLRenderTarget: true,
        setSize: function (width, height) {
            if (this.width !== width || this.height !== height) {
                this.width = width;
                this.height = height;
                this.texture.image.width = width;
                this.texture.image.height = height;
                this.dispose();
            }
            this.viewport.set(0, 0, width, height);
            this.scissor.set(0, 0, width, height);
        },
        clone: function () {
            return new this.constructor().copy(this);
        },
        copy: function (source) {
            this.width = source.width;
            this.height = source.height;
            this.viewport.copy(source.viewport);
            this.texture = source.texture.clone();
            this.depthBuffer = source.depthBuffer;
            this.stencilBuffer = source.stencilBuffer;
            this.depthTexture = source.depthTexture;
            return this;
        },
        dispose: function () {
            this.dispatchEvent({ type: 'dispose' });
        }
    });
});
//# sourceMappingURL=WebGLRenderTarget.js.map