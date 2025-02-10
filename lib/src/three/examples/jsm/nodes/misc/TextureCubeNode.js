define(["require", "exports", "../core/TempNode.js", "../inputs/FloatNode.js", "./TextureCubeUVNode.js", "../accessors/ReflectNode.js", "../accessors/NormalNode.js"], function (require, exports, TempNode_js_1, FloatNode_js_1, TextureCubeUVNode_js_1, ReflectNode_js_1, NormalNode_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function TextureCubeNode(value, uv, bias) {
        TempNode_js_1.TempNode.call(this, 'v4');
        this.value = value;
        this.radianceNode = new TextureCubeUVNode_js_1.TextureCubeUVNode(this.value, uv || new ReflectNode_js_1.ReflectNode(ReflectNode_js_1.ReflectNode.VECTOR), 
        // bias should be replaced in builder.context in build process
        bias);
        this.irradianceNode = new TextureCubeUVNode_js_1.TextureCubeUVNode(this.value, new NormalNode_js_1.NormalNode(NormalNode_js_1.NormalNode.WORLD), new FloatNode_js_1.FloatNode(1).setReadonly(true));
    }
    exports.TextureCubeNode = TextureCubeNode;
    TextureCubeNode.prototype = Object.create(TempNode_js_1.TempNode.prototype);
    TextureCubeNode.prototype.constructor = TextureCubeNode;
    TextureCubeNode.prototype.nodeType = "TextureCube";
    TextureCubeNode.prototype.generate = function (builder, output) {
        if (builder.isShader('fragment')) {
            builder.require('irradiance');
            if (builder.context.bias) {
                builder.context.bias.setTexture(this.value);
            }
            var scopeNode = builder.slot === 'irradiance' ? this.irradianceNode : this.radianceNode;
            return scopeNode.build(builder, output);
        }
        else {
            console.warn("THREE.TextureCubeNode is not compatible with " + builder.shader + " shader.");
            return builder.format('vec4( 0.0 )', this.getType(builder), output);
        }
    };
    TextureCubeNode.prototype.copy = function (source) {
        TempNode_js_1.TempNode.prototype.copy.call(this, source);
        this.value = source.value;
        return this;
    };
    TextureCubeNode.prototype.toJSON = function (meta) {
        var data = this.getJSONNode(meta);
        if (!data) {
            data = this.createJSONNode(meta);
            data.value = this.value.toJSON(meta).uuid;
        }
        return data;
    };
});
//# sourceMappingURL=TextureCubeNode.js.map