define(["require", "exports", "../../../../build/three.module.js"], function (require, exports, three_module_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class WebGPUUniform {
        constructor(name, value = null) {
            this.name = name;
            this.value = value;
            this.boundary = 0; // used to build the uniform buffer according to the STD140 layout
            this.itemSize = 0;
            this.offset = 0; // this property is set by WebGPUUniformsGroup and marks the start position in the uniform buffer
        }
        setValue(value) {
            this.value = value;
        }
    }
    class FloatUniform extends WebGPUUniform {
        constructor(name, value = 0) {
            super(name, value);
            this.boundary = 4;
            this.itemSize = 1;
            Object.defineProperty(this, 'isFloatUniform', { value: true });
        }
    }
    exports.FloatUniform = FloatUniform;
    class Vector2Uniform extends WebGPUUniform {
        constructor(name, value = new three_module_js_1.Vector2()) {
            super(name, value);
            this.boundary = 8;
            this.itemSize = 2;
            Object.defineProperty(this, 'isVector2Uniform', { value: true });
        }
    }
    exports.Vector2Uniform = Vector2Uniform;
    class Vector3Uniform extends WebGPUUniform {
        constructor(name, value = new three_module_js_1.Vector3()) {
            super(name, value);
            this.boundary = 16;
            this.itemSize = 3;
            Object.defineProperty(this, 'isVector3Uniform', { value: true });
        }
    }
    exports.Vector3Uniform = Vector3Uniform;
    class Vector4Uniform extends WebGPUUniform {
        constructor(name, value = new three_module_js_1.Vector4()) {
            super(name, value);
            this.boundary = 16;
            this.itemSize = 4;
            Object.defineProperty(this, 'isVector4Uniform', { value: true });
        }
    }
    exports.Vector4Uniform = Vector4Uniform;
    class ColorUniform extends WebGPUUniform {
        constructor(name, value = new three_module_js_1.Color()) {
            super(name, value);
            this.boundary = 16;
            this.itemSize = 3;
            Object.defineProperty(this, 'isColorUniform', { value: true });
        }
    }
    exports.ColorUniform = ColorUniform;
    class Matrix3Uniform extends WebGPUUniform {
        constructor(name, value = new three_module_js_1.Matrix3()) {
            super(name, value);
            this.boundary = 48;
            this.itemSize = 12;
            Object.defineProperty(this, 'isMatrix3Uniform', { value: true });
        }
    }
    exports.Matrix3Uniform = Matrix3Uniform;
    class Matrix4Uniform extends WebGPUUniform {
        constructor(name, value = new three_module_js_1.Matrix4()) {
            super(name, value);
            this.boundary = 64;
            this.itemSize = 16;
            Object.defineProperty(this, 'isMatrix4Uniform', { value: true });
        }
    }
    exports.Matrix4Uniform = Matrix4Uniform;
});
//# sourceMappingURL=WebGPUUniform.js.map