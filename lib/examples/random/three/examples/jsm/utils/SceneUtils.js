define(["require", "exports", "../../../build/three.module.js"], function (require, exports, three_module_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SceneUtils = {
        createMeshesFromInstancedMesh: function (instancedMesh) {
            var group = new three_module_js_1.Group();
            var count = instancedMesh.count;
            var geometry = instancedMesh.geometry;
            var material = instancedMesh.material;
            for (var i = 0; i < count; i++) {
                var mesh = new three_module_js_1.Mesh(geometry, material);
                instancedMesh.getMatrixAt(i, mesh.matrix);
                mesh.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
                group.add(mesh);
            }
            group.copy(instancedMesh);
            group.updateMatrixWorld(); // ensure correct world matrices of meshes
            return group;
        },
        createMultiMaterialObject: function (geometry, materials) {
            var group = new three_module_js_1.Group();
            for (var i = 0, l = materials.length; i < l; i++) {
                group.add(new three_module_js_1.Mesh(geometry, materials[i]));
            }
            return group;
        },
        detach: function (child, parent, scene) {
            console.warn('THREE.SceneUtils: detach() has been deprecated. Use scene.attach( child ) instead.');
            scene.attach(child);
        },
        attach: function (child, scene, parent) {
            console.warn('THREE.SceneUtils: attach() has been deprecated. Use parent.attach( child ) instead.');
            parent.attach(child);
        }
    };
    exports.SceneUtils = SceneUtils;
});
//# sourceMappingURL=SceneUtils.js.map