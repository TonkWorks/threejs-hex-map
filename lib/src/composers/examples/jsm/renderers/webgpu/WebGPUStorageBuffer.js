var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./WebGPUBinding.js", "./constants.js"], function (require, exports, WebGPUBinding_js_1, constants_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    WebGPUBinding_js_1 = __importDefault(WebGPUBinding_js_1);
    class WebGPUStorageBuffer extends WebGPUBinding_js_1.default {
        constructor(name, attribute) {
            super(name);
            this.type = constants_js_1.GPUBindingType.StorageBuffer;
            this.usage = GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST;
            this.attribute = attribute;
            this.bufferGPU = null; // set by the renderer
            Object.defineProperty(this, 'isStorageBuffer', { value: true });
        }
    }
    exports.default = WebGPUStorageBuffer;
});
//# sourceMappingURL=WebGPUStorageBuffer.js.map