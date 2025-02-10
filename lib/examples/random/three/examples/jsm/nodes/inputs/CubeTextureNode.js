define(["require", "exports", "../core/InputNode.js", "../accessors/ReflectNode.js", "../utils/ColorSpaceNode.js", "../core/ExpressionNode.js"], function (require, exports, InputNode_js_1, ReflectNode_js_1, ColorSpaceNode_js_1, ExpressionNode_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function CubeTextureNode(value, uv, bias) {
        InputNode_js_1.InputNode.call(this, 'v4', { shared: true });
        this.value = value;
        this.uv = uv || new ReflectNode_js_1.ReflectNode();
        this.bias = bias;
    }
    exports.CubeTextureNode = CubeTextureNode;
    CubeTextureNode.prototype = Object.create(InputNode_js_1.InputNode.prototype);
    CubeTextureNode.prototype.constructor = CubeTextureNode;
    CubeTextureNode.prototype.nodeType = "CubeTexture";
    CubeTextureNode.prototype.getTexture = function (builder, output) {
        return InputNode_js_1.InputNode.prototype.generate.call(this, builder, output, this.value.uuid, 'tc');
    };
    CubeTextureNode.prototype.generate = function (builder, output) {
        if (output === 'samplerCube') {
            return this.getTexture(builder, output);
        }
        var cubetex = this.getTexture(builder, output);
        var uv = this.uv.build(builder, 'v3');
        var bias = this.bias ? this.bias.build(builder, 'f') : undefined;
        if (bias === undefined && builder.context.bias) {
            bias = builder.context.bias.setTexture(this).build(builder, 'f');
        }
        var code;
        if (bias)
            code = 'texCubeBias( ' + cubetex + ', ' + uv + ', ' + bias + ' )';
        else
            code = 'texCube( ' + cubetex + ', ' + uv + ' )';
        // add a custom context for fix incompatibility with the core
        // include ColorSpace function only for vertex shader (in fragment shader color space functions is added automatically by core)
        // this should be removed in the future
        // context.include =: is used to include or not functions if used FunctionNode
        // context.ignoreCache =: not create variables temp nodeT0..9 to optimize the code
        var context = { include: builder.isShader('vertex'), ignoreCache: true };
        var outputType = this.getType(builder);
        builder.addContext(context);
        this.colorSpace = this.colorSpace || new ColorSpaceNode_js_1.ColorSpaceNode(new ExpressionNode_js_1.ExpressionNode('', outputType));
        this.colorSpace.fromDecoding(builder.getTextureEncodingFromMap(this.value));
        this.colorSpace.input.parse(code);
        code = this.colorSpace.build(builder, outputType);
        // end custom context
        builder.removeContext();
        return builder.format(code, outputType, output);
    };
    CubeTextureNode.prototype.copy = function (source) {
        InputNode_js_1.InputNode.prototype.copy.call(this, source);
        if (source.value)
            this.value = source.value;
        this.uv = source.uv;
        if (source.bias)
            this.bias = source.bias;
        return this;
    };
    CubeTextureNode.prototype.toJSON = function (meta) {
        var data = this.getJSONNode(meta);
        if (!data) {
            data = this.createJSONNode(meta);
            data.value = this.value.uuid;
            data.uv = this.uv.toJSON(meta).uuid;
            if (this.bias)
                data.bias = this.bias.toJSON(meta).uuid;
        }
        return data;
    };
});
//# sourceMappingURL=CubeTextureNode.js.map