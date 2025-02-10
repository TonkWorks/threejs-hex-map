define(["require", "exports", "./Node.js"], function (require, exports, Node_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function VarNode(type, value) {
        Node_js_1.Node.call(this, type);
        this.value = value;
    }
    exports.VarNode = VarNode;
    VarNode.prototype = Object.create(Node_js_1.Node.prototype);
    VarNode.prototype.constructor = VarNode;
    VarNode.prototype.nodeType = "Var";
    VarNode.prototype.getType = function (builder) {
        return builder.getTypeByFormat(this.type);
    };
    VarNode.prototype.generate = function (builder, output) {
        var varying = builder.getVar(this.uuid, this.type);
        if (this.value && builder.isShader('vertex')) {
            builder.addNodeCode(varying.name + ' = ' + this.value.build(builder, this.getType(builder)) + ';');
        }
        return builder.format(varying.name, this.getType(builder), output);
    };
    VarNode.prototype.copy = function (source) {
        Node_js_1.Node.prototype.copy.call(this, source);
        this.type = source.type;
        this.value = source.value;
        return this;
    };
    VarNode.prototype.toJSON = function (meta) {
        var data = this.getJSONNode(meta);
        if (!data) {
            data = this.createJSONNode(meta);
            data.type = this.type;
            if (this.value)
                data.value = this.value.toJSON(meta).uuid;
        }
        return data;
    };
});
//# sourceMappingURL=VarNode.js.map