define(["require", "exports", "./Material.js", "../constants.js"], function (require, exports, Material_js_1, constants_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * parameters = {
     *
     *  opacity: <float>,
     *
     *  map: new THREE.Texture( <Image> ),
     *
     *  alphaMap: new THREE.Texture( <Image> ),
     *
     *  displacementMap: new THREE.Texture( <Image> ),
     *  displacementScale: <float>,
     *  displacementBias: <float>,
     *
     *  wireframe: <boolean>,
     *  wireframeLinewidth: <float>
     * }
     */
    function MeshDepthMaterial(parameters) {
        Material_js_1.Material.call(this);
        this.type = 'MeshDepthMaterial';
        this.depthPacking = constants_js_1.BasicDepthPacking;
        this.skinning = false;
        this.morphTargets = false;
        this.map = null;
        this.alphaMap = null;
        this.displacementMap = null;
        this.displacementScale = 1;
        this.displacementBias = 0;
        this.wireframe = false;
        this.wireframeLinewidth = 1;
        this.fog = false;
        this.setValues(parameters);
    }
    exports.MeshDepthMaterial = MeshDepthMaterial;
    MeshDepthMaterial.prototype = Object.create(Material_js_1.Material.prototype);
    MeshDepthMaterial.prototype.constructor = MeshDepthMaterial;
    MeshDepthMaterial.prototype.isMeshDepthMaterial = true;
    MeshDepthMaterial.prototype.copy = function (source) {
        Material_js_1.Material.prototype.copy.call(this, source);
        this.depthPacking = source.depthPacking;
        this.skinning = source.skinning;
        this.morphTargets = source.morphTargets;
        this.map = source.map;
        this.alphaMap = source.alphaMap;
        this.displacementMap = source.displacementMap;
        this.displacementScale = source.displacementScale;
        this.displacementBias = source.displacementBias;
        this.wireframe = source.wireframe;
        this.wireframeLinewidth = source.wireframeLinewidth;
        return this;
    };
});
//# sourceMappingURL=MeshDepthMaterial.js.map