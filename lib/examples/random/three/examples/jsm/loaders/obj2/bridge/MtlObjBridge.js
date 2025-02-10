/**
 * Development repository: https://github.com/kaisalmen/WWOBJLoader
 */
define(["require", "exports", "../../../../jsm/loaders/MTLLoader.js"], function (require, exports, MTLLoader_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const MtlObjBridge = {
        /**
         *
         * @param processResult
         * @param assetLoader
         */
        link: function (processResult, assetLoader) {
            if (typeof assetLoader.addMaterials === 'function') {
                assetLoader.addMaterials(this.addMaterialsFromMtlLoader(processResult), true);
            }
        },
        /**
         * Returns the array instance of {@link MTLLoader.MaterialCreator}.
         *
         * @param Instance of {@link MTLLoader.MaterialCreator}
         */
        addMaterialsFromMtlLoader: function (materialCreator) {
            let newMaterials = {};
            if (materialCreator instanceof MTLLoader_js_1.MTLLoader.MaterialCreator) {
                materialCreator.preload();
                newMaterials = materialCreator.materials;
            }
            return newMaterials;
        }
    };
    exports.MtlObjBridge = MtlObjBridge;
});
//# sourceMappingURL=MtlObjBridge.js.map