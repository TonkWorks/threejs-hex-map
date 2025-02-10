define(["require", "exports", "../core/TempNode.js", "../core/FunctionNode.js", "../accessors/UVNode.js"], function (require, exports, TempNode_js_1, FunctionNode_js_1, UVNode_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function NoiseNode(uv) {
        TempNode_js_1.TempNode.call(this, 'f');
        this.uv = uv || new UVNode_js_1.UVNode();
    }
    exports.NoiseNode = NoiseNode;
    NoiseNode.prototype = Object.create(TempNode_js_1.TempNode.prototype);
    NoiseNode.prototype.constructor = NoiseNode;
    NoiseNode.prototype.nodeType = "Noise";
    NoiseNode.Nodes = (function () {
        var snoise = new FunctionNode_js_1.FunctionNode([
            "float snoise(vec2 co) {",
            "	return fract( sin( dot( co.xy, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 );",
            "}"
        ].join("\n"));
        return {
            snoise: snoise
        };
    })();
    NoiseNode.prototype.generate = function (builder, output) {
        var snoise = builder.include(NoiseNode.Nodes.snoise);
        return builder.format(snoise + '( ' + this.uv.build(builder, 'v2') + ' )', this.getType(builder), output);
    };
    NoiseNode.prototype.copy = function (source) {
        TempNode_js_1.TempNode.prototype.copy.call(this, source);
        this.uv = source.uv;
        return this;
    };
    NoiseNode.prototype.toJSON = function (meta) {
        var data = this.getJSONNode(meta);
        if (!data) {
            data = this.createJSONNode(meta);
            data.uv = this.uv.toJSON(meta).uuid;
        }
        return data;
    };
});
//# sourceMappingURL=NoiseNode.js.map