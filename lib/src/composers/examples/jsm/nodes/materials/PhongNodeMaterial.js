define(["require", "exports", "./nodes/PhongNode.js", "./NodeMaterial.js", "../core/NodeUtils.js"], function (require, exports, PhongNode_js_1, NodeMaterial_js_1, NodeUtils_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function PhongNodeMaterial() {
        var node = new PhongNode_js_1.PhongNode();
        NodeMaterial_js_1.NodeMaterial.call(this, node, node);
        this.type = "PhongNodeMaterial";
    }
    exports.PhongNodeMaterial = PhongNodeMaterial;
    PhongNodeMaterial.prototype = Object.create(NodeMaterial_js_1.NodeMaterial.prototype);
    PhongNodeMaterial.prototype.constructor = PhongNodeMaterial;
    NodeUtils_js_1.NodeUtils.addShortcuts(PhongNodeMaterial.prototype, 'fragment', [
        'color',
        'alpha',
        'specular',
        'shininess',
        'normal',
        'emissive',
        'ambient',
        'light',
        'shadow',
        'ao',
        'environment',
        'environmentAlpha',
        'mask',
        'position'
    ]);
});
//# sourceMappingURL=PhongNodeMaterial.js.map