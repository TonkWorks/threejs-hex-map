define(["require", "exports", "../math/Vector3.js", "../math/Quaternion.js", "./Audio.js"], function (require, exports, Vector3_js_1, Quaternion_js_1, Audio_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const _position = /*@__PURE__*/ new Vector3_js_1.Vector3();
    const _quaternion = /*@__PURE__*/ new Quaternion_js_1.Quaternion();
    const _scale = /*@__PURE__*/ new Vector3_js_1.Vector3();
    const _orientation = /*@__PURE__*/ new Vector3_js_1.Vector3();
    class PositionalAudio extends Audio_js_1.Audio {
        constructor(listener) {
            super(listener);
            this.panner = this.context.createPanner();
            this.panner.panningModel = 'HRTF';
            this.panner.connect(this.gain);
        }
        getOutput() {
            return this.panner;
        }
        getRefDistance() {
            return this.panner.refDistance;
        }
        setRefDistance(value) {
            this.panner.refDistance = value;
            return this;
        }
        getRolloffFactor() {
            return this.panner.rolloffFactor;
        }
        setRolloffFactor(value) {
            this.panner.rolloffFactor = value;
            return this;
        }
        getDistanceModel() {
            return this.panner.distanceModel;
        }
        setDistanceModel(value) {
            this.panner.distanceModel = value;
            return this;
        }
        getMaxDistance() {
            return this.panner.maxDistance;
        }
        setMaxDistance(value) {
            this.panner.maxDistance = value;
            return this;
        }
        setDirectionalCone(coneInnerAngle, coneOuterAngle, coneOuterGain) {
            this.panner.coneInnerAngle = coneInnerAngle;
            this.panner.coneOuterAngle = coneOuterAngle;
            this.panner.coneOuterGain = coneOuterGain;
            return this;
        }
        updateMatrixWorld(force) {
            super.updateMatrixWorld(force);
            if (this.hasPlaybackControl === true && this.isPlaying === false)
                return;
            this.matrixWorld.decompose(_position, _quaternion, _scale);
            _orientation.set(0, 0, 1).applyQuaternion(_quaternion);
            const panner = this.panner;
            if (panner.positionX) {
                // code path for Chrome and Firefox (see #14393)
                const endTime = this.context.currentTime + this.listener.timeDelta;
                panner.positionX.linearRampToValueAtTime(_position.x, endTime);
                panner.positionY.linearRampToValueAtTime(_position.y, endTime);
                panner.positionZ.linearRampToValueAtTime(_position.z, endTime);
                panner.orientationX.linearRampToValueAtTime(_orientation.x, endTime);
                panner.orientationY.linearRampToValueAtTime(_orientation.y, endTime);
                panner.orientationZ.linearRampToValueAtTime(_orientation.z, endTime);
            }
            else {
                panner.setPosition(_position.x, _position.y, _position.z);
                panner.setOrientation(_orientation.x, _orientation.y, _orientation.z);
            }
        }
    }
    exports.PositionalAudio = PositionalAudio;
});
//# sourceMappingURL=PositionalAudio.js.map