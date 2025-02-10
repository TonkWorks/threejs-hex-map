define(["require", "exports", "../core/Object3D.js"], function (require, exports, Object3D_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function Bone() {
        Object3D_js_1.Object3D.call(this);
        this.type = 'Bone';
    }
    exports.Bone = Bone;
    Bone.prototype = Object.assign(Object.create(Object3D_js_1.Object3D.prototype), {
        constructor: Bone,
        isBone: true
    });
});
//# sourceMappingURL=Bone.js.map