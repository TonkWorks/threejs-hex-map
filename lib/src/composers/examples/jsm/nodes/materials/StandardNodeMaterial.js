define(["require", "exports", "./nodes/StandardNode.js", "./NodeMaterial.js", "../core/NodeUtils.js"], function (require, exports, StandardNode_js_1, NodeMaterial_js_1, NodeUtils_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function StandardNodeMaterial() {
        var node = new StandardNode_js_1.StandardNode();
        NodeMaterial_js_1.NodeMaterial.call(this, node, node);
        this.type = "StandardNodeMaterial";
    }
    exports.StandardNodeMaterial = StandardNodeMaterial;
    StandardNodeMaterial.prototype = Object.create(NodeMaterial_js_1.NodeMaterial.prototype);
    StandardNodeMaterial.prototype.constructor = StandardNodeMaterial;
    NodeUtils_js_1.NodeUtils.addShortcuts(StandardNodeMaterial.prototype, 'fragment', [
        'color',
        'alpha',
        'roughness',
        'metalness',
        'reflectivity',
        'clearcoat',
        'clearcoatRoughness',
        'clearcoatNormal',
        'normal',
        'emissive',
        'ambient',
        'light',
        'shadow',
        'ao',
        'environment',
        'mask',
        'position',
        'sheen'
    ]);
});
//# sourceMappingURL=StandardNodeMaterial.js.map