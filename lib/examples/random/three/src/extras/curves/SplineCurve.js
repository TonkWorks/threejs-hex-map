define(["require", "exports", "../core/Curve.js", "../core/Interpolations.js", "../../math/Vector2.js"], function (require, exports, Curve_js_1, Interpolations_js_1, Vector2_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function SplineCurve(points) {
        Curve_js_1.Curve.call(this);
        this.type = 'SplineCurve';
        this.points = points || [];
    }
    exports.SplineCurve = SplineCurve;
    SplineCurve.prototype = Object.create(Curve_js_1.Curve.prototype);
    SplineCurve.prototype.constructor = SplineCurve;
    SplineCurve.prototype.isSplineCurve = true;
    SplineCurve.prototype.getPoint = function (t, optionalTarget) {
        const point = optionalTarget || new Vector2_js_1.Vector2();
        const points = this.points;
        const p = (points.length - 1) * t;
        const intPoint = Math.floor(p);
        const weight = p - intPoint;
        const p0 = points[intPoint === 0 ? intPoint : intPoint - 1];
        const p1 = points[intPoint];
        const p2 = points[intPoint > points.length - 2 ? points.length - 1 : intPoint + 1];
        const p3 = points[intPoint > points.length - 3 ? points.length - 1 : intPoint + 2];
        point.set(Interpolations_js_1.CatmullRom(weight, p0.x, p1.x, p2.x, p3.x), Interpolations_js_1.CatmullRom(weight, p0.y, p1.y, p2.y, p3.y));
        return point;
    };
    SplineCurve.prototype.copy = function (source) {
        Curve_js_1.Curve.prototype.copy.call(this, source);
        this.points = [];
        for (let i = 0, l = source.points.length; i < l; i++) {
            const point = source.points[i];
            this.points.push(point.clone());
        }
        return this;
    };
    SplineCurve.prototype.toJSON = function () {
        const data = Curve_js_1.Curve.prototype.toJSON.call(this);
        data.points = [];
        for (let i = 0, l = this.points.length; i < l; i++) {
            const point = this.points[i];
            data.points.push(point.toArray());
        }
        return data;
    };
    SplineCurve.prototype.fromJSON = function (json) {
        Curve_js_1.Curve.prototype.fromJSON.call(this, json);
        this.points = [];
        for (let i = 0, l = json.points.length; i < l; i++) {
            const point = json.points[i];
            this.points.push(new Vector2_js_1.Vector2().fromArray(point));
        }
        return this;
    };
});
//# sourceMappingURL=SplineCurve.js.map