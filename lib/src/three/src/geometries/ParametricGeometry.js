/**
 * Parametric Surfaces Geometry
 * based on the brilliant article by @prideout https://prideout.net/blog/old/blog/index.html@p=44.html
 */
define(["require", "exports", "../core/Geometry.js", "./ParametricBufferGeometry.js"], function (require, exports, Geometry_js_1, ParametricBufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ParametricGeometry(func, slices, stacks) {
        Geometry_js_1.Geometry.call(this);
        this.type = 'ParametricGeometry';
        this.parameters = {
            func: func,
            slices: slices,
            stacks: stacks
        };
        this.fromBufferGeometry(new ParametricBufferGeometry_js_1.ParametricBufferGeometry(func, slices, stacks));
        this.mergeVertices();
    }
    exports.ParametricGeometry = ParametricGeometry;
    ParametricGeometry.prototype = Object.create(Geometry_js_1.Geometry.prototype);
    ParametricGeometry.prototype.constructor = ParametricGeometry;
});
//# sourceMappingURL=ParametricGeometry.js.map