define(["require", "exports", "../../../../build/three.module.js", "../core/InputNode.js", "../core/NodeUtils.js"], function (require, exports, three_module_js_1, InputNode_js_1, NodeUtils_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ColorNode(color, g, b) {
        InputNode_js_1.InputNode.call(this, 'c');
        this.value = color instanceof three_module_js_1.Color ? color : new three_module_js_1.Color(color || 0, g, b);
    }
    exports.ColorNode = ColorNode;
    ColorNode.prototype = Object.create(InputNode_js_1.InputNode.prototype);
    ColorNode.prototype.constructor = ColorNode;
    ColorNode.prototype.nodeType = "Color";
    NodeUtils_js_1.NodeUtils.addShortcuts(ColorNode.prototype, 'value', ['r', 'g', 'b']);
    ColorNode.prototype.generateReadonly = function (builder, output, uuid, type /*, ns, needsUpdate */) {
        return builder.format("vec3( " + this.r + ", " + this.g + ", " + this.b + " )", type, output);
    };
    ColorNode.prototype.copy = function (source) {
        InputNode_js_1.InputNode.prototype.copy.call(this, source);
        this.value.copy(source);
        return this;
    };
    ColorNode.prototype.toJSON = function (meta) {
        var data = this.getJSONNode(meta);
        if (!data) {
            data = this.createJSONNode(meta);
            data.r = this.r;
            data.g = this.g;
            data.b = this.b;
            if (this.readonly === true)
                data.readonly = true;
        }
        return data;
    };
});
//# sourceMappingURL=ColorNode.js.map