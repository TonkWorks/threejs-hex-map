define(["require", "exports", "../core/Curve.js", "../core/Interpolations.js", "../../math/Vector3.js"], function (require, exports, Curve_js_1, Interpolations_js_1, Vector3_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function CubicBezierCurve3(v0, v1, v2, v3) {
        Curve_js_1.Curve.call(this);
        this.type = 'CubicBezierCurve3';
        this.v0 = v0 || new Vector3_js_1.Vector3();
        this.v1 = v1 || new Vector3_js_1.Vector3();
        this.v2 = v2 || new Vector3_js_1.Vector3();
        this.v3 = v3 || new Vector3_js_1.Vector3();
    }
    exports.CubicBezierCurve3 = CubicBezierCurve3;
    CubicBezierCurve3.prototype = Object.create(Curve_js_1.Curve.prototype);
    CubicBezierCurve3.prototype.constructor = CubicBezierCurve3;
    CubicBezierCurve3.prototype.isCubicBezierCurve3 = true;
    CubicBezierCurve3.prototype.getPoint = function (t, optionalTarget) {
        const point = optionalTarget || new Vector3_js_1.Vector3();
        const v0 = this.v0, v1 = this.v1, v2 = this.v2, v3 = this.v3;
        point.set(Interpolations_js_1.CubicBezier(t, v0.x, v1.x, v2.x, v3.x), Interpolations_js_1.CubicBezier(t, v0.y, v1.y, v2.y, v3.y), Interpolations_js_1.CubicBezier(t, v0.z, v1.z, v2.z, v3.z));
        return point;
    };
    CubicBezierCurve3.prototype.copy = function (source) {
        Curve_js_1.Curve.prototype.copy.call(this, source);
        this.v0.copy(source.v0);
        this.v1.copy(source.v1);
        this.v2.copy(source.v2);
        this.v3.copy(source.v3);
        return this;
    };
    CubicBezierCurve3.prototype.toJSON = function () {
        const data = Curve_js_1.Curve.prototype.toJSON.call(this);
        data.v0 = this.v0.toArray();
        data.v1 = this.v1.toArray();
        data.v2 = this.v2.toArray();
        data.v3 = this.v3.toArray();
        return data;
    };
    CubicBezierCurve3.prototype.fromJSON = function (json) {
        Curve_js_1.Curve.prototype.fromJSON.call(this, json);
        this.v0.fromArray(json.v0);
        this.v1.fromArray(json.v1);
        this.v2.fromArray(json.v2);
        this.v3.fromArray(json.v3);
        return this;
    };
});
//# sourceMappingURL=CubicBezierCurve3.js.map