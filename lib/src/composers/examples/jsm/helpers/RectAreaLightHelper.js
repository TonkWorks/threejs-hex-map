define(["require", "exports", "../../../build/three.module.js"], function (require, exports, three_module_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     *  This helper must be added as a child of the light
     */
    function RectAreaLightHelper(light, color) {
        this.light = light;
        this.color = color; // optional hardwired color for the helper
        var positions = [1, 1, 0, -1, 1, 0, -1, -1, 0, 1, -1, 0, 1, 1, 0];
        var geometry = new three_module_js_1.BufferGeometry();
        geometry.setAttribute('position', new three_module_js_1.Float32BufferAttribute(positions, 3));
        geometry.computeBoundingSphere();
        var material = new three_module_js_1.LineBasicMaterial({ fog: false });
        three_module_js_1.Line.call(this, geometry, material);
        this.type = 'RectAreaLightHelper';
        //
        var positions2 = [1, 1, 0, -1, 1, 0, -1, -1, 0, 1, 1, 0, -1, -1, 0, 1, -1, 0];
        var geometry2 = new three_module_js_1.BufferGeometry();
        geometry2.setAttribute('position', new three_module_js_1.Float32BufferAttribute(positions2, 3));
        geometry2.computeBoundingSphere();
        this.add(new three_module_js_1.Mesh(geometry2, new three_module_js_1.MeshBasicMaterial({ side: three_module_js_1.BackSide, fog: false })));
        this.update();
    }
    exports.RectAreaLightHelper = RectAreaLightHelper;
    RectAreaLightHelper.prototype = Object.create(three_module_js_1.Line.prototype);
    RectAreaLightHelper.prototype.constructor = RectAreaLightHelper;
    RectAreaLightHelper.prototype.update = function () {
        this.scale.set(0.5 * this.light.width, 0.5 * this.light.height, 1);
        if (this.color !== undefined) {
            this.material.color.set(this.color);
            this.children[0].material.color.set(this.color);
        }
        else {
            this.material.color.copy(this.light.color).multiplyScalar(this.light.intensity);
            // prevent hue shift
            var c = this.material.color;
            var max = Math.max(c.r, c.g, c.b);
            if (max > 1)
                c.multiplyScalar(1 / max);
            this.children[0].material.color.copy(this.material.color);
        }
    };
    RectAreaLightHelper.prototype.dispose = function () {
        this.geometry.dispose();
        this.material.dispose();
        this.children[0].geometry.dispose();
        this.children[0].material.dispose();
    };
});
//# sourceMappingURL=RectAreaLightHelper.js.map