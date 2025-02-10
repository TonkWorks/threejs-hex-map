define(["require", "exports", "./Material.js", "../constants.js", "../math/Color.js"], function (require, exports, Material_js_1, constants_js_1, Color_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * parameters = {
     *  color: <hex>,
     *  opacity: <float>,
     *
     *  map: new THREE.Texture( <Image> ),
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
     *  specularMap: new THREE.Texture( <Image> ),
     *
     *  alphaMap: new THREE.Texture( <Image> ),
     *
     *  envMap: new THREE.CubeTexture( [posx, negx, posy, negy, posz, negz] ),
     *  combine: THREE.Multiply,
     *  reflectivity: <float>,
     *  refractionRatio: <float>,
     *
     *  wireframe: <boolean>,
     *  wireframeLinewidth: <float>,
     *
     *  skinning: <bool>,
     *  morphTargets: <bool>,
     *  morphNormals: <bool>
     * }
     */
    function MeshLambertMaterial(parameters) {
        Material_js_1.Material.call(this);
        this.type = 'MeshLambertMaterial';
        this.color = new Color_js_1.Color(0xffffff); // diffuse
        this.map = null;
        this.lightMap = null;
        this.lightMapIntensity = 1.0;
        this.aoMap = null;
        this.aoMapIntensity = 1.0;
        this.emissive = new Color_js_1.Color(0x000000);
        this.emissiveIntensity = 1.0;
        this.emissiveMap = null;
        this.specularMap = null;
        this.alphaMap = null;
        this.envMap = null;
        this.combine = constants_js_1.MultiplyOperation;
        this.reflectivity = 1;
        this.refractionRatio = 0.98;
        this.wireframe = false;
        this.wireframeLinewidth = 1;
        this.wireframeLinecap = 'round';
        this.wireframeLinejoin = 'round';
        this.skinning = false;
        this.morphTargets = false;
        this.morphNormals = false;
        this.setValues(parameters);
    }
    exports.MeshLambertMaterial = MeshLambertMaterial;
    MeshLambertMaterial.prototype = Object.create(Material_js_1.Material.prototype);
    MeshLambertMaterial.prototype.constructor = MeshLambertMaterial;
    MeshLambertMaterial.prototype.isMeshLambertMaterial = true;
    MeshLambertMaterial.prototype.copy = function (source) {
        Material_js_1.Material.prototype.copy.call(this, source);
        this.color.copy(source.color);
        this.map = source.map;
        this.lightMap = source.lightMap;
        this.lightMapIntensity = source.lightMapIntensity;
        this.aoMap = source.aoMap;
        this.aoMapIntensity = source.aoMapIntensity;
        this.emissive.copy(source.emissive);
        this.emissiveMap = source.emissiveMap;
        this.emissiveIntensity = source.emissiveIntensity;
        this.specularMap = source.specularMap;
        this.alphaMap = source.alphaMap;
        this.envMap = source.envMap;
        this.combine = source.combine;
        this.reflectivity = source.reflectivity;
        this.refractionRatio = source.refractionRatio;
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
//# sourceMappingURL=MeshLambertMaterial.js.map