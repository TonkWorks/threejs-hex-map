define(["require", "exports", "../../../../build/three.module.js", "../../postprocessing/ShaderPass.js", "../materials/NodeMaterial.js", "../inputs/ScreenNode.js"], function (require, exports, three_module_js_1, ShaderPass_js_1, NodeMaterial_js_1, ScreenNode_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function NodePass() {
        ShaderPass_js_1.ShaderPass.call(this);
        this.name = "";
        this.uuid = three_module_js_1.MathUtils.generateUUID();
        this.userData = {};
        this.textureID = 'renderTexture';
        this.input = new ScreenNode_js_1.ScreenNode();
        this.material = new NodeMaterial_js_1.NodeMaterial();
        this.needsUpdate = true;
    }
    exports.NodePass = NodePass;
    NodePass.prototype = Object.create(ShaderPass_js_1.ShaderPass.prototype);
    NodePass.prototype.constructor = NodePass;
    NodePass.prototype.render = function () {
        if (this.needsUpdate) {
            this.material.dispose();
            this.material.fragment.value = this.input;
            this.needsUpdate = false;
        }
        this.uniforms = this.material.uniforms;
        ShaderPass_js_1.ShaderPass.prototype.render.apply(this, arguments);
    };
    NodePass.prototype.copy = function (source) {
        this.input = source.input;
        return this;
    };
    NodePass.prototype.toJSON = function (meta) {
        var isRootObject = (meta === undefined || typeof meta === 'string');
        if (isRootObject) {
            meta = {
                nodes: {}
            };
        }
        if (meta && !meta.passes)
            meta.passes = {};
        if (!meta.passes[this.uuid]) {
            var data = {};
            data.uuid = this.uuid;
            data.type = "NodePass";
            meta.passes[this.uuid] = data;
            if (this.name !== "")
                data.name = this.name;
            if (JSON.stringify(this.userData) !== '{}')
                data.userData = this.userData;
            data.input = this.input.toJSON(meta).uuid;
        }
        meta.pass = this.uuid;
        return meta;
    };
});
//# sourceMappingURL=NodePass.js.map