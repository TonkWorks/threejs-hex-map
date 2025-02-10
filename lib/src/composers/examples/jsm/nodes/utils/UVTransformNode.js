define(["require", "exports", "../core/ExpressionNode.js", "../inputs/Matrix3Node.js", "../accessors/UVNode.js"], function (require, exports, ExpressionNode_js_1, Matrix3Node_js_1, UVNode_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function UVTransformNode(uv, position) {
        ExpressionNode_js_1.ExpressionNode.call(this, "( uvTransform * vec3( uvNode, 1 ) ).xy", "vec2");
        this.uv = uv || new UVNode_js_1.UVNode();
        this.position = position || new Matrix3Node_js_1.Matrix3Node();
    }
    exports.UVTransformNode = UVTransformNode;
    UVTransformNode.prototype = Object.create(ExpressionNode_js_1.ExpressionNode.prototype);
    UVTransformNode.prototype.constructor = UVTransformNode;
    UVTransformNode.prototype.nodeType = "UVTransform";
    UVTransformNode.prototype.generate = function (builder, output) {
        this.keywords["uvNode"] = this.uv;
        this.keywords["uvTransform"] = this.position;
        return ExpressionNode_js_1.ExpressionNode.prototype.generate.call(this, builder, output);
    };
    UVTransformNode.prototype.setUvTransform = function (tx, ty, sx, sy, rotation, cx, cy) {
        cx = cx !== undefined ? cx : .5;
        cy = cy !== undefined ? cy : .5;
        this.position.value.setUvTransform(tx, ty, sx, sy, rotation, cx, cy);
    };
    UVTransformNode.prototype.copy = function (source) {
        ExpressionNode_js_1.ExpressionNode.prototype.copy.call(this, source);
        this.uv = source.uv;
        this.position = source.position;
        return this;
    };
    UVTransformNode.prototype.toJSON = function (meta) {
        var data = this.getJSONNode(meta);
        if (!data) {
            data = this.createJSONNode(meta);
            data.uv = this.uv.toJSON(meta).uuid;
            data.position = this.position.toJSON(meta).uuid;
        }
        return data;
    };
});
//# sourceMappingURL=UVTransformNode.js.map