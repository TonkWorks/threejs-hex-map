define(["require", "exports", "./LineBasicMaterial.js"], function (require, exports, LineBasicMaterial_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * parameters = {
     *  color: <hex>,
     *  opacity: <float>,
     *
     *  linewidth: <float>,
     *
     *  scale: <float>,
     *  dashSize: <float>,
     *  gapSize: <float>
     * }
     */
    function LineDashedMaterial(parameters) {
        LineBasicMaterial_js_1.LineBasicMaterial.call(this);
        this.type = 'LineDashedMaterial';
        this.scale = 1;
        this.dashSize = 3;
        this.gapSize = 1;
        this.setValues(parameters);
    }
    exports.LineDashedMaterial = LineDashedMaterial;
    LineDashedMaterial.prototype = Object.create(LineBasicMaterial_js_1.LineBasicMaterial.prototype);
    LineDashedMaterial.prototype.constructor = LineDashedMaterial;
    LineDashedMaterial.prototype.isLineDashedMaterial = true;
    LineDashedMaterial.prototype.copy = function (source) {
        LineBasicMaterial_js_1.LineBasicMaterial.prototype.copy.call(this, source);
        this.scale = source.scale;
        this.dashSize = source.dashSize;
        this.gapSize = source.gapSize;
        return this;
    };
});
//# sourceMappingURL=LineDashedMaterial.js.map