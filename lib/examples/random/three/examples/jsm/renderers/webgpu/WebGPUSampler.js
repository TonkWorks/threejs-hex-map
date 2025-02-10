var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./WebGPUBinding.js", "./constants.js"], function (require, exports, WebGPUBinding_js_1, constants_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    WebGPUBinding_js_1 = __importDefault(WebGPUBinding_js_1);
    class WebGPUSampler extends WebGPUBinding_js_1.default {
        constructor(name) {
            super(name);
            this.type = constants_js_1.GPUBindingType.Sampler;
            this.visibility = GPUShaderStage.FRAGMENT;
            this.samplerGPU = null; // set by the renderer
            Object.defineProperty(this, 'isSampler', { value: true });
        }
    }
    exports.default = WebGPUSampler;
});
//# sourceMappingURL=WebGPUSampler.js.map