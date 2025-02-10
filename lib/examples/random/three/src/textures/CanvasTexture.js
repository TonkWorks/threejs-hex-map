define(["require", "exports", "./Texture.js"], function (require, exports, Texture_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function CanvasTexture(canvas, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy) {
        Texture_js_1.Texture.call(this, canvas, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy);
        this.needsUpdate = true;
    }
    exports.CanvasTexture = CanvasTexture;
    CanvasTexture.prototype = Object.create(Texture_js_1.Texture.prototype);
    CanvasTexture.prototype.constructor = CanvasTexture;
    CanvasTexture.prototype.isCanvasTexture = true;
});
//# sourceMappingURL=CanvasTexture.js.map