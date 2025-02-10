define(["require", "exports", "../core/Geometry.js", "./PlaneBufferGeometry.js"], function (require, exports, Geometry_js_1, PlaneBufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PlaneGeometry extends Geometry_js_1.Geometry {
        constructor(width, height, widthSegments, heightSegments) {
            super();
            this.type = 'PlaneGeometry';
            this.parameters = {
                width: width,
                height: height,
                widthSegments: widthSegments,
                heightSegments: heightSegments
            };
            this.fromBufferGeometry(new PlaneBufferGeometry_js_1.PlaneBufferGeometry(width, height, widthSegments, heightSegments));
            this.mergeVertices();
        }
    }
    exports.PlaneGeometry = PlaneGeometry;
});
//# sourceMappingURL=PlaneGeometry.js.map