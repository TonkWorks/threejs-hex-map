define(["require", "exports", "./ShaderMaterial.js"], function (require, exports, ShaderMaterial_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function RawShaderMaterial(parameters) {
        ShaderMaterial_js_1.ShaderMaterial.call(this, parameters);
        this.type = 'RawShaderMaterial';
    }
    exports.RawShaderMaterial = RawShaderMaterial;
    RawShaderMaterial.prototype = Object.create(ShaderMaterial_js_1.ShaderMaterial.prototype);
    RawShaderMaterial.prototype.constructor = RawShaderMaterial;
    RawShaderMaterial.prototype.isRawShaderMaterial = true;
});
//# sourceMappingURL=RawShaderMaterial.js.map