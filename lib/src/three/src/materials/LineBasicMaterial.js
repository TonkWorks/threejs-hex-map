define(["require", "exports", "./Material.js", "../math/Color.js"], function (require, exports, Material_js_1, Color_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * parameters = {
     *  color: <hex>,
     *  opacity: <float>,
     *
     *  linewidth: <float>,
     *  linecap: "round",
     *  linejoin: "round"
     * }
     */
    function LineBasicMaterial(parameters) {
        Material_js_1.Material.call(this);
        this.type = 'LineBasicMaterial';
        this.color = new Color_js_1.Color(0xffffff);
        this.linewidth = 1;
        this.linecap = 'round';
        this.linejoin = 'round';
        this.morphTargets = false;
        this.setValues(parameters);
    }
    exports.LineBasicMaterial = LineBasicMaterial;
    LineBasicMaterial.prototype = Object.create(Material_js_1.Material.prototype);
    LineBasicMaterial.prototype.constructor = LineBasicMaterial;
    LineBasicMaterial.prototype.isLineBasicMaterial = true;
    LineBasicMaterial.prototype.copy = function (source) {
        Material_js_1.Material.prototype.copy.call(this, source);
        this.color.copy(source.color);
        this.linewidth = source.linewidth;
        this.linecap = source.linecap;
        this.linejoin = source.linejoin;
        this.morphTargets = source.morphTargets;
        return this;
    };
});
//# sourceMappingURL=LineBasicMaterial.js.map