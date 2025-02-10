/**
 * Text = 3D Text
 *
 * parameters = {
 *  font: <THREE.Font>, // font
 *
 *  size: <float>, // size of the text
 *  height: <float>, // thickness to extrude text
 *  curveSegments: <int>, // number of points on the curves
 *
 *  bevelEnabled: <bool>, // turn on bevel
 *  bevelThickness: <float>, // how deep into text bevel goes
 *  bevelSize: <float>, // how far from text outline (including bevelOffset) is bevel
 *  bevelOffset: <float> // how far from text outline does bevel start
 * }
 */
define(["require", "exports", "../core/Geometry.js", "./TextBufferGeometry.js"], function (require, exports, Geometry_js_1, TextBufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TextGeometry extends Geometry_js_1.Geometry {
        constructor(text, parameters) {
            super();
            this.type = 'TextGeometry';
            this.parameters = {
                text: text,
                parameters: parameters
            };
            this.fromBufferGeometry(new TextBufferGeometry_js_1.TextBufferGeometry(text, parameters));
            this.mergeVertices();
        }
    }
    exports.TextGeometry = TextGeometry;
});
//# sourceMappingURL=TextGeometry.js.map