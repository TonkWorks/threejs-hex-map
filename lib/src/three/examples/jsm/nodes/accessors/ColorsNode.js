define(["require", "exports", "../core/TempNode.js"], function (require, exports, TempNode_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var vertexDict = ['color', 'color2'], fragmentDict = ['vColor', 'vColor2'];
    function ColorsNode(index) {
        TempNode_js_1.TempNode.call(this, 'v4', { shared: false });
        this.index = index || 0;
    }
    exports.ColorsNode = ColorsNode;
    ColorsNode.prototype = Object.create(TempNode_js_1.TempNode.prototype);
    ColorsNode.prototype.constructor = ColorsNode;
    ColorsNode.prototype.nodeType = "Colors";
    ColorsNode.prototype.generate = function (builder, output) {
        builder.requires.color[this.index] = true;
        var result = builder.isShader('vertex') ? vertexDict[this.index] : fragmentDict[this.index];
        return builder.format(result, this.getType(builder), output);
    };
    ColorsNode.prototype.copy = function (source) {
        TempNode_js_1.TempNode.prototype.copy.call(this, source);
        this.index = source.index;
        return this;
    };
    ColorsNode.prototype.toJSON = function (meta) {
        var data = this.getJSONNode(meta);
        if (!data) {
            data = this.createJSONNode(meta);
            data.index = this.index;
        }
        return data;
    };
});
//# sourceMappingURL=ColorsNode.js.map