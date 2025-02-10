define(["require", "exports", "../core/InputNode.js", "./TextureNode.js"], function (require, exports, InputNode_js_1, TextureNode_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ScreenNode(uv) {
        TextureNode_js_1.TextureNode.call(this, undefined, uv);
    }
    exports.ScreenNode = ScreenNode;
    ScreenNode.prototype = Object.create(TextureNode_js_1.TextureNode.prototype);
    ScreenNode.prototype.constructor = ScreenNode;
    ScreenNode.prototype.nodeType = "Screen";
    ScreenNode.prototype.getUnique = function () {
        return true;
    };
    ScreenNode.prototype.getTexture = function (builder, output) {
        return InputNode_js_1.InputNode.prototype.generate.call(this, builder, output, this.getUuid(), 't', 'renderTexture');
    };
});
//# sourceMappingURL=ScreenNode.js.map