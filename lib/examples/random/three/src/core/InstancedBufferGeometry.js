define(["require", "exports", "./BufferGeometry.js"], function (require, exports, BufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function InstancedBufferGeometry() {
        BufferGeometry_js_1.BufferGeometry.call(this);
        this.type = 'InstancedBufferGeometry';
        this.instanceCount = Infinity;
    }
    exports.InstancedBufferGeometry = InstancedBufferGeometry;
    InstancedBufferGeometry.prototype = Object.assign(Object.create(BufferGeometry_js_1.BufferGeometry.prototype), {
        constructor: InstancedBufferGeometry,
        isInstancedBufferGeometry: true,
        copy: function (source) {
            BufferGeometry_js_1.BufferGeometry.prototype.copy.call(this, source);
            this.instanceCount = source.instanceCount;
            return this;
        },
        clone: function () {
            return new this.constructor().copy(this);
        },
        toJSON: function () {
            const data = BufferGeometry_js_1.BufferGeometry.prototype.toJSON.call(this);
            data.instanceCount = this.instanceCount;
            data.isInstancedBufferGeometry = true;
            return data;
        }
    });
});
//# sourceMappingURL=InstancedBufferGeometry.js.map