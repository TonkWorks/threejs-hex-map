define(["require", "exports", "../core/TempNode.js", "./ResolutionNode.js"], function (require, exports, TempNode_js_1, ResolutionNode_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ScreenUVNode(resolution) {
        TempNode_js_1.TempNode.call(this, 'v2');
        this.resolution = resolution || new ResolutionNode_js_1.ResolutionNode();
    }
    exports.ScreenUVNode = ScreenUVNode;
    ScreenUVNode.prototype = Object.create(TempNode_js_1.TempNode.prototype);
    ScreenUVNode.prototype.constructor = ScreenUVNode;
    ScreenUVNode.prototype.nodeType = "ScreenUV";
    ScreenUVNode.prototype.generate = function (builder, output) {
        var result;
        if (builder.isShader('fragment')) {
            result = '( gl_FragCoord.xy / ' + this.resolution.build(builder, 'v2') + ')';
        }
        else {
            console.warn("THREE.ScreenUVNode is not compatible with " + builder.shader + " shader.");
            result = 'vec2( 0.0 )';
        }
        return builder.format(result, this.getType(builder), output);
    };
    ScreenUVNode.prototype.copy = function (source) {
        TempNode_js_1.TempNode.prototype.copy.call(this, source);
        this.resolution = source.resolution;
        return this;
    };
    ScreenUVNode.prototype.toJSON = function (meta) {
        var data = this.getJSONNode(meta);
        if (!data) {
            data = this.createJSONNode(meta);
            data.resolution = this.resolution.toJSON(meta).uuid;
        }
        return data;
    };
});
//# sourceMappingURL=ScreenUVNode.js.map