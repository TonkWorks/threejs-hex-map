define(["require", "exports", "../core/TempNode.js", "../core/InputNode.js", "../accessors/PositionNode.js", "../math/OperatorNode.js", "./TextureNode.js", "./Matrix4Node.js"], function (require, exports, TempNode_js_1, InputNode_js_1, PositionNode_js_1, OperatorNode_js_1, TextureNode_js_1, Matrix4Node_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ReflectorNode(mirror) {
        TempNode_js_1.TempNode.call(this, 'v4');
        if (mirror)
            this.setMirror(mirror);
    }
    exports.ReflectorNode = ReflectorNode;
    ReflectorNode.prototype = Object.create(TempNode_js_1.TempNode.prototype);
    ReflectorNode.prototype.constructor = ReflectorNode;
    ReflectorNode.prototype.nodeType = "Reflector";
    ReflectorNode.prototype.setMirror = function (mirror) {
        this.mirror = mirror;
        this.textureMatrix = new Matrix4Node_js_1.Matrix4Node(this.mirror.material.uniforms.textureMatrix.value);
        this.localPosition = new PositionNode_js_1.PositionNode(PositionNode_js_1.PositionNode.LOCAL);
        this.uv = new OperatorNode_js_1.OperatorNode(this.textureMatrix, this.localPosition, OperatorNode_js_1.OperatorNode.MUL);
        this.uvResult = new OperatorNode_js_1.OperatorNode(null, this.uv, OperatorNode_js_1.OperatorNode.ADD);
        this.texture = new TextureNode_js_1.TextureNode(this.mirror.material.uniforms.tDiffuse.value, this.uv, null, true);
    };
    ReflectorNode.prototype.generate = function (builder, output) {
        if (builder.isShader('fragment')) {
            this.uvResult.a = this.offset;
            this.texture.uv = this.offset ? this.uvResult : this.uv;
            if (output === 'sampler2D') {
                return this.texture.build(builder, output);
            }
            return builder.format(this.texture.build(builder, this.type), this.type, output);
        }
        else {
            console.warn("THREE.ReflectorNode is not compatible with " + builder.shader + " shader.");
            return builder.format('vec4( 0.0 )', this.type, output);
        }
    };
    ReflectorNode.prototype.copy = function (source) {
        InputNode_js_1.InputNode.prototype.copy.call(this, source);
        this.scope.mirror = source.mirror;
        return this;
    };
    ReflectorNode.prototype.toJSON = function (meta) {
        var data = this.getJSONNode(meta);
        if (!data) {
            data = this.createJSONNode(meta);
            data.mirror = this.mirror.uuid;
            if (this.offset)
                data.offset = this.offset.toJSON(meta).uuid;
        }
        return data;
    };
});
//# sourceMappingURL=ReflectorNode.js.map