define(["require", "exports", "./FunctionNode.js"], function (require, exports, FunctionNode_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ExpressionNode(src, type, keywords, extensions, includes) {
        FunctionNode_js_1.FunctionNode.call(this, src, includes, extensions, keywords, type);
    }
    exports.ExpressionNode = ExpressionNode;
    ExpressionNode.prototype = Object.create(FunctionNode_js_1.FunctionNode.prototype);
    ExpressionNode.prototype.constructor = ExpressionNode;
    ExpressionNode.prototype.nodeType = "Expression";
});
//# sourceMappingURL=ExpressionNode.js.map