define(["require", "exports", "../../core/Node.js"], function (require, exports, Node_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function RawNode(value) {
        Node_js_1.Node.call(this, 'v4');
        this.value = value;
    }
    exports.RawNode = RawNode;
    RawNode.prototype = Object.create(Node_js_1.Node.prototype);
    RawNode.prototype.constructor = RawNode;
    RawNode.prototype.nodeType = "Raw";
    RawNode.prototype.generate = function (builder) {
        var data = this.value.analyzeAndFlow(builder, this.type), code = data.code + '\n';
        if (builder.isShader('vertex')) {
            code += 'gl_Position = ' + data.result + ';';
        }
        else {
            code += 'gl_FragColor = ' + data.result + ';';
        }
        return code;
    };
    RawNode.prototype.copy = function (source) {
        Node_js_1.Node.prototype.copy.call(this, source);
        this.value = source.value;
        return this;
    };
    RawNode.prototype.toJSON = function (meta) {
        var data = this.getJSONNode(meta);
        if (!data) {
            data = this.createJSONNode(meta);
            data.value = this.value.toJSON(meta).uuid;
        }
        return data;
    };
});
//# sourceMappingURL=RawNode.js.map