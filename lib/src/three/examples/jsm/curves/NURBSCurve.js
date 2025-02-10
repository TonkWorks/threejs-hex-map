define(["require", "exports", "../../../build/three.module.js", "../curves/NURBSUtils.js"], function (require, exports, three_module_js_1, NURBSUtils_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * NURBS curve object
     *
     * Derives from Curve, overriding getPoint and getTangent.
     *
     * Implementation is based on (x, y [, z=0 [, w=1]]) control points with w=weight.
     *
     **/
    var NURBSCurve = function (degree, knots /* array of reals */, controlPoints /* array of Vector(2|3|4) */, startKnot /* index in knots */, endKnot /* index in knots */) {
        three_module_js_1.Curve.call(this);
        this.degree = degree;
        this.knots = knots;
        this.controlPoints = [];
        // Used by periodic NURBS to remove hidden spans
        this.startKnot = startKnot || 0;
        this.endKnot = endKnot || (this.knots.length - 1);
        for (var i = 0; i < controlPoints.length; ++i) {
            // ensure Vector4 for control points
            var point = controlPoints[i];
            this.controlPoints[i] = new three_module_js_1.Vector4(point.x, point.y, point.z, point.w);
        }
    };
    exports.NURBSCurve = NURBSCurve;
    NURBSCurve.prototype = Object.create(three_module_js_1.Curve.prototype);
    NURBSCurve.prototype.constructor = NURBSCurve;
    NURBSCurve.prototype.getPoint = function (t, optionalTarget) {
        var point = optionalTarget || new three_module_js_1.Vector3();
        var u = this.knots[this.startKnot] + t * (this.knots[this.endKnot] - this.knots[this.startKnot]); // linear mapping t->u
        // following results in (wx, wy, wz, w) homogeneous point
        var hpoint = NURBSUtils_js_1.NURBSUtils.calcBSplinePoint(this.degree, this.knots, this.controlPoints, u);
        if (hpoint.w != 1.0) {
            // project to 3D space: (wx, wy, wz, w) -> (x, y, z, 1)
            hpoint.divideScalar(hpoint.w);
        }
        return point.set(hpoint.x, hpoint.y, hpoint.z);
    };
    NURBSCurve.prototype.getTangent = function (t, optionalTarget) {
        var tangent = optionalTarget || new three_module_js_1.Vector3();
        var u = this.knots[0] + t * (this.knots[this.knots.length - 1] - this.knots[0]);
        var ders = NURBSUtils_js_1.NURBSUtils.calcNURBSDerivatives(this.degree, this.knots, this.controlPoints, u, 1);
        tangent.copy(ders[1]).normalize();
        return tangent;
    };
});
//# sourceMappingURL=NURBSCurve.js.map