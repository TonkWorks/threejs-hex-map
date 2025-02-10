define(["require", "exports", "../core/TempNode.js"], function (require, exports, TempNode_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function SubSlotNode(slots) {
        TempNode_js_1.TempNode.call(this);
        this.slots = slots || {};
    }
    exports.SubSlotNode = SubSlotNode;
    SubSlotNode.prototype = Object.create(TempNode_js_1.TempNode.prototype);
    SubSlotNode.prototype.constructor = SubSlotNode;
    SubSlotNode.prototype.nodeType = "SubSlot";
    SubSlotNode.prototype.getType = function (builder, output) {
        return output;
    };
    SubSlotNode.prototype.generate = function (builder, output) {
        if (this.slots[builder.slot]) {
            return this.slots[builder.slot].build(builder, output);
        }
        return builder.format('0.0', 'f', output);
    };
    SubSlotNode.prototype.copy = function (source) {
        TempNode_js_1.TempNode.prototype.copy.call(this, source);
        for (var prop in source.slots) {
            this.slots[prop] = source.slots[prop];
        }
        return this;
    };
    SubSlotNode.prototype.toJSON = function (meta) {
        var data = this.getJSONNode(meta);
        if (!data) {
            data = this.createJSONNode(meta);
            data.slots = {};
            for (var prop in this.slots) {
                var slot = this.slots[prop];
                if (slot) {
                    data.slots[prop] = slot.toJSON(meta).uuid;
                }
            }
        }
        return data;
    };
});
//# sourceMappingURL=SubSlotNode.js.map