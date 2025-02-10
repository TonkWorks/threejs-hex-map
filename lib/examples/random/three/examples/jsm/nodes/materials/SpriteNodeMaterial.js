define(["require", "exports", "./nodes/SpriteNode.js", "./NodeMaterial.js", "../core/NodeUtils.js"], function (require, exports, SpriteNode_js_1, NodeMaterial_js_1, NodeUtils_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function SpriteNodeMaterial() {
        var node = new SpriteNode_js_1.SpriteNode();
        NodeMaterial_js_1.NodeMaterial.call(this, node, node);
        this.type = "SpriteNodeMaterial";
    }
    exports.SpriteNodeMaterial = SpriteNodeMaterial;
    SpriteNodeMaterial.prototype = Object.create(NodeMaterial_js_1.NodeMaterial.prototype);
    SpriteNodeMaterial.prototype.constructor = SpriteNodeMaterial;
    NodeUtils_js_1.NodeUtils.addShortcuts(SpriteNodeMaterial.prototype, 'fragment', [
        'color',
        'alpha',
        'mask',
        'position',
        'spherical'
    ]);
});
//# sourceMappingURL=SpriteNodeMaterial.js.map