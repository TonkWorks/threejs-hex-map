define(["require", "exports", "../../../../../build/three.module.js", "./StandardNode.js", "../../inputs/PropertyNode.js", "../../math/OperatorNode.js", "../../utils/SwitchNode.js", "../../misc/NormalMapNode.js"], function (require, exports, three_module_js_1, StandardNode_js_1, PropertyNode_js_1, OperatorNode_js_1, SwitchNode_js_1, NormalMapNode_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function MeshStandardNode() {
        StandardNode_js_1.StandardNode.call(this);
        this.properties = {
            color: new three_module_js_1.Color(0xffffff),
            roughness: 0.5,
            metalness: 0.5,
            normalScale: new three_module_js_1.Vector2(1, 1)
        };
        this.inputs = {
            color: new PropertyNode_js_1.PropertyNode(this.properties, 'color', 'c'),
            roughness: new PropertyNode_js_1.PropertyNode(this.properties, 'roughness', 'f'),
            metalness: new PropertyNode_js_1.PropertyNode(this.properties, 'metalness', 'f'),
            normalScale: new PropertyNode_js_1.PropertyNode(this.properties, 'normalScale', 'v2')
        };
    }
    exports.MeshStandardNode = MeshStandardNode;
    MeshStandardNode.prototype = Object.create(StandardNode_js_1.StandardNode.prototype);
    MeshStandardNode.prototype.constructor = MeshStandardNode;
    MeshStandardNode.prototype.nodeType = "MeshStandard";
    MeshStandardNode.prototype.build = function (builder) {
        var props = this.properties, inputs = this.inputs;
        if (builder.isShader('fragment')) {
            // slots
            // * color
            // * map
            var color = builder.findNode(props.color, inputs.color), map = builder.resolve(props.map);
            this.color = map ? new OperatorNode_js_1.OperatorNode(color, map, OperatorNode_js_1.OperatorNode.MUL) : color;
            // slots
            // * roughness
            // * roughnessMap
            var roughness = builder.findNode(props.roughness, inputs.roughness), roughnessMap = builder.resolve(props.roughnessMap);
            this.roughness = roughnessMap ? new OperatorNode_js_1.OperatorNode(roughness, new SwitchNode_js_1.SwitchNode(roughnessMap, "g"), OperatorNode_js_1.OperatorNode.MUL) : roughness;
            // slots
            // * metalness
            // * metalnessMap
            var metalness = builder.findNode(props.metalness, inputs.metalness), metalnessMap = builder.resolve(props.metalnessMap);
            this.metalness = metalnessMap ? new OperatorNode_js_1.OperatorNode(metalness, new SwitchNode_js_1.SwitchNode(metalnessMap, "b"), OperatorNode_js_1.OperatorNode.MUL) : metalness;
            // slots
            // * normalMap
            // * normalScale
            if (props.normalMap) {
                this.normal = new NormalMapNode_js_1.NormalMapNode(builder.resolve(props.normalMap));
                this.normal.scale = builder.findNode(props.normalScale, inputs.normalScale);
            }
            else {
                this.normal = undefined;
            }
            // slots
            // * envMap
            this.environment = builder.resolve(props.envMap);
        }
        // build code
        return StandardNode_js_1.StandardNode.prototype.build.call(this, builder);
    };
    MeshStandardNode.prototype.toJSON = function (meta) {
        var data = this.getJSONNode(meta);
        if (!data) {
            data = this.createJSONNode(meta);
            console.warn(".toJSON not implemented in", this);
        }
        return data;
    };
});
//# sourceMappingURL=MeshStandardNode.js.map