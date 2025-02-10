define(["require", "exports", "./TempNode.js"], function (require, exports, TempNode_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function InputNode(type, params) {
        params = params || {};
        params.shared = params.shared !== undefined ? params.shared : false;
        TempNode_js_1.TempNode.call(this, type, params);
        this.readonly = false;
    }
    exports.InputNode = InputNode;
    InputNode.prototype = Object.create(TempNode_js_1.TempNode.prototype);
    InputNode.prototype.constructor = InputNode;
    InputNode.prototype.setReadonly = function (value) {
        this.readonly = value;
        this.hashProperties = this.readonly ? ["value"] : undefined;
        return this;
    };
    InputNode.prototype.getReadonly = function ( /* builder */) {
        return this.readonly;
    };
    InputNode.prototype.copy = function (source) {
        TempNode_js_1.TempNode.prototype.copy.call(this, source);
        if (source.readonly !== undefined)
            this.readonly = source.readonly;
        return this;
    };
    InputNode.prototype.createJSONNode = function (meta) {
        var data = TempNode_js_1.TempNode.prototype.createJSONNode.call(this, meta);
        if (this.readonly === true)
            data.readonly = this.readonly;
        return data;
    };
    InputNode.prototype.generate = function (builder, output, uuid, type, ns, needsUpdate) {
        uuid = builder.getUuid(uuid || this.getUuid());
        type = type || this.getType(builder);
        var data = builder.getNodeData(uuid), readonly = this.getReadonly(builder) && this.generateReadonly !== undefined;
        if (readonly) {
            return this.generateReadonly(builder, output, uuid, type, ns, needsUpdate);
        }
        else {
            if (builder.isShader('vertex')) {
                if (!data.vertex) {
                    data.vertex = builder.createVertexUniform(type, this, ns, needsUpdate, this.getLabel());
                }
                return builder.format(data.vertex.name, type, output);
            }
            else {
                if (!data.fragment) {
                    data.fragment = builder.createFragmentUniform(type, this, ns, needsUpdate, this.getLabel());
                }
                return builder.format(data.fragment.name, type, output);
            }
        }
    };
});
//# sourceMappingURL=InputNode.js.map