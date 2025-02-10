define(["require", "exports", "../../math/Vector3.js", "../core/Curve.js"], function (require, exports, Vector3_js_1, Curve_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function LineCurve3(v1, v2) {
        Curve_js_1.Curve.call(this);
        this.type = 'LineCurve3';
        this.v1 = v1 || new Vector3_js_1.Vector3();
        this.v2 = v2 || new Vector3_js_1.Vector3();
    }
    exports.LineCurve3 = LineCurve3;
    LineCurve3.prototype = Object.create(Curve_js_1.Curve.prototype);
    LineCurve3.prototype.constructor = LineCurve3;
    LineCurve3.prototype.isLineCurve3 = true;
    LineCurve3.prototype.getPoint = function (t, optionalTarget) {
        const point = optionalTarget || new Vector3_js_1.Vector3();
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
    LineCurve3.prototype.getPointAt = function (u, optionalTarget) {
        return this.getPoint(u, optionalTarget);
    };
    LineCurve3.prototype.copy = function (source) {
        Curve_js_1.Curve.prototype.copy.call(this, source);
        this.v1.copy(source.v1);
        this.v2.copy(source.v2);
        return this;
    };
    LineCurve3.prototype.toJSON = function () {
        const data = Curve_js_1.Curve.prototype.toJSON.call(this);
        data.v1 = this.v1.toArray();
        data.v2 = this.v2.toArray();
        return data;
    };
    LineCurve3.prototype.fromJSON = function (json) {
        Curve_js_1.Curve.prototype.fromJSON.call(this, json);
        this.v1.fromArray(json.v1);
        this.v2.fromArray(json.v2);
        return this;
    };
});
//# sourceMappingURL=LineCurve3.js.map