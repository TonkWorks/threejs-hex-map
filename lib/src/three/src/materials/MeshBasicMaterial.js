define(["require", "exports", "./Material.js", "../constants.js", "../math/Color.js"], function (require, exports, Material_js_1, constants_js_1, Color_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * parameters = {
     *  color: <hex>,
     *  opacity: <float>,
     *  map: new THREE.Texture( <Image> ),
     *
     *  lightMap: new THREE.Texture( <Image> ),
     *  lightMapIntensity: <float>
     *
     *  aoMap: new THREE.Texture( <Image> ),
     *  aoMapIntensity: <float>
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
     *  depthTest: <bool>,
     *  depthWrite: <bool>,
     *
     *  wireframe: <boolean>,
     *  wireframeLinewidth: <float>,
     *
     *  skinning: <bool>,
     *  morphTargets: <bool>
     * }
     */
    function MeshBasicMaterial(parameters) {
        Material_js_1.Material.call(this);
        this.type = 'MeshBasicMaterial';
        this.color = new Color_js_1.Color(0xffffff); // emissive
        this.map = null;
        this.lightMap = null;
        this.lightMapIntensity = 1.0;
        this.aoMap = null;
        this.aoMapIntensity = 1.0;
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
        this.setValues(parameters);
    }
    exports.MeshBasicMaterial = MeshBasicMaterial;
    MeshBasicMaterial.prototype = Object.create(Material_js_1.Material.prototype);
    MeshBasicMaterial.prototype.constructor = MeshBasicMaterial;
    MeshBasicMaterial.prototype.isMeshBasicMaterial = true;
    MeshBasicMaterial.prototype.copy = function (source) {
        Material_js_1.Material.prototype.copy.call(this, source);
        this.color.copy(source.color);
        this.map = source.map;
        this.lightMap = source.lightMap;
        this.lightMapIntensity = source.lightMapIntensity;
        this.aoMap = source.aoMap;
        this.aoMapIntensity = source.aoMapIntensity;
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
        return this;
    };
});
//# sourceMappingURL=MeshBasicMaterial.js.map