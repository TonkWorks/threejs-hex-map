define(["require", "exports", "../../../build/three.module.js"], function (require, exports, three_module_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MorphAnimMesh = function (geometry, material) {
        three_module_js_1.Mesh.call(this, geometry, material);
        this.type = 'MorphAnimMesh';
        this.mixer = new three_module_js_1.AnimationMixer(this);
        this.activeAction = null;
    };
    exports.MorphAnimMesh = MorphAnimMesh;
    MorphAnimMesh.prototype = Object.create(three_module_js_1.Mesh.prototype);
    MorphAnimMesh.prototype.constructor = MorphAnimMesh;
    MorphAnimMesh.prototype.setDirectionForward = function () {
        this.mixer.timeScale = 1.0;
    };
    MorphAnimMesh.prototype.setDirectionBackward = function () {
        this.mixer.timeScale = -1.0;
    };
    MorphAnimMesh.prototype.playAnimation = function (label, fps) {
        if (this.activeAction) {
            this.activeAction.stop();
            this.activeAction = null;
        }
        var clip = three_module_js_1.AnimationClip.findByName(this, label);
        if (clip) {
            var action = this.mixer.clipAction(clip);
            action.timeScale = (clip.tracks.length * fps) / clip.duration;
            this.activeAction = action.play();
        }
        else {
            throw new Error('THREE.MorphAnimMesh: animations[' + label + '] undefined in .playAnimation()');
        }
    };
    MorphAnimMesh.prototype.updateAnimation = function (delta) {
        this.mixer.update(delta);
    };
    MorphAnimMesh.prototype.copy = function (source) {
        three_module_js_1.Mesh.prototype.copy.call(this, source);
        this.mixer = new three_module_js_1.AnimationMixer(this);
        return this;
    };
});
//# sourceMappingURL=MorphAnimMesh.js.map