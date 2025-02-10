define(["require", "exports", "./LightShadow.js", "../cameras/PerspectiveCamera.js", "../math/Vector2.js", "../math/Vector3.js", "../math/Vector4.js"], function (require, exports, LightShadow_js_1, PerspectiveCamera_js_1, Vector2_js_1, Vector3_js_1, Vector4_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function PointLightShadow() {
        LightShadow_js_1.LightShadow.call(this, new PerspectiveCamera_js_1.PerspectiveCamera(90, 1, 0.5, 500));
        this._frameExtents = new Vector2_js_1.Vector2(4, 2);
        this._viewportCount = 6;
        this._viewports = [
            // These viewports map a cube-map onto a 2D texture with the
            // following orientation:
            //
            //  xzXZ
            //   y Y
            //
            // X - Positive x direction
            // x - Negative x direction
            // Y - Positive y direction
            // y - Negative y direction
            // Z - Positive z direction
            // z - Negative z direction
            // positive X
            new Vector4_js_1.Vector4(2, 1, 1, 1),
            // negative X
            new Vector4_js_1.Vector4(0, 1, 1, 1),
            // positive Z
            new Vector4_js_1.Vector4(3, 1, 1, 1),
            // negative Z
            new Vector4_js_1.Vector4(1, 1, 1, 1),
            // positive Y
            new Vector4_js_1.Vector4(3, 0, 1, 1),
            // negative Y
            new Vector4_js_1.Vector4(1, 0, 1, 1)
        ];
        this._cubeDirections = [
            new Vector3_js_1.Vector3(1, 0, 0), new Vector3_js_1.Vector3(-1, 0, 0), new Vector3_js_1.Vector3(0, 0, 1),
            new Vector3_js_1.Vector3(0, 0, -1), new Vector3_js_1.Vector3(0, 1, 0), new Vector3_js_1.Vector3(0, -1, 0)
        ];
        this._cubeUps = [
            new Vector3_js_1.Vector3(0, 1, 0), new Vector3_js_1.Vector3(0, 1, 0), new Vector3_js_1.Vector3(0, 1, 0),
            new Vector3_js_1.Vector3(0, 1, 0), new Vector3_js_1.Vector3(0, 0, 1), new Vector3_js_1.Vector3(0, 0, -1)
        ];
    }
    exports.PointLightShadow = PointLightShadow;
    PointLightShadow.prototype = Object.assign(Object.create(LightShadow_js_1.LightShadow.prototype), {
        constructor: PointLightShadow,
        isPointLightShadow: true,
        updateMatrices: function (light, viewportIndex) {
            if (viewportIndex === undefined)
                viewportIndex = 0;
            const camera = this.camera, shadowMatrix = this.matrix, lightPositionWorld = this._lightPositionWorld, lookTarget = this._lookTarget, projScreenMatrix = this._projScreenMatrix;
            lightPositionWorld.setFromMatrixPosition(light.matrixWorld);
            camera.position.copy(lightPositionWorld);
            lookTarget.copy(camera.position);
            lookTarget.add(this._cubeDirections[viewportIndex]);
            camera.up.copy(this._cubeUps[viewportIndex]);
            camera.lookAt(lookTarget);
            camera.updateMatrixWorld();
            shadowMatrix.makeTranslation(-lightPositionWorld.x, -lightPositionWorld.y, -lightPositionWorld.z);
            projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
            this._frustum.setFromProjectionMatrix(projScreenMatrix);
        }
    });
});
//# sourceMappingURL=PointLightShadow.js.map