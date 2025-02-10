define(["require", "exports", "../core/Object3D.js"], function (require, exports, Object3D_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function Group() {
        Object3D_js_1.Object3D.call(this);
        this.type = 'Group';
    }
    exports.Group = Group;
    Group.prototype = Object.assign(Object.create(Object3D_js_1.Object3D.prototype), {
        constructor: Group,
        isGroup: true
    });
});
//# sourceMappingURL=Group.js.map