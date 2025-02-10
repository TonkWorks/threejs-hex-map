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
define(["require", "exports", "../core/BufferGeometry.js", "./ExtrudeBufferGeometry.js"], function (require, exports, BufferGeometry_js_1, ExtrudeBufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TextBufferGeometry extends ExtrudeBufferGeometry_js_1.ExtrudeBufferGeometry {
        constructor(text, parameters) {
            parameters = parameters || {};
            const font = parameters.font;
            if (!(font && font.isFont)) {
                console.error('THREE.TextGeometry: font parameter is not an instance of THREE.Font.');
                return new BufferGeometry_js_1.BufferGeometry();
            }
            const shapes = font.generateShapes(text, parameters.size);
            // translate parameters to ExtrudeGeometry API
            parameters.depth = parameters.height !== undefined ? parameters.height : 50;
            // defaults
            if (parameters.bevelThickness === undefined)
                parameters.bevelThickness = 10;
            if (parameters.bevelSize === undefined)
                parameters.bevelSize = 8;
            if (parameters.bevelEnabled === undefined)
                parameters.bevelEnabled = false;
            super(shapes, parameters);
            this.type = 'TextBufferGeometry';
        }
    }
    exports.TextBufferGeometry = TextBufferGeometry;
});
//# sourceMappingURL=TextBufferGeometry.js.map