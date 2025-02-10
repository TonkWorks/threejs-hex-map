/**
 * Creates extruded geometry from a path shape.
 *
 * parameters = {
 *
 *  curveSegments: <int>, // number of points on the curves
 *  steps: <int>, // number of points for z-side extrusions / used for subdividing segments of extrude spline too
 *  depth: <float>, // Depth to extrude the shape
 *
 *  bevelEnabled: <bool>, // turn on bevel
 *  bevelThickness: <float>, // how deep into the original shape bevel goes
 *  bevelSize: <float>, // how far from shape outline (including bevelOffset) is bevel
 *  bevelOffset: <float>, // how far from shape outline does bevel start
 *  bevelSegments: <int>, // number of bevel layers
 *
 *  extrudePath: <THREE.Curve> // curve to extrude shape along
 *
 *  UVGenerator: <Object> // object that provides UV generator functions
 *
 * }
 */
define(["require", "exports", "../core/Geometry.js", "./ExtrudeBufferGeometry.js"], function (require, exports, Geometry_js_1, ExtrudeBufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ExtrudeGeometry extends Geometry_js_1.Geometry {
        constructor(shapes, options) {
            super();
            this.type = 'ExtrudeGeometry';
            this.parameters = {
                shapes: shapes,
                options: options
            };
            this.fromBufferGeometry(new ExtrudeBufferGeometry_js_1.ExtrudeBufferGeometry(shapes, options));
            this.mergeVertices();
        }
        toJSON() {
            const data = super.toJSON();
            const shapes = this.parameters.shapes;
            const options = this.parameters.options;
            return toJSON(shapes, options, data);
        }
    }
    exports.ExtrudeGeometry = ExtrudeGeometry;
    function toJSON(shapes, options, data) {
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
        if (options.extrudePath !== undefined)
            data.options.extrudePath = options.extrudePath.toJSON();
        return data;
    }
});
//# sourceMappingURL=ExtrudeGeometry.js.map