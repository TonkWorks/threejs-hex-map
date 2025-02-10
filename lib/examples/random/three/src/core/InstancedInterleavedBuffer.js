define(["require", "exports", "./InterleavedBuffer.js"], function (require, exports, InterleavedBuffer_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function InstancedInterleavedBuffer(array, stride, meshPerAttribute) {
        InterleavedBuffer_js_1.InterleavedBuffer.call(this, array, stride);
        this.meshPerAttribute = meshPerAttribute || 1;
    }
    exports.InstancedInterleavedBuffer = InstancedInterleavedBuffer;
    InstancedInterleavedBuffer.prototype = Object.assign(Object.create(InterleavedBuffer_js_1.InterleavedBuffer.prototype), {
        constructor: InstancedInterleavedBuffer,
        isInstancedInterleavedBuffer: true,
        copy: function (source) {
            InterleavedBuffer_js_1.InterleavedBuffer.prototype.copy.call(this, source);
            this.meshPerAttribute = source.meshPerAttribute;
            return this;
        },
        clone: function (data) {
            const ib = InterleavedBuffer_js_1.InterleavedBuffer.prototype.clone.call(this, data);
            ib.meshPerAttribute = this.meshPerAttribute;
            return ib;
        },
        toJSON: function (data) {
            const json = InterleavedBuffer_js_1.InterleavedBuffer.prototype.toJSON.call(this, data);
            json.isInstancedInterleavedBuffer = true;
            json.meshPerAttribute = this.meshPerAttribute;
            return json;
        }
    });
});
//# sourceMappingURL=InstancedInterleavedBuffer.js.map