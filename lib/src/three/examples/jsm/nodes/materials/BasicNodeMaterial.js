define(["require", "exports", "./nodes/BasicNode.js", "./NodeMaterial.js", "../core/NodeUtils.js"], function (require, exports, BasicNode_js_1, NodeMaterial_js_1, NodeUtils_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function BasicNodeMaterial() {
        var node = new BasicNode_js_1.BasicNode();
        NodeMaterial_js_1.NodeMaterial.call(this, node, node);
        this.type = "BasicNodeMaterial";
    }
    exports.BasicNodeMaterial = BasicNodeMaterial;
    BasicNodeMaterial.prototype = Object.create(NodeMaterial_js_1.NodeMaterial.prototype);
    BasicNodeMaterial.prototype.constructor = BasicNodeMaterial;
    NodeUtils_js_1.NodeUtils.addShortcuts(BasicNodeMaterial.prototype, 'fragment', [
        'color',
        'alpha',
        'mask',
        'position'
    ]);
});
//# sourceMappingURL=BasicNodeMaterial.js.map