define(["require", "exports", "../../core/Object3D.js"], function (require, exports, Object3D_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ImmediateRenderObject(material) {
        Object3D_js_1.Object3D.call(this);
        this.material = material;
        this.render = function ( /* renderCallback */) { };
        this.hasPositions = false;
        this.hasNormals = false;
        this.hasColors = false;
        this.hasUvs = false;
        this.positionArray = null;
        this.normalArray = null;
        this.colorArray = null;
        this.uvArray = null;
        this.count = 0;
    }
    exports.ImmediateRenderObject = ImmediateRenderObject;
    ImmediateRenderObject.prototype = Object.create(Object3D_js_1.Object3D.prototype);
    ImmediateRenderObject.prototype.constructor = ImmediateRenderObject;
    ImmediateRenderObject.prototype.isImmediateRenderObject = true;
});
//# sourceMappingURL=ImmediateRenderObject.js.map