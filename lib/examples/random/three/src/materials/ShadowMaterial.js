define(["require", "exports", "./Material.js", "../math/Color.js"], function (require, exports, Material_js_1, Color_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * parameters = {
     *  color: <THREE.Color>
     * }
     */
    function ShadowMaterial(parameters) {
        Material_js_1.Material.call(this);
        this.type = 'ShadowMaterial';
        this.color = new Color_js_1.Color(0x000000);
        this.transparent = true;
        this.setValues(parameters);
    }
    exports.ShadowMaterial = ShadowMaterial;
    ShadowMaterial.prototype = Object.create(Material_js_1.Material.prototype);
    ShadowMaterial.prototype.constructor = ShadowMaterial;
    ShadowMaterial.prototype.isShadowMaterial = true;
    ShadowMaterial.prototype.copy = function (source) {
        Material_js_1.Material.prototype.copy.call(this, source);
        this.color.copy(source.color);
        return this;
    };
});
//# sourceMappingURL=ShadowMaterial.js.map