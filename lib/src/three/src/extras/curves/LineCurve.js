define(["require", "exports", "../../math/Vector2.js", "../core/Curve.js"], function (require, exports, Vector2_js_1, Curve_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function LineCurve(v1, v2) {
        Curve_js_1.Curve.call(this);
        this.type = 'LineCurve';
        this.v1 = v1 || new Vector2_js_1.Vector2();
        this.v2 = v2 || new Vector2_js_1.Vector2();
    }
    exports.LineCurve = LineCurve;
    LineCurve.prototype = Object.create(Curve_js_1.Curve.prototype);
    LineCurve.prototype.constructor = LineCurve;
    LineCurve.prototype.isLineCurve = true;
    LineCurve.prototype.getPoint = function (t, optionalTarget) {
        const point = optionalTarget || new Vector2_js_1.Vector2();
        if (t === 1) {
            point.copy(this.v2);
        }
        else {
            point.copy(this.v2).sub(this.v1);
            point.multiplyScalar(t).add(this.v1);
        }
        return point;
    };
    // Line curve is linear, so we can overwrite default getPointAt
    LineCurve.prototype.getPointAt = function (u, optionalTarget) {
        return this.getPoint(u, optionalTarget);
    };
    LineCurve.prototype.getTangent = function (t, optionalTarget) {
        const tangent = optionalTarget || new Vector2_js_1.Vector2();
        tangent.copy(this.v2).sub(this.v1).normalize();
        return tangent;
    };
    LineCurve.prototype.copy = function (source) {
        Curve_js_1.Curve.prototype.copy.call(this, source);
        this.v1.copy(source.v1);
        this.v2.copy(source.v2);
        return this;
    };
    LineCurve.prototype.toJSON = function () {
        const data = Curve_js_1.Curve.prototype.toJSON.call(this);
        data.v1 = this.v1.toArray();
        data.v2 = this.v2.toArray();
        return data;
    };
    LineCurve.prototype.fromJSON = function (json) {
        Curve_js_1.Curve.prototype.fromJSON.call(this, json);
        this.v1.fromArray(json.v1);
        this.v2.fromArray(json.v2);
        return this;
    };
});
//# sourceMappingURL=LineCurve.js.map