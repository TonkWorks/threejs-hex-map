define(["require", "exports", "../math/Vector3.js", "../math/Quaternion.js", "../core/Clock.js", "../core/Object3D.js", "./AudioContext.js"], function (require, exports, Vector3_js_1, Quaternion_js_1, Clock_js_1, Object3D_js_1, AudioContext_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const _position = /*@__PURE__*/ new Vector3_js_1.Vector3();
    const _quaternion = /*@__PURE__*/ new Quaternion_js_1.Quaternion();
    const _scale = /*@__PURE__*/ new Vector3_js_1.Vector3();
    const _orientation = /*@__PURE__*/ new Vector3_js_1.Vector3();
    class AudioListener extends Object3D_js_1.Object3D {
        constructor() {
            super();
            this.type = 'AudioListener';
            this.context = AudioContext_js_1.AudioContext.getContext();
            this.gain = this.context.createGain();
            this.gain.connect(this.context.destination);
            this.filter = null;
            this.timeDelta = 0;
            // private
            this._clock = new Clock_js_1.Clock();
        }
        getInput() {
            return this.gain;
        }
        removeFilter() {
            if (this.filter !== null) {
                this.gain.disconnect(this.filter);
                this.filter.disconnect(this.context.destination);
                this.gain.connect(this.context.destination);
                this.filter = null;
            }
            return this;
        }
        getFilter() {
            return this.filter;
        }
        setFilter(value) {
            if (this.filter !== null) {
                this.gain.disconnect(this.filter);
                this.filter.disconnect(this.context.destination);
            }
            else {
                this.gain.disconnect(this.context.destination);
            }
            this.filter = value;
            this.gain.connect(this.filter);
            this.filter.connect(this.context.destination);
            return this;
        }
        getMasterVolume() {
            return this.gain.gain.value;
        }
        setMasterVolume(value) {
            this.gain.gain.setTargetAtTime(value, this.context.currentTime, 0.01);
            return this;
        }
        updateMatrixWorld(force) {
            super.updateMatrixWorld(force);
            const listener = this.context.listener;
            const up = this.up;
            this.timeDelta = this._clock.getDelta();
            this.matrixWorld.decompose(_position, _quaternion, _scale);
            _orientation.set(0, 0, -1).applyQuaternion(_quaternion);
            if (listener.positionX) {
                // code path for Chrome (see #14393)
                const endTime = this.context.currentTime + this.timeDelta;
                listener.positionX.linearRampToValueAtTime(_position.x, endTime);
                listener.positionY.linearRampToValueAtTime(_position.y, endTime);
                listener.positionZ.linearRampToValueAtTime(_position.z, endTime);
                listener.forwardX.linearRampToValueAtTime(_orientation.x, endTime);
                listener.forwardY.linearRampToValueAtTime(_orientation.y, endTime);
                listener.forwardZ.linearRampToValueAtTime(_orientation.z, endTime);
                listener.upX.linearRampToValueAtTime(up.x, endTime);
                listener.upY.linearRampToValueAtTime(up.y, endTime);
                listener.upZ.linearRampToValueAtTime(up.z, endTime);
            }
            else {
                listener.setPosition(_position.x, _position.y, _position.z);
                listener.setOrientation(_orientation.x, _orientation.y, _orientation.z, up.x, up.y, up.z);
            }
        }
    }
    exports.AudioListener = AudioListener;
});
//# sourceMappingURL=AudioListener.js.map