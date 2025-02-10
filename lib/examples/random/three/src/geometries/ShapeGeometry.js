define(["require", "exports", "../core/Geometry.js", "./ShapeBufferGeometry.js"], function (require, exports, Geometry_js_1, ShapeBufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ShapeGeometry extends Geometry_js_1.Geometry {
        constructor(shapes, curveSegments) {
            super();
            this.type = 'ShapeGeometry';
            if (typeof curveSegments === 'object') {
                console.warn('THREE.ShapeGeometry: Options parameter has been removed.');
                curveSegments = curveSegments.curveSegments;
            }
            this.parameters = {
                shapes: shapes,
                curveSegments: curveSegments
            };
            this.fromBufferGeometry(new ShapeBufferGeometry_js_1.ShapeBufferGeometry(shapes, curveSegments));
            this.mergeVertices();
        }
        toJSON() {
            const data = Geometry_js_1.Geometry.prototype.toJSON.call(this);
            const shapes = this.parameters.shapes;
            return toJSON(shapes, data);
        }
    }
    exports.ShapeGeometry = ShapeGeometry;
    function toJSON(shapes, data) {
        data.shapes = [];
        if (Array.isArray(shapes)) {
            for (let i = 0, l = shapes.length; i < l; i++) {
                const shape = shapes[i];
                data.shapes.push(shape.uuid);
            }
        }
        else {
            data.shapes.push(shapes.uuid);
        }
        return data;
    }
});
//# sourceMappingURL=ShapeGeometry.js.map