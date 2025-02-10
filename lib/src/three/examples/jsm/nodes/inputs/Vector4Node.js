define(["require", "exports", "../../../../build/three.module.js", "../core/InputNode.js", "../core/NodeUtils.js"], function (require, exports, three_module_js_1, InputNode_js_1, NodeUtils_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function Vector4Node(x, y, z, w) {
        InputNode_js_1.InputNode.call(this, 'v4');
        this.value = x instanceof three_module_js_1.Vector4 ? x : new three_module_js_1.Vector4(x, y, z, w);
    }
    exports.Vector4Node = Vector4Node;
    Vector4Node.prototype = Object.create(InputNode_js_1.InputNode.prototype);
    Vector4Node.prototype.constructor = Vector4Node;
    Vector4Node.prototype.nodeType = "Vector4";
    NodeUtils_js_1.NodeUtils.addShortcuts(Vector4Node.prototype, 'value', ['x', 'y', 'z', 'w']);
    Vector4Node.prototype.generateReadonly = function (builder, output, uuid, type /*, ns, needsUpdate*/) {
        return builder.format("vec4( " + this.x + ", " + this.y + ", " + this.z + ", " + this.w + " )", type, output);
    };
    Vector4Node.prototype.copy = function (source) {
        InputNode_js_1.InputNode.prototype.copy.call(this, source);
        this.value.copy(source);
        return this;
    };
    Vector4Node.prototype.toJSON = function (meta) {
        var data = this.getJSONNode(meta);
        if (!data) {
            data = this.createJSONNode(meta);
            data.x = this.x;
            data.y = this.y;
            data.z = this.z;
            data.w = this.w;
            if (this.readonly === true)
                data.readonly = true;
        }
        return data;
    };
});
//# sourceMappingURL=Vector4Node.js.map