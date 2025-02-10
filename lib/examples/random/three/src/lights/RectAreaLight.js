define(["require", "exports", "./Light.js"], function (require, exports, Light_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function RectAreaLight(color, intensity, width, height) {
        Light_js_1.Light.call(this, color, intensity);
        this.type = 'RectAreaLight';
        this.width = (width !== undefined) ? width : 10;
        this.height = (height !== undefined) ? height : 10;
    }
    exports.RectAreaLight = RectAreaLight;
    RectAreaLight.prototype = Object.assign(Object.create(Light_js_1.Light.prototype), {
        constructor: RectAreaLight,
        isRectAreaLight: true,
        copy: function (source) {
            Light_js_1.Light.prototype.copy.call(this, source);
            this.width = source.width;
            this.height = source.height;
            return this;
        },
        toJSON: function (meta) {
            const data = Light_js_1.Light.prototype.toJSON.call(this, meta);
            data.object.width = this.width;
            data.object.height = this.height;
            return data;
        }
    });
});
//# sourceMappingURL=RectAreaLight.js.map