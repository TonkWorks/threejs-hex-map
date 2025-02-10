define(["require", "exports", "../../../../build/three.module.js", "../core/InputNode.js", "../core/NodeUtils.js"], function (require, exports, three_module_js_1, InputNode_js_1, NodeUtils_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function Vector2Node(x, y) {
        InputNode_js_1.InputNode.call(this, 'v2');
        this.value = x instanceof three_module_js_1.Vector2 ? x : new three_module_js_1.Vector2(x, y);
    }
    exports.Vector2Node = Vector2Node;
    Vector2Node.prototype = Object.create(InputNode_js_1.InputNode.prototype);
    Vector2Node.prototype.constructor = Vector2Node;
    Vector2Node.prototype.nodeType = "Vector2";
    NodeUtils_js_1.NodeUtils.addShortcuts(Vector2Node.prototype, 'value', ['x', 'y']);
    Vector2Node.prototype.generateReadonly = function (builder, output, uuid, type /*, ns, needsUpdate*/) {
        return builder.format("vec2( " + this.x + ", " + this.y + " )", type, output);
    };
    Vector2Node.prototype.copy = function (source) {
        InputNode_js_1.InputNode.prototype.copy.call(this, source);
        this.value.copy(source);
        return this;
    };
    Vector2Node.prototype.toJSON = function (meta) {
        var data = this.getJSONNode(meta);
        if (!data) {
            data = this.createJSONNode(meta);
            data.x = this.x;
            data.y = this.y;
            if (this.readonly === true)
                data.readonly = true;
        }
        return data;
    };
});
//# sourceMappingURL=Vector2Node.js.map