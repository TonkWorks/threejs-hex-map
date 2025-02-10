define(["require", "exports", "./EllipseCurve.js"], function (require, exports, EllipseCurve_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ArcCurve(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise) {
        EllipseCurve_js_1.EllipseCurve.call(this, aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise);
        this.type = 'ArcCurve';
    }
    exports.ArcCurve = ArcCurve;
    ArcCurve.prototype = Object.create(EllipseCurve_js_1.EllipseCurve.prototype);
    ArcCurve.prototype.constructor = ArcCurve;
    ArcCurve.prototype.isArcCurve = true;
});
//# sourceMappingURL=ArcCurve.js.map