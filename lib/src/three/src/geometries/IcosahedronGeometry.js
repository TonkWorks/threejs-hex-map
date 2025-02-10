define(["require", "exports", "../core/Geometry.js", "./IcosahedronBufferGeometry.js"], function (require, exports, Geometry_js_1, IcosahedronBufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class IcosahedronGeometry extends Geometry_js_1.Geometry {
        constructor(radius, detail) {
            super();
            this.type = 'IcosahedronGeometry';
            this.parameters = {
                radius: radius,
                detail: detail
            };
            this.fromBufferGeometry(new IcosahedronBufferGeometry_js_1.IcosahedronBufferGeometry(radius, detail));
            this.mergeVertices();
        }
    }
    exports.IcosahedronGeometry = IcosahedronGeometry;
});
//# sourceMappingURL=IcosahedronGeometry.js.map