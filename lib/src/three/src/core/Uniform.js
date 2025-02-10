define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Uniform {
        constructor(value) {
            if (typeof value === 'string') {
                console.warn('THREE.Uniform: Type parameter is no longer needed.');
                value = arguments[1];
            }
            this.value = value;
        }
        clone() {
            return new Uniform(this.value.clone === undefined ? this.value : this.value.clone());
        }
    }
    exports.Uniform = Uniform;
});
//# sourceMappingURL=Uniform.js.map