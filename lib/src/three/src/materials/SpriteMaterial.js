define(["require", "exports", "./Material.js", "../math/Color.js"], function (require, exports, Material_js_1, Color_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * parameters = {
     *  color: <hex>,
     *  map: new THREE.Texture( <Image> ),
     *  alphaMap: new THREE.Texture( <Image> ),
     *  rotation: <float>,
     *  sizeAttenuation: <bool>
     * }
     */
    function SpriteMaterial(parameters) {
        Material_js_1.Material.call(this);
        this.type = 'SpriteMaterial';
        this.color = new Color_js_1.Color(0xffffff);
        this.map = null;
        this.alphaMap = null;
        this.rotation = 0;
        this.sizeAttenuation = true;
        this.transparent = true;
        this.setValues(parameters);
    }
    exports.SpriteMaterial = SpriteMaterial;
    SpriteMaterial.prototype = Object.create(Material_js_1.Material.prototype);
    SpriteMaterial.prototype.constructor = SpriteMaterial;
    SpriteMaterial.prototype.isSpriteMaterial = true;
    SpriteMaterial.prototype.copy = function (source) {
        Material_js_1.Material.prototype.copy.call(this, source);
        this.color.copy(source.color);
        this.map = source.map;
        this.alphaMap = source.alphaMap;
        this.rotation = source.rotation;
        this.sizeAttenuation = source.sizeAttenuation;
        return this;
    };
});
//# sourceMappingURL=SpriteMaterial.js.map