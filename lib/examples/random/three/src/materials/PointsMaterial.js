define(["require", "exports", "./Material.js", "../math/Color.js"], function (require, exports, Material_js_1, Color_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * parameters = {
     *  color: <hex>,
     *  opacity: <float>,
     *  map: new THREE.Texture( <Image> ),
     *  alphaMap: new THREE.Texture( <Image> ),
     *
     *  size: <float>,
     *  sizeAttenuation: <bool>
     *
     *  morphTargets: <bool>
     * }
     */
    function PointsMaterial(parameters) {
        Material_js_1.Material.call(this);
        this.type = 'PointsMaterial';
        this.color = new Color_js_1.Color(0xffffff);
        this.map = null;
        this.alphaMap = null;
        this.size = 1;
        this.sizeAttenuation = true;
        this.morphTargets = false;
        this.setValues(parameters);
    }
    exports.PointsMaterial = PointsMaterial;
    PointsMaterial.prototype = Object.create(Material_js_1.Material.prototype);
    PointsMaterial.prototype.constructor = PointsMaterial;
    PointsMaterial.prototype.isPointsMaterial = true;
    PointsMaterial.prototype.copy = function (source) {
        Material_js_1.Material.prototype.copy.call(this, source);
        this.color.copy(source.color);
        this.map = source.map;
        this.alphaMap = source.alphaMap;
        this.size = source.size;
        this.sizeAttenuation = source.sizeAttenuation;
        this.morphTargets = source.morphTargets;
        return this;
    };
});
//# sourceMappingURL=PointsMaterial.js.map