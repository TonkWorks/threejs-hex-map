var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./WebGPUBinding.js", "./constants.js"], function (require, exports, WebGPUBinding_js_1, constants_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    WebGPUBinding_js_1 = __importDefault(WebGPUBinding_js_1);
    class WebGPUSampledTexture extends WebGPUBinding_js_1.default {
        constructor(name) {
            super(name);
            this.dimension = constants_js_1.GPUTextureViewDimension.TwoD;
            this.type = constants_js_1.GPUBindingType.SampledTexture;
            this.visibility = GPUShaderStage.FRAGMENT;
            this.textureGPU = null; // set by the renderer
            Object.defineProperty(this, 'isSampledTexture', { value: true });
        }
    }
    exports.WebGPUSampledTexture = WebGPUSampledTexture;
    class WebGPUSampledArrayTexture extends WebGPUSampledTexture {
        constructor(name) {
            super(name);
            this.dimension = constants_js_1.GPUTextureViewDimension.TwoDArray;
            Object.defineProperty(this, 'isSampledArrayTexture', { value: true });
        }
    }
    exports.WebGPUSampledArrayTexture = WebGPUSampledArrayTexture;
    class WebGPUSampled3DTexture extends WebGPUSampledTexture {
        constructor(name) {
            super(name);
            this.dimension = constants_js_1.GPUTextureViewDimension.ThreeD;
            Object.defineProperty(this, 'isSampled3DTexture', { value: true });
        }
    }
    exports.WebGPUSampled3DTexture = WebGPUSampled3DTexture;
    class WebGPUSampledCubeTexture extends WebGPUSampledTexture {
        constructor(name) {
            super(name);
            this.dimension = constants_js_1.GPUTextureViewDimension.Cube;
            Object.defineProperty(this, 'isSampledCubeTexture', { value: true });
        }
    }
    exports.WebGPUSampledCubeTexture = WebGPUSampledCubeTexture;
});
//# sourceMappingURL=WebGPUSampledTexture.js.map