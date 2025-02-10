define(["require", "exports", "../math/Vector3.js", "./BufferAttribute.js"], function (require, exports, Vector3_js_1, BufferAttribute_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const _vector = new Vector3_js_1.Vector3();
    function InterleavedBufferAttribute(interleavedBuffer, itemSize, offset, normalized) {
        this.name = '';
        this.data = interleavedBuffer;
        this.itemSize = itemSize;
        this.offset = offset;
        this.normalized = normalized === true;
    }
    exports.InterleavedBufferAttribute = InterleavedBufferAttribute;
    Object.defineProperties(InterleavedBufferAttribute.prototype, {
        count: {
            get: function () {
                return this.data.count;
            }
        },
        array: {
            get: function () {
                return this.data.array;
            }
        },
        needsUpdate: {
            set: function (value) {
                this.data.needsUpdate = value;
            }
        }
    });
    Object.assign(InterleavedBufferAttribute.prototype, {
        isInterleavedBufferAttribute: true,
        applyMatrix4: function (m) {
            for (let i = 0, l = this.data.count; i < l; i++) {
                _vector.x = this.getX(i);
                _vector.y = this.getY(i);
                _vector.z = this.getZ(i);
                _vector.applyMatrix4(m);
                this.setXYZ(i, _vector.x, _vector.y, _vector.z);
            }
            return this;
        },
        setX: function (index, x) {
            this.data.array[index * this.data.stride + this.offset] = x;
            return this;
        },
        setY: function (index, y) {
            this.data.array[index * this.data.stride + this.offset + 1] = y;
            return this;
        },
        setZ: function (index, z) {
            this.data.array[index * this.data.stride + this.offset + 2] = z;
            return this;
        },
        setW: function (index, w) {
            this.data.array[index * this.data.stride + this.offset + 3] = w;
            return this;
        },
        getX: function (index) {
            return this.data.array[index * this.data.stride + this.offset];
        },
        getY: function (index) {
            return this.data.array[index * this.data.stride + this.offset + 1];
        },
        getZ: function (index) {
            return this.data.array[index * this.data.stride + this.offset + 2];
        },
        getW: function (index) {
            return this.data.array[index * this.data.stride + this.offset + 3];
        },
        setXY: function (index, x, y) {
            index = index * this.data.stride + this.offset;
            this.data.array[index + 0] = x;
            this.data.array[index + 1] = y;
            return this;
        },
        setXYZ: function (index, x, y, z) {
            index = index * this.data.stride + this.offset;
            this.data.array[index + 0] = x;
            this.data.array[index + 1] = y;
            this.data.array[index + 2] = z;
            return this;
        },
        setXYZW: function (index, x, y, z, w) {
            index = index * this.data.stride + this.offset;
            this.data.array[index + 0] = x;
            this.data.array[index + 1] = y;
            this.data.array[index + 2] = z;
            this.data.array[index + 3] = w;
            return this;
        },
        clone: function (data) {
            if (data === undefined) {
                console.log('THREE.InterleavedBufferAttribute.clone(): Cloning an interlaved buffer attribute will deinterleave buffer data.');
                const array = [];
                for (let i = 0; i < this.count; i++) {
                    const index = i * this.data.stride + this.offset;
                    for (let j = 0; j < this.itemSize; j++) {
                        array.push(this.data.array[index + j]);
                    }
                }
                return new BufferAttribute_js_1.BufferAttribute(new this.array.constructor(array), this.itemSize, this.normalized);
            }
            else {
                if (data.interleavedBuffers === undefined) {
                    data.interleavedBuffers = {};
                }
                if (data.interleavedBuffers[this.data.uuid] === undefined) {
                    data.interleavedBuffers[this.data.uuid] = this.data.clone(data);
                }
                return new InterleavedBufferAttribute(data.interleavedBuffers[this.data.uuid], this.itemSize, this.offset, this.normalized);
            }
        },
        toJSON: function (data) {
            if (data === undefined) {
                console.log('THREE.InterleavedBufferAttribute.toJSON(): Serializing an interlaved buffer attribute will deinterleave buffer data.');
                const array = [];
                for (let i = 0; i < this.count; i++) {
                    const index = i * this.data.stride + this.offset;
                    for (let j = 0; j < this.itemSize; j++) {
                        array.push(this.data.array[index + j]);
                    }
                }
                // deinterleave data and save it as an ordinary buffer attribute for now
                return {
                    itemSize: this.itemSize,
                    type: this.array.constructor.name,
                    array: array,
                    normalized: this.normalized
                };
            }
            else {
                // save as true interlaved attribtue
                if (data.interleavedBuffers === undefined) {
                    data.interleavedBuffers = {};
                }
                if (data.interleavedBuffers[this.data.uuid] === undefined) {
                    data.interleavedBuffers[this.data.uuid] = this.data.toJSON(data);
                }
                return {
                    isInterleavedBufferAttribute: true,
                    itemSize: this.itemSize,
                    data: this.data.uuid,
                    offset: this.offset,
                    normalized: this.normalized
                };
            }
        }
    });
});
//# sourceMappingURL=InterleavedBufferAttribute.js.map