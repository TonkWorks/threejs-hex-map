define(["require", "exports", "../math/Vector2.js", "./MeshStandardMaterial.js", "../math/Color.js", "../math/MathUtils.js"], function (require, exports, Vector2_js_1, MeshStandardMaterial_js_1, Color_js_1, MathUtils_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * parameters = {
     *  clearcoat: <float>,
     *  clearcoatMap: new THREE.Texture( <Image> ),
     *  clearcoatRoughness: <float>,
     *  clearcoatRoughnessMap: new THREE.Texture( <Image> ),
     *  clearcoatNormalScale: <Vector2>,
     *  clearcoatNormalMap: new THREE.Texture( <Image> ),
     *
     *  reflectivity: <float>,
     *  ior: <float>,
     *
     *  sheen: <Color>,
     *
     *  transmission: <float>,
     *  transmissionMap: new THREE.Texture( <Image> )
     * }
     */
    function MeshPhysicalMaterial(parameters) {
        MeshStandardMaterial_js_1.MeshStandardMaterial.call(this);
        this.defines = {
            'STANDARD': '',
            'PHYSICAL': ''
        };
        this.type = 'MeshPhysicalMaterial';
        this.clearcoat = 0.0;
        this.clearcoatMap = null;
        this.clearcoatRoughness = 0.0;
        this.clearcoatRoughnessMap = null;
        this.clearcoatNormalScale = new Vector2_js_1.Vector2(1, 1);
        this.clearcoatNormalMap = null;
        this.reflectivity = 0.5; // maps to F0 = 0.04
        Object.defineProperty(this, 'ior', {
            get: function () {
                return (1 + 0.4 * this.reflectivity) / (1 - 0.4 * this.reflectivity);
            },
            set: function (ior) {
                this.reflectivity = MathUtils_js_1.MathUtils.clamp(2.5 * (ior - 1) / (ior + 1), 0, 1);
            }
        });
        this.sheen = null; // null will disable sheen bsdf
        this.transmission = 0.0;
        this.transmissionMap = null;
        this.setValues(parameters);
    }
    exports.MeshPhysicalMaterial = MeshPhysicalMaterial;
    MeshPhysicalMaterial.prototype = Object.create(MeshStandardMaterial_js_1.MeshStandardMaterial.prototype);
    MeshPhysicalMaterial.prototype.constructor = MeshPhysicalMaterial;
    MeshPhysicalMaterial.prototype.isMeshPhysicalMaterial = true;
    MeshPhysicalMaterial.prototype.copy = function (source) {
        MeshStandardMaterial_js_1.MeshStandardMaterial.prototype.copy.call(this, source);
        this.defines = {
            'STANDARD': '',
            'PHYSICAL': ''
        };
        this.clearcoat = source.clearcoat;
        this.clearcoatMap = source.clearcoatMap;
        this.clearcoatRoughness = source.clearcoatRoughness;
        this.clearcoatRoughnessMap = source.clearcoatRoughnessMap;
        this.clearcoatNormalMap = source.clearcoatNormalMap;
        this.clearcoatNormalScale.copy(source.clearcoatNormalScale);
        this.reflectivity = source.reflectivity;
        if (source.sheen) {
            this.sheen = (this.sheen || new Color_js_1.Color()).copy(source.sheen);
        }
        else {
            this.sheen = null;
        }
        this.transmission = source.transmission;
        this.transmissionMap = source.transmissionMap;
        return this;
    };
});
//# sourceMappingURL=MeshPhysicalMaterial.js.map