define(["require", "exports", "./Material.js", "../math/Vector3.js"], function (require, exports, Material_js_1, Vector3_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * parameters = {
     *
     *  referencePosition: <float>,
     *  nearDistance: <float>,
     *  farDistance: <float>,
     *
     *  skinning: <bool>,
     *  morphTargets: <bool>,
     *
     *  map: new THREE.Texture( <Image> ),
     *
     *  alphaMap: new THREE.Texture( <Image> ),
     *
     *  displacementMap: new THREE.Texture( <Image> ),
     *  displacementScale: <float>,
     *  displacementBias: <float>
     *
     * }
     */
    function MeshDistanceMaterial(parameters) {
        Material_js_1.Material.call(this);
        this.type = 'MeshDistanceMaterial';
        this.referencePosition = new Vector3_js_1.Vector3();
        this.nearDistance = 1;
        this.farDistance = 1000;
        this.skinning = false;
        this.morphTargets = false;
        this.map = null;
        this.alphaMap = null;
        this.displacementMap = null;
        this.displacementScale = 1;
        this.displacementBias = 0;
        this.fog = false;
        this.setValues(parameters);
    }
    exports.MeshDistanceMaterial = MeshDistanceMaterial;
    MeshDistanceMaterial.prototype = Object.create(Material_js_1.Material.prototype);
    MeshDistanceMaterial.prototype.constructor = MeshDistanceMaterial;
    MeshDistanceMaterial.prototype.isMeshDistanceMaterial = true;
    MeshDistanceMaterial.prototype.copy = function (source) {
        Material_js_1.Material.prototype.copy.call(this, source);
        this.referencePosition.copy(source.referencePosition);
        this.nearDistance = source.nearDistance;
        this.farDistance = source.farDistance;
        this.skinning = source.skinning;
        this.morphTargets = source.morphTargets;
        this.map = source.map;
        this.alphaMap = source.alphaMap;
        this.displacementMap = source.displacementMap;
        this.displacementScale = source.displacementScale;
        this.displacementBias = source.displacementBias;
        return this;
    };
});
//# sourceMappingURL=MeshDistanceMaterial.js.map