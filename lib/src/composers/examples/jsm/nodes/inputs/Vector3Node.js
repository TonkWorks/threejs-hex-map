define(["require", "exports", "../../../../build/three.module.js", "../core/InputNode.js", "../core/NodeUtils.js"], function (require, exports, three_module_js_1, InputNode_js_1, NodeUtils_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function Vector3Node(x, y, z) {
        InputNode_js_1.InputNode.call(this, 'v3');
        this.value = x instanceof three_module_js_1.Vector3 ? x : new three_module_js_1.Vector3(x, y, z);
    }
    exports.Vector3Node = Vector3Node;
    Vector3Node.prototype = Object.create(InputNode_js_1.InputNode.prototype);
    Vector3Node.prototype.constructor = Vector3Node;
    Vector3Node.prototype.nodeType = "Vector3";
    NodeUtils_js_1.NodeUtils.addShortcuts(Vector3Node.prototype, 'value', ['x', 'y', 'z']);
    Vector3Node.prototype.generateReadonly = function (builder, output, uuid, type /*, ns, needsUpdate*/) {
        return builder.format("vec3( " + this.x + ", " + this.y + ", " + this.z + " )", type, output);
    };
    Vector3Node.prototype.copy = function (source) {
        InputNode_js_1.InputNode.prototype.copy.call(this, source);
        this.value.copy(source);
        return this;
    };
    Vector3Node.prototype.toJSON = function (meta) {
        var data = this.getJSONNode(meta);
        if (!data) {
            data = this.createJSONNode(meta);
            data.x = this.x;
            data.y = this.y;
            data.z = this.z;
            if (this.readonly === true)
                data.readonly = true;
        }
        return data;
    };
});
//# sourceMappingURL=Vector3Node.js.map