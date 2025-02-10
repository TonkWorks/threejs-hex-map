define(["require", "exports", "./nodes/MeshStandardNode.js", "./NodeMaterial.js", "../core/NodeUtils.js"], function (require, exports, MeshStandardNode_js_1, NodeMaterial_js_1, NodeUtils_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function MeshStandardNodeMaterial() {
        var node = new MeshStandardNode_js_1.MeshStandardNode();
        NodeMaterial_js_1.NodeMaterial.call(this, node, node);
        this.type = "MeshStandardNodeMaterial";
    }
    exports.MeshStandardNodeMaterial = MeshStandardNodeMaterial;
    MeshStandardNodeMaterial.prototype = Object.create(NodeMaterial_js_1.NodeMaterial.prototype);
    MeshStandardNodeMaterial.prototype.constructor = MeshStandardNodeMaterial;
    NodeUtils_js_1.NodeUtils.addShortcuts(MeshStandardNodeMaterial.prototype, 'properties', [
        "color",
        "roughness",
        "metalness",
        "map",
        "normalMap",
        "normalScale",
        "metalnessMap",
        "roughnessMap",
        "envMap"
    ]);
});
//# sourceMappingURL=MeshStandardNodeMaterial.js.map