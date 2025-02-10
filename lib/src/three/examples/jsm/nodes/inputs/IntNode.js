define(["require", "exports", "../core/InputNode.js"], function (require, exports, InputNode_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function IntNode(value) {
        InputNode_js_1.InputNode.call(this, 'i');
        this.value = Math.floor(value || 0);
    }
    exports.IntNode = IntNode;
    IntNode.prototype = Object.create(InputNode_js_1.InputNode.prototype);
    IntNode.prototype.constructor = IntNode;
    IntNode.prototype.nodeType = "Int";
    IntNode.prototype.generateReadonly = function (builder, output, uuid, type /*, ns, needsUpdate */) {
        return builder.format(this.value, type, output);
    };
    IntNode.prototype.copy = function (source) {
        InputNode_js_1.InputNode.prototype.copy.call(this, source);
        this.value = source.value;
        return this;
    };
    IntNode.prototype.toJSON = function (meta) {
        var data = this.getJSONNode(meta);
        if (!data) {
            data = this.createJSONNode(meta);
            data.value = this.value;
            if (this.readonly === true)
                data.readonly = true;
        }
        return data;
    };
});
//# sourceMappingURL=IntNode.js.map