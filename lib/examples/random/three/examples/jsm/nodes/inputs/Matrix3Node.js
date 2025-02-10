define(["require", "exports", "../../../../build/three.module.js", "../core/InputNode.js"], function (require, exports, three_module_js_1, InputNode_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function Matrix3Node(matrix) {
        InputNode_js_1.InputNode.call(this, 'm3');
        this.value = matrix || new three_module_js_1.Matrix3();
    }
    exports.Matrix3Node = Matrix3Node;
    Matrix3Node.prototype = Object.create(InputNode_js_1.InputNode.prototype);
    Matrix3Node.prototype.constructor = Matrix3Node;
    Matrix3Node.prototype.nodeType = "Matrix3";
    Object.defineProperties(Matrix3Node.prototype, {
        elements: {
            set: function (val) {
                this.value.elements = val;
            },
            get: function () {
                return this.value.elements;
            }
        }
    });
    Matrix3Node.prototype.generateReadonly = function (builder, output, uuid, type /*, ns, needsUpdate */) {
        return builder.format("mat3( " + this.value.elements.join(", ") + " )", type, output);
    };
    Matrix3Node.prototype.copy = function (source) {
        InputNode_js_1.InputNode.prototype.copy.call(this, source);
        this.value.fromArray(source.elements);
        return this;
    };
    Matrix3Node.prototype.toJSON = function (meta) {
        var data = this.getJSONNode(meta);
        if (!data) {
            data = this.createJSONNode(meta);
            data.elements = this.value.elements.concat();
        }
        return data;
    };
});
//# sourceMappingURL=Matrix3Node.js.map