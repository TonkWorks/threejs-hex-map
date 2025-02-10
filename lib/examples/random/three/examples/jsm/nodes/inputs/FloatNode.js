define(["require", "exports", "../core/InputNode.js"], function (require, exports, InputNode_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function FloatNode(value) {
        InputNode_js_1.InputNode.call(this, 'f');
        this.value = value || 0;
    }
    exports.FloatNode = FloatNode;
    FloatNode.prototype = Object.create(InputNode_js_1.InputNode.prototype);
    FloatNode.prototype.constructor = FloatNode;
    FloatNode.prototype.nodeType = "Float";
    FloatNode.prototype.generateReadonly = function (builder, output, uuid, type /*, ns, needsUpdate */) {
        return builder.format(this.value + (this.value % 1 ? '' : '.0'), type, output);
    };
    FloatNode.prototype.copy = function (source) {
        InputNode_js_1.InputNode.prototype.copy.call(this, source);
        this.value = source.value;
        return this;
    };
    FloatNode.prototype.toJSON = function (meta) {
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
//# sourceMappingURL=FloatNode.js.map