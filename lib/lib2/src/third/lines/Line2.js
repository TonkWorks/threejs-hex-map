define(["require", "exports", "../lines/LineSegments2.js", "../lines/LineGeometry.js", "../lines/LineMaterial.js"], function (require, exports, LineSegments2_js_1, LineGeometry_js_1, LineMaterial_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Line2 = void 0;
    var Line2 = function (geometry, material) {
        if (geometry === undefined)
            geometry = new LineGeometry_js_1.LineGeometry();
        if (material === undefined)
            material = new LineMaterial_js_1.LineMaterial({ color: Math.random() * 0xffffff });
        LineSegments2_js_1.LineSegments2.call(this, geometry, material);
        this.type = 'Line2';
    };
    exports.Line2 = Line2;
    Line2.prototype = Object.assign(Object.create(LineSegments2_js_1.LineSegments2.prototype), {
        constructor: Line2,
        isLine2: true
    });
});
//# sourceMappingURL=Line2.js.map
//# sourceMappingURL=Line2.js.map