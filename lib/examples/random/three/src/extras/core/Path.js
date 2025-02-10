define(["require", "exports", "../../math/Vector2.js", "./CurvePath.js", "../curves/EllipseCurve.js", "../curves/SplineCurve.js", "../curves/CubicBezierCurve.js", "../curves/QuadraticBezierCurve.js", "../curves/LineCurve.js"], function (require, exports, Vector2_js_1, CurvePath_js_1, EllipseCurve_js_1, SplineCurve_js_1, CubicBezierCurve_js_1, QuadraticBezierCurve_js_1, LineCurve_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function Path(points) {
        CurvePath_js_1.CurvePath.call(this);
        this.type = 'Path';
        this.currentPoint = new Vector2_js_1.Vector2();
        if (points) {
            this.setFromPoints(points);
        }
    }
    exports.Path = Path;
    Path.prototype = Object.assign(Object.create(CurvePath_js_1.CurvePath.prototype), {
        constructor: Path,
        setFromPoints: function (points) {
            this.moveTo(points[0].x, points[0].y);
            for (let i = 1, l = points.length; i < l; i++) {
                this.lineTo(points[i].x, points[i].y);
            }
            return this;
        },
        moveTo: function (x, y) {
            this.currentPoint.set(x, y); // TODO consider referencing vectors instead of copying?
            return this;
        },
        lineTo: function (x, y) {
            const curve = new LineCurve_js_1.LineCurve(this.currentPoint.clone(), new Vector2_js_1.Vector2(x, y));
            this.curves.push(curve);
            this.currentPoint.set(x, y);
            return this;
        },
        quadraticCurveTo: function (aCPx, aCPy, aX, aY) {
            const curve = new QuadraticBezierCurve_js_1.QuadraticBezierCurve(this.currentPoint.clone(), new Vector2_js_1.Vector2(aCPx, aCPy), new Vector2_js_1.Vector2(aX, aY));
            this.curves.push(curve);
            this.currentPoint.set(aX, aY);
            return this;
        },
        bezierCurveTo: function (aCP1x, aCP1y, aCP2x, aCP2y, aX, aY) {
            const curve = new CubicBezierCurve_js_1.CubicBezierCurve(this.currentPoint.clone(), new Vector2_js_1.Vector2(aCP1x, aCP1y), new Vector2_js_1.Vector2(aCP2x, aCP2y), new Vector2_js_1.Vector2(aX, aY));
            this.curves.push(curve);
            this.currentPoint.set(aX, aY);
            return this;
        },
        splineThru: function (pts /*Array of Vector*/) {
            const npts = [this.currentPoint.clone()].concat(pts);
            const curve = new SplineCurve_js_1.SplineCurve(npts);
            this.curves.push(curve);
            this.currentPoint.copy(pts[pts.length - 1]);
            return this;
        },
        arc: function (aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise) {
            const x0 = this.currentPoint.x;
            const y0 = this.currentPoint.y;
            this.absarc(aX + x0, aY + y0, aRadius, aStartAngle, aEndAngle, aClockwise);
            return this;
        },
        absarc: function (aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise) {
            this.absellipse(aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise);
            return this;
        },
        ellipse: function (aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation) {
            const x0 = this.currentPoint.x;
            const y0 = this.currentPoint.y;
            this.absellipse(aX + x0, aY + y0, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation);
            return this;
        },
        absellipse: function (aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation) {
            const curve = new EllipseCurve_js_1.EllipseCurve(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation);
            if (this.curves.length > 0) {
                // if a previous curve is present, attempt to join
                const firstPoint = curve.getPoint(0);
                if (!firstPoint.equals(this.currentPoint)) {
                    this.lineTo(firstPoint.x, firstPoint.y);
                }
            }
            this.curves.push(curve);
            const lastPoint = curve.getPoint(1);
            this.currentPoint.copy(lastPoint);
            return this;
        },
        copy: function (source) {
            CurvePath_js_1.CurvePath.prototype.copy.call(this, source);
            this.currentPoint.copy(source.currentPoint);
            return this;
        },
        toJSON: function () {
            const data = CurvePath_js_1.CurvePath.prototype.toJSON.call(this);
            data.currentPoint = this.currentPoint.toArray();
            return data;
        },
        fromJSON: function (json) {
            CurvePath_js_1.CurvePath.prototype.fromJSON.call(this, json);
            this.currentPoint.fromArray(json.currentPoint);
            return this;
        }
    });
});
//# sourceMappingURL=Path.js.map