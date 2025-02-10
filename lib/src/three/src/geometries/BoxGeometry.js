define(["require", "exports", "../core/Geometry.js", "./BoxBufferGeometry.js"], function (require, exports, Geometry_js_1, BoxBufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BoxGeometry extends Geometry_js_1.Geometry {
        constructor(width, height, depth, widthSegments, heightSegments, depthSegments) {
            super();
            this.type = 'BoxGeometry';
            this.parameters = {
                width: width,
                height: height,
                depth: depth,
                widthSegments: widthSegments,
                heightSegments: heightSegments,
                depthSegments: depthSegments
            };
            this.fromBufferGeometry(new BoxBufferGeometry_js_1.BoxBufferGeometry(width, height, depth, widthSegments, heightSegments, depthSegments));
            this.mergeVertices();
        }
    }
    exports.BoxGeometry = BoxGeometry;
});
//# sourceMappingURL=BoxGeometry.js.map