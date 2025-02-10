define(["require", "exports", "../core/TempNode.js", "../core/NodeUtils.js"], function (require, exports, TempNode_js_1, NodeUtils_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var inputs = NodeUtils_js_1.NodeUtils.elements;
    function JoinNode(x, y, z, w) {
        TempNode_js_1.TempNode.call(this, 'f');
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    exports.JoinNode = JoinNode;
    JoinNode.prototype = Object.create(TempNode_js_1.TempNode.prototype);
    JoinNode.prototype.constructor = JoinNode;
    JoinNode.prototype.nodeType = "Join";
    JoinNode.prototype.getNumElements = function () {
        var i = inputs.length;
        while (i--) {
            if (this[inputs[i]] !== undefined) {
                ++i;
                break;
            }
        }
        return Math.max(i, 2);
    };
    JoinNode.prototype.getType = function (builder) {
        return builder.getTypeFromLength(this.getNumElements());
    };
    JoinNode.prototype.generate = function (builder, output) {
        var type = this.getType(builder), length = this.getNumElements(), outputs = [];
        for (var i = 0; i < length; i++) {
            var elm = this[inputs[i]];
            outputs.push(elm ? elm.build(builder, 'f') : '0.0');
        }
        var code = (length > 1 ? builder.getConstructorFromLength(length) : '') + '( ' + outputs.join(', ') + ' )';
        return builder.format(code, type, output);
    };
    JoinNode.prototype.copy = function (source) {
        TempNode_js_1.TempNode.prototype.copy.call(this, source);
        for (var prop in source.inputs) {
            this[prop] = source.inputs[prop];
        }
        return this;
    };
    JoinNode.prototype.toJSON = function (meta) {
        var data = this.getJSONNode(meta);
        if (!data) {
            data = this.createJSONNode(meta);
            data.inputs = {};
            var length = this.getNumElements();
            for (var i = 0; i < length; i++) {
                var elm = this[inputs[i]];
                if (elm) {
                    data.inputs[inputs[i]] = elm.toJSON(meta).uuid;
                }
            }
        }
        return data;
    };
});
//# sourceMappingURL=JoinNode.js.map