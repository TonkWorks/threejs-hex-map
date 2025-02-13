define(["require", "exports", "../../../build/three.module.js", "../lines/LineSegmentsGeometry.js"], function (require, exports, three_module_js_1, LineSegmentsGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WireframeGeometry2 = void 0;
    var WireframeGeometry2 = function (geometry) {
        LineSegmentsGeometry_js_1.LineSegmentsGeometry.call(this);
        this.type = 'WireframeGeometry2';
        this.fromWireframeGeometry(new three_module_js_1.WireframeGeometry(geometry));
        // set colors, maybe
    };
    exports.WireframeGeometry2 = WireframeGeometry2;
    WireframeGeometry2.prototype = Object.assign(Object.create(LineSegmentsGeometry_js_1.LineSegmentsGeometry.prototype), {
        constructor: WireframeGeometry2,
        isWireframeGeometry2: true
    });
});
//# sourceMappingURL=WireframeGeometry2.js.map