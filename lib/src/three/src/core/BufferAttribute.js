define(["require", "exports", "../math/Vector4.js", "../math/Vector3.js", "../math/Vector2.js", "../math/Color.js", "../constants.js"], function (require, exports, Vector4_js_1, Vector3_js_1, Vector2_js_1, Color_js_1, constants_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const _vector = new Vector3_js_1.Vector3();
    const _vector2 = new Vector2_js_1.Vector2();
    function BufferAttribute(array, itemSize, normalized) {
        if (Array.isArray(array)) {
            throw new TypeError('THREE.BufferAttribute: array should be a Typed Array.');
        }
        this.name = '';
        this.array = array;
        this.itemSize = itemSize;
        this.count = array !== undefined ? array.length / itemSize : 0;
        this.normalized = normalized === true;
        this.usage = constants_js_1.StaticDrawUsage;
        this.updateRange = { offset: 0, count: -1 };
        this.version = 0;
    }
    exports.BufferAttribute = BufferAttribute;
    Object.defineProperty(BufferAttribute.prototype, 'needsUpdate', {
        set: function (value) {
            if (value === true)
                this.version++;
        }
    });
    Object.assign(BufferAttribute.prototype, {
        isBufferAttribute: true,
        onUploadCallback: function () { },
        setUsage: function (value) {
            this.usage = value;
            return this;
        },
        copy: function (source) {
            this.name = source.name;
            this.array = new source.array.constructor(source.array);
            this.itemSize = source.itemSize;
            this.count = source.count;
            this.normalized = source.normalized;
            this.usage = source.usage;
            return this;
        },
        copyAt: function (index1, attribute, index2) {
            index1 *= this.itemSize;
            index2 *= attribute.itemSize;
            for (let i = 0, l = this.itemSize; i < l; i++) {
                this.array[index1 + i] = attribute.array[index2 + i];
            }
            return this;
        },
        copyArray: function (array) {
            this.array.set(array);
            return this;
        },
        copyColorsArray: function (colors) {
            const array = this.array;
            let offset = 0;
            for (let i = 0, l = colors.length; i < l; i++) {
                let color = colors[i];
                if (color === undefined) {
                    console.warn('THREE.BufferAttribute.copyColorsArray(): color is undefined', i);
                    color = new Color_js_1.Color();
                }
                array[offset++] = color.r;
                array[offset++] = color.g;
                array[offset++] = color.b;
            }
            return this;
        },
        copyVector2sArray: function (vectors) {
            const array = this.array;
            let offset = 0;
            for (let i = 0, l = vectors.length; i < l; i++) {
                let vector = vectors[i];
                if (vector === undefined) {
                    console.warn('THREE.BufferAttribute.copyVector2sArray(): vector is undefined', i);
                    vector = new Vector2_js_1.Vector2();
                }
                array[offset++] = vector.x;
                array[offset++] = vector.y;
            }
            return this;
        },
        copyVector3sArray: function (vectors) {
            const array = this.array;
            let offset = 0;
            for (let i = 0, l = vectors.length; i < l; i++) {
                let vector = vectors[i];
                if (vector === undefined) {
                    console.warn('THREE.BufferAttribute.copyVector3sArray(): vector is undefined', i);
                    vector = new Vector3_js_1.Vector3();
                }
                array[offset++] = vector.x;
                array[offset++] = vector.y;
                array[offset++] = vector.z;
            }
            return this;
        },
        copyVector4sArray: function (vectors) {
            const array = this.array;
            let offset = 0;
            for (let i = 0, l = vectors.length; i < l; i++) {
                let vector = vectors[i];
                if (vector === undefined) {
                    console.warn('THREE.BufferAttribute.copyVector4sArray(): vector is undefined', i);
                    vector = new Vector4_js_1.Vector4();
                }
                array[offset++] = vector.x;
                array[offset++] = vector.y;
                array[offset++] = vector.z;
                array[offset++] = vector.w;
            }
            return this;
        },
        applyMatrix3: function (m) {
            if (this.itemSize === 2) {
                for (let i = 0, l = this.count; i < l; i++) {
                    _vector2.fromBufferAttribute(this, i);
                    _vector2.applyMatrix3(m);
                    this.setXY(i, _vector2.x, _vector2.y);
                }
            }
            else if (this.itemSize === 3) {
                for (let i = 0, l = this.count; i < l; i++) {
                    _vector.fromBufferAttribute(this, i);
                    _vector.applyMatrix3(m);
                    this.setXYZ(i, _vector.x, _vector.y, _vector.z);
                }
            }
            return this;
        },
        applyMatrix4: function (m) {
            for (let i = 0, l = this.count; i < l; i++) {
                _vector.x = this.getX(i);
                _vector.y = this.getY(i);
                _vector.z = this.getZ(i);
                _vector.applyMatrix4(m);
                this.setXYZ(i, _vector.x, _vector.y, _vector.z);
            }
            return this;
        },
        applyNormalMatrix: function (m) {
            for (let i = 0, l = this.count; i < l; i++) {
                _vector.x = this.getX(i);
                _vector.y = this.getY(i);
                _vector.z = this.getZ(i);
                _vector.applyNormalMatrix(m);
                this.setXYZ(i, _vector.x, _vector.y, _vector.z);
            }
            return this;
        },
        transformDirection: function (m) {
            for (let i = 0, l = this.count; i < l; i++) {
                _vector.x = this.getX(i);
                _vector.y = this.getY(i);
                _vector.z = this.getZ(i);
                _vector.transformDirection(m);
                this.setXYZ(i, _vector.x, _vector.y, _vector.z);
            }
            return this;
        },
        set: function (value, offset) {
            if (offset === undefined)
                offset = 0;
            this.array.set(value, offset);
            return this;
        },
        getX: function (index) {
            return this.array[index * this.itemSize];
        },
        setX: function (index, x) {
            this.array[index * this.itemSize] = x;
            return this;
        },
        getY: function (index) {
            return this.array[index * this.itemSize + 1];
        },
        setY: function (index, y) {
            this.array[index * this.itemSize + 1] = y;
            return this;
        },
        getZ: function (index) {
            return this.array[index * this.itemSize + 2];
        },
        setZ: function (index, z) {
            this.array[index * this.itemSize + 2] = z;
            return this;
        },
        getW: function (index) {
            return this.array[index * this.itemSize + 3];
        },
        setW: function (index, w) {
            this.array[index * this.itemSize + 3] = w;
            return this;
        },
        setXY: function (index, x, y) {
            index *= this.itemSize;
            this.array[index + 0] = x;
            this.array[index + 1] = y;
            return this;
        },
        setXYZ: function (index, x, y, z) {
            index *= this.itemSize;
            this.array[index + 0] = x;
            this.array[index + 1] = y;
            this.array[index + 2] = z;
            return this;
        },
        setXYZW: function (index, x, y, z, w) {
            index *= this.itemSize;
            this.array[index + 0] = x;
            this.array[index + 1] = y;
            this.array[index + 2] = z;
            this.array[index + 3] = w;
            return this;
        },
        onUpload: function (callback) {
            this.onUploadCallback = callback;
            return this;
        },
        clone: function () {
            return new this.constructor(this.array, this.itemSize).copy(this);
        },
        toJSON: function () {
            return {
                itemSize: this.itemSize,
                type: this.array.constructor.name,
                array: Array.prototype.slice.call(this.array),
                normalized: this.normalized
            };
        }
    });
    //
    function Int8BufferAttribute(array, itemSize, normalized) {
        BufferAttribute.call(this, new Int8Array(array), itemSize, normalized);
    }
    exports.Int8BufferAttribute = Int8BufferAttribute;
    Int8BufferAttribute.prototype = Object.create(BufferAttribute.prototype);
    Int8BufferAttribute.prototype.constructor = Int8BufferAttribute;
    function Uint8BufferAttribute(array, itemSize, normalized) {
        BufferAttribute.call(this, new Uint8Array(array), itemSize, normalized);
    }
    exports.Uint8BufferAttribute = Uint8BufferAttribute;
    Uint8BufferAttribute.prototype = Object.create(BufferAttribute.prototype);
    Uint8BufferAttribute.prototype.constructor = Uint8BufferAttribute;
    function Uint8ClampedBufferAttribute(array, itemSize, normalized) {
        BufferAttribute.call(this, new Uint8ClampedArray(array), itemSize, normalized);
    }
    exports.Uint8ClampedBufferAttribute = Uint8ClampedBufferAttribute;
    Uint8ClampedBufferAttribute.prototype = Object.create(BufferAttribute.prototype);
    Uint8ClampedBufferAttribute.prototype.constructor = Uint8ClampedBufferAttribute;
    function Int16BufferAttribute(array, itemSize, normalized) {
        BufferAttribute.call(this, new Int16Array(array), itemSize, normalized);
    }
    exports.Int16BufferAttribute = Int16BufferAttribute;
    Int16BufferAttribute.prototype = Object.create(BufferAttribute.prototype);
    Int16BufferAttribute.prototype.constructor = Int16BufferAttribute;
    function Uint16BufferAttribute(array, itemSize, normalized) {
        BufferAttribute.call(this, new Uint16Array(array), itemSize, normalized);
    }
    exports.Uint16BufferAttribute = Uint16BufferAttribute;
    Uint16BufferAttribute.prototype = Object.create(BufferAttribute.prototype);
    Uint16BufferAttribute.prototype.constructor = Uint16BufferAttribute;
    function Int32BufferAttribute(array, itemSize, normalized) {
        BufferAttribute.call(this, new Int32Array(array), itemSize, normalized);
    }
    exports.Int32BufferAttribute = Int32BufferAttribute;
    Int32BufferAttribute.prototype = Object.create(BufferAttribute.prototype);
    Int32BufferAttribute.prototype.constructor = Int32BufferAttribute;
    function Uint32BufferAttribute(array, itemSize, normalized) {
        BufferAttribute.call(this, new Uint32Array(array), itemSize, normalized);
    }
    exports.Uint32BufferAttribute = Uint32BufferAttribute;
    Uint32BufferAttribute.prototype = Object.create(BufferAttribute.prototype);
    Uint32BufferAttribute.prototype.constructor = Uint32BufferAttribute;
    function Float32BufferAttribute(array, itemSize, normalized) {
        BufferAttribute.call(this, new Float32Array(array), itemSize, normalized);
    }
    exports.Float32BufferAttribute = Float32BufferAttribute;
    Float32BufferAttribute.prototype = Object.create(BufferAttribute.prototype);
    Float32BufferAttribute.prototype.constructor = Float32BufferAttribute;
    function Float64BufferAttribute(array, itemSize, normalized) {
        BufferAttribute.call(this, new Float64Array(array), itemSize, normalized);
    }
    exports.Float64BufferAttribute = Float64BufferAttribute;
    Float64BufferAttribute.prototype = Object.create(BufferAttribute.prototype);
    Float64BufferAttribute.prototype.constructor = Float64BufferAttribute;
});
//# sourceMappingURL=BufferAttribute.js.map