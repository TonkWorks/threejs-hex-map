define(["require", "exports", "../core/TempNode.js", "../core/NodeLib.js"], function (require, exports, TempNode_js_1, NodeLib_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function NormalNode(scope) {
        TempNode_js_1.TempNode.call(this, 'v3');
        this.scope = scope || NormalNode.VIEW;
    }
    exports.NormalNode = NormalNode;
    NormalNode.LOCAL = 'local';
    NormalNode.WORLD = 'world';
    NormalNode.VIEW = 'view';
    NormalNode.prototype = Object.create(TempNode_js_1.TempNode.prototype);
    NormalNode.prototype.constructor = NormalNode;
    NormalNode.prototype.nodeType = "Normal";
    NormalNode.prototype.getShared = function () {
        // if shared is false, TempNode will not create temp variable (for optimization)
        return this.scope === NormalNode.WORLD;
    };
    NormalNode.prototype.build = function (builder, output, uuid, ns) {
        var contextNormal = builder.context[this.scope + 'Normal'];
        if (contextNormal) {
            return contextNormal.build(builder, output, uuid, ns);
        }
        return TempNode_js_1.TempNode.prototype.build.call(this, builder, output, uuid);
    };
    NormalNode.prototype.generate = function (builder, output) {
        var result;
        switch (this.scope) {
            case NormalNode.VIEW:
                if (builder.isShader('vertex'))
                    result = 'transformedNormal';
                else
                    result = 'geometryNormal';
                break;
            case NormalNode.LOCAL:
                if (builder.isShader('vertex')) {
                    result = 'objectNormal';
                }
                else {
                    builder.requires.normal = true;
                    result = 'vObjectNormal';
                }
                break;
            case NormalNode.WORLD:
                if (builder.isShader('vertex')) {
                    result = 'inverseTransformDirection( transformedNormal, viewMatrix ).xyz';
                }
                else {
                    builder.requires.worldNormal = true;
                    result = 'vWNormal';
                }
                break;
        }
        return builder.format(result, this.getType(builder), output);
    };
    NormalNode.prototype.copy = function (source) {
        TempNode_js_1.TempNode.prototype.copy.call(this, source);
        this.scope = source.scope;
        return this;
    };
    NormalNode.prototype.toJSON = function (meta) {
        var data = this.getJSONNode(meta);
        if (!data) {
            data = this.createJSONNode(meta);
            data.scope = this.scope;
        }
        return data;
    };
    NodeLib_js_1.NodeLib.addKeyword('viewNormal', function () {
        return new NormalNode(NormalNode.VIEW);
    });
    NodeLib_js_1.NodeLib.addKeyword('localNormal', function () {
        return new NormalNode(NormalNode.NORMAL);
    });
    NodeLib_js_1.NodeLib.addKeyword('worldNormal', function () {
        return new NormalNode(NormalNode.WORLD);
    });
});
//# sourceMappingURL=NormalNode.js.map