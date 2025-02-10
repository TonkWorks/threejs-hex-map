define(["require", "exports", "../core/Object3D.js", "../math/Color.js"], function (require, exports, Object3D_js_1, Color_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function Light(color, intensity) {
        Object3D_js_1.Object3D.call(this);
        this.type = 'Light';
        this.color = new Color_js_1.Color(color);
        this.intensity = intensity !== undefined ? intensity : 1;
    }
    exports.Light = Light;
    Light.prototype = Object.assign(Object.create(Object3D_js_1.Object3D.prototype), {
        constructor: Light,
        isLight: true,
        copy: function (source) {
            Object3D_js_1.Object3D.prototype.copy.call(this, source);
            this.color.copy(source.color);
            this.intensity = source.intensity;
            return this;
        },
        toJSON: function (meta) {
            const data = Object3D_js_1.Object3D.prototype.toJSON.call(this, meta);
            data.object.color = this.color.getHex();
            data.object.intensity = this.intensity;
            if (this.groundColor !== undefined)
                data.object.groundColor = this.groundColor.getHex();
            if (this.distance !== undefined)
                data.object.distance = this.distance;
            if (this.angle !== undefined)
                data.object.angle = this.angle;
            if (this.decay !== undefined)
                data.object.decay = this.decay;
            if (this.penumbra !== undefined)
                data.object.penumbra = this.penumbra;
            if (this.shadow !== undefined)
                data.object.shadow = this.shadow.toJSON();
            return data;
        }
    });
});
//# sourceMappingURL=Light.js.map