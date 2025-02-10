define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = `
#ifdef USE_FOG

	fogDepth = - mvPosition.z;

#endif
`;
});
//# sourceMappingURL=fog_vertex.glsl.js.map