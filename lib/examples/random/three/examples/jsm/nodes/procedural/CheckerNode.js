define(["require", "exports", "../core/TempNode.js", "../core/FunctionNode.js", "../accessors/UVNode.js"], function (require, exports, TempNode_js_1, FunctionNode_js_1, UVNode_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function CheckerNode(uv) {
        TempNode_js_1.TempNode.call(this, 'f');
        this.uv = uv || new UVNode_js_1.UVNode();
    }
    exports.CheckerNode = CheckerNode;
    CheckerNode.prototype = Object.create(TempNode_js_1.TempNode.prototype);
    CheckerNode.prototype.constructor = CheckerNode;
    CheckerNode.prototype.nodeType = "Noise";
    CheckerNode.Nodes = (function () {
        // https://github.com/mattdesl/glsl-checker/blob/master/index.glsl
        var checker = new FunctionNode_js_1.FunctionNode([
            "float checker( vec2 uv ) {",
            "	float cx = floor( uv.x );",
            "	float cy = floor( uv.y ); ",
            "	float result = mod( cx + cy, 2.0 );",
            "	return sign( result );",
            "}"
        ].join("\n"));
        return {
            checker: checker
        };
    })();
    CheckerNode.prototype.generate = function (builder, output) {
        var snoise = builder.include(CheckerNode.Nodes.checker);
        return builder.format(snoise + '( ' + this.uv.build(builder, 'v2') + ' )', this.getType(builder), output);
    };
    CheckerNode.prototype.copy = function (source) {
        TempNode_js_1.TempNode.prototype.copy.call(this, source);
        this.uv = source.uv;
        return this;
    };
    CheckerNode.prototype.toJSON = function (meta) {
        var data = this.getJSONNode(meta);
        if (!data) {
            data = this.createJSONNode(meta);
            data.uv = this.uv.toJSON(meta).uuid;
        }
        return data;
    };
});
//# sourceMappingURL=CheckerNode.js.map