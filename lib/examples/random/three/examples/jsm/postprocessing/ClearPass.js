define(["require", "exports", "../postprocessing/Pass.js"], function (require, exports, Pass_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ClearPass = function (clearColor, clearAlpha) {
        Pass_js_1.Pass.call(this);
        this.needsSwap = false;
        this.clearColor = (clearColor !== undefined) ? clearColor : 0x000000;
        this.clearAlpha = (clearAlpha !== undefined) ? clearAlpha : 0;
    };
    exports.ClearPass = ClearPass;
    ClearPass.prototype = Object.assign(Object.create(Pass_js_1.Pass.prototype), {
        constructor: ClearPass,
        render: function (renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */) {
            var oldClearColor, oldClearAlpha;
            if (this.clearColor) {
                oldClearColor = renderer.getClearColor().getHex();
                oldClearAlpha = renderer.getClearAlpha();
                renderer.setClearColor(this.clearColor, this.clearAlpha);
            }
            renderer.setRenderTarget(this.renderToScreen ? null : readBuffer);
            renderer.clear();
            if (this.clearColor) {
                renderer.setClearColor(oldClearColor, oldClearAlpha);
            }
        }
    });
});
//# sourceMappingURL=ClearPass.js.map