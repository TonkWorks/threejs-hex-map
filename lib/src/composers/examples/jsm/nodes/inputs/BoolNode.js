define(["require", "exports", "../core/InputNode.js"], function (require, exports, InputNode_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function BoolNode(value) {
        InputNode_js_1.InputNode.call(this, 'b');
        this.value = Boolean(value);
    }
    exports.BoolNode = BoolNode;
    BoolNode.prototype = Object.create(InputNode_js_1.InputNode.prototype);
    BoolNode.prototype.constructor = BoolNode;
    BoolNode.prototype.nodeType = "Bool";
    BoolNode.prototype.generateReadonly = function (builder, output, uuid, type /*, ns, needsUpdate */) {
        return builder.format(this.value, type, output);
    };
    BoolNode.prototype.copy = function (source) {
        InputNode_js_1.InputNode.prototype.copy.call(this, source);
        this.value = source.value;
        return this;
    };
    BoolNode.prototype.toJSON = function (meta) {
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
//# sourceMappingURL=BoolNode.js.map