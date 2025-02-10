define(["require", "exports", "../core/InputNode.js"], function (require, exports, InputNode_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function PropertyNode(object, property, type) {
        InputNode_js_1.InputNode.call(this, type);
        this.object = object;
        this.property = property;
    }
    exports.PropertyNode = PropertyNode;
    PropertyNode.prototype = Object.create(InputNode_js_1.InputNode.prototype);
    PropertyNode.prototype.constructor = PropertyNode;
    PropertyNode.prototype.nodeType = "Property";
    Object.defineProperties(PropertyNode.prototype, {
        value: {
            get: function () {
                return this.object[this.property];
            },
            set: function (val) {
                this.object[this.property] = val;
            }
        }
    });
    PropertyNode.prototype.toJSON = function (meta) {
        var data = this.getJSONNode(meta);
        if (!data) {
            data = this.createJSONNode(meta);
            data.value = this.value;
            data.property = this.property;
        }
        return data;
    };
});
//# sourceMappingURL=PropertyNode.js.map