var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./view", "./input", "./util"], function (require, exports, view_1, input_1, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const mapSize = util_1.paramInt("size", 40);
    const zoom = util_1.paramFloat("zoom", 20);
    function init() {
        return __awaiter(this, void 0, void 0, function* () {
            const mapView = yield view_1.initView(mapSize, zoom);
            input_1.initInput(mapView);
        });
    }
    init();
});
//# sourceMappingURL=main.js.map