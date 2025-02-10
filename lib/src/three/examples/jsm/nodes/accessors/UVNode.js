define(["require", "exports", "../core/TempNode.js", "../core/NodeLib.js"], function (require, exports, TempNode_js_1, NodeLib_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function UVNode(index) {
        TempNode_js_1.TempNode.call(this, 'v2', { shared: false });
        this.index = index || 0;
    }
    exports.UVNode = UVNode;
    UVNode.prototype = Object.create(TempNode_js_1.TempNode.prototype);
    UVNode.prototype.constructor = UVNode;
    UVNode.prototype.nodeType = "UV";
    UVNode.prototype.generate = function (builder, output) {
        builder.requires.uv[this.index] = true;
        var uvIndex = this.index > 0 ? this.index + 1 : '';
        var result = builder.isShader('vertex') ? 'uv' + uvIndex : 'vUv' + uvIndex;
        return builder.format(result, this.getType(builder), output);
    };
    UVNode.prototype.copy = function (source) {
        TempNode_js_1.TempNode.prototype.copy.call(this, source);
        this.index = source.index;
        return this;
    };
    UVNode.prototype.toJSON = function (meta) {
        var data = this.getJSONNode(meta);
        if (!data) {
            data = this.createJSONNode(meta);
            data.index = this.index;
        }
        return data;
    };
    NodeLib_js_1.NodeLib.addKeyword('uv', function () {
        return new UVNode();
    });
    NodeLib_js_1.NodeLib.addKeyword('uv2', function () {
        return new UVNode(1);
    });
});
//# sourceMappingURL=UVNode.js.map