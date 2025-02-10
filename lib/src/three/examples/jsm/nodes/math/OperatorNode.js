define(["require", "exports", "../core/TempNode.js"], function (require, exports, TempNode_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function OperatorNode(a, b, op) {
        TempNode_js_1.TempNode.call(this);
        this.a = a;
        this.b = b;
        this.op = op;
    }
    exports.OperatorNode = OperatorNode;
    OperatorNode.ADD = '+';
    OperatorNode.SUB = '-';
    OperatorNode.MUL = '*';
    OperatorNode.DIV = '/';
    OperatorNode.prototype = Object.create(TempNode_js_1.TempNode.prototype);
    OperatorNode.prototype.constructor = OperatorNode;
    OperatorNode.prototype.nodeType = "Operator";
    OperatorNode.prototype.getType = function (builder) {
        var a = this.a.getType(builder), b = this.b.getType(builder);
        if (builder.isTypeMatrix(a)) {
            return 'v4';
        }
        else if (builder.getTypeLength(b) > builder.getTypeLength(a)) {
            // use the greater length vector
            return b;
        }
        return a;
    };
    OperatorNode.prototype.generate = function (builder, output) {
        var type = this.getType(builder);
        var a = this.a.build(builder, type), b = this.b.build(builder, type);
        return builder.format('( ' + a + ' ' + this.op + ' ' + b + ' )', type, output);
    };
    OperatorNode.prototype.copy = function (source) {
        TempNode_js_1.TempNode.prototype.copy.call(this, source);
        this.a = source.a;
        this.b = source.b;
        this.op = source.op;
        return this;
    };
    OperatorNode.prototype.toJSON = function (meta) {
        var data = this.getJSONNode(meta);
        if (!data) {
            data = this.createJSONNode(meta);
            data.a = this.a.toJSON(meta).uuid;
            data.b = this.b.toJSON(meta).uuid;
            data.op = this.op;
        }
        return data;
    };
});
//# sourceMappingURL=OperatorNode.js.map