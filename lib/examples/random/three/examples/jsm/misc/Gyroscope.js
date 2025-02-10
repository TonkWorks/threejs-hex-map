define(["require", "exports", "../../../build/three.module.js"], function (require, exports, three_module_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Gyroscope = function () {
        three_module_js_1.Object3D.call(this);
    };
    exports.Gyroscope = Gyroscope;
    Gyroscope.prototype = Object.create(three_module_js_1.Object3D.prototype);
    Gyroscope.prototype.constructor = Gyroscope;
    Gyroscope.prototype.updateMatrixWorld = (function () {
        var translationObject = new three_module_js_1.Vector3();
        var quaternionObject = new three_module_js_1.Quaternion();
        var scaleObject = new three_module_js_1.Vector3();
        var translationWorld = new three_module_js_1.Vector3();
        var quaternionWorld = new three_module_js_1.Quaternion();
        var scaleWorld = new three_module_js_1.Vector3();
        return function updateMatrixWorld(force) {
            this.matrixAutoUpdate && this.updateMatrix();
            // update matrixWorld
            if (this.matrixWorldNeedsUpdate || force) {
                if (this.parent !== null) {
                    this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
                    this.matrixWorld.decompose(translationWorld, quaternionWorld, scaleWorld);
                    this.matrix.decompose(translationObject, quaternionObject, scaleObject);
                    this.matrixWorld.compose(translationWorld, quaternionObject, scaleWorld);
                }
                else {
                    this.matrixWorld.copy(this.matrix);
                }
                this.matrixWorldNeedsUpdate = false;
                force = true;
            }
            // update children
            for (var i = 0, l = this.children.length; i < l; i++) {
                this.children[i].updateMatrixWorld(force);
            }
        };
    }());
});
//# sourceMappingURL=Gyroscope.js.map