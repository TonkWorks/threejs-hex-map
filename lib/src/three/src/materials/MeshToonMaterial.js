define(["require", "exports", "../constants.js", "./Material.js", "../math/Vector2.js", "../math/Color.js"], function (require, exports, constants_js_1, Material_js_1, Vector2_js_1, Color_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * parameters = {
     *  color: <hex>,
     *
     *  map: new THREE.Texture( <Image> ),
     *  gradientMap: new THREE.Texture( <Image> ),
     *
     *  lightMap: new THREE.Texture( <Image> ),
     *  lightMapIntensity: <float>
     *
     *  aoMap: new THREE.Texture( <Image> ),
     *  aoMapIntensity: <float>
     *
     *  emissive: <hex>,
     *  emissiveIntensity: <float>
     *  emissiveMap: new THREE.Texture( <Image> ),
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
     *  wireframe: <boolean>,
     *  wireframeLinewidth: <float>,
     *
     *  skinning: <bool>,
     *  morphTargets: <bool>,
     *  morphNormals: <bool>
     * }
     */
    function MeshToonMaterial(parameters) {
        Material_js_1.Material.call(this);
        this.defines = { 'TOON': '' };
        this.type = 'MeshToonMaterial';
        this.color = new Color_js_1.Color(0xffffff);
        this.map = null;
        this.gradientMap = null;
        this.lightMap = null;
        this.lightMapIntensity = 1.0;
        this.aoMap = null;
        this.aoMapIntensity = 1.0;
        this.emissive = new Color_js_1.Color(0x000000);
        this.emissiveIntensity = 1.0;
        this.emissiveMap = null;
        this.bumpMap = null;
        this.bumpScale = 1;
        this.normalMap = null;
        this.normalMapType = constants_js_1.TangentSpaceNormalMap;
        this.normalScale = new Vector2_js_1.Vector2(1, 1);
        this.displacementMap = null;
        this.displacementScale = 1;
        this.displacementBias = 0;
        this.alphaMap = null;
        this.wireframe = false;
        this.wireframeLinewidth = 1;
        this.wireframeLinecap = 'round';
        this.wireframeLinejoin = 'round';
        this.skinning = false;
        this.morphTargets = false;
        this.morphNormals = false;
        this.setValues(parameters);
    }
    exports.MeshToonMaterial = MeshToonMaterial;
    MeshToonMaterial.prototype = Object.create(Material_js_1.Material.prototype);
    MeshToonMaterial.prototype.constructor = MeshToonMaterial;
    MeshToonMaterial.prototype.isMeshToonMaterial = true;
    MeshToonMaterial.prototype.copy = function (source) {
        Material_js_1.Material.prototype.copy.call(this, source);
        this.color.copy(source.color);
        this.map = source.map;
        this.gradientMap = source.gradientMap;
        this.lightMap = source.lightMap;
        this.lightMapIntensity = source.lightMapIntensity;
        this.aoMap = source.aoMap;
        this.aoMapIntensity = source.aoMapIntensity;
        this.emissive.copy(source.emissive);
        this.emissiveMap = source.emissiveMap;
        this.emissiveIntensity = source.emissiveIntensity;
        this.bumpMap = source.bumpMap;
        this.bumpScale = source.bumpScale;
        this.normalMap = source.normalMap;
        this.normalMapType = source.normalMapType;
        this.normalScale.copy(source.normalScale);
        this.displacementMap = source.displacementMap;
        this.displacementScale = source.displacementScale;
        this.displacementBias = source.displacementBias;
        this.alphaMap = source.alphaMap;
        this.wireframe = source.wireframe;
        this.wireframeLinewidth = source.wireframeLinewidth;
        this.wireframeLinecap = source.wireframeLinecap;
        this.wireframeLinejoin = source.wireframeLinejoin;
        this.skinning = source.skinning;
        this.morphTargets = source.morphTargets;
        this.morphNormals = source.morphNormals;
        return this;
    };
});
//# sourceMappingURL=MeshToonMaterial.js.map