var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./scene.js"], function (require, exports, scene_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    scene_js_1 = __importDefault(scene_js_1);
    self.onmessage = function (message) {
        var data = message.data;
        scene_js_1.default(data.drawingSurface, data.width, data.height, data.pixelRatio, data.path);
    };
});
//# sourceMappingURL=offscreen.js.map