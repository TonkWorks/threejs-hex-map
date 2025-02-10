define(["require", "exports", "../constants.js", "./Material.js", "../math/Vector2.js", "../math/Color.js"], function (require, exports, constants_js_1, Material_js_1, Vector2_js_1, Color_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * parameters = {
     *  color: <hex>,
     *  opacity: <float>,
     *
     *  matcap: new THREE.Texture( <Image> ),
     *
     *  map: new THREE.Texture( <Image> ),
     *
     *  bumpMap: new THREE.Texture( <Image> ),
     *  bumpScale: <float>,
     *
     *  normalMap: new THREE.Texture( <Image> ),
     *  normalMapType: THREE.TangentSpaceNormalMap,
     *  normalScale: <Vector2>,
     *
     *  displacementMap: new THREE.Texture( <Image> ),
     *  displacementScale: <float>,
     *  displacementBias: <float>,
     *
     *  alphaMap: new THREE.Texture( <Image> ),
     *
     *  skinning: <bool>,
     *  morphTargets: <bool>,
     *  morphNormals: <bool>
     * }
     */
    function MeshMatcapMaterial(parameters) {
        Material_js_1.Material.call(this);
        this.defines = { 'MATCAP': '' };
        this.type = 'MeshMatcapMaterial';
        this.color = new Color_js_1.Color(0xffffff); // diffuse
        this.matcap = null;
        this.map = null;
        this.bumpMap = null;
        this.bumpScale = 1;
        this.normalMap = null;
        this.normalMapType = constants_js_1.TangentSpaceNormalMap;
        this.normalScale = new Vector2_js_1.Vector2(1, 1);
        this.displacementMap = null;
        this.displacementScale = 1;
        this.displacementBias = 0;
        this.alphaMap = null;
        this.skinning = false;
        this.morphTargets = false;
        this.morphNormals = false;
        this.setValues(parameters);
    }
    exports.MeshMatcapMaterial = MeshMatcapMaterial;
    MeshMatcapMaterial.prototype = Object.create(Material_js_1.Material.prototype);
    MeshMatcapMaterial.prototype.constructor = MeshMatcapMaterial;
    MeshMatcapMaterial.prototype.isMeshMatcapMaterial = true;
    MeshMatcapMaterial.prototype.copy = function (source) {
        Material_js_1.Material.prototype.copy.call(this, source);
        this.defines = { 'MATCAP': '' };
        this.color.copy(source.color);
        this.matcap = source.matcap;
        this.map = source.map;
        this.bumpMap = source.bumpMap;
        this.bumpScale = source.bumpScale;
        this.normalMap = source.normalMap;
        this.normalMapType = source.normalMapType;
        this.normalScale.copy(source.normalScale);
        this.displacementMap = source.displacementMap;
        this.displacementScale = source.displacementScale;
        this.displacementBias = source.displacementBias;
        this.alphaMap = source.alphaMap;
        this.skinning = source.skinning;
        this.morphTargets = source.morphTargets;
        this.morphNormals = source.morphNormals;
        return this;
    };
});
//# sourceMappingURL=MeshMatcapMaterial.js.map