define(["require", "exports", "./TempNode.js"], function (require, exports, TempNode_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var declarationRegexp = /^struct\s*([a-z_0-9]+)\s*{\s*((.|\n)*?)}/img, propertiesRegexp = /\s*(\w*?)\s*(\w*?)(\=|\;)/img;
    function StructNode(src) {
        TempNode_js_1.TempNode.call(this);
        this.parse(src);
    }
    exports.StructNode = StructNode;
    StructNode.prototype = Object.create(TempNode_js_1.TempNode.prototype);
    StructNode.prototype.constructor = StructNode;
    StructNode.prototype.nodeType = "Struct";
    StructNode.prototype.getType = function (builder) {
        return builder.getTypeByFormat(this.name);
    };
    StructNode.prototype.getInputByName = function (name) {
        var i = this.inputs.length;
        while (i--) {
            if (this.inputs[i].name === name) {
                return this.inputs[i];
            }
        }
    };
    StructNode.prototype.generate = function (builder, output) {
        if (output === 'source') {
            return this.src + ';';
        }
        else {
            return builder.format('( ' + this.src + ' )', this.getType(builder), output);
        }
    };
    StructNode.prototype.parse = function (src) {
        this.src = src || '';
        this.inputs = [];
        var declaration = declarationRegexp.exec(this.src);
        if (declaration) {
            var properties = declaration[2], match;
            while (match = propertiesRegexp.exec(properties)) {
                this.inputs.push({
                    type: match[1],
                    name: match[2]
                });
            }
            this.name = declaration[1];
        }
        else {
            this.name = '';
        }
        this.type = this.name;
    };
    StructNode.prototype.toJSON = function (meta) {
        var data = this.getJSONNode(meta);
        if (!data) {
            data = this.createJSONNode(meta);
            data.src = this.src;
        }
        return data;
    };
});
//# sourceMappingURL=StructNode.js.map