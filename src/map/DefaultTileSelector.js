define(["require", "exports", "three"], function (require, exports, three_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const selector = new three_1.Mesh(new three_1.RingBufferGeometry(0.85, 1, 6, 2), new three_1.MeshBasicMaterial({
        color: 0xffff00
    }));
    selector.rotateZ(Math.PI / 2);
    exports.default = selector;
});
//# sourceMappingURL=DefaultTileSelector.js.map