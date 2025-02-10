define(["require", "exports", "../../../build/three.module.js"], function (require, exports, three_module_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var _v1 = new three_module_js_1.Vector3();
    var _v2 = new three_module_js_1.Vector3();
    var _normalMatrix = new three_module_js_1.Matrix3();
    function FaceNormalsHelper(object, size, hex, linewidth) {
        // FaceNormalsHelper only supports THREE.Geometry
        this.object = object;
        this.size = (size !== undefined) ? size : 1;
        var color = (hex !== undefined) ? hex : 0xffff00;
        var width = (linewidth !== undefined) ? linewidth : 1;
        //
        var nNormals = 0;
        var objGeometry = this.object.geometry;
        if (objGeometry && objGeometry.isGeometry) {
            nNormals = objGeometry.faces.length;
        }
        else {
            console.warn('THREE.FaceNormalsHelper: only THREE.Geometry is supported. Use THREE.VertexNormalsHelper, instead.');
        }
        //
        var geometry = new three_module_js_1.BufferGeometry();
        var positions = new three_module_js_1.Float32BufferAttribute(nNormals * 2 * 3, 3);
        geometry.setAttribute('position', positions);
        three_module_js_1.LineSegments.call(this, geometry, new three_module_js_1.LineBasicMaterial({ color: color, linewidth: width }));
        this.type = 'FaceNormalsHelper';
        //
        this.matrixAutoUpdate = false;
        this.update();
    }
    exports.FaceNormalsHelper = FaceNormalsHelper;
    FaceNormalsHelper.prototype = Object.create(three_module_js_1.LineSegments.prototype);
    FaceNormalsHelper.prototype.constructor = FaceNormalsHelper;
    FaceNormalsHelper.prototype.update = function () {
        this.object.updateMatrixWorld(true);
        _normalMatrix.getNormalMatrix(this.object.matrixWorld);
        var matrixWorld = this.object.matrixWorld;
        var position = this.geometry.attributes.position;
        //
        var objGeometry = this.object.geometry;
        var vertices = objGeometry.vertices;
        var faces = objGeometry.faces;
        var idx = 0;
        for (var i = 0, l = faces.length; i < l; i++) {
            var face = faces[i];
            var normal = face.normal;
            _v1.copy(vertices[face.a])
                .add(vertices[face.b])
                .add(vertices[face.c])
                .divideScalar(3)
                .applyMatrix4(matrixWorld);
            _v2.copy(normal).applyMatrix3(_normalMatrix).normalize().multiplyScalar(this.size).add(_v1);
            position.setXYZ(idx, _v1.x, _v1.y, _v1.z);
            idx = idx + 1;
            position.setXYZ(idx, _v2.x, _v2.y, _v2.z);
            idx = idx + 1;
        }
        position.needsUpdate = true;
    };
});
//# sourceMappingURL=FaceNormalsHelper.js.map