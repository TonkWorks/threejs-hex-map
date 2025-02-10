define(["require", "exports", "./BufferAttribute.js"], function (require, exports, BufferAttribute_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function InstancedBufferAttribute(array, itemSize, normalized, meshPerAttribute) {
        if (typeof (normalized) === 'number') {
            meshPerAttribute = normalized;
            normalized = false;
            console.error('THREE.InstancedBufferAttribute: The constructor now expects normalized as the third argument.');
        }
        BufferAttribute_js_1.BufferAttribute.call(this, array, itemSize, normalized);
        this.meshPerAttribute = meshPerAttribute || 1;
    }
    exports.InstancedBufferAttribute = InstancedBufferAttribute;
    InstancedBufferAttribute.prototype = Object.assign(Object.create(BufferAttribute_js_1.BufferAttribute.prototype), {
        constructor: InstancedBufferAttribute,
        isInstancedBufferAttribute: true,
        copy: function (source) {
            BufferAttribute_js_1.BufferAttribute.prototype.copy.call(this, source);
            this.meshPerAttribute = source.meshPerAttribute;
            return this;
        },
        toJSON: function () {
            const data = BufferAttribute_js_1.BufferAttribute.prototype.toJSON.call(this);
            data.meshPerAttribute = this.meshPerAttribute;
            data.isInstancedBufferAttribute = true;
            return data;
        }
    });
});
//# sourceMappingURL=InstancedBufferAttribute.js.map